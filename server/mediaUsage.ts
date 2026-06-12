/**
 * server/mediaUsage.ts
 * « Où une image est utilisée », vue COMPLÈTE pour la médiathèque.
 *
 * Compose deux sources que rien ne relie nativement :
 *   - les emplacements site (media_placements, hors `blog:cover` périmé) — server/placements.ts
 *   - les couvertures d'article réelles (blog_posts.imageUrl, sur la 2e base) — server/blog.ts
 * Le lien fond ↔ couverture se fait par URL (blog_posts stocke l'URL, pas l'asset_id).
 *
 * Sert le filtre utilisé/non utilisé et le détail de la modale Bibliothèque.
 */
import { eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { mediaLibrary } from "../drizzle/schema";
import { getUsedAssetIds as getPlacedAssetIds, getAssetPlacements, type AssetPlacement } from "./placements";
import { getBlogCoverUrls, getBlogArticlesByCoverUrl } from "./blog";

/** Ids des assets du fond servant de couverture d'article (match par URL). */
async function getBlogCoverAssetIds(): Promise<number[]> {
  const urls = await getBlogCoverUrls();
  if (!urls.length) return [];
  const rows = await db.select({ id: mediaLibrary.id }).from(mediaLibrary).where(inArray(mediaLibrary.url, urls));
  return rows.map((r) => r.id);
}

/** Ids « utilisés » = placés sur le site OU couverture d'un article de blog. */
export async function getUsedAssetIds(): Promise<number[]> {
  const [placed, covers] = await Promise.all([getPlacedAssetIds(), getBlogCoverAssetIds()]);
  return Array.from(new Set(placed.concat(covers)));
}

export interface AssetUsage {
  placements: AssetPlacement[];
  blogCovers: { title: string; slug: string }[];
}

/** Détail « Utilisée dans » : emplacements site + articles dont c'est la couverture. */
export async function getAssetUsage(assetId: number): Promise<AssetUsage> {
  const placements = await getAssetPlacements(assetId);
  const [asset] = await db
    .select({ url: mediaLibrary.url })
    .from(mediaLibrary)
    .where(eq(mediaLibrary.id, assetId))
    .limit(1);
  const blogCovers = asset?.url ? await getBlogArticlesByCoverUrl(asset.url) : [];
  return { placements, blogCovers };
}
