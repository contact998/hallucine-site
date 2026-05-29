// One-off : ajoute media_library.deletedAt si absente. Idempotent.
import { config } from "dotenv";
import mysql from "mysql2/promise";
config({ path: ".env.local" });
config();

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL manquant"); process.exit(1); }

const conn = await mysql.createConnection(url);
const [cols] = await conn.query(
  `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'media_library' AND COLUMN_NAME = 'deletedAt'`
);
if (cols.length > 0) {
  console.log("✅ deletedAt existe déjà — rien à faire.");
} else {
  await conn.query("ALTER TABLE media_library ADD COLUMN deletedAt TIMESTAMP NULL DEFAULT NULL AFTER usageCount");
  console.log("✅ Colonne deletedAt ajoutée.");
}
await conn.end();
