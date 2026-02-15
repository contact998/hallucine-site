import { describe, it, expect, vi } from "vitest";
import { formatEmailContent, formatEmailSubject } from "./emailNotification";
import type { SubmissionData } from "./emailNotification";

// Mock le LLM pour les tests
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content:
            "Priorité: Haute — Client professionnel événementiel. Recommandation: Contacter rapidement par téléphone pour qualifier le besoin et proposer une démonstration.",
        },
      },
    ],
  }),
}));

describe("Email Notification Service", () => {
  const fullSubmission: SubmissionData = {
    type: "devis",
    nom: "Jean Dupont",
    email: "jean@example.com",
    telephone: "+33 6 12 34 56 78",
    entreprise: "Cinéma Plein Air SAS",
    produit: "Écran Géant Soufflerie 10m",
    objectif: "achat",
    sujet: "Festival été 2026",
    message: "Nous organisons un festival en plein air et avons besoin d'un écran 10m.",
  };

  const minimalSubmission: SubmissionData = {
    type: "contact",
    nom: "Marie Martin",
    email: "marie@example.com",
  };

  describe("formatEmailSubject", () => {
    it("should format subject for devis with all info", () => {
      const subject = formatEmailSubject(fullSubmission);
      expect(subject).toContain("Devis");
      expect(subject).toContain("Jean Dupont");
      expect(subject).toContain("Cinéma Plein Air SAS");
      expect(subject).toContain("Écran Géant Soufflerie 10m");
      expect(subject).toContain("[Hallucine]");
    });

    it("should format subject for contact without entreprise", () => {
      const subject = formatEmailSubject(minimalSubmission);
      expect(subject).toContain("Contact");
      expect(subject).toContain("Marie Martin");
      expect(subject).toContain("[Hallucine]");
      expect(subject).not.toContain("undefined");
    });

    it("should format subject for distributeur", () => {
      const subject = formatEmailSubject({
        type: "distributeur",
        nom: "Pierre Durand",
        email: "pierre@company.com",
        entreprise: "Event Pro SARL",
      });
      expect(subject).toContain("Distributeur");
      expect(subject).toContain("Pierre Durand");
      expect(subject).toContain("Event Pro SARL");
    });
  });

  describe("formatEmailContent", () => {
    it("should include all prospect information in the email body", () => {
      const content = formatEmailContent(fullSubmission, "Analyse IA de test");
      expect(content).toContain("NOUVELLE DEMANDE");
      expect(content).toContain("DEMANDE DE DEVIS");
      expect(content).toContain("Jean Dupont");
      expect(content).toContain("jean@example.com");
      expect(content).toContain("+33 6 12 34 56 78");
      expect(content).toContain("Cinéma Plein Air SAS");
      expect(content).toContain("Écran Géant Soufflerie 10m");
      expect(content).toContain("Achat");
      expect(content).toContain("Festival été 2026");
      expect(content).toContain("festival en plein air");
    });

    it("should include AI analysis section", () => {
      const content = formatEmailContent(fullSubmission, "Priorité Haute — Client pro");
      expect(content).toContain("ANALYSE IA DU PROSPECT");
      expect(content).toContain("Priorité Haute — Client pro");
    });

    it("should include action links", () => {
      const content = formatEmailContent(fullSubmission, "Test");
      expect(content).toContain("ACTIONS RAPIDES");
      expect(content).toContain("jean@example.com");
      expect(content).toContain("+33 6 12 34 56 78");
      expect(content).toContain("hallucine-site.manus.space/admin");
      expect(content).toContain("hallucinecrm.manus.space");
    });

    it("should handle minimal submission without optional fields", () => {
      const content = formatEmailContent(minimalSubmission, "Analyse test");
      expect(content).toContain("Marie Martin");
      expect(content).toContain("marie@example.com");
      expect(content).not.toContain("undefined");
      expect(content).not.toContain("null");
    });

    it("should include the date in French format", () => {
      const content = formatEmailContent(fullSubmission, "Test");
      // Should contain French day/month names
      expect(content).toContain("Reçue le");
    });
  });

  describe("generateProspectAnalysis", () => {
    it("should return AI analysis from LLM", async () => {
      const { generateProspectAnalysis } = await import("./emailNotification");
      const analysis = await generateProspectAnalysis(fullSubmission);
      expect(analysis).toContain("Priorité");
      expect(analysis).toContain("professionnel");
    });
  });

  describe("prepareAdminEmailNotification", () => {
    it("should prepare complete email data", async () => {
      const { prepareAdminEmailNotification } = await import("./emailNotification");
      const emailData = await prepareAdminEmailNotification(fullSubmission);

      expect(emailData.to).toContain("contact@hallucine.fr");
      expect(emailData.to).toContain("jonathan@hallucine.fr");
      expect(emailData.subject).toContain("Jean Dupont");
      expect(emailData.content).toContain("ANALYSE IA");
      expect(emailData.aiAnalysis).toBeTruthy();
    });
  });
});
