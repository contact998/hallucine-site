/**
 * server/placements.ts
 * Accès DB aux emplacements média (refonte « fond + emplacements »).
 *
 * Un placement relie un slot (cf. shared/slots.ts) à un asset (media_library).
 * Contrat COMMUN à : lecture site (useSlot/useGallery via tRPC), admin, migration.
 * Utilise le `db` partagé de server/db.ts (même style que server/mediaLibrary.ts).
 */
import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "./db";
import { mediaLibrary, mediaPlacements } from "../drizzle/schema";
import type { MediaItem } from "../drizzle/schema";

/** Asset enrichi de sa position dans l'emplacement. */
export type PlacedAsset = MediaItem & { placementId: number; placementOrder: number };

/** Condition d'entité : NULL pour les slots globaux, = id pour les slots perEntity. */
function entityCond(entityId: number | null | undefined) {
  return entityId == null
    ? isNull(mediaPlacements.entityId)
    : eq(mediaPlacements.entityId, entityId);
}

// ─── Lecture (site) ─────────────────────────────────────────────────────────────

/** Tous les assets ACTIFS placés sur un slot, ordonnés. Sert galeries ET single. */
export async function getPlacedAssets(slotKey: string, entityId?: number | null): Promise<PlacedAsset[]> {
  const rows = await db
    .select()
    .from(mediaPlacements)
    .innerJoin(mediaLibrary, eq(mediaPlacements.assetId, mediaLibrary.id))
    .where(and(
      eq(mediaPlacements.slotKey, slotKey),
      entityCond(entityId),
      eq(mediaLibrary.active, true),
      isNull(mediaLibrary.deletedAt),
    ))
    .orderBy(asc(mediaPlacements.sortOrder), asc(mediaPlacements.id));

  return rows.map(r => ({
    ...r.media_library,
    placementId:    r.media_placements.id,
    placementOrder: r.media_placements.sortOrder,
  }));
}

/** 1 asset pour un slot single (le premier placé), ou null. */
export async function getPlacedAsset(slotKey: string, entityId?: number | null): Promise<PlacedAsset | null> {
  const all = await getPlacedAssets(slotKey, entityId);
  return all[0] ?? null;
}

// ─── Usage (admin : « où cette image apparaît », « images utilisées ») ──────────

/** Placement = un endroit du registre des slots. Sert à détailler, dans la
 *  Bibliothèque, où un asset est réellement visible. */
export interface AssetPlacement {
  placementId: number;
  slotKey: string;
  entityId: number | null;
  sortOrder: number;
}

/** Tous les emplacements qui pointent vers cet asset (toutes pages confondues). */
export async function getAssetPlacements(assetId: number): Promise<AssetPlacement[]> {
  return db
    .select({
      placementId: mediaPlacements.id,
      slotKey:     mediaPlacements.slotKey,
      entityId:    mediaPlacements.entityId,
      sortOrder:   mediaPlacements.sortOrder,
    })
    .from(mediaPlacements)
    .where(eq(mediaPlacements.assetId, assetId))
    .orderBy(asc(mediaPlacements.slotKey), asc(mediaPlacements.sortOrder));
}

/** Ids des assets placés AU MOINS une fois (= « utilisés sur le site »).
 *  Source de vérité du filtre utilisé/non utilisé. NB : c'est media_placements,
 *  pas la colonne legacy media_library.usageCount (jamais mise à jour par la refonte). */
export async function getUsedAssetIds(): Promise<number[]> {
  const rows = await db.selectDistinct({ assetId: mediaPlacements.assetId }).from(mediaPlacements);
  return rows.map((r) => r.assetId);
}

// ─── Écriture (admin / migration) ──────────────────────────────────────────────

/** Placements bruts d'un slot (admin : inclut assets masqués, sans jointure). */
export async function listPlacements(slotKey: string, entityId?: number | null) {
  return db
    .select()
    .from(mediaPlacements)
    .where(and(eq(mediaPlacements.slotKey, slotKey), entityCond(entityId)))
    .orderBy(asc(mediaPlacements.sortOrder), asc(mediaPlacements.id));
}

/** Slot SINGLE : fixe l'unique image (ou la retire si assetId = null). */
export async function setSingle(slotKey: string, entityId: number | null, assetId: number | null): Promise<void> {
  await db.delete(mediaPlacements).where(and(eq(mediaPlacements.slotKey, slotKey), entityCond(entityId)));
  if (assetId != null) {
    await db.insert(mediaPlacements).values({ slotKey, entityId, assetId, sortOrder: 0 });
  }
}

/** Galerie : ajoute un asset à la fin. */
export async function addToGallery(slotKey: string, assetId: number, entityId: number | null = null): Promise<void> {
  const existing = await listPlacements(slotKey, entityId);
  const nextOrder = existing.length ? Math.max(...existing.map(p => p.sortOrder)) + 1 : 0;
  await db.insert(mediaPlacements).values({ slotKey, entityId, assetId, sortOrder: nextOrder });
}

/** Retire un placement précis (le fichier reste dans le fond). */
export async function removePlacement(placementId: number): Promise<void> {
  await db.delete(mediaPlacements).where(eq(mediaPlacements.id, placementId));
}

/** Réordonne une galerie : ids de placements dans le nouvel ordre. */
export async function reorderGallery(placementIdsInOrder: number[]): Promise<void> {
  for (let i = 0; i < placementIdsInOrder.length; i++) {
    await db.update(mediaPlacements).set({ sortOrder: i }).where(eq(mediaPlacements.id, placementIdsInOrder[i]));
  }
}

/** Remplace tout le contenu d'une galerie par une liste ordonnée d'assetId (migration/admin). */
export async function setGallery(slotKey: string, assetIds: number[], entityId: number | null = null): Promise<void> {
  await db.delete(mediaPlacements).where(and(eq(mediaPlacements.slotKey, slotKey), entityCond(entityId)));
  for (let i = 0; i < assetIds.length; i++) {
    await db.insert(mediaPlacements).values({ slotKey, entityId, assetId: assetIds[i], sortOrder: i });
  }
}
