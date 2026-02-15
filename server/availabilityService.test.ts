/**
 * Tests pour le service de disponibilité IA
 * Teste les fonctions pures : getLocalTimeInfo, isCommercialAvailable, calculateNextAvailability
 */

import { describe, it, expect } from "vitest";
import {
  getLocalTimeInfo,
  isCommercialAvailable,
  calculateNextAvailability,
} from "./availabilityService";

// ─── getLocalTimeInfo ──────────────────────────────────────────────

describe("getLocalTimeInfo", () => {
  it("retourne l'heure locale pour Europe/Paris", () => {
    // Lundi 10 février 2026 à 10h UTC = 11h CET
    const date = new Date("2026-02-10T10:00:00Z");
    const info = getLocalTimeInfo("Europe/Paris", date);
    expect(info.hour).toBe(11);
    expect(info.minute).toBe(0);
    expect(info.dayOfWeek).toBe(2); // Mardi (le 10 fev 2026 est un mardi)
  });

  it("retourne l'heure locale pour America/New_York", () => {
    // Lundi 10 février 2026 à 10h UTC = 5h EST
    const date = new Date("2026-02-10T10:00:00Z");
    const info = getLocalTimeInfo("America/New_York", date);
    expect(info.hour).toBe(5);
    expect(info.minute).toBe(0);
  });

  it("retourne l'heure locale pour Asia/Tokyo", () => {
    // Lundi 10 février 2026 à 10h UTC = 19h JST
    const date = new Date("2026-02-10T10:00:00Z");
    const info = getLocalTimeInfo("Asia/Tokyo", date);
    expect(info.hour).toBe(19);
    expect(info.minute).toBe(0);
  });

  it("gère les fuseaux avec demi-heures (Asia/Kolkata)", () => {
    // 10h UTC = 15h30 IST
    const date = new Date("2026-02-10T10:00:00Z");
    const info = getLocalTimeInfo("Asia/Kolkata", date);
    expect(info.hour).toBe(15);
    expect(info.minute).toBe(30);
  });

  it("retourne le bon jour de la semaine pour un dimanche", () => {
    // 15 février 2026 est un dimanche
    const date = new Date("2026-02-15T10:00:00Z");
    const info = getLocalTimeInfo("Europe/Paris", date);
    expect(info.dayOfWeek).toBe(7); // Dimanche
  });

  it("retourne le bon jour de la semaine pour un lundi", () => {
    // 16 février 2026 est un lundi
    const date = new Date("2026-02-16T10:00:00Z");
    const info = getLocalTimeInfo("Europe/Paris", date);
    expect(info.dayOfWeek).toBe(1); // Lundi
  });

  it("retourne le bon jour de la semaine pour un vendredi", () => {
    // 13 février 2026 est un vendredi
    const date = new Date("2026-02-13T10:00:00Z");
    const info = getLocalTimeInfo("Europe/Paris", date);
    expect(info.dayOfWeek).toBe(5); // Vendredi
  });

  it("retourne le bon jour de la semaine pour un samedi", () => {
    // 14 février 2026 est un samedi
    const date = new Date("2026-02-14T10:00:00Z");
    const info = getLocalTimeInfo("Europe/Paris", date);
    expect(info.dayOfWeek).toBe(6); // Samedi
  });

  it("retourne une localTime formatée correctement", () => {
    const date = new Date("2026-02-10T10:00:00Z");
    const info = getLocalTimeInfo("Europe/Paris", date);
    expect(info.localTime).toMatch(/^\d{2}:\d{2}$/);
  });
});

// ─── isCommercialAvailable ─────────────────────────────────────────

describe("isCommercialAvailable", () => {
  // Jours de travail (lundi à vendredi)
  it("disponible à 8h un lundi", () => {
    expect(isCommercialAvailable(8, 1)).toBe(true);
  });

  it("disponible à 10h un mercredi", () => {
    expect(isCommercialAvailable(10, 3)).toBe(true);
  });

  it("disponible à 15h un vendredi", () => {
    expect(isCommercialAvailable(15, 5)).toBe(true);
  });

  it("indisponible à 7h un lundi (avant 8h)", () => {
    expect(isCommercialAvailable(7, 1)).toBe(false);
  });

  it("indisponible à 16h un lundi (après 16h)", () => {
    expect(isCommercialAvailable(16, 1)).toBe(false);
  });

  it("indisponible à 20h un mardi", () => {
    expect(isCommercialAvailable(20, 2)).toBe(false);
  });

  it("indisponible à 0h un mercredi (minuit)", () => {
    expect(isCommercialAvailable(0, 3)).toBe(false);
  });

  // Week-end
  it("indisponible à 10h un samedi", () => {
    expect(isCommercialAvailable(10, 6)).toBe(false);
  });

  it("indisponible à 10h un dimanche", () => {
    expect(isCommercialAvailable(10, 7)).toBe(false);
  });

  it("indisponible à 12h un samedi", () => {
    expect(isCommercialAvailable(12, 6)).toBe(false);
  });

  // Limites exactes
  it("disponible à 8h exactement", () => {
    expect(isCommercialAvailable(8, 1)).toBe(true);
  });

  it("indisponible à 16h exactement (fin de journée)", () => {
    expect(isCommercialAvailable(16, 1)).toBe(false);
  });

  it("disponible à 15h59 (dernière heure)", () => {
    expect(isCommercialAvailable(15, 1)).toBe(true);
  });
});

// ─── calculateNextAvailability ─────────────────────────────────────

