import type { Express } from "express";

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    const r2Url = `https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/${key}`;
    res.set("Cache-Control", "public, max-age=31536000");
    res.redirect(301, r2Url);
  });
}
