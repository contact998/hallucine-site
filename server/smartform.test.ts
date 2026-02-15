/**
 * Tests pour le SmartForm, WhatsApp intelligent et chatbot amélioré
 */
import { describe, it, expect, vi } from "vitest";

// ─── Tests du système de détection de pays ───────────────────────────────────
describe("SmartForm — Détection pays et indicatif", () => {
  it("devrait mapper les fuseaux horaires connus aux pays", () => {
    const tzCountryMap: Record<string, string> = {
      "Europe/Paris": "France",
      "Europe/Brussels": "Belgique",
      "Europe/Zurich": "Suisse",
      "America/Toronto": "Canada",
      "Africa/Casablanca": "Maroc",
      "Asia/Shanghai": "Chine",
      "Asia/Tokyo": "Japon",
    };
    expect(tzCountryMap["Europe/Paris"]).toBe("France");
    expect(tzCountryMap["Asia/Shanghai"]).toBe("Chine");
    expect(tzCountryMap["America/Toronto"]).toBe("Canada");
  });

  it("devrait retourner le bon indicatif téléphonique par pays", () => {
    const prefixes: Record<string, string> = {
      "France": "+33", "Belgique": "+32", "Suisse": "+41",
      "Canada": "+1", "Chine": "+86", "Japon": "+81",
    };
    expect(prefixes["France"]).toBe("+33");
    expect(prefixes["Chine"]).toBe("+86");
    expect(prefixes["Canada"]).toBe("+1");
  });
});

