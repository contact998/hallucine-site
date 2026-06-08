/**
 * prerender.mjs — Script de pre-rendering SSG (renderToPipeableStream)
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

// Le build Railway n'a pas accès au réseau privé (mysql.railway.internal).
// On bascule sur l'URL publique de la base pour que le bake des images et le
// sitemap puissent la lire pendant le build. Sans effet au runtime (process séparé).
if (process.env.DATABASE_PUBLIC_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_PUBLIC_URL;
}

// Idem pour la base du BLOG (BLOG_DATABASE_URL ≠ DATABASE_URL). Les articles sont
// lus via server/blog.ts (pool dédié) pour être pré-rendus. Au build, basculer sur
// l'URL publique du blog (réseau privé indisponible). Sans ça : 0 article trouvé
// → /blog/:slug servi en coquille CSR (corps vide) → SEO faible (audit Ahrefs).
if (process.env.BLOG_DATABASE_PUBLIC_URL) {
  process.env.BLOG_DATABASE_URL = process.env.BLOG_DATABASE_PUBLIC_URL;
}

// ─── Configuration ─────────────────────────────────────────────────────────

const VALID_LANGS = ["fr", "en", "de", "es", "it", "pt"];

/** Domaine de production par langue */
const DOMAINS = {
  fr: "https://hallucinecran.fr",
  en: "https://hallucinecran.com",
  de: "https://hallucinecran.de",
  es: "https://hallucinecran.es",
  it: "https://hallucinecran.it",
  pt: "https://hallucinecran.pt",
};

/** Mapping langue → og:locale (BCP-47 → OG format) */
const OG_LOCALES = {
  fr: "fr_FR",
  en: "en_US",
  de: "de_DE",
  es: "es_ES",
  it: "it_IT",
  pt: "pt_PT",
};

/** Construit le bloc <meta og:locale> + alternates pour la langue courante */
function buildOgLocaleTags(lang) {
  const current = OG_LOCALES[lang] ?? "fr_FR";
  const alternates = Object.entries(OG_LOCALES)
    .filter(([l]) => l !== lang)
    .map(([, ogl]) => `<meta property="og:locale:alternate" content="${ogl}" />`);
  return [
    `<meta property="og:locale" content="${current}" />`,
    ...alternates,
  ].join("\n    ");
}

// ─── Import de l'entrypoint SSR ────────────────────────────────────────────

const { render } = await import("../client/src/entry-server.tsx");
const { ROUTES } = await import("../client/src/i18n/routes.ts");
const { buildMarkdownForRoute, buildLlmsFull } = await import("../server/llmsFull.ts");
const { bundledResources } = await import("../client/src/i18n/locales-bundled.node.ts");

// ─── Bake build-time : images figées depuis scripts/media-cache.json ───────
//
// Le build Railway n'a pas accès à la base (réseau privé indisponible au
// build). Les images sont donc figées dans scripts/media-cache.json par
// `node --env-file=.env.local --import tsx scripts/dump-media.mjs` (à
// relancer + commit après toute modif d'images), et injectées dans chaque
// HTML (window.__SSR_MEDIA__) → aucun flash à l'hydratation.

/** Charge les images bakées depuis le fichier commité */
function loadMediaCache() {
  try {
    const cache = JSON.parse(readFileSync(join(__dirname, "media-cache.json"), "utf-8"));
    const count = Object.values(cache).reduce((s, a) => s + a.length, 0);
    console.log(`🖼️  ${count} image(s) bakée(s) depuis scripts/media-cache.json\n`);
    return cache;
  } catch (err) {
    console.warn(`⚠️  media-cache.json illisible (fallback hardcodé conservé) : ${err.message}\n`);
    return {};
  }
}

const mediaCache = loadMediaCache();

// ─── API blog (base BLOG_DATABASE_URL, ≠ base principale) ────────────────────
// Import paresseux + tolérant : si la base blog est injoignable au build, on
// continue sans pré-rendre le blog (les pages statiques ne doivent jamais échouer).
let blogApi = null;
try {
  blogApi = await import("../server/blog.ts");
} catch (e) {
  console.warn(`⚠️  server/blog.ts indisponible — blog non pré-rendu : ${e.message}`);
}

/** JSON sûr pour injection dans un <script> inline */
const mediaCacheJson = JSON.stringify(mediaCache)
  .replace(/</g, "\\u003c")
  .replace(/\u2028/g, "\\u2028")
  .replace(/\u2029/g, "\\u2029");
