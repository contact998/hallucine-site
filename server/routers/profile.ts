import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getSubmissionsByUserId,
  getSubmissionsByEmail,
  cancelSubmission,
  updateUserTimezone,
  getUserTimezone,
} from "../db";
import { COMMON_TIMEZONES } from "../businessHours";

export const profileRouter = router({
  mySubmissions: protectedProcedure.query(async ({ ctx }) => {
    const byUserId = await getSubmissionsByUserId(ctx.user.id);
    if (byUserId.length > 0) {
      return byUserId;
    }
    if (ctx.user.email) {
      return getSubmissionsByEmail(ctx.user.email);
    }
    return [];
  }),

  cancelSubmission: protectedProcedure
    .input(z.object({ submissionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await cancelSubmission(input.submissionId, ctx.user.id);
      return { success: true };
    }),

  /** Récupérer le fuseau horaire de l'utilisateur connecté */
  getTimezone: protectedProcedure.query(async ({ ctx }) => {
    const tz = await getUserTimezone(ctx.user.id);
    return { timezone: tz, timezones: COMMON_TIMEZONES };
  }),

  /** Mettre à jour le fuseau horaire de l'utilisateur connecté */
  updateTimezone: protectedProcedure
    .input(z.object({ timezone: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      await updateUserTimezone(ctx.user.id, input.timezone);
      return { success: true, timezone: input.timezone };
    }),
});
