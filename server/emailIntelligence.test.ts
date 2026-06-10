/**
 * Tests pour le module d'extraction intelligente depuis l'email
 * Couvre tous les cas : classiques, séparateurs variés, initiales,
 * domaines génériques, rôles génériques, internationaux, cas tordus
 */
import { describe, it, expect } from "vitest";

// Le module est côté client, on l'importe directement pour tester la logique pure
import { extractFromEmail, isGenericDomain, getDomainName } from "../client/src/lib/emailIntelligence";

describe("extractFromEmail", () => {
  // ─── Cas classiques (faciles) ─────────────────────────────────────
  describe("cas classiques prenom.nom@entreprise", () => {
    it("jean.dupont@mairie-lyon.fr", () => {
      const r = extractFromEmail("jean.dupont@mairie-lyon.fr");
      expect(r.prenom).toBe("Jean");
      expect(r.nom).toBe("Dupont");
      expect(r.entreprise).toBe("Mairie Lyon");
      expect(r.confidence).toBe("high");
    });

    it("sophie.martin@festival-avignon.com", () => {
      const r = extractFromEmail("sophie.martin@festival-avignon.com");
      expect(r.prenom).toBe("Sophie");
      expect(r.nom).toBe("Martin");
      expect(r.entreprise).toBe("Festival Avignon");
    });

    it("pierre.lefebvre@sodexo.com", () => {
      const r = extractFromEmail("pierre.lefebvre@sodexo.com");
      expect(r.prenom).toBe("Pierre");
      expect(r.nom).toBe("Lefebvre");
      expect(r.entreprise).toBe("Sodexo");
    });
  });

  // ─── Cas avec séparateurs variés ──────────────────────────────────
  describe("separateurs varies (underscore, tiret)", () => {
    it("anne_sophie.petit@decathlon.com", () => {
      const r = extractFromEmail("anne_sophie.petit@decathlon.com");
      // anne_sophie est le premier segment (séparé par .), petit le second
      expect(r.nom).toBe("Petit");
      expect(r.entreprise).toBe("Decathlon");
    });

    it("jean_dupont@yahoo.fr (domaine generique)", () => {
      const r = extractFromEmail("jean_dupont@yahoo.fr");
      expect(r.prenom).toBe("Jean");
      expect(r.nom).toBe("Dupont");
      expect(r.entreprise).toBe("");
    });
  });

  // ─── Cas avec initiales / abrégés ────────────────────────────────
  describe("initiales et abreviations", () => {
    it("m.bernard@gl-events.com", () => {
      const r = extractFromEmail("m.bernard@gl-events.com");
      expect(r.prenom).toBe("M.");
      expect(r.nom).toBe("Bernard");
      expect(r.entreprise).toBe("Gl Events");
    });

    it("jb.martin@publicis.fr", () => {
      const r = extractFromEmail("jb.martin@publicis.fr");
      expect(r.prenom).toBe("J.B.");
      expect(r.nom).toBe("Martin");
      expect(r.entreprise).toBe("Publicis");
    });

    it("p.durand@cci-paris.fr", () => {
      const r = extractFromEmail("p.durand@cci-paris.fr");
      expect(r.prenom).toBe("P.");
      expect(r.nom).toBe("Durand");
      expect(r.entreprise).toBe("Cci Paris");
    });

    it("fdupont@bouygues.com (initiale collee)", () => {
      const r = extractFromEmail("fdupont@bouygues.com");
      expect(r.prenom).toBe("F.");
      expect(r.nom).toBe("Dupont");
      expect(r.entreprise).toBe("Bouygues");
    });
  });

  // ─── Domaines génériques (pas d'entreprise) ──────────────────────
  describe("domaines generiques", () => {
    it("sophie.martin@gmail.com", () => {
      const r = extractFromEmail("sophie.martin@gmail.com");
      expect(r.prenom).toBe("Sophie");
      expect(r.nom).toBe("Martin");
      expect(r.entreprise).toBe("");
    });

    it("thomas.legrand@orange.fr", () => {
      const r = extractFromEmail("thomas.legrand@orange.fr");
      expect(r.prenom).toBe("Thomas");
      expect(r.nom).toBe("Legrand");
      expect(r.entreprise).toBe("");
    });

    it("a.benali@free.fr", () => {
      const r = extractFromEmail("a.benali@free.fr");
      expect(r.prenom).toBe("A.");
      expect(r.nom).toBe("Benali");
      expect(r.entreprise).toBe("");
    });
  });

  // ─── Cas ambigus / rôles génériques ──────────────────────────────
  describe("roles generiques (pas de nom a extraire)", () => {
    it("contact@festivaldavignon.com", () => {
      const r = extractFromEmail("contact@festivaldavignon.com");
      expect(r.prenom).toBe("");
      expect(r.nom).toBe("");
      expect(r.entreprise).not.toBe("");
    });

    it("info@ecrans-geants.fr", () => {
      const r = extractFromEmail("info@ecrans-geants.fr");
      expect(r.prenom).toBe("");
      expect(r.nom).toBe("");
      expect(r.entreprise).toBe("Ecrans Geants");
    });

    it("direction@mairie-saint-malo.fr", () => {
      const r = extractFromEmail("direction@mairie-saint-malo.fr");
      expect(r.prenom).toBe("");
      expect(r.nom).toBe("");
      expect(r.entreprise).not.toBe("");
    });

    it("admin@123-events.com", () => {
      const r = extractFromEmail("admin@123-events.com");
      expect(r.prenom).toBe("");
      expect(r.nom).toBe("");
      expect(r.entreprise).not.toBe("");
    });

    it("noreply@amazon.fr", () => {
      const r = extractFromEmail("noreply@amazon.fr");
      expect(r.prenom).toBe("");
      expect(r.nom).toBe("");
    });
  });

  // ─── Cas internationaux ──────────────────────────────────────────
  describe("cas internationaux", () => {
    it("mohammed.alami@ocp.ma", () => {
      const r = extractFromEmail("mohammed.alami@ocp.ma");
      expect(r.prenom).toBe("Mohammed");
      expect(r.nom).toBe("Alami");
      expect(r.entreprise).toBe("OCP");
    });

    it("hans.mueller@siemens.de", () => {
      const r = extractFromEmail("hans.mueller@siemens.de");
      expect(r.prenom).toBe("Hans");
      expect(r.nom).toBe("Mueller");
      expect(r.entreprise).toBe("Siemens");
    });

    it("carlos.garcia@ayuntamiento-madrid.es", () => {
      const r = extractFromEmail("carlos.garcia@ayuntamiento-madrid.es");
      expect(r.prenom).toBe("Carlos");
      expect(r.nom).toBe("Garcia");
      expect(r.entreprise).toBe("Ayuntamiento Madrid");
    });

    it("yuki.tanaka@sony.co.jp", () => {
      const r = extractFromEmail("yuki.tanaka@sony.co.jp");
      expect(r.prenom).toBe("Yuki");
      expect(r.nom).toBe("Tanaka");
      expect(r.entreprise).toBe("Sony");
    });
  });

  // ─── Cas tordus ──────────────────────────────────────────────────
  describe("cas tordus et edge cases", () => {
    it("jd@me.com (trop court)", () => {
      const r = extractFromEmail("jd@me.com");
      // 'jd' est trop court pour être fiable, mais on peut tenter
      expect(r.entreprise).toBe(""); // me.com est generique
    });

    it("x@x.com (inutilisable)", () => {
      const r = extractFromEmail("x@x.com");
      expect(r.prenom).toBe("");
      expect(r.nom).toBe("");
    });

    it("dupont2024@laposte.net (nom + chiffres)", () => {
      const r = extractFromEmail("dupont2024@laposte.net");
      expect(r.nom).toBe("Dupont");
      expect(r.entreprise).toBe("");
    });

    it("le.petit.prince@saint-exupery.org (3 segments)", () => {
      const r = extractFromEmail("le.petit.prince@saint-exupery.org");
      expect(r.nom).toBe("Prince");
      expect(r.entreprise).not.toBe("");
    });

    it("ceo@startup.io (role C-level)", () => {
      const r = extractFromEmail("ceo@startup.io");
      expect(r.prenom).toBe("");
      expect(r.nom).toBe("");
      expect(r.entreprise).toBe("Startup");
    });

    it("email vide", () => {
      const r = extractFromEmail("");
      expect(r.prenom).toBe("");
      expect(r.nom).toBe("");
      expect(r.entreprise).toBe("");
      expect(r.confidence).toBe("low");
    });

    it("email sans @", () => {
      const r = extractFromEmail("pasdearobase");
      expect(r.prenom).toBe("");
      expect(r.nom).toBe("");
    });
  });

  // ─── Confiance ───────────────────────────────────────────────────
  describe("niveaux de confiance", () => {
    it("high quand prenom connu + nom + entreprise", () => {
      const r = extractFromEmail("jean.dupont@mairie-lyon.fr");
      expect(r.confidence).toBe("high");
    });

    it("medium quand prenom inconnu + nom", () => {
      const r = extractFromEmail("xavier.lefranc@gmail.com");
      expect(["medium", "high"]).toContain(r.confidence);
    });

    it("low quand un seul segment", () => {
      const r = extractFromEmail("dupont@gmail.com");
      expect(r.confidence).toBe("low");
    });
  });
});

