/**
 * Connexion directe à la base de données du CRM Hallucine
 *
 * Logique de dédoublonnage :
 * - ABANDON (prospect partiel) : si email existe déjà → mise à jour (pas de doublon)
 * - SOUMISSION COMPLÈTE : toujours créer un nouveau prospect.
 *   Si email existe déjà → ajouter un avertissement dans les notes.
 */
import mysql from "mysql2/promise";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CrmProspectInput {
  entreprise: string;
  personne?: string | null;    // Nom de famille
  prenom?: string | null;
  email?: string | null;
  telephone?: string | null;
  ville?: string | null;
  codePostal?: string | null;
  pays?: string | null;
  produit?: string | null;
  notes?: string | null;
  isAbandon?: boolean;         // true = abandon, false/undefined = soumission complète
}

export interface CrmInsertResult {
  success: boolean;
  prospectId?: number;
  updated?: boolean;           // true si mise à jour d'un prospect existant (abandon)
  duplicateWarning?: boolean;  // true si email déjà existant (soumission complète)
  error?: string;
}

// ─── Pool de connexion (réutilisé entre les requêtes) ───────────────────────

let pool: mysql.Pool | null = null;

function getCrmPool(): mysql.Pool | null {
  if (pool) return pool;

  const crmUrl = process.env.CRM_DATABASE_URL;
  if (!crmUrl) {
    console.warn("[CRM Direct] CRM_DATABASE_URL non configuré");
    return null;
  }

  try {
    const url = new URL(crmUrl.replace("mysql://", "http://"));
    const sslParam = url.searchParams.get("ssl");

    pool = mysql.createPool({
      host: url.hostname,
      port: parseInt(url.port || "4000"),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: sslParam ? { rejectUnauthorized: true } : undefined,
      connectionLimit: 3,
      connectTimeout: 10000,
      waitForConnections: true,
    });

    console.log("[CRM Direct] Pool de connexion créé");
    return pool;
  } catch (err) {
    console.error("[CRM Direct] Erreur création pool:", err);
    return null;
  }
}

// ─── Recherche de prospects existants par email ─────────────────────────────

async function findProspectsByEmail(crmPool: mysql.Pool, email: string): Promise<{ id: number; entreprise: string | null }[]> {
  const [rows] = await crmPool.execute(
    "SELECT id, entreprise FROM prospects WHERE email = ? ORDER BY id DESC",
    [email]
  );
  return rows as { id: number; entreprise: string | null }[];
}

// ─── Mise à jour d'un prospect existant (pour les abandons) ─────────────────

async function updateExistingProspect(crmPool: mysql.Pool, prospectId: number, input: CrmProspectInput): Promise<void> {
  const updates: string[] = [];
  const values: any[] = [];

  if (input.entreprise) { updates.push("entreprise = ?"); values.push(input.entreprise); }
  if (input.personne) { updates.push("personne = ?"); values.push(input.personne); }
  if (input.prenom) { updates.push("prenom = ?"); values.push(input.prenom); }
  if (input.telephone) { updates.push("telephone = ?"); values.push(input.telephone); }
  if (input.ville) { updates.push("ville = ?"); values.push(input.ville); }
  if (input.codePostal) { updates.push("codePostal = ?"); values.push(input.codePostal); }
  if (input.pays) { updates.push("pays = ?"); values.push(input.pays); }
  if (input.produit) { updates.push("produit = ?"); values.push(input.produit); }
  if (input.notes) {
    updates.push("notes = CONCAT(COALESCE(notes, ''), '\\n---\\n', ?)");
    values.push(input.notes);
  }

  updates.push("updatedBy = ?");
  values.push("site-web");

  if (updates.length === 0) return;

  values.push(prospectId);
  await crmPool.execute(
    `UPDATE prospects SET ${updates.join(", ")} WHERE id = ?`,
    values
  );
}

// ─── Insertion d'un nouveau prospect ────────────────────────────────────────

async function insertNewProspect(crmPool: mysql.Pool, input: CrmProspectInput, notesExtra?: string): Promise<number> {
  const finalNotes = [input.notes, notesExtra].filter(Boolean).join("\n");

  const [result] = await crmPool.execute(
    `INSERT INTO prospects (
      entreprise, personne, prenom, email, telephone,
      ville, codePostal, pays, produit, notes,
      \`column\`, \`order\`, status, createdBy, contactType
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.entreprise,
      input.personne || null,
      input.prenom || null,
      input.email || null,
      input.telephone || null,
      input.ville || null,
      input.codePostal || null,
      input.pays || null,
      input.produit || null,
      finalNotes || null,
      "prospect",
      0,
      "en_cours",
      "site-web",
      "mail",
    ]
  );

  return (result as any).insertId;
}

// ─── Fonction principale : insertion intelligente ───────────────────────────

export async function insertProspectIntoCrm(input: CrmProspectInput): Promise<CrmInsertResult> {
  const crmPool = getCrmPool();
  if (!crmPool) {
    return { success: false, error: "CRM_DATABASE_URL non configuré" };
  }

  try {
    // Chercher les prospects existants avec le même email
    let existingProspects: { id: number; entreprise: string | null }[] = [];
    if (input.email) {
      existingProspects = await findProspectsByEmail(crmPool, input.email);
    }

    // ─── CAS ABANDON : mise à jour si email existe déjà ─────────────
    if (input.isAbandon && existingProspects.length > 0) {
      const mostRecent = existingProspects[0]; // Le plus récent (ORDER BY id DESC)
      await updateExistingProspect(crmPool, mostRecent.id, input);
      console.log(`[CRM Direct] Abandon → prospect existant mis à jour (id: ${mostRecent.id}) pour ${input.email}`);
      return { success: true, prospectId: mostRecent.id, updated: true };
    }

    // ─── CAS SOUMISSION COMPLÈTE : toujours créer ───────────────────
    let notesExtra: string | undefined;
    if (!input.isAbandon && existingProspects.length > 0) {
      const ids = existingProspects.map(p => `#${p.id}`).join(", ");
      notesExtra = `⚠️ Email déjà utilisé par le(s) prospect(s) ${ids}`;
      console.log(`[CRM Direct] Email doublon détecté pour ${input.email} → prospects existants: ${ids}`);
    }

    const insertId = await insertNewProspect(crmPool, input, notesExtra);
    console.log(`[CRM Direct] Prospect inséré (id: ${insertId}) pour ${input.email || input.entreprise}`);

    return {
      success: true,
      prospectId: insertId,
      updated: false,
      duplicateWarning: existingProspects.length > 0,
    };
  } catch (err: any) {
    console.error(`[CRM Direct] Erreur insertion prospect:`, err.message || err);
    return { success: false, error: err.message || String(err) };
  }
}

// ─── Vérification de la configuration ───────────────────────────────────────

export function isCrmDirectConfigured(): boolean {
  return !!process.env.CRM_DATABASE_URL;
}
