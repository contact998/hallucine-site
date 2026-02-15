import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  insertContactSubmission,
  getSubmissionsByUserId,
  getSubmissionsByEmail,
  cancelSubmission,
  getAllSubmissions,
  updateSubmissionStatus,
  updateAdminNote,
  deleteSubmission,
  getSubmissionStats,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { chatWithAssistant } from "./chatbot";
import { generateBrochure } from "./brochure";
import { syncSubmissionToCrm, isCrmSyncConfigured } from "./crmSync";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          type: z.enum(["contact", "devis", "distributeur"]),
          nom: z.string().min(1, "Le nom est requis"),
          email: z.string().email("Email invalide"),
          telephone: z.string().optional(),
          entreprise: z.string().optional(),
          sujet: z.string().optional(),
          message: z.string().optional(),
          produit: z.string().optional(),
          objectif: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await insertContactSubmission({
          type: input.type,
          nom: input.nom,
          email: input.email,
          telephone: input.telephone ?? null,
          entreprise: input.entreprise ?? null,
          sujet: input.sujet ?? null,
          message: input.message ?? null,
          produit: input.produit ?? null,
          objectif: input.objectif ?? null,
          userId: ctx.user?.id ?? null,
          status: "en_attente",
        });

        const typeLabel = input.type === "contact" ? "Contact" : input.type === "devis" ? "Demande de devis" : "Demande distributeur";
        await notifyOwner({
          title: `Nouveau ${typeLabel} de ${input.nom}`,
          content: [
            `**Type:** ${typeLabel}`,
            `**Nom:** ${input.nom}`,
            `**Email:** ${input.email}`,
            input.telephone ? `**Téléphone:** ${input.telephone}` : null,
            input.entreprise ? `**Entreprise:** ${input.entreprise}` : null,
            input.produit ? `**Produit:** ${input.produit}` : null,
            input.objectif ? `**Objectif:** ${input.objectif}` : null,
            input.sujet ? `**Sujet:** ${input.sujet}` : null,
            input.message ? `**Message:** ${input.message}` : null,
          ].filter(Boolean).join("\n"),
        });

        // Synchronisation automatique avec le CRM Hallucine
        let crmSync: { success: boolean; error?: string } = { success: false, error: "not configured" };
        try {
          crmSync = await syncSubmissionToCrm(input);
          if (crmSync.success) {
            console.log(`[CRM] Prospect syncé pour ${input.nom}`);
          } else {
            console.warn(`[CRM] Sync échouée pour ${input.nom}: ${crmSync.error}`);
          }
        } catch (err) {
          console.error(`[CRM] Erreur sync pour ${input.nom}:`, err);
        }

        return { success: true, crmSynced: crmSync.success };
      }),
  }),

  profile: router({
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
  }),

  brochure: router({
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
  }),

  chatbot: router({
    chat: publicProcedure
      .input(
        z.object({
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        const response = await chatWithAssistant(input.messages);
        return { response };
      }),
  }),

  admin: router({
    /** Récupérer toutes les soumissions (admin uniquement) */
    allSubmissions: adminProcedure.query(async () => {
      return getAllSubmissions(500);
    }),

    /** Obtenir les statistiques des soumissions */
    stats: adminProcedure.query(async () => {
      return getSubmissionStats();
    }),

    /** Mettre à jour le statut d'une soumission */
    updateStatus: adminProcedure
      .input(z.object({
        submissionId: z.number(),
        status: z.enum(["en_attente", "en_cours", "traite", "annule"]),
      }))
      .mutation(async ({ input }) => {
        await updateSubmissionStatus(input.submissionId, input.status);
        return { success: true };
      }),

    /** Mettre à jour la note admin */
    updateNote: adminProcedure
      .input(z.object({
        submissionId: z.number(),
        note: z.string(),
      }))
      .mutation(async ({ input }) => {
        await updateAdminNote(input.submissionId, input.note);
        return { success: true };
      }),

    /** Vérifier le statut de la synchronisation CRM */
    crmStatus: adminProcedure.query(async () => {
      return {
        configured: isCrmSyncConfigured(),
        webhookUrl: process.env.CRM_WEBHOOK_URL ? "Configuré" : "Non configuré",
        webhookToken: process.env.CRM_WEBHOOK_TOKEN ? "Configuré" : "Non configuré",
      };
    }),

    /** Envoyer manuellement une soumission au CRM */
    syncToCrm: adminProcedure
      .input(z.object({ submissionId: z.number() }))
      .mutation(async ({ input }) => {
        const allSubs = await getAllSubmissions(500);
        const submission = allSubs.find(s => s.id === input.submissionId);
        if (!submission) throw new Error("Soumission introuvable");

        const result = await syncSubmissionToCrm({
          type: submission.type,
          nom: submission.nom,
          email: submission.email,
          telephone: submission.telephone,
          entreprise: submission.entreprise,
          produit: submission.produit,
          message: submission.message,
          objectif: submission.objectif,
          sujet: submission.sujet,
        });

        return result;
      }),

    /** Supprimer une soumission */
    deleteSubmission: adminProcedure
      .input(z.object({ submissionId: z.number() }))
      .mutation(async ({ input }) => {
        await deleteSubmission(input.submissionId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
