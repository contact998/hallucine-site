import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  getAllSubmissions,
  updateSubmissionStatus,
  updateAdminNote,
  deleteSubmission,
  getSubmissionStats,
} from "../db";
import { sendProspectToCrm, isCrmWebhookConfigured } from "../crmWebhook";
import {
  getAnalyticsOverview,
  getTopPages,
  getTrafficSources,
  getDeviceBreakdown,
  getDailyPageViews,
  getTopEvents,
  getTopReferrers,
} from "../analytics";
import { invokeLLM } from "../_core/llm";

export const adminRouter = router({
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
          usage: "audit",
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
});
