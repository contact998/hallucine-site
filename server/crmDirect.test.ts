/**
 * Tests pour l'insertion directe dans la base CRM
 * Teste la connexion et l'insertion d'un prospect de test (puis le supprime)
 */
import { describe, it, expect } from "vitest";
import { insertProspectIntoCrm, isCrmDirectConfigured } from "./crmDirect";
import mysql from "mysql2/promise";

describe("CRM Direct — Insertion de prospect", () => {
  it("devrait confirmer que la connexion directe est configurée", () => {
    expect(isCrmDirectConfigured()).toBe(true);
  });

  it("devrait insérer un prospect de test et le supprimer ensuite", async () => {
    const testEmail = `test-vitest-${Date.now()}@hallucine-test.fr`;

    // Insérer le prospect
    const result = await insertProspectIntoCrm({
      entreprise: "VITEST - Test Automatique",
      personne: "TestNom",
      prenom: "TestPrenom",
      email: testEmail,
      telephone: "0600000000",
      ville: "Paris",
      codePostal: "75001",
      pays: "France",
      produit: "Ecran de cinema -- 5 a 8m",
      notes: "Source : test vitest automatique\nCe prospect sera supprimé automatiquement.",
    });

    expect(result.success).toBe(true);
    expect(result.prospectId).toBeDefined();
    expect(typeof result.prospectId).toBe("number");

    // Nettoyer : supprimer le prospect de test
    const crmUrl = process.env.CRM_DATABASE_URL!;
    const url = new URL(crmUrl.replace("mysql://", "http://"));
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
      // Vérifier que le prospect existe avec les bonnes valeurs
      const [rows] = await connection.execute(
        "SELECT * FROM prospects WHERE id = ?",
        [result.prospectId]
      );
      const prospect = (rows as any[])[0];
      expect(prospect).toBeDefined();
      expect(prospect.entreprise).toBe("VITEST - Test Automatique");
      expect(prospect.email).toBe(testEmail);
      expect(prospect.column).toBe("prospect");
      expect(prospect.status).toBe("en_cours");
      expect(prospect.createdBy).toBe("site-web");
      expect(prospect.contactType).toBe("mail");
      expect(prospect.prenom).toBe("TestPrenom");
      expect(prospect.personne).toBe("TestNom");
      expect(prospect.ville).toBe("Paris");
      expect(prospect.codePostal).toBe("75001");
      expect(prospect.pays).toBe("France");

      // Supprimer le prospect de test
      await connection.execute("DELETE FROM prospects WHERE id = ?", [result.prospectId]);
      console.log(`[Test] Prospect de test (id: ${result.prospectId}) supprimé`);
    } finally {
      await connection.end();
    }
  }, 20000);

  it("devrait gérer le cas entreprise manquante avec fallback Particulier", async () => {
    const testEmail = `test-particulier-${Date.now()}@hallucine-test.fr`;

    const result = await insertProspectIntoCrm({
      entreprise: "Particulier - Jean Dupont",
      prenom: "Jean",
      email: testEmail,
    });

    expect(result.success).toBe(true);
    expect(result.prospectId).toBeDefined();

    // Nettoyer
    const crmUrl = process.env.CRM_DATABASE_URL!;
    const url = new URL(crmUrl.replace("mysql://", "http://"));
    const connection = await mysql.createConnection({
      host: url.hostname,
      port: parseInt(url.port || "4000"),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: { rejectUnauthorized: true },
      connectTimeout: 10000,
    });

    try {
      await connection.execute("DELETE FROM prospects WHERE id = ?", [result.prospectId]);
      console.log(`[Test] Prospect particulier (id: ${result.prospectId}) supprimé`);
    } finally {
      await connection.end();
    }
  }, 20000);
});