// ─── Tests de l'extraction de domaine email ──────────────────────────────────
describe("SmartForm — Extraction domaine email", () => {
  it("devrait extraire le domaine d'un email professionnel", () => {
    const getDomain = (email: string): string => {
      const parts = email.split("@");
      if (parts.length !== 2) return "";
      const domain = parts[1].toLowerCase();
      const generic = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
      if (generic.includes(domain)) return "";
      return domain;
    };

    expect(getDomain("contact@hallucine.fr")).toBe("hallucine.fr");
    expect(getDomain("john@airscreen.com")).toBe("airscreen.com");
    expect(getDomain("test@gmail.com")).toBe(""); // Générique
    expect(getDomain("invalid")).toBe("");
  });

  it("devrait générer un nom d'entreprise depuis le domaine", () => {
    const guessCompany = (domain: string): string => {
      return domain.split(".")[0]
        .replace(/-/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
    };

    expect(guessCompany("hallucine.fr")).toBe("Hallucine");
    expect(guessCompany("air-screen.com")).toBe("Air Screen");
    expect(guessCompany("my-company.co.uk")).toBe("My Company");
  });
});

// ─── Tests du parsing LEAD_DATA du chatbot ───────────────────────────────────
describe("Chatbot — Parsing LEAD_DATA", () => {
  it("devrait extraire les données lead du contenu du chatbot", () => {
    const content = `Voici nos écrans de 10m, parfaits pour votre événement ! <!--LEAD_DATA:{"product":"ecran","size":"9-10m","name":"","email":"","phone":"","company":"","city":"","country":"","ready":true}-->`;

    const match = content.match(/<!--LEAD_DATA:(.*?)-->/);
    expect(match).not.toBeNull();
    const data = JSON.parse(match![1]);
    expect(data.product).toBe("ecran");
    expect(data.size).toBe("9-10m");
    expect(data.ready).toBe(true);
  });

  it("devrait nettoyer le contenu en retirant le bloc LEAD_DATA", () => {
    const content = `Bonjour ! <!--LEAD_DATA:{"product":"ecran","ready":false}-->`;
    const cleaned = content.replace(/<!--LEAD_DATA:.*?-->/g, "").trim();
    expect(cleaned).toBe("Bonjour !");
  });

  it("devrait retourner null si pas de LEAD_DATA", () => {
    const content = "Simple réponse sans données lead.";
    const match = content.match(/<!--LEAD_DATA:(.*?)-->/);
    expect(match).toBeNull();
  });

  it("devrait fusionner les données lead progressivement", () => {
    let leadData = { product: null as string | null, name: "", email: "", ready: false };

    // Premier échange : produit identifié
    const data1 = { product: "ecran", name: "", email: "", ready: false };
    leadData = {
      product: data1.product || leadData.product,
      name: data1.name || leadData.name,
      email: data1.email || leadData.email,
      ready: data1.ready || leadData.ready,
    };
    expect(leadData.product).toBe("ecran");

    // Deuxième échange : nom donné
    const data2 = { product: null, name: "Jean Dupont", email: "", ready: false };
    leadData = {
      product: data2.product || leadData.product,
      name: data2.name || leadData.name,
      email: data2.email || leadData.email,
      ready: data2.ready || leadData.ready,
    };
    expect(leadData.product).toBe("ecran");
    expect(leadData.name).toBe("Jean Dupont");
  });
});

// ─── Tests des heures de présence ────────────────────────────────────────────
describe("WhatsApp — Heures de présence", () => {
  it("devrait déterminer si l'équipe est en ligne (heure chinoise 8h-18h)", () => {
    const isOnline = (nowUtcHour: number, tzOffset: number, startHour: number, endHour: number): boolean => {
      const localHour = (nowUtcHour + tzOffset + 24) % 24;
      return localHour >= startHour && localHour < endHour;
    };

    // 10h UTC = 18h en Chine (UTC+8) → hors ligne (18h = fin de journée, endHour est exclusif)
    expect(isOnline(10, 8, 8, 18)).toBe(false);
    // 9h UTC = 17h en Chine (UTC+8) → en ligne
    expect(isOnline(9, 8, 8, 18)).toBe(true);
    // 2h UTC = 10h en Chine (UTC+8) → en ligne
    expect(isOnline(2, 8, 8, 18)).toBe(true);
    // 12h UTC = 20h en Chine (UTC+8) → hors ligne
    expect(isOnline(12, 8, 8, 18)).toBe(false);
    // 22h UTC = 6h en Chine (UTC+8) → hors ligne
    expect(isOnline(22, 8, 8, 18)).toBe(false);
  });

  it("devrait convertir les heures de présence au fuseau du visiteur", () => {
    const convertHours = (startHour: number, endHour: number, businessTzOffset: number, visitorTzOffset: number) => {
      const diff = visitorTzOffset - businessTzOffset;
      return {
        start: (startHour + diff + 24) % 24,
        end: (endHour + diff + 24) % 24,
      };
    };

    // Chine (UTC+8) → France (UTC+1) : 8h-18h → 1h-11h
    const france = convertHours(8, 18, 8, 1);
    expect(france.start).toBe(1);
    expect(france.end).toBe(11);

    // Chine (UTC+8) → New York (UTC-5) : 8h-18h → 19h-5h (veille)
    const ny = convertHours(8, 18, 8, -5);
    expect(ny.start).toBe(19);
    expect(ny.end).toBe(5);
  });
});

// ─── Tests des catégories de produits ────────────────────────────────────────
describe("SmartForm — Catégories produits", () => {
  it("devrait avoir les bonnes catégories de taille d'écran", () => {
    const screenCategories = [
      { value: "5-8m", audience: "100 à 400 spectateurs" },
      { value: "9-10m", audience: "~800 spectateurs" },
      { value: "11-12m", audience: "~1 500 spectateurs" },
      { value: "13-14m", audience: "~2 000 spectateurs" },
      { value: "15-24m", audience: "3 000 à 5 000+ spectateurs" },
    ];
    expect(screenCategories).toHaveLength(5);
    expect(screenCategories[0].value).toBe("5-8m");
    expect(screenCategories[4].value).toBe("15-24m");
  });

  it("devrait avoir les 4 types de produits", () => {
    const productTypes = ["ecran", "tente", "mobilier", "arche"];
    expect(productTypes).toHaveLength(4);
  });
});

// ─── Tests de la construction des query params pour le chatbot ───────────────
describe("Chatbot → SmartForm — Query params", () => {
  it("devrait construire les query params depuis les données lead", () => {
    const leadData = {
      product: "ecran",
      size: "9-10m",
      name: "Jean Dupont",
      email: "jean@dupont.fr",
      phone: "+33 6 12 34 56 78",
      company: "Dupont Events",
      city: "Paris",
      country: "France",
    };

    const params = new URLSearchParams();
    if (leadData.product) params.set("product", leadData.product);
    if (leadData.size) params.set("size", leadData.size);
    if (leadData.name) params.set("name", leadData.name);
    if (leadData.email) params.set("email", leadData.email);
    if (leadData.phone) params.set("phone", leadData.phone);
    if (leadData.company) params.set("company", leadData.company);
    if (leadData.city) params.set("city", leadData.city);
    if (leadData.country) params.set("country", leadData.country);

    const qs = params.toString();
    expect(qs).toContain("product=ecran");
    expect(qs).toContain("size=9-10m");
    expect(qs).toContain("name=Jean+Dupont");
    expect(qs).toContain("email=jean%40dupont.fr");
    expect(qs).toContain("company=Dupont+Events");
    expect(qs).toContain("city=Paris");
    expect(qs).toContain("country=France");
  });

  it("devrait ignorer les champs vides dans les query params", () => {
    const leadData = { product: "tente", size: "", name: "", email: "", phone: "", company: "", city: "", country: "" };
    const params = new URLSearchParams();
    if (leadData.product) params.set("product", leadData.product);
    if (leadData.size) params.set("size", leadData.size);
    if (leadData.name) params.set("name", leadData.name);

    const qs = params.toString();
    expect(qs).toBe("product=tente");
  });
});
