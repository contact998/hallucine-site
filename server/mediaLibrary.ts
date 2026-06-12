/**
 * server/mediaLibrary.ts
 * Fonctions DB pour la médiathèque centrale.
 * Utilise le `db` partagé de server/db.ts.
 */
import { eq, ne, desc, and, sql, asc, or, like, inArray, notInArray, isNull } from "drizzle-orm";
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
  page?: string | null;
  section?: string | null;
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
    page:        data.page ?? null,
    section:     data.section ?? null,
    sortOrder:   data.sortOrder ?? 0,
    active:      true,
    source:      data.source ?? "upload_web",
    uploadedBy:  data.uploadedBy ?? null,
    usageCount:  0,
  });

  // Après l'INSERT, on récupère par url + page + section pour éviter
  // d'attraper une autre ligne ayant la même url (contrainte UNIQUE retirée)
  const rows = await db
    .select()
    .from(mediaLibrary)
    .where(
      and(
        eq(mediaLibrary.url, data.url),
        data.page != null
          ? eq(mediaLibrary.page, data.page)
          : sql`${mediaLibrary.page} IS NULL`,
        data.section != null
          ? eq(mediaLibrary.section, data.section)
          : sql`${mediaLibrary.section} IS NULL`,
      )
    )
    .orderBy(desc(mediaLibrary.id))
    .limit(1);

  return rows[0];
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

export type ListSortField = "sortOrder" | "createdAt" | "filesize" | "title" | "usageCount";
export type ListSortDir   = "asc" | "desc";

export async function listMedia(options: {
  category?: MediaCategory;
  subcategory?: string;
  activeOnly?: boolean;
  search?: string;
  sortBy?: ListSortField;
  sortDir?: ListSortDir;
  limit?: number;
  offset?: number;
  /** Filtre utilisé/non utilisé (refonte). usedAssetIds = ids placés, fournis par
   *  l'appelant (couche placements) pour ne pas coupler la médiathèque au registre. */
  usageFilter?: "used" | "unused";
  usedAssetIds?: number[];
}): Promise<{ items: MediaItem[]; total: number }> {
  const {
    category,
    subcategory,
    activeOnly = true,
    search,
    sortBy  = "sortOrder",
    sortDir = "asc",
    limit  = 50,
    offset = 0,
    usageFilter,
    usedAssetIds = [],
  } = options;

  // Construire les conditions dynamiquement
  const conditions = [];
  conditions.push(isNull(mediaLibrary.deletedAt)); // jamais montrer les images retirées (soft delete)
  if (category)    conditions.push(eq(mediaLibrary.category, category));
  if (subcategory) conditions.push(eq(mediaLibrary.subcategory, subcategory));
  if (activeOnly)  conditions.push(eq(mediaLibrary.active, true));
  if (search && search.trim()) {
    const q = `%${search.trim().replace(/[%_]/g, "\\$&")}%`;
    conditions.push(or(
      like(mediaLibrary.title,       q),
      like(mediaLibrary.alt,         q),
      like(mediaLibrary.filename,    q),
      like(mediaLibrary.tags,        q),
      like(mediaLibrary.subcategory, q),
    )!);
  }

  // Filtre utilisé/non utilisé : présence (ou non) dans media_placements.
  //  • "used" sans aucun id placé → ne renvoyer rien (1=0).
  //  • "unused" sans aucun id placé → tout est non utilisé → pas de condition.
  if (usageFilter === "used") {
    conditions.push(usedAssetIds.length ? inArray(mediaLibrary.id, usedAssetIds) : sql`1 = 0`);
  } else if (usageFilter === "unused" && usedAssetIds.length) {
    conditions.push(notInArray(mediaLibrary.id, usedAssetIds));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Tri configurable
  const sortColumn =
    sortBy === "createdAt"  ? mediaLibrary.createdAt :
    sortBy === "filesize"   ? mediaLibrary.filesize :
    sortBy === "title"      ? mediaLibrary.title :
    sortBy === "usageCount" ? mediaLibrary.usageCount :
    mediaLibrary.sortOrder;
  const order = sortDir === "desc" ? desc(sortColumn) : asc(sortColumn);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(mediaLibrary)
    .where(where);

  const items = await db
    .select()
    .from(mediaLibrary)
    .where(where)
    // Toujours un tie-breaker stable par createdAt desc pour éviter les sauts
    .orderBy(order, desc(mediaLibrary.createdAt))
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
    isNull(mediaLibrary.deletedAt),
  ];
  if (subcategory) conditions.push(eq(mediaLibrary.subcategory, subcategory));

  try {
    return await db
      .select()
      .from(mediaLibrary)
      .where(and(...conditions))
      .orderBy(asc(mediaLibrary.sortOrder), desc(mediaLibrary.createdAt));
  } catch (err) {
    // Si la DB est injoignable (dev sans DATABASE_URL, incident transitoire),
    // on dégrade gracieusement vers un tableau vide plutôt que de propager
    // un 500. Les pages affichent leurs images statiques de fallback.
    console.error("[mediaLibrary] getMediaByCategory failed, returning empty:", err instanceof Error ? err.message : err);
    return [];
  }
}

