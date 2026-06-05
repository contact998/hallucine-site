import { describe, it, expect } from "vitest";
import { buildLlmsFull, type LocaleResources } from "./llmsFull";

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
