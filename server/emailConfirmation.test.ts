/**
 * Tests pour le système d'email de confirmation prospect
 * - Template d'email (emailTemplates.ts)
 * - Envoi via Resend (emailSender.ts)
 */
import { describe, it, expect } from "vitest";
import { buildConfirmationEmail } from "./emailTemplates";
import { isResendConfigured, sendConfirmationEmail } from "./emailSender";

describe("Email Templates — buildConfirmationEmail", () => {
  it("devrait générer un email avec prénom et produit", () => {
    const email = buildConfirmationEmail({
      prenom: "Jean",
      nom: "Dupont",
      email: "jean.dupont@test.fr",
      produit: "ecrans",
      entreprise: "Ma Société",
      besoin: "Écran 5m pour événement",
    });

    expect(email.to).toBe("jean.dupont@test.fr");
    expect(email.subject).toContain("Hallucine");
    expect(email.subject).toContain("bien été reçue");
    expect(email.content).toContain("Bonjour Jean");
    expect(email.content).toContain("écran de cinéma gonflable");
    expect(email.content).toContain("Écran 5m pour événement");
    expect(email.content).toContain("hallucinecran.fr");
    expect(email.content).toContain("L'équipe Hallucine");
  });

  it("devrait gérer un produit tentes", () => {
    const email = buildConfirmationEmail({
      prenom: "Marie",
      email: "marie@test.fr",
      produit: "tentes",
    });

    expect(email.content).toContain("Bonjour Marie");
    expect(email.content).toContain("tente gonflable");
  });

  it("devrait gérer un produit mobilier", () => {
    const email = buildConfirmationEmail({
      prenom: "Paul",
      email: "paul@test.fr",
      produit: "mobilier",
    });

    expect(email.content).toContain("mobilier gonflable");
  });

  it("devrait gérer un produit arches", () => {
    const email = buildConfirmationEmail({
      prenom: "Sophie",
      email: "sophie@test.fr",
      produit: "arches",
    });

    expect(email.content).toContain("arche gonflable");
  });

  it("devrait gérer un produit inconnu", () => {
    const email = buildConfirmationEmail({
      prenom: "Luc",
      email: "luc@test.fr",
      produit: "autre chose",
    });

    expect(email.content).toContain("autre chose");
  });

  it("devrait gérer l'absence de produit", () => {
    const email = buildConfirmationEmail({
      prenom: "Anna",
      email: "anna@test.fr",
    });

    expect(email.content).toContain("nos produits");
  });

  it("devrait gérer l'absence de prénom", () => {
    const email = buildConfirmationEmail({
      prenom: "",
      email: "test@test.fr",
    });

    expect(email.content).toContain("Bonjour Madame, Monsieur");
  });

  it("ne devrait pas inclure le besoin si absent", () => {
    const email = buildConfirmationEmail({
      prenom: "Test",
      email: "test@test.fr",
    });

    expect(email.content).not.toContain("Pour rappel, votre besoin");
  });

  it("devrait inclure le disclaimer automatique", () => {
    const email = buildConfirmationEmail({
      prenom: "Test",
      email: "test@test.fr",
    });

    expect(email.content).toContain("envoyé automatiquement");
  });
});

describe("Resend — Configuration et envoi", () => {
  it("devrait confirmer que Resend est configuré", () => {
    expect(isResendConfigured()).toBe(true);
  });

  it("devrait envoyer un email de test via Resend", async () => {
    const result = await sendConfirmationEmail({
      to: "delivered@resend.dev", // Adresse de test Resend (toujours acceptée)
      subject: "Test Hallucine — Email de confirmation",
      content: "Ceci est un test d'envoi via Resend depuis le site Hallucine.",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeTruthy();
    console.log(`[Test] Email envoyé via Resend (id: ${result.id})`);
  }, 15000);
});
