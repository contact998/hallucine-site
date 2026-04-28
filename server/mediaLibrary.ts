/**
 * server/mediaLibrary.ts
 * Fonctions DB pour la médiathèque centrale.
 * Utilise le `db` partagé de server/db.ts.
 */
import { eq, desc, and, sql, asc } from "drizzle-orm";
import { db } from "./db";
import { mediaLibrary } from "../drizzle/schema";
import type { MediaItem, InsertMediaItem, MediaCategory } from "../drizzle/schema";

// ─── Créer ────────────────────────────────────────────────────────────────────

export async function createMediaItem(data: {
  url: string;
  filename: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  tags?: string[];
  category?: MediaCategory;
  subcategory?: string;
  sortOrder?: number;
  source?: "upload_web" | "upload_cli" | "migration" | "external";
  uploadedBy?: number;
}): Promise<MediaItem> {
  const tags = data.tags?.length ? JSON.stringify(data.tags) : null;

  await db.insert(mediaLibrary).values({
    url:         data.url,
    filename:    data.filename,
    mimeType:    data.mimeType ?? null,
    filesize:    data.filesize ?? null,
    width:       data.width ?? null,
    height:      data.height ?? null,
    alt:         data.alt ?? null,
    title:       data.title ?? null,
    tags,
    category:    data.category ?? "autre",
    subcategory: data.subcategory ?? null,
    sortOrder:   data.sortOrder ?? 0,
    active:      true,
    source:      data.source ?? "upload_web",
    uploadedBy:  data.uploadedBy ?? null,
    usageCount:  0,
  });

  const [item] = await db
    .select()
    .from(mediaLibrary)
    .where(eq(mediaLibrary.url, data.url))
    .limit(1);

  return item;
}

// ─── Lire ─────────────────────────────────────────────────────────────────────

export async function getMediaById(id: number): Promise<MediaItem | null> {
  const [item] = await db
    .select()
    .from(mediaLibrary)
    .where(eq(mediaLibrary.id, id))
    .limit(1);
  return item ?? null;
}

export async function getMediaByUrl(url: string): Promise<MediaItem | null> {
  const [item] = await db
    .select()
    .from(mediaLibrary)
    .where(eq(mediaLibrary.url, url))
    .limit(1);
  return item ?? null;
}

export async function listMedia(options: {
  category?: MediaCategory;
  subcategory?: string;
  activeOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ items: MediaItem[]; total: number }> {
  const { category, subcategory, activeOnly = true, limit = 50, offset = 0 } = options;

  // Construire les conditions dynamiquement
  const conditions = [];
  if (category)    conditions.push(eq(mediaLibrary.category, category));
  if (subcategory) conditions.push(eq(mediaLibrary.subcategory, subcategory));
  if (activeOnly)  conditions.push(eq(mediaLibrary.active, true));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(mediaLibrary)
    .where(where);

  const items = await db
    .select()
    .from(mediaLibrary)
    .where(where)
    .orderBy(asc(mediaLibrary.sortOrder), desc(mediaLibrary.createdAt))
    .limit(limit)
    .offset(offset);

  return { items, total: Number(count) };
}

/** Récupère toutes les images d'une catégorie triées par sortOrder (pour le frontend) */
export async function getMediaByCategory(
  category: MediaCategory,
  subcategory?: string
): Promise<MediaItem[]> {
  const conditions = [
    eq(mediaLibrary.category, category),
    eq(mediaLibrary.active, true),
  ];
  if (subcategory) conditions.push(eq(mediaLibrary.subcategory, subcategory));

  return db
    .select()
    .from(mediaLibrary)
    .where(and(...conditions))
    .orderBy(asc(mediaLibrary.sortOrder), desc(mediaLibrary.createdAt));
}

// ─── Mettre à jour ────────────────────────────────────────────────────────────

export async function updateMediaItem(
  id: number,
  data: Partial<{
    alt: string;
    title: string;
    tags: string[];
    category: MediaCategory;
    subcategory: string;
    sortOrder: number;
    active: boolean;
  }>
): Promise<void> {
  const patch: Record<string, unknown> = {};

  if (data.alt         !== undefined) patch.alt         = data.alt;
  if (data.title       !== undefined) patch.title       = data.title;
  if (data.category    !== undefined) patch.category    = data.category;
  if (data.subcategory !== undefined) patch.subcategory = data.subcategory;
  if (data.sortOrder   !== undefined) patch.sortOrder   = data.sortOrder;
  if (data.active      !== undefined) patch.active      = data.active;
  if (data.tags        !== undefined) {
    patch.tags = data.tags.length ? JSON.stringify(data.tags) : null;
  }

  if (Object.keys(patch).length === 0) return;
  await db.update(mediaLibrary).set(patch).where(eq(mediaLibrary.id, id));
}

/** Met à jour l'ordre de plusieurs items en une transaction */
export async function updateSortOrders(
  updates: Array<{ id: number; sortOrder: number }>
): Promise<void> {
  // MySQL n'a pas de UPDATE ... FROM, on fait N updates séquentiels
  // Pour 50 images max c'est largement acceptable
  for (const { id, sortOrder } of updates) {
    await db
      .update(mediaLibrary)
      .set({ sortOrder })
      .where(eq(mediaLibrary.id, id));
  }
}

export async function incrementMediaUsage(id: number): Promise<void> {
  await db
    .update(mediaLibrary)
    .set({ usageCount: sql`${mediaLibrary.usageCount} + 1` })
    .where(eq(mediaLibrary.id, id));
}

export async function decrementMediaUsage(id: number): Promise<void> {
  await db
    .update(mediaLibrary)
    .set({ usageCount: sql`GREATEST(0, ${mediaLibrary.usageCount} - 1)` })
    .where(eq(mediaLibrary.id, id));
}

// ─── Supprimer ────────────────────────────────────────────────────────────────

/**
 * Désactive une image (active = false) sans la supprimer.
 * Méthode recommandée pour "supprimer" une image encore utilisée.
 */
export async function deactivateMediaItem(id: number): Promise<void> {
  await db
    .update(mediaLibrary)
    .set({ active: false })
    .where(eq(mediaLibrary.id, id));
}

/**
 * Supprime définitivement une image de la DB.
 * Lance une erreur si usageCount > 0.
 * Note : ne supprime PAS le fichier sur R2 — à faire séparément avec deleteFromR2().
 */
export async function deleteMediaItem(id: number): Promise<{ key: string }> {
  const item = await getMediaById(id);
  if (!item) throw new Error("Image introuvable");

  if (item.usageCount > 0) {
    throw new Error(
      `Impossible de supprimer : cette image est utilisée ${item.usageCount} fois sur le site. ` +
      "Désactivez-la d'abord si vous voulez la masquer."
    );
  }

  await db.delete(mediaLibrary).where(eq(mediaLibrary.id, id));

  // Retourner la clé R2 pour que l'appelant puisse supprimer le fichier si besoin
  const r2PublicUrl = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
  const key = item.url.replace(r2PublicUrl + "/", "");
  return { key };
}