/** Récupère toutes les images d'une page (et optionnellement section) triées par sortOrder (pour le frontend) */
export async function getMediaByPage(
  page: string,
  section?: string
): Promise<MediaItem[]> {
  const conditions = [
    eq(mediaLibrary.page, page),
    eq(mediaLibrary.active, true),
    isNull(mediaLibrary.deletedAt),
  ];
  if (section) conditions.push(eq(mediaLibrary.section, section));

  try {
    return await db
      .select()
      .from(mediaLibrary)
      .where(and(...conditions))
      .orderBy(asc(mediaLibrary.sortOrder), desc(mediaLibrary.createdAt));
  } catch (err) {
    console.error("[mediaLibrary] getMediaByPage failed, returning empty:", err instanceof Error ? err.message : err);
    return [];
  }
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
    page: string | null;
    section: string | null;
    url: string;
    filename: string;
    mimeType: string;
  }>
): Promise<void> {
  const patch: Record<string, unknown> = {};

  if (data.url         !== undefined) patch.url         = data.url;
  if (data.filename    !== undefined) patch.filename    = data.filename;
  if (data.mimeType    !== undefined) patch.mimeType    = data.mimeType;
  if (data.alt         !== undefined) patch.alt         = data.alt;
  if (data.title       !== undefined) patch.title       = data.title;
  if (data.category    !== undefined) patch.category    = data.category;
  if (data.subcategory !== undefined) patch.subcategory = data.subcategory;
  if (data.sortOrder   !== undefined) patch.sortOrder   = data.sortOrder;
  if (data.active      !== undefined) patch.active      = data.active;
  if (data.page        !== undefined) patch.page        = data.page;
  if (data.section     !== undefined) patch.section     = data.section;
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

/** Met à jour l'URL et le nom de fichier d'une image après rename R2 */
export async function updateMediaR2Key(
  id: number,
  newUrl: string,
  newFilename: string,
): Promise<void> {
  await db
    .update(mediaLibrary)
    .set({ url: newUrl, filename: newFilename })
    .where(eq(mediaLibrary.id, id));
}

// ─── Opérations en masse ──────────────────────────────────────────────────────

export async function bulkDeactivateMedia(ids: number[]): Promise<number> {
  if (ids.length === 0) return 0;
  const r = await db
    .update(mediaLibrary)
    .set({ active: false })
    .where(inArray(mediaLibrary.id, ids));
  return ids.length;
}

export async function bulkUpdateCategory(
  ids: number[],
  category: MediaCategory,
  subcategory?: string | null,
): Promise<number> {
  if (ids.length === 0) return 0;
  const patch: Record<string, unknown> = { category };
  if (subcategory !== undefined) patch.subcategory = subcategory;
  await db
    .update(mediaLibrary)
    .set(patch)
    .where(inArray(mediaLibrary.id, ids));
  return ids.length;
}

/**
 * Récupère plusieurs items par ID (pour les actions en masse).
 * Utilisé pour déterminer les clés R2 à supprimer avant DELETE en DB.
 */
export async function getMediaByIds(ids: number[]): Promise<MediaItem[]> {
  if (ids.length === 0) return [];
  return db
    .select()
    .from(mediaLibrary)
    .where(inArray(mediaLibrary.id, ids));
}

/** Supprime plusieurs lignes DB. Lance si une seule a usageCount > 0. */
export async function bulkDeleteMedia(ids: number[]): Promise<{ keys: string[] }> {
  if (ids.length === 0) return { keys: [] };
  const items = await getMediaByIds(ids);
  const used  = items.filter((i) => i.usageCount > 0);
  if (used.length > 0) {
    throw new Error(
      `${used.length} image(s) encore utilisée(s) : ${used.map((i) => i.title || i.filename).join(", ")}. Désactivez-les d'abord.`,
    );
  }
  const r2PublicUrl = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
  const keys = items.map((i) => i.url.replace(r2PublicUrl + "/", ""));
  await db.delete(mediaLibrary).where(inArray(mediaLibrary.id, ids));
  return { keys };
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

/**
 * Autres occurrences d'une même image (même `url`) sur d'AUTRES lignes.
 * Sert à avertir « utilisée aussi sur X, Y » et à savoir si on peut supprimer
 * le fichier R2 sans casser une autre page. (URL n'est plus unique.)
 */
export async function listSharingUrl(
  id: number,
): Promise<{ id: number; page: string | null; section: string | null; active: boolean }[]> {
  const item = await getMediaById(id);
  if (!item) return [];
  return db
    .select({ id: mediaLibrary.id, page: mediaLibrary.page, section: mediaLibrary.section, active: mediaLibrary.active })
    .from(mediaLibrary)
    .where(and(eq(mediaLibrary.url, item.url), ne(mediaLibrary.id, id)));
}

/** Combien de lignes référencent encore cette url (pour protéger le fichier R2). */
export async function countByUrl(url: string): Promise<number> {
  const [r] = await db
    .select({ n: sql<number>`count(*)` })
    .from(mediaLibrary)
    .where(eq(mediaLibrary.url, url));
  return Number(r?.n ?? 0);
}

// ─── Convention « ressource » (dataProvider Refine) ─────────────────────────────
// Forme générique partagée par toutes les futures ressources admin :
// list({ pagination, sort, filters }) -> { data, total } · soft delete via deletedAt.

export type ResourceFilter = { field: string; operator: string; value: unknown };
export type ResourceSort   = { field: string; order: "asc" | "desc" };

/** Liste paginée/filtrée/triée pour l'admin (exclut les soft-deleted). */
export async function listMediaResource(opts: {
  pagination: { page: number; perPage: number };
  sort?: ResourceSort[];
  filters?: ResourceFilter[];
}): Promise<{ data: MediaItem[]; total: number }> {
  const { pagination, sort, filters } = opts;

  const conditions = [isNull(mediaLibrary.deletedAt)];

  for (const f of filters ?? []) {
    const v = f.value;
    if (v === undefined || v === "" || v === null) {
      // valeur vide = filtre ignoré, SAUF page=null explicite (« à ranger »)
      if (f.field === "page" && v === null) conditions.push(isNull(mediaLibrary.page));
      continue;
    }
    switch (f.field) {
      case "page":    conditions.push(eq(mediaLibrary.page, String(v))); break;
      case "section": conditions.push(eq(mediaLibrary.section, String(v))); break;
      case "active":  conditions.push(eq(mediaLibrary.active, Boolean(v))); break;
      case "category":conditions.push(eq(mediaLibrary.category, String(v) as MediaCategory)); break;
      case "q":
      case "search": {
        const q = `%${String(v).trim().replace(/[%_]/g, "\\$&")}%`;
        conditions.push(or(
          like(mediaLibrary.title, q),
          like(mediaLibrary.alt, q),
          like(mediaLibrary.filename, q),
        )!);
        break;
      }
    }
  }

  const where = and(...conditions);

  const sortCol = (field?: string) =>
    field === "createdAt"  ? mediaLibrary.createdAt  :
    field === "filesize"   ? mediaLibrary.filesize   :
    field === "title"      ? mediaLibrary.title      :
    field === "usageCount" ? mediaLibrary.usageCount :
    mediaLibrary.sortOrder;

  const s = sort?.[0];
  const order = s
    ? (s.order === "desc" ? desc(sortCol(s.field)) : asc(sortCol(s.field)))
    : asc(mediaLibrary.sortOrder);

  const perPage = Math.min(Math.max(pagination.perPage, 1), 200);
  const page    = Math.max(pagination.page, 1);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(mediaLibrary)
    .where(where);

  const data = await db
    .select()
    .from(mediaLibrary)
    .where(where)
    .orderBy(order, desc(mediaLibrary.createdAt))
    .limit(perPage)
    .offset((page - 1) * perPage);

  return { data, total: Number(count) };
}

/** Soft delete : pose deletedAt = NOW(). Le fichier R2 reste intact. */
export async function softDeleteMediaItem(id: number): Promise<void> {
  await db
    .update(mediaLibrary)
    .set({ deletedAt: new Date() })
    .where(eq(mediaLibrary.id, id));
}
