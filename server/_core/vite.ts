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

  // Servir les fichiers statiques (JS, CSS, images, etc.)
  app.use(express.static(distPath));

  // Pour les routes SPA : chercher d'abord un fichier HTML pré-rendu,
  // sinon fallback vers le SPA original
  app.use("*", (req, res) => {
    const url = req.originalUrl.split("?")[0].replace(/\/$/, "") || "/";

    // 1. Essayer route/index.html (pré-rendu dans un dossier)
    if (url !== "/") {
      const dirIndexPath = path.resolve(distPath, url.slice(1), "index.html");
      if (fs.existsSync(dirIndexPath)) {
        res.sendFile(dirIndexPath);
        return;
      }

      // 2. Essayer route.html (pré-rendu en fichier plat)
      const flatHtmlPath = path.resolve(distPath, `${url.slice(1)}.html`);
      if (fs.existsSync(flatHtmlPath)) {
        res.sendFile(flatHtmlPath);
        return;
      }
    }

    // 3. Fallback : SPA fallback (pour les routes non pré-rendues comme /admin, /profil)
    const spaFallback = path.resolve(distPath, "_spa_fallback.html");
    if (fs.existsSync(spaFallback)) {
      res.sendFile(spaFallback);
    } else {
      // Si pas de fallback SPA, servir index.html (qui est pré-rendu pour /)
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
