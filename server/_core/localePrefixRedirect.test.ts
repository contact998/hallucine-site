import { describe, it, expect } from "vitest";
import { resolveLocalePrefixRedirect } from "./vite";

describe("resolveLocalePrefixRedirect", () => {
  it("laisse passer (null) tout chemin sans préfixe 2-lettres", () => {
    expect(resolveLocalePrefixRedirect("/", "hallucinecran.fr")).toBeNull();
    expect(resolveLocalePrefixRedirect("/ecran-gonflable", "hallucinecran.fr")).toBeNull();
    expect(resolveLocalePrefixRedirect("/blog/article-1", "hallucinecran.fr")).toBeNull();
    expect(resolveLocalePrefixRedirect("/admin", "hallucinecran.fr")).toBeNull();
  });

  it("404 sur les préfixes 2-lettres inconnus (bots SEO)", () => {
    expect(resolveLocalePrefixRedirect("/sv", "hallucinecran.fr")).toEqual({ status: 404 });
    expect(resolveLocalePrefixRedirect("/nl/foo", "hallucinecran.fr")).toEqual({ status: 404 });
    expect(resolveLocalePrefixRedirect("/zh", "hallucinecran.com")).toEqual({ status: 404 });
    expect(resolveLocalePrefixRedirect("/ru/anything", "hallucinecran.de")).toEqual({ status: 404 });
  });

  it("préfixe = langue du TLD courant → 301 vers le chemin sans préfixe", () => {
    expect(resolveLocalePrefixRedirect("/fr", "hallucinecran.fr"))
      .toEqual({ status: 301, location: "/" });
    expect(resolveLocalePrefixRedirect("/fr/", "hallucinecran.fr"))
      .toEqual({ status: 301, location: "/" });
    expect(resolveLocalePrefixRedirect("/fr/ecran-gonflable", "hallucinecran.fr"))
      .toEqual({ status: 301, location: "/ecran-gonflable" });
    expect(resolveLocalePrefixRedirect("/en/inflatable-screen", "hallucinecran.com"))
      .toEqual({ status: 301, location: "/inflatable-screen" });
    expect(resolveLocalePrefixRedirect("/de/aufblasbarer-bildschirm", "hallucinecran.de"))
      .toEqual({ status: 301, location: "/aufblasbarer-bildschirm" });
  });

  it("préfixe d'une autre langue → 301 vers la home du TLD correspondant", () => {
    // depuis le .fr
    expect(resolveLocalePrefixRedirect("/en", "hallucinecran.fr"))
      .toEqual({ status: 301, location: "https://hallucinecran.com/" });
    expect(resolveLocalePrefixRedirect("/en/inflatable-screen", "hallucinecran.fr"))
      .toEqual({ status: 301, location: "https://hallucinecran.com/" });
    expect(resolveLocalePrefixRedirect("/de/foo", "hallucinecran.fr"))
      .toEqual({ status: 301, location: "https://hallucinecran.de/" });
    // depuis le .com
    expect(resolveLocalePrefixRedirect("/fr/", "hallucinecran.com"))
      .toEqual({ status: 301, location: "https://hallucinecran.fr/" });
    expect(resolveLocalePrefixRedirect("/it/qualcosa", "hallucinecran.com"))
      .toEqual({ status: 301, location: "https://hallucinecran.it/" });
    // depuis le .es
    expect(resolveLocalePrefixRedirect("/de/whatever", "hallucinecran.es"))
      .toEqual({ status: 301, location: "https://hallucinecran.de/" });
    // pt = langue valide depuis le rollout du TLD .pt (2026-06-08)
    expect(resolveLocalePrefixRedirect("/pt/qualquer-coisa", "hallucinecran.fr"))
      .toEqual({ status: 301, location: "https://hallucinecran.pt/" });
  });

  it("traite www.* comme le domaine de base", () => {
    expect(resolveLocalePrefixRedirect("/fr/foo", "www.hallucinecran.fr"))
      .toEqual({ status: 301, location: "/foo" });
    expect(resolveLocalePrefixRedirect("/en/foo", "www.hallucinecran.fr"))
      .toEqual({ status: 301, location: "https://hallucinecran.com/" });
  });

  it("hostname inconnu : retombe sur le fallback FR", () => {
    // getLocaleFromHost() retourne "fr" par défaut, donc /fr est canonique
    expect(resolveLocalePrefixRedirect("/fr/foo", "localhost"))
      .toEqual({ status: 301, location: "/foo" });
    expect(resolveLocalePrefixRedirect("/en/foo", "localhost"))
      .toEqual({ status: 301, location: "https://hallucinecran.com/" });
  });

  it("ne capture pas /xxx (3+ lettres) ni /x (1 lettre)", () => {
    expect(resolveLocalePrefixRedirect("/api", "hallucinecran.fr")).toBeNull();
    expect(resolveLocalePrefixRedirect("/api/foo", "hallucinecran.fr")).toBeNull();
    expect(resolveLocalePrefixRedirect("/a/bar", "hallucinecran.fr")).toBeNull();
  });
});
