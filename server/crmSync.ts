/**
 * Service de synchronisation avec le CRM Hallucine
 * 
 * Ce service envoie automatiquement les nouvelles demandes de devis
 * au CRM Hallucine via son endpoint webhook.
 * 
 * Le site web est identifié comme le 3ème commercial "SW" (Site Web)
 * dans le CRM.
 */

import axios from "axios";

const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL || "";
const CRM_WEBHOOK_TOKEN = process.env.CRM_WEBHOOK_TOKEN || "";

export interface CrmProspectData {
  entreprise: string;
  prenom?: string | null;
  personne?: string | null; // nom de famille
  email: string;
  telephone?: string | null;
  siret?: string | null;
  produit?: string | null;
  notes?: string | null;
  dateRealisationEnvisagee?: string | null; // ISO date string
  contactType?: string | null; // "vente" | "location"
}

export interface CrmSyncResult {
  success: boolean;
  prospectId?: number;
  error?: string;
}

/**
 * Mapper les données d'une soumission du site vers le format du CRM
 */
export function mapSubmissionToCrmProspect(submission: {
  type: string;
  nom: string;
  email: string;
  telephone?: string | null;
  entreprise?: string | null;
  produit?: string | null;
  message?: string | null;
  objectif?: string | null;
  sujet?: string | null;
}): CrmProspectData {
  // Séparer le nom en prénom/nom si possible
  const nameParts = submission.nom.trim().split(/\s+/);
  const prenom = nameParts.length > 1 ? nameParts[0] : null;
  const personne = nameParts.length > 1 ? nameParts.slice(1).join(" ") : submission.nom;

  // Construire les notes à partir du message et du sujet
  const notesParts: string[] = [];
  if (submission.type) notesParts.push(`Type: ${submission.type}`);
  if (submission.objectif) notesParts.push(`Objectif: ${submission.objectif}`);
  if (submission.sujet) notesParts.push(`Sujet: ${submission.sujet}`);
  if (submission.message) notesParts.push(`Message: ${submission.message}`);
  notesParts.push(`Source: Site Web hallucine-site`);
  notesParts.push(`Date: ${new Date().toISOString()}`);

  // Date de réalisation : 3 mois dans le futur par défaut
  const dateRealisation = new Date();
  dateRealisation.setMonth(dateRealisation.getMonth() + 3);

  return {
    entreprise: submission.entreprise || `${submission.nom} (Particulier)`,
    prenom,
    personne,
    email: submission.email,
    telephone: submission.telephone || null,
    produit: submission.produit || null,
    notes: notesParts.join("\n"),
    dateRealisationEnvisagee: dateRealisation.toISOString(),
    contactType: submission.objectif || null,
  };
}

/**
 * Envoyer un prospect au CRM via le webhook
 */
export async function syncProspectToCrm(data: CrmProspectData): Promise<CrmSyncResult> {
  if (!CRM_WEBHOOK_URL || !CRM_WEBHOOK_TOKEN) {
    console.warn("[CRM Sync] CRM webhook URL or token not configured. Skipping sync.");
    return {
      success: false,
      error: "CRM webhook not configured",
    };
  }

  try {
    const response = await axios.post(
      CRM_WEBHOOK_URL,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CRM_WEBHOOK_TOKEN}`,
        },
        timeout: 10000,
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = response.data;
      console.log(`[CRM Sync] Prospect créé avec succès: ${result?.id || "OK"}`);
      return {
        success: true,
        prospectId: result?.id,
      };
    } else {
      console.error(`[CRM Sync] Réponse inattendue: ${response.status}`);
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Unknown error";
    console.error(`[CRM Sync] Erreur lors de la synchronisation: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Synchroniser une soumission complète du site vers le CRM
 * Appelé automatiquement après chaque nouvelle demande de devis
 */
export async function syncSubmissionToCrm(submission: {
  type: string;
  nom: string;
  email: string;
  telephone?: string | null;
  entreprise?: string | null;
  produit?: string | null;
  message?: string | null;
  objectif?: string | null;
  sujet?: string | null;
}): Promise<CrmSyncResult> {
  // Ne synchroniser que les demandes de devis et distributeur (pas les simples contacts)
  if (submission.type === "contact") {
    console.log("[CRM Sync] Type 'contact' ignoré — seuls les devis et distributeurs sont synchronisés.");
    return { success: true };
  }

  const prospectData = mapSubmissionToCrmProspect(submission);
  return syncProspectToCrm(prospectData);
}

/**
 * Vérifier si la synchronisation CRM est configurée
 */
export function isCrmSyncConfigured(): boolean {
  return !!(CRM_WEBHOOK_URL && CRM_WEBHOOK_TOKEN);
}
