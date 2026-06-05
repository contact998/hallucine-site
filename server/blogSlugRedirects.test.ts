import { describe, it, expect } from "vitest";
import { BLOG_SLUG_REDIRECTS } from "./blogSlugRedirects";
import { slugify } from "./blog";

describe("BLOG_SLUG_REDIRECTS", () => {
  const entries = Object.entries(BLOG_SLUG_REDIRECTS);

  it("ne contient aucune redirection vers soi-même", () => {
    for (const [from, to] of entries) expect(from).not.toBe(to);
  });

  it("ne crée aucune boucle (aucune cible n'est elle-même une clé)", () => {
    const keys = new Set(Object.keys(BLOG_SLUG_REDIRECTS));
    for (const to of Object.values(BLOG_SLUG_REDIRECTS)) expect(keys.has(to)).toBe(false);
  });

  it("les cibles sont des slugs déjà propres (slugify est idempotent dessus)", () => {
    for (const to of Object.values(BLOG_SLUG_REDIRECTS)) expect(slugify(to)).toBe(to);
  });

  it("chaque ancien slug porte bien le résidu d'entité « x27 »", () => {
    for (const from of Object.keys(BLOG_SLUG_REDIRECTS)) expect(from).toContain("x27");
  });
});