const mediaScriptTag = `  <script>window.__SSR_MEDIA__=${mediaCacheJson}</script>`;

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
  // URLs sans trailing slash — alignées sur le canonical et les liens internes
  // (le serveur sert l'URL sans slash directement en 200).
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
function injectIntoTemplate(tmpl, { html, lang, canonicalUrl, hreflangTags, locale, meta, mediaScript }) {
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
  result = result.replace(/<!--__OG_LOCALE_TAGS__-->/g, buildOgLocaleTags(lang));

  // NB : pas de preload hero manuel — React 19 préload déjà automatiquement
  // les <img fetchPriority="high"> au SSR (vérifié en prod : <link rel=preload
  // as=image imageSizes=100vw> du bandeau dans la sortie prérendue). Ajouter un
  // preload ici ferait doublon. Le gain réel = preconnect R2 (client/index.html).

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
    // [ \t]* : tolère n'importe quelle indentation des <link> du template
    // (sinon l'ancien bloc n'est pas capturé → balises hreflang en double)
    result = result.replace(
      /<!-- Hreflang[^>]*-->\n([ \t]*<link rel="alternate"[^\n]*\n)*/,
      hreflangBlock + "\n"
    );
  }

  // 7. Images bakées depuis la DB → window.__SSR_MEDIA__
  //    (script classique en <head> : exécuté avant le bundle JS différé)
  if (mediaScript) {
    result = result.replace("</head>", `${mediaScript}\n</head>`);
  }

  // 8. headExtra : scripts d'hydratation pour les routes dynamiques
  //    (ex: window.__SSR_INITIAL_DATA__ pour les articles de blog → BlogPost
  //    lit ces données comme `initialData` de son useQuery → premier rendu
  //    client identique au SSR → hydratation sans mismatch).
  if (meta.headExtra) {
    result = result.replace("</head>", `${meta.headExtra}\n</head>`);
  }

  // 9. Inline le bundle CSS app dans le <head> → supprime la requête CSS
  //    render-blocking (le rouge Lighthouse « render blocking requests »).
  //    CSP-safe : <style> est autorisé par style-src 'unsafe-inline', alors que
  //    le pattern async classique (onload=) est bloqué par script-src-attr 'none'.
  //    Zéro FOUC (tout le CSS est présent au paint). Coût : +~18 Ko brotli/page,
  //    CSS non mutualisé entre pages — acceptable pour un site vitrine.
  result = result.replace(
    /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/,
    (m, href) => {
      try {
        return `<style>${readFileSync(join(DIST, href), "utf-8")}</style>`;
      } catch {
        return m; // lecture impossible → on garde le <link> (jamais de page cassée)
      }
    }
  );

  return result;
}

// ─── Pipeline de pre-rendering ─────────────────────────────────────────────

let total = 0;
let errors = 0;
const startTime = Date.now();

console.log("🚀 Démarrage du pre-rendering SSG (renderToPipeableStream)...\n");
console.log(`   ${VALID_LANGS.length} langues × 27 pages = ~135 fichiers HTML\n`);

