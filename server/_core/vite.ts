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
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// Mapping des routes vers les fichiers de contenu pré-rendu
const PRERENDERED_ROUTES: Record<string, string> = {
  "/": "home",
  "/ecran-gonflable": "ecran-gonflable",
  "/ecran-gonflable-geant-soufflerie": "ecran-gonflable-geant-soufflerie",
  "/ecran-gonflable-etanche-air": "ecran-gonflable-etanche-air",
  "/ecran-gonflable-economique": "ecran-gonflable-economique",
  "/comparaison-ecran-gonflable": "comparaison-ecran-gonflable",
  "/ecrans-led": "ecrans-led",
  "/tente-gonflable": "tente-gonflable",
  "/tente-gonflable-x": "tente-gonflable-x",
  "/tente-gonflable-n": "tente-gonflable-n",
  "/tente-gonflable-v": "tente-gonflable-v",
  "/tente-gonflable-araignee": "tente-gonflable-araignee",
  "/arche-gonflable": "arche-gonflable",
  "/mobilier-gonflable": "mobilier-gonflable",
  "/accessoire-cinema-plein-air": "accessoire-cinema-plein-air",
  "/galerie-evenements": "galerie-evenements",
  "/galerie-video": "galerie-video",
  "/contactez-nous": "contactez-nous",
  "/a-propos-hallucine": "a-propos-hallucine",
  "/histoire-hallucine": "histoire-hallucine",
  "/blog": "blog",
  "/mode-emploi": "mode-emploi",
  "/devenir-distributeur": "devenir-distributeur",
  "/trouver-distributeur": "trouver-distributeur",
  "/mentions-legales": "mentions-legales",
  "/politique-confidentialite": "politique-confidentialite",
  "/politique-cookies": "politique-cookies",
};

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

  // Charger le template index.html (SPA) et les contenus pré-rendus au démarrage
  const indexHtmlPath = path.resolve(distPath, "index.html");
  const baseIndexHtml = fs.readFileSync(indexHtmlPath, "utf-8");

  // Pré-générer les pages HTML complètes en mémoire (injection du contenu dans le template)
  const prerenderedPages: Record<string, string> = {};
  const prerenderedDir = path.resolve(distPath, "prerendered");

  if (fs.existsSync(prerenderedDir)) {
    for (const [route, fileName] of Object.entries(PRERENDERED_ROUTES)) {
      const contentFile = path.resolve(prerenderedDir, `${fileName}.content.html`);
      if (fs.existsSync(contentFile)) {
        const content = fs.readFileSync(contentFile, "utf-8");
        // Injecter le contenu pré-rendu dans le div#root du template index.html
        const fullHtml = baseIndexHtml.replace(
          '<div id="root"></div>',
          `<div id="root">${content}</div>`
        );
        prerenderedPages[route] = fullHtml;
      }
    }
    console.log(`[SSG] ${Object.keys(prerenderedPages).length} pages pré-rendues chargées en mémoire`);
  } else {
    console.warn("[SSG] Dossier prerendered/ non trouvé — mode SPA classique");
  }

  // Servir les fichiers statiques (JS, CSS, images, etc.)
  app.use(express.static(distPath));

  // Pour les routes SPA : servir le HTML pré-rendu si disponible,
  // sinon fallback vers le SPA original
  app.use("*", (req, res) => {
    const url = req.originalUrl.split("?")[0].replace(/\/$/, "") || "/";

    // Servir la page pré-rendue si elle existe
    if (prerenderedPages[url]) {
      res.status(200).set({ "Content-Type": "text/html" }).end(prerenderedPages[url]);
      return;
    }

    // Fallback : SPA classique (pour /admin, /profil, etc.)
    res.status(200).set({ "Content-Type": "text/html" }).end(baseIndexHtml);
  });
}
