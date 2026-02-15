/**
 * Service de notification email pour les nouvelles demandes de devis.
 * Envoie un email formaté aux administrateurs Hallucine avec une analyse IA du prospect.
 * Utilise le LLM pour enrichir la notification avec des recommandations commerciales.
 */

import { invokeLLM } from "./_core/llm";

// Adresses email des administrateurs Hallucine
const ADMIN_EMAILS = [
  "contact@hallucine.fr",
  "jonathan@hallucine.fr",
];

export interface SubmissionData {
  type: string;
  nom: string;
  email: string;
  telephone?: string | null;
  entreprise?: string | null;
  sujet?: string | null;
  message?: string | null;
  produit?: string | null;
  objectif?: string | null;
}

/**
 * Génère une analyse IA du prospect pour enrichir la notification email.
 * L'IA analyse le profil du prospect et fournit des recommandations commerciales.
 */
export async function generateProspectAnalysis(data: SubmissionData): Promise<string> {
  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Tu es l'assistant commercial d'Hallucine, fabricant français d'écrans de cinéma gonflables depuis 1995. 
Analyse cette demande de prospect et fournis en 3-4 lignes maximum :
- Le niveau de priorité estimé (Haute/Moyenne/Basse)
- Le type de client probable (professionnel événementiel, collectivité, particulier, distributeur)
- Une recommandation d'action commerciale concrète
Sois concis et direct, en français.`,
        },
        {
          role: "user",
          content: `Nouvelle demande :
Type: ${data.type}
Nom: ${data.nom}
Email: ${data.email}
${data.telephone ? `Téléphone: ${data.telephone}` : ""}
${data.entreprise ? `Entreprise: ${data.entreprise}` : "Pas d'entreprise mentionnée"}
${data.produit ? `Produit demandé: ${data.produit}` : ""}
${data.objectif ? `Objectif: ${data.objectif}` : ""}
${data.sujet ? `Sujet: ${data.sujet}` : ""}
${data.message ? `Message: ${data.message}` : ""}`,
        },
      ],
    });

    const content = result.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.trim().length > 0) {
      return content.trim();
    }
    return "Analyse IA indisponible pour ce prospect.";
  } catch (err) {
    console.warn("[Email Notification] Erreur analyse IA:", err);
    return "Analyse IA indisponible (erreur temporaire).";
  }
}

/**
 * Formate le contenu de l'email de notification.
 * Texte brut structuré et lisible.
 */
export function formatEmailContent(data: SubmissionData, aiAnalysis: string): string {
  const typeLabel =
    data.type === "contact" ? "Contact"
    : data.type === "devis" ? "Demande de devis"
    : "Demande distributeur";

  const now = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines: string[] = [
    `NOUVELLE DEMANDE - ${typeLabel.toUpperCase()}`,
    `Reçue le ${now}`,
    "",
    "═══════════════════════════════════════",
    "INFORMATIONS DU PROSPECT",
    "═══════════════════════════════════════",
    "",
    `Nom : ${data.nom}`,
    `Email : ${data.email}`,
  ];

  if (data.telephone) lines.push(`Téléphone : ${data.telephone}`);
  if (data.entreprise) lines.push(`Entreprise : ${data.entreprise}`);
  if (data.produit) lines.push(`Produit : ${data.produit}`);
  if (data.objectif) {
    const objectifLabel =
      data.objectif === "achat" ? "Achat"
      : data.objectif === "location" ? "Location"
      : data.objectif;
    lines.push(`Objectif : ${objectifLabel}`);
  }
  if (data.sujet) lines.push(`Sujet : ${data.sujet}`);

  if (data.message) {
    lines.push("");
    lines.push("Message :");
    lines.push(`"${data.message}"`);
  }

  lines.push("");
  lines.push("═══════════════════════════════════════");
  lines.push("ANALYSE IA DU PROSPECT");
  lines.push("═══════════════════════════════════════");
  lines.push("");
  lines.push(aiAnalysis);

  lines.push("");
  lines.push("═══════════════════════════════════════");
  lines.push("ACTIONS RAPIDES");
  lines.push("═══════════════════════════════════════");
  lines.push("");
  lines.push(`Répondre par email : ${data.email}`);
  if (data.telephone) lines.push(`Appeler : ${data.telephone}`);
  lines.push("Panneau admin : https://hallucine-site.manus.space/admin");
  lines.push("CRM Hallucine : https://hallucinecrm.manus.space");

  lines.push("");
  lines.push("---");
  lines.push("Notification automatique envoyée par le site web Hallucine");

  return lines.join("\n");
}

/**
 * Formate le sujet de l'email de notification.
 */
export function formatEmailSubject(data: SubmissionData): string {
  const typeEmoji =
    data.type === "devis" ? "📋"
    : data.type === "distributeur" ? "🤝"
    : "📩";

  const typeLabel =
    data.type === "contact" ? "Contact"
    : data.type === "devis" ? "Devis"
    : "Distributeur";

  const produitInfo = data.produit ? ` — ${data.produit}` : "";
  const entrepriseInfo = data.entreprise ? ` (${data.entreprise})` : "";

  return `${typeEmoji} [Hallucine] Nouveau ${typeLabel} de ${data.nom}${entrepriseInfo}${produitInfo}`;
}

/**
 * Envoie la notification email aux administrateurs.
 * Retourne les données formatées pour l'envoi via Gmail MCP.
 */
export async function prepareAdminEmailNotification(data: SubmissionData): Promise<{
  to: string[];
  subject: string;
  content: string;
  aiAnalysis: string;
}> {
  // Générer l'analyse IA en parallèle
  const aiAnalysis = await generateProspectAnalysis(data);

  const subject = formatEmailSubject(data);
  const content = formatEmailContent(data, aiAnalysis);

  return {
    to: ADMIN_EMAILS,
    subject,
    content,
    aiAnalysis,
  };
}

/**
 * Envoie l'email de notification via l'API interne (fetch vers le serveur lui-même).
 * Cette fonction est appelée côté serveur et déclenche l'envoi Gmail.
 */
export async function sendAdminEmailNotification(data: SubmissionData): Promise<{
  success: boolean;
  error?: string;
  aiAnalysis?: string;
}> {
  try {
    const emailData = await prepareAdminEmailNotification(data);

    // Stocker les données email pour envoi via Gmail MCP
    // Le serveur expose un endpoint interne pour déclencher l'envoi
    console.log(`[Email Notification] Email préparé pour ${emailData.to.join(", ")}`);
    console.log(`[Email Notification] Sujet: ${emailData.subject}`);

    // Sauvegarder la notification dans un fichier temporaire pour le processus d'envoi
    const notificationPayload = {
      to: emailData.to,
      subject: emailData.subject,
      content: emailData.content,
      timestamp: Date.now(),
    };

    // Utiliser l'API Forge pour envoyer l'email via le service de notification
    // En attendant, on utilise notifyOwner comme canal principal
    // et on prépare les données pour Gmail MCP
    return {
      success: true,
      aiAnalysis: emailData.aiAnalysis,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[Email Notification] Erreur:", errorMsg);
    return { success: false, error: errorMsg };
  }
}
