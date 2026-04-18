import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET = process.env.R2_BUCKET ?? "hallucine-blog";
const PUBLIC_URL = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");

/** Upload un buffer vers R2 et retourne l'URL publique */
export async function uploadImageToR2(
  buffer: Buffer,
  extension: string = "jpg"
): Promise<string> {
  const key = `blog/${Date.now()}-${randomBytes(6).toString("hex")}.${extension}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: extension === "jpg" || extension === "jpeg" ? "image/jpeg" : "image/png",
      CacheControl: "public, max-age=31536000",
    })
  );

  return `${PUBLIC_URL}/${key}`;
}
