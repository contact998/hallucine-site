/**
 * scripts/migrate-placements.mjs
 * ──────────────────────────────────────────────────────────────────────────────
 * Reprise « one-shot » : remplit media_placements (la refonte) à partir de
 * l'ANCIEN modèle, en deux sources :
 *
 *   Source A — pages du site : chaque ligne media_library qui porte un `page`
 *     non nul est rattachée à son emplacement via legacyPageSectionToSlotKey
 *     (shared/slots.ts = source de vérité du mapping). Placement global
 *     (entity_id = NULL), sort_order repris de media_library.sortOrder.
 *
 *   Source B — couvertures de blog (DOUBLE BASE) : blog_posts vit dans une base
 *     MySQL SÉPARÉE (service « MySQL-blog », BLOG_DATABASE_URL), tandis que
 *     media_library + media_placements vivent dans la base PRINCIPALE
 *     (DATABASE_URL). Pour chaque article FR (lang = 'fr') avec une imageUrl non
 *     vide, on cherche dans la base principale l'asset dont l'url === imageUrl.
 *     Trouvé → placement { "blog:cover", entity_id = post.id, sort_order 0 }.
 *     Pas trouvé → on le SIGNALE (couverture orpheline), on ne fabrique rien.
 *
 * Idempotence : avant d'insérer le(s) placement(s) d'un couple (slot_key,
 * entity_id), on supprime les placements existants de ce couple → relançable
 * sans doublonner.
 *
 * Modes :
 *   - défaut = DRY-RUN : aucune écriture, n'imprime qu'un résumé.
 *   - --commit          : applique réellement (writes dans une transaction sur
 *                         la base principale), avec progression.
 *
 * Connexion (calquée sur scripts/fix-blog-slugs.mjs) :
 *   - dotenv charge .env.local puis l'environnement (Railway via `railway run`).
 *   - DATABASE_URL          → base principale (media_library + media_placements).
 *   - BLOG_DATABASE_URL     → base du blog (blog_posts) ; à défaut, fallback sur
 *                             DATABASE_URL (cas local mono-base).
 *   - DATABASE_PUBLIC_URL / BLOG_DATABASE_PUBLIC_URL → si présents, ils
 *     remplacent l'URL privée (réseau privé Railway indisponible hors runtime),
 *     même convention que scripts/prerender.mjs.
 *
 * Le mapping vient de shared/slots.ts (fichier .ts) → lancer via tsx :
 *   railway run npx tsx scripts/migrate-placements.mjs            # DRY-RUN
 *   railway run npx tsx scripts/migrate-placements.mjs --commit   # applique
 *
 * (un import de .ts sous `node` nu échoue ; tsx fait le strip de types, comme
 *  pour prerender.mjs / fix-blog-slugs.mjs / dump-media.mjs.)
 * ──────────────────────────────────────────────────────────────────────────────
 */
import { config } from "dotenv";
import mysql from "mysql2/promise";

// ─── Chargement des variables d'environnement ─────────────────────────────────
// .env.local d'abord (dev local), puis l'environnement courant (Railway).
config({ path: ".env.local" });
config();

// Hors runtime, le réseau privé Railway est indisponible : si une URL publique
// est fournie, elle prime (idem prerender.mjs). Base principale…
if (process.env.DATABASE_PUBLIC_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_PUBLIC_URL;
}
// …et base du blog.
if (process.env.BLOG_DATABASE_PUBLIC_URL) {
  process.env.BLOG_DATABASE_URL = process.env.BLOG_DATABASE_PUBLIC_URL;
}

// blog_posts vit dans la base `MySQL-blog` (BLOG_DATABASE_URL). En local mono-base
// on retombe sur DATABASE_URL (même repli que fix-blog-slugs.mjs).
if (!process.env.BLOG_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.BLOG_DATABASE_URL = process.env.DATABASE_URL;
  console.log("ℹ️  BLOG_DATABASE_URL absent → repli sur DATABASE_URL (mono-base).");
}

const MAIN_URL = process.env.DATABASE_URL;
const BLOG_URL = process.env.BLOG_DATABASE_URL;

if (!MAIN_URL) {
  console.error("❌ DATABASE_URL manquante — base principale requise.");
  process.exit(1);
}
if (!BLOG_URL) {
  console.error("❌ BLOG_DATABASE_URL manquante (et pas de repli DATABASE_URL).");
  process.exit(1);
}

// ─── Arguments ────────────────────────────────────────────────────────────────
const COMMIT = process.argv.includes("--commit");
const MODE = COMMIT ? "COMMIT (écriture)" : "DRY-RUN (lecture seule)";

// ─── Mapping (source de vérité unique) ────────────────────────────────────────
// On importe le helper de shared/slots.ts plutôt que de recopier la table :
// le registre des emplacements ne doit exister qu'à un seul endroit.
const { legacyPageSectionToSlotKey, BLOG_COVER_SLOT } = await import("../shared/slots.ts");

const BLOG_COVER_KEY = BLOG_COVER_SLOT.key; // "blog:cover"

