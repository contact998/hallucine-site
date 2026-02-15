import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { insertContactSubmission, getSubmissionsByUserId, getSubmissionsByEmail, cancelSubmission } from "./db";
import { notifyOwner } from "./_core/notification";

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
        // Sauvegarder en base de données avec userId si connecté
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

        // Notifier le propriétaire
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

        return { success: true };
      }),
  }),

  profile: router({
    /** Récupérer les devis de l'utilisateur connecté */
    mySubmissions: protectedProcedure.query(async ({ ctx }) => {
      // Chercher par userId d'abord, puis par email pour les soumissions faites avant connexion
      const byUserId = await getSubmissionsByUserId(ctx.user.id);
      
      if (byUserId.length > 0) {
        return byUserId;
      }
      
      // Fallback: chercher par email pour les soumissions anonymes
      if (ctx.user.email) {
        return getSubmissionsByEmail(ctx.user.email);
      }
      
      return [];
    }),

    /** Annuler une demande */
    cancelSubmission: protectedProcedure
      .input(z.object({ submissionId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await cancelSubmission(input.submissionId, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
