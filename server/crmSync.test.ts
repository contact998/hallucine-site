import { describe, it, expect } from "vitest";
import { mapSubmissionToCrmProspect, isCrmSyncConfigured } from "./crmSync";

describe("CRM Sync Service", () => {
  describe("mapSubmissionToCrmProspect", () => {
    it("should map a full devis submission to CRM prospect format", () => {
      const submission = {
        type: "devis",
        nom: "Jean Dupont",
        email: "jean@example.com",
        telephone: "0612345678",
        entreprise: "Ma Société SAS",
        produit: "Écran Géant Soufflerie 10m",
        message: "Je souhaite un devis pour un événement en plein air",
        objectif: "achat",
        sujet: "Événement sportif",
      };

      const result = mapSubmissionToCrmProspect(submission);

      expect(result.entreprise).toBe("Ma Société SAS");
      expect(result.prenom).toBe("Jean");
      expect(result.personne).toBe("Dupont");
      expect(result.email).toBe("jean@example.com");
      expect(result.telephone).toBe("0612345678");
      expect(result.produit).toBe("Écran Géant Soufflerie 10m");
      expect(result.notes).toContain("Type: devis");
      expect(result.notes).toContain("Objectif: achat");
      expect(result.notes).toContain("Sujet: Événement sportif");
      expect(result.notes).toContain("Message: Je souhaite un devis pour un événement en plein air");
      expect(result.notes).toContain("Source: Site Web hallucine-site");
      expect(result.dateRealisationEnvisagee).toBeTruthy();
      expect(result.contactType).toBe("achat");
    });

    it("should handle single name (no first/last split)", () => {
      const submission = {
        type: "devis",
        nom: "Dupont",
        email: "dupont@example.com",
      };

      const result = mapSubmissionToCrmProspect(submission);

      expect(result.prenom).toBeNull();
      expect(result.personne).toBe("Dupont");
    });

    it("should handle multi-part names correctly", () => {
      const submission = {
        type: "devis",
        nom: "Jean Pierre Dupont",
        email: "jp@example.com",
      };

      const result = mapSubmissionToCrmProspect(submission);

      expect(result.prenom).toBe("Jean");
      expect(result.personne).toBe("Pierre Dupont");
    });

    it("should use nom as entreprise when no entreprise provided", () => {
      const submission = {
        type: "devis",
        nom: "Jean Dupont",
        email: "jean@example.com",
      };

      const result = mapSubmissionToCrmProspect(submission);

      expect(result.entreprise).toBe("Jean Dupont (Particulier)");
    });

    it("should set null for optional fields when not provided", () => {
      const submission = {
        type: "devis",
        nom: "Jean Dupont",
        email: "jean@example.com",
      };

      const result = mapSubmissionToCrmProspect(submission);

      expect(result.telephone).toBeNull();
      expect(result.produit).toBeNull();
      expect(result.contactType).toBeNull();
    });

    it("should set dateRealisationEnvisagee to ~3 months in the future", () => {
      const submission = {
        type: "devis",
        nom: "Test",
        email: "test@example.com",
      };

      const result = mapSubmissionToCrmProspect(submission);
      const dateRealisation = new Date(result.dateRealisationEnvisagee!);
      const now = new Date();
      const diffMs = dateRealisation.getTime() - now.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      // Should be approximately 90 days in the future (between 80 and 100)
      expect(diffDays).toBeGreaterThan(80);
      expect(diffDays).toBeLessThan(100);
    });
  });

  describe("isCrmSyncConfigured", () => {
    it("should return false when env vars are not set", () => {
      // By default in test env, these are not set
      const result = isCrmSyncConfigured();
      expect(result).toBe(false);
    });
  });
});
