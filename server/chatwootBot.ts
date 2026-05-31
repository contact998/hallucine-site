/**
 * Chatwoot Agent Bot bridge
 * Le widget Chatwoot du site reçoit les messages des visiteurs.
 * Chatwoot envoie chaque nouveau message à ce webhook.
 * On call le LLM Hallucine (chatWithAssistant) et on poste la réponse
 * dans la conversation Chatwoot. L'historique reste centralisé dans
 * chat.hallucine.fr — un humain peut reprendre la main à tout moment.
 */
import type { Request, Response } from "express";
import { chatWithAssistant } from "./chatbot";

const CHATWOOT_BASE = process.env.CHATWOOT_BASE_URL || "https://chat.hallucine.fr";
const BOT_TOKEN = process.env.CHATWOOT_BOT_TOKEN || "";
const ACCOUNT_ID = process.env.CHATWOOT_ACCOUNT_ID || "1";

interface ChatwootMessage {
  id?: number;
  content?: string | null;
  message_type?: number | string;
  private?: boolean;
  sender?: { type?: string };
}

interface ChatwootWebhookPayload {
  event?: string;
  message_type?: string;
  content?: string;
  conversation?: {
    id?: number;
    messages?: ChatwootMessage[];
  };
  sender?: { type?: string };
}

function normalizeMessageType(m: ChatwootMessage): "incoming" | "outgoing" | "template" | "activity" | "unknown" {
  const t = m.message_type;
  if (typeof t === "string") return (t as "incoming" | "outgoing" | "template" | "activity") || "unknown";
  if (t === 0) return "incoming";
  if (t === 1) return "outgoing";
  if (t === 2) return "activity";
  if (t === 3) return "template";
  return "unknown";
}

export async function handleChatwootWebhook(req: Request, res: Response): Promise<void> {
  // Ack fast — Chatwoot times out webhooks at 5s
  res.status(200).json({ ok: true });

  try {
    if (!BOT_TOKEN) {
      console.error("[chatwoot-bot] CHATWOOT_BOT_TOKEN not set");
      return;
    }

    const payload = req.body as ChatwootWebhookPayload;
    if (payload?.event !== "message_created") return;
    // Only react to visitor messages, not our own bot replies / agent replies
    if (payload.message_type !== "incoming") return;
    const convId = payload.conversation?.id;
    if (!convId) return;

    // Build full history from the conversation payload
    const history: { role: "user" | "assistant"; content: string }[] = (payload.conversation?.messages || [])
      .filter((m) => !m.private)
      .map((m) => {
        const t = normalizeMessageType(m);
        return {
          role: (t === "incoming" ? "user" : "assistant") as "user" | "assistant",
          content: (m.content || "").trim(),
          keep: t === "incoming" || t === "outgoing" || t === "template",
        };
      })
      .filter((m) => m.keep && m.content.length > 0)
      .map((m) => ({ role: m.role, content: m.content }));

    if (history.length === 0) return;

    const reply = await chatWithAssistant(history, "fr");
    const cleaned = reply.replace(/<!--LEAD_DATA:.*?-->/g, "").trim();
    if (!cleaned) return;

    const url = `${CHATWOOT_BASE}/api/v1/accounts/${ACCOUNT_ID}/conversations/${convId}/messages`;
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_access_token: BOT_TOKEN,
      },
      body: JSON.stringify({
        content: cleaned,
        message_type: "outgoing",
      }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.error("[chatwoot-bot] post message failed", r.status, txt);
    }
  } catch (err) {
    console.error("[chatwoot-bot] error", err);
  }
}
