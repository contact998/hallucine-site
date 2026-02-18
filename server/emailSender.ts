/**
 * Service d'envoi d'emails via Resend
 *
 * Envoi automatique sans intervention humaine.
 * Utilise Resend (gratuit jusqu'à 100 emails/jour).
 *
 * Note : Sans domaine vérifié, l'expéditeur est onboarding@resend.dev.
 * Pour utiliser contact@hallucinecran.fr, il faudra vérifier le domaine dans Resend.
 */

import { Resend } from "resend";
import type { EmailMessage } from "./emailTemplates";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY non configurée — envoi désactivé");
    return null;
  }
  resendClient = new Resend(apiKey);
  return resendClient;
}

/**
 * Vérifie si Resend est configuré
 */
export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Envoie un email de confirmation au prospect via Resend.
 * Retourne { success, id, error }
 */
export async function sendConfirmationEmail(email: EmailMessage): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  const client = getResendClient();
  if (!client) {
    return { success: false, error: "Resend non configuré (RESEND_API_KEY manquante)" };
  }

  try {
    // Déterminer l'expéditeur : domaine vérifié ou fallback Resend
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Hallucine <onboarding@resend.dev>";

    const { data, error } = await client.emails.send({
      from: fromAddress,
      to: [email.to],
      subject: email.subject,
      text: email.content,
    });

    if (error) {
      console.error(`[Email] Erreur Resend pour ${email.to}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Confirmation envoyée à ${email.to} (id: ${data?.id})`);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error(`[Email] Exception Resend pour ${email.to}:`, err);
    return { success: false, error: String(err) };
  }
}

// ─── File d'attente en mémoire (fallback si Resend échoue) ─────────────────

export const pendingProspectEmails: EmailMessage[] = [];

export function enqueueConfirmationEmail(email: EmailMessage): void {
  pendingProspectEmails.push(email);
}

export function getPendingEmails(): EmailMessage[] {
  return [...pendingProspectEmails];
}

export function flushPendingEmails(): EmailMessage[] {
  const emails = [...pendingProspectEmails];
  pendingProspectEmails.length = 0;
  return emails;
}
