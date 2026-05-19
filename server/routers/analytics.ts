import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { trackPageView, trackEvent } from "../analytics";

export const analyticsRouter = router({
  /** Tracker une page vue (appelé par le pixel frontend) */
  trackPageView: publicProcedure
    .input(
      z.object({
        path: z.string(),
        pageTitle: z.string().optional(),
        referrer: z.string().optional(),
        sessionId: z.string().optional(),
        duration: z.number().optional(),
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await trackPageView({
        ...input,
        userAgent: ctx.req.headers["user-agent"] ?? undefined,
        userId: ctx.user?.id ?? undefined,
      });
      return { success: true };
    }),

  /** Tracker un événement (clic CTA, téléchargement, etc.) */
  trackEvent: publicProcedure
    .input(
      z.object({
        eventType: z.string(),
        eventData: z.string().optional(),
        path: z.string().optional(),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await trackEvent({
        ...input,
        userId: ctx.user?.id ?? undefined,
      });
      return { success: true };
    }),
});
