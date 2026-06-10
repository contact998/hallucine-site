/**
 * Test de validation de la connexion à la base de données du CRM.
 * Intégration : ne tourne que si CRM_DATABASE_URL est définie — skip propre
 * en local sans la base (un échec ici ne signalerait que l'env, pas le code).
 */
import { describe, it, expect } from "vitest";
import mysql from "mysql2/promise";

describe.skipIf(!process.env.CRM_DATABASE_URL)("CRM Database Connection", () => {
  it("should connect to the CRM database and find the prospects table", async () => {
    const crmUrl = process.env.CRM_DATABASE_URL;
    expect(crmUrl).toBeTruthy();

    // Parser l'URL pour extraire les composants
    const url = new URL(crmUrl!.replace("mysql://", "http://"));
    const sslParam = url.searchParams.get("ssl");

    const connection = await mysql.createConnection({
      host: url.hostname,
      port: parseInt(url.port || "4000"),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: sslParam ? { rejectUnauthorized: true } : undefined,
      connectTimeout: 10000,
    });

    try {
      // Vérifier que la table prospects existe
      const [rows] = await connection.execute("SHOW TABLES LIKE 'prospects'");
      expect(Array.isArray(rows)).toBe(true);
      expect((rows as any[]).length).toBeGreaterThan(0);

      // Vérifier les colonnes clés
      const [columns] = await connection.execute("DESCRIBE prospects");
      const columnNames = (columns as any[]).map((c: any) => c.Field);
      expect(columnNames).toContain("entreprise");
      expect(columnNames).toContain("telephone");
      expect(columnNames).toContain("column");
      expect(columnNames).toContain("status");
      expect(columnNames).toContain("createdBy");
    } finally {
      await connection.end();
    }
  }, 15000);
});
