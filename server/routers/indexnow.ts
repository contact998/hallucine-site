import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { submitToIndexNow, submitSingleUrl } from "../indexnow";

export const indexnowRouter = router({
  /** Soumet toutes les pages publiques à IndexNow (Bing, Yandex, DuckDuckGo) */
  submitAll: adminProcedure.mutation(async () => {
    return submitToIndexNow();
  }),

  /** Soumet une URL spécifique */
  submitUrl: adminProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input }) => {
      const success = await submitSingleUrl(input.url);
      return { success, url: input.url };
    }),
});
