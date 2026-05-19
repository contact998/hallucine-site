import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { chatWithAssistant } from "../chatbot";

export const chatbotRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
        lang: z.enum(["fr", "en", "de", "es"]).optional().default("fr"),
      })
    )
    .mutation(async ({ input }) => {
      const response = await chatWithAssistant(input.messages, input.lang);
      return { response };
    }),
});
