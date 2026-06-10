/**
 * blogListSsr.ts — Rendu RUNTIME de la page liste /blog (toutes langues).
 *
 * Même contrainte que les articles (cf. vite.ts, section /blog/:slug) : le build
 * Railway n'a PAS d'accès à la base blog → la page pré-rendue au build contient
 * des squelettes sans aucun article. La liste est donc rendue au runtime, où la
 * base est joignable : liens crawlables (crawlers sans JS), hreflang ×6,
 * canonical, JSON-LD ItemList et __SSR_INITIAL_DATA__.blogList (Blog.tsx hydrate
 * sans refetch via readSsrBlogList). Le client reprend en createRoot (main.tsx).
 *
 * Fonctions PURES (aucun accès DB/FS/Express) — testées dans blogListSsr.test.ts.
 * Source de vérité partagée : ROUTES + LANGUAGE_DOMAINS (zéro duplication).
 */
import { ROUTES } from "../../client/src/i18n/routes";
import { LANGUAGE_DOMAINS } from "../../client/src/i18n/domains";
import type { BlogPost } from "../../drizzle/schema";

/** Chemin de la page liste blog pour une langue ("/blog" partout aujourd'hui). */
export function blogListPath(locale: string): string {
  const routes = ROUTES as Record<string, Record<string, string> | undefined>;
  return routes[locale]?.blog ?? routes.fr?.blog ?? "/blog";
}

/** Title tag ≤ 60 car. : suffixe « | Hallucine » (12 car.) seulement si le titre tient (≤ 48). */
export function pageTitleWithBrand(title: string): string {
  return title.length <= 48 ? `${title} | Hallucine` : title;
}

const escapeHtml = (str: string = "") =>
  str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Métadonnées localisées de la liste, extraites du HTML pré-rendu au build
 * (title/description/og:image/h1 y sont déjà traduits ET échappés HTML —
 * ne pas ré-échapper à l'injection).
 */
export function extractListMeta(prerenderedHtml: string): {
  title?: string;
  description?: string;
  image?: string;
  h1?: string;
} {
  return {
    title: prerenderedHtml.match(/<title>([^<]+)<\/title>/)?.[1],
    description: prerenderedHtml.match(/<meta name="description" content="([^"]*)"/)?.[1],
    image: prerenderedHtml.match(/<meta property="og:image" content="([^"]*)"/)?.[1],
    h1: prerenderedHtml.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1],
  };
}

/** Construit le HTML complet de la page liste à partir du template propre. */
export function buildBlogListHtml(opts: {
  cleanTemplate: string;
  locale: string;
  posts: BlogPost[];
  total: number;
  /** Valeurs DÉJÀ échappées HTML (extraites du pré-rendu ou défauts sûrs). */
  meta: { title: string; description: string; image: string; h1: string };
  ogLocaleTags: string;
}): string {
  const { cleanTemplate, locale, posts, total, meta, ogLocaleTags } = opts;
  const origin =
    LANGUAGE_DOMAINS[locale as keyof typeof LANGUAGE_DOMAINS] ?? LANGUAGE_DOMAINS.fr;
  const canonicalUrl = `${origin}${blogListPath(locale)}`;

  // hreflang ×6 + x-default — même topologie que le sitemap (un TLD par langue).
  const hreflang = [
    ...Object.entries(LANGUAGE_DOMAINS).map(
      ([lg, og]) => `  <link rel="alternate" hreflang="${lg}" href="${og}${blogListPath(lg)}" />`,
    ),
    `  <link rel="alternate" hreflang="x-default" href="${LANGUAGE_DOMAINS.fr}${blogListPath("fr")}" />`,
  ].join("\n");

  // Liens crawlables — bloc serveur uniquement, remplacé par le client au montage.
  const items = posts
    .map((p) => {
      const date = p.publishedAt
        ? new Date(p.publishedAt).toISOString().split("T")[0]
        : "";
      return (
        `<li><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a>` +
        (date ? ` <time datetime="${date}">${date}</time>` : "") +
        (p.excerpt ? `<p>${escapeHtml(p.excerpt)}</p>` : "") +
        `</li>`
      );
    })
    .join("");
  const rootContent = `<main><h1>${meta.h1}</h1><ul>${items}</ul></main>`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "url": canonicalUrl,
    "hasPart": {
      "@type": "ItemList",
      "numberOfItems": posts.length,
      "itemListElement": posts.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `${origin}/blog/${p.slug}`,
        "name": p.title,
      })),
    },
  }).replace(/</g, "\\u003c");

  // Blog.tsx lit __SSR_INITIAL_DATA__.blogList via readSsrBlogList(lang) → {posts,total}.
  const ssrData = JSON.stringify({
    blogList: { lang: locale, limit: 50, data: { posts, total } },
  }).replace(/</g, "\\u003c");

  let html = cleanTemplate
    .replace(/__LOCALE__/g, locale)
    .replace(/<!--__OG_LOCALE_TAGS__-->/g, ogLocaleTags)
    .replace(/__PAGE_TITLE__/g, meta.title)
    .replace(/__PAGE_DESCRIPTION__/g, meta.description)
    .replace(/__PAGE_IMAGE__/g, meta.image)
    .replace(/__PAGE_URL__/g, canonicalUrl);
  // Retirer hreflang/canonical par défaut du template → remplacés par ceux de la liste.
  html = html.replace(/[ \t]*<link rel="alternate" hreflang="[^"]*"[^>]*>\n?/g, "");
  html = html.replace(/[ \t]*<link rel="canonical"[^>]*>\n?/g, "");
  html = html.replace('<div id="root"></div>', `<div id="root">${rootContent}</div>`);
  html = html.replace(
    "</head>",
    `  <link rel="canonical" href="${canonicalUrl}" />\n${hreflang}\n` +
      `  <script type="application/ld+json">${jsonLd}</script>\n` +
      `  <script>window.__SSR_INITIAL_DATA__=${ssrData}</script>\n</head>`,
  );
  return html;
}
