import { createPool } from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";
import { config } from "dotenv";

config();

const pool = createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 2,
});

const db = drizzle(pool.promise());

// Query directe sans importer le schema TypeScript
const rows = await db.execute("SELECT id, type, nom, email, telephone, status, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 50");

const data = rows[0];
if (!data || data.length === 0) {
  console.log("Aucune soumission trouvée.");
} else {
  console.log(`\n=== ${data.length} soumission(s) trouvée(s) ===\n`);
  for (const r of data) {
    console.log(`[${r.created_at}] ${r.nom} | ${r.email} | ${r.telephone || '-'} | type: ${r.type} | statut: ${r.status}`);
  }
}

pool.end();
