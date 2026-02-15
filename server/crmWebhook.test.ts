import { describe, it, expect } from "vitest";

/**
 * Test de validation de la connexion au webhook CRM Hallucine.
 * Ce test vérifie que les secrets CRM_WEBHOOK_URL et CRM_WEBHOOK_TOKEN
 * sont correctement configurés et que le webhook est accessible.
 */
describe("CRM Webhook Connection", () => {
  it("should have CRM_WEBHOOK_URL configured", () => {
    expect(process.env.CRM_WEBHOOK_URL).toBeTruthy();
    expect(process.env.CRM_WEBHOOK_URL).toContain("hallucinecrm.manus.space");
    expect(process.env.CRM_WEBHOOK_URL).toContain("/api/webhook/new-prospect");
  });

  it("should have CRM_WEBHOOK_TOKEN configured", () => {
    expect(process.env.CRM_WEBHOOK_TOKEN).toBeTruthy();
    expect(process.env.CRM_WEBHOOK_TOKEN!.length).toBeGreaterThan(10);
  });

  it("should successfully call the CRM webhook with a test prospect", async () => {
    const url = process.env.CRM_WEBHOOK_URL!;
    const token = process.env.CRM_WEBHOOK_TOKEN!;

    const testProspect = {
      entreprise: "TEST VITEST SYNC - À SUPPRIMER",
      prenom: "Vitest",
      personne: "Automatique",
      email: "vitest-sync@hallucine-site.test",
      telephone: "0000000000",
      produit: "Test synchronisation vitest",
      notes: "Prospect de test créé automatiquement par vitest pour valider la synchronisation. À SUPPRIMER.",
      dateRealisationEnvisagee: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testProspect),
    });

    // Le CRM retourne 201 Created
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.prospect).toBeTruthy();
    expect(data.prospect.id).toBeGreaterThan(0);
    expect(data.prospect.entreprise).toBe("TEST VITEST SYNC - À SUPPRIMER");
    expect(data.prospect.column).toBe("prospect");
    console.log("[CRM Webhook Test] Prospect créé avec succès, id:", data.prospect.id);
  }, 15000);

  it("should reject requests without valid token", async () => {
    const url = process.env.CRM_WEBHOOK_URL!;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer invalid-token-12345",
      },
      body: JSON.stringify({
        entreprise: "TEST INVALIDE",
      }),
    });

    // Should be rejected (401 or 403)
    expect(response.status).toBeGreaterThanOrEqual(400);
  }, 10000);
});
