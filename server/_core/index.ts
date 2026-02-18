import "dotenv/config";
import express from "express";
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
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
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

      // Import dynamique pour eviter les imports circulaires
      const { notifyOwner } = await import("./notification");
      const { insertProspectIntoCrm, isCrmDirectConfigured } = await import("../crmDirect");

      // Notification asynchrone
      notifyOwner({
        title: `Abandon formulaire - ${data.email}`,
        content: [
          `**Abandon detecte** a l'etape ${data.lastStep || "?"}/${data.totalSteps || "?"} (${progress}% complete)`,
          `**Email:** ${data.email}`,
          data.prenom || data.nom ? `**Nom:** ${fullName}` : null,
          data.entreprise ? `**Entreprise:** ${data.entreprise}` : null,
          data.telephone ? `**Telephone:** ${data.telephone}` : null,
          data.product ? `**Produit:** ${data.product}` : null,
          "",
          "Ce prospect a commence le formulaire mais ne l'a pas termine.",
          "Action recommandee : envoyer un email de relance personnalise.",
        ].filter(Boolean).join("\n"),
      }).catch((err: unknown) => console.warn("[Abandon/Beacon] Erreur notification:", err));

      // Insertion directe CRM (méthode principale)
      let crmOk = false;
      if (isCrmDirectConfigured()) {
        try {
          const result = await insertProspectIntoCrm({
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
            isAbandon: true,
          });
          crmOk = result.success;
          if (result.success) {
            console.log(`[Abandon/Beacon] Prospect partiel créé dans CRM (id: ${result.prospectId}) pour ${data.email}`);
          }
        } catch (err) {
          console.warn("[Abandon/Beacon] Erreur insertion directe CRM:", err);
        }
      }


      res.status(200).json({ success: true });
    } catch (err) {
      console.error("[Abandon/Beacon] Erreur:", err);
      res.status(500).json({ error: "Erreur interne" });
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
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
