import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { sdk } from "./sdk";

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

  // Bloquer les patterns /xx (préfixes de langue invalides testés par bots SEO)
  // Ex: /sv, /da, /nl, /pt, /pl, /ru, /zh, /ja, /ko...
  // Ces URLs n'existent pas sur le site — retourner 404 propre pour GSC
  const VALID_LANG_PREFIXES = new Set(["fr", "en", "de", "es", "it"]);
  app.use(/^\/([a-z]{2})\/?$/, (req, res, next) => {
    const lang = req.params[0];
    if (!VALID_LANG_PREFIXES.has(lang)) {
      res.status(404).set({ "Content-Type": "text/plain" }).end("Not Found");
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
      const prerenderedHtml = injectNavWidget(
        fs.readFileSync(prerenderedPath, "utf-8").replace(/__LOCALE__/g, locale)
      );
      res.status(200).set({
        "Content-Type": "text/html; charset=utf-8",
        "Vary": "Host",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      }).end(prerenderedHtml);
      return;
    }

    // 2. Articles de blog : /blog/:slug — injecter les metas depuis la DB
    const blogMatch = reqPath.match(/^\/blog\/([^\/]+)\/?$/);
    if (blogMatch) {
      const slug = decodeURIComponent(blogMatch[1]);
      try {
        const { getBlogPostBySlug } = await import("../blog");
        const post = await getBlogPostBySlug(slug);
        if (post && post.status === "published") {
          const title = post.title;
          const description = post.metaDescription || post.excerpt || "";

          // Image d'en-tête / og:image fixe de l'article.
          // Priorité à headerImageUrl si ce champ est ajouté au modèle,
          // sinon fallback sur imageUrl puis sur l'image par défaut.
          const postRecord = post as Record<string, unknown>;
          const headerImageUrl =
            typeof postRecord.headerImageUrl === "string"
              ? postRecord.headerImageUrl
              : undefined;
          const headerImage = headerImageUrl || post.imageUrl || DEFAULT_OG_IMAGE;

          const domain = `${req.protocol}://${req.hostname}`;
          const canonicalPath = reqPath.endsWith("/") ? reqPath : `${reqPath}/`;
          const canonicalUrl = `${domain}${canonicalPath}`;

          // JSON-LD BlogPosting
          const jsonLd = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": description,
            "image": headerImage,
            "datePublished": post.publishedAt ?? post.createdAt,
            "dateModified": post.updatedAt ?? post.publishedAt ?? post.createdAt,
            "author": {
              "@type": "Person",
              "name": post.author ?? "Hallucine"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Hallucine",
              "url": "https://hallucinecran.fr"
            },
            "mainEntityOfPage": canonicalUrl,
          }).replace(/</g, "\\u003c");

          let html = injectNavWidget(
            cleanTemplate
              .replace(/__LOCALE__/g, locale)
              .replace(/<!--__OG_LOCALE_TAGS__-->/g, buildOgLocaleTags(locale))
              .replace(/__PAGE_TITLE__/g, escapeHtml(`${title} | Hallucine`))
              .replace(/__PAGE_DESCRIPTION__/g, escapeHtml(description))
              .replace(/__PAGE_IMAGE__/g, escapeHtml(headerImage))
              .replace(/__PAGE_URL__/g, escapeHtml(canonicalUrl))
          );
          // Injecter canonical + JSON-LD dans le <head>
          html = html.replace(
            "</head>",
            `  <link rel="canonical" href="${canonicalUrl}" />\n` +
            `  <script type="application/ld+json">${jsonLd}</script>\n` +
            `</head>`
          );
          res.status(200).set({
            "Content-Type": "text/html",
            "Vary": "Host",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          }).end(html);
          return;
        }
      } catch (err) {
        console.warn("[blog-og] Erreur récupération article:", err);
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
