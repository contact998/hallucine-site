/**
 * scripts/set-r2-cache.mjs
 * Backfill : pose `Cache-Control: public, max-age=31536000, immutable` sur TOUS
 * les objets R2 existants qui ne l'ont pas encore.
 *
 * Pourquoi : R2 ne sert pas de Cache-Control par défaut. Les objets uploadés
 * avant que uploadToR2() ne pose l'en-tête (ex. les `assets/*` historiques)
 * sortent sans cache → re-téléchargés à chaque visite (audit Lighthouse
 * « Use efficient cache lifetimes »). Les nouveaux uploads sont déjà OK.
 *
 * Sûr : CopyObject même clé (copie côté serveur, les octets ne bougent pas),
 * MetadataDirective=REPLACE en RECOPIANT le ContentType existant (sinon il
 * serait perdu). Idempotent : saute les objets déjà au bon Cache-Control.
 *
 * Lancement : node --env-file=.env.local scripts/set-r2-cache.mjs
 *   (ajouter --dry pour seulement lister ce qui serait modifié)
 */
import {
  S3Client,
  ListObjectsV2Command,
  HeadObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";

const BUCKET = process.env.R2_BUCKET ?? "hallucine-media";
const TARGET = "public, max-age=31536000, immutable";
const DRY = process.argv.includes("--dry");

const EXT_TO_MIME = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  webp: "image/webp", gif: "image/gif", svg: "image/svg+xml",
  mp3: "audio/mpeg", mp4: "video/mp4", webm: "video/webm",
  pdf: "application/pdf",
};

if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID) {
  console.error("❌ Variables R2 absentes. Lance avec : node --env-file=.env.local scripts/set-r2-cache.mjs");
  process.exit(1);
}

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

function inferType(key) {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_MIME[ext] ?? "application/octet-stream";
}

/** Liste toutes les clés du bucket (paginé). */
async function listAllKeys() {
  const keys = [];
  let token;
  do {
    const res = await r2.send(new ListObjectsV2Command({
      Bucket: BUCKET, ContinuationToken: token, MaxKeys: 1000,
    }));
    for (const o of res.Contents ?? []) keys.push(o.Key);
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

const keys = await listAllKeys();
console.log(`🗂️  ${keys.length} objet(s) dans ${BUCKET}${DRY ? "  (DRY-RUN)" : ""}\n`);

let updated = 0, skipped = 0, errors = 0;

for (const key of keys) {
  try {
    const head = await r2.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    if (head.CacheControl === TARGET) { skipped++; continue; }

    const contentType = head.ContentType || inferType(key);
    if (DRY) {
      console.log(`  ~ ${key}  (actuel: ${head.CacheControl ?? "∅"} → ${TARGET})`);
      updated++;
      continue;
    }
    await r2.send(new CopyObjectCommand({
      Bucket: BUCKET,
      Key: key,
      CopySource: `${BUCKET}/${encodeURIComponent(key).replace(/%2F/g, "/")}`,
      ContentType: contentType,
      CacheControl: TARGET,
      MetadataDirective: "REPLACE",
    }));
    updated++;
    if (updated % 25 === 0) console.log(`  … ${updated} mis à jour`);
  } catch (err) {
    errors++;
    console.error(`  ❌ ${key} → ${err.name}: ${err.message}`);
  }
}

console.log(`\n✅ Terminé : ${updated} ${DRY ? "à mettre à jour" : "mis à jour"}, ${skipped} déjà OK, ${errors} erreur(s).`);
