import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { generateBrochure } from "../brochure";

export const brochureRouter = router({
  generate: publicProcedure
    .input(
      z.object({
        productSlug: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = generateBrochure(input.productSlug);
      return result;
    }),
});
