import { eq, desc, sql, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2";
import { InsertUser, users, contactSubmissions, InsertContactSubmission, auditHistory, InsertAuditHistoryEntry } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _pool: any = null;

// Lazily create the drizzle instance with a connection pool to handle ECONNRESET.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _pool = createPool({
        uri: process.env.DATABASE_URL,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _db = drizzle(_pool.promise()) as any;
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _pool = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function insertContactSubmission(data: InsertContactSubmission) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.insert(contactSubmissions).values(data);
  return true;
}

export async function getContactSubmissions() {
  const db = await getDb();
  if (!db) {
    return [];
  }
  return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).limit(100);
}

/** Récupérer les soumissions d'un utilisateur par userId */
export async function getSubmissionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }
  return db.select().from(contactSubmissions)
    .where(eq(contactSubmissions.userId, userId))
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(50);
}

/** Récupérer les soumissions d'un utilisateur par email */
export async function getSubmissionsByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    return [];
  }
  return db.select().from(contactSubmissions)
    .where(eq(contactSubmissions.email, email))
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(50);
}

/** Récupérer toutes les soumissions (admin) avec pagination */
export async function getAllSubmissions(limit = 200) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: contactSubmissions.id,
    type: contactSubmissions.type,
    nom: contactSubmissions.nom,
    email: contactSubmissions.email,
    telephone: contactSubmissions.telephone,
    entreprise: contactSubmissions.entreprise,
    sujet: contactSubmissions.sujet,
    message: contactSubmissions.message,
    produit: contactSubmissions.produit,
    objectif: contactSubmissions.objectif,
    userId: contactSubmissions.userId,
    status: contactSubmissions.status,
    adminNote: contactSubmissions.adminNote,
    createdAt: contactSubmissions.createdAt,
    updatedAt: contactSubmissions.updatedAt,
  }).from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(limit);
}

/** Mettre à jour le statut d'une soumission (admin) */
export async function updateSubmissionStatus(submissionId: number, status: "en_attente" | "en_cours" | "traite" | "annule") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contactSubmissions)
    .set({ status })
    .where(eq(contactSubmissions.id, submissionId));
  return true;
}

/** Mettre à jour la note admin d'une soumission */
export async function updateAdminNote(submissionId: number, note: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contactSubmissions)
    .set({ adminNote: note })
    .where(eq(contactSubmissions.id, submissionId));
  return true;
}

/** Supprimer une soumission (admin) */
export async function deleteSubmission(submissionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(contactSubmissions)
    .where(eq(contactSubmissions.id, submissionId));
  return true;
}

/** Obtenir les statistiques des soumissions (admin) */
export async function getSubmissionStats() {
  const db = await getDb();
  if (!db) return { total: 0, en_attente: 0, en_cours: 0, traite: 0, annule: 0, contact: 0, devis: 0, distributeur: 0 };
  
  const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(contactSubmissions);
  const total = totalResult?.count ?? 0;
  
  const statusCounts = await db.select({
    status: contactSubmissions.status,
    count: sql<number>`count(*)`,
  }).from(contactSubmissions).groupBy(contactSubmissions.status);
  
  const typeCounts = await db.select({
    type: contactSubmissions.type,
    count: sql<number>`count(*)`,
  }).from(contactSubmissions).groupBy(contactSubmissions.type);
  
  const stats: Record<string, number> = { total, en_attente: 0, en_cours: 0, traite: 0, annule: 0, contact: 0, devis: 0, distributeur: 0 };
  for (const row of statusCounts) {
    stats[row.status] = row.count;
  }
  for (const row of typeCounts) {
    stats[row.type] = row.count;
  }
  return stats;
}

// ─── Audit History Helpers ─────────────────────────────────────────

/** Sauvegarder un rapport d'audit en base de données */
export async function insertAuditHistory(data: InsertAuditHistoryEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(auditHistory).values(data);
  return result;
}

/** Récupérer tous les audits (triés du plus récent au plus ancien) */
export async function getAuditHistoryList(limit = 52) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: auditHistory.id,
    period: auditHistory.period,
    timezone: auditHistory.timezone,
    totalPageViews: auditHistory.totalPageViews,
    uniqueVisitors: auditHistory.uniqueVisitors,
    totalEvents: auditHistory.totalEvents,
    avgDuration: auditHistory.avgDuration,
    totalSubmissions: auditHistory.totalSubmissions,
    weeklySubmissions: auditHistory.weeklySubmissions,
    emailSent: auditHistory.emailSent,
    createdAt: auditHistory.createdAt,
  }).from(auditHistory)
    .orderBy(desc(auditHistory.createdAt))
    .limit(limit);
}

/** Récupérer un audit complet par ID */
export async function getAuditHistoryById(auditId: number) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.select().from(auditHistory)
    .where(eq(auditHistory.id, auditId))
    .limit(1);
  return result ?? null;
}

/** Récupérer les 2 derniers audits pour comparaison */
export async function getLastTwoAudits() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: auditHistory.id,
    period: auditHistory.period,
    totalPageViews: auditHistory.totalPageViews,
    uniqueVisitors: auditHistory.uniqueVisitors,
    totalEvents: auditHistory.totalEvents,
    avgDuration: auditHistory.avgDuration,
    totalSubmissions: auditHistory.totalSubmissions,
    weeklySubmissions: auditHistory.weeklySubmissions,
    createdAt: auditHistory.createdAt,
  }).from(auditHistory)
    .orderBy(desc(auditHistory.createdAt))
    .limit(2);
}

/** Mettre à jour le statut d'envoi email d'un audit */
export async function updateAuditEmailStatus(auditId: number, status: "pending" | "sent" | "failed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(auditHistory)
    .set({ emailSent: status })
    .where(eq(auditHistory.id, auditId));
  return true;
}

/** Mettre à jour le fuseau horaire d'un utilisateur */
export async function updateUserTimezone(userId: number, timezone: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users)
    .set({ timezone })
    .where(eq(users.id, userId));
  return true;
}

/** Récupérer le fuseau horaire d'un utilisateur */
export async function getUserTimezone(userId: number): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.select({ timezone: users.timezone }).from(users).where(eq(users.id, userId)).limit(1);
  return result?.timezone ?? null;
}

/** Annuler une soumission (seul le propriétaire ou un admin peut le faire) */
export async function cancelSubmission(submissionId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const [submission] = await db.select().from(contactSubmissions)
    .where(eq(contactSubmissions.id, submissionId))
    .limit(1);
  
  if (!submission) {
    throw new Error("Soumission introuvable");
  }
  if (submission.userId !== userId) {
    throw new Error("Non autorisé");
  }
  if (submission.status === "traite") {
    throw new Error("Impossible d'annuler une demande déjà traitée");
  }
  
  await db.update(contactSubmissions)
    .set({ status: "annule" })
    .where(eq(contactSubmissions.id, submissionId));
  
  return true;
}
