import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendProspectToCrm, isCrmWebhookConfigured } from "./crmWebhook";

describe("crmWebhook", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe("isCrmWebhookConfigured", () => {
    it("returns false when CRM_WEBHOOK_URL is missing", () => {
      delete process.env.CRM_WEBHOOK_URL;
      delete process.env.CRM_WEBHOOK_TOKEN;
      expect(isCrmWebhookConfigured()).toBe(false);
    });

    it("returns false when CRM_WEBHOOK_TOKEN is missing", () => {
      process.env.CRM_WEBHOOK_URL = "https://crm.example.com/api/webhook/new-prospect";
      delete process.env.CRM_WEBHOOK_TOKEN;
      expect(isCrmWebhookConfigured()).toBe(false);
    });

    it("returns true when both URL and TOKEN are set", () => {
      process.env.CRM_WEBHOOK_URL = "https://crm.example.com/api/webhook/new-prospect";
      process.env.CRM_WEBHOOK_TOKEN = "test-token-123";
      expect(isCrmWebhookConfigured()).toBe(true);
    });
  });

  describe("sendProspectToCrm", () => {
    it("returns error when webhook is not configured", async () => {
      delete process.env.CRM_WEBHOOK_URL;
      delete process.env.CRM_WEBHOOK_TOKEN;
      const result = await sendProspectToCrm({
        entreprise: "Test Corp",
        email: "test@example.com",
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain("non configuré");
    });

    it("sends prospect data to webhook and returns success", async () => {
      process.env.CRM_WEBHOOK_URL = "https://crm.example.com/api/webhook/new-prospect";
      process.env.CRM_WEBHOOK_TOKEN = "test-token-123";

      const mockResponse = {
        success: true,
        prospect: { id: 42, entreprise: "Test Corp", column: "prospect", status: "en_cours" },
        emailConfirmationSent: true,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await sendProspectToCrm({
        entreprise: "Test Corp",
        prenom: "Jean",
        personne: "Dupont",
        email: "jean@test.com",
        telephone: "0612345678",
        produit: "Ecran de cinema",
        notes: "Source : formulaire site web hallucine.fr",
        contactType: "mail",
      });

      expect(result.success).toBe(true);
      expect(result.prospectId).toBe(42);
      expect(result.emailConfirmationSent).toBe(true);

      // Vérifier que fetch a été appelé avec les bons paramètres
      expect(global.fetch).toHaveBeenCalledWith(
        "https://crm.example.com/api/webhook/new-prospect",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "Authorization": "Bearer test-token-123",
          }),
        })
      );

      // Vérifier le body envoyé
      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.entreprise).toBe("Test Corp");
      expect(body.prenom).toBe("Jean");
      expect(body.email).toBe("jean@test.com");
      expect(body.contactType).toBe("mail");
    });

    it("sends abandon data with abandonPartiel flag", async () => {
      process.env.CRM_WEBHOOK_URL = "https://crm.example.com/api/webhook/new-prospect";
      process.env.CRM_WEBHOOK_TOKEN = "test-token-123";

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          prospect: { id: 43, entreprise: "Particulier - Jean", column: "prospect", status: "en_cours" },
        }),
      });

      const result = await sendProspectToCrm({
        entreprise: "Particulier - Jean",
        email: "jean@test.com",
        abandonPartiel: true,
        notes: "[ABANDON étape 3/7 - 43%]",
      });

      expect(result.success).toBe(true);

      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.abandonPartiel).toBe(true);
    });

    it("handles HTTP errors gracefully", async () => {
      process.env.CRM_WEBHOOK_URL = "https://crm.example.com/api/webhook/new-prospect";
      process.env.CRM_WEBHOOK_TOKEN = "bad-token";

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ error: "Token invalide" }),
      });

      const result = await sendProspectToCrm({
        entreprise: "Test Corp",
        email: "test@example.com",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("403");
    });

    it("handles network errors gracefully", async () => {
      process.env.CRM_WEBHOOK_URL = "https://crm.example.com/api/webhook/new-prospect";
      process.env.CRM_WEBHOOK_TOKEN = "test-token-123";

      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const result = await sendProspectToCrm({
        entreprise: "Test Corp",
        email: "test@example.com",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Network error");
    });

    it("does not send null/undefined fields in payload", async () => {
      process.env.CRM_WEBHOOK_URL = "https://crm.example.com/api/webhook/new-prospect";
      process.env.CRM_WEBHOOK_TOKEN = "test-token-123";

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, prospect: { id: 44 } }),
      });

      await sendProspectToCrm({
        entreprise: "Test Corp",
        email: "test@example.com",
        telephone: null,
        siret: null,
        ville: null,
      });

      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body).not.toHaveProperty("telephone");
      expect(body).not.toHaveProperty("siret");
      expect(body).not.toHaveProperty("ville");
    });
  });
});
