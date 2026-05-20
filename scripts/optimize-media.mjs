/**
 * optimize-media.mjs — Optimisation one-shot de la médiathèque
 *
 * Pour chaque image active des catégories produits / galerie / realisations :
 *   1. Télécharge le fichier depuis son URL actuelle
 *   2. Convertit en WebP si nécessaire (PNG / JPEG → WebP)
 *   3. Redimensionne (bord le plus long ≤ MAX_EDGE) et recompresse (qualité 80)
 *   4. Migre les images de l'ancien CDN CloudFront vers R2
 *   5. Ré-upload sur R2 (nouvelle clé — cache R2 « immutable ») et met à jour
 *      la DB : url, filename, mimeType, filesize, width, height
 *   6. Les images déjà au bon format/poids : seules les dimensions sont
 *      complétées en base (aucun ré-encodage, aucune perte)
 *
 * Usage (le CLI Railway fournit DATABASE_URL + variables R2) :
 *   railway run npx tsx scripts/optimize-media.mjs --dry-run
 *   railway run npx tsx scripts/optimize-media.mjs
 */
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import { inArray, eq } from "drizzle-orm";
import { db, pool } from "../server/db.ts";
import { mediaLibrary } from "../drizzle/schema.ts";
import { uploadToR2, urlToR2Key } from "../server/r2Upload.ts";

// ─── Configuration ─────────────────────────────────────────────────────────

const DRY_RUN     = process.argv.includes("--dry-run");
const CATEGORIES  = ["produits", "galerie", "realisations"];
const QUALITY     = 80;
const HEAVY_BYTES = 90 * 1024;                       // au-delà → recompression
const MAX_EDGE    = { galerie: 1920, default: 1600 };// bord le plus long max

const maxEdgeFor = (cat) => MAX_EDGE[cat] ?? MAX_EDGE.default;
const ko = (n) => `${Math.round(n / 1024)}Ko`;
const mo = (n) => `${(n / 1024 / 1024).toFixed(2)}Mo`;

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// ─── Pipeline ──────────────────────────────────────────────────────────────

async function main() {
  console.log(DRY_RUN
    ? "🔍 DRY-RUN — analyse seule, aucune écriture DB ni R2\n"
    : "⚙️  Optimisation média — écriture DB + R2\n");

  const items = (await db
    .select()
    .from(mediaLibrary)
    .where(inArray(mediaLibrary.category, CATEGORIES))
  ).filter((r) => r.active);

  console.log(`${items.length} image(s) active(s) à examiner\n`);

  const stats = { convert: 0, migrate: 0, recompress: 0, dims: 0, skip: 0, fail: 0 };
  let bytesBefore = 0, bytesAfter = 0;
  const orphans = [];

  for (const item of items) {
    const label = `[${String(item.id).padStart(3)}] ${item.category}/${item.subcategory ?? "-"}`;
    try {
      const buf  = await fetchBuffer(item.url);
      const meta = await sharp(buf).metadata();
      const w = meta.width ?? 0, h = meta.height ?? 0;

      const isCloudfront = /cloudfront\.net/i.test(item.url);
      const maxEdge      = maxEdgeFor(item.category);
      const notWebp      = meta.format !== "webp";
      const oversized    = Math.max(w, h) > maxEdge;
      const heavy        = buf.length > HEAVY_BYTES;

      bytesBefore += buf.length;

      // ── Image déjà conforme : compléter seulement les dimensions en base ──
      if (!notWebp && !isCloudfront && !oversized && !heavy) {
        bytesAfter += buf.length;
        if (item.width !== w || item.height !== h || item.filesize !== buf.length) {
          if (!DRY_RUN) {
            await db.update(mediaLibrary)
              .set({ width: w, height: h, filesize: buf.length })
              .where(eq(mediaLibrary.id, item.id));
          }
          stats.dims++;
          console.log(`  📐 ${label}  dims ${w}x${h} ${ko(buf.length)}`);
        } else {
          stats.skip++;
        }
        continue;
      }

      // ── Ré-encodage WebP ─────────────────────────────────────────────────
      const out = await sharp(buf)
        .rotate()                                                  // EXIF orientation
        .resize(maxEdge, maxEdge, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toBuffer();
      const outMeta = await sharp(out).metadata();

      // WebP déjà sur R2 et bien dimensionnée : on ne ré-uploade QUE si le
      // ré-encodage fait gagner significativement (>40 Ko ET >30 %). Recompresser
      // pour 2-3 Ko ne ferait qu'ajouter rotation d'URL et objet orphelin.
      const gainSignificatif =
        (buf.length - out.length) > 40 * 1024 && out.length < buf.length * 0.7;
      const mustUpload = notWebp || isCloudfront || oversized || gainSignificatif;
      if (!mustUpload) {
        bytesAfter += buf.length;
        if (item.width !== w || item.height !== h || item.filesize !== buf.length) {
          if (!DRY_RUN) {
            await db.update(mediaLibrary)
              .set({ width: w, height: h, filesize: buf.length })
              .where(eq(mediaLibrary.id, item.id));
          }
          stats.dims++;
          console.log(`  📐 ${label}  dims ${w}x${h} ${ko(buf.length)} (recompression sans gain)`);
        } else {
          stats.skip++;
        }
        continue;
      }

      bytesAfter += out.length;
      const reason = isCloudfront ? "migrate" : notWebp ? "convert" : "recompress";

      if (DRY_RUN) {
        console.log(`  ${reason.padEnd(10)} ${label}  ${meta.format} ${w}x${h} ${ko(buf.length)} → webp ${outMeta.width}x${outMeta.height} ${ko(out.length)}`);
      } else {
        const up = await uploadToR2(out, "image/webp", item.filename || "image.webp", "media");
        if (!isCloudfront) orphans.push(urlToR2Key(item.url));   // ancien objet R2
        await db.update(mediaLibrary)
          .set({
            url:      up.url,
            filename: up.filename,
            mimeType: "image/webp",
            filesize: out.length,
            width:    outMeta.width,
            height:   outMeta.height,
          })
          .where(eq(mediaLibrary.id, item.id));
        console.log(`  ✅ ${reason.padEnd(10)} ${label}  ${ko(buf.length)} → ${ko(out.length)}`);
      }
      stats[reason === "migrate" ? "migrate" : reason === "convert" ? "convert" : "recompress"]++;
    } catch (err) {
      stats.fail++;
      console.log(`  ❌ ${label}  …${item.url.slice(-44)} — ${err.message}`);
    }
  }

  // ─── Résumé ───────────────────────────────────────────────────────────────
  console.log("\n─────────── Résumé ───────────");
  console.log(`  Converties WebP   : ${stats.convert}`);
  console.log(`  Migrées CF → R2   : ${stats.migrate}`);
  console.log(`  Recompressées     : ${stats.recompress}`);
  console.log(`  Dimensions DB     : ${stats.dims}`);
  console.log(`  Inchangées        : ${stats.skip}`);
  console.log(`  Échecs            : ${stats.fail}`);
  console.log(`  Poids total       : ${mo(bytesBefore)} → ${mo(bytesAfter)}`);

  if (orphans.length && !DRY_RUN) {
    writeFileSync("scripts/orphaned-r2-keys.txt", orphans.join("\n") + "\n");
    console.log(`\n  ${orphans.length} ancien(s) objet(s) R2 remplacé(s) → scripts/orphaned-r2-keys.txt`);
    console.log("  (à supprimer manuellement plus tard si besoin — non référencés)");
  }

  await pool.end();
}

main().catch(async (err) => {
  console.error("ERREUR FATALE:", err);
  await pool.end();
  process.exit(1);
});
