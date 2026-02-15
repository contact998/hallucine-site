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
import { prepareAdminEmailNotification } from "./emailNotification";
import {
  trackPageView,
  trackEvent,
  getAnalyticsOverview,
  getTopPages,
  getTrafficSources,
  getDeviceBreakdown,
  getDailyPageViews,
  getTopEvents,
  getTopReferrers,
} from "./analytics";
import {
  getBusinessHoursConfig,
  updateBusinessHoursSetting,
  isCurrentlyAvailable,
  COMMON_TIMEZONES,
} from "./businessHours";
import { invokeLLM } from "./_core/llm";
import { executeWeeklyAudit, formatAuditEmail } from "./weeklyAudit";

/** Helper pour obtenir l'offset UTC d'un fuseau horaire en minutes */
function getTimezoneOffset(tz: string, date: Date): number {
  const utcStr = date.toLocaleString("en-US", { timeZone: "UTC" });
  const tzStr = date.toLocaleString("en-US", { timeZone: tz });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
}

// File d'attente des notifications email en attente d'envoi via Gmail
const pendingEmailNotifications: Array<{
  to: string[];
  subject: string;
  content: string;
  aiAnalysis: string;
}> = [];

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
    abandonPartial: publicProcedure
      .input(
        z.object({
          email: z.string().email("Email invalide"),
          prenom: z.string().optional(),
          nom: z.string().optional(),
          entreprise: z.string().optional(),
          telephone: z.string().optional(),
          product: z.string().optional(),
          productDetail: z.string().optional(),
          country: z.string().optional(),
          city: z.string().optional(),
          lastStep: z.number(),
          totalSteps: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const fullName = [input.prenom, input.nom].filter(Boolean).join(" ") || "Inconnu";
        const progress = Math.round((input.lastStep / input.totalSteps) * 100);

        console.log(`[Abandon] Formulaire abandonne par ${input.email} a l'etape ${input.lastStep}/${input.totalSteps} (${progress}%)`);

        // Notification Manus (canal principal)
        await notifyOwner({
          title: `Abandon formulaire - ${input.email}`,
          content: [
            `**Abandon detecte** a l'etape ${input.lastStep}/${input.totalSteps} (${progress}% complete)`,
            `**Email:** ${input.email}`,
            input.prenom || input.nom ? `**Nom:** ${fullName}` : null,
            input.entreprise ? `**Entreprise:** ${input.entreprise}` : null,
            input.telephone ? `**Telephone:** ${input.telephone}` : null,
            input.product ? `**Produit:** ${input.product}` : null,
            input.productDetail ? `**Detail:** ${input.productDetail}` : null,
            input.country || input.city ? `**Lieu:** ${[input.city, input.country].filter(Boolean).join(", ")}` : null,
            "",
            "Ce prospect a commence le formulaire mais ne l'a pas termine.",
            "Action recommandee : envoyer un email de relance personnalise.",
          ].filter(Boolean).join("\n"),
        });

        // Synchroniser avec le CRM comme prospect partiel
        try {
          await syncSubmissionToCrm({
            type: "devis",
            nom: fullName,
            email: input.email,
            telephone: input.telephone || null,
            entreprise: input.entreprise || null,
            produit: input.product || null,
            message: `[ABANDON etape ${input.lastStep}/${input.totalSteps}] ${input.productDetail || ""}`,
            objectif: null,
            sujet: input.product ? `${input.product} (abandon ${progress}%)` : `Abandon formulaire (${progress}%)`,
          });
        } catch (err) {
          console.warn("[Abandon] Erreur sync CRM:", err);
        }

        return { success: true };
      }),

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

        // Notification Manus (canal principal instantané)
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

        // Notification email enrichie par IA (envoi asynchrone, ne bloque pas la réponse)
        prepareAdminEmailNotification(input)
          .then(emailData => {
            // Stocker pour envoi via le endpoint dédié
            pendingEmailNotifications.push(emailData);
            console.log(`[Email] Notification email préparée pour ${input.nom} — Analyse IA incluse`);
          })
          .catch(err => console.warn("[Email] Erreur préparation email:", err));

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

  analytics: router({
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
  }),

  businessHours: router({
    /** Récupérer les heures de présence et le statut en ligne (public) */
    getStatus: publicProcedure.query(async () => {
      const config = await getBusinessHoursConfig();
      const available = isCurrentlyAvailable(config);
      return {
        timezone: config.timezone,
        startTime: config.startTime,
        endTime: config.endTime,
        workDays: config.workDays,
        isAvailable: available,
      };
    }),

    /** Récupérer la config complète + liste des fuseaux horaires (admin) */
    getConfig: adminProcedure.query(async () => {
      const config = await getBusinessHoursConfig();
      return { config, timezones: COMMON_TIMEZONES };
    }),

    /** Mettre à jour le fuseau horaire (admin) */
    updateTimezone: adminProcedure
      .input(z.object({ timezone: z.string() }))
      .mutation(async ({ input }) => {
        await updateBusinessHoursSetting("business_timezone", JSON.stringify(input.timezone));
        return { success: true };
      }),

    /** Mettre à jour les heures de présence (admin) */
    updateHours: adminProcedure
      .input(z.object({ startTime: z.string(), endTime: z.string() }))
      .mutation(async ({ input }) => {
        await updateBusinessHoursSetting("business_hours_start", JSON.stringify(input.startTime));
        await updateBusinessHoursSetting("business_hours_end", JSON.stringify(input.endTime));
        return { success: true };
      }),

    /** Mettre à jour les jours de travail (admin) */
    updateWorkDays: adminProcedure
      .input(z.object({ workDays: z.array(z.number().min(1).max(7)) }))
      .mutation(async ({ input }) => {
        await updateBusinessHoursSetting("business_days", JSON.stringify(input.workDays));
        return { success: true };
      }),

    /** IA génère un message WhatsApp adapté selon la disponibilité et le fuseau du visiteur */
    getSmartMessage: publicProcedure
      .input(z.object({ visitorTimezone: z.string().optional() }))
      .query(async ({ input }) => {
        const config = await getBusinessHoursConfig();
        const available = isCurrentlyAvailable(config);
        const visitorTz = input.visitorTimezone || "Europe/Paris";

        // Calculer les heures dans le fuseau du visiteur
        const now = new Date();
        const startToday = new Date(now);
        const [sH, sM] = config.startTime.split(":").map(Number);
        const [eH, eM] = config.endTime.split(":").map(Number);

        // Formater les heures dans le fuseau du visiteur
        const formatInVisitorTz = (hour: number, minute: number) => {
          // Créer une date dans le fuseau business
          const dateStr = now.toLocaleDateString("en-CA", { timeZone: config.timezone });
          const bizDate = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
          // Ajuster pour le décalage entre les fuseaux
          const bizOffset = getTimezoneOffset(config.timezone, now);
          const visitorOffset = getTimezoneOffset(visitorTz, now);
          const diffMs = (visitorOffset - bizOffset) * 60000;
          const visitorDate = new Date(bizDate.getTime() + diffMs);
          return visitorDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: visitorTz });
        };

        let visitorStart: string;
        let visitorEnd: string;
        try {
          visitorStart = formatInVisitorTz(sH, sM);
          visitorEnd = formatInVisitorTz(eH, eM);
        } catch {
          visitorStart = config.startTime;
          visitorEnd = config.endTime;
        }

        return {
          isAvailable: available,
          businessTimezone: config.timezone,
          visitorTimezone: visitorTz,
          hoursInVisitorTz: { start: visitorStart, end: visitorEnd },
          hoursInBusinessTz: { start: config.startTime, end: config.endTime },
          message: available
            ? `Nous sommes en ligne ! Réponse immédiate.`
            : `Hors ligne. Nos horaires : ${visitorStart} - ${visitorEnd} (votre heure). Laissez un message, nous répondrons dès notre retour.`,
        };
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

    /** Récupérer les notifications email en attente */
    pendingEmails: adminProcedure.query(async () => {
      return {
        count: pendingEmailNotifications.length,
        emails: pendingEmailNotifications.map(e => ({
          to: e.to,
          subject: e.subject,
          content: e.content,
          aiAnalysis: e.aiAnalysis,
        })),
      };
    }),

    /** Marquer les emails comme envoyés (vider la file) */
    clearPendingEmails: adminProcedure.mutation(async () => {
      const count = pendingEmailNotifications.length;
      pendingEmailNotifications.length = 0;
      return { cleared: count };
    }),

    /** Dashboard analytics complet */
    analyticsOverview: adminProcedure
      .input(z.object({ daysBack: z.number().min(1).max(365).default(30) }).optional())
      .query(async ({ input }) => {
        const days = input?.daysBack ?? 30;
        const [overview, topPages, trafficSources, devices, dailyViews, topEvents, topReferrers] = await Promise.all([
          getAnalyticsOverview(days),
          getTopPages(days),
          getTrafficSources(days),
          getDeviceBreakdown(days),
          getDailyPageViews(days),
          getTopEvents(days),
          getTopReferrers(days),
        ]);
        return { overview, topPages, trafficSources, devices, dailyViews, topEvents, topReferrers };
      }),

    /** Supprimer une soumission */
    deleteSubmission: adminProcedure
      .input(z.object({ submissionId: z.number() }))
      .mutation(async ({ input }) => {
        await deleteSubmission(input.submissionId);
        return { success: true };
      }),

    /** IA analyse les analytics et génère des recommandations pour améliorer la conversion */
    aiInsights: adminProcedure
      .input(z.object({ daysBack: z.number().min(1).max(365).default(30) }).optional())
      .query(async ({ input }) => {
        const days = input?.daysBack ?? 30;
        const [overview, topPages, trafficSources, topEvents, stats] = await Promise.all([
          getAnalyticsOverview(days),
          getTopPages(days, 10),
          getTrafficSources(days),
          getTopEvents(days, 10),
          getSubmissionStats(),
        ]);

        const prompt = `Tu es un expert en marketing digital et conversion pour Hallucine, fabricant français d'écrans de cinéma gonflables.
L'objectif ULTIME du site est la CAPTURE DE COORDONNÉES (demandes de devis, contacts, leads).

Voici les données analytics des ${days} derniers jours :
- Pages vues : ${overview?.totalPageViews ?? 0}
- Visiteurs uniques : ${overview?.uniqueVisitors ?? 0}
- Durée moyenne : ${overview?.avgDuration ?? 0}s
- Événements : ${overview?.totalEvents ?? 0}
- Demandes reçues : ${stats.total} (${stats.devis} devis, ${stats.contact} contacts, ${stats.distributeur} distributeurs)
- Taux conversion estimé : ${overview?.uniqueVisitors ? ((stats.total / overview.uniqueVisitors) * 100).toFixed(1) : 0}%
- Pages les plus visitées : ${topPages.map(p => p.path + " (" + p.views + " vues)").join(", ")}
- Sources de trafic : ${trafficSources.map(s => (s.source ?? "direct") + " (" + s.views + ")").join(", ")}
- Événements fréquents : ${topEvents.map(e => e.eventType + " (" + e.count + ")").join(", ")}

Génère 5 recommandations concrètes et actionables pour AMÉLIORER LE TAUX DE CONVERSION (capture de coordonnées).
Chaque recommandation doit avoir : un titre court, une description détaillée, et une priorité (haute/moyenne/basse).
Réponds en JSON : { "recommendations": [{ "title": "...", "description": "...", "priority": "haute|moyenne|basse" }], "summary": "...", "conversionRate": "..." }`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: "Tu es un expert en marketing digital et optimisation de conversion. Réponds uniquement en JSON valide." },
              { role: "user", content: prompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "ai_insights",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    recommendations: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          description: { type: "string" },
                          priority: { type: "string", enum: ["haute", "moyenne", "basse"] },
                        },
                        required: ["title", "description", "priority"],
                        additionalProperties: false,
                      },
                    },
                    summary: { type: "string" },
                    conversionRate: { type: "string" },
                  },
                  required: ["recommendations", "summary", "conversionRate"],
                  additionalProperties: false,
                },
              },
            },
          });
          const rawContent = response.choices?.[0]?.message?.content;
          const content = typeof rawContent === "string" ? rawContent : "";
          return content ? JSON.parse(content) : { recommendations: [], summary: "Analyse indisponible", conversionRate: "N/A" };
        } catch (err) {
          console.error("[AI Insights] Erreur:", err);
          return { recommendations: [], summary: "Erreur lors de l'analyse IA", conversionRate: "N/A" };
        }
      }),
  }),

  // ─── Audit IA hebdomadaire ──────────────────────────────────────
  audit: router({
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
      };
    }),

    /** Récupérer le dernier rapport d'audit (si disponible en mémoire) */
    getLastReport: adminProcedure.query(async () => {
      // On déclenche un audit frais pour afficher les données
      const result = await executeWeeklyAudit();
      if (!result.success) {
        return { success: false, error: result.error };
      }
      return {
        success: true,
        report: result.report,
        email: result.email,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
