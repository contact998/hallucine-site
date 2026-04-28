#!/usr/bin/env node
/**
 * scripts/upload-media.mjs
 * Script CLI pour uploader des images en masse vers R2 + enregistrer en DB.
 *
 * Usage :
 *   node scripts/upload-media.mjs <dossier> --category=<cat> [--subcategory=<sub>] [--dry-run]
 *
 * Exemples :
 *   node scripts/upload-media.mjs ./photos/realisations --category=realisations
 *   node scripts/upload-media.mjs ./photos/ecran-geant --category=produits --subcategory=ecran-geant
 *   node scripts/upload-media.mjs ./photos/galerie --category=galerie --dry-run
 *
 * Configuration — créer un fichier .env.local à la racine du projet :
 *   R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
 *   R2_ACCESS_KEY_ID=xxx
 *   R2_SECRET_ACCESS_KEY=yyy
 *   R2_BUCKET=hallucine-media
 *   R2_PUBLIC_URL=https://pub-xxx.r2.dev
 *   DATABASE_URL=mysql://root:xxxx@monorail.proxy.rlwy.net:PORT/railway
 *
 * ⚠️  DATABASE_URL : utiliser l'URL PUBLIQUE Railway (pas mysql.railway.internal).
 *     Railway → MySQL → Connect → onglet "Public"
 *
 * Formats supportés : jpg, jpeg, png, webp, gif, svg
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, extname, basename } from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";
import mysql from "mysql2/promise";

// ─── Charger .env.local ───────────────────────────────────────────────────────

const envPath = ".env.local";
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] = process.env[key] ?? val;
  }
  console.log("✅ .env.local chargé");
} else {
  console.warn("⚠️  Pas de .env.local trouvé — variables d'env système utilisées");
}

// ─── Valider les arguments ────────────────────────────────────────────────────

const VALID_CATEGORIES = ["blog", "realisations", "galerie", "produits", "ui", "og", "autre"];
const VALID_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

const EXT_TO_MIME = {
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".webp": "image/webp",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
};

const args = process.argv.slice(2);
if (args.length === 0 || args[0].startsWith("--")) {
  console.error("Usage: node scripts/upload-media.mjs <dossier> --category=<cat> [--subcategory=<sub>] [--dry-run]");
  process.exit(1);
}

const folder     = args[0];
const categoryArg    = args.find(a => a.startsWith("--category="))?.split("=")[1];
const subcategoryArg = args.find(a => a.startsWith("--subcategory="))?.split("=")[1];
const dryRun         = args.includes("--dry-run");

if (!existsSync(folder)) {
  console.error(`❌ Dossier introuvable : ${folder}`);
  process.exit(1);
}

if (!categoryArg || !VALID_CATEGORIES.includes(categoryArg)) {
  console.error(`❌ Catégorie invalide ou manquante. Valeurs possibles : ${VALID_CATEGORIES.join(", ")}`);
  process.exit(1);
}

// ─── Vérifier les vars d'env ──────────────────────────────────────────────────

const required = ["R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_URL", "DATABASE_URL"];
const missing  = required.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error(`❌ Variables manquantes dans .env.local : ${missing.join(", ")}`);
  process.exit(1);
}

// ─── Initialiser R2 et MySQL ──────────────────────────────────────────────────

const r2 = new S3Client({
  region:   "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET     = process.env.R2_BUCKET;
const PUBLIC_URL = process.env.R2_PUBLIC_URL.replace(/\/$/, "");

// ─── Lister les fichiers du dossier ──────────────────────────────────────────

const files = readdirSync(folder)
  .filter(f => VALID_EXTS.includes(extname(f).toLowerCase()))
  .map(f => join(folder, f))
  .filter(f => statSync(f).isFile());

if (files.length === 0) {
  console.warn(`⚠️  Aucun fichier image trouvé dans ${folder}`);
  process.exit(0);
}

console.log(`\n📁 ${files.length} fichier(s) trouvé(s) dans ${folder}`);
console.log(`📂 Catégorie : ${categoryArg}${subcategoryArg ? ` / ${subcategoryArg}` : ""}`);
if (dryRun) console.log("🔍 Mode DRY-RUN — aucun upload ni insertion en DB\n");
else        console.log("");

// ─── Connexion DB ─────────────────────────────────────────────────────────────

let db;
if (!dryRun) {
  db = await mysql.createConnection({ uri: process.env.DATABASE_URL });
  console.log("🔌 Connecté à MySQL\n");
}

// ─── Upload ───────────────────────────────────────────────────────────────────

let success = 0, skipped = 0, errors = 0;

for (const filePath of files) {
  const name     = basename(filePath);
  const ext      = extname(name).toLowerCase();
  const mimeType = EXT_TO_MIME[ext];
  const buffer   = readFileSync(filePath);
  const filesize = buffer.length;

  // Générer la clé R2
  const r2Folder  = categoryArg === "og" ? "og" : categoryArg === "blog" ? "blog" : "media";
  const timestamp = Date.now();
  const random    = randomBytes(6).toString("hex");
  const cleanName = name.replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").substring(0, 40);
  const key      = `${r2Folder}/${timestamp}-${random}-${cleanName}${ext}`;
  const url      = `${PUBLIC_URL}/${key}`;
  const filename = key.split("/").pop();

  if (dryRun) {
    console.log(`  🔍 [DRY] ${name} → ${url}`);
    success++;
    continue;
  }

  try {
    // Vérifier si l'URL existe déjà en DB (protection doublon)
    const [existing] = await db.execute(
      "SELECT id FROM media_library WHERE url = ? LIMIT 1",
      [url]
    );
    if (existing.length > 0) {
      console.log(`  ⏭️  [SKIP] ${name} — déjà en base`);
      skipped++;
      continue;
    }

    // Upload R2
    await r2.send(new PutObjectCommand({
      Bucket:       BUCKET,
      Key:          key,
      Body:         buffer,
      ContentType:  mimeType,
      CacheControl: "public, max-age=31536000, immutable",
    }));

    // Insérer en DB
    const title = name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    await db.execute(
      `INSERT INTO media_library
         (url, filename, filesize, mimeType, title, category, subcategory, source, active, usageCount, sortOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'upload_cli', true, 0, 0)`,
      [url, filename, filesize, mimeType, title, categoryArg, subcategoryArg ?? null]
    );

    console.log(`  ✅ ${name} → ${url}`);
    success++;

  } catch (err) {
    console.error(`  ❌ ${name} — ${err.message}`);
    errors++;
  }

  // Petit délai pour ne pas saturer R2
  await new Promise(r => setTimeout(r, 100));
}

// ─── Résumé ───────────────────────────────────────────────────────────────────

if (db) await db.end();

console.log(`\n${"─".repeat(50)}`);
console.log(`📊 Résultat : ${success} uploadés, ${skipped} ignorés, ${errors} erreurs`);
if (dryRun) console.log("ℹ️  Mode dry-run — relancez sans --dry-run pour uploader");
console.log("");
