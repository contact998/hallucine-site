/**
 * client/src/hooks/useProductImages.ts
 * Hook partagé pour charger les images d'une sous-catégorie produit depuis media_library.
 *
 * Utilise `initialData` pour afficher immédiatement les images hardcodées
 * pendant que la DB répond — zéro flash visible.
 * Quand la DB répond, les images sont remplacées silencieusement en arrière-plan.
 */
import { trpc } from "@/lib/trpc";

export interface ProductImage {
  src: string;
  alt: string;
}

export function useProductImages(
  subcategory: string,
  fallback: ProductImage[]
): ProductImage[] {
  const { data } = trpc.media.byCategory.useQuery(
    { category: "produits", subcategory },
    {
      // Affiche immédiatement le fallback hardcodé — pas de flash
      initialData: fallback.map(img => ({
        id:          0,
        url:         img.src,
        filename:    img.src.split("/").pop() ?? "",
        alt:         img.alt,
        title:       img.alt,
        tags:        null,
        filesize:    null,
        width:       null,
        height:      null,
        mimeType:    null,
        category:    "produits" as const,
        subcategory,
        sortOrder:   0,
        active:      true,
        source:      "migration" as const,
        uploadedBy:  null,
        usageCount:  0,
        createdAt:   new Date(),
        updatedAt:   new Date(),
      })),
      // Revalider en arrière-plan sans bloquer l'affichage
      staleTime:          0,
      initialDataUpdatedAt: 0, // Force la revalidation immédiate en arrière-plan
      retry:              1,
    }
  );

  if (data && data.length > 0) {
    return data.map((img) => ({
      src: img.url,
      alt: img.alt ?? img.title ?? "",
    }));
  }

  return fallback;
}
