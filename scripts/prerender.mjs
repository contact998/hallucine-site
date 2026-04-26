/**
 * prerender.mjs — Script de pre-rendering SSG (renderToString)
 *
 * Génère des fichiers HTML statiques pour chaque page × langue.
 * Utilisé dans le build Railway : pnpm build:client && npx tsx --tsconfig tsconfig.ssr.json scripts/prerender.mjs
 *
 * Architecture :
 *   1. Lire dist/index.html (template Vite après build client)
 *   2. Pour chaque page × langue : render(url, lang) → HTML statique + metas
 *   3. Injecter dans le template (root, lang, canonical, hreflang, metas SEO)
 *   4. Écrire dist/{url}/index.html
 *
 * ✅ Pas de Puppeteer — Node.js pur (compatible Railway)
 * ✅ Instance i18n par render (pas de race conditions)
 * ✅ 27 pages × 5 langues = 135 fichiers HTML
 */

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist", "public");

// ─── Configuration ─────────────────────────────────────────────────────────

const VALID_LANGS = ["fr", "en", "de", "es", "it"];

/** Domaine de production par langue */
const DOMAINS = {
  fr: "https://hallucinecran.fr",
  en: "https://hallucinecran.com",
  de: "https://hallucinecran.de",
  es: "https://hallucinecran.es",
  it: "https://hallucinecran.it",
};

// ─── Import de l'entrypoint SSR ────────────────────────────────────────────

const { render } = await import("../client/src/entry-server.tsx");
const { ROUTES } = await import("../client/src/i18n/routes.ts");

// ─── Lecture du template HTML ──────────────────────────────────────────────

const templatePath = join(DIST, "_template.html");
let template;
try {
  template = readFileSync(templatePath, "utf-8");
} catch {
  console.error(`❌ dist/public/_template.html introuvable. Lance d'abord : pnpm build:client`);
  process.exit(1);
}

// ─── Fonctions utilitaires ─────────────────────────────────────────────────

/**
 * Échappe les caractères spéciaux HTML pour injection sûre dans les attributs
 */
function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Génère les balises hreflang pour une route donnée (toutes les langues)
 */
function buildHreflangTags(routeKey, allRoutes) {
  const tags = VALID_LANGS.map((lang) => {
    const url = allRoutes[lang]?.[routeKey] ?? "/";
    const domain = DOMAINS[lang];
    return `  <link rel="alternate" hreflang="${lang}" href="${domain}${url}" />`;
  });
  // x-default pointe vers FR (site principal)
  const defaultUrl = allRoutes["fr"]?.[routeKey] ?? "/";
  tags.push(
    `  <link rel="alternate" hreflang="x-default" href="${DOMAINS["fr"]}${defaultUrl}" />`
  );
  return tags.join("\n");
}

/**
 * Injecte le HTML pré-rendu et les metas dans le template index.html
 */
