/**
 * Connexion directe à la base de données du CRM Hallucine
 * Insère les prospects du formulaire directement dans la table `prospects`
 * pour qu'ils apparaissent dans la première colonne du Kanban ("PROSPECT")
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
}

export interface CrmInsertResult {
  success: boolean;
  prospectId?: number;
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

// ─── Insertion directe dans la table prospects ──────────────────────────────

export async function insertProspectIntoCrm(input: CrmProspectInput): Promise<CrmInsertResult> {
  const crmPool = getCrmPool();
  if (!crmPool) {
    return { success: false, error: "CRM_DATABASE_URL non configuré" };
  }

  try {
    const [result] = await crmPool.execute(
      `INSERT INTO prospects (
        entreprise,
        personne,
        prenom,
        email,
        telephone,
        ville,
        codePostal,
        pays,
        produit,
        notes,
        \`column\`,
        \`order\`,
        status,
        createdBy,
        contactType
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
        input.notes || null,
        "prospect",       // Première colonne du Kanban
        0,                // Ordre dans la colonne
        "en_cours",       // Statut global
        "site-web",       // Identifie la source
        "mail",           // Type de contact
      ]
    );

    const insertId = (result as any).insertId;
    console.log(`[CRM Direct] Prospect inséré avec succès (id: ${insertId}) pour ${input.email || input.entreprise}`);

    return { success: true, prospectId: insertId };
  } catch (err: any) {
    console.error(`[CRM Direct] Erreur insertion prospect:`, err.message || err);
    return { success: false, error: err.message || String(err) };
  }
}

// ─── Vérification de la configuration ───────────────────────────────────────

export function isCrmDirectConfigured(): boolean {
  return !!process.env.CRM_DATABASE_URL;
}