console.log("═".repeat(70));
console.log(`🧩 Reprise media_placements — mode ${MODE}`);
console.log("═".repeat(70));

// ─── Connexions ───────────────────────────────────────────────────────────────
// Base principale (lecture media_library + écriture media_placements).
let main;
try {
  main = await mysql.createConnection(MAIN_URL);
} catch (err) {
  console.error("❌ Connexion base principale échouée :", err.message);
  process.exit(1);
}

// Base du blog (lecture blog_posts uniquement). Si c'est la même URL que la base
// principale (mono-base), on réutilise la connexion ouverte pour ne pas doubler.
const sameDb = BLOG_URL === MAIN_URL;
let blog;
if (sameDb) {
  blog = main;
} else {
  try {
    blog = await mysql.createConnection(BLOG_URL);
  } catch (err) {
    console.error("❌ Connexion base blog échouée :", err.message);
    await main.end();
    process.exit(1);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// SOURCE A — pages du site (media_library.page non nul)
// ──────────────────────────────────────────────────────────────────────────────
// On ne traite que les lignes ACTIVES et non supprimées : la reprise reflète ce
// que le site affiche réellement, pas les archives. (Le placement pourra de toute
// façon être masqué côté lecture via media_library.active / deletedAt.)
const [mediaRows] = await main.execute(
  `SELECT id, url, page, section, sortOrder
     FROM media_library
    WHERE page IS NOT NULL
      AND active = 1
      AND deletedAt IS NULL
    ORDER BY page, section, sortOrder, id`,
);

/** Placements à créer pour la source A : { slotKey, entityId:null, assetId, sortOrder }. */
const placementsA = [];
/** Lignes dont (page, section) ne correspond à AUCUN slot connu → à examiner. */
const unmappedA = [];

for (const row of mediaRows) {
  const slotKey = legacyPageSectionToSlotKey(row.page ?? null, row.section ?? null);
  if (!slotKey) {
    unmappedA.push({
      id: row.id,
      page: row.page,
      section: row.section,
      url: row.url,
    });
    continue;
  }
  placementsA.push({
    slotKey,
    entityId: null,
    assetId: row.id,
    sortOrder: row.sortOrder ?? 0,
  });
}

// Regroupe les couples (page, section) orphelins pour un rapport lisible.
const unmappedGroups = new Map(); // "page|section" → { page, section, count, sampleUrls[] }
for (const u of unmappedA) {
  const key = `${u.page}|${u.section ?? "(NULL)"}`;
  let g = unmappedGroups.get(key);
  if (!g) {
    g = { page: u.page, section: u.section ?? null, count: 0, sampleUrls: [] };
    unmappedGroups.set(key, g);
  }
  g.count++;
  if (g.sampleUrls.length < 3) g.sampleUrls.push(u.url);
}

// ──────────────────────────────────────────────────────────────────────────────
// SOURCE B — couvertures de blog (article FR avec imageUrl) — DOUBLE BASE
// ──────────────────────────────────────────────────────────────────────────────
// On lit les articles FR dans la base du blog… (colonnes légères : surtout pas
// `content`, le payload HTML fait sauter le proxy TCP public — cf. fix-blog-slugs).
const [blogRows] = await blog.execute(
  `SELECT id, imageUrl
     FROM blog_posts
    WHERE lang = 'fr'
      AND imageUrl IS NOT NULL
      AND imageUrl <> ''
    ORDER BY id`,
);

// …puis on résout chaque imageUrl dans le FOND de la base PRINCIPALE.
// On charge l'index url → id une fois (la table média est petite) pour éviter N
// requêtes croisées entre deux bases distinctes.
const [assetRows] = await main.execute(`SELECT id, url FROM media_library`);
const assetIdByUrl = new Map();
for (const a of assetRows) {
  // Première occurrence gagne (url est unique en schéma, garde-fou malgré tout).
  if (!assetIdByUrl.has(a.url)) assetIdByUrl.set(a.url, a.id);
}

/** Placements à créer pour la source B : { slotKey:"blog:cover", entityId:postId, assetId, sortOrder:0 }. */
const placementsB = [];
/** Couvertures FR dont l'URL n'a aucun asset correspondant dans le fond. */
const orphanCovers = [];

for (const post of blogRows) {
  const assetId = assetIdByUrl.get(post.imageUrl);
  if (assetId == null) {
    orphanCovers.push({ postId: post.id, imageUrl: post.imageUrl });
    continue;
  }
  placementsB.push({
    slotKey: BLOG_COVER_KEY,
    entityId: post.id,
    assetId,
    sortOrder: 0,
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// RÉSUMÉ (commun aux deux modes)
// ──────────────────────────────────────────────────────────────────────────────
console.log("\n📊 Source A — pages du site");
console.log("─".repeat(70));
console.log(`  Lignes media_library candidates (page non nul, actives) : ${mediaRows.length}`);
console.log(`  ✅ Placements à créer (mappés)                          : ${placementsA.length}`);
console.log(`  ⚠️  Lignes non mappées (page,section inconnus)          : ${unmappedA.length}`);
if (unmappedGroups.size > 0) {
  console.log("\n  Couples (page, section) NON mappés — à examiner :");
  for (const g of unmappedGroups.values()) {
    console.log(`    • ${g.page} / ${g.section ?? "(NULL)"}  — ${g.count} ligne(s)`);
    for (const url of g.sampleUrls) console.log(`        ex. ${url}`);
  }
}

console.log("\n📊 Source B — couvertures de blog (FR)");
console.log("─".repeat(70));
console.log(`  Articles FR avec imageUrl                  : ${blogRows.length}`);
console.log(`  ✅ Couvertures à créer (asset trouvé)       : ${placementsB.length}`);
console.log(`  ⚠️  Couvertures orphelines (aucun asset)    : ${orphanCovers.length}`);
if (orphanCovers.length > 0) {
  console.log("\n  URLs de couverture sans asset dans le fond — à examiner :");
  for (const o of orphanCovers) {
    console.log(`    • article #${o.postId} → ${o.imageUrl}`);
  }
}

const totalToCreate = placementsA.length + placementsB.length;
console.log("\n" + "═".repeat(70));
console.log(`🧮 Total placements qui seraient créés : ${totalToCreate}  (A: ${placementsA.length}, B: ${placementsB.length})`);
console.log("═".repeat(70));

// ─── DRY-RUN : on s'arrête ici ────────────────────────────────────────────────
if (!COMMIT) {
  if (!sameDb) await blog.end();
  await main.end();
  console.log("\n🟡 DRY-RUN terminé — aucune écriture. Relancer avec --commit pour appliquer.");
  process.exit(0);
}

// ──────────────────────────────────────────────────────────────────────────────
// COMMIT — écriture transactionnelle sur la base PRINCIPALE
// ──────────────────────────────────────────────────────────────────────────────
// media_placements vit dans la base principale : toutes les écritures passent par
// `main`, dans une seule transaction (tout ou rien). La lecture du blog est déjà
// faite ; la connexion blog n'écrit jamais.
console.log("\n🚀 Application des écritures (transaction sur la base principale)…\n");

// Idempotence : on dédoublonne les couples (slot_key, entity_id) à purger AVANT
// insertion. entity_id = NULL pour la source A (un même slot global est purgé une
// seule fois alors qu'il reçoit plusieurs lignes de galerie). entity_id = postId
// pour la source B.
const allPlacements = [...placementsA, ...placementsB];

/** clé de couple pour le dédoublonnage des purges (NULL → sentinelle). */
const pairKey = (slotKey, entityId) => `${slotKey}|${entityId == null ? "∅" : entityId}`;
const pairsToPurge = new Map(); // pairKey → { slotKey, entityId }
for (const p of allPlacements) {
  const key = pairKey(p.slotKey, p.entityId);
  if (!pairsToPurge.has(key)) pairsToPurge.set(key, { slotKey: p.slotKey, entityId: p.entityId });
}

let purged = 0;
let inserted = 0;

try {
  await main.beginTransaction();

  // 1) Purge des placements existants pour chaque couple concerné (idempotence).
  for (const { slotKey, entityId } of pairsToPurge.values()) {
    // `<=>` = égalité null-safe : matche aussi entity_id IS NULL (source A).
    const [res] = await main.execute(
      `DELETE FROM media_placements WHERE slot_key = ? AND entity_id <=> ?`,
      [slotKey, entityId],
    );
    purged += res.affectedRows ?? 0;
  }
  console.log(`  🧹 ${purged} placement(s) existant(s) purgé(s) sur ${pairsToPurge.size} couple(s) (slot, entité).`);

  // 2) Insertion des nouveaux placements (ordre source A puis source B).
  for (const p of allPlacements) {
    await main.execute(
      `INSERT INTO media_placements (slot_key, entity_id, asset_id, sort_order)
       VALUES (?, ?, ?, ?)`,
      [p.slotKey, p.entityId, p.assetId, p.sortOrder],
    );
    inserted++;
    if (inserted % 25 === 0 || inserted === allPlacements.length) {
      console.log(`  … ${inserted}/${allPlacements.length} insérés`);
    }
  }

  await main.commit();
  console.log("\n✅ Transaction validée (COMMIT).");
} catch (err) {
  await main.rollback();
  console.error("\n🛑 Erreur pendant l'écriture — ROLLBACK effectué :", err.message);
  if (!sameDb) await blog.end();
  await main.end();
  process.exit(1);
}

// ─── Récapitulatif final ──────────────────────────────────────────────────────
console.log("\n" + "═".repeat(70));
console.log("📊 Récapitulatif COMMIT");
console.log("─".repeat(70));
console.log(`  🧹 Placements purgés (idempotence) : ${purged}`);
console.log(`  ✅ Placements insérés              : ${inserted}  (A: ${placementsA.length}, B: ${placementsB.length})`);
console.log(`  ⚠️  Couples (page,section) non mappés : ${unmappedGroups.size}`);
console.log(`  ⚠️  Couvertures blog orphelines       : ${orphanCovers.length}`);
console.log("═".repeat(70));

if (!sameDb) await blog.end();
await main.end();
console.log("\n✅ Reprise terminée.");
process.exit(0);
