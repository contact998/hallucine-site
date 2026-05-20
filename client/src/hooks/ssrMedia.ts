/**
 * client/src/hooks/ssrMedia.ts
 * Lecture des images « bakées » au build par scripts/prerender.mjs.
 *
 * Le prerender interroge la DB et fige les vraies images dans :
 *   - globalThis.__SSR_MEDIA__  (pendant renderToString)
 *   - window.__SSR_MEDIA__      (injecté dans le HTML, lu à l'hydratation)
 *
 * Conséquence : le HTML pré-rendu ET le premier rendu client contiennent
 * déjà les vraies images de la DB → aucun flash, aucune désync d'hydratation.
 *
 * En dev local (pas de prerender), __SSR_MEDIA__ est absent : les hooks
 * retombent sur leur fallback hardcodé + revalidation tRPC habituelle.
 */
import type { MediaCategory } from "../../../drizzle/schema";

/** Forme minimale bakée — seuls les champs réellement lus par les pages */
export interface BakedMedia {
  url: string;
  alt: string | null;
  title: string | null;
  subcategory: string | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __SSR_MEDIA__: Record<string, BakedMedia[]> | undefined;
  interface Window {
    __SSR_MEDIA__?: Record<string, BakedMedia[]>;
  }
}

/** Clé d'indexation — doit rester identique côté scripts/prerender.mjs */
export function mediaKey(category: MediaCategory, subcategory?: string | null): string {
  return `${category}|${subcategory ?? ""}`;
}

/**
 * Retourne les images bakées au build pour une catégorie/sous-catégorie,
 * ou `null` si rien n'a été baké (dev local, catégorie sans image en DB).
 */
export function getBakedMedia(
  category: MediaCategory,
  subcategory?: string | null
): BakedMedia[] | null {
  const store =
    (typeof window !== "undefined" ? window.__SSR_MEDIA__ : undefined) ??
    (typeof globalThis !== "undefined" ? globalThis.__SSR_MEDIA__ : undefined);
  if (!store) return null;

  const rows = store[mediaKey(category, subcategory)];
  return rows && rows.length > 0 ? rows : null;
}
