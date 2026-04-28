/**
 * client/src/hooks/useMediaByCategory.ts
 * Hook générique pour charger des images depuis media_library
 * avec initialData pour éviter tout flash visible.
 *
 * Utilisé par RealisationsSection, Galerie, et tout autre composant
 * qui charge des images depuis la DB.
 */
import { trpc } from "@/lib/trpc";
import type { MediaCategory } from "../../../drizzle/schema";

export interface MediaImage {
  src: string;
  alt: string;
  title?: string;
  subcategory?: string | null;
}

/**
 * Charge les images d'une catégorie depuis media_library.
 * Affiche immédiatement le fallback hardcodé pendant que la DB répond.
 * Remplace silencieusement en arrière-plan — zéro flash.
 */
export function useMediaByCategory(
  category: MediaCategory,
  fallback: MediaImage[],
  subcategory?: string
): MediaImage[] {
  const { data } = trpc.media.byCategory.useQuery(
    { category, subcategory },
    {
      // Afficher le fallback immédiatement — pas d'état "loading"
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
        sortOrder:   0,
        active:      true,
        source:      "migration" as const,
        uploadedBy:  null,
        usageCount:  0,
        createdAt:   new Date(),
        updatedAt:   new Date(),
      })),
      staleTime:            0,
      initialDataUpdatedAt: 0, // Force revalidation en arrière-plan
      retry:                1,
    }
  );

  return (data ?? fallback).map(img => ({
    src:         "url" in img ? img.url : (img as MediaImage).src,
    alt:         img.alt ?? "",
    title:       img.title ?? "",
    subcategory: "subcategory" in img ? img.subcategory : undefined,
  }));
}
