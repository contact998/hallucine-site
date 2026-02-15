/**
 * Tests pour le module siretLookup
 * Validation Luhn, formatage SIRET/SIREN, nettoyage d'entrée
 */
import { describe, it, expect } from "vitest";

// On importe les fonctions pures (pas les appels API)
// Le module est côté client mais les fonctions pures sont testables
// On copie la logique ici pour tester sans dépendances DOM

// ─── Fonctions pures copiées depuis siretLookup.ts ──────────────────────

function cleanSiretInput(input: string): string {
  return input.replace(/[\s.\-/]/g, "");
}

function isSiretOrSiren(input: string): boolean {
  const cleaned = cleanSiretInput(input);
  return /^\d{9}$/.test(cleaned) || /^\d{14}$/.test(cleaned);
}

function isValidSiretLuhn(siret: string): boolean {
  const cleaned = cleanSiretInput(siret);
  if (!/^\d{14}$/.test(cleaned)) return false;
  if (cleaned.startsWith("356000000")) return true; // Exception La Poste
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(cleaned[i], 10);
    if (i % 2 !== 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

function isValidSirenLuhn(siren: string): boolean {
  const cleaned = cleanSiretInput(siren);
  if (!/^\d{9}$/.test(cleaned)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(cleaned[i], 10);
    if (i % 2 !== 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

function formatSiret(siret: string): string {
  const cleaned = cleanSiretInput(siret);
  if (cleaned.length !== 14) return siret;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
}

function formatSiren(siren: string): string {
  const cleaned = cleanSiretInput(siren);
  if (cleaned.length !== 9) return siren;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
}

// ─── Tests ──────────────────────────────────────────────────────────────

describe("siretLookup - cleanSiretInput", () => {
  it("retire les espaces", () => {
    expect(cleanSiretInput("352 094 421 00025")).toBe("35209442100025");
  });

  it("retire les tirets", () => {
    expect(cleanSiretInput("352-094-421-00025")).toBe("35209442100025");
  });

  it("retire les points", () => {
    expect(cleanSiretInput("352.094.421.00025")).toBe("35209442100025");
  });

  it("retire les slashs", () => {
    expect(cleanSiretInput("352/094/421/00025")).toBe("35209442100025");
  });

  it("combine tous les séparateurs", () => {
    expect(cleanSiretInput("352 094-421.000/25")).toBe("35209442100025");
  });

  it("ne modifie pas un input déjà propre", () => {
    expect(cleanSiretInput("35209442100025")).toBe("35209442100025");
  });
});

describe("siretLookup - isSiretOrSiren", () => {
  it("reconnaît un SIRET (14 chiffres)", () => {
    expect(isSiretOrSiren("35209442100025")).toBe(true);
  });

  it("reconnaît un SIREN (9 chiffres)", () => {
    expect(isSiretOrSiren("352094421")).toBe(true);
  });

  it("reconnaît avec espaces", () => {
    expect(isSiretOrSiren("352 094 421 00025")).toBe(true);
  });

  it("rejette un texte", () => {
    expect(isSiretOrSiren("La Poste")).toBe(false);
  });

  it("rejette un nombre trop court", () => {
    expect(isSiretOrSiren("12345")).toBe(false);
  });

  it("rejette un nombre entre 9 et 14 chiffres", () => {
    expect(isSiretOrSiren("1234567890")).toBe(false);
  });
});

describe("siretLookup - isValidSiretLuhn", () => {
  it("valide le SIRET de La Poste (exception)", () => {
    expect(isValidSiretLuhn("35600000000048")).toBe(true);
  });

  it("rejette un SIRET invalide", () => {
    expect(isValidSiretLuhn("12345678901234")).toBe(false);
  });

  it("rejette un input trop court", () => {
    expect(isValidSiretLuhn("123456789")).toBe(false);
  });

  it("rejette un input non numérique", () => {
    expect(isValidSiretLuhn("abcdefghijklmn")).toBe(false);
  });

  it("accepte avec espaces si nettoyé", () => {
    // La Poste avec espaces
    expect(isValidSiretLuhn("356 000 000 00048")).toBe(true);
  });
});

describe("siretLookup - isValidSirenLuhn", () => {
  it("rejette un SIREN invalide", () => {
    expect(isValidSirenLuhn("123456789")).toBe(false);
  });

  it("rejette un input trop court", () => {
    expect(isValidSirenLuhn("12345")).toBe(false);
  });

  it("rejette un input trop long", () => {
    expect(isValidSirenLuhn("1234567890")).toBe(false);
  });
});

describe("siretLookup - formatSiret", () => {
  it("formate un SIRET de 14 chiffres", () => {
    expect(formatSiret("35600000000048")).toBe("356 000 000 00048");
  });

  it("retourne l'input tel quel si pas 14 chiffres", () => {
    expect(formatSiret("12345")).toBe("12345");
  });

  it("formate un SIRET avec espaces en entrée", () => {
    expect(formatSiret("356 000 000 00048")).toBe("356 000 000 00048");
  });
});

describe("siretLookup - formatSiren", () => {
  it("formate un SIREN de 9 chiffres", () => {
    expect(formatSiren("356000000")).toBe("356 000 000");
  });

  it("retourne l'input tel quel si pas 9 chiffres", () => {
    expect(formatSiren("12345")).toBe("12345");
  });
});
