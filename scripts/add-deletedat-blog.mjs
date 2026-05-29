// One-off : ajoute blog_posts.deletedAt si absente, sur la base du blog. Idempotent.
import { config } from "dotenv";
import mysql from "mysql2/promise";
config({ path: ".env.local" });
config();

const url = process.env.BLOG_DATABASE_URL || process.env.DATABASE_URL;
if (!url) { console.error("BLOG_DATABASE_URL / DATABASE_URL manquant"); process.exit(1); }
console.log("Base ciblée:", process.env.BLOG_DATABASE_URL ? "BLOG_DATABASE_URL" : "DATABASE_URL");

const conn = await mysql.createConnection(url);
const [cols] = await conn.query(
  `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'deletedAt'`
);
if (cols.length > 0) {
  console.log("✅ blog_posts.deletedAt existe déjà — rien à faire.");
} else {
  await conn.query("ALTER TABLE blog_posts ADD COLUMN deletedAt TIMESTAMP NULL DEFAULT NULL AFTER category");
  console.log("✅ Colonne blog_posts.deletedAt ajoutée.");
}
await conn.end();
