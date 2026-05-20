/**
 * dump-media.mjs — Fige la médiathèque dans scripts/media-cache.json
 *
 * Le build Railway n'a pas accès à la base (réseau privé indisponible au
 * build). Ce script, lancé en local, exporte les images des catégories
 * publiques dans un fichier JSON que le prerender lit au build pour le bake.
 *
 * À relancer après toute modification d'images, puis commit + push :
 *   node --env-file=.env.local --import tsx scripts/dump-media.mjs
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { inArray } from "drizzle-orm";
import { db, pool } from "../server/db.ts";
import { mediaLibrary } from "../drizzle/schema.ts";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "media-cache.json");
const CATEGORIES = ["produits", "galerie", "realisations"];

const rows = (
  await db.select().from(mediaLibrary).where(inArray(mediaLibrary.category, CATEGORIES))
).filter((r) => r.active);

// Clé "categorie|souscategorie" — identique à client/src/hooks/ssrMedia.ts
const cache = {};
for (const r of rows) {
  const sub = r.category === "produits" ? (r.subcategory ?? "") : "";
  const key = `${r.category}|${sub}`;
  (cache[key] ??= []).push({
    url:         r.url,
    alt:         r.alt ?? null,
    title:       r.title ?? null,
    subcategory: r.subcategory ?? null,
    width:       r.width ?? null,
    height:      r.height ?? null,
  });
}

writeFileSync(OUT, JSON.stringify(cache));
console.log(`${rows.length} image(s) → scripts/media-cache.json (${Object.keys(cache).length} groupes)`);
await pool.end();