function injectIntoTemplate(tmpl, { html, lang, canonicalUrl, hreflangTags, locale, meta }) {
  let result = tmpl;

  // 1. Langue HTML
  result = result.replace(/lang="[^"]*"/, `lang="${lang}"`);

  // 2. Locale dans window.__INITIAL_LOCALE__
  result = result.replace(/__LOCALE__/g, locale);

  // 3. Metas SEO spécifiques à la page
  result = result.replace(/__PAGE_TITLE__/g, escapeHtml(meta.title));
  result = result.replace(/__PAGE_DESCRIPTION__/g, escapeHtml(meta.description));
  result = result.replace(/__PAGE_IMAGE__/g, escapeHtml(meta.image));
  result = result.replace(/__PAGE_URL__/g, escapeHtml(canonicalUrl));

  // 4. Contenu pré-rendu dans #root
  result = result.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`
  );

  // 5. Canonical (remplacer ou ajouter avant </head>)
  const canonicalTag = `  <link rel="canonical" href="${canonicalUrl}" />`;
  if (result.includes('rel="canonical"')) {
    result = result.replace(/<link rel="canonical"[^>]*\/>/, canonicalTag);
  } else {
    result = result.replace("</head>", `${canonicalTag}\n</head>`);
  }

  // 6. Hreflang (remplacer le bloc existant)
  const hreflangComment = "<!-- Hreflang : versions linguistiques du site -->";
  const hreflangBlock = `${hreflangComment}\n${hreflangTags}`;
  if (result.includes(hreflangComment)) {
    result = result.replace(
      /<!-- Hreflang[^>]*-->\n(  <link rel="alternate"[^\n]*\n)*/,
      hreflangBlock + "\n"
    );
  }

  return result;
}

// ─── Pipeline de pre-rendering ─────────────────────────────────────────────

let total = 0;
let errors = 0;
const startTime = Date.now();

console.log("🚀 Démarrage du pre-rendering SSG (renderToString)...\n");
console.log(`   ${VALID_LANGS.length} langues × 27 pages = ~135 fichiers HTML\n`);

for (const lang of VALID_LANGS) {
  const langRoutes = ROUTES[lang];
  if (!langRoutes) {
    console.warn(`⚠️  Langue inconnue : ${lang}`);
    continue;
  }

  const domain = DOMAINS[lang];

  for (const [routeKey, url] of Object.entries(langRoutes)) {
    try {
      // Rendre la page (récupère aussi les metas collectées en SSR)
      const { html, meta } = await render(url, lang);
      console.log(`[META] [${lang}] ${url} → "${meta.title}"`);

      // URL canonique
      const canonicalUrl = `${domain}${url}`;

      // Mettre à jour l'URL dans les metas (on connaît le domaine ici)
      meta.url = canonicalUrl;

      // Balises hreflang
      const hreflangTags = buildHreflangTags(routeKey, ROUTES);

      // Injecter dans le template
      const finalHtml = injectIntoTemplate(template, {
        html,
        lang,
        canonicalUrl,
        hreflangTags,
        locale: lang,
        meta,
      });

      // Chemin de sortie : dist/{url}/index.html
      let pageHtml = finalHtml;
      let outputPath;
      if (url === "/") {
        // Home page : dist/index.html (FR) ou dist/_lang_{lang}/index.html (autres)
        if (lang === "fr") {
          outputPath = join(DIST, "index.html");
        } else {
          // Les pages _lang_XX sont servies sur leurs domaines TLD respectifs
          // (hallucinecran.it, .com, .de, .es) — indexation autorisée.
          const langDir = join(DIST, `_lang_${lang}`);
          mkdirSync(langDir, { recursive: true });
          outputPath = join(langDir, "index.html");
        }
      } else {
        // Autres pages : dist/{url-sans-slash}/index.html
        // Seul FR écrit dans dist/ directement (hallucinecran.fr).
        // Les autres langues écrivent dans dist/_lang_{lang}/ pour ne pas
        // écraser les fichiers FR (les routes IT/EN/DE/ES partagent les mêmes URLs).
        const urlPath = url.startsWith("/") ? url.slice(1) : url;
        if (lang === "fr") {
          const outputDir = join(DIST, urlPath);
          mkdirSync(outputDir, { recursive: true });
          outputPath = join(outputDir, "index.html");
        } else {
          // Les pages _lang_XX sont servies sur leurs domaines TLD respectifs
          // (hallucinecran.it, .com, .de, .es) — indexation autorisée.
          const langDir = join(DIST, `_lang_${lang}`, urlPath);
          mkdirSync(langDir, { recursive: true });
          outputPath = join(langDir, "index.html");
        }
      }

      writeFileSync(outputPath, pageHtml, "utf-8");
      total++;

      const shortPath = outputPath.replace(DIST + "/", "dist/");
      console.log(`  ✅ [${lang}] ${url} → ${shortPath}`);
    } catch (err) {
      errors++;
      console.error(`  ❌ [${lang}] ${url} → ERREUR: ${err.message}`);
      if (process.env.DEBUG_SSR) {
        console.error(err.stack);
      }
    }
  }
  console.log(`\n📦 Langue ${lang.toUpperCase()} terminée\n`);
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`✨ Pre-rendering terminé en ${elapsed}s`);
console.log(`   ${total} pages générées, ${errors} erreurs\n`);

if (errors > 0) {
  console.error(`⚠️  ${errors} page(s) ont échoué. Relancer avec DEBUG_SSR=1 pour les détails.`);
  process.exit(1);
}

// ─── Génération automatique du sitemap ────────────────────────────────────────

/** Priorité et changefreq par clé de route */
const ROUTE_META = {
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
  "trouver-distributeur": { priority: "0.7", changefreq: "monthly" },
  "mentions-legales":     { priority: "0.3", changefreq: "yearly" },
  confidentialite:        { priority: "0.3", changefreq: "yearly" },
  cookies:                { priority: "0.3", changefreq: "yearly" },
};

function buildSitemap() {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  const routeKeys = Object.keys(ROUTES["fr"]);

  for (const routeKey of routeKeys) {
    const meta = ROUTE_META[routeKey] ?? { priority: "0.5", changefreq: "monthly" };

    for (const lang of VALID_LANGS) {
      const domain = DOMAINS[lang];
      const path = ROUTES[lang]?.[routeKey] ?? ROUTES["fr"][routeKey];
      const loc = `${domain}${path}`;

      lines.push("  <url>");
      lines.push(`    <loc>${loc}</loc>`);

      // hreflang pour toutes les langues
      for (const hLang of VALID_LANGS) {
        const hDomain = DOMAINS[hLang];
        const hPath = ROUTES[hLang]?.[routeKey] ?? ROUTES["fr"][routeKey];
        lines.push(`    <xhtml:link rel="alternate" hreflang="${hLang}" href="${hDomain}${hPath}"/>`);
      }
      // x-default → FR
      lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAINS.fr}${ROUTES.fr[routeKey]}"/>`);

      lines.push(`    <changefreq>${meta.changefreq}</changefreq>`);
      lines.push(`    <priority>${meta.priority}</priority>`);
      lines.push("  </url>");
    }
  }

  lines.push("</urlset>");
  return lines.join("\n");
}

const sitemapPath = join(DIST, "sitemap.xml");
const sitemapContent = buildSitemap();
writeFileSync(sitemapPath, sitemapContent, "utf-8");
const routeCount = Object.keys(ROUTES["fr"]).length;
console.log(`🗺️  Sitemap généré : ${sitemapPath} (${routeCount * VALID_LANGS.length} URLs)`);
