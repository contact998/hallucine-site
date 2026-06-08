import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { sdk } from "./sdk";
import { getSeoOverrideForPath, applySeoOverride } from "../seo";
import { markdownFileForRequest } from "../llmsFull";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      // En dev, injecter la locale selon le domaine (ou "fr" par défaut)
      const locale = getLocaleFromHost(req.hostname);
      template = template.replace(/__LOCALE__/g, locale);
      template = template.replace(/<!--__OG_LOCALE_TAGS__-->/g, buildOgLocaleTags(locale));
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// Mapping domaine → langue
const DOMAIN_LOCALE_MAP: Record<string, string> = {
  "hallucinecran.fr": "fr",
  "www.hallucinecran.fr": "fr",
  "hallucinecran.com": "en",
  "www.hallucinecran.com": "en",
  "hallucinecran.de": "de",
  "www.hallucinecran.de": "de",
  "hallucinecran.es": "es",
  "www.hallucinecran.es": "es",
  "hallucinecran.it": "it",
  "www.hallucinecran.it": "it",
};

function getLocaleFromHost(hostname: string): string {
  return DOMAIN_LOCALE_MAP[hostname] || "fr";
}

// Origine canonique par langue (un TLD par locale).
const LOCALE_ORIGINS: Record<string, string> = {
  fr: "https://hallucinecran.fr",
  en: "https://hallucinecran.com",
  de: "https://hallucinecran.de",
  es: "https://hallucinecran.es",
  it: "https://hallucinecran.it",
};

const VALID_LANG_PREFIXES = new Set(["fr", "en", "de", "es", "it"]);

// Décide quoi faire d'un path qui commence par /xx ou /xx/... :
//  - préfixe inconnu (/sv, /nl, /pt…)  → 404 propre (bots SEO)
//  - préfixe = langue du TLD courant   → 301 canonique sans préfixe
//  - préfixe d'une autre langue valide → 301 vers la home du TLD correspondant
//  - aucun préfixe 2-lettres           → null (laisser passer)
export function resolveLocalePrefixRedirect(
  pathOnly: string,
  hostname: string
): { status: 301; location: string } | { status: 404 } | null {
  const m = pathOnly.match(/^\/([a-z]{2})(\/|$)/);
  if (!m) return null;
  const lang = m[1];
  if (!VALID_LANG_PREFIXES.has(lang)) {
    return { status: 404 };
  }
  const currentLocale = getLocaleFromHost(hostname);
  if (lang === currentLocale) {
    const rest = pathOnly.replace(/^\/[a-z]{2}/, "") || "/";
    return { status: 301, location: rest };
  }
  return { status: 301, location: LOCALE_ORIGINS[lang] + "/" };
}

const OG_LOCALES: Record<string, string> = {
  fr: "fr_FR",
  en: "en_US",
  de: "de_DE",
  es: "es_ES",
  it: "it_IT",
};

