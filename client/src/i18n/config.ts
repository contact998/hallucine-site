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
import { bundledResources, lazyResources } from "./locales-bundled";
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

// Construire les ressources : langue active + fallback fr en priorité, autres langues disponibles
const resources: Resource = {};
for (const lang of VALID_LANGS) {
  // bundledResources contient la langue active + fr (fallback)
  // lazyResources contient les autres langues (chargées mais séparées par Vite)
  resources[lang] = (bundledResources[lang] ?? lazyResources[lang]) as Resource[string] ?? {};
}

i18n
  .use(initReactI18next)
  .init({
    lng: detectedLang,
    fallbackLng: "fr",
    supportedLngs: ["fr", "en", "de", "es", "it", "pt"],
    resources,
    ns: [
      "common", "home", "products", "contact", "legal", "nav",
      "ecran-geant", "ecran-etanche", "ecran-economique", "comparaison",
      "configurateur", "drive-in", "packs", "cinema-plein-air", "prix", "mairie", "hotel", "evenement", "location", "etudes-cas", "cas-velodrome", "cas-oran", "ecrans-led", "ecrans", "tentes", "tente-x", "tente-n", "tente-v",
      "tente-araignee", "arches-gonflables", "mobilier", "accessoires",
      "a-propos", "mode-emploi", "mentions-legales", "devenir-distributeur",
      "galerie", "galerie-video", "politique-cookies",
      "confidentialite", "blog", "histoire", "not-found", "smartform"
    ],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: undefined,
    react: {
      // Doit rester aligné sur config.node.ts (SSR) : si useSuspense diffère
      // entre serveur et client, React voit une frontière Suspense qui
      // n'existe que d'un côté → hydration mismatch garanti.
      // Les ressources étant bundlées de façon synchrone (locales-bundled.ts),
      // suspendre n'est de toute façon jamais nécessaire.
      useSuspense: false,
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
