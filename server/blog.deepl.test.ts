import { describe, it, expect } from "vitest";
import { deeplHostForKey, DEEPL_LANGS } from "./blog";

describe("deeplHostForKey — détection Free vs Pro", () => {
  it("clé Free (suffixe :fx) → api-free.deepl.com", () => {
    expect(deeplHostForKey("279a1db4-xxxx-yyyy:fx")).toBe("api-free.deepl.com");
  });
  it("clé Pro (sans :fx) → api.deepl.com", () => {
    expect(deeplHostForKey("279a1db4-xxxx-yyyy-c70")).toBe("api.deepl.com");
  });
});

describe("DEEPL_LANGS — langues du blog", () => {
  it("couvre les 5 langues traduites, dont le portugais européen", () => {
    expect(DEEPL_LANGS).toEqual({
      en: "EN-GB",
      de: "DE",
      es: "ES",
      it: "IT",
      pt: "PT-PT",
    });
  });
});
