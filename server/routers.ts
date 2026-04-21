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
  updateUserTimezone,
  getUserTimezone,
} from "./db";
import { chatWithAssistant } from "./chatbot";
import { generateBrochure } from "./brochure";
import { sendProspectToCrm, isCrmWebhookConfigured } from "./crmWebhook";
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
import {
  executeWeeklyAudit,
  formatAuditEmail,
  getAuditHistoryList,
  getAuditHistoryById,
  getWeekOverWeekComparison,
} from "./weeklyAudit";
import { getAvailability } from "./availabilityService";
import { submitToIndexNow, submitSingleUrl } from "./indexnow";
import { computeSpamScore } from "./antispam";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostBySlug,
  getBlogPostById,
  getPublishedPosts,
  getAllBlogPosts,
  publishBlogPost,
  countPublishedPosts,
  translateAndPublishPost,
} from "./blog";

// ─── Anti-spam : Rate limiting en mémoire ───
const rateLimitMap = new Map<string, number[]>();

/** Helper pour obtenir l'offset UTC d'un fuseau horaire en minutes */
function getTimezoneOffset(tz: string, date: Date): number {
  const utcStr = date.toLocaleString("en-US", { timeZone: "UTC" });
  const tzStr = date.toLocaleString("en-US", { timeZone: tz });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
}


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

        // Envoi au CRM via webhook (prospect partiel / abandon)
        let crmOk = false;
        if (isCrmWebhookConfigured()) {
          try {
            const result = await sendProspectToCrm({
              entreprise: input.entreprise || `Particulier - ${fullName}`,
              personne: input.nom || null,
              prenom: input.prenom || null,
              email: input.email,
              telephone: input.telephone || null,
              ville: input.city || null,
              pays: input.country || null,
              produit: input.product || null,
              notes: [
                "Source : formulaire site web hallucine.fr",
                `[ABANDON étape ${input.lastStep}/${input.totalSteps} - ${progress}%]`,
                input.productDetail ? `Détail : ${input.productDetail}` : null,
              ].filter(Boolean).join("\n"),
              abandonPartiel: true,
            });
            crmOk = result.success;
            if (result.success) {
              console.log(`[Abandon] Prospect partiel envoyé au CRM (id: ${result.prospectId}) pour ${input.email}`);
            }
          } catch (err) {
            console.warn("[Abandon] Erreur webhook CRM:", err);
          }
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
          // Anti-spam
          _hp: z.string().optional(),  // Honeypot
          _ts: z.number().optional(),  // Timestamp d'ouverture du formulaire
          _powChallenge: z.string().optional(), // Proof of Work challenge
          _powNonce: z.number().optional(),     // Proof of Work nonce
        })
      )
      .mutation(async ({ input, ctx }) => {
        // ─── Anti-spam : Score de confiance composite ───
        const clientIp = ctx.req.ip || ctx.req.headers["x-forwarded-for"] as string || "unknown";
        const spamResult = await computeSpamScore({
          honeypot: input._hp,
          timestamp: input._ts,
          ip: clientIp,
          email: input.email,
          powChallenge: input._powChallenge,
          powNonce: input._powNonce,
        });

        if (spamResult.blocked) {
          console.log(`[Anti-spam] BLOQUÉ (score=${spamResult.score}) pour ${input.email} — ${spamResult.reasons.join(", ")}`);
          // Rejet silencieux : le bot pense que ça a marché
          return { success: true, crmSynced: false };
        }

        if (spamResult.score < 70) {
          console.log(`[Anti-spam] SUSPECT (score=${spamResult.score}) pour ${input.email} — ${spamResult.reasons.join(", ")}`);
        }

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

        // Le CRM gère les notifications, emails et relances
        // Le site ne fait que transmettre les données via webhook

        // ─── Envoi au CRM via webhook ───
        let crmSync: { success: boolean; error?: string } = { success: false, error: "not configured" };

        // Extraire prénom/nom depuis input.nom ("Prénom Nom")
        const nameParts = input.nom.split(" ");
        const prospectPrenom = nameParts[0] || null;
        const prospectNom = nameParts.slice(1).join(" ") || null;

        // Extraire ville/codePostal/pays depuis input.sujet ("Produit -- Ville, CodePostal, Pays")
        let prospectVille: string | null = null;
        let prospectCodePostal: string | null = null;
        let prospectPays: string | null = null;
        if (input.sujet) {
          const locationPart = input.sujet.split(" -- ")[1];
          if (locationPart) {
            const parts = locationPart.split(", ").map(s => s.trim());
            prospectVille = parts[0] || null;
            prospectCodePostal = parts[1] || null;
            prospectPays = parts[2] || null;
          }
        }

        if (isCrmWebhookConfigured()) {
          try {
            const result = await sendProspectToCrm({
              entreprise: input.entreprise || `Particulier - ${input.nom}`,
              personne: prospectNom,
              prenom: prospectPrenom,
              email: input.email,
              telephone: input.telephone || null,
              ville: prospectVille,
              codePostal: prospectCodePostal,
              pays: prospectPays,
              produit: input.produit || null,
              contactType: "mail",
              notes: [
                "Source : formulaire site web hallucine.fr",
                input.message ? `Message : ${input.message}` : null,
                input.objectif ? `Objectif : ${input.objectif}` : null,
              ].filter(Boolean).join("\n"),
            });
            crmSync = result;
            if (result.success) {
              console.log(`[CRM Webhook] Prospect créé (id: ${result.prospectId}) pour ${input.nom}`);
            } else {
              console.warn(`[CRM Webhook] Échec pour ${input.nom}: ${result.error}`);
            }
          } catch (err) {
            console.error(`[CRM Webhook] Erreur pour ${input.nom}:`, err);
            crmSync = { success: false, error: String(err) };
          }
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
          // Obtenir la date actuelle dans le fuseau business
          const dateStr = now.toLocaleDateString("en-CA", { timeZone: config.timezone });
          // Construire un timestamp UTC qui représente "hour:minute" dans le fuseau business
          // En soustrayant l'offset du fuseau business pour obtenir l'heure UTC correcte
          const bizOffsetMs = getTimezoneOffset(config.timezone, now) * 60000;
          const utcDate = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00.000Z`);
          // utcDate est en UTC, mais on veut que hour:minute soit dans le fuseau business
          // Donc on soustrait l'offset business pour obtenir le vrai UTC
          const realUtcDate = new Date(utcDate.getTime() - bizOffsetMs);
          // Formater dans le fuseau du visiteur
          return realUtcDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: visitorTz });
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
          lang: z.enum(["fr", "en", "de", "es"]).optional().default("fr"),
        })
      )
      .mutation(async ({ input }) => {
        const response = await chatWithAssistant(input.messages, input.lang);
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
        configured: isCrmWebhookConfigured(),
        method: "webhook",
        webhookUrl: process.env.CRM_WEBHOOK_URL ? "Configuré" : "Non configuré",
      };
    }),

    /** Envoyer manuellement une soumission au CRM */
    syncToCrm: adminProcedure
      .input(z.object({ submissionId: z.number() }))
      .mutation(async ({ input }) => {
        const allSubs = await getAllSubmissions(500);
        const submission = allSubs.find(s => s.id === input.submissionId);
        if (!submission) throw new Error("Soumission introuvable");

        const nameParts = (submission.nom || "").trim().split(/\s+/);
        const prenom = nameParts.length > 1 ? nameParts[0] : null;
        const nom = nameParts.length > 1 ? nameParts.slice(1).join(" ") : nameParts[0] || null;

        const result = await sendProspectToCrm({
          entreprise: submission.entreprise || `Particulier - ${submission.nom}`,
          personne: nom,
          prenom: prenom,
          email: submission.email,
          telephone: submission.telephone || null,
          produit: submission.produit || null,
          contactType: "mail",
          notes: [
            "Source : sync manuelle depuis admin",
            submission.message ? `Message : ${submission.message}` : null,
            submission.sujet ? `Sujet : ${submission.sujet}` : null,
          ].filter(Boolean).join("\n"),
        });

        return result;
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
  }),

  // ===== Disponibilité des commerciaux =====
  availability: router({
    /** Récupère la disponibilité des commerciaux avec message IA */
    check: publicProcedure
      .input(z.object({
        visitorTimezone: z.string().default("Europe/Paris"),
      }))
      .query(async ({ input }) => {
        return getAvailability(input.visitorTimezone);
      }),

    /** Met à jour le fuseau horaire d'un commercial (admin) */
    updateCommercialTimezone: adminProcedure
      .input(z.object({
        commercial: z.enum(["dc", "jb"]),
        timezone: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { updateBusinessHoursSetting } = await import("./businessHours");
        const key = `commercial_${input.commercial}_timezone`;
        const success = await updateBusinessHoursSetting(key, JSON.stringify(input.timezone));
        return { success, commercial: input.commercial.toUpperCase(), timezone: input.timezone };
      }),

    /** Récupère les fuseaux horaires configurés des commerciaux (accessible aux admins connectés) */
    getCommercialTimezones: protectedProcedure.query(async () => {
      const { getAvailability } = await import("./availabilityService");
      const result = await getAvailability("Europe/Paris");
      const dcCommercial = result.commercials.find((c: any) => c.initials === "DC");
      const jbCommercial = result.commercials.find((c: any) => c.initials === "JB");
      return {
        dc: dcCommercial?.timezone || "Europe/Paris",
        jb: jbCommercial?.timezone || "Asia/Shanghai",
        dcTime: dcCommercial?.localTime || "",
        jbTime: jbCommercial?.localTime || "",
        dcAvailable: dcCommercial?.available ?? false,
        jbAvailable: jbCommercial?.available ?? false,
      };
    }),
  }),

  // ===== Blog =====
  blog: router({
    /** Lister les articles publiés (public) */
    list: publicProcedure
      .input(z.object({
        lang: z.string().default("fr"),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().default(0),
      }).optional())
      .query(async ({ input }) => {
        const lang = input?.lang ?? "fr";
        const limit = input?.limit ?? 20;
        const offset = input?.offset ?? 0;
        const [posts, total] = await Promise.all([
          getPublishedPosts(lang, limit, offset),
          countPublishedPosts(lang),
        ]);
        return { posts, total };
      }),

    /** Récupérer un article par slug (public) */
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getBlogPostBySlug(input.slug);
        if (!post || post.status !== "published") return null;
        return post;
      }),

    /** Créer un article — accessible via clé API (OpenClaw) ou admin connecté */
    create: publicProcedure
      .input(z.object({
        apiKey: z.string().optional(),
        title: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        imageUrl: z.string().optional(),
        lang: z.string().default("fr"),
        status: z.enum(["draft", "published", "scheduled"]).default("draft"),
        metaKeywords: z.string().optional(),
        metaDescription: z.string().optional(),
        author: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Authentification : clé API (BLOG_API_KEY ou BLOG_API_KEY_2) ou admin connecté
        const validApiKey1 = process.env.BLOG_API_KEY;
        const validApiKey2 = process.env.BLOG_API_KEY_2;
        const isApiKey = (validApiKey1 && input.apiKey === validApiKey1) || (validApiKey2 && input.apiKey === validApiKey2);
        const isAdmin = ctx.user?.role === "admin";
        if (!isApiKey && !isAdmin) {
          throw new Error("Non autorisé");
        }
        const post = await createBlogPost({
          title: input.title,
          content: input.content,
          excerpt: input.excerpt,
          imageUrl: input.imageUrl,
          lang: input.lang,
          status: input.status,
          publishedAt: input.status === "published" ? new Date() : undefined,
          metaKeywords: input.metaKeywords,
          metaDescription: input.metaDescription,
          author: input.author ?? "OpenClaw",
          category: input.category,
        });

        // Traduction automatique DeepL si l'article est publié en français
        if (input.status === "published" && input.lang === "fr") {
          translateAndPublishPost(post).catch(err =>
            console.error("[Blog] Erreur traduction automatique:", err)
          );
        }

        return { success: true, post };
      }),

    /** Lister tous les articles (admin) */
    adminList: adminProcedure
      .query(async () => getAllBlogPosts(200)),

    /** Publier un article (admin) */
    publish: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await publishBlogPost(input.id);
        // Traduction automatique si article français
        const published = await getBlogPostById(input.id);
        if (published && published.lang === "fr") {
          translateAndPublishPost(published).catch(err =>
            console.error("[Blog] Erreur traduction:", err)
          );
        }
        return { success: true };
      }),

    /** Mettre à jour un article (admin) */
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        imageUrl: z.string().optional(),
        status: z.enum(["draft", "published", "scheduled"]).optional(),
        metaKeywords: z.string().optional(),
        metaDescription: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateBlogPost(id, data as any);
        return { success: true };
      }),

    /** Supprimer un article (admin) */
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteBlogPost(input.id);
        return { success: true };
      }),
  }),

  // ===== IndexNow SEO =====
  indexnow: router({    /** Soumet toutes les pages publiques à IndexNow (Bing, Yandex, DuckDuckGo) */
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
  }),
});

export type AppRouter = typeof appRouter;
