/**
 * r2-test.mjs — Test rapide des accès R2 (lecture + écriture).
 * Usage : node --env-file=.env.local scripts/r2-test.mjs
 */
import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

console.log("Endpoint :", process.env.R2_ENDPOINT);
console.log("Clé      :", (process.env.R2_ACCESS_KEY_ID || "").slice(0, 6) + "…\n");

for (const bucket of ["hallucine-blog", "hallucine-media"]) {
  process.stdout.write(`Bucket "${bucket}" : `);
  try {
    const r = await client.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1 }));
    console.log(`LECTURE OK (${r.KeyCount ?? 0} objet listé)`);
    const key = `__test-write-${Date.now()}.txt`;
    try {
      await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: "test", ContentType: "text/plain" }));
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
      console.log(`           ÉCRITURE OK ✅`);
    } catch (e) {
      console.log(`           ÉCRITURE REFUSÉE ❌ (${e.name})`);
    }
  } catch (e) {
    console.log(`ÉCHEC ❌ ${e.name} — ${(e.message || "").slice(0, 90)}`);
  }
}
process.exit(0);
