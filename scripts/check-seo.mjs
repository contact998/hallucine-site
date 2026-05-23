/**
 * check-seo.mjs — Vérifications SEO automatiques post-build
 *
 * Exécuté après pnpm build:ssr, avant le déploiement Railway.
 * Si une vérification critique échoue → exit(1) bloque le déploiement.
 *
 * Vérifications :
 *   1. Pages HTML pré-rendues : title, description, canonical, hreflang, JSON-LD, noindex
 *   2. Locales : longueur des meta_title (≤60 car.) et meta_desc (≤160 car.)
 *   3. Routes sans config RelatedProducts (warning, pas erreur)
 *   4. Sitemap : trailing slash, URLs accessibles
 *
 * Usage :
 *   node scripts/check-seo.mjs
 *
 * Ajouter dans package.json :
 *   "build:ssr": "npx tsx --tsconfig tsconfig.ssr.json scripts/prerender.mjs && node scripts/check-seo.mjs"
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist", "public");
const LOCALES = join(ROOT, "client", "src", "locales");

// ─── Couleurs console ─────────────────────────────────────────────────────
const RED    = "\x1b[31m";
const GREEN  = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE   = "\x1b[34m";
const RESET  = "\x1b[0m";
const BOLD   = "\x1b[1m";

let errors   = 0;
let warnings = 0;
let passed   = 0;

function ok(msg)   { passed++;   console.log(`  ${GREEN}✅${RESET} ${msg}`); }
function warn(msg) { warnings++; console.log(`  ${YELLOW}⚠️ ${RESET} ${msg}`); }
function fail(msg) { errors++;   console.log(`  ${RED}❌${RESET} ${msg}`); }
function info(msg) { console.log(`  ${BLUE}ℹ️ ${RESET} ${msg}`); }
function section(title) { console.log(`\n${BOLD}${title}${RESET}`); }

// ─── 1. Vérification des pages HTML pré-rendues ───────────────────────────

section("1. Pages HTML pré-rendues");

// Pages FR dans dist/public/*/index.html
const PUBLIC_PAGES_TO_CHECK = [
  { path: "index.html",                          label: "Home FR" },
  { path: "ecran-gonflable/index.html",          label: "Écrans FR" },
  { path: "ecran-gonflable-geant-soufflerie/index.html", label: "Écran Géant FR" },
  { path: "arche-gonflable/index.html",          label: "Arches FR" },
  { path: "tente-gonflable/index.html",          label: "Tentes FR" },
  { path: "contactez-nous/index.html",           label: "Contact FR" },
  { path: "blog/index.html",                     label: "Blog FR" },
  { path: "comparaison-ecran-gonflable/index.html", label: "Comparaison FR" },
];

// Pages autres langues dans dist/public/_lang_XX/
const LANG_PAGES_TO_CHECK = [
  { lang: "en", path: "_lang_en/index.html",            label: "Home EN" },
  { lang: "en", path: "_lang_en/inflatable-screen/index.html", label: "Écrans EN" },
  { lang: "de", path: "_lang_de/index.html",            label: "Home DE" },
  { lang: "es", path: "_lang_es/index.html",            label: "Home ES" },
  { lang: "it", path: "_lang_it/index.html",            label: "Home IT" },
];

