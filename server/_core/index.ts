import "./loadEnv"; // DOIT rester le tout premier import : charge .env.local avant la DB
import express from "express";
import compression from "compression";
import helmet from "helmet";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerGoogleAuthRoutes } from "../googleAuth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { buildSitemapXml, type SitemapPost } from "../sitemap";
import { buildRobotsTxt } from "../robots";
import { buildAgentSkillsIndex, getSkillMd } from "../agentSkills";
import { BLOG_SLUG_REDIRECTS } from "../blogSlugRedirects";
import { DOMAIN_LANG_MAP } from "../../client/src/i18n/domains";
import { getLegacyRedirect } from "../../client/src/i18n/routes";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  console.log("AUTH BUILD MARKER 2026-04-28");
  const app = express();
  const server = createServer(app);
  // ─── Compression gzip/deflate ─────────────────────────────────────────────────
  app.use(compression());
  // ─── Headers de sécurité ─────────────────────────────────────────────────────
  const isDev = process.env.NODE_ENV === "development";
  app.use(helmet({
    // HSTS : forcer HTTPS pendant 1 an (uniquement en production)
    hsts: isDev ? false : {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    // X-Frame-Options : empêcher le clickjacking
    frameguard: { action: "sameorigin" },
    // X-Content-Type-Options : empêcher le MIME sniffing
    noSniff: true,
    // Referrer-Policy
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    // Cross-Origin-Opener-Policy
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    // CSP — autoriser les ressources externes connues
    contentSecurityPolicy: isDev ? false : {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",   // inline scripts (Google Analytics, nav-widget)
          // 'unsafe-eval' supprimé — risque XSS (surveiller les erreurs console)
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://static.cloudflareinsights.com",   // Cloudflare Web Analytics — beacon RUM
          "https://chat.hallucine.fr", "https://chat.hallucinecran.fr",   // Chatwoot widget SDK
          "https://umami-production-737a.up.railway.app",   // Umami analytics — script.js
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",   // Tailwind + styled-components injectent du CSS inline
        ],
        fontSrc: [
          "'self'",            // woff2 auto-hébergés (/fonts/)
          "data:",             // Inter inline de la brochure (blob: hérite de cette CSP)
        ],
        connectSrc: [
          "'self'",
          "https://api.zippopotam.us",
          "https://recherche-entreprises.api.gouv.fr",
          "https://open.er-api.com",
          "https://www.google-analytics.com",
          "https://www.googletagmanager.com",
          "https://cloudflareinsights.com",   // Cloudflare Web Analytics — envoi RUM (/cdn-cgi/rum)
          "https://umami-production-737a.up.railway.app",   // Umami analytics — POST /api/send
          "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev",
          "https://chat.hallucine.fr", "https://chat.hallucinecran.fr",   // Chatwoot REST API
          "wss://chat.hallucine.fr", "wss://chat.hallucinecran.fr",     // Chatwoot ActionCable realtime
          "wss:",              // WebSocket HMR
        ],
        frameSrc: [
          "'self'",
          "https://www.youtube.com",
          "https://youtube.com",
          "https://chat.hallucine.fr", "https://chat.hallucinecran.fr",   // Chatwoot widget iframe
        ],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://d2xsxph8kpxj0f.cloudfront.net",
          "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev",
          "https://img.youtube.com",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://chat.hallucine.fr", "https://chat.hallucinecran.fr",   // Chatwoot avatars + attachments
        ],
        mediaSrc: ["'self'", "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev", "https://d2xsxph8kpxj0f.cloudfront.net"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    // Désactiver X-Powered-By
    hidePoweredBy: true,
  }));

  // ─── Link header (RFC 8288) — découverte par les agents ──────────────────────
  // Pointe les agents vers la description machine du site (llms.txt) via la
  // relation enregistrée « describedby ». Posé sur les navigations de page
  // uniquement (pas les assets, l'API, ni les fichiers à extension).
  app.use((req, res, next) => {
    if (
      (req.method === "GET" || req.method === "HEAD") &&
      !req.path.startsWith("/api") &&
      !/\.[a-zA-Z0-9]+$/.test(req.path)
    ) {
      res.setHeader("Link", '</llms.txt>; rel="describedby"; type="text/plain"');
    }
    next();
  });

  // Body parser : limite assez large pour l'upload média en base64.
  // Une image de 10 Mo (plafond de media.upload) ≈ 13,4 Mo une fois encodée
  // en base64 dans le JSON tRPC → 15 Mo couvre le cas + l'overhead JSON.
  // (À 1 Mo, toute photo > ~700 Ko était rejetée en 413 HTML → "Unexpected token '<'".)
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Redirection 301 www → non-www (SEO : évite les pages en double)
  app.use((req, res, next) => {
    const host = req.hostname;
    if (host.startsWith("www.")) {
      const nonWwwHost = host.slice(4);
      const protocol = req.headers["x-forwarded-proto"] || "https";
      return res.redirect(301, `${protocol}://${nonWwwHost}${req.originalUrl}`);
    }
    next();
  });



  app.get("/robots.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(buildRobotsTxt());
  });

  // Sitemap dynamique, UN PAR TLD (host-aware) : chaque domaine ne liste que les
  // URLs de sa langue en <loc>, avec les hreflang vers les autres TLD. Les articles
  // de blog sont lus au runtime (base blog joignable), avec un cache mémoire de 1 h.
  // Enregistré AVANT serveStatic/setupVite pour primer sur tout fichier statique.
  const SITEMAP_TTL_MS = 60 * 60 * 1000;
  const sitemapCache = new Map<string, { xml: string; at: number }>();
  app.get("/sitemap.xml", async (req, res) => {
    const lang = DOMAIN_LANG_MAP[req.hostname] ?? "fr";
    res.setHeader("Content-Type", "application/xml; charset=utf-8");

    const cached = sitemapCache.get(lang);
    if (cached && Date.now() - cached.at < SITEMAP_TTL_MS) {
      res.send(cached.xml);
      return;
    }

    let posts: SitemapPost[] = [];
    try {
      const { getAllPublishedForSitemap } = await import("../blog");
      posts = await getAllPublishedForSitemap();
      if (posts.length === 0) {
        console.warn("[sitemap] 0 article publié récupéré — sitemap limité aux routes statiques");
      }
    } catch (err) {
      // Garde-fou : ne JAMAIS servir un sitemap silencieusement vide. En cas d'échec
      // base, on log explicitement et on sert au moins les routes statiques.
      console.error("[sitemap] Échec récupération des articles blog :", err);
    }

    const xml = buildSitemapXml(lang, posts);
    sitemapCache.set(lang, { xml, at: Date.now() });
    res.send(xml);
  });

  // security.txt (RFC 9116) — contact pour le signalement de failles.
  // Expires calculé dynamiquement (~1 an) pour ne jamais devenir périmé.
  app.get("/.well-known/security.txt", (_req, res) => {
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    res.setHeader("Content-Type", "text/plain");
    res.send(
      `Contact: mailto:contact@hallucine.fr\n` +
      `Expires: ${expires}\n` +
      `Preferred-Languages: fr, en\n`
    );
  });

  // Agent Skills Discovery (agentskills.io, RFC v0.2.0) — index + artefacts.
  // Routes dynamiques : express.static est en dotfiles:'ignore' et ne sert
  // donc pas /.well-known (cf. serveStatic). URLs absolues basées sur l'hôte
  // de la requête → l'index est correct sur chaque TLD.
  app.get("/.well-known/agent-skills/index.json", (req, res) => {
    const proto = (req.headers["x-forwarded-proto"] as string) || "https";
    const origin = `${proto}://${req.hostname}`;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(JSON.stringify(buildAgentSkillsIndex(origin), null, 2));
  });
  app.get("/.well-known/agent-skills/:name/SKILL.md", (req, res) => {
    const md = getSkillMd(req.params.name);
    if (!md) {
      res.status(404).setHeader("Content-Type", "text/plain");
      res.send("Not Found");
      return;
    }
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(md);
  });

  // Authentification : Google OAuth (admin uniquement)
  registerGoogleAuthRoutes(app);

  // Route sendBeacon pour la detection d'abandon (ne passe pas par tRPC)
  app.post("/api/abandon-partial", async (req, res) => {
    try {
      const data = req.body;
      if (!data?.email || !data.email.includes("@")) {
        res.status(400).json({ error: "Email requis" });
        return;
      }

      const fullName = [data.prenom, data.nom].filter(Boolean).join(" ") || "Inconnu";
      const progress = data.totalSteps ? Math.round((data.lastStep / data.totalSteps) * 100) : 0;

      console.log(`[Abandon/Beacon] Formulaire abandonne par ${data.email} a l'etape ${data.lastStep}/${data.totalSteps}`);

      // Le CRM gère les notifications — le site ne fait que transmettre
      const { sendProspectToCrm, isCrmWebhookConfigured } = await import("../crmWebhook");

      // Envoi au CRM via webhook (abandon)
      let crmOk = false;
      if (isCrmWebhookConfigured()) {
        try {
          const result = await sendProspectToCrm({
            entreprise: data.entreprise || `Particulier - ${fullName}`,
            personne: data.nom || null,
            prenom: data.prenom || null,
            email: data.email,
            telephone: data.telephone || null,
            ville: data.city || null,
            pays: data.country || null,
            produit: data.product || null,
            notes: [
              "Source : formulaire site web hallucine.fr",
              `[ABANDON étape ${data.lastStep || "?"}/${data.totalSteps || "?"} - ${progress}%]`,
              data.productDetail ? `Détail : ${data.productDetail}` : null,
            ].filter(Boolean).join("\n"),
            abandonPartiel: true,
          });
          crmOk = result.success;
          if (result.success) {
            console.log(`[Abandon/Beacon] Prospect partiel envoyé au CRM (id: ${result.prospectId}) pour ${data.email}`);
          }
        } catch (err) {
          console.warn("[Abandon/Beacon] Erreur webhook CRM:", err);
        }
      }


      res.status(200).json({ success: true });
    } catch (err) {
      console.error("[Abandon/Beacon] Erreur:", err);
      res.status(500).json({ error: "Erreur interne" });
    }
  });
  // Endpoint de diagnostic — désactivé en production.
  if (process.env.NODE_ENV !== "production") {
    app.get("/api/debug-db", async (_req, res) => {
      try {
        const { db } = await import("../db");
        const [cur] = await (db as any).execute("SELECT DATABASE() as db");
        const [bp]  = await (db as any).execute("SELECT count(*) as n FROM blog_posts");
        const [ml]  = await (db as any).execute("SELECT count(*) as n FROM media_library");
        res.json({ current: cur[0], blog_posts: bp[0]?.n, media_library: ml[0]?.n });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    });
  }
  // GET /api/blog/meta/:slug — metas publiques d'un article pour le SSR
  app.get("/api/blog/meta/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const { db } = await import("../db");
      const { blogPosts } = await import("../../drizzle/schema");
      const { eq, and } = await import("drizzle-orm");
      const post = await db
        .select({
          title: blogPosts.title,
          excerpt: blogPosts.excerpt,
          imageUrl: blogPosts.imageUrl,
          publishedAt: blogPosts.publishedAt,
          updatedAt: blogPosts.updatedAt,
          author: blogPosts.author,
        })
        .from(blogPosts)
        .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
        .limit(1);

      if (!post[0]) return res.status(404).json({ error: "Not found" });
      res.json(post[0]);
    } catch {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Redirection 301 : /devis → /contactez-nous (filet de sécurité pour liens externes)
  app.get("/devis", (_req, res) => {
    res.redirect(301, "/contactez-nous");
  });

  // Redirection 301 des anciens slugs localisés (campagne lexique 2026-06-12 :
  // bildschirm→leinwand, inflable→hinchable, waterproof→airtight…). La map vit
  // dans i18n/routes.ts à côté de ROUTES pour suivre tout futur renommage.
  app.use((req, res, next) => {
    const target = getLegacyRedirect(req.path.replace(/\/+$/, "") || "/");
    if (target) {
      const query = req.originalUrl.split("?")[1];
      return res.redirect(301, `${target}${query ? "?" + query : ""}`);
    }
    return next();
  });

  // Redirection 301 des anciens slugs de blog pollués par des entités HTML
  // (résidu « x27 » d'avant le correctif decodeHtmlEntities — cf.
  // server/blogSlugRedirects.ts). Ici plutôt que dans serveStatic pour
  // s'appliquer aussi en dev. Ne touche QUE les slugs historiques connus ;
  // tout le reste retombe sur le SPA / l'injection de metas blog.
  app.get("/blog/:slug", (req, res, next) => {
    const slug = req.params.slug.replace(/\/+$/, "");
    const target = BLOG_SLUG_REDIRECTS[slug];
    if (target && target !== slug) {
      const query = req.originalUrl.split("?")[1];
      return res.redirect(301, `/blog/${target}${query ? "?" + query : ""}`);
    }
    return next();
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // ─── Download proxy (admin) — bypass CORS sur R2 ─────────────────────────
  // Permet de télécharger une image depuis l'admin/media avec un vrai
  // Content-Disposition: attachment + filename propre, même cross-origin.
  app.get("/api/admin/media-download/:id", async (req, res) => {
    try {
      const { sdk } = await import("./sdk");
      let user;
      try {
        user = await sdk.authenticateRequest(req as any);
      } catch {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }
      const id = parseInt(req.params.id, 10);
      if (!Number.isFinite(id)) return res.status(400).json({ error: "Bad id" });

      const { getMediaById } = await import("../mediaLibrary");
      const item = await getMediaById(id);
      if (!item) return res.status(404).json({ error: "Not found" });

      const r = await fetch(item.url);
      if (!r.ok) return res.status(502).json({ error: `R2 fetch ${r.status}` });
      const buf = Buffer.from(await r.arrayBuffer());

      res.setHeader("Content-Type", item.mimeType ?? "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(item.filename)}"`,
      );
      res.setHeader("Content-Length", String(buf.length));
      res.send(buf);
    } catch (err: any) {
      console.error("[media-download]", err);
      res.status(500).json({ error: err.message || "Server error" });
    }
  });

  // ─── Upload image blog vers R2 ───────────────────────────────
  app.post("/api/upload-blog-image", express.raw({ type: "image/*", limit: "10mb" }), async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"];
      const validKey1 = process.env.BLOG_API_KEY;
      const validKey2 = process.env.BLOG_API_KEY_2;
      if (apiKey !== validKey1 && apiKey !== validKey2) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { uploadImageToR2 } = await import("../r2Upload.js");
      let buffer: Buffer;
      let ext = "jpg";
      if (req.is("image/*")) {
        buffer = req.body as Buffer;
        const ct = req.headers["content-type"] ?? "";
        ext = ct.includes("png") ? "png" : "jpg";
      } else if ((req.body as any)?.base64) {
        buffer = Buffer.from((req.body as any).base64, "base64");
        ext = (req.body as any).ext ?? "jpg";
      } else {
        return res.status(400).json({ error: "No image data" });
      }
      const url = await uploadImageToR2(buffer, ext);
      return res.json({ url });
    } catch (err) {
      console.error("[R2 Upload] Error:", err);
      return res.status(500).json({ error: String(err) });
    }
  });
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
