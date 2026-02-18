/**
 * Tests pour l'insertion directe dans la base CRM
 * avec dédoublonnage intelligent :
 * - Abandon + email existant → mise à jour
 * - Soumission complète + email existant → nouveau prospect + avertissement
 */
import { describe, it, expect } from "vitest";
import { insertProspectIntoCrm, isCrmDirectConfigured } from "./crmDirect";
import mysql from "mysql2/promise";

// Helper pour nettoyer les prospects de test
async function cleanupTestProspects(email: string) {
  const crmUrl = process.env.CRM_DATABASE_URL;
  if (!crmUrl) return;
  const url = new URL(crmUrl.replace("mysql://", "http://"));
  const conn = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port || "4000"),
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: true },
    connectTimeout: 10000,
  });
  await conn.execute("DELETE FROM prospects WHERE email = ? AND createdBy = 'site-web'", [email]);
  await conn.end();
}

describe("CRM Direct — Insertion et dédoublonnage", () => {
  const testEmail = `test-dedup-${Date.now()}@hallucine-test.fr`;

  it("devrait confirmer que la connexion directe est configurée", () => {
    expect(isCrmDirectConfigured()).toBe(true);
  });

  it("devrait insérer un nouveau prospect (pas de doublon)", async () => {
    await cleanupTestProspects(testEmail);

    const result = await insertProspectIntoCrm({
      entreprise: "Test Dedup SARL",
      personne: "Dupont",
      prenom: "Jean",
      email: testEmail,
      telephone: "+33612345678",
      ville: "Paris",
      codePostal: "75001",
      pays: "France",
      produit: "Airscreen 20'",
      notes: "Source : test vitest",
    });

    expect(result.success).toBe(true);
    expect(result.prospectId).toBeGreaterThan(0);
    expect(result.updated).toBe(false);
    expect(result.duplicateWarning).toBeFalsy();
    console.log(`[Test] Prospect créé (id: ${result.prospectId})`);
  }, 20000);

  it("ABANDON + email existant → mise à jour (pas de doublon)", async () => {
    const result = await insertProspectIntoCrm({
      entreprise: "Test Dedup SARL",
      email: testEmail,
      telephone: "+33699999999",
      notes: "[ABANDON étape 3/7 - 43%]",
      isAbandon: true,
    });

    expect(result.success).toBe(true);
    expect(result.updated).toBe(true);
    console.log(`[Test] Abandon → prospect mis à jour (id: ${result.prospectId})`);
  }, 20000);

  it("SOUMISSION COMPLÈTE + email existant → nouveau prospect + avertissement", async () => {
    const result = await insertProspectIntoCrm({
      entreprise: "Autre Société SAS",
      personne: "Martin",
      prenom: "Marie",
      email: testEmail,
      telephone: "+33687654321",
      produit: "Airscreen 30'",
      notes: "Source : test vitest - soumission complète",
      isAbandon: false,
    });

    expect(result.success).toBe(true);
    expect(result.updated).toBe(false);
    expect(result.duplicateWarning).toBe(true);
    console.log(`[Test] Soumission complète → nouveau prospect (id: ${result.prospectId}) avec avertissement`);
  }, 20000);

  it("ABANDON sans email → toujours insérer (pas de dédoublonnage possible)", async () => {
    const result = await insertProspectIntoCrm({
      entreprise: "Particulier - Anonyme",
      notes: "[ABANDON étape 1/7 - 14%]",
      isAbandon: true,
    });

    expect(result.success).toBe(true);
    expect(result.updated).toBe(false);

    // Nettoyer
    if (result.prospectId) {
      const crmUrl = process.env.CRM_DATABASE_URL!;
      const url = new URL(crmUrl.replace("mysql://", "http://"));
      const conn = await mysql.createConnection({
        host: url.hostname,
        port: parseInt(url.port || "4000"),
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1),
        ssl: { rejectUnauthorized: true },
        connectTimeout: 10000,
      });
      await conn.execute("DELETE FROM prospects WHERE id = ?", [result.prospectId]);
      await conn.end();
    }
    console.log(`[Test] Abandon sans email → nouveau prospect créé`);
  }, 20000);

  it("nettoyage des prospects de test", async () => {
    await cleanupTestProspects(testEmail);
    console.log(`[Test] Prospects de test supprimés pour ${testEmail}`);
  }, 20000);
});
