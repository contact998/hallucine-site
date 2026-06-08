/**
 * config.node.ts — Configuration i18next côté SSR (Node.js)
 *
 * Initialise l'instance partagée depuis instance.ts
 * avec les ressources chargées via fs.readFileSync (Node-only).
 *
 * Utilisé uniquement par le script de pre-rendering SSR (scripts/prerender.mjs)
 */
import { initReactI18next } from "react-i18next";
import { bundledResources } from "./locales-bundled.node.ts";
import { i18n } from "./instance.ts";
import type { Resource } from "i18next";

// Re-exporter les constantes depuis domains.ts
export {
  SUPPORTED_LANGUAGES,
  LANGUAGE_NAMES,
  LANGUAGE_FLAGS,
  LANGUAGE_DOMAINS,
  VALID_LANGS,
  detectLanguage,
  type SupportedLanguage,
} from "./domains.ts";

const VALID_LANGS_ARRAY = ["fr", "en", "de", "es", "it", "pt"] as const;

const resources: Resource = {};
for (const lang of VALID_LANGS_ARRAY) {
  resources[lang] = (bundledResources[lang] as Resource[string]) ?? {};
}

const NS = [
  "common", "home", "products", "contact", "legal", "nav",
  "ecran-geant", "ecran-etanche", "ecran-economique", "comparaison",
  "configurateur", "drive-in", "packs", "cinema-plein-air", "prix", "mairie", "hotel", "evenement", "location", "etudes-cas", "cas-velodrome", "cas-oran", "ecrans-led", "ecrans", "tentes", "tente-x", "tente-n", "tente-v",
  "tente-araignee", "arches-gonflables", "mobilier", "accessoires",
  "a-propos", "mode-emploi", "mentions-legales", "devenir-distributeur",
  "galerie", "galerie-video", "politique-cookies",
  "confidentialite", "blog", "histoire", "not-found", "smartform"
];

// Initialiser i18n une seule fois pour le SSR
let initialized = false;

export async function initI18nSSR(lang: string): Promise<void> {
  if (!initialized) {
    await i18n
      .use(initReactI18next)
      .init({
        lng: lang,
        fallbackLng: "fr",
        supportedLngs: [...VALID_LANGS_ARRAY],
        resources,
        ns: NS,
        defaultNS: "common",
        interpolation: { escapeValue: false },
        react: { useSuspense: false }, // false en SSR pour éviter les Suspense boundaries
      });
    initialized = true;
  } else {
    await i18n.changeLanguage(lang);
  }
}

export default i18n;
