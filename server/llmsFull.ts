/**
 * llmsFull.ts — Génère `llms-full.txt` : un document markdown qui décrit le site
 * pour les LLM / moteurs génératifs (GEO), en complément de l'index `llms.txt`.
 *
 * `buildLlmsFull` est PURE : elle reçoit les ressources i18n (titres + descriptions
 * par page) et produit le markdown. Générée au BUILD (scripts/prerender.mjs, où les
 * locales sont sur disque) puis servie en statique — car le conteneur runtime ne
 * contient pas client/src/locales (cf. Dockerfile : seul dist/ est copié).
 *
 * Source de vérité réutilisée : ROUTES + LANGUAGE_DOMAINS (client/src/i18n).
 */

import { ROUTES, type RouteKey } from "../client/src/i18n/routes";
import { LANGUAGE_DOMAINS, LANGUAGE_NAMES, VALID_LANGS } from "../client/src/i18n/domains";

/** Ressources i18n d'une langue : namespace (page) → clé → valeur. */
export type LocaleResources = Record<string, Record<string, unknown>>;

/** routeKey → nom de fichier locale (identité sauf exceptions). */
const NS_OVERRIDE: Partial<Record<RouteKey, string>> = {
  arches: "arches-gonflables",
  cookies: "politique-cookies",
};

/** Pages regroupées par thème, dans l'ordre d'affichage du document. */
const SECTIONS: Array<{ title: string; keys: RouteKey[] }> = [
  { title: "Écrans gonflables", keys: ["ecrans", "ecran-geant", "ecran-etanche", "ecran-economique", "drive-in", "ecrans-led", "comparaison", "configurateur"] },
  { title: "Tentes & structures", keys: ["tentes", "tente-x", "tente-n", "tente-v", "tente-araignee", "arches", "mobilier", "accessoires"] },
  { title: "Offres", keys: ["packs", "location"] },
  { title: "Références & galeries", keys: ["etudes-cas", "cas-velodrome", "cas-oran", "galerie", "galerie-video"] },
  { title: "Hallucine", keys: ["a-propos", "histoire", "mode-emploi", "blog"] },
  { title: "Distribution", keys: ["devenir-distributeur"] },
  { title: "Contact", keys: ["contact"] },
];

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Construit le markdown llms-full.txt pour une langue.
 * @param lang      langue/TLD (fr|en|de|es|it)
 * @param resources ressources i18n de cette langue (bundledResources[lang])
 */
export function buildLlmsFull(lang: string, resources: LocaleResources): string {
  const domain = LANGUAGE_DOMAINS[lang as keyof typeof LANGUAGE_DOMAINS] ?? LANGUAGE_DOMAINS.fr;
  const langRoutes = ROUTES[lang] ?? ROUTES.fr;
  const common = resources.common ?? {};
  const home = resources.home ?? {};

  const siteName = str(common.site_name) || "Hallucine";
  const tagline = str(common.tagline);
  const intro = str(home.meta_desc);

  const out: string[] = [];
  out.push(`# ${siteName}${tagline ? ` — ${tagline}` : ""}`);
  out.push("");
  if (intro) out.push(`> ${intro}`, "");
  out.push(`Site officiel : ${domain}`, "");

  for (const section of SECTIONS) {
    const lines: string[] = [];
    for (const key of section.keys) {
      const ns = NS_OVERRIDE[key] ?? key;
      const page = resources[ns];
      const path = langRoutes[key];
      const title = str(page?.meta_title);
      if (!page || !path || !title) continue; // page absente / non traduite → ignorée

      const url = `${domain}${path}`;
      const desc = str(page.meta_desc);
      lines.push(`- [${title}](${url})${desc ? `: ${desc}` : ""}`);
      const hero = str(page.hero_desc); // intro de page quand elle est plate
      if (hero && hero !== desc) lines.push(`  ${hero}`);
    }
    if (lines.length) {
      out.push(`## ${section.title}`, "", ...lines, "");
    }
  }

  out.push("## Versions linguistiques");
  for (const l of VALID_LANGS) {
    out.push(`- ${LANGUAGE_NAMES[l]} : ${LANGUAGE_DOMAINS[l]}`);
  }
  out.push("");

  return out.join("\n");
}
