import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../_core/trpc";
import { chatWithAssistant } from "../chatbot";

// ─── Rate-limit mémoire par IP (le chatbot est public) ──────────────────────
// Fenêtre glissante simple ; suffisant pour un endpoint conversationnel.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Garde-fou mémoire : purge des IP inactives si la map gonfle.
  if (hits.size > 5000) {
    hits.forEach((v, k) => {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    });
  }
  return recent.length > MAX_PER_WINDOW;
}

export const chatbotRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        messages: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().min(1).max(4000),
            })
          )
          .min(1)
          .max(40),
        lang: z.enum(["fr", "en", "de", "es"]).optional().default("fr"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const ip = ctx.req.ip ?? ctx.req.socket?.remoteAddress ?? "unknown";
      if (isRateLimited(ip)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Trop de messages, patientez une minute.",
        });
      }
      const response = await chatWithAssistant(input.messages, input.lang);
      return { response };
    }),
});
