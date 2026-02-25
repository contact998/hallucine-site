/**
 * Tests pour le système anti-spam robuste
 * 1. Honeypot
 * 2. Délai minimum
 * 3. Rate limiting
 * 4. Domaines email jetables
 * 5. Proof of Work
 * 6. Score de confiance composite
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  checkHoneypot,
  checkMinDelay,
  checkRateLimit,
  isDisposableEmail,
  verifyProofOfWork,
  computeSpamScore,
  resetRateLimit,
} from "./antispam";

// ─── 1. Tests Honeypot ──────────────────────────────────────────────────────

describe("Anti-spam — Honeypot", () => {
  it("détecte un bot quand le champ honeypot est rempli", () => {
    expect(checkHoneypot("spam content")).toBe(true);
    expect(checkHoneypot("http://spam.com")).toBe(true);
    expect(checkHoneypot("a")).toBe(true);
  });

  it("laisse passer quand le champ honeypot est vide", () => {
    expect(checkHoneypot("")).toBe(false);
    expect(checkHoneypot(undefined)).toBe(false);
    expect(checkHoneypot("   ")).toBe(false);
  });
});

// ─── 2. Tests Délai Minimum ─────────────────────────────────────────────────

describe("Anti-spam — Délai minimum", () => {
  it("détecte une soumission trop rapide (< 5 secondes)", () => {
    const justNow = Date.now() - 1000;
    expect(checkMinDelay(justNow, 5000)).toBe(true);
  });

  it("laisse passer une soumission après 5 secondes", () => {
    const fiveSecondsAgo = Date.now() - 6000;
    expect(checkMinDelay(fiveSecondsAgo, 5000)).toBe(false);
  });

  it("laisse passer si pas de timestamp", () => {
    expect(checkMinDelay(undefined)).toBe(false);
  });
});

// ─── 3. Tests Rate Limiting ─────────────────────────────────────────────────

describe("Anti-spam — Rate limiting", () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it("autorise les premières soumissions", () => {
    const result = checkRateLimit("192.168.1.1");
    expect(result.blocked).toBe(false);
    expect(result.count).toBe(1);
  });

  it("bloque après 5 soumissions par heure", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("192.168.1.2");
    }
    const result = checkRateLimit("192.168.1.2");
    expect(result.blocked).toBe(true);
  });

  it("ne bloque pas des IPs différentes", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("192.168.1.3");
    }
    const result = checkRateLimit("10.0.0.1");
    expect(result.blocked).toBe(false);
  });
});

// ─── 4. Tests Domaines Email Jetables ───────────────────────────────────────

describe("Anti-spam — Domaines jetables", () => {
  it("détecte les domaines jetables connus", () => {
    expect(isDisposableEmail("test@mailinator.com")).toBe(true);
    expect(isDisposableEmail("test@yopmail.com")).toBe(true);
    expect(isDisposableEmail("test@guerrillamail.com")).toBe(true);
    expect(isDisposableEmail("test@tempmail.com")).toBe(true);
    expect(isDisposableEmail("test@10minutemail.com")).toBe(true);
  });

  it("laisse passer les domaines légitimes", () => {
    expect(isDisposableEmail("user@gmail.com")).toBe(false);
    expect(isDisposableEmail("user@outlook.com")).toBe(false);
    expect(isDisposableEmail("user@yahoo.fr")).toBe(false);
    expect(isDisposableEmail("contact@entreprise.fr")).toBe(false);
  });

  it("gère les emails invalides", () => {
    expect(isDisposableEmail("pasdearobase")).toBe(false);
    expect(isDisposableEmail("")).toBe(false);
  });
});

// ─── 5. Tests Proof of Work ─────────────────────────────────────────────────

describe("Anti-spam — Proof of Work", () => {
  it("valide un PoW correct", async () => {
    // Pré-calculer un nonce valide de manière synchrone (sans await dans la boucle)
    const challenge = "test_pow_fixed";
    const encoder = new TextEncoder();
    let nonce = 0;
    let found = false;

    // Chercher un nonce valide (boucle synchrone, pas de yield)
    for (let i = 0; i < 1000000; i++) {
      const data = `${challenge}:${i}`;
      const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      if (hashHex.startsWith("0000")) {
        nonce = i;
        found = true;
        break;
      }
    }

    expect(found).toBe(true);
    const result = await verifyProofOfWork(challenge, nonce);
    expect(result).toBe(true);
  }, 30000); // timeout 30s

  it("rejette si challenge ou nonce manquant", async () => {
    expect(await verifyProofOfWork(undefined, 123)).toBe(false);
    expect(await verifyProofOfWork("challenge", undefined)).toBe(false);
    expect(await verifyProofOfWork(undefined, undefined)).toBe(false);
  });
});

// ─── 6. Tests Score Composite ───────────────────────────────────────────────

describe("Anti-spam — Score composite", () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it("donne un bon score pour une soumission légitime avec PoW", async () => {
    const challenge = "legit_test";
    const encoder = new TextEncoder();
    let nonce = 0;
    while (true) {
      const data = `${challenge}:${nonce}`;
      const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      if (hashHex.startsWith("0000")) break;
      nonce++;
    }

    const result = await computeSpamScore({
      honeypot: "",
      timestamp: Date.now() - 30000,
      ip: "1.2.3.4",
      email: "client@gmail.com",
      powChallenge: challenge,
      powNonce: nonce,
    });

    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.blocked).toBe(false);
  });

  it("bloque un bot avec honeypot rempli", async () => {
    const result = await computeSpamScore({
      honeypot: "spam bot content",
      timestamp: Date.now() - 30000,
      ip: "5.6.7.8",
      email: "bot@spam.com",
    });

    expect(result.score).toBeLessThanOrEqual(30);
    expect(result.blocked).toBe(true);
    expect(result.reasons).toContain("Honeypot rempli");
  });

  it("pénalise un email jetable", async () => {
    const result = await computeSpamScore({
      honeypot: "",
      timestamp: Date.now() - 30000,
      ip: "9.10.11.12",
      email: "test@mailinator.com",
    });

    expect(result.score).toBeLessThan(70);
    expect(result.reasons.some(r => r.includes("jetable"))).toBe(true);
  });

  it("pénalise une soumission trop rapide", async () => {
    const result = await computeSpamScore({
      honeypot: "",
      timestamp: Date.now() - 1000,
      ip: "13.14.15.16",
      email: "user@gmail.com",
    });

    expect(result.score).toBeLessThan(80);
    expect(result.reasons.some(r => r.includes("rapide"))).toBe(true);
  });

  it("pénalise l'absence de PoW", async () => {
    const result = await computeSpamScore({
      honeypot: "",
      timestamp: Date.now() - 30000,
      ip: "17.18.19.20",
      email: "user@gmail.com",
    });

    expect(result.reasons.some(r => r.includes("Proof of Work"))).toBe(true);
  });
});