function checkHtmlPage(filePath, label) {
  if (!existsSync(filePath)) {
    fail(`${label} — fichier absent : ${filePath}`);
    return;
  }

  const html = readFileSync(filePath, "utf-8");
  let pageOk = true;

  // title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch) {
    fail(`${label} — <title> manquant`);
    pageOk = false;
  } else if (titleMatch[1].trim().length > 70) {
    warn(`${label} — <title> trop long (${titleMatch[1].length} car.) : "${titleMatch[1].substring(0, 50)}..."`);
  }

  // meta description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  if (!descMatch) {
    fail(`${label} — <meta description> manquant`);
    pageOk = false;
  } else if (descMatch[1].length > 170) {
    warn(`${label} — <meta description> trop longue (${descMatch[1].length} car.)`);
  }

  // canonical
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  if (!canonicalMatch) {
    fail(`${label} — <link rel="canonical"> manquant`);
    pageOk = false;
  } else {
    const canonicalUrl = canonicalMatch[1];
    // Convention : pas de trailing slash (sauf la home, dont le path est "/")
    const canonicalPath = new URL(canonicalUrl).pathname;
    if (canonicalPath !== "/" && canonicalPath.endsWith("/")) {
      warn(`${label} — canonical avec trailing slash : ${canonicalUrl}`);
    }
  }

  // hreflang
  const hreflangCount = (html.match(/rel="alternate"\s+hreflang=/g) || []).length;
  if (hreflangCount === 0) {
    fail(`${label} — aucune balise hreflang`);
    pageOk = false;
  } else if (hreflangCount < 5) {
    warn(`${label} — seulement ${hreflangCount} hreflang (attendu ≥ 6 avec x-default)`);
  }

  // noindex sur pages publiques
  const isPublic = !filePath.includes("admin") && !filePath.includes("profil");
  if (isPublic && html.includes('content="noindex')) {
    fail(`${label} — noindex détecté sur une page publique !`);
    pageOk = false;
  }

  // JSON-LD
  const jsonLdMatch = html.match(/application\/ld\+json/g);
  if (!jsonLdMatch) {
    warn(`${label} — aucun JSON-LD détecté`);
  } else {
    // Vérifier que le JSON-LD est valide
    const jsonLdBlocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    for (const block of jsonLdBlocks) {
      const content = block.replace(/<script[^>]*>/, "").replace(/<\/script>/, "").trim();
      try {
        JSON.parse(content);
      } catch {
        fail(`${label} — JSON-LD invalide (erreur parse)`);
        pageOk = false;
      }
    }
  }

  if (pageOk) ok(`${label}`);
}

for (const page of PUBLIC_PAGES_TO_CHECK) {
  checkHtmlPage(join(DIST, page.path), page.label);
}

for (const page of LANG_PAGES_TO_CHECK) {
  checkHtmlPage(join(DIST, page.path), page.label);
}

// ─── 2. Longueur des meta_title et meta_desc dans les locales ─────────────

section("2. Longueur des métadonnées dans les locales");

const LANGS = ["fr", "en", "de", "es", "it"];
const TITLE_MAX = 60;
const DESC_MAX  = 160;

// Map fichier locale → clés à vérifier
const LOCALE_FILES_TO_CHECK = [
  "home", "ecrans", "ecran-geant", "ecran-etanche", "ecran-economique",
  "ecrans-led", "comparaison", "tentes", "tente-x", "tente-n", "tente-v",
  "tente-araignee", "arches-gonflables", "mobilier", "accessoires",
  "galerie", "galerie-video", "contact", "a-propos", "histoire", "blog",
  "mode-emploi", "devenir-distributeur",
];

// Correspondance RouteKey → nom de fichier locale
const ROUTE_TO_LOCALE = {
  "home":               "home",
  "ecrans":             "ecrans",
  "ecran-geant":        "ecran-geant",
  "ecran-etanche":      "ecran-etanche",
  "ecran-economique":   "ecran-economique",
  "ecrans-led":         "ecrans-led",
  "comparaison":        "comparaison",
  "tentes":             "tentes",
  "tente-x":            "tente-x",
  "tente-n":            "tente-n",
  "tente-v":            "tente-v",
  "tente-araignee":     "tente-araignee",
  "arches":             "arches-gonflables",
  "mobilier":           "mobilier",
  "accessoires":        "accessoires",
  "galerie":            "galerie",
  "galerie-video":      "galerie-video",
  "contact":            "contact",
  "a-propos":           "a-propos",
  "histoire":           "histoire",
  "blog":               "blog",
  "mode-emploi":        "mode-emploi",
  "devenir-distributeur": "devenir-distributeur",
};

