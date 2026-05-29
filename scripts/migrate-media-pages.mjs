#!/usr/bin/env node
/**
 * scripts/migrate-media-pages.mjs
 * Backfill des colonnes `page` et `section` dans media_library
 * à partir de la paire (category, subcategory) existante.
 *
 * Usage :
 *   node scripts/migrate-media-pages.mjs --dry-run          ← vérification
 *   node scripts/migrate-media-pages.mjs                    ← backfill réel
 *   node scripts/migrate-media-pages.mjs --audit-hardcoded  ← audit URLs codées en dur
 *
 * Pré-requis : .env.local à la racine avec DATABASE_URL
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import mysql from "mysql2/promise";

// ─── Charger .env.local ───────────────────────────────────────────────────────

const envPath = ".env.local";
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] = process.env[key] ?? val;
  }
  console.log("✅ .env.local chargé");
} else {
  console.warn("⚠️  Pas de .env.local — variables système utilisées");
}

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL manquante dans .env.local");
  process.exit(1);
}

// ─── Arguments ────────────────────────────────────────────────────────────────

const dryRun = process.argv.includes("--dry-run");
const auditHardcoded = process.argv.includes("--audit-hardcoded");

if (dryRun) console.log("🔍 Mode DRY-RUN — aucune écriture en base\n");
if (auditHardcoded) console.log("🔍 Mode AUDIT HARDCODED — lecture seule\n");

// ─── Mapping (category, subcategory) → (page, section) ───────────────────────
// subcategory NULL est représenté par la sentinelle __NULL__
// Les règles "toute subcategory" sont identifiées par la sentinelle __ANY__

const NULL_SENTINEL = "__NULL__";
const ANY_SENTINEL = "__ANY__";

/**
 * Chaque entrée : [category, subcategory_or_sentinel, page, section]
 * Ordre d'évaluation : du plus spécifique au plus général (les __ANY__ en dernier).
 */
const MAPPING = [
  // realisations → toute subcategory (y compris NULL)
  ["realisations", ANY_SENTINEL,          "accueil",          "realisations"],

  // produits / home
  ["produits",     "home",                "accueil",          "produits"],

  // ui / story
  ["ui",           "story",               "accueil",          "histoire"],

  // ui / cinema
  ["ui",           "cinema",              "accueil",          "cinema"],

  // ui / technology
  ["ui",           "technology",          "accueil",          "techno"],

  // ui / histoire
  ["ui",           "histoire",            "histoire",         "galerie"],

  // ui / mode-emploi
  ["ui",           "mode-emploi",         "mode-emploi",      "etapes"],

  // galerie → toute subcategory (y compris NULL)
  ["galerie",      ANY_SENTINEL,          "galerie",          "principale"],

  // produits / ecran-geant
  ["produits",     "ecran-geant",         "ecran-geant",      "galerie"],

  // produits / ecran-etanche
  ["produits",     "ecran-etanche",       "ecran-etanche",    "galerie"],

  // produits / ecran-economique
  ["produits",     "ecran-economique",    "ecran-economique", "galerie"],

  // produits / ecrans-led
  ["produits",     "ecrans-led",          "ecrans-led",       "galerie"],

  // produits / arches-gonflables
  ["produits",     "arches-gonflables",   "arches",           "galerie"],

  // produits / mobilier
  ["produits",     "mobilier",            "mobilier",         "galerie"],

  // produits / accessoires
  ["produits",     "accessoires",         "accessoires",      "galerie"],

  // produits / tente-x
  ["produits",     "tente-x",             "tente-x",          "galerie"],

  // produits / tente-n
  ["produits",     "tente-n",             "tente-n",          "galerie"],

  // produits / tente-v
  ["produits",     "tente-v",             "tente-v",          "galerie"],

  // produits / tente-araignee
  ["produits",     "tente-araignee",      "tente-araignee",   "galerie"],
];

/**
 * Résout (page, section) pour une ligne donnée.
 * Retourne null si aucune règle ne correspond (→ à ranger).
 */
function resolve(category, subcategory) {
  const subKey = subcategory === null ? NULL_SENTINEL : subcategory;
  for (const [cat, sub, page, section] of MAPPING) {
    if (cat !== category) continue;
    if (sub === ANY_SENTINEL) return { page, section };
    if (sub === subKey) return { page, section };
  }
  return null;
}

// ─── MODE AUDIT HARDCODED ─────────────────────────────────────────────────────

