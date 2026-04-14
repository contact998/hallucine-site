/**
 * config.ts — Configuration i18next côté client (Vite)
 *
 * Initialise l'instance partagée depuis instance.ts
 * avec les ressources bundlées via import.meta.glob (Vite-only).
 *
 * Ordre de priorité pour la détection de langue :
 * 1. Paramètre URL ?lang=xx (priorité absolue — pour les tests en dev)
 * 2. window.__INITIAL_LOCALE__ (injecté par le serveur selon le domaine)
 * 3. Domaine (hallucinecran.fr → fr, .com → en, .de → de, .es → es)
 * 4. Défaut : fr
 */
import { initReactI18next } from "react-i18next";
import { bundledResources } from "./locales-bundled";
import { i18n } from "./instance";
import { detectLanguage, VALID_LANGS } from "./domains";
import type { Resource } from "i18next";

// Re-exporter les constantes depuis domains.ts (SSR-safe)
export {
  SUPPORTED_LANGUAGES,
  LANGUAGE_NAMES,
  LANGUAGE_FLAGS,
  LANGUAGE_DOMAINS,
  DOMAIN_LANG_MAP,
  VALID_LANGS,
  detectLanguage,
  type SupportedLanguage,
} from "./domains";

declare global {
  interface Window {
    __INITIAL_LOCALE__?: string;
    i18next?: typeof i18n;
  }
}

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
    detection: undefined,
    react: {
      useSuspense: true,
    },
  })
  .then(() => {
    // Exposer i18next sur window (utile pour le debug en dev)
    if (typeof window !== "undefined") {
      window.i18next = i18n;

      // Nettoyer ?lang= de l'URL après init (propre pour le SEO)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("lang")) {
        urlParams.delete("lang");
        const newSearch = urlParams.toString();
        const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "");
        window.history.replaceState({}, "", newUrl);
      }
    }
  });

export default i18n;
