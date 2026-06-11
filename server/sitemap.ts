/**
 * sitemap.ts — Génération du sitemap XML, servie dynamiquement par Express.
 *
 * Un sitemap PAR TLD (host-aware) : chaque domaine ne liste en <loc> que les
 * URLs de sa langue, avec les alternates hreflang vers les autres TLD.
 * `buildSitemapXml` est PURE (aucun accès DB) — les articles sont injectés en
 * paramètre, ce qui la rend testable et utilisable au build (check-seo) sans base.
 *
 * Source de vérité réutilisée (zéro duplication) :
 *   - ROUTES / getHreflangUrls  → client/src/i18n/routes
 *   - LANGUAGE_DOMAINS / VALID_LANGS → client/src/i18n/domains
 */

import { ROUTES, getHreflangUrls, type RouteKey } from "../client/src/i18n/routes";
import { LANGUAGE_DOMAINS, VALID_LANGS } from "../client/src/i18n/domains";

/** Article publié, projeté pour le sitemap (cf. getAllPublishedForSitemap). */
export type SitemapPost = {
  id: number;
  slug: string;
  lang: string;
  parentId: number | null;
  updatedAt: Date | string | null;
};

/** Priorité / fréquence par route. Les routes absentes prennent le défaut. */
const ROUTE_META: Partial<Record<RouteKey, { priority: string; changefreq: string }>> = {
  home:                   { priority: "1.0", changefreq: "weekly" },
  ecrans:                 { priority: "0.9", changefreq: "monthly" },
  "ecran-geant":          { priority: "0.9", changefreq: "monthly" },
  "ecran-etanche":        { priority: "0.9", changefreq: "monthly" },
  "ecran-economique":     { priority: "0.9", changefreq: "monthly" },
  comparaison:            { priority: "0.8", changefreq: "monthly" },
  "ecrans-led":           { priority: "0.8", changefreq: "monthly" },
  tentes:                 { priority: "0.9", changefreq: "monthly" },
  "tente-x":              { priority: "0.8", changefreq: "monthly" },
  "tente-n":              { priority: "0.8", changefreq: "monthly" },
  "tente-v":              { priority: "0.8", changefreq: "monthly" },
  "tente-araignee":       { priority: "0.8", changefreq: "monthly" },
  arches:                 { priority: "0.8", changefreq: "monthly" },
  mobilier:               { priority: "0.8", changefreq: "monthly" },
  accessoires:            { priority: "0.7", changefreq: "monthly" },
  galerie:                { priority: "0.7", changefreq: "weekly" },
  "galerie-video":        { priority: "0.7", changefreq: "weekly" },
  contact:                { priority: "0.9", changefreq: "monthly" },
  "a-propos":             { priority: "0.6", changefreq: "monthly" },
  histoire:               { priority: "0.6", changefreq: "monthly" },
  blog:                   { priority: "0.7", changefreq: "weekly" },
  "mode-emploi":          { priority: "0.6", changefreq: "monthly" },
  "devenir-distributeur": { priority: "0.7", changefreq: "monthly" },
  "mentions-legales":     { priority: "0.3", changefreq: "yearly" },
  confidentialite:        { priority: "0.3", changefreq: "yearly" },
  cookies:                { priority: "0.3", changefreq: "yearly" },
};

const DEFAULT_META = { priority: "0.5", changefreq: "monthly" };

/** Routes qui ne sont que des redirections → exclues du sitemap. */
const REDIRECT_ONLY: ReadonlyArray<RouteKey> = ["trouver-distributeur"];

/** Date → "YYYY-MM-DD" (lastmod). Renvoie null si invalide/absente. */
function toIsoDate(value: Date | string | null): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
}

/** Chemin de la page blog dans une langue (toujours "/blog" aujourd'hui). */
function blogPath(lang: string): string {
  return ROUTES[lang]?.blog ?? ROUTES.fr.blog;
}

/**
 * Construit le sitemap XML pour UNE langue (host courant).
 * @param lang  langue/TLD du host (fr|en|de|es|it)
 * @param posts articles publiés, TOUTES langues (pour résoudre les hreflang via parentId)
 */
export function buildSitemapXml(lang: string, posts: SitemapPost[] = []): string {
  const domain = LANGUAGE_DOMAINS[lang as keyof typeof LANGUAGE_DOMAINS] ?? LANGUAGE_DOMAINS.fr;
  const langRoutes = ROUTES[lang] ?? ROUTES.fr;

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  // ── 1. Routes statiques : uniquement la langue courante en <loc> ──────────
  for (const key of Object.keys(langRoutes) as RouteKey[]) {
    if (REDIRECT_ONLY.includes(key)) continue;
    const meta = ROUTE_META[key] ?? DEFAULT_META;
    const hreflangs = getHreflangUrls(key); // une URL par langue de LANGUAGE_DOMAINS (pt inclus)

    lines.push("  <url>");
    lines.push(`    <loc>${domain}${langRoutes[key]}</loc>`);
    for (const hl of VALID_LANGS) {
      lines.push(`    <xhtml:link rel="alternate" hreflang="${hl}" href="${hreflangs[hl]}"/>`);
    }
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${hreflangs.fr}"/>`);
    lines.push(`    <changefreq>${meta.changefreq}</changefreq>`);
    lines.push(`    <priority>${meta.priority}</priority>`);
    lines.push("  </url>");
  }

  // ── 2. Articles de blog : un cluster de traductions par parentId ──────────
  // clusterKey = parentId ?? id  → toutes les versions d'un même article le partagent.
  const clusters = new Map<number, Map<string, SitemapPost>>();
  for (const p of posts) {
    const key = p.parentId ?? p.id;
    let cluster = clusters.get(key);
    if (!cluster) {
      cluster = new Map();
      clusters.set(key, cluster);
    }
    cluster.set(p.lang, p);
  }

  for (const p of posts) {
    if (p.lang !== lang) continue; // ce sitemap ne liste que les articles de sa langue
    const cluster = clusters.get(p.parentId ?? p.id);

    lines.push("  <url>");
    lines.push(`    <loc>${domain}${blogPath(lang)}/${p.slug}</loc>`);
    if (cluster) {
      for (const hl of VALID_LANGS) {
        const sib = cluster.get(hl);
        if (!sib) continue;
        const sibDomain = LANGUAGE_DOMAINS[hl];
        lines.push(`    <xhtml:link rel="alternate" hreflang="${hl}" href="${sibDomain}${blogPath(hl)}/${sib.slug}"/>`);
      }
      const fr = cluster.get("fr");
      if (fr) {
        lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${LANGUAGE_DOMAINS.fr}${blogPath("fr")}/${fr.slug}"/>`);
      }
    }
    const lastmod = toIsoDate(p.updatedAt);
    if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push("    <changefreq>monthly</changefreq>");
    lines.push("    <priority>0.6</priority>");
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  return lines.join("\n");
}
