import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  executeWeeklyAudit,
  getAuditHistoryList,
  getAuditHistoryById,
  getWeekOverWeekComparison,
} from "../weeklyAudit";

export const auditRouter = router({
  /** Déclencher manuellement un audit IA (admin only) */
  runNow: adminProcedure.mutation(async () => {
    const result = await executeWeeklyAudit();
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return {
      success: true,
      report: result.report,
      email: result.email,
      auditId: result.auditId,
    };
  }),

  /** Récupérer l'historique des audits (admin only) */
  history: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(52) }).optional())
    .query(async ({ input }) => {
      const limit = input?.limit ?? 52;
      return getAuditHistoryList(limit);
    }),

  /** Récupérer un audit complet par ID (admin only) */
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const audit = await getAuditHistoryById(input.id);
      if (!audit) {
        throw new Error("Audit introuvable");
      }
      return audit;
    }),

  /** Comparaison semaine N vs N-1 (admin only) */
  comparison: adminProcedure.query(async () => {
    return getWeekOverWeekComparison();
  }),
});
