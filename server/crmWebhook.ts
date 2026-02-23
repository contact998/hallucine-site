/**
 * Service d'envoi de prospects au CRM via webhook
 * Remplace l'ancienne insertion directe en base (crmDirect.ts)
 *
 * Le CRM gère maintenant toute la logique métier :
 * - Création prospect + contact principal
 * - Log d'activité
 * - Automatisations (règles d'événement new_prospect)
 * - Envoi d'email de confirmation au prospect
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CrmWebhookInput {
  entreprise: string;              // REQUIS — nom de l'entreprise
  prenom?: string | null;          // prénom du contact
  personne?: string | null;        // nom de famille du contact
  email?: string | null;           // email du contact
  telephone?: string | null;       // téléphone
  siret?: string | null;           // numéro SIRET
  produit?: string | null;         // produit sélectionné
  notes?: string | null;           // objectif / message
  ville?: string | null;           // ville
  codePostal?: string | null;      // code postal
  pays?: string | null;            // pays (défaut: France côté CRM)
  contactType?: string | null;     // "appel" | "mail" | "autre"
  dateRealisationEnvisagee?: string | null; // format ISO "2026-06-15"
  abandonPartiel?: boolean;        // true si abandon en cours de formulaire
}

export interface CrmWebhookResult {
  success: boolean;
  prospectId?: number;
  emailConfirmationSent?: boolean;
  error?: string;
}

// ─── Vérification de la configuration ───────────────────────────────────────

export function isCrmWebhookConfigured(): boolean {
  return !!(process.env.CRM_WEBHOOK_URL && process.env.CRM_WEBHOOK_TOKEN);
}

// ─── Envoi au webhook CRM ───────────────────────────────────────────────────

export async function sendProspectToCrm(input: CrmWebhookInput): Promise<CrmWebhookResult> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  const webhookToken = process.env.CRM_WEBHOOK_TOKEN;

  if (!webhookUrl || !webhookToken) {
    console.warn("[CRM Webhook] CRM_WEBHOOK_URL ou CRM_WEBHOOK_TOKEN non configuré");
    return { success: false, error: "Webhook CRM non configuré" };
  }

  try {
    // Nettoyer les champs null/undefined pour ne pas les envoyer
    const payload: Record<string, unknown> = {};
    if (input.entreprise) payload.entreprise = input.entreprise;
    if (input.prenom) payload.prenom = input.prenom;
    if (input.personne) payload.personne = input.personne;
    if (input.email) payload.email = input.email;
    if (input.telephone) payload.telephone = input.telephone;
    if (input.siret) payload.siret = input.siret;
    if (input.produit) payload.produit = input.produit;
    if (input.notes) payload.notes = input.notes;
    if (input.ville) payload.ville = input.ville;
    if (input.codePostal) payload.codePostal = input.codePostal;
    if (input.pays) payload.pays = input.pays;
    if (input.contactType) payload.contactType = input.contactType;
    if (input.dateRealisationEnvisagee) payload.dateRealisationEnvisagee = input.dateRealisationEnvisagee;
    if (input.abandonPartiel) payload.abandonPartiel = true;
    payload.lang = "fr";

    console.log(`[CRM Webhook] Envoi prospect ${input.email || input.entreprise} (abandon: ${!!input.abandonPartiel})`);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${webhookToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: "Erreur inconnue" }));
      console.error(`[CRM Webhook] Erreur HTTP ${response.status}:`, errorBody);
      return {
        success: false,
        error: `HTTP ${response.status}: ${(errorBody as any).error || "Erreur inconnue"}`,
      };
    }

    const result = await response.json() as {
      success: boolean;
      prospect?: { id: number; entreprise: string; column: string; status: string };
      emailConfirmationSent?: boolean;
    };

    if (result.success) {
      console.log(`[CRM Webhook] Prospect créé (id: ${result.prospect?.id}) pour ${input.email || input.entreprise}`);
    }

    return {
      success: result.success,
      prospectId: result.prospect?.id,
      emailConfirmationSent: result.emailConfirmationSent,
    };
  } catch (err: any) {
    console.error(`[CRM Webhook] Erreur réseau:`, err.message || err);
    return { success: false, error: err.message || String(err) };
  }
}
