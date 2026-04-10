/**
 * Configuration i18next — Hallucine (production-grade v4)
 *
 * FIX DÉFINITIF : Ressources bundlées dans le JS (pas de HTTP backend)
 * → i18next synchrone dès le premier render
 * → zéro hydration mismatch
 * → zéro race condition avec le rendu serveur
 *
 * Ordre de priorité pour la détection de langue :
 * 1. Paramètre URL ?lang=xx (priorité absolue — pour les tests en dev)
 * 2. window.__INITIAL_LOCALE__ (injecté par le serveur selon le domaine)
 * 3. Domaine (hallucinecran.fr → fr, .com → en, .de → de, .es → es)
 * 4. Défaut : fr
 * Langues : fr, en, de, es, it
 */
import i18n, { type Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import { bundledResources } from "./locales-bundled";

declare global {
  interface Window {
    __INITIAL_LOCALE__?: string;
    i18next?: typeof i18n;
  }
}

// Mapping domaine → langue
const DOMAIN_LANG_MAP: Record<string, string> = {
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

const VALID_LANGS = ["fr", "en", "de", "es", "it"];

/**
 * Détecte la langue selon la priorité définie ci-dessus.
 * Aucun détecteur automatique i18next — priorité explicite et déterministe.
 */
export function detectLanguage(): string {
  if (typeof window === "undefined") return "fr";

  // 1. Paramètre URL ?lang=xx (priorité absolue — dev + tests)
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get("lang");
  if (langParam && VALID_LANGS.includes(langParam)) {
    return langParam;
  }

  // 2. Langue injectée par le serveur selon le domaine (production)
  if (window.__INITIAL_LOCALE__ && VALID_LANGS.includes(window.__INITIAL_LOCALE__)) {
    return window.__INITIAL_LOCALE__;
  }

  // 3. Domaine (fallback si __INITIAL_LOCALE__ non injecté)
  const hostname = window.location.hostname;
  if (DOMAIN_LANG_MAP[hostname]) {
    return DOMAIN_LANG_MAP[hostname];
  }

  return "fr";
}

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

export const LANGUAGE_DOMAINS: Record<SupportedLanguage, string> = {
  fr: "https://hallucinecran.fr",
  en: "https://hallucinecran.com",
  de: "https://hallucinecran.de",
  es: "https://hallucinecran.es",
  it: "https://hallucinecran.it",
};

// Langue détectée UNE SEULE FOIS avant init
const detectedLang = detectLanguage();

// Construire les ressources pour toutes les langues
const resources: Resource = {};
for (const lang of VALID_LANGS) {
  resources[lang] = bundledResources[lang] as Resource[string] ?? {};
}

i18n
  .use(initReactI18next)
  .init({
    lng: detectedLang,
    fallbackLng: "fr",
    supportedLngs: ["fr", "en", "de", "es", "it"],
    resources,
    ns: [
      "common", "home", "products", "contact", "legal", "nav",
      "ecran-geant", "ecran-etanche", "ecran-economique", "comparaison",
      "ecrans-led", "ecrans", "tentes", "tente-x", "tente-n", "tente-v",
      "tente-araignee", "arches-gonflables", "mobilier", "accessoires",
      "a-propos", "mode-emploi", "mentions-legales", "devenir-distributeur",
      "trouver-distributeur", "galerie", "galerie-video", "politique-cookies",
      "confidentialite", "blog", "histoire", "not-found"
    ],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    // Pas de backend HTTP — ressources bundlées → synchrone
    // Pas de détecteurs automatiques → aucun conflit navigateur/cookies/localStorage
    detection: undefined,
    react: {
      useSuspense: true,
    },
  })
  .then(() => {
    // Exposer i18next sur window (utile pour le debug en dev)
    window.i18next = i18n;

    // Nettoyer ?lang= de l'URL après init (propre pour le SEO)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("lang")) {
      urlParams.delete("lang");
      const newSearch = urlParams.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "");
      window.history.replaceState({}, "", newUrl);
    }


  });

export default i18n;
