// scripts/create-placements-table.mjs
// Crée la table media_placements (refonte médiathèque). Additif + idempotent :
// CREATE TABLE IF NOT EXISTS — ne touche à aucune donnée existante.
// Lancer : railway run npx tsx scripts/create-placements-table.mjs
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import mysql from "mysql2/promise";

const url = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL / DATABASE_PUBLIC_URL manquant");
  process.exit(1);
}

const c = await mysql.createConnection(url);
await c.query(`
  CREATE TABLE IF NOT EXISTS media_placements (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    slot_key   VARCHAR(80)  NOT NULL,
    entity_id  INT          NULL,
    asset_id   INT          NOT NULL,
    sort_order INT          NOT NULL DEFAULT 0,
    createdAt  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slot  (slot_key, entity_id, sort_order),
    INDEX idx_asset (asset_id)
  )
`);
console.log("✓ media_placements prête");
await c.end();
