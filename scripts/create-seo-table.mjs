// One-off : crée la table seo_overrides si absente. Idempotent.
import { config } from "dotenv";
import mysql from "mysql2/promise";
config({ path: ".env.local" });
config();

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL manquant"); process.exit(1); }

const conn = await mysql.createConnection(url);
await conn.query(`
  CREATE TABLE IF NOT EXISTS seo_overrides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    path VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NULL,
    description VARCHAR(500) NULL,
    ogImage VARCHAR(1000) NULL,
    noindex BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deletedAt TIMESTAMP NULL DEFAULT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);
console.log("✅ Table seo_overrides prête.");
await conn.end();
