/**
 * domains.ts — Constantes de domaines et langues SSR-safe
 *
 * Ce fichier est intentionnellement séparé de config.ts pour éviter
 * la dépendance à locales-bundled.ts (qui utilise import.meta.glob, Vite-only).
 *
 * Peut être importé depuis :
 * - Les composants client (Navbar, useCanonical, etc.)
 * - Les scripts SSR Node.js (prerender.mjs)
 * - config.node.ts
 */

export const SUPPORTED_LANGUAGES = ["fr", "en", "de", "es", "it"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
};

export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
  it: "🇮🇹",
};

// Code locale BCP-47 par langue — pour le champ inLanguage des données structurées
export const LANGUAGE_LOCALES: Record<SupportedLanguage, string> = {
  fr: "fr-FR",
  en: "en-GB",
  de: "de-DE",
  es: "es-ES",
  it: "it-IT",
};

export const LANGUAGE_DOMAINS: Record<SupportedLanguage, string> = {
  fr: "https://hallucinecran.fr",
  en: "https://hallucinecran.com",
  de: "https://hallucinecran.de",
  es: "https://hallucinecran.es",
  it: "https://hallucinecran.it",
};

// Mapping domaine → langue
export const DOMAIN_LANG_MAP: Record<string, string> = {
  "hallucinecran.fr": "fr",
  "www.hallucinecran.fr": "fr",
  "hallucinecran.com": "en",
  "www.hallucinecran.com": "en",
  "hallucinecran.de": "de",
  "www.hallucinecran.de": "de",
  "hallucinecran.es": "es",
  "www.hallucinecran.es": "es",
  "hallucinecran.it": "it",
  "www.hallucinecran.it": "it",
};

export const VALID_LANGS = ["fr", "en", "de", "es", "it"] as const;

/**
 * Construit l'URL canonique absolue : domaine de la langue + chemin normalisé
 * (sans slash final, hors racine). Partagé entre useCanonical et les données
 * structurées (PageStructuredData) pour garantir des URLs cohérentes.
 */
export function buildCanonicalUrl(lang: string, pathname: string): string {
  const baseUrl = LANGUAGE_DOMAINS[lang as SupportedLanguage] ?? LANGUAGE_DOMAINS.fr;
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Détecte la langue selon la priorité définie.
 * SSR-safe : retourne "fr" si window n'est pas défini.
 */
export function detectLanguage(): string {
  if (typeof window === "undefined") return "fr";
  // 1. Paramètre URL ?lang=xx (priorité absolue — dev + tests)
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get("lang");
  if (langParam && VALID_LANGS.includes(langParam as SupportedLanguage)) {
    return langParam;
  }
  // 2. Langue injectée par le serveur selon le domaine (production)
  if (
    (window as any).__INITIAL_LOCALE__ &&
    VALID_LANGS.includes((window as any).__INITIAL_LOCALE__ as SupportedLanguage)
  ) {
    return (window as any).__INITIAL_LOCALE__;
  }
  // 3. Domaine (fallback si __INITIAL_LOCALE__ non injecté)
  const hostname = window.location.hostname;
  if (DOMAIN_LANG_MAP[hostname]) {
    return DOMAIN_LANG_MAP[hostname];
  }
  return "fr";
}