describe("calculateNextAvailability", () => {
  it("retourne null si au moins un commercial est disponible", () => {
    const commercials = [
      { initials: "DC", name: "Daniel", timezone: "Europe/Paris", localTime: "10:00", hour: 10, minute: 0, available: true, dayOfWeek: 1 },
      { initials: "JB", name: "Jean-Baptiste", timezone: "Europe/Paris", localTime: "10:00", hour: 10, minute: 0, available: false, dayOfWeek: 1 },
    ];
    expect(calculateNextAvailability(commercials)).toBeNull();
  });

  it("retourne une date future si personne n'est disponible (après les heures)", () => {
    const now = new Date("2026-02-10T18:00:00Z"); // 19h CET, mardi
    const commercials = [
      { initials: "DC", name: "Daniel", timezone: "Europe/Paris", localTime: "19:00", hour: 19, minute: 0, available: false, dayOfWeek: 2 },
      { initials: "JB", name: "Jean-Baptiste", timezone: "Europe/Paris", localTime: "19:00", hour: 19, minute: 0, available: false, dayOfWeek: 2 },
    ];
    const result = calculateNextAvailability(commercials, now);
    expect(result).not.toBeNull();
    const nextDate = new Date(result!);
    expect(nextDate.getTime()).toBeGreaterThan(now.getTime());
  });

  it("retourne une date pour le prochain jour ouvré si c'est le week-end", () => {
    const now = new Date("2026-02-14T10:00:00Z"); // Samedi 14h CET
    const commercials = [
      { initials: "DC", name: "Daniel", timezone: "Europe/Paris", localTime: "11:00", hour: 11, minute: 0, available: false, dayOfWeek: 6 },
      { initials: "JB", name: "Jean-Baptiste", timezone: "Europe/Paris", localTime: "11:00", hour: 11, minute: 0, available: false, dayOfWeek: 6 },
    ];
    const result = calculateNextAvailability(commercials, now);
    expect(result).not.toBeNull();
    const nextDate = new Date(result!);
    // Doit être au moins 2 jours plus tard (lundi)
    expect(nextDate.getTime()).toBeGreaterThan(now.getTime() + 24 * 3600000);
  });

  it("retourne une date le matin même si c'est avant 8h un jour de travail", () => {
    const now = new Date("2026-02-10T05:00:00Z"); // 6h CET, mardi
    const commercials = [
      { initials: "DC", name: "Daniel", timezone: "Europe/Paris", localTime: "06:00", hour: 6, minute: 0, available: false, dayOfWeek: 2 },
      { initials: "JB", name: "Jean-Baptiste", timezone: "Europe/Paris", localTime: "06:00", hour: 6, minute: 0, available: false, dayOfWeek: 2 },
    ];
    const result = calculateNextAvailability(commercials, now);
    expect(result).not.toBeNull();
    const nextDate = new Date(result!);
    // Devrait être dans environ 2h (6h -> 8h)
    const diffHours = (nextDate.getTime() - now.getTime()) / 3600000;
    expect(diffHours).toBeCloseTo(2, 0);
  });

  it("prend le commercial le plus proche si les fuseaux diffèrent", () => {
    const now = new Date("2026-02-10T18:00:00Z"); // Mardi
    const commercials = [
      // DC à Paris : 19h, fermé, prochain jour à 8h = 13h d'attente
      { initials: "DC", name: "Daniel", timezone: "Europe/Paris", localTime: "19:00", hour: 19, minute: 0, available: false, dayOfWeek: 2 },
      // JB à New York : 13h, encore ouvert... mais marqué indisponible pour le test
      // Simulons JB à Tokyo : 3h du matin mercredi, prochain 8h = 5h d'attente
      { initials: "JB", name: "Jean-Baptiste", timezone: "Asia/Tokyo", localTime: "03:00", hour: 3, minute: 0, available: false, dayOfWeek: 3 },
    ];
    const result = calculateNextAvailability(commercials, now);
    expect(result).not.toBeNull();
    const nextDate = new Date(result!);
    // JB est plus proche (5h vs 13h)
    const diffHours = (nextDate.getTime() - now.getTime()) / 3600000;
    expect(diffHours).toBeCloseTo(5, 0);
  });

  it("gère le vendredi soir → lundi matin", () => {
    const now = new Date("2026-02-13T17:00:00Z"); // Vendredi 18h CET
    const commercials = [
      { initials: "DC", name: "Daniel", timezone: "Europe/Paris", localTime: "18:00", hour: 18, minute: 0, available: false, dayOfWeek: 5 },
      { initials: "JB", name: "Jean-Baptiste", timezone: "Europe/Paris", localTime: "18:00", hour: 18, minute: 0, available: false, dayOfWeek: 5 },
    ];
    const result = calculateNextAvailability(commercials, now);
    expect(result).not.toBeNull();
    const nextDate = new Date(result!);
    // Vendredi 18h → Lundi 8h = 62h d'attente (6h + 24h + 24h + 8h)
    const diffHours = (nextDate.getTime() - now.getTime()) / 3600000;
    expect(diffHours).toBeCloseTo(62, 0);
  });

  it("gère le dimanche → lundi matin", () => {
    const now = new Date("2026-02-15T12:00:00Z"); // Dimanche 13h CET
    const commercials = [
      { initials: "DC", name: "Daniel", timezone: "Europe/Paris", localTime: "13:00", hour: 13, minute: 0, available: false, dayOfWeek: 7 },
    ];
    const result = calculateNextAvailability(commercials, now);
    expect(result).not.toBeNull();
    const nextDate = new Date(result!);
    // Dimanche 13h → Lundi 8h = 19h d'attente (11h + 8h)
    const diffHours = (nextDate.getTime() - now.getTime()) / 3600000;
    expect(diffHours).toBeCloseTo(19, 0);
  });
});
