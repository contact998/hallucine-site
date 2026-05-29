/**
 * client/src/hooks/useMediaByCategory.ts
 * Hook générique pour charger des images depuis media_library.
 *
 * En production : images figées au build par scripts/prerender.mjs
 * (lecture DB → window.__SSR_MEDIA__) → présentes dans le HTML pré-rendu
 * et au premier rendu client → aucun flash, aucune requête réseau.
 *
 * En dev local : fallback hardcodé immédiat via `initialData` + revalidation tRPC.
 *
 * Utilisé par RealisationsSection, Galerie, et tout composant chargeant
 * des images depuis la DB.
 */
import { trpc } from "@/lib/trpc";
import type { MediaCategory } from "../../../drizzle/schema";
import { getBakedMedia } from "./ssrMedia";

export interface MediaImage {
  src: string;
  alt: string;
  title?: string;
  subcategory?: string | null;
  width?: number | null;
  height?: number | null;
}

export function useMediaByCategory(
  category: MediaCategory,
  fallback: MediaImage[],
  subcategory?: string
): MediaImage[] {
  const baked = getBakedMedia(category, subcategory);

  const { data } = trpc.media.byCategory.useQuery(
    { category, subcategory },
    baked
      ? // Images bakées dispo : aucune requête, le rendu sort des données figées
        { enabled: false }
      : {
          // Dev local : fallback hardcodé immédiat + revalidation DB
          initialData: fallback.map(img => ({
            id:          0,
            url:         img.src,
            filename:    img.src.split("/").pop() ?? "",
            alt:         img.alt,
            title:       img.title ?? img.alt,
            tags:        null,
            filesize:    null,
            width:       null,
            height:      null,
            mimeType:    null,
            category,
            subcategory: subcategory ?? null,
            page:        null,
            section:     null,
            sortOrder:   0,
            active:      true,
            source:      "migration" as const,
            uploadedBy:  null,
            usageCount:  0,
            createdAt:   new Date(),
            updatedAt:   new Date(),
          })),
          staleTime:            0,
          initialDataUpdatedAt: 0,
          retry:                1,
        }
  );

  if (baked) {
    return baked.map(img => ({
      src:         img.url,
      alt:         img.alt ?? "",
      title:       img.title ?? "",
      subcategory: img.subcategory,
      width:       img.width,
      height:      img.height,
    }));
  }

  return (data ?? fallback).map(img => ({
    src:         "url" in img ? img.url : (img as MediaImage).src,
    alt:         img.alt ?? "",
    title:       img.title ?? "",
    subcategory: "subcategory" in img ? img.subcategory : undefined,
    width:       img.width ?? null,
    height:      img.height ?? null,
  }));
}
