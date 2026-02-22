/**
 * Bibliothèque de templates d'emails
 * Tous les emails envoyés par le site sont centralisés ici.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ConfirmationEmailData {
  prenom: string;
  nom?: string | null;
  email: string;
  produit?: string | null;
  entreprise?: string | null;
  besoin?: string | null;
}

export interface EmailMessage {
  to: string;
  subject: string;
  content: string;
}

// ─── Mapping produits pour un libellé propre ────────────────────────────────

const PRODUCT_LABELS: Record<string, string> = {
  "ecrans": "un écran de cinéma gonflable",
  "tentes": "une tente gonflable",
  "mobilier": "du mobilier gonflable",
  "arches": "une arche gonflable",
};

function getProductLabel(produit?: string | null): string {
  if (!produit) return "nos produits";
  const key = produit.toLowerCase();
  for (const [k, v] of Object.entries(PRODUCT_LABELS)) {
    if (key.includes(k)) return v;
  }
  return produit;
}

// ─── Template : Confirmation de demande ─────────────────────────────────────

export function buildConfirmationEmail(data: ConfirmationEmailData): EmailMessage {
  const prenom = data.prenom || "Madame, Monsieur";
  const productLabel = getProductLabel(data.produit);

  const lines = [
    `Bonjour ${prenom},`,
    "",
    `Nous avons bien reçu votre demande concernant ${productLabel} et nous vous en remercions.`,
    "",
    "Votre demande a été prise en compte et un de nos conseillers vous recontactera incessamment sous peu pour répondre à vos questions et vous accompagner dans votre projet.",
    "",
  ];

  if (data.besoin) {
    lines.push(`Pour rappel, votre besoin : ${data.besoin}`);
    lines.push("");
  }

  lines.push(
    "En attendant, n'hésitez pas à consulter notre site pour découvrir l'ensemble de notre gamme :",
    "https://hallucine-site.manus.space",
    "",
    "À très bientôt,",
    "",
    "L'équipe Hallucine",
    "Écrans de cinéma gonflables",
    "https://hallucine-site.manus.space",
    "",
    "---",
    "Cet email a été envoyé automatiquement suite à votre demande sur notre site. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message.",
  );

  return {
    to: data.email,
    subject: `Hallucine — Votre demande a bien été reçue`,
    content: lines.join("\n"),
  };
}