if (auditHardcoded) {
  const URL_PATTERN = /https:\/\/pub-[a-zA-Z0-9]+\.r2\.dev\/[^\s"'`>)]+/g;

  const pagesDir = "client/src/pages";
  const pageFiles = readdirSync(pagesDir)
    .filter(f => f.endsWith(".tsx"))
    .map(f => join(pagesDir, f));

  // Connexion DB
  console.log("🔌 Connexion à MySQL...");
  let db;
  try {
    db = await mysql.createConnection({ uri: process.env.DATABASE_URL });
    console.log("✅ Connecté\n");
  } catch (err) {
    console.error("❌ Connexion échouée :", err.message);
    process.exit(1);
  }

  // Charger toutes les URLs de la base en mémoire (lecture seule)
  const [rows] = await db.execute("SELECT url FROM media_library");
  const dbUrls = new Set(rows.map(r => r.url));
  await db.end();

  console.log(`📊 ${dbUrls.size} URLs dans media_library\n`);
  console.log("━".repeat(60));

  let totalMissing = 0;
  let totalFound = 0;

  for (const filePath of pageFiles) {
    const content = readFileSync(filePath, "utf-8");
    const matches = [...content.matchAll(URL_PATTERN)].map(m => m[0]);
    // Dédupliquer par fichier
    const unique = [...new Set(matches)];
    if (!unique.length) continue;

    const missing = unique.filter(u => !dbUrls.has(u));
    const found   = unique.filter(u =>  dbUrls.has(u));

    totalMissing += missing.length;
    totalFound   += found.length;

    const fname = filePath.split("/").pop();

    if (missing.length === 0) {
      console.log(`✅ ${fname} — ${found.length} URL(s) en base, 0 manquante`);
    } else {
      console.log(`\n⚠️  ${fname} — ${found.length} en base, ${missing.length} ABSENTE(S) :`);
      for (const url of missing) {
        console.log(`   ❌  ${url}`);
      }
    }
  }

  console.log("\n" + "━".repeat(60));
  console.log(`📊 Résumé audit : ${totalFound} URLs déjà en base, ${totalMissing} absentes (à insérer en Phase 2)`);
  process.exit(0);
}

// ─── MODE BACKFILL ────────────────────────────────────────────────────────────

// Connexion DB
console.log("🔌 Connexion à MySQL...");
let db;
try {
  db = await mysql.createConnection({ uri: process.env.DATABASE_URL });
  console.log("✅ Connecté\n");
} catch (err) {
  console.error("❌ Connexion échouée :", err.message);
  process.exit(1);
}

// Lire toutes les lignes distinctes (category, subcategory) avec leur count
let distinctRows;
try {
  [distinctRows] = await db.execute(
    "SELECT category, subcategory, COUNT(*) as cnt FROM media_library GROUP BY category, subcategory ORDER BY category, subcategory"
  );
} catch (err) {
  console.error("❌ Lecture media_library échouée :", err.message);
  await db.end();
  process.exit(1);
}

// Calculer ce qui va être fait
const plan = [];
for (const row of distinctRows) {
  const resolved = resolve(row.category, row.subcategory);
  plan.push({
    category:    row.category,
    subcategory: row.subcategory,
    count:       Number(row.cnt),
    page:        resolved?.page    ?? null,
    section:     resolved?.section ?? null,
  });
}

const covered   = plan.filter(p => p.page !== null);
const uncovered = plan.filter(p => p.page === null);

console.log("📋 Plan de backfill :");
console.log("─".repeat(60));
for (const p of covered) {
  const subLabel = p.subcategory ?? "(NULL)";
  console.log(`  [${p.category} / ${subLabel}] → ${p.page} / ${p.section}  (${p.count} ligne(s))`);
}
if (uncovered.length > 0) {
  console.log("\n⚠️  Lignes NON couvertes (resteront page=NULL) :");
  for (const p of uncovered) {
    const subLabel = p.subcategory ?? "(NULL)";
    console.log(`  [${p.category} / ${subLabel}]  (${p.count} ligne(s))`);
  }
}

const totalToUpdate = covered.reduce((s, p) => s + p.count, 0);
const totalNull     = uncovered.reduce((s, p) => s + p.count, 0);
console.log(`\n📊 ${totalToUpdate} lignes seront mises à jour, ${totalNull} resteront page=NULL`);

if (dryRun) {
  await db.end();
  console.log("\n🔍 Dry-run terminé. Relancez sans --dry-run pour appliquer.");
  process.exit(0);
}

// ─── Appliquer les UPDATEs ────────────────────────────────────────────────────

console.log("\n🚀 Application des UPDATEs...\n");

let updated = 0;
let errors  = 0;

for (const p of covered) {
  try {
    const [result] = await db.execute(
      "UPDATE media_library SET page = ?, section = ? WHERE category = ? AND (subcategory <=> ?)",
      [p.page, p.section, p.category, p.subcategory]
    );
    const affectedRows = result.affectedRows;
    updated += affectedRows;
    const subLabel = p.subcategory ?? "(NULL)";
    console.log(`  ✅ ${p.category} / ${subLabel} → ${p.page} / ${p.section}  (${affectedRows} lignes)`);
  } catch (err) {
    errors++;
    const subLabel = p.subcategory ?? "(NULL)";
    console.error(`  ❌ ${p.category} / ${subLabel} — ${err.message}`);
    await db.end();
    console.error("\n🛑 BLOCKED — arrêt sur erreur DB.");
    process.exit(1);
  }
}

await db.end();

// ─── Récapitulatif final ──────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("📊 Récapitulatif backfill :");
console.log("─".repeat(60));
for (const p of covered) {
  console.log(`  ${p.page} / ${p.section}`);
}
console.log(`\n  ✅ ${updated} lignes mises à jour`);
console.log(`  ⚠️  ${totalNull} lignes restées page=NULL`);
if (uncovered.length > 0) {
  console.log("\n  Détail des lignes NULL :");
  for (const p of uncovered) {
    const subLabel = p.subcategory ?? "(NULL)";
    console.log(`    [${p.category} / ${subLabel}]  (${p.count} ligne(s))`);
  }
}
console.log("\n✅ Backfill terminé.");
