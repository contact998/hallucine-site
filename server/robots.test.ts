import { describe, it, expect } from "vitest";
import { buildRobotsTxt, CONTENT_SIGNAL } from "./robots";

describe("buildRobotsTxt", () => {
  const txt = buildRobotsTxt();
  const lines = txt.split("\n");

  it("déclare Content-Signal directement sous le groupe User-agent", () => {
    const ua = lines.findIndex((l) => l.trim() === "User-agent: *");
    const cs = lines.findIndex((l) => l.startsWith("Content-Signal:"));
    expect(ua).toBeGreaterThanOrEqual(0);
    expect(cs).toBe(ua + 1);
  });

  it("porte les 3 signaux avec la politique validée", () => {
    expect(CONTENT_SIGNAL).toBe("search=yes, ai-input=yes, ai-train=no");
    expect(txt).toContain("Content-Signal: search=yes, ai-input=yes, ai-train=no");
  });

  it("liste les 5 sitemaps par TLD", () => {
    for (const tld of ["fr", "com", "de", "es", "it"]) {
      expect(txt).toContain(`Sitemap: https://hallucinecran.${tld}/sitemap.xml`);
    }
  });

  it("conserve les Disallow admin/profil/api", () => {
    expect(txt).toContain("Disallow: /admin");
    expect(txt).toContain("Disallow: /profil");
    expect(txt).toContain("Disallow: /api/");
  });

  it("autorise le reste du site", () => {
    expect(txt).toContain("Allow: /");
  });
});
