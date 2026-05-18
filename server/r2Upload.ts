/**
 * server/r2Upload.ts
 * Upload de fichiers vers Cloudflare R2.
 * Remplace la version originale limitée à blog/ et jpeg/png.
 *
 * Variables d'environnement requises :
 *   R2_ENDPOINT          ex: https://<account_id>.r2.cloudflarestorage.com
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_BUCKET            ex: hallucine-media
 *   R2_PUBLIC_URL        ex: https://pub-xxx.r2.dev
 */
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID     ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET     = process.env.R2_BUCKET     ?? "hallucine-media";
const PUBLIC_URL = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");

// ─── Types ────────────────────────────────────────────────────────────────────

// NOTE : SVG volontairement exclu. Un SVG peut contenir <script>, ce qui ouvre
// une XSS persistante si servi sur la même origine que le site. Les uploads
// sont restreints aux formats raster validés par signature binaire.
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg":  "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/gif":  "gif",
};

const EXT_TO_MIME: Record<string, string> = {
  jpg:  "image/jpeg",
  jpeg: "image/jpeg",
  png:  "image/png",
  webp: "image/webp",
  gif:  "image/gif",
};

// ─── Validation magic bytes ──────────────────────────────────────────────────

/**
 * Détecte le format réel d'un buffer image via sa signature binaire.
 * Retourne le MIME type détecté, ou null si non reconnu.
 */
export function detectImageMime(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG : FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  // PNG : 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e &&
    buffer[3] === 0x47 && buffer[4] === 0x0d && buffer[5] === 0x0a &&
    buffer[6] === 0x1a && buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  // GIF : 47 49 46 38 (37 ou 39) 61
  if (
    buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 &&
    buffer[3] === 0x38 && (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return "image/gif";
  }
  // WebP : 52 49 46 46 ?? ?? ?? ?? 57 45 42 50  (RIFF....WEBP)
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

/**
 * Vérifie qu'un buffer correspond bien au MIME annoncé.
 * Lève si SVG (banni), si signature inconnue, ou si mismatch annoncé/réel.
 */
export function assertImageBufferMatchesMime(buffer: Buffer, claimedMime: string): void {
  if (claimedMime === "image/svg+xml") {
    throw new Error("SVG non autorisé à l'upload (risque XSS).");
  }
  const detected = detectImageMime(buffer);
  if (!detected) {
    throw new Error("Format d'image non reconnu (signature binaire invalide).");
  }
  const claimed = claimedMime === "image/jpg" ? "image/jpeg" : claimedMime;
  if (detected !== claimed) {
    throw new Error(`MIME annoncé (${claimedMime}) ne correspond pas au contenu réel (${detected}).`);
  }
}

export type R2Folder = "blog" | "media" | "og" | "assets";

export interface UploadResult {
  url:      string;   // URL publique complète
  key:      string;   // Clé R2 (chemin dans le bucket)
  filename: string;   // Nom de fichier généré
  mimeType: string;
  filesize: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveExtension(mimeType: string, fallback = "jpg"): string {
  return MIME_TO_EXT[mimeType] ?? fallback;
}

function resolveMimeType(ext: string): string {
  return EXT_TO_MIME[ext.toLowerCase()] ?? "application/octet-stream";
}

/** Génère un nom de fichier unique avec timestamp + random */
function generateKey(folder: R2Folder, originalName: string, mimeType: string): string {
  const ext       = resolveExtension(mimeType, originalName.split(".").pop() ?? "jpg");
  const timestamp = Date.now();
  const random    = randomBytes(6).toString("hex");
  // Nettoyer le nom original pour le garder lisible dans R2
  const clean     = originalName
    .replace(/\.[^.]+$/, "")                  // retirer l'extension
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // retirer accents
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 40);
  return `${folder}/${timestamp}-${random}-${clean}.${ext}`;
}

// ─── Upload principal ─────────────────────────────────────────────────────────

/**
 * Upload un buffer vers R2.
 * @param buffer     Données binaires du fichier
 * @param mimeType   MIME type (image/webp, image/jpeg, image/png...)
 * @param originalName  Nom original du fichier (pour générer une clé lisible)
 * @param folder     Dossier de destination dans le bucket
 */
export async function uploadToR2(
  buffer: Buffer,
  mimeType: string,
  originalName: string,
  folder: R2Folder = "media"
): Promise<UploadResult> {
  assertImageBufferMatchesMime(buffer, mimeType);
  const key = generateKey(folder, originalName, mimeType);

  await r2Client.send(
    new PutObjectCommand({
      Bucket:       BUCKET,
      Key:          key,
      Body:         buffer,
      ContentType:  mimeType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const filename = key.split("/").pop()!;
  return {
    url:      `${PUBLIC_URL}/${key}`,
    key,
    filename,
    mimeType,
    filesize: buffer.length,
  };
}

/**
 * Supprime un fichier de R2 par sa clé.
 * La clé s'obtient depuis l'URL : url.replace(PUBLIC_URL + "/", "")
 */
export async function deleteFromR2(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({ Bucket: BUCKET, Key: key })
  );
}

/** Extrait la clé R2 depuis une URL publique complète */
export function urlToR2Key(url: string): string {
  return url.replace(PUBLIC_URL + "/", "");
}

// ─── Rétrocompatibilité (ancienne signature utilisée par adminBlog.ts) ────────

/**
 * @deprecated Utiliser uploadToR2() à la place.
 * Conservé pour ne pas casser server/routers/adminBlog.ts existant.
 */
export async function uploadImageToR2(
  buffer: Buffer,
  extension = "jpg"
): Promise<string> {
  const mimeType = resolveMimeType(extension);
  const result   = await uploadToR2(buffer, mimeType, `image.${extension}`, "blog");
  return result.url;
}
