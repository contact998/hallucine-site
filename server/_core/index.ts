import "dotenv/config";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
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
          "'unsafe-eval'",     // requis par certains bundlers en prod
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://hallucine.manus.space",
          "https://*.manus.space",
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
          "https://files.manuscdn.com",
          "https://img.youtube.com",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://*.manus.space",
          "https://*.manuscdn.com",
        ],
        connectSrc: [
          "'self'",
          "https://api.zippopotam.us",
          "https://recherche-entreprises.api.gouv.fr",
          "https://open.er-api.com",
          "https://www.google-analytics.com",
          "https://www.googletagmanager.com",
          "https://hallucinecrm.manus.space",
          "https://*.manus.space",
          "https://*.manuscdn.com",
          "wss:",              // WebSocket HMR
        ],
        frameSrc: [
          "'self'",
          "https://www.youtube.com",
          "https://youtube.com",
        ],
        mediaSrc: ["'self'", "https://files.manuscdn.com", "https://d2xsxph8kpxj0f.cloudfront.net"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    // Désactiver X-Powered-By
    hidePoweredBy: true,
  }));

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

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
  // Endpoint de diagnostic temporaire (à supprimer après résolution)
  app.get("/api/debug-db", async (_req, res) => {
    const info = {
      MYSQLHOST: process.env.MYSQLHOST || "NOT SET",
      MYSQLPORT: process.env.MYSQLPORT || "NOT SET",
      MYSQLDATABASE: process.env.MYSQLDATABASE || "NOT SET",
      MYSQLUSER: process.env.MYSQLUSER || "NOT SET",
      MYSQLPASSWORD: process.env.MYSQLPASSWORD ? "***SET***" : "NOT SET",
      DATABASE_URL: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ":***@").substring(0, 60) : "NOT SET",
    };
    try {
      const { db } = await import("../db");
      const result = await (db as any).execute("SELECT 1 as ok");
      res.json({ status: "ok", env: info, result: result[0] });
    } catch (err: any) {
      res.status(500).json({ status: "error", env: info, error: err.message });
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

  // ─── Upload image blog vers R2 ───────────────────────────────
  app.post("/api/upload-blog-image", express.raw({ type: "image/*", limit: "10mb" }), async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"] ?? req.query.apiKey;
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
