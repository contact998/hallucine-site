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

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg":  "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/gif":  "gif",
  "image/svg+xml": "svg",
};

const EXT_TO_MIME: Record<string, string> = {
  jpg:  "image/jpeg",
  jpeg: "image/jpeg",
  png:  "image/png",
  webp: "image/webp",
  gif:  "image/gif",
  svg:  "image/svg+xml",
};

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
