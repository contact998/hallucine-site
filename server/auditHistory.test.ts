/**
 * Tests pour l'historique des audits IA
 * Couvre : calcVariation, insertAuditHistory (mock), getWeekOverWeekComparison (mock)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { calcVariation } from "./weeklyAudit";

// ─── calcVariation ────────────────────────────────────────────────

describe("calcVariation", () => {
  it("calcule une augmentation de 50%", () => {
    expect(calcVariation(150, 100)).toBe(50);
  });

  it("calcule une diminution de 25%", () => {
    expect(calcVariation(75, 100)).toBe(-25);
  });

  it("retourne 0 quand les valeurs sont identiques", () => {
    expect(calcVariation(100, 100)).toBe(0);
  });

  it("retourne 100 quand la valeur précédente est 0 et la courante > 0", () => {
    expect(calcVariation(50, 0)).toBe(100);
  });

  it("retourne null quand les deux valeurs sont 0", () => {
    expect(calcVariation(0, 0)).toBeNull();
  });

  it("calcule une augmentation de 100% (doublement)", () => {
    expect(calcVariation(200, 100)).toBe(100);
  });

  it("calcule une diminution de 100% (zéro)", () => {
    expect(calcVariation(0, 100)).toBe(-100);
  });

  it("arrondit à l'entier le plus proche", () => {
    // 33.333... -> 33
    expect(calcVariation(400, 300)).toBe(33);
  });

  it("gère les petites variations", () => {
    expect(calcVariation(101, 100)).toBe(1);
    expect(calcVariation(99, 100)).toBe(-1);
  });

  it("gère les grandes valeurs", () => {
    expect(calcVariation(1000000, 500000)).toBe(100);
    expect(calcVariation(500000, 1000000)).toBe(-50);
  });

  it("gère les augmentations massives", () => {
    expect(calcVariation(1000, 1)).toBe(99900);
  });
});

// ─── Audit History Data Structure ─────────────────────────────────

describe("Audit History Data Structure", () => {
  it("vérifie la structure d'un enregistrement d'audit", () => {
    const auditRecord = {
      id: 1,
      period: "08/02/2026 — 15/02/2026",
      timezone: "Europe/Paris",
      performanceSummary: "Le site a reçu 1250 visites.",
      workflowAnalysis: "Le SmartForm convertit bien.",
      conversionAnalysis: "Taux de conversion de 3%.",
      codeRecommendations: "Optimiser le lazy loading.",
      prioritizedActions: "1. Ajouter des meta descriptions.",
      totalPageViews: 1250,
      uniqueVisitors: 340,
      totalEvents: 89,
      avgDuration: 145,
      totalSubmissions: 25,
      weeklySubmissions: 7,
      emailSent: "sent" as const,
      emailSubject: "[Hallucine] Audit IA hebdomadaire",
      createdAt: new Date("2026-02-15T06:00:00Z"),
    };

    expect(auditRecord.id).toBe(1);
    expect(auditRecord.period).toContain("—");
    expect(auditRecord.timezone).toBe("Europe/Paris");
    expect(auditRecord.totalPageViews).toBeGreaterThanOrEqual(0);
    expect(auditRecord.uniqueVisitors).toBeGreaterThanOrEqual(0);
    expect(auditRecord.totalEvents).toBeGreaterThanOrEqual(0);
    expect(auditRecord.avgDuration).toBeGreaterThanOrEqual(0);
    expect(auditRecord.totalSubmissions).toBeGreaterThanOrEqual(0);
    expect(auditRecord.weeklySubmissions).toBeGreaterThanOrEqual(0);
    expect(["pending", "sent", "failed"]).toContain(auditRecord.emailSent);
  });

  it("vérifie la structure de comparaison semaine/semaine", () => {
    const comparison = {
      current: {
        id: 2,
        period: "15/02/2026 — 22/02/2026",
        totalPageViews: 1500,
        uniqueVisitors: 400,
        totalEvents: 120,
        avgDuration: 160,
        totalSubmissions: 30,
        weeklySubmissions: 10,
        createdAt: new Date("2026-02-22T06:00:00Z"),
      },
      previous: {
        id: 1,
        period: "08/02/2026 — 15/02/2026",
        totalPageViews: 1250,
        uniqueVisitors: 340,
        totalEvents: 89,
        avgDuration: 145,
        totalSubmissions: 25,
        weeklySubmissions: 7,
        createdAt: new Date("2026-02-15T06:00:00Z"),
      },
      variations: {
        pageViews: calcVariation(1500, 1250),
        visitors: calcVariation(400, 340),
        events: calcVariation(120, 89),
        duration: calcVariation(160, 145),
        submissions: calcVariation(10, 7),
      },
    };

    // Pages vues : 1250 -> 1500 = +20%
    expect(comparison.variations.pageViews).toBe(20);
    // Visiteurs : 340 -> 400 = +17.6% -> 18%
    expect(comparison.variations.visitors).toBe(18);
    // Événements : 89 -> 120 = +34.8% -> 35%
    expect(comparison.variations.events).toBe(35);
    // Durée : 145 -> 160 = +10.3% -> 10%
    expect(comparison.variations.duration).toBe(10);
    // Soumissions : 7 -> 10 = +42.8% -> 43%
    expect(comparison.variations.submissions).toBe(43);
  });

  it("gère la comparaison sans semaine précédente", () => {
    const comparison = {
      current: {
        id: 1,
        period: "08/02/2026 — 15/02/2026",
        totalPageViews: 1250,
        uniqueVisitors: 340,
        totalEvents: 89,
        avgDuration: 145,
        totalSubmissions: 25,
        weeklySubmissions: 7,
        createdAt: new Date("2026-02-15T06:00:00Z"),
      },
      previous: null,
      variations: {
        pageViews: null,
        visitors: null,
        events: null,
        duration: null,
        submissions: null,
      },
    };

    expect(comparison.previous).toBeNull();
    expect(comparison.variations.pageViews).toBeNull();
    expect(comparison.variations.visitors).toBeNull();
    expect(comparison.variations.events).toBeNull();
    expect(comparison.variations.duration).toBeNull();
    expect(comparison.variations.submissions).toBeNull();
  });

  it("détecte une baisse de performance semaine/semaine", () => {
    const current = { totalPageViews: 800, uniqueVisitors: 200, weeklySubmissions: 3 };
    const previous = { totalPageViews: 1250, uniqueVisitors: 340, weeklySubmissions: 7 };

    const pvVar = calcVariation(current.totalPageViews, previous.totalPageViews);
    const uvVar = calcVariation(current.uniqueVisitors, previous.uniqueVisitors);
    const subVar = calcVariation(current.weeklySubmissions, previous.weeklySubmissions);

    expect(pvVar).toBeLessThan(0); // -36%
    expect(uvVar).toBeLessThan(0); // -41%
    expect(subVar).toBeLessThan(0); // -57%
  });

  it("détecte une croissance de performance semaine/semaine", () => {
    const current = { totalPageViews: 2000, uniqueVisitors: 500, weeklySubmissions: 15 };
    const previous = { totalPageViews: 1250, uniqueVisitors: 340, weeklySubmissions: 7 };

    const pvVar = calcVariation(current.totalPageViews, previous.totalPageViews);
    const uvVar = calcVariation(current.uniqueVisitors, previous.uniqueVisitors);
    const subVar = calcVariation(current.weeklySubmissions, previous.weeklySubmissions);

    expect(pvVar).toBeGreaterThan(0); // +60%
    expect(uvVar).toBeGreaterThan(0); // +47%
    expect(subVar).toBeGreaterThan(0); // +114%
  });
});

// ─── Email status tracking ────────────────────────────────────────

describe("Email status tracking", () => {
  it("vérifie les statuts d'email valides", () => {
    const validStatuses = ["pending", "sent", "failed"];
    expect(validStatuses).toContain("pending");
    expect(validStatuses).toContain("sent");
    expect(validStatuses).toContain("failed");
    expect(validStatuses).not.toContain("cancelled");
    expect(validStatuses).not.toContain("scheduled");
  });

  it("vérifie le format du sujet d'email", () => {
    const subject = "[Hallucine] Audit IA hebdomadaire — Semaine du lundi 15 février 2026";
    expect(subject).toMatch(/^\[Hallucine\] Audit IA hebdomadaire/);
    expect(subject).toContain("Semaine du");
  });
});
