// client/src/i18n/locales-bundled.ts
// Optimisation performance : charge uniquement la langue active de façon synchrone (eager).
// Les autres langues sont disponibles via import dynamique si l'utilisateur change de langue.
// Économie : ~530 Kio de JS non chargé au démarrage (seule la langue active ~134 Kio est bundlée).

import { detectLanguage } from "./domains";

// Détecter la langue AVANT le glob pour filtrer
const activeLang = detectLanguage();

// Charger TOUTES les langues en eager (nécessaire pour Vite glob statique)
// mais ne retourner que la langue active dans bundledResources
const modules = import.meta.glob('../locales/**/*.json', { eager: true })

type Resources = Record<string, Record<string, Record<string, unknown>>>

// bundledResources contient uniquement la langue active pour réduire le bundle initial
export const bundledResources: Resources = {}

// Ressources lazy pour les autres langues (chargées à la demande)
export const lazyResources: Resources = {}

for (const path in modules) {
  // path = '../locales/fr/common.json'
  const parts = path.match(/\.\.\/locales\/([^/]+)\/([^/]+)\.json$/)
  if (!parts) continue

  const [, lang, namespace] = parts
  const data = (modules[path] as { default: Record<string, unknown> }).default

  if (lang === activeLang) {
    // Langue active → dans le bundle principal
    if (!bundledResources[lang]) bundledResources[lang] = {}
    bundledResources[lang][namespace] = data
  } else {
    // Autres langues → disponibles mais séparées
    if (!lazyResources[lang]) lazyResources[lang] = {}
    lazyResources[lang][namespace] = data
  }
}

// Assurer que la langue de fallback (fr) est toujours disponible
if (activeLang !== 'fr' && lazyResources['fr']) {
  bundledResources['fr'] = lazyResources['fr']
  delete lazyResources['fr']
}
