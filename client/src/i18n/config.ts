/**
 * Configuration i18next — Hallucine
 *
 * Détection de langue par domaine :
 * - hallucinecran.fr  → fr
 * - hallucinecran.com → en
 * - hallucinecran.de  → de
 * - hallucinecran.es  → es
 *
 * En développement (localhost), la langue est déterminée par le paramètre
 * URL ?lang=fr|en|de|es ou par défaut "fr".
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

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
};

/**
 * Détecte la langue selon le domaine ou le paramètre URL (dev)
 */
export function detectLanguage(): string {
  if (typeof window === "undefined") return "fr";

  const hostname = window.location.hostname;

  // Détection par domaine (production)
  if (DOMAIN_LANG_MAP[hostname]) {
    return DOMAIN_LANG_MAP[hostname];
  }

  // Détection par paramètre URL (développement)
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get("lang");
  if (langParam && ["fr", "en", "de", "es"].includes(langParam)) {
    return langParam;
  }

  // Détection par sous-domaine Manus (ex: hallucineweb.manus.space)
  // On regarde si le hostname contient des indices de langue
  if (hostname.includes(".manus.space") || hostname.includes("localhost")) {
    return "fr"; // Défaut en dev
  }

  return "fr";
}

export const SUPPORTED_LANGUAGES = ["fr", "en", "de", "es"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  es: "Español",
};

export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
};

export const LANGUAGE_DOMAINS: Record<SupportedLanguage, string> = {
  fr: "https://hallucinecran.fr",
  en: "https://hallucinecran.com",
  de: "https://hallucinecran.de",
  es: "https://hallucinecran.es",
};

const detectedLang = detectLanguage();

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: detectedLang,
    fallbackLng: "fr",
    supportedLngs: ["fr", "en", "de", "es"],
    ns: ["common", "home", "products", "contact", "legal", "nav", "ecran-geant", "ecran-etanche", "ecran-economique", "comparaison", "ecrans-led", "tentes", "tente-x", "tente-n", "tente-v", "tente-araignee", "arches-gonflables", "mobilier", "accessoires"],
    defaultNS: "common",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    interpolation: {
      escapeValue: false, // React gère déjà l'échappement XSS
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
