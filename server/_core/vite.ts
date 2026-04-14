import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

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

  // Servir les fichiers statiques (JS, CSS, images, etc.)
  app.use(express.static(distPath, { index: false }));

  // SSG + Fallback SPA : priorité aux pages pré-rendues, sinon index.html générique
  app.use("*", (req, res) => {
    const locale = getLocaleFromHost(req.hostname);

    // 1. Chercher la page pré-rendue : /chemin/index.html
    const urlPath = req.path === "/" ? "" : req.path;
    const prerenderedPath = path.join(distPath, urlPath, "index.html");

    if (fs.existsSync(prerenderedPath)) {
      // Servir la page pré-rendue (contenu SEO déjà injecté)
      res.status(200).set({
        "Content-Type": "text/html",
        "Vary": "Host",
        "Cache-Control": "public, max-age=3600",
      }).end(fs.readFileSync(prerenderedPath, "utf-8"));
      return;
    }

    // 2. Fallback SPA : injecter la locale dans le template générique
    const html = baseIndexHtml.replace(/__LOCALE__/g, locale);
    res.status(200).set({
      "Content-Type": "text/html",
      "Vary": "Host",
    }).end(html);
  });
}