function buildOgLocaleTags(lang: string): string {
  const current = OG_LOCALES[lang] ?? "fr_FR";
  const alternates = Object.entries(OG_LOCALES)
    .filter(([l]) => l !== lang)
    .map(([, ogl]) => `<meta property="og:locale:alternate" content="${ogl}" />`);
  return [
    `<meta property="og:locale" content="${current}" />`,
    ...alternates,
  ].join("\n    ");
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Charger le template index.html de base
  const indexHtmlPath = path.resolve(distPath, "index.html");
  const baseIndexHtml = fs.readFileSync(indexHtmlPath, "utf-8");

  // Charger le template "propre" avec placeholders pour les pages dynamiques (blog)
  const cleanTemplatePath = path.resolve(distPath, "_template.html");
  const cleanTemplate = fs.existsSync(cleanTemplatePath)
    ? fs.readFileSync(cleanTemplatePath, "utf-8")
    : baseIndexHtml;

  // Échappe les caractères spéciaux HTML pour injection sûre dans les attributs
  const escapeHtml = (str: string = "") =>
    str
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  // Image par défaut pour les articles sans imageUrl
  const DEFAULT_OG_IMAGE =
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/og-accueil-KjTW2K29SHyinVRpsNcnQC.png";

  // Markdown for Agents — négociation de contenu (Accept: text/markdown).
  // Sert le markdown pré-généré (index.md, cf. scripts/prerender.mjs) de la page
  // demandée. HTML reste le défaut pour les navigateurs. Placé en tête pour
  // primer sur le statique et le SSG.
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    const accept = String(req.headers["accept"] || "").toLowerCase();
    if (!accept.includes("text/markdown")) return next();

    const locale = getLocaleFromHost(req.hostname);
    const reqPath = req.originalUrl.split("?")[0];
    const rel = markdownFileForRequest(reqPath, locale);
    if (rel.includes("..")) return next(); // garde anti-traversée

    const mdPath = path.resolve(distPath, rel);
    if (!mdPath.startsWith(path.resolve(distPath) + path.sep)) return next();

    try {
      if (fs.existsSync(mdPath)) {
        const md = fs.readFileSync(mdPath, "utf-8");
        res
          .status(200)
          .set({
            "Content-Type": "text/markdown; charset=utf-8",
            // Vary: ne pas servir ce markdown à un navigateur (qui demande du HTML).
            Vary: "Accept, Host",
            "X-Markdown-Tokens": String(Math.ceil(md.length / 4)),
            "Cache-Control": "no-cache, max-age=0, must-revalidate",
          })
          .end(md);
        return;
      }
    } catch (e) {
      console.error("[md-agents]", e instanceof Error ? e.message : e);
    }
    next(); // pas de markdown pour cette route → HTML normal
  });

  // Assets versionnés Vite (JS, CSS, images) — cache 1 an
  app.use(
    "/assets",
    express.static(path.join(distPath, "assets"), {
      maxAge: "1y",
      immutable: true,
      index: false,
    })
  );

  // Reste des fichiers statiques — cache court.
  // redirect:false → pas de 301 /chemin → /chemin/ sur les répertoires :
  // le handler SSG ci-dessous sert la page pré-rendue directement sur l'URL
  // canonique sans slash (évite un saut de redirection sur les liens internes).
  app.use(express.static(distPath, { index: false, redirect: false }));

  // Préfixes de langue dans l'URL (/en, /fr, /de, /es, /it ou /sv, /nl…).
  // Chaque langue est sur son propre TLD ; les chemins préfixés sont donc
  // soit canonisés (strip du préfixe), soit redirigés vers le bon TLD,
  // soit refusés (404 pour les codes inconnus testés par bots SEO).
  app.use((req, res, next) => {
    const [pathOnly, query] = req.originalUrl.split("?");
    const decision = resolveLocalePrefixRedirect(pathOnly, req.hostname);
    if (!decision) return next();
    // Cloudflare cache par défaut les 301 ~30min — ce qui rend invisibles les
    // changements de cette table pendant longtemps après un deploy.
    res.set("Cache-Control", "no-store");
    if (decision.status === 404) {
      res.status(404).set({ "Content-Type": "text/plain" }).end("Not Found");
      return;
    }
    // Préserver la query sur le strip canonique (URL relative).
    // Pour le cross-locale on retombe sur la home du TLD : on ne propage pas
    // la query (un /en/?utm=… provenant du .fr n'a pas de sens côté .com).
    const isCanonicalStrip = decision.location.startsWith("/");
    const target =
      decision.location + (isCanonicalStrip && query ? "?" + query : "");
    res.redirect(301, target);
  });

  // Redirections 301 d'anciennes URLs publiques fusionnées dans
  // `/devenir-distributeur` (par langue). Sans ça, ces URLs renvoient 404 si
  // tapées directement (le redirect côté client wouter ne s'applique qu'après
  // l'arrivée du JS).
  const LEGACY_DISTRIBUTOR_REDIRECTS: Record<string, string> = {
    "/trouver-distributeur":     "/devenir-distributeur",
    "/find-distributor":         "/become-distributor",
    "/haendler-finden":          "/haendler-werden",
    "/encontrar-distribuidor":   "/convertirse-distribuidor",
    "/trovare-distributore":     "/diventare-distributore",
  };
  app.use((req, res, next) => {
    const path = req.originalUrl.split("?")[0].replace(/\/+$/, "");
    const target = LEGACY_DISTRIBUTOR_REDIRECTS[path];
    if (target) {
      res.redirect(301, target);
      return;
    }
    next();
  });

  // Normalisation slash final : `/page/` → 301 → `/page` (préserve la query).
  // Évite le contenu dupliqué SEO + garantit que window.location.pathname côté
  // client correspond EXACTEMENT au path utilisé pour la route wouter (qui ne
  // matche pas le slash final → sinon mismatch avec NotFound à l'hydratation).
  app.use((req, res, next) => {
    const url = req.originalUrl;
    const [pathOnly, query] = url.split("?");
    if (pathOnly.length > 1 && pathOnly.endsWith("/")) {
      const target = pathOnly.replace(/\/+$/, "") + (query ? "?" + query : "");
      res.redirect(301, target);
      return;
    }
    next();
  });

  // SSG + Fallback SPA : priorité aux pages pré-rendues, sinon index.html générique
  app.use("*", async (req, res) => {
    const locale = getLocaleFromHost(req.hostname);

    // Utiliser originalUrl pour éviter les soucis de Express avec "*"
    const reqPath = req.originalUrl.split("?")[0];

    // Vérifier si l'utilisateur est admin pour injecter le nav-widget
    let isAdmin = false;
    try {
      const user = await sdk.authenticateRequest(req);
      isAdmin = user?.role === "admin";
    } catch {
      isAdmin = false;
    }

    // Ne pas injecter le nav-widget en dev (le dev server retournerait du HTML pour cette URL)
    const navWidget = "";

    const injectNavWidget = (html: string) =>
      navWidget ? html.replace("</body>", `${navWidget}</body>`) : html;

    // 1. Chercher la page pré-rendue : /chemin/index.html
    const urlPath = reqPath === "/" ? "" : reqPath;
    const langPrefix = locale !== "fr" ? `_lang_${locale}` : "";
    const prerenderedPath = path.join(distPath, langPrefix, urlPath, "index.html");

    if (fs.existsSync(prerenderedPath)) {
      // Servir la page pré-rendue avec la bonne locale injectée
      let prerenderedHtml = injectNavWidget(
        fs.readFileSync(prerenderedPath, "utf-8").replace(/__LOCALE__/g, locale)
      );
      // Override SEO runtime (admin) — tolérant : en cas d'erreur, on sert l'original
      try {
        const ov = await getSeoOverrideForPath(reqPath, Date.now());
        if (ov) prerenderedHtml = applySeoOverride(prerenderedHtml, ov);
      } catch (e) {
        console.error("[seo] override non appliqué:", e instanceof Error ? e.message : e);
      }
      res.status(200).set({
        "Content-Type": "text/html; charset=utf-8",
        "Vary": "Host",
        "Cache-Control": "no-cache, max-age=0, must-revalidate",
      }).end(prerenderedHtml);
      return;
    }

    // 2. Articles de blog : /blog/:slug — rendu serveur du contenu + metas depuis la DB.
    //    Le build n'a PAS accès à la base (réseau privé indisponible au build) → on rend
    //    au runtime, où la base EST joignable. Crawlers : corps d'article visible,
    //    hreflang par-article, canonical/OG https, maillage interne (anti-orphelin).
    //    Le client reprend en createRoot (cf. main.tsx) avec __SSR_INITIAL_DATA__.
    const blogMatch = reqPath.match(/^\/blog\/([^\/]+)\/?$/);
    if (blogMatch) {
      const slug = decodeURIComponent(blogMatch[1]);
      try {
        const { getBlogPostBySlug, getPublishedPosts, getAllPublishedForSitemap } = await import("../blog");
        const post = await getBlogPostBySlug(slug);
        if (post && post.status === "published") {
          const title = post.title;
          const description = post.metaDescription || post.excerpt || "";

          const postRecord = post as Record<string, unknown>;
          const headerImageUrl =
            typeof postRecord.headerImageUrl === "string" ? postRecord.headerImageUrl : undefined;
          const headerImage = headerImageUrl || post.imageUrl || DEFAULT_OG_IMAGE;

          // Origine canonique HTTPS par langue (TLD). Évite le http derrière le
          // proxy (req.protocol) et l'og:url ≠ canonical signalés par l'audit.
          const origin = LOCALE_ORIGINS[locale] ?? LOCALE_ORIGINS.fr;
          const canonicalPath = reqPath.replace(/\/+$/, "");
          const canonicalUrl = `${origin}${canonicalPath}`;

          // hreflang croisés via le cluster de traductions (parentId). Auto-référence
          // garantie → corrige « self-reference hreflang missing ».
          let hreflangTags = `  <link rel="alternate" hreflang="${post.lang}" href="${canonicalUrl}" />`;
          try {
            const key = post.parentId ?? post.id;
            const byLang: Record<string, string> = { [post.lang]: post.slug };
            for (const r of await getAllPublishedForSitemap()) {
              if ((r.parentId ?? r.id) === key) byLang[r.lang] = r.slug;
            }
            const lines: string[] = [];
            for (const [lg, og] of Object.entries(LOCALE_ORIGINS)) {
              if (byLang[lg]) lines.push(`  <link rel="alternate" hreflang="${lg}" href="${og}/blog/${byLang[lg]}" />`);
            }
            lines.push(`  <link rel="alternate" hreflang="x-default" href="${LOCALE_ORIGINS.fr}/blog/${byLang.fr ?? post.slug}" />`);
            hreflangTags = lines.join("\n");
          } catch { /* fallback = auto-référence seule */ }

          // Maillage interne : autres articles de la même langue (anti-orphelin + liens sortants).
          let relatedHtml = "";
          try {
            const related = (await getPublishedPosts(locale, 8, 0))
              .filter((p) => p.slug !== post.slug).slice(0, 6);
            if (related.length) {
              relatedHtml =
                `<aside><h2>Autres articles</h2><ul>` +
                related.map((p) => `<li><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a></li>`).join("") +
                `</ul></aside>`;
            }
          } catch { /* non bloquant */ }

          // Corps rendu serveur (contenu de confiance — auteurs internes ; on retire
          // tout de même script/style/handlers par prudence). Remplacé par le client.
          const safeContent = String(post.content || "")
            .replace(/<script[\s\S]*?<\/script>/gi, "")
            .replace(/<style[\s\S]*?<\/style>/gi, "")
            .replace(/ on[a-z]+\s*=\s*"[^"]*"/gi, "")
            .replace(/ on[a-z]+\s*=\s*'[^']*'/gi, "")
            .replace(/javascript:/gi, "");
          const rootContent =
            `<main><p><a href="/blog">← Blog</a></p>` +
            `<article><h1>${escapeHtml(title)}</h1>${safeContent}</article>` +
            relatedHtml + `</main>`;

          const jsonLd = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": description,
            "image": headerImage,
            "datePublished": post.publishedAt ?? post.createdAt,
            "dateModified": post.updatedAt ?? post.publishedAt ?? post.createdAt,
            "author": { "@type": "Person", "name": post.author ?? "Hallucine" },
            "publisher": { "@type": "Organization", "name": "Hallucine", "url": "https://hallucinecran.fr" },
            "mainEntityOfPage": canonicalUrl,
          }).replace(/</g, "\\u003c");

          // Données SSR pour le client : BlogPost lit __SSR_INITIAL_DATA__.blogPost
          // → premier rendu identique, pas de spinner (cf. readSsrBlogPost).
          const ssrData = JSON.stringify({ blogPost: { slug: post.slug, data: post } }).replace(/</g, "\\u003c");

          let html = cleanTemplate
            .replace(/__LOCALE__/g, locale)
            .replace(/<!--__OG_LOCALE_TAGS__-->/g, buildOgLocaleTags(locale))
            .replace(/__PAGE_TITLE__/g, escapeHtml(`${title} | Hallucine`))
            .replace(/__PAGE_DESCRIPTION__/g, escapeHtml(description))
            .replace(/__PAGE_IMAGE__/g, escapeHtml(headerImage))
            .replace(/__PAGE_URL__/g, escapeHtml(canonicalUrl));
          // Retirer les hreflang/canonical par défaut du template (homepages) pour
          // les remplacer par ceux de l'article.
          html = html.replace(/[ \t]*<link rel="alternate" hreflang="[^"]*"[^>]*>\n?/g, "");
          html = html.replace(/[ \t]*<link rel="canonical"[^>]*>\n?/g, "");
          // Corps dans #root
          html = html.replace('<div id="root"></div>', `<div id="root">${rootContent}</div>`);
          // canonical + hreflang + JSON-LD + données SSR avant </head>
          html = html.replace("</head>",
            `  <link rel="canonical" href="${canonicalUrl}" />\n${hreflangTags}\n` +
            `  <script type="application/ld+json">${jsonLd}</script>\n` +
            `  <script>window.__SSR_INITIAL_DATA__=${ssrData}</script>\n</head>`);
          html = injectNavWidget(html);
          res.status(200).set({
            "Content-Type": "text/html",
            "Vary": "Host",
            "Cache-Control": "no-cache, max-age=0, must-revalidate",
          }).end(html);
          return;
        }
      } catch (err) {
        console.warn("[blog-ssr] Erreur rendu article:", err);
      }
    }

    // 3. Routes SPA valides (admin, profil, login) — rendu 100% client.
    // ⚠️ On utilise `cleanTemplate` (= dist/public/_template.html, root vide)
    // PAS `baseIndexHtml` (= dist/public/index.html = home prérendu).
    // Servir le HTML du home pour /admin ferait planter hydrateRoot avec
    // un mismatch massif. Avec un root vide, main.tsx détecte l'absence de
    // contenu SSR et bascule sur createRoot (CSR propre).
    const SPA_ROUTES = [
      /^\/admin(\/.*)?$/,
      /^\/admin-v2(\/.*)?$/,
      /^\/profil$/,
      /^\/login$/
    ];
    const isSpaRoute = SPA_ROUTES.some((pattern) => pattern.test(reqPath));
    if (isSpaRoute) {
      const defaultTitle = "Hallucine — Écrans Gonflables & Cinéma Plein Air";
      const defaultDesc = "Fabricant français d'écrans gonflables depuis 1992. Écrans de cinéma, événementiel, structures gonflables sur mesure.";
      const defaultUrl = `${req.protocol}://${req.hostname}${reqPath}`;
      const html = injectNavWidget(
        cleanTemplate
          .replace(/__LOCALE__/g, locale)
          .replace(/<!--__OG_LOCALE_TAGS__-->/g, buildOgLocaleTags(locale))
          .replace(/__PAGE_TITLE__/g, escapeHtml(defaultTitle))
          .replace(/__PAGE_DESCRIPTION__/g, escapeHtml(defaultDesc))
          .replace(/__PAGE_IMAGE__/g, DEFAULT_OG_IMAGE)
          .replace(/__PAGE_URL__/g, escapeHtml(defaultUrl))
      );
      // X-Robots-Tag : ces routes ne doivent jamais être indexées
      res.status(200).set({
        "Content-Type": "text/html",
        "Vary": "Host",
        "X-Robots-Tag": "noindex, nofollow",
      }).end(html);
      return;
    }
    // 4. URL inconnue — vrai 404, pas de soft 404 dans GSC
    res.status(404).set({ "Content-Type": "text/plain" }).end("Not Found");
  });
}
// login route added
