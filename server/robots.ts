/**
 * robots.ts — Contenu de robots.txt (servi dynamiquement par GET /robots.txt).
 *
 * Inclut les directives Content-Signal (https://contentsignals.org,
 * draft-romm-aipref-contentsignals) qui déclarent nos préférences d'usage IA :
 *   - search   = yes  → indexation dans les moteurs / réponses de recherche
 *   - ai-input = yes  → utilisation comme source pour des réponses génératives
 *   - ai-train = no   → PAS d'entraînement de modèles sur notre contenu
 *
 * Fonction pure (aucun accès DB/réseau) → unit-testable.
 */

/** Sitemaps : un par TLD/langue (cf. project_hallucine_i18n_tlds). */
const SITEMAPS = [
  "https://hallucinecran.fr/sitemap.xml",
  "https://hallucinecran.com/sitemap.xml",
  "https://hallucinecran.de/sitemap.xml",
  "https://hallucinecran.es/sitemap.xml",
  "https://hallucinecran.it/sitemap.xml",
] as const;

/** Préférences Content-Signal déclarées (politique validée : train refusé). */
export const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=no";

/** Construit le corps complet de robots.txt. */
export function buildRobotsTxt(): string {
  return [
    "# Préférences d'usage IA — Content Signals (https://contentsignals.org)",
    "User-agent: *",
    `Content-Signal: ${CONTENT_SIGNAL}`,
    "Allow: /",
    "",
    "# Sitemaps — un par domaine/langue",
    ...SITEMAPS.map((s) => `Sitemap: ${s}`),
    "",
    "# Pages admin et profil",
    "Disallow: /admin",
    "Disallow: /admin/",
    "Disallow: /profil",
    "Disallow: /api/",
    "",
  ].join("\n");
}
