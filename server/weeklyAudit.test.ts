/**
 * Tests pour le service d'audit IA hebdomadaire
 * Couvre : buildMetricsContext, parseAuditSections, formatAuditEmail, getNextMondaySixAM
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildMetricsContext,
  parseAuditSections,
  formatAuditEmail,
  getNextMondaySixAM,
  type AuditMetrics,
  type AuditReport,
} from "./weeklyAudit";

// ─── Fixtures ──────────────────────────────────────────────────────

const emptyMetrics: AuditMetrics = {
  analytics: null,
  topPages: [],
  trafficSources: [],
  deviceBreakdown: [],
  dailyTrend: [],
  topEvents: [],
  submissions: null,
  recentSubmissions: 0,
};

const fullMetrics: AuditMetrics = {
  analytics: {
    totalPageViews: 1250,
    uniqueVisitors: 340,
    totalEvents: 89,
    avgDuration: 145,
  },
  topPages: [
    { path: "/", pageTitle: "Accueil", views: 500, uniqueVisitors: 200 },
    { path: "/ecrans", pageTitle: "Écrans", views: 300, uniqueVisitors: 150 },
    { path: "/contact", pageTitle: "Contact", views: 200, uniqueVisitors: 100 },
  ],
  trafficSources: [
    { source: "organic", views: 600, uniqueVisitors: 180 },
    { source: "direct", views: 400, uniqueVisitors: 120 },
    { source: "social", views: 250, uniqueVisitors: 40 },
  ],
  deviceBreakdown: [
    { device: "desktop", views: 700 },
    { device: "mobile", views: 450 },
    { device: "tablet", views: 100 },
  ],
  dailyTrend: [
    { date: "2026-02-09", views: 150, uniqueVisitors: 45 },
    { date: "2026-02-10", views: 200, uniqueVisitors: 60 },
    { date: "2026-02-11", views: 180, uniqueVisitors: 50 },
  ],
  topEvents: [
    { eventType: "form_start", count: 45 },
    { eventType: "form_complete", count: 12 },
    { eventType: "chatbot_open", count: 30 },
  ],
  submissions: {
    total: 25,
    en_attente: 10,
    en_cours: 5,
    traite: 8,
    annule: 2,
    contact: 10,
    devis: 12,
    distributeur: 3,
  },
  recentSubmissions: 7,
};

// ─── buildMetricsContext ───────────────────────────────────────────

describe("buildMetricsContext", () => {
  it("gère les métriques vides sans erreur", () => {
    const result = buildMetricsContext(emptyMetrics);
    expect(result).toContain("aucune donnée disponible");
    expect(result).toContain("SOUMISSIONS : aucune donnée disponible");
  });

  it("inclut les analytics globales quand disponibles", () => {
    const result = buildMetricsContext(fullMetrics);
    expect(result).toContain("Pages vues : 1250");
    expect(result).toContain("Visiteurs uniques : 340");
    expect(result).toContain("Événements trackés : 89");
    expect(result).toContain("Durée moyenne de visite : 145s");
  });

  it("inclut les top pages", () => {
    const result = buildMetricsContext(fullMetrics);
    expect(result).toContain("/ — 500 vues (200 visiteurs uniques)");
    expect(result).toContain("/ecrans — 300 vues (150 visiteurs uniques)");
    expect(result).toContain("/contact — 200 vues (100 visiteurs uniques)");
  });

  it("inclut les sources de trafic", () => {
    const result = buildMetricsContext(fullMetrics);
    expect(result).toContain("organic : 600 vues (180 visiteurs uniques)");
    expect(result).toContain("direct : 400 vues (120 visiteurs uniques)");
    expect(result).toContain("social : 250 vues (40 visiteurs uniques)");
  });

  it("inclut la répartition par appareil", () => {
    const result = buildMetricsContext(fullMetrics);
    expect(result).toContain("desktop : 700 vues");
    expect(result).toContain("mobile : 450 vues");
    expect(result).toContain("tablet : 100 vues");
  });

  it("inclut la tendance quotidienne", () => {
    const result = buildMetricsContext(fullMetrics);
    expect(result).toContain("2026-02-09 : 150 vues, 45 visiteurs");
    expect(result).toContain("2026-02-10 : 200 vues, 60 visiteurs");
  });

  it("inclut les événements", () => {
    const result = buildMetricsContext(fullMetrics);
    expect(result).toContain("form_start : 45 fois");
    expect(result).toContain("form_complete : 12 fois");
    expect(result).toContain("chatbot_open : 30 fois");
  });

  it("inclut les soumissions avec détail", () => {
    const result = buildMetricsContext(fullMetrics);
    expect(result).toContain("Total : 25");
    expect(result).toContain("Cette semaine : 7");
    expect(result).toContain("en_attente : 10");
    expect(result).toContain("devis : 12");
  });
});

// ─── parseAuditSections ───────────────────────────────────────────

describe("parseAuditSections", () => {
  it("parse correctement 5 sections séparées par ===SECTION===", () => {
    const rawText = [
      "Résumé des performances cette semaine.",
      "===SECTION===",
      "Le workflow fonctionne bien.",
      "===SECTION===",
      "Le taux de conversion est de 3%.",
      "===SECTION===",
      "Recommandation : optimiser le lazy loading.",
      "===SECTION===",
      "1. Ajouter des meta descriptions\n2. Optimiser les images",
    ].join("\n");

    const sections = parseAuditSections(rawText);
    expect(sections.performanceSummary).toContain("Résumé des performances");
    expect(sections.workflowAnalysis).toContain("workflow fonctionne bien");
    expect(sections.conversionAnalysis).toContain("taux de conversion");
    expect(sections.codeRecommendations).toContain("lazy loading");
    expect(sections.prioritizedActions).toContain("meta descriptions");
  });

  it("gère un texte vide avec des valeurs par défaut", () => {
    const sections = parseAuditSections("");
    expect(sections.performanceSummary).toContain("Aucune donnée");
    expect(sections.workflowAnalysis).toContain("Aucune donnée");
    expect(sections.conversionAnalysis).toContain("Aucune donnée");
    expect(sections.codeRecommendations).toContain("Aucune recommandation");
    expect(sections.prioritizedActions).toContain("Aucune action");
  });

  it("gère un texte avec moins de 5 sections", () => {
    const rawText = "Section 1\n===SECTION===\nSection 2";
    const sections = parseAuditSections(rawText);
    expect(sections.performanceSummary).toBe("Section 1");
    expect(sections.workflowAnalysis).toBe("Section 2");
    expect(sections.conversionAnalysis).toContain("Aucune donnée");
  });

  it("gère un texte sans séparateur", () => {
    const rawText = "Tout le contenu en un seul bloc.";
    const sections = parseAuditSections(rawText);
    expect(sections.performanceSummary).toBe("Tout le contenu en un seul bloc.");
    expect(sections.workflowAnalysis).toContain("Aucune donnée");
  });
});

// ─── formatAuditEmail ─────────────────────────────────────────────

describe("formatAuditEmail", () => {
  const mockReport: AuditReport = {
    generatedAt: new Date("2026-02-15T06:00:00Z").getTime(),
    timezone: "Europe/Paris",
    period: "08/02/2026 — 15/02/2026",
    sections: {
      performanceSummary: "Le site a reçu 1250 visites cette semaine.",
      workflowAnalysis: "Le SmartForm convertit bien.",
      conversionAnalysis: "Taux de conversion de 3%.",
      codeRecommendations: "Optimiser le lazy loading des images.",
      prioritizedActions: "1. Ajouter des meta descriptions.",
    },
    rawMetrics: fullMetrics,
  };

  it("génère un sujet d'email professionnel", () => {
    const { subject } = formatAuditEmail(mockReport);
    expect(subject).toContain("[Hallucine] Audit IA hebdomadaire");
    expect(subject).toContain("Semaine du");
  });

  it("inclut toutes les 5 sections dans le body", () => {
    const { body } = formatAuditEmail(mockReport);
    expect(body).toContain("RÉSUMÉ DES PERFORMANCES");
    expect(body).toContain("ANALYSE DU WORKFLOW");
    expect(body).toContain("ANALYSE DE CONVERSION");
    expect(body).toContain("RECOMMANDATIONS TECHNIQUES");
    expect(body).toContain("ACTIONS PRIORITAIRES");
  });

  it("inclut les métriques brutes dans le body", () => {
    const { body } = formatAuditEmail(mockReport);
    expect(body).toContain("Pages vues : 1250");
    expect(body).toContain("Visiteurs uniques : 340");
    expect(body).toContain("Soumissions cette semaine : 7");
    expect(body).toContain("Soumissions totales : 25");
  });

  it("inclut les liens rapides", () => {
    const { body } = formatAuditEmail(mockReport);
    expect(body).toContain("Dashboard admin");
    expect(body).toContain("CRM Hallucine");
  });

  it("inclut le contenu des sections", () => {
    const { body } = formatAuditEmail(mockReport);
    expect(body).toContain("Le site a reçu 1250 visites cette semaine.");
    expect(body).toContain("Le SmartForm convertit bien.");
    expect(body).toContain("Taux de conversion de 3%.");
    expect(body).toContain("Optimiser le lazy loading des images.");
    expect(body).toContain("Ajouter des meta descriptions.");
  });
});

// ─── getNextMondaySixAM ──────────────────────────────────────────

describe("getNextMondaySixAM", () => {
  it("retourne un timestamp dans le futur", () => {
    const nextMonday = getNextMondaySixAM("Europe/Paris");
    expect(nextMonday).toBeGreaterThan(Date.now());
  });

  it("retourne un timestamp qui correspond à un lundi", () => {
    const nextMonday = getNextMondaySixAM("Europe/Paris");
    const date = new Date(nextMonday);
    // Vérifier que c'est un lundi (1) dans le fuseau Europe/Paris
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Paris",
      weekday: "short",
    });
    const weekday = formatter.format(date);
    expect(weekday).toBe("Mon");
  });

  it("retourne un timestamp à 6h00 dans le fuseau cible", () => {
    const nextMonday = getNextMondaySixAM("Europe/Paris");
    const date = new Date(nextMonday);
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const hour = parts.find(p => p.type === "hour")?.value;
    const minute = parts.find(p => p.type === "minute")?.value;
    expect(hour).toBe("06");
    expect(minute).toBe("00");
  });

  it("fonctionne avec différents fuseaux horaires", () => {
    const timezones = ["Asia/Shanghai", "America/New_York", "Pacific/Noumea", "Asia/Tokyo"];
    for (const tz of timezones) {
      const nextMonday = getNextMondaySixAM(tz);
      expect(nextMonday).toBeGreaterThan(Date.now());

      const date = new Date(nextMonday);
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        weekday: "short",
        hour: "2-digit",
        hour12: false,
      });
      const parts = formatter.formatToParts(date);
      const weekday = parts.find(p => p.type === "weekday")?.value;
      const hour = parts.find(p => p.type === "hour")?.value;
      expect(weekday).toBe("Mon");
      expect(hour).toBe("06");
    }
  });

  it("le prochain lundi est dans maximum 7 jours", () => {
    const nextMonday = getNextMondaySixAM("Europe/Paris");
    const maxDelta = 8 * 24 * 60 * 60 * 1000; // 8 jours max
    expect(nextMonday - Date.now()).toBeLessThan(maxDelta);
  });
});
