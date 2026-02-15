/**
 * Service d'Audit IA Hebdomadaire
 * Analyse le code, le workflow du site et propose des améliorations.
 * Envoyé par email chaque lundi à 6h (fuseau horaire configuré dans le CRM).
 */

import { invokeLLM } from "./_core/llm";
import { getBusinessHoursConfig } from "./businessHours";
import {
  getAnalyticsOverview,
  getTopPages,
  getTrafficSources,
  getDeviceBreakdown,
  getDailyPageViews,
  getTopEvents,
} from "./analytics";
import {
  getSubmissionStats,
  getAllSubmissions,
  insertAuditHistory,
  getAuditHistoryList,
  getAuditHistoryById,
  getLastTwoAudits,
  updateAuditEmailStatus,
} from "./db";

// ─── Types ─────────────────────────────────────────────────────────

export interface AuditReport {
  generatedAt: number;
  timezone: string;
  period: string;
  sections: {
    performanceSummary: string;
    workflowAnalysis: string;
    conversionAnalysis: string;
    codeRecommendations: string;
    prioritizedActions: string;
  };
  rawMetrics: AuditMetrics;
}

export interface AuditMetrics {
  analytics: {
    totalPageViews: number;
    uniqueVisitors: number;
    totalEvents: number;
    avgDuration: number;
  } | null;
  topPages: Array<{ path: string; pageTitle: string | null; views: number; uniqueVisitors: number }>;
  trafficSources: Array<{ source: string; views: number; uniqueVisitors: number }>;
  deviceBreakdown: Array<{ device: string; views: number }>;
  dailyTrend: Array<{ date: string; views: number; uniqueVisitors: number }>;
  topEvents: Array<{ eventType: string; count: number }>;
  submissions: Record<string, number> | null;
  recentSubmissions: number;
}

// ─── Collecte des métriques ────────────────────────────────────────

/**
 * Collecte toutes les métriques nécessaires pour l'audit hebdomadaire.
 * Période : 7 derniers jours.
 */
export async function collectAuditMetrics(): Promise<AuditMetrics> {
  const daysBack = 7;

  // Collecter en parallèle pour la performance
  const [
    analytics,
    topPages,
    trafficSources,
    deviceBreakdown,
    dailyTrend,
    topEvents,
    submissionStats,
    allSubmissions,
  ] = await Promise.all([
    getAnalyticsOverview(daysBack).catch(() => null),
    getTopPages(daysBack, 10).catch(() => []),
    getTrafficSources(daysBack).catch(() => []),
    getDeviceBreakdown(daysBack).catch(() => []),
    getDailyPageViews(daysBack).catch(() => []),
    getTopEvents(daysBack, 10).catch(() => []),
    getSubmissionStats().catch(() => null),
    getAllSubmissions().catch(() => []),
  ]);

  // Compter les soumissions des 7 derniers jours
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentSubmissions = allSubmissions.filter(
    (s: any) => new Date(s.createdAt).getTime() > sevenDaysAgo
  ).length;

  return {
    analytics,
    topPages: topPages as any[],
    trafficSources: trafficSources as any[],
    deviceBreakdown: deviceBreakdown as any[],
    dailyTrend: dailyTrend as any[],
    topEvents: topEvents as any[],
    submissions: submissionStats,
    recentSubmissions,
  };
}

// ─── Génération du rapport IA ──────────────────────────────────────

/**
 * Génère le rapport d'audit IA à partir des métriques collectées.
 * L'IA analyse les données et produit des recommandations concrètes.
 */