let metaOk = true;

for (const lang of LANGS) {
  for (const [routeKey, localeFile] of Object.entries(ROUTE_TO_LOCALE)) {
    const filePath = join(LOCALES, lang, `${localeFile}.json`);
    if (!existsSync(filePath)) continue;

    let data;
    try {
      data = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch {
      warn(`[${lang}] ${localeFile}.json — JSON invalide`);
      continue;
    }

    if (data.meta_title) {
      const len = data.meta_title.length;
      if (len > TITLE_MAX) {
        fail(`[${lang}] ${localeFile} — meta_title trop long (${len}/${TITLE_MAX} car.) : "${data.meta_title}"`);
        metaOk = false;
      }
    }

    if (data.meta_desc) {
      const len = data.meta_desc.length;
      if (len > DESC_MAX) {
        fail(`[${lang}] ${localeFile} — meta_desc trop longue (${len}/${DESC_MAX} car.)`);
        metaOk = false;
      }
    }
  }
}

if (metaOk) ok(`Toutes les meta_title ≤ ${TITLE_MAX} car. et meta_desc ≤ ${DESC_MAX} car. sur ${LANGS.length} langues`);

// ─── 3. Routes sans config RelatedProducts ────────────────────────────────

section("3. Cohérence RelatedProducts config");

const relatedConfigPath = join(ROOT, "client", "src", "i18n", "relatedProductsConfig.ts");
const routesPath = join(ROOT, "client", "src", "i18n", "routes.ts");

if (!existsSync(relatedConfigPath)) {
  warn("relatedProductsConfig.ts absent — maillage interne non vérifié");
} else {
  const routesContent = readFileSync(routesPath, "utf-8");
  const relatedContent = readFileSync(relatedConfigPath, "utf-8");

  // Extraire les RouteKeys
  const routeKeyMatch = routesContent.match(/export type RouteKey\s*=\s*(.*?);/s);
  const routeKeys = routeKeyMatch
    ? [...routeKeyMatch[1].matchAll(/"([\w-]+)"/g)].map(m => m[1])
    : [];

  // Pages produits à avoir dans RELATED_CONFIG (exclure pages légales/admin)
  const EXCLUDED_FROM_RELATED = [
    "home", "galerie", "galerie-video", "mentions-legales",
    "confidentialite", "cookies", "blog", "contact",
    "devenir-distributeur",
  ];

  const productPages = routeKeys.filter(k => !EXCLUDED_FROM_RELATED.includes(k));
  const missingInRelated = productPages.filter(k => !relatedContent.includes(`"${k}"`));

  if (missingInRelated.length === 0) {
    ok(`Toutes les pages produits ont une config RelatedProducts (${productPages.length} pages)`);
  } else {
    for (const key of missingInRelated) {
      warn(`Route "${key}" absente de relatedProductsConfig.ts — ajouter pour le maillage interne`);
    }
  }
}

// ─── 4. Vérification du sitemap ───────────────────────────────────────────

section("4. Sitemap");

const sitemapPath = join(DIST, "sitemap.xml");

if (!existsSync(sitemapPath)) {
  fail("sitemap.xml absent dans dist/public/");
} else {
  const sitemap = readFileSync(sitemapPath, "utf-8");

  // Compter les URLs
  const locUrls = sitemap.match(/<loc>([^<]+)<\/loc>/g) || [];
  info(`${locUrls.length} URLs dans le sitemap`);

  // Vérifier l'absence de trailing slash (convention : URL canonique sans slash,
  // sauf les homes dont le path est "/")
  const withSlash = locUrls.filter(u => {
    const url = u.replace(/<\/?loc>/g, "");
    return new URL(url).pathname !== "/" && url.endsWith("/");
  });

  if (withSlash.length === 0) {
    ok(`Aucune URL du sitemap n'a de trailing slash superflu`);
  } else {
    for (const u of withSlash.slice(0, 5)) {
      fail(`URL avec trailing slash : ${u}`);
    }
    if (withSlash.length > 5) {
      fail(`... et ${withSlash.length - 5} autres URLs avec trailing slash`);
    }
  }

  // Vérifier domaines cohérents
  const validDomains = [
    "hallucinecran.fr", "hallucinecran.com",
    "hallucinecran.de", "hallucinecran.es", "hallucinecran.it",
  ];
  const badDomains = locUrls.filter(u =>
    !validDomains.some(d => u.includes(d))
  );

  if (badDomains.length === 0) {
    ok(`Tous les domaines du sitemap sont valides`);
  } else {
    for (const u of badDomains.slice(0, 3)) {
      fail(`Domaine inconnu dans le sitemap : ${u}`);
    }
  }

  // Vérifier présence de hreflang dans le sitemap
  const hreflangCount = (sitemap.match(/xhtml:link/g) || []).length;
  if (hreflangCount > 0) {
    ok(`hreflang présents dans le sitemap (${hreflangCount} balises)`);
  } else {
    warn("Aucun hreflang dans le sitemap");
  }

  // Vérifier domaines hardcodés indésirables
  if (sitemap.includes("hallucine.ai") || sitemap.includes("hallucine.fr/")) {
    fail("Domaine indésirable (hallucine.ai ou hallucine.fr) dans le sitemap");
  } else {
    ok("Aucun domaine indésirable dans le sitemap");
  }
}

// ─── 5. Vérification robots.txt ───────────────────────────────────────────

section("5. robots.txt");

const robotsPath = join(DIST, "robots.txt");

if (!existsSync(robotsPath)) {
  fail("robots.txt absent dans dist/public/");
} else {
  const robots = readFileSync(robotsPath, "utf-8");

  if (robots.includes("Disallow: /admin")) {
    ok("/admin bloqué dans robots.txt");
  } else {
    warn("/admin non bloqué dans robots.txt");
  }

  if (robots.includes("Sitemap:")) {
    ok("Directive Sitemap présente dans robots.txt");
  } else {
    warn("Directive Sitemap absente de robots.txt");
  }

  // Vérifier que le site n'est pas entièrement bloqué
  if (robots.includes("Disallow: /\n") || robots.includes("Disallow: /*")) {
    fail("robots.txt bloque tout le site !");
  } else {
    ok("robots.txt n'est pas en mode blocage total");
  }
}

// ─── 6. Pages blog pré-rendues ─────────────────────────────────────────────────────

section("6. Pages blog pré-rendues");
info("Vérification des metas blog non implémentée en statique — tester manuellement avec curl.");
info("Commande : curl -s https://hallucinecran.fr/blog/<slug>/ | grep -E '<title>|<meta name=\\\"description\\\"|application\\/ld\\\\+json'");

// ─── Résumé final ─────────────────────────────────────────────────────────

console.log(`
${BOLD}═══════════════════════════════════════════${RESET}
${BOLD}Résultat SEO Check${RESET}
${GREEN}  ✅ ${passed} vérification(s) réussie(s)${RESET}
${YELLOW}  ⚠️  ${warnings} avertissement(s)${RESET}
${RED}  ❌ ${errors} erreur(s) critique(s)${RESET}
${BOLD}═══════════════════════════════════════════${RESET}
`);

if (errors > 0) {
  console.error(`${RED}${BOLD}Build bloqué : ${errors} erreur(s) SEO critique(s) à corriger.${RESET}`);
  process.exit(1);
} else if (warnings > 0) {
  console.log(`${YELLOW}Build autorisé avec ${warnings} avertissement(s). Vérifiez les points signalés.${RESET}`);
  process.exit(0);
} else {
  console.log(`${GREEN}${BOLD}Toutes les vérifications SEO sont passées. ✨${RESET}`);
  process.exit(0);
}
