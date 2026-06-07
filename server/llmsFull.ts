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

// ─── Markdown par page (négociation « text/markdown » pour les agents) ─────────
//
// `buildPageMarkdown` produit un markdown du contenu RÉEL d'UNE page, extrait des
// mêmes ressources i18n que le rendu HTML (source de vérité). Servi au runtime
// quand un agent envoie `Accept: text/markdown` (cf. server/_core/vite.ts), à
// partir des fichiers `index.md` pré-générés au build (scripts/prerender.mjs).

/** Clés i18n purement décoratives / UI — exclues du markdown de contenu. */
const PAGE_SKIP_KEY = /(^|_)(alt|label|badge|scroll|cta|button|highlight|colored|placeholder|aria|img|icon)(_|$)/i;

/** Parcourt récursivement un namespace i18n et pousse ses chaînes de contenu. */
function pushPageLines(obj: Record<string, unknown>, out: string[]): void {
  for (const [k, v] of Object.entries(obj)) {
    if (k === "meta_title" || k === "meta_desc") continue; // déjà en en-tête
    if (PAGE_SKIP_KEY.test(k)) continue;
    if (typeof v === "string") {
      const s = v.trim();
      if (!s) continue;
      if (/(^|_)title(_\d+)?$/.test(k) || /^section_title/.test(k)) {
        out.push("", `## ${s}`, "");
      } else if (/(^|_)q\d+$/.test(k)) {
        out.push("", `### ${s}`, ""); // questions de FAQ
      } else {
        out.push(s, "");
      }
    } else if (v && typeof v === "object") {
      pushPageLines(v as Record<string, unknown>, out);
    }
  }
}

/** Markdown du contenu d'une page, depuis ses ressources i18n. */
export function buildPageMarkdown(
  lang: string,
  routeKey: RouteKey,
  resources: LocaleResources,
): string {
  const domain = LANGUAGE_DOMAINS[lang as keyof typeof LANGUAGE_DOMAINS] ?? LANGUAGE_DOMAINS.fr;
  const ns = NS_OVERRIDE[routeKey] ?? routeKey;
  const page = (resources[ns] ?? {}) as Record<string, unknown>;
  const langRoutes = ROUTES[lang] ?? ROUTES.fr;
  const path = langRoutes[routeKey] ?? "/";
  const url = `${domain}${path}`;

  const title = str(page.meta_title) || str(page.hero_title) || "Hallucine";
  const desc = str(page.meta_desc);

  const out: string[] = [`# ${title}`, ""];
  if (desc) out.push(`> ${desc}`, "");
  pushPageLines(page, out);
  out.push("", `— Page : ${url}`);

  // Compacte les lignes vides multiples + termine par un seul newline.
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

/**
 * Markdown servi pour une route donnée : la home réutilise l'aperçu de site
 * complet (`buildLlmsFull`, propre car son i18n est fragmenté), les autres pages
 * leur propre contenu (`buildPageMarkdown`).
 */
export function buildMarkdownForRoute(
  lang: string,
  routeKey: RouteKey,
  resources: LocaleResources,
): string {
  return routeKey === "home"
    ? buildLlmsFull(lang, resources)
    : buildPageMarkdown(lang, routeKey, resources);
}

/**
 * Chemin RELATIF (depuis dist/public) du fichier markdown pré-généré pour une
 * requête — calque la résolution des pages pré-rendues de serveStatic :
 *   `[_lang_xx/]<path>/index.md`. Pur (pas de fs) → testable.
 */
export function markdownFileForRequest(reqPath: string, lang: string): string {
  const clean = (reqPath || "/").split("?")[0];
  const urlPath = clean.replace(/^\/+/, "").replace(/\/+$/, "");
  const langPrefix = lang !== "fr" && (VALID_LANGS as readonly string[]).includes(lang) ? `_lang_${lang}` : "";
  return [langPrefix, urlPath, "index.md"].filter(Boolean).join("/");
}
