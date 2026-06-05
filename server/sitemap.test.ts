import { describe, it, expect } from "vitest";
import { buildSitemapXml, type SitemapPost } from "./sitemap";

// Cluster de traductions : 1 article FR (parent) + EN/DE rattachés via parentId
const POSTS: SitemapPost[] = [
  { id: 1, slug: "mon-article", lang: "fr", parentId: null, updatedAt: new Date("2026-01-15T00:00:00Z") },
  { id: 2, slug: "my-article", lang: "en", parentId: 1, updatedAt: new Date("2026-01-16T00:00:00Z") },
  { id: 3, slug: "mein-artikel", lang: "de", parentId: 1, updatedAt: new Date("2026-01-16T00:00:00Z") },
];

describe("buildSitemapXml — routes statiques (host-aware, un par TLD)", () => {
  it("liste les routes de la langue sur SON domaine uniquement", () => {
    const xml = buildSitemapXml("fr", []);
    expect(xml).toContain("<loc>https://hallucinecran.fr/</loc>"); // home
    expect(xml).toContain("<loc>https://hallucinecran.fr/ecran-gonflable</loc>");
    // aucun <loc> d'un autre TLD (les autres langues n'apparaissent qu'en hreflang)
    expect(xml).not.toContain("<loc>https://hallucinecran.com/");
    expect(xml).not.toContain("<loc>https://hallucinecran.de/");
  });

  it("le sitemap EN liste le domaine .com", () => {
    const xml = buildSitemapXml("en", []);
    expect(xml).toContain("<loc>https://hallucinecran.com/inflatable-screen</loc>");
    expect(xml).not.toContain("<loc>https://hallucinecran.fr/");
  });

  it("inclut les hreflang vers les 5 TLD + x-default", () => {
    const xml = buildSitemapXml("fr", []);
    expect(xml).toContain('hreflang="en" href="https://hallucinecran.com/inflatable-screen"');
    expect(xml).toContain('hreflang="de" href="https://hallucinecran.de/aufblasbarer-bildschirm"');
    expect(xml).toContain('hreflang="x-default"');
  });

  it("exclut la route de redirection trouver-distributeur", () => {
    const xml = buildSitemapXml("fr", []);
    expect(xml).not.toContain("/trouver-distributeur</loc>");
  });

  it("produit un urlset valide même sans article", () => {
    const xml = buildSitemapXml("fr", []);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<urlset");
    expect(xml).toContain("</urlset>");
    // pas d'URL d'article (mais la page liste /blog existe en route statique)
    expect(xml).not.toContain("/blog/");
  });
});

describe("buildSitemapXml — articles de blog multilingues", () => {
  it("place chaque article sur le TLD de SA langue", () => {
    const fr = buildSitemapXml("fr", POSTS);
    expect(fr).toContain("<loc>https://hallucinecran.fr/blog/mon-article</loc>");
    expect(fr).not.toContain("<loc>https://hallucinecran.fr/blog/my-article</loc>"); // EN pas sur .fr

    const en = buildSitemapXml("en", POSTS);
    expect(en).toContain("<loc>https://hallucinecran.com/blog/my-article</loc>");
    expect(en).not.toContain("<loc>https://hallucinecran.com/blog/mon-article</loc>");
  });

  it("génère le hreflang croisé des traductions via parentId", () => {
    const fr = buildSitemapXml("fr", POSTS);
    expect(fr).toContain('hreflang="en" href="https://hallucinecran.com/blog/my-article"');
    expect(fr).toContain('hreflang="de" href="https://hallucinecran.de/blog/mein-artikel"');
    expect(fr).toContain('hreflang="fr" href="https://hallucinecran.fr/blog/mon-article"');
  });

  it("émet un lastmod par article", () => {
    const fr = buildSitemapXml("fr", POSTS);
    expect(fr).toContain("<lastmod>2026-01-15</lastmod>");
  });

  it("garde-fou : au moins une URL d'article quand des articles sont fournis", () => {
    const fr = buildSitemapXml("fr", POSTS);
    const articleLocs = (fr.match(/<loc>https:\/\/[^<]+\/blog\/[^<]+<\/loc>/g) || []).length;
    expect(articleLocs).toBeGreaterThan(0);
  });
});
