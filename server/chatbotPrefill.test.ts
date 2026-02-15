/**
 * Tests pour le système de pré-remplissage chatbot → SmartForm
 * Couvre : extraction LEAD_DATA, nettoyage du contenu, construction des URL params
 */
import { describe, it, expect } from "vitest";

// ─── Fonctions extraites du frontend pour test ─────────────────────────────

/** Parse le bloc LEAD_DATA caché dans la réponse du chatbot */
function parseLeadData(content: string): Record<string, unknown> | null {
  const match = content.match(/<!--LEAD_DATA:(.*?)-->/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

/** Nettoie le contenu du message en retirant le bloc LEAD_DATA */
function cleanContent(content: string): string {
  return content.replace(/<!--LEAD_DATA:.*?-->/g, "").trim();
}

/** Construire le message initial depuis les infos chatbot */
function buildChatbotMessage(params: {
  message?: string;
  eventType?: string;
  audience?: string;
  date?: string;
  budget?: string;
  need?: string;
}): string {
  const parts: string[] = [];
  if (params.message) parts.push(params.message);
  if (params.eventType && !params.message?.toLowerCase().includes(params.eventType.toLowerCase()))
    parts.push(`Type d'événement : ${params.eventType}`);
  if (params.audience && !params.message?.toLowerCase().includes(params.audience.toLowerCase()))
    parts.push(`Public : ${params.audience} spectateurs`);
  if (params.date && !params.message?.toLowerCase().includes(params.date.toLowerCase()))
    parts.push(`Date souhaitée : ${params.date}`);
  if (params.budget && !params.message?.toLowerCase().includes(params.budget.toLowerCase()))
    parts.push(`Budget : ${params.budget}`);
  if (params.need && !params.message?.toLowerCase().includes(params.need.toLowerCase())) {
    const needLabel = params.need === "achat" ? "Achat" : params.need === "location" ? "Location" : "Information";
    parts.push(`Besoin : ${needLabel}`);
  }
  return parts.join("\n");
}

/** Construire les URL params depuis les données du chatbot */
function buildUrlParams(leadData: Record<string, string | null>): string {
  const params = new URLSearchParams();
  const fields = [
    "product", "size", "name", "email", "phone", "company",
    "city", "country", "message", "eventType", "audience",
    "date", "budget", "need",
  ];
  for (const field of fields) {
    if (leadData[field]) params.set(field, leadData[field]!);
  }
  return params.toString();
}

// ─── Tests ─────────────────────────────────────────────────────────────────

describe("parseLeadData", () => {
  it("extrait les données LEAD_DATA d'un message chatbot", () => {
    const content = `Voici un écran 10m parfait pour votre festival ! <!--LEAD_DATA:{"product":"ecran","size":"9-10m","name":"","email":"","phone":"","company":"","city":"","country":"","eventType":"festival","audience":"800","date":"","budget":"","need":"achat","message":"Recherche écran 10m pour festival","ready":true}-->`;
    const data = parseLeadData(content);
    expect(data).not.toBeNull();
    expect(data!.product).toBe("ecran");
    expect(data!.size).toBe("9-10m");
    expect(data!.eventType).toBe("festival");
    expect(data!.audience).toBe("800");
    expect(data!.need).toBe("achat");
    expect(data!.message).toBe("Recherche écran 10m pour festival");
    expect(data!.ready).toBe(true);
  });

  it("extrait les données avec tous les champs remplis", () => {
    const content = `Super ! <!--LEAD_DATA:{"product":"tente","size":"6m","name":"Jean Dupont","email":"jean@mairie.fr","phone":"+33612345678","company":"Mairie de Lyon","city":"Lyon","country":"France","eventType":"mariage","audience":"200","date":"juin 2026","budget":"5000€","need":"location","message":"Location tente 6m pour mariage en juin","ready":true}-->`;
    const data = parseLeadData(content);
    expect(data).not.toBeNull();
    expect(data!.name).toBe("Jean Dupont");
    expect(data!.email).toBe("jean@mairie.fr");
    expect(data!.company).toBe("Mairie de Lyon");
    expect(data!.city).toBe("Lyon");
    expect(data!.eventType).toBe("mariage");
    expect(data!.budget).toBe("5000€");
    expect(data!.need).toBe("location");
  });

  it("retourne null si pas de LEAD_DATA", () => {
    const content = "Bonjour ! Comment puis-je vous aider ?";
    expect(parseLeadData(content)).toBeNull();
  });

  it("retourne null si JSON invalide", () => {
    const content = "Texte <!--LEAD_DATA:{invalid json}--> suite";
    expect(parseLeadData(content)).toBeNull();
  });

  it("gère les données partielles (champs vides)", () => {
    const content = `Ok <!--LEAD_DATA:{"product":"ecran","size":"","name":"","email":"","phone":"","company":"","city":"","country":"","eventType":"","audience":"","date":"","budget":"","need":null,"message":"","ready":false}-->`;
    const data = parseLeadData(content);
    expect(data).not.toBeNull();
    expect(data!.product).toBe("ecran");
    expect(data!.name).toBe("");
    expect(data!.ready).toBe(false);
  });
});

describe("cleanContent", () => {
  it("retire le bloc LEAD_DATA du message visible", () => {
    const content = `Voici un écran parfait ! <!--LEAD_DATA:{"product":"ecran","ready":true}--> N'hésitez pas.`;
    expect(cleanContent(content)).toBe("Voici un écran parfait !  N'hésitez pas.");
  });

  it("gère un message sans LEAD_DATA", () => {
    const content = "Bonjour, comment puis-je vous aider ?";
    expect(cleanContent(content)).toBe("Bonjour, comment puis-je vous aider ?");
  });

  it("retire le LEAD_DATA en fin de message", () => {
    const content = `Voici nos prix. <!--LEAD_DATA:{"product":"ecran","ready":false}-->`;
    expect(cleanContent(content)).toBe("Voici nos prix.");
  });

  it("gère plusieurs blocs LEAD_DATA (cas improbable)", () => {
    const content = `A <!--LEAD_DATA:{"a":1}--> B <!--LEAD_DATA:{"b":2}--> C`;
    expect(cleanContent(content)).toBe("A  B  C");
  });
});

describe("buildChatbotMessage", () => {
  it("construit un message complet depuis les infos chatbot", () => {
    const msg = buildChatbotMessage({
      message: "Recherche écran 10m pour festival",
      eventType: "festival",
      audience: "800",
      date: "juillet 2026",
      budget: "15000€",
      need: "achat",
    });
    // Le message principal est inclus
    expect(msg).toContain("Recherche écran 10m pour festival");
    // eventType est déjà dans le message, donc pas dupliqué
    expect(msg.split("festival").length).toBe(2); // une seule occurrence
    // Les autres infos sont ajoutées
    expect(msg).toContain("Public : 800 spectateurs");
    expect(msg).toContain("Date souhaitée : juillet 2026");
    expect(msg).toContain("Budget : 15000€");
    expect(msg).toContain("Besoin : Achat");
  });

  it("ne duplique pas les infos déjà dans le message", () => {
    const msg = buildChatbotMessage({
      message: "Besoin d'un écran pour un mariage de 200 personnes en juin 2026, budget 5000€",
      eventType: "mariage",
      audience: "200",
      date: "juin 2026",
      budget: "5000€",
      need: "achat",
    });
    // Toutes les infos sont dans le message, seul "Besoin : Achat" est ajouté
    expect(msg).toContain("Besoin d'un écran pour un mariage");
    expect(msg).toContain("Besoin : Achat");
    // Pas de duplication
    expect(msg.match(/mariage/g)?.length).toBe(1);
    expect(msg.match(/200/g)?.length).toBe(1);
  });

  it("retourne un message vide si aucune info", () => {
    expect(buildChatbotMessage({})).toBe("");
  });

  it("gère le besoin 'location'", () => {
    const msg = buildChatbotMessage({ need: "location" });
    expect(msg).toBe("Besoin : Location");
  });

  it("gère le besoin 'info'", () => {
    const msg = buildChatbotMessage({ need: "info" });
    expect(msg).toBe("Besoin : Information");
  });

  it("ajoute toutes les infos quand il n'y a pas de message principal", () => {
    const msg = buildChatbotMessage({
      eventType: "corporate",
      audience: "500",
      date: "mars 2026",
      budget: "10000€",
      need: "achat",
    });
    expect(msg).toContain("Type d'événement : corporate");
    expect(msg).toContain("Public : 500 spectateurs");
    expect(msg).toContain("Date souhaitée : mars 2026");
    expect(msg).toContain("Budget : 10000€");
    expect(msg).toContain("Besoin : Achat");
  });
});

describe("buildUrlParams", () => {
  it("construit les URL params depuis les données complètes", () => {
    const params = buildUrlParams({
      product: "ecran",
      size: "9-10m",
      name: "Jean Dupont",
      email: "jean@test.fr",
      phone: "+33612345678",
      company: "Mairie Lyon",
      city: "Lyon",
      country: "France",
      message: "Festival de cinéma",
      eventType: "festival",
      audience: "800",
      date: "juillet 2026",
      budget: "15000€",
      need: "achat",
    });
    const parsed = new URLSearchParams(params);
    expect(parsed.get("product")).toBe("ecran");
    expect(parsed.get("size")).toBe("9-10m");
    expect(parsed.get("name")).toBe("Jean Dupont");
    expect(parsed.get("email")).toBe("jean@test.fr");
    expect(parsed.get("message")).toBe("Festival de cinéma");
    expect(parsed.get("eventType")).toBe("festival");
    expect(parsed.get("need")).toBe("achat");
  });

  it("ignore les champs null ou vides", () => {
    const params = buildUrlParams({
      product: "ecran",
      size: null,
      name: null,
      email: "test@test.fr",
      phone: null,
      company: null,
      city: null,
      country: null,
      message: null,
      eventType: null,
      audience: null,
      date: null,
      budget: null,
      need: null,
    });
    const parsed = new URLSearchParams(params);
    expect(parsed.get("product")).toBe("ecran");
    expect(parsed.get("email")).toBe("test@test.fr");
    expect(parsed.has("name")).toBe(false);
    expect(parsed.has("company")).toBe(false);
    expect(parsed.has("message")).toBe(false);
  });

  it("retourne une chaîne vide si aucune donnée", () => {
    const params = buildUrlParams({});
    expect(params).toBe("");
  });
});

describe("Merge progressif des données LEAD_DATA", () => {
  it("fusionne les données de plusieurs réponses chatbot", () => {
    // Simule le merge progressif comme dans le composant React
    let leadData: Record<string, unknown> = {};

    // Première réponse : produit identifié
    const data1 = parseLeadData(
      `Ok <!--LEAD_DATA:{"product":"ecran","size":"9-10m","name":"","email":"","phone":"","company":"","city":"","country":"","eventType":"festival","audience":"","date":"","budget":"","need":null,"message":"","ready":false}-->`
    );
    if (data1) {
      leadData = {
        product: data1.product || leadData.product || null,
        size: data1.size || leadData.size || "",
        name: data1.name || leadData.name || "",
        email: data1.email || leadData.email || "",
        eventType: data1.eventType || leadData.eventType || "",
        audience: data1.audience || leadData.audience || "",
        message: data1.message || leadData.message || "",
      };
    }
    expect(leadData.product).toBe("ecran");
    expect(leadData.size).toBe("9-10m");
    expect(leadData.eventType).toBe("festival");

    // Deuxième réponse : nom et ville ajoutés
    const data2 = parseLeadData(
      `Super <!--LEAD_DATA:{"product":"ecran","size":"","name":"Jean Dupont","email":"","phone":"","company":"Mairie Lyon","city":"Lyon","country":"France","eventType":"","audience":"800","date":"","budget":"","need":"achat","message":"Écran 10m pour festival à Lyon, 800 spectateurs","ready":true}-->`
    );
    if (data2) {
      leadData = {
        product: data2.product || leadData.product || null,
        size: data2.size || leadData.size || "",
        name: data2.name || leadData.name || "",
        email: data2.email || leadData.email || "",
        eventType: data2.eventType || leadData.eventType || "",
        audience: data2.audience || leadData.audience || "",
        message: data2.message || leadData.message || "",
        city: data2.city || (leadData as Record<string, unknown>).city || "",
        country: data2.country || (leadData as Record<string, unknown>).country || "",
        company: data2.company || (leadData as Record<string, unknown>).company || "",
        need: data2.need || (leadData as Record<string, unknown>).need || null,
      };
    }
    // Les données se cumulent
    expect(leadData.product).toBe("ecran");
    expect(leadData.size).toBe("9-10m"); // conservé de la 1ère réponse
    expect(leadData.name).toBe("Jean Dupont");
    expect(leadData.city).toBe("Lyon");
    expect(leadData.company).toBe("Mairie Lyon");
    expect(leadData.audience).toBe("800");
    expect(leadData.need).toBe("achat");
    expect(leadData.message).toBe("Écran 10m pour festival à Lyon, 800 spectateurs");
  });
});
