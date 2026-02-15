import { describe, it, expect } from "vitest";
import { generateBrochure, getAvailableProducts } from "./brochure";

describe("generateBrochure", () => {
  it("should generate HTML for ecran-soufflerie", () => {
    const result = generateBrochure("ecran-soufflerie");
    expect(result.html).toContain("<!DOCTYPE html>");
    expect(result.html).toContain("Hallucine");
    expect(result.html).toContain("Soufflerie");
    expect(result.productName).toContain("Soufflerie");
  });

  it("should generate HTML for ecran-etanche", () => {
    const result = generateBrochure("ecran-etanche");
    expect(result.html).toContain("<!DOCTYPE html>");
    expect(result.html).toContain("Étanche");
    expect(result.html).toContain("TPU");
    expect(result.productName).toContain("Étanche");
  });

  it("should generate HTML for ecran-economique", () => {
    const result = generateBrochure("ecran-economique");
    expect(result.html).toContain("<!DOCTYPE html>");
    expect(result.html).toContain("Économique");
    expect(result.productName).toContain("Économique");
  });

  it("should include contact information in brochure", () => {
    const result = generateBrochure("ecran-soufflerie");
    expect(result.html).toContain("contact@hallucine.fr");
    expect(result.html).toContain("+33 6 80 14 76 94");
  });

  it("should include sizes table for products with sizes", () => {
    const result = generateBrochure("ecran-soufflerie");
    expect(result.html).toContain("<table>");
    expect(result.html).toContain("Taille");
    expect(result.html).toContain("Poids");
    expect(result.html).toContain("Prix");
  });

  it("should include features list", () => {
    const result = generateBrochure("ecran-soufflerie");
    expect(result.html).toContain("Points forts");
    expect(result.html).toContain("plus léger");
  });

  it("should throw for unknown product", () => {
    expect(() => generateBrochure("produit-inconnu")).toThrow("Produit inconnu");
  });
});

describe("getAvailableProducts", () => {
  it("should return an array of product slugs", () => {
    const products = getAvailableProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThanOrEqual(3);
    expect(products).toContain("ecran-soufflerie");
    expect(products).toContain("ecran-etanche");
    expect(products).toContain("ecran-economique");
  });
});
