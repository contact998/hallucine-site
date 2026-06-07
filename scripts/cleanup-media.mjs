/**
 * cleanup-media.mjs — Nettoyage de la médiathèque
 *
 *   1. Soft-delete des entrées dont le fichier R2 a disparu (404) → active=false + deletedAt
 *   2. Suppression des objets R2 orphelins (scripts/orphaned-r2-keys.txt) NON référencés
 *      — vérif de référencement faite ici via fs (lecture réelle des sources), pas via grep.
 *      Un orphelin encore cité en dur dans le code est CONSERVÉ (sinon image cassée).
 *
 * Usage (depuis le dossier du site) :
 *   node --env-file=.env.local --import tsx scripts/cleanup-media.mjs --dry-run
 *   node --env-file=.env.local --import tsx scripts/cleanup-media.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { inArray } from "drizzle-orm";
import { db, pool } from "../server/db.ts";
import { mediaLibrary } from "../drizzle/schema.ts";
import { deleteFromR2 } from "../server/r2Upload.ts";

const DRY = process.argv.includes("--dry-run");
const ROOT = join(import.meta.dirname, "..");

// Entrées cassées repérées par optimize-media (R2 404, encore active en DB)
const BROKEN_IDS = [375, 380, 386, 399];

console.log(DRY ? "🔍 DRY-RUN — aucune écriture\n" : "🧹 Nettoyage médiathèque — écriture DB + R2\n");

// ─── 1. Soft-delete des entrées cassées ─────────────────────────────────────
const broken = await db.select().from(mediaLibrary).where(inArray(mediaLibrary.id, BROKEN_IDS));
console.log(`Entrées cassées (${broken.length}) :`);
for (const r of broken) {
  console.log(`  [${r.id}] ${r.category}/${r.subcategory ?? "-"} active=${r.active} ${r.url.slice(-40)}`);
}
if (!DRY && broken.length) {
  await db.update(mediaLibrary)
    .set({ active: false, deletedAt: new Date() })
    .where(inArray(mediaLibrary.id, BROKEN_IDS));
  console.log(`  ✅ ${broken.length} soft-deletées (active=false, deletedAt set)\n`);
} else {
  console.log("");
}

// ─── 2. Suppression des orphelins R2 NON référencés ─────────────────────────
// Construit un "haystack" de toutes les sources pour détecter les URLs en dur.
function walk(dir) {
  let out = [];
  let entries = [];
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    if (e === "node_modules" || e === "dist" || e.startsWith(".")) continue;
    const p = join(dir, e);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) out = out.concat(walk(p));
    else if (/\.(tsx?|mjs|json|md)$/.test(e)) out.push(p);
  }
  return out;
}
const files = [
  ...walk(join(ROOT, "client")),
  ...walk(join(ROOT, "server")),
  ...walk(join(ROOT, "shared")),
];
const haystack = files.map((f) => { try { return readFileSync(f, "utf-8"); } catch { return ""; } }).join("\n");

const keys = readFileSync(join(ROOT, "scripts/orphaned-r2-keys.txt"), "utf-8")
  .split("\n").map((s) => s.trim()).filter(Boolean);

let del = 0, kept = 0, fail = 0;
console.log(`Orphelins R2 (${keys.length}) :`);
for (const k of keys) {
  const base = k.split("/").pop();
  const referenced = haystack.includes(k) || (base && haystack.includes(base));
  if (referenced) { console.log(`  ⏭️  gardé (encore référencé) : ${base}`); kept++; continue; }
  if (DRY) { console.log(`  (dry) supprimerait : ${k}`); del++; continue; }
  try { await deleteFromR2(k); del++; console.log(`  🗑️  supprimé : ${k}`); }
  catch (e) { fail++; console.log(`  ❌ ${k} — ${e.message}`); }
}

console.log(`\n─────────── Résumé ───────────`);
console.log(`  Entrées cassées soft-deletées : ${DRY ? "(dry) " : ""}${broken.length}`);
console.log(`  Orphelins R2 supprimés        : ${DRY ? "(dry) " : ""}${del}`);
console.log(`  Orphelins gardés (référencés) : ${kept}`);
console.log(`  Échecs suppression            : ${fail}`);

await pool.end();
