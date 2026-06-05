import { describe, it, expect } from "vitest";
import { slugify, decodeHtmlEntities } from "./blog";

describe("decodeHtmlEntities", () => {
  it("décode les entités renvoyées par DeepL (tag_handling html)", () => {
    expect(decodeHtmlEntities("all&#x27;aperto")).toBe("all'aperto");
    expect(decodeHtmlEntities("un&#39;esperienza")).toBe("un'esperienza");
    expect(decodeHtmlEntities("R&amp;D")).toBe("R&D");
    expect(decodeHtmlEntities("a &lt;b&gt; c &quot;d&quot;")).toBe('a <b> c "d"');
  });
  it("laisse une chaîne sans entité intacte", () => {
    expect(decodeHtmlEntities("cinéma plein air")).toBe("cinéma plein air");
  });
});

describe("slugify — apostrophes encodées (bug « x27 »)", () => {
  it("produit un slug propre au lieu de x27 pour une apostrophe &#x27;", () => {
    expect(slugify("Cinema all&#x27;aperto in città")).toBe("cinema-allaperto-in-citta");
  });
  it("gère l'apostrophe décimale &#39;", () => {
    expect(slugify("Un&#39;esperienza urbana accogliente")).toBe("unesperienza-urbana-accogliente");
  });
  it("gère &amp;", () => {
    expect(slugify("Sièges &amp; casques")).toBe("sieges-casques");
  });
  it("ne casse pas un titre déjà propre (apostrophe simple)", () => {
    expect(slugify("Le moment d'équiper son écran")).toBe("le-moment-dequiper-son-ecran");
  });
});
