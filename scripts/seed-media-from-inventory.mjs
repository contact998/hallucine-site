#!/usr/bin/env node
/**
 * scripts/seed-media-from-inventory.mjs
 * Insère / met à jour la médiathèque (media_library) depuis l'inventaire
 * docs/superpowers/media-inventory.json.
 *
 * Usage :
 *   node scripts/seed-media-from-inventory.mjs [--dry-run]
 *
 * Comportement :
 *  - Pour chaque entrée de l'inventaire :
 *      1. Si local=true → upload sur R2 (clé media/<ts>-<hash>-<slug>.<ext>)
 *         En --dry-run l'upload est simulé.
 *      2. Upsert par (url, page, section) :
 *         · la UNIQUE contrainte porte sur url seule → une URL ne peut avoir
 *           qu'une ligne. Si l'URL est déjà en base on met à jour (page,
 *           section, active) ; alt n'est écrasé que si vide/NULL.
 *         · Si plusieurs entrées de l'inventaire partagent la même URL, seule
 *           la première occurrence est traitée ; les suivantes sont journalisées.
 *  - N'efface JAMAIS les lignes hors inventaire.
 */

import { readFileSync, existsSync } from "fs";
import { extname, basename } from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createHash, randomBytes } from "crypto";
import mysql from "mysql2/promise";

// ─── Charger .env.local ───────────────────────────────────────────────────────

const envPath = ".env.local";
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const idx = t.indexOf("=");
    if (idx === -1) continue;
    const key = t.slice(0, idx).trim();
    const val = t.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] = process.env[key] ?? val;
  }
  console.log("✅ .env.local chargé");
} else {
  console.warn("⚠️  Pas de .env.local — variables d'env système utilisées");
}

// ─── Args ─────────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes("--dry-run");

// ─── Vérifier les vars d'env ──────────────────────────────────────────────────

const REQUIRED = [
  "R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET", "R2_PUBLIC_URL", "DATABASE_URL",
];
const missing = REQUIRED.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error(`❌ Variables manquantes dans .env.local : ${missing.join(", ")}`);
  process.exit(1);
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const BUCKET     = process.env.R2_BUCKET;
const PUBLIC_URL = process.env.R2_PUBLIC_URL.replace(/\/$/, "");
const INVENTORY_PATH = "docs/superpowers/media-inventory.json";

const EXT_TO_MIME = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".png": "image/png",  ".webp": "image/webp",
  ".gif": "image/gif",  ".svg":  "image/svg+xml",
};

// ─── Initialiser le client R2 ─────────────────────────────────────────────────

