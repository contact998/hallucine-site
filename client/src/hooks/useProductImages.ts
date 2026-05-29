/**
 * client/src/hooks/useProductImages.ts
 * Hook partagé pour charger les images d'une sous-catégorie produit depuis media_library.
 *
 * En production : les images sont figées au build par scripts/prerender.mjs
 * (lecture DB → window.__SSR_MEDIA__). Elles sont donc présentes dans le HTML
 * pré-rendu ET au premier rendu client → aucun flash, aucune requête réseau.
 *
 * En dev local (pas de prerender) : fallback hardcodé affiché immédiatement
 * via `initialData`, puis revalidation tRPC en arrière-plan.
 */
import { trpc } from "@/lib/trpc";
import { getBakedMedia } from "./ssrMedia";

export interface ProductImage {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
}

export function useProductImages(
  subcategory: string,
  fallback: ProductImage[]
): ProductImage[] {
  const baked = getBakedMedia("produits", subcategory);

  const { data } = trpc.media.byCategory.useQuery(
    { category: "produits", subcategory },
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
            title:       img.alt,
            tags:        null,
            filesize:    null,
            width:       null,
            height:      null,
            mimeType:    null,
            category:    "produits" as const,
            subcategory,
            page:        null,
            section:     null,
            sortOrder:   0,
            active:      true,
            source:      "migration" as const,
            uploadedBy:  null,
            usageCount:  0,
            deletedAt:   null,
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
      src: img.url, alt: img.alt ?? img.title ?? "",
      width: img.width, height: img.height,
    }));
  }

  if (data && data.length > 0) {
    return data.map((img) => ({
      src: img.url,
      alt: img.alt ?? img.title ?? "",
      width: img.width ?? null,
      height: img.height ?? null,
    }));
  }

  return fallback;
}