export async function generateAuditReport(metrics: AuditMetrics): Promise<AuditReport> {
  const config = await getBusinessHoursConfig();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const period = `${weekAgo.toLocaleDateString("fr-FR")} — ${now.toLocaleDateString("fr-FR")}`;

  // Préparer le contexte pour l'IA
  const metricsContext = buildMetricsContext(metrics);

  const result = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `Tu es le consultant digital senior d'Hallucine, fabricant français d'écrans de cinéma gonflables depuis 1995. 
Tu réalises un audit hebdomadaire du site web et de son workflow commercial.

Le site Hallucine est un site vitrine avec :
- Un SmartForm IA multi-étapes (email en premier, extraction IA nom/prénom/entreprise, auto-complétion SIRET, remplissage vocal, détection d'abandon)
- Un chatbot IA conversationnel
- Un bouton WhatsApp intelligent (message adapté au fuseau horaire)
- Un système de brochures PDF téléchargeables
- Un CRM synchronisé automatiquement
- Des notifications email admin avec analyse IA
- Un dashboard analytics avec recommandations IA
- Une détection d'abandon avec relance email automatique

Tu dois fournir un rapport structuré en 5 sections, chacune en français, concise mais actionnable.
Chaque section doit faire 3-5 paragraphes maximum.
Utilise un ton professionnel mais accessible, comme un consultant qui parle à un dirigeant de PME.
Ne mets pas de markdown dans tes réponses, juste du texte brut avec des retours à la ligne.`,
      },
      {
        role: "user",
        content: `Voici les métriques de la semaine écoulée (${period}) :

${metricsContext}

Génère un rapport d'audit en 5 sections séparées par "===SECTION===" :

1. RÉSUMÉ DES PERFORMANCES : synthèse des KPIs clés de la semaine (visites, visiteurs uniques, durée moyenne, tendance)

2. ANALYSE DU WORKFLOW : évaluation du parcours utilisateur (pages les plus visitées, taux de rebond estimé, efficacité du SmartForm, utilisation du chatbot)

3. ANALYSE DE CONVERSION : évaluation du taux de conversion (soumissions/visites), qualité des leads, efficacité de la détection d'abandon, sources de trafic les plus convertissantes

4. RECOMMANDATIONS TECHNIQUES : suggestions d'amélioration du code, de la performance, de l'UX, du SEO (basées sur les données observées)

5. ACTIONS PRIORITAIRES : top 5 des actions concrètes à réaliser cette semaine, classées par impact estimé

Sépare chaque section par la ligne "===SECTION===".`,
      },
    ],
  });

  const content = result.choices?.[0]?.message?.content;
  const rawText = typeof content === "string" ? content : "";

  // Parser les 5 sections
  const sections = parseAuditSections(rawText);

  return {
    generatedAt: Date.now(),
    timezone: config.timezone,
    period,
    sections,
    rawMetrics: metrics,
  };
}

/**
 * Construit le contexte textuel des métriques pour le prompt IA.
 */
export function buildMetricsContext(metrics: AuditMetrics): string {
  const lines: string[] = [];

  // Analytics globales
  if (metrics.analytics) {
    lines.push("ANALYTICS GLOBALES (7 derniers jours) :");
    lines.push(`  Pages vues : ${metrics.analytics.totalPageViews}`);
    lines.push(`  Visiteurs uniques : ${metrics.analytics.uniqueVisitors}`);
    lines.push(`  Événements trackés : ${metrics.analytics.totalEvents}`);
    lines.push(`  Durée moyenne de visite : ${metrics.analytics.avgDuration}s`);
  } else {
    lines.push("ANALYTICS : aucune donnée disponible cette semaine");
  }

  lines.push("");

  // Top pages
  if (metrics.topPages.length > 0) {
    lines.push("TOP PAGES VISITÉES :");
    for (const p of metrics.topPages) {
      lines.push(`  ${p.path} — ${p.views} vues (${p.uniqueVisitors} visiteurs uniques)`);
    }
  }

  lines.push("");

  // Sources de trafic
  if (metrics.trafficSources.length > 0) {
    lines.push("SOURCES DE TRAFIC :");
    for (const s of metrics.trafficSources) {
      lines.push(`  ${s.source} : ${s.views} vues (${s.uniqueVisitors} visiteurs uniques)`);
    }
  }

  lines.push("");

  // Appareils
  if (metrics.deviceBreakdown.length > 0) {
    lines.push("RÉPARTITION PAR APPAREIL :");
    for (const d of metrics.deviceBreakdown) {
      lines.push(`  ${d.device} : ${d.views} vues`);
    }
  }

  lines.push("");

  // Tendance quotidienne
  if (metrics.dailyTrend.length > 0) {
    lines.push("TENDANCE QUOTIDIENNE :");
    for (const d of metrics.dailyTrend) {
      lines.push(`  ${d.date} : ${d.views} vues, ${d.uniqueVisitors} visiteurs`);
    }
  }

  lines.push("");

  // Événements
  if (metrics.topEvents.length > 0) {
    lines.push("TOP ÉVÉNEMENTS :");
    for (const e of metrics.topEvents) {
      lines.push(`  ${e.eventType} : ${e.count} fois`);
    }
  }

  lines.push("");

  // Soumissions
  if (metrics.submissions) {
    lines.push("SOUMISSIONS DE FORMULAIRE :");
    lines.push(`  Total : ${metrics.submissions.total ?? 0}`);
    lines.push(`  Cette semaine : ${metrics.recentSubmissions}`);
    lines.push("  Détail :");
    for (const [key, count] of Object.entries(metrics.submissions)) {
      if (key !== "total") {
        lines.push(`    ${key} : ${count}`);
      }
    }
  } else {
    lines.push("SOUMISSIONS : aucune donnée disponible");
  }

  return lines.join("\n");
}

/**
 * Parse les 5 sections du rapport IA à partir du texte brut.
 */