describe("isGenericDomain", () => {
  it("gmail.com est generique", () => {
    expect(isGenericDomain("test@gmail.com")).toBe(true);
  });

  it("orange.fr est generique", () => {
    expect(isGenericDomain("test@orange.fr")).toBe(true);
  });

  it("mairie-lyon.fr n'est pas generique", () => {
    expect(isGenericDomain("test@mairie-lyon.fr")).toBe(false);
  });

  it("protonmail.com est generique", () => {
    expect(isGenericDomain("test@protonmail.com")).toBe(true);
  });
});

describe("getDomainName", () => {
  it("extrait le nom de domaine non-generique", () => {
    expect(getDomainName("test@sodexo.com")).toBe("Sodexo");
  });

  it("retourne vide pour domaine generique", () => {
    expect(getDomainName("test@gmail.com")).toBe("");
  });

  it("gere les domaines composes", () => {
    expect(getDomainName("test@mairie-lyon.fr")).toBe("Mairie Lyon");
  });

  it("gere les acronymes courts", () => {
    expect(getDomainName("test@ocp.ma")).toBe("OCP");
  });
});

// ─── Tests pour la route d'abandon ──────────────────────────────────
// Intégration : nécessite un serveur lancé. Opt-in explicite :
//   TEST_BASE_URL=http://localhost:3000 pnpm test
const ABANDON_BASE = process.env.TEST_BASE_URL ?? "http://localhost:3000";
describe.skipIf(!process.env.TEST_BASE_URL)("abandon partial route", () => {
  it("la route /api/abandon-partial accepte un POST valide", { timeout: 15000 }, async () => {
    const response = await fetch(`${ABANDON_BASE}/api/abandon-partial`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test.abandon@example.com",
        prenom: "Test",
        nom: "Abandon",
        lastStep: 2,
        totalSteps: 7,
      }),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it("la route /api/abandon-partial rejette un POST sans email", async () => {
    const response = await fetch(`${ABANDON_BASE}/api/abandon-partial`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prenom: "Test",
        lastStep: 1,
        totalSteps: 7,
      }),
    });
    expect(response.status).toBe(400);
  });

  it("la route /api/abandon-partial rejette un email invalide", async () => {
    const response = await fetch(`${ABANDON_BASE}/api/abandon-partial`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "pasunemail",
        lastStep: 1,
        totalSteps: 7,
      }),
    });
    expect(response.status).toBe(400);
  });
});
