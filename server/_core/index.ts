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
                            ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",   // Tailwind + styled-components injectent du CSS inline
          "https://fonts.googleapis.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "data:",
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
                    "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev",
        ],
        connectSrc: [
          "'self'",
          "https://api.zippopotam.us",
          "https://recherche-entreprises.api.gouv.fr",
          "https://open.er-api.com",
          "https://www.google-analytics.com",
          "https://www.googletagmanager.com",
                              "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev",
          "wss:",              // WebSocket HMR
        ],
        frameSrc: [
          "'self'",
          "https://www.youtube.com",
          "https://youtube.com",
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
    res.setHeader("Content-Type", "text/plain");
    res.send("User-agent: *\nAllow: /\n\nSitemap: https://hallucinecran.fr/sitemap.xml\nSitemap: https://hallucinecran.com/sitemap.xml\nSitemap: https://hallucinecran.de/sitemap.xml\nSitemap: https://hallucinecran.es/sitemap.xml\nSitemap: https://hallucinecran.it/sitemap.xml\n\nDisallow: /admin\nDisallow: /profil\nDisallow: /api/\n");
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
  // Endpoint de diagnostic temporaire — accessible en prod via token (à retirer après).
  app.get("/api/debug-db", async (req, res) => {
    if (process.env.NODE_ENV === "production" && req.query.token !== "diag-7h3k9x2") {
      return res.status(404).send("Not Found");
    }
    try {
      const { db } = await import("../db");
      const [cur] = await (db as any).execute("SELECT DATABASE() as db, @@hostname as host");
      const [bp]  = await (db as any).execute("SELECT count(*) as n FROM blog_posts");
      const [ml]  = await (db as any).execute("SELECT count(*) as n FROM media_library");
      res.json({
        databaseUrlPrefix: (process.env.DATABASE_URL || "").replace(/:([^:@]+)@/, ":***@").substring(0, 55),
        current: cur[0],
        blog_posts: bp[0]?.n,
        media_library: ml[0]?.n,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
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