export function parseAuditSections(rawText: string): AuditReport["sections"] {
  const parts = rawText.split("===SECTION===").map(s => s.trim()).filter(s => s.length > 0);

  return {
    performanceSummary: parts[0] || "Aucune donnée de performance disponible cette semaine.",
    workflowAnalysis: parts[1] || "Aucune donnée de workflow disponible cette semaine.",
    conversionAnalysis: parts[2] || "Aucune donnée de conversion disponible cette semaine.",
    codeRecommendations: parts[3] || "Aucune recommandation technique cette semaine.",
    prioritizedActions: parts[4] || "Aucune action prioritaire identifiée cette semaine.",
  };
}

// ─── Formatage email ───────────────────────────────────────────────

/**
 * Formate le rapport d'audit en email texte brut professionnel.
 */
export function formatAuditEmail(report: AuditReport): { subject: string; body: string } {
  const now = new Date(report.generatedAt);
  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject = `[Hallucine] Audit IA hebdomadaire — Semaine du ${dateStr}`;

  const body = [
    "AUDIT IA HEBDOMADAIRE — SITE WEB HALLUCINE",
    `Période : ${report.period}`,
    `Généré le ${dateStr} à 6h00 (${report.timezone})`,
    "",
    "═══════════════════════════════════════════════════════",
    "1. RÉSUMÉ DES PERFORMANCES",
    "═══════════════════════════════════════════════════════",
    "",
    report.sections.performanceSummary,
    "",
    "═══════════════════════════════════════════════════════",
    "2. ANALYSE DU WORKFLOW",
    "═══════════════════════════════════════════════════════",
    "",
    report.sections.workflowAnalysis,
    "",
    "═══════════════════════════════════════════════════════",
    "3. ANALYSE DE CONVERSION",
    "═══════════════════════════════════════════════════════",
    "",
    report.sections.conversionAnalysis,
    "",
    "═══════════════════════════════════════════════════════",
    "4. RECOMMANDATIONS TECHNIQUES",
    "═══════════════════════════════════════════════════════",
    "",
    report.sections.codeRecommendations,
    "",
    "═══════════════════════════════════════════════════════",
    "5. ACTIONS PRIORITAIRES DE LA SEMAINE",
    "═══════════════════════════════════════════════════════",
    "",
    report.sections.prioritizedActions,
    "",
    "═══════════════════════════════════════════════════════",
    "MÉTRIQUES BRUTES",
    "═══════════════════════════════════════════════════════",
    "",
    `Pages vues : ${report.rawMetrics.analytics?.totalPageViews ?? "N/A"}`,
    `Visiteurs uniques : ${report.rawMetrics.analytics?.uniqueVisitors ?? "N/A"}`,
    `Durée moyenne : ${report.rawMetrics.analytics?.avgDuration ?? "N/A"}s`,
    `Événements : ${report.rawMetrics.analytics?.totalEvents ?? "N/A"}`,
    `Soumissions cette semaine : ${report.rawMetrics.recentSubmissions}`,
    `Soumissions totales : ${report.rawMetrics.submissions?.total ?? "N/A"}`,
    "",
    "───────────────────────────────────────────────────────",
    "Liens rapides :",
    "  Dashboard admin : https://hallucine-site.manus.space/admin",
    "  CRM Hallucine : https://hallucinecrm.manus.space",
    "",
    "---",
    "Rapport généré automatiquement par l'IA Hallucine.",
    "Pour modifier l'heure d'envoi ou le fuseau horaire, rendez-vous dans le panneau admin.",
  ].join("\n");

  return { subject, body };
}

// ─── Exécution complète ────────────────────────────────────────────

/**
 * Exécute l'audit complet : collecte, analyse IA, formatage email.
 * Retourne les données prêtes à envoyer.
 */
