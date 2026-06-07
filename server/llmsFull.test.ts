import { describe, it, expect } from "vitest";
import {
  buildLlmsFull,
  buildPageMarkdown,
  buildMarkdownForRoute,
  markdownFileForRequest,
  type LocaleResources,
} from "./llmsFull";

const RES: LocaleResources = {
  common: { site_name: "Hallucine", tagline: "Écrans gonflables géants" },
  home: { meta_desc: "Fabricant français d'écrans de cinéma gonflables." },
  ecrans: { meta_title: "Écrans Gonflables", meta_desc: "Notre gamme complète d'écrans.", hero_desc: "De 3 m à 24 m de large." },
  contact: { meta_title: "Contactez-nous", meta_desc: "Devis gratuit." },
  mobilier: { meta_desc: "page sans meta_title" }, // doit être ignorée
};

describe("buildLlmsFull", () => {
  const md = buildLlmsFull("fr", RES);

  it("écrit l'en-tête avec nom de marque, tagline et intro", () => {
    expect(md).toContain("# Hallucine — Écrans gonflables géants");
    expect(md).toContain("> Fabricant français d'écrans de cinéma gonflables.");
    expect(md).toContain("Site officiel : https://hallucinecran.fr");
  });

  it("liste une page avec son URL réelle (ROUTES) + description + intro", () => {
    expect(md).toContain("## Écrans gonflables");
    expect(md).toContain("[Écrans Gonflables](https://hallucinecran.fr/ecran-gonflable): Notre gamme complète d'écrans.");
    expect(md).toContain("De 3 m à 24 m de large.");
    expect(md).toContain("[Contactez-nous](https://hallucinecran.fr/contactez-nous): Devis gratuit.");
  });

  it("ignore les pages sans meta_title", () => {
    expect(md).not.toContain("page sans meta_title");
  });

  it("ajoute les versions linguistiques", () => {
    expect(md).toContain("## Versions linguistiques");
    expect(md).toContain("Français : https://hallucinecran.fr");
    expect(md).toContain("English : https://hallucinecran.com");
  });

  it("génère aussi pour une autre langue (EN → domaine .com)", () => {
    const en = buildLlmsFull("en", { ...RES });
    expect(en).toContain("[Écrans Gonflables](https://hallucinecran.com/inflatable-screen)");
  });
});

describe("buildPageMarkdown", () => {
  const PAGE: LocaleResources = {
    ecrans: {
      meta_title: "Écrans Gonflables",
      meta_desc: "Notre gamme complète d'écrans.",
      photo_alt: "alt décoratif à ignorer",
      hero_title: "L'écran de cinéma",
      hero_desc: "De 3 m à 24 m de large.",
      g1_title: "Écran géant à soufflerie",
      g1_desc: "Pour les très grandes projections.",
      faq_q1: "Quelle taille choisir ?",
      faq_a1: "Selon la distance de recul du public.",
      cta_contact: "Nous contacter",
    },
  };
  const md = buildPageMarkdown("fr", "ecrans", PAGE);

  it("met le titre en H1 et la meta_desc en citation", () => {
    expect(md).toContain("# Écrans Gonflables");
    expect(md).toContain("> Notre gamme complète d'écrans.");
  });

  it("rend le contenu réel : intro, sous-titres, FAQ", () => {
    expect(md).toContain("De 3 m à 24 m de large.");
    expect(md).toContain("## Écran géant à soufflerie");
    expect(md).toContain("Pour les très grandes projections.");
    expect(md).toContain("### Quelle taille choisir ?");
    expect(md).toContain("Selon la distance de recul du public.");
  });

  it("ignore les clés décoratives (alt, cta…)", () => {
    expect(md).not.toContain("alt décoratif");
    expect(md).not.toContain("Nous contacter");
  });

  it("termine par l'URL réelle de la page", () => {
    expect(md.trimEnd()).toMatch(/— Page : https:\/\/hallucinecran\.fr\/ecran-gonflable$/);
  });

  it("buildMarkdownForRoute route la home vers l'aperçu de site complet", () => {
    const home = buildMarkdownForRoute("fr", "home", {
      common: { site_name: "Hallucine", tagline: "Écrans gonflables" },
      home: { meta_desc: "Intro." },
    });
    expect(home).toContain("# Hallucine — Écrans gonflables");
    expect(home).toContain("## Versions linguistiques");
  });
});

describe("markdownFileForRequest", () => {
  it("résout la home et les pages FR (sans préfixe de langue)", () => {
    expect(markdownFileForRequest("/", "fr")).toBe("index.md");
    expect(markdownFileForRequest("/ecran-gonflable", "fr")).toBe("ecran-gonflable/index.md");
  });

  it("préfixe les autres langues et ignore le slash final + la query", () => {
    expect(markdownFileForRequest("/ecran-gonflable/", "it")).toBe("_lang_it/ecran-gonflable/index.md");
    expect(markdownFileForRequest("/tente-gonflable?x=1", "de")).toBe("_lang_de/tente-gonflable/index.md");
  });
});
