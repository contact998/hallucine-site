/**
 * Client LLM du site — DÉLÈGUE au hub IA du CRM (gateway POST /api/llm/invoke).
 *
 * Le site n'a AUCUNE clé provider et ne choisit PAS le modèle : il déclare un
 * `usage` ("chatbot" = public/court, "audit" = interne/analytique) et le CRM
 * résout le provider (MiniMax / Ollama / Anthropic) via LLM_PROVIDER_* + fallback.
 *
 * Pour changer d'IA : une variable d'env côté CRM. Rien à toucher ici.
 * Le site ne porte plus aucune clé MiniMax/Anthropic.
 */

export type Role = "system" | "user" | "assistant";

export type Message = {
  role: Role;
  content: string;
};

export type LlmUsage = "chatbot" | "audit";

export type InvokeParams = {
  usage: LlmUsage;
  messages: Message[];
  maxTokens?: number;
  response_format?: Record<string, unknown>;
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: Role; content: string };
    finish_reason: string | null;
  }>;
};

// Hub CRM — même service que les autres routes publiques déjà consommées par le
// site (cf. availabilityService). Override possible via CRM_BASE_URL.
const CRM_BASE_URL = (
  process.env.CRM_BASE_URL ?? "https://hallucine-crm-production-4bcc.up.railway.app"
).replace(/\/+$/, "");
const CRM_LLM_URL = `${CRM_BASE_URL}/api/llm/invoke`;

// Timeout côté site, par usage — légèrement > timeout par tentative du CRM, pour
// laisser la gateway répondre (succès, fallback éventuel ou 502) avant qu'on coupe.
const USAGE_TIMEOUT_MS: Record<LlmUsage, number> = {
  chatbot: 20_000,
  audit: 130_000,
};

/**
 * Appelle la gateway LLM du CRM. Lève en cas d'absence de secret, d'erreur
 * réseau / HTTP / timeout : chaque appelant gère sa propre dégradation (message
 * de repli). On ne renvoie JAMAIS un faux contenu en cas d'échec.
 */
export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const secret = process.env.SITE_LLM_SECRET;
  if (!secret) {
    throw new Error("SITE_LLM_SECRET is not configured");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), USAGE_TIMEOUT_MS[params.usage]);

  try {
    const response = await fetch(CRM_LLM_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        usage: params.usage,
        messages: params.messages,
        maxTokens: params.maxTokens,
        responseFormat: params.response_format,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`CRM LLM gateway ${response.status}: ${errText.slice(0, 300)}`);
    }

    return (await response.json()) as InvokeResult;
  } finally {
    clearTimeout(timer);
  }
}