export async function executeWeeklyAudit(): Promise<{
  success: boolean;
  report?: AuditReport;
  email?: { subject: string; body: string };
  auditId?: number;
  error?: string;
}> {
  try {
    console.log("[WeeklyAudit] Démarrage de l'audit hebdomadaire...");

    // 1. Collecter les métriques
    const metrics = await collectAuditMetrics();
    console.log("[WeeklyAudit] Métriques collectées");

    // 2. Générer le rapport IA
    const report = await generateAuditReport(metrics);
    console.log("[WeeklyAudit] Rapport IA généré");

    // 3. Formater l'email
    const email = formatAuditEmail(report);
    console.log("[WeeklyAudit] Email formaté");

    // 4. Sauvegarder en base de données
    let auditId: number | undefined;
    try {
      const insertResult = await insertAuditHistory({
        period: report.period,
        timezone: report.timezone,
        performanceSummary: report.sections.performanceSummary,
        workflowAnalysis: report.sections.workflowAnalysis,
        conversionAnalysis: report.sections.conversionAnalysis,
        codeRecommendations: report.sections.codeRecommendations,
        prioritizedActions: report.sections.prioritizedActions,
        rawMetrics: JSON.stringify(report.rawMetrics),
        totalPageViews: report.rawMetrics.analytics?.totalPageViews ?? 0,
        uniqueVisitors: report.rawMetrics.analytics?.uniqueVisitors ?? 0,
        totalEvents: report.rawMetrics.analytics?.totalEvents ?? 0,
        avgDuration: report.rawMetrics.analytics?.avgDuration ?? 0,
        totalSubmissions: report.rawMetrics.submissions?.total ?? 0,
        weeklySubmissions: report.rawMetrics.recentSubmissions,
        emailSubject: email.subject,
        emailBody: email.body,
        emailSent: "pending",
      });
      auditId = Number(insertResult[0].insertId);
      console.log(`[WeeklyAudit] Rapport sauvegardé en DB (id: ${auditId})`);
    } catch (dbErr) {
      console.error("[WeeklyAudit] Erreur sauvegarde DB:", dbErr);
      // On continue même si la DB échoue
    }

    return { success: true, report, email, auditId };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[WeeklyAudit] Erreur:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

// ─── Comparaison semaine / semaine ─────────────────────────────────

export interface WeekComparison {
  current: {
    id: number;
    period: string;
    totalPageViews: number;
    uniqueVisitors: number;
    totalEvents: number;
    avgDuration: number;
    totalSubmissions: number;
    weeklySubmissions: number;
    createdAt: Date;
  };
  previous: {
    id: number;
    period: string;
    totalPageViews: number;
    uniqueVisitors: number;
    totalEvents: number;
    avgDuration: number;
    totalSubmissions: number;
    weeklySubmissions: number;
    createdAt: Date;
  } | null;
  variations: {
    pageViews: number | null;
    visitors: number | null;
    events: number | null;
    duration: number | null;
    submissions: number | null;
  };
}

/**
 * Calcule la variation en pourcentage entre deux valeurs.
 * Retourne null si la valeur précédente est 0 (pas de référence).
 */
export function calcVariation(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Récupère les 2 derniers audits et calcule les variations.
 */
export async function getWeekOverWeekComparison(): Promise<WeekComparison | null> {
  const audits = await getLastTwoAudits();
  if (audits.length === 0) return null;

  const current = audits[0];
  const previous = audits.length > 1 ? audits[1] : null;

  return {
    current,
    previous,
    variations: {
      pageViews: previous ? calcVariation(current.totalPageViews, previous.totalPageViews) : null,
      visitors: previous ? calcVariation(current.uniqueVisitors, previous.uniqueVisitors) : null,
      events: previous ? calcVariation(current.totalEvents, previous.totalEvents) : null,
      duration: previous ? calcVariation(current.avgDuration, previous.avgDuration) : null,
      submissions: previous ? calcVariation(current.weeklySubmissions, previous.weeklySubmissions) : null,
    },
  };
}

// Ré-exporter les helpers DB pour l'accès depuis les routes
export { getAuditHistoryList, getAuditHistoryById, getLastTwoAudits, updateAuditEmailStatus };

/**
 * Calcule la prochaine heure d'envoi (lundi 6h00 dans le fuseau CRM).
 * Retourne un timestamp UTC.
 */
export function getNextMondaySixAM(timezone: string): number {
  const now = new Date();

  // Stratégie : tester chaque jour des 8 prochains jours pour trouver
  // le premier lundi à 6h00 dans le fuseau cible qui est dans le futur.
  // C'est plus robuste que le calcul d'offset qui peut décaler le jour.
  for (let daysAhead = 0; daysAhead <= 8; daysAhead++) {
    // Construire un candidat : aujourd'hui + daysAhead, à 6h00 dans le fuseau cible
    const candidate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    // Obtenir l'offset du fuseau pour cette date
    const utcStr = candidate.toLocaleString("en-US", { timeZone: "UTC" });
    const tzStr = candidate.toLocaleString("en-US", { timeZone: timezone });
    const offsetMs = new Date(tzStr).getTime() - new Date(utcStr).getTime();

    // Mettre à 6h00 dans le fuseau cible
    candidate.setUTCHours(6, 0, 0, 0);
    candidate.setTime(candidate.getTime() - offsetMs);

    // Vérifier que c'est un lundi dans le fuseau cible ET dans le futur
    const checkFmt = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
    });
    const weekday = checkFmt.format(candidate);

    if (weekday === "Mon" && candidate.getTime() > now.getTime()) {
      return candidate.getTime();
    }
  }

  // Fallback : si aucun lundi trouvé dans les 8 jours (ne devrait pas arriver),
  // retourner dans 7 jours
  return now.getTime() + 7 * 24 * 60 * 60 * 1000;
}
