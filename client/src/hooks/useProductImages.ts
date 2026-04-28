/**
 * client/src/hooks/useProductImages.ts
 * Hook partagé pour charger les images d'une sous-catégorie produit depuis media_library.
 * Retourne les images DB si disponibles, sinon le fallback hardcodé.
 *
 * Usage :
 *   const images = useProductImages("ecran-geant", FALLBACK_IMAGES);
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
  const { data, isError } = trpc.media.byCategory.useQuery(
    { category: "produits", subcategory },
    {
      staleTime: 5 * 60 * 1000, // 5 min de cache
      retry: 1,
    }
  );

  if (!isError && data && data.length > 0) {
    return data.map((img) => ({
      src: img.url,
      alt: img.alt ?? img.title ?? "",
    }));
  }

  return fallback;
}
