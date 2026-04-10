// client/src/i18n/locales-bundled.ts
// Charge tous les JSON de src/locales/ via glob Vite (eager = synchrone, bundlé dans le JS)
// Aucun import manuel — fonctionne automatiquement pour toutes les langues et namespaces
const modules = import.meta.glob('../locales/**/*.json', { eager: true })

type Resources = Record<string, Record<string, Record<string, unknown>>>

export const bundledResources: Resources = {}

for (const path in modules) {
  // path = '../locales/fr/common.json'
  const parts = path.match(/\.\.\/locales\/([^/]+)\/([^/]+)\.json$/)
  if (!parts) continue

  const [, lang, namespace] = parts

  if (!bundledResources[lang]) bundledResources[lang] = {}
  bundledResources[lang][namespace] = (modules[path] as { default: Record<string, unknown> }).default
}