for (const lang of VALID_LANGS) {
  const langRoutes = ROUTES[lang];
  if (!langRoutes) {
    console.warn(`⚠️  Langue inconnue : ${lang}`);
    continue;
  }

  const domain = DOMAINS[lang];

  for (const [routeKey, url] of Object.entries(langRoutes)) {
    // Route de redirection seule — pas de page réelle à prérendre
    if (routeKey === "trouver-distributeur") continue;
    try {
      // Page liste /blog : pré-charger les articles publiés (base blog) → la
      // liste est rendue en SSR avec ses liens → les articles ne sont plus orphelins.
      let initialData;
      if (routeKey === "blog" && blogApi) {
        try {
          const [posts, totalCount] = await Promise.all([
            blogApi.getPublishedPosts(lang, 50, 0),
            blogApi.countPublishedPosts(lang),
          ]);
          initialData = { blogList: { lang, limit: 50, data: { posts, total: totalCount } } };
        } catch (e) {
          console.warn(`  ⚠️  liste blog [${lang}] non pré-chargée : ${e.message}`);
        }
      }
      // Rendre la page (récupère aussi les metas collectées en SSR)
      const { html, meta } = await render(url, lang, mediaCache, initialData);
      console.log(`[META] [${lang}] ${url} → "${meta.title}"`);

      // URL canonique — sans trailing slash : le serveur sert l'URL canonique
      // directement en 200 (plus de redirection /chemin → /chemin/).
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
        mediaScript: mediaScriptTag,
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

      // Markdown for Agents : version markdown de la page, servie sur
      // `Accept: text/markdown` (cf. server/_core/vite.ts). Même contenu que le
      // HTML, depuis la source de vérité i18n. Non bloquant.
      try {
        const md = buildMarkdownForRoute(lang, routeKey, bundledResources[lang] ?? {});
        writeFileSync(join(dirname(outputPath), "index.md"), md, "utf-8");
      } catch (mdErr) {
        console.warn(`  ⚠️  [md] [${lang}] ${url} → ${mdErr.message}`);
      }

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

// ─── Pré-rendu des articles de blog (base BLOG_DATABASE_URL) ──────────────────
// Chaque article publié → HTML statique avec le contenu complet + hreflang croisés.
// Les articles vivent dans BLOG_DATABASE_URL (≠ DATABASE_URL), lus via
// server/blog.ts. Sans ça, /blog/:slug était servi en coquille CSR (metas
// seulement, corps vide) → Google/crawlers ne voyaient pas l'article (23 pages
// "thin/orphan" à l'audit Ahrefs). Chaque langue a son propre slug + contenu
// (traductions liées par parentId) → hreflang construits par cluster.
let blogErrors = 0;
if (blogApi) {
  try {
    // 1) Articles publiés par langue (chaque langue : slug + contenu propres).
    const byLang = {};
    let totalPosts = 0;
    for (const lang of VALID_LANGS) {
      byLang[lang] = await blogApi.getPublishedPosts(lang, 1000, 0);
      totalPosts += byLang[lang].length;
    }

    // 2) Clusters de traductions par parentId (ou id propre) → { lang: slug }
    //    pour des hreflang croisés corrects (slugs différents selon la langue).
    const clusters = new Map();
    for (const lang of VALID_LANGS) {
      for (const post of byLang[lang]) {
        const key = post.parentId ?? post.id;
        if (!clusters.has(key)) clusters.set(key, {});
        clusters.get(key)[lang] = post.slug;
      }
    }

    if (totalPosts > 0) {
      console.log(`\n📝 Pré-rendu de ${totalPosts} article(s) de blog publiés (base blog)...`);
    } else {
      console.warn(`\n⚠️  0 article publié dans la base blog — vérifie BLOG_DATABASE_URL / BLOG_DATABASE_PUBLIC_URL au build.`);
    }

    // 3) Rendre chaque article dans sa langue, avec son contenu et ses hreflang.
    for (const lang of VALID_LANGS) {
      const domain = DOMAINS[lang];
      for (const post of byLang[lang]) {
        const slug = post.slug;
        const url = `/blog/${slug}`;
        try {
          const { html, meta } = await render(url, lang, mediaCache, {
            blogPost: { slug, data: post },
          });
          const canonicalUrl = `${domain}${url}`;
          meta.url = canonicalUrl;

          // hreflang croisés via le cluster (slug par langue) + x-default → FR.
          const sib = clusters.get(post.parentId ?? post.id) ?? {};
          const hl = [];
          for (const l of VALID_LANGS) {
            if (sib[l]) hl.push(`<link rel="alternate" hreflang="${l}" href="${DOMAINS[l]}/blog/${sib[l]}" />`);
          }
          hl.push(`<link rel="alternate" hreflang="x-default" href="${DOMAINS.fr}/blog/${sib.fr ?? slug}" />`);
          const hreflangTags = hl.join("\n    ");

          const finalHtml = injectIntoTemplate(template, {
            html, lang, canonicalUrl, hreflangTags, locale: lang, meta,
            mediaScript: mediaScriptTag,
          });

          const langPrefix = lang === "fr" ? "" : `_lang_${lang}`;
          const outputDir = join(DIST, langPrefix, "blog", slug);
          mkdirSync(outputDir, { recursive: true });
          writeFileSync(join(outputDir, "index.html"), finalHtml, "utf-8");
          total++;
          console.log(`  ✅ [${lang}] ${url}`);
        } catch (err) {
          // Non bloquant : un article qui échoue retombe en CSR (statu quo), sans
          // faire échouer tout le build (≠ pages statiques dont errors est fatal).
          blogErrors++;
          console.error(`  ⚠️  [${lang}] ${url} → ${err.message}`);
          if (process.env.DEBUG_SSR) console.error(err.stack);
        }
      }
    }
    if (blogErrors > 0) {
      console.warn(`⚠️  ${blogErrors} article(s) de blog non pré-rendu(s) — non bloquant.`);
    }
  } catch (err) {
    console.warn(`⚠️  Pré-rendu blog ignoré (base blog injoignable au build ?) : ${err.message}`);
  }
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`✨ Pre-rendering terminé en ${elapsed}s`);
console.log(`   ${total} pages générées, ${errors} erreurs\n`);

if (errors > 0) {
  console.error(`⚠️  ${errors} page(s) ont échoué. Relancer avec DEBUG_SSR=1 pour les détails.`);
  process.exit(1);
}

// ─── Génération automatique du sitemap ────────────────────────────────────────

// Déplacée : le sitemap est désormais servi DYNAMIQUEMENT, un par TLD, par la
// route GET /sitemap.xml (server/_core/index.ts → server/sitemap.ts). Les articles
// de blog y sont lus au runtime via server/blog.ts (base BLOG_DATABASE_URL), ce qui
// corrige leur absence quand le build interrogeait la mauvaise base (DATABASE_URL).

// ─── Génération de llms-full.txt (markdown GEO, depuis les locales) ───────────
// Servi en statique depuis dist/public (le conteneur runtime n'a pas les locales).
try {
  const md = buildLlmsFull("fr", bundledResources.fr ?? {});
  writeFileSync(join(DIST, "llms-full.txt"), md, "utf-8");
  console.log(`📄 llms-full.txt généré (${md.length} caractères)`);
} catch (err) {
  console.warn("⚠️  llms-full.txt non généré :", err.message);
}

// Forcer la fermeture du pool MySQL (évite que le process reste bloqué)
process.exit(0);
