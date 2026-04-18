import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { uploadImageToR2 } from "./r2Upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "10mb" }));
  app.use(express.raw({ type: "image/*", limit: "10mb" }));

  // ─── Upload image blog vers R2 ───────────────────────────────
  app.post("/api/upload-blog-image", async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"] ?? req.query.apiKey;
      if (apiKey !== process.env.BLOG_API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      let buffer: Buffer;
      let ext = "jpg";

      if (req.is("image/*")) {
        // Envoi direct binaire
        buffer = req.body as Buffer;
        const ct = req.headers["content-type"] ?? "";
        ext = ct.includes("png") ? "png" : "jpg";
      } else if (req.body?.base64) {
        // Envoi base64
        buffer = Buffer.from(req.body.base64, "base64");
        ext = req.body.ext ?? "jpg";
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

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