const r2 = new S3Client({
  region:   "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Nettoyage slug SEO identique à upload-media.mjs */
function slugify(name) {
  return name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

/** Dérive un filename depuis l'URL R2 publique */
function filenameFromUrl(url) {
  return url.split("/").pop() ?? "image";
}

/** Dérive un titre court depuis l'alt (premiers 60 cars) */
function titleFromAlt(alt) {
  return (alt ?? "").substring(0, 60).trim() || filenameFromUrl("x");
}

/**
 * Upload un fichier local sur R2.
 * Retourne l'URL publique.
 */
async function uploadLocal(publicPath) {
  if (!existsSync(publicPath)) {
    throw new Error(`Fichier introuvable sur disque : ${publicPath}`);
  }
  const { readFileSync } = await import("fs");
  const buffer = readFileSync(publicPath);
  const ext    = extname(publicPath).toLowerCase();
  const mime   = EXT_TO_MIME[ext] ?? "application/octet-stream";

  const hash      = createHash("sha1").update(buffer).digest("hex").substring(0, 12);
  const timestamp = Date.now();
  const slug      = slugify(basename(publicPath));
  const key       = `media/${timestamp}-${hash}-${slug}${ext}`;
  const url       = `${PUBLIC_URL}/${key}`;

  await r2.send(new PutObjectCommand({
    Bucket:       BUCKET,
    Key:          key,
    Body:         buffer,
    ContentType:  mime,
    CacheControl: "public, max-age=31536000, immutable",
  }));

  return { url, filename: key.split("/").pop(), mime, filesize: buffer.length };
}

// ─── Charger l'inventaire ─────────────────────────────────────────────────────

if (!existsSync(INVENTORY_PATH)) {
  console.error(`❌ Inventaire introuvable : ${INVENTORY_PATH}`);
  process.exit(1);
}

/** @type {Array<{url:string,alt:string,page:string,section:string,local?:boolean,publicPath?:string}>} */
const inventory = JSON.parse(readFileSync(INVENTORY_PATH, "utf-8"));
console.log(`\n📋 Inventaire : ${inventory.length} entrées`);
if (DRY_RUN) console.log("🔍 Mode DRY-RUN — aucun upload R2 ni écriture DB\n");
else         console.log("");

// ─── Dédupliquer les URLs (une ligne par URL max en DB) ───────────────────────

/** Map url → première occurrence dans l'inventaire */
const byUrl = new Map();
let skippedDups = 0;
for (const item of inventory) {
  if (byUrl.has(item.url)) {
    skippedDups++;
    if (DRY_RUN) {
      const first = byUrl.get(item.url);
      console.log(`  ⚠️  [DUP] ${item.url.split("/").pop()} — déjà pris par ${first.page}/${first.section}, ignore ${item.page}/${item.section}`);
    }
    continue;
  }
  byUrl.set(item.url, item);
}
const deduped = [...byUrl.values()];
console.log(`  → ${deduped.length} URLs uniques (${skippedDups} doublons inventaire ignorés)\n`);

// ─── Connexion DB ─────────────────────────────────────────────────────────────

let db;
if (!DRY_RUN) {
  db = await mysql.createConnection({ uri: process.env.DATABASE_URL });
  console.log("🔌 Connecté à MySQL\n");
}

// ─── Traitement ───────────────────────────────────────────────────────────────

let countInsert = 0, countUpdate = 0, countUpload = 0, countError = 0;

/** sortOrder counter par (page, section) */
const sortCounters = new Map();

for (const item of deduped) {
  const key = `${item.page}|${item.section}`;
  const sortIdx = (sortCounters.get(key) ?? 0);
  sortCounters.set(key, sortIdx + 1);

  try {
    let finalUrl      = item.url;
    let finalFilename = filenameFromUrl(item.url);
    let finalMime     = EXT_TO_MIME[extname(item.url.split("?")[0]).toLowerCase()] ?? "image/webp";
    let finalFilesize = null;

    // ── 1. Upload si local ───────────────────────────────────────────────────
    if (item.local) {
      if (DRY_RUN) {
        const ext      = extname(item.publicPath ?? "").toLowerCase();
        const hash     = "000000000000";
        const ts       = "<timestamp>";
        const slug     = slugify(basename(item.publicPath ?? item.url));
        finalUrl       = `${PUBLIC_URL}/media/${ts}-${hash}-${slug}${ext}`;
        finalFilename  = finalUrl.split("/").pop();
        finalMime      = EXT_TO_MIME[ext] ?? "image/webp";
        countUpload++;
        console.log(`  🔍 [DRY UPLOAD] ${basename(item.publicPath ?? item.url)} → ${finalUrl}`);
      } else {
        console.log(`  ⬆️  Upload local : ${item.publicPath}`);
        const result   = await uploadLocal(item.publicPath);
        finalUrl       = result.url;
        finalFilename  = result.filename;
        finalMime      = result.mime;
        finalFilesize  = result.filesize;
        countUpload++;
        console.log(`       → ${finalUrl}`);
      }
    }

    // ── 2. Upsert en base ────────────────────────────────────────────────────
    if (DRY_RUN) {
      // Simuler l'opération
      console.log(`  🔍 [DRY ${item.local ? "INSERT" : "UPSERT"}] ${finalUrl.split("/").pop()} → page=${item.page} section=${item.section} alt="${item.alt?.substring(0,50)}"`);
      if (item.local) countInsert++; else countUpdate++; // approximatif en dry-run
    } else {
      // Vérifier si une ligne avec cette URL existe déjà
      const [rows] = await db.execute(
        "SELECT id, alt FROM media_library WHERE url = ? LIMIT 1",
        [finalUrl]
      );

      if (rows.length > 0) {
        // UPDATE : poser page, section, active ; alt seulement si vide/NULL
        const existing = rows[0];
        const altUpdate = (!existing.alt || existing.alt.trim() === "")
          ? ", `alt` = ?"
          : "";
        const params = altUpdate
          ? [item.page, item.section, item.alt, existing.id]
          : [item.page, item.section, existing.id];

        await db.execute(
          `UPDATE media_library
             SET \`page\` = ?, \`section\` = ?, \`active\` = true${altUpdate}
           WHERE id = ?`,
          params
        );
        countUpdate++;
      } else {
        // INSERT nouvelle ligne
        const titleVal    = titleFromAlt(item.alt);
        const filenameVal = finalFilename;
        await db.execute(
          `INSERT INTO media_library
             (url, filename, filesize, mimeType, alt, title,
              page, section, category, active, source, sortOrder, usageCount)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'autre', true, 'migration', ?, 0)`,
          [
            finalUrl,
            filenameVal,
            finalFilesize,
            finalMime,
            item.alt ?? null,
            titleVal,
            item.page,
            item.section,
            sortIdx,
          ]
        );
        countInsert++;
      }
    }

  } catch (err) {
    console.error(`  ❌ ERREUR sur ${item.url.split("/").pop()} : ${err.message}`);
    countError++;
    if (!DRY_RUN) {
      // Arrêt immédiat sur erreur pour diagnostiquer
      if (db) await db.end();
      console.error("\nBLOCKED — arrêt sur erreur, diagnostic requis.");
      process.exit(1);
    }
  }
}

// ─── Résumé dry-run ───────────────────────────────────────────────────────────

if (DRY_RUN) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`📊 DRY-RUN récap :`);
  console.log(`   ${deduped.length} URLs uniques traitées`);
  console.log(`   ~${countUpload} uploads R2 prévus (images locales)`);
  console.log(`   ~${countInsert} INSERT prévus (nouveaux)`);
  console.log(`   ~${countUpdate} UPDATE prévus (déjà en base estimé)`);
  console.log(`   ${skippedDups} doublons URL inventaire ignorés`);
  console.log(`\nℹ️  Relancez sans --dry-run pour appliquer.`);
  process.exit(0);
}

// ─── Récap réel par (page, section) ──────────────────────────────────────────

console.log(`\n${"─".repeat(60)}`);
console.log(`📊 Bilan :`);
console.log(`   ${countInsert} INSERT, ${countUpdate} UPDATE, ${countUpload} uploads R2`);
if (countError > 0) console.log(`   ⚠️  ${countError} erreur(s)`);

console.log("\n📄 Lignes actives par (page, section) :");
const [recap] = await db.execute(
  `SELECT page, section, COUNT(*) as nb
     FROM media_library
    WHERE active = true AND page IS NOT NULL AND section IS NOT NULL
    GROUP BY page, section
    ORDER BY page, section`
);
for (const row of recap) {
  console.log(`   ${String(row.page).padEnd(22)} / ${String(row.section).padEnd(24)} : ${row.nb}`);
}

await db.end();
console.log("\n✅ Terminé.\n");
