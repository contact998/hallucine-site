/**
 * client/src/hooks/useSlot.ts
 * Lecture des emplacements média (refonte « fond + emplacements »).
 *
 *   useSlot    → 1 image (slot single : bandeau, couverture blog…). null si vide.
 *   useGallery → N images ordonnées (slot gallery).
 *
 * Prod : images bakées au build (window.__SSR_MEDIA__ via prerender) → 0 requête.
 * Dev  : requête tRPC placements.* → vraies données de la base de dev.
 * `fallback` = dernier recours si rien n'est placé (jamais pilote du rendu en prod).
 */
import { trpc } from "@/lib/trpc";
import { getBakedSlot } from "./ssrMedia";
import type { MediaImage } from "./useMediaByCategory";

type SlotRow = {
  url: string;
  alt: string | null;
  title: string | null;
  width: number | null;
  height: number | null;
};

function toImage(r: SlotRow): MediaImage {
  return { src: r.url, alt: r.alt ?? "", title: r.title ?? "", width: r.width, height: r.height };
}

/** Galerie : N images ordonnées pour un emplacement. */
export function useGallery(slotKey: string, fallback: MediaImage[] = []): MediaImage[] {
  const baked = getBakedSlot(slotKey);
  const { data } = trpc.placements.bySlot.useQuery({ slotKey }, { enabled: !baked });
  const rows: SlotRow[] | null | undefined = baked ?? data;
  if (!rows || rows.length === 0) return fallback;
  return rows.map(toImage);
}

/** Single : 1 image pour un emplacement (bandeau, couverture…). null si vide. */
export function useSlot(
  slotKey: string,
  entityId?: number | null,
  fallback: MediaImage | null = null,
): MediaImage | null {
  const baked = getBakedSlot(slotKey, entityId);
  const { data } = trpc.placements.single.useQuery(
    { slotKey, entityId: entityId ?? undefined },
    { enabled: !baked },
  );
  const row: SlotRow | null = (baked && baked[0]) ?? data ?? null;
  return row ? toImage(row) : fallback;
}
