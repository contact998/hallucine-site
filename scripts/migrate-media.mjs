#!/usr/bin/env node
/**
 * scripts/migrate-media.mjs
 * Phase 2 — Migration des URLs hardcodées vers media_library.
 *
 * Ce script scanne le code source, extrait toutes les URLs d'images
 * et les insère dans la table media_library avec la bonne catégorie.
 * Il ne modifie AUCUN fichier de code — les pages continuent de fonctionner.
 *
 * Usage :
 *   node scripts/migrate-media.mjs --dry-run   ← tester sans écrire
 *   node scripts/migrate-media.mjs             ← migration réelle
 *
 * Pré-requis : .env.local à la racine avec DATABASE_URL (URL publique Railway)
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
if (dryRun) console.log("🔍 Mode DRY-RUN — aucune écriture en base\n");

// ─── Mapping fichier → catégorie ─────────────────────────────────────────────

const FILE_MAPPING = {
  "RealisationsSection": ["realisations", null],
  "Galerie.tsx":         ["galerie", null],
  "GalerieVideo":        ["galerie", "video"],
  "EcranGeant":          ["produits", "ecran-geant"],
  "EcranEtanche":        ["produits", "ecran-etanche"],
  "EcranEconomique":     ["produits", "ecran-economique"],
  "EcransLED":           ["produits", "ecrans-led"],
  "Ecrans.tsx":          ["produits", "ecrans"],
  "TentesX":             ["produits", "tente-x"],
  "TentesN":             ["produits", "tente-n"],
  "TentesV":             ["produits", "tente-v"],
  "TentesAraignees":     ["produits", "tente-araignee"],
  "Tentes.tsx":          ["produits", "tentes"],
  "ArchesGonflables":    ["produits", "arches-gonflables"],
  "Accessoires":         ["produits", "accessoires"],
  "Mobilier":            ["produits", "mobilier"],
  "Comparaison":         ["produits", "comparaison"],
  "Home.tsx":            ["produits", "home"],
  "HeroSection":         ["produits", "home"],
  "ProductsSection":     ["produits", "home"],
  "StorySection":        ["ui", "story"],
  "TechnologySection":   ["ui", "technology"],
  "RelatedProducts":     ["ui", "related"],
  "Navbar":              ["ui", "navbar"],
  "Footer":              ["ui", "footer"],
  "CinemaRideau":        ["ui", "cinema"],
  "CinemaSuccessAnimation": ["ui", "cinema"],
  "FilmCountdown":       ["ui", "cinema"],
  "APropos":             ["ui", "a-propos"],
  "Histoire":            ["ui", "histoire"],
  "Contact":             ["ui", "contact"],
  "Blog.tsx":            ["blog", null],
  "ModeEmploi":          ["ui", "mode-emploi"],
  "DevenirDistributeur": ["ui", "distributeur"],
  "structuredData":      ["og", null],
  "useDocumentMeta":     ["og", null],
  "entry-server":        ["og", null],
};

// ─── Scanner les fichiers ─────────────────────────────────────────────────────

const URL_PATTERN = /https:\/\/(?:pub-dc19082f8e054e8b8a192d8d29df2aa0\.r2\.dev|d2xsxph8kpxj0f\.cloudfront\.net)[^\s"'`>]+/g;
const ALT_PATTERN = /alt:\s*["']([^"']+)["']/;

function scanDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...scanDir(full));
    } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
      results.push(full);
    }
  }
  return results;
}

const files = scanDir("client/src");
const seen = new Set();
const items = [];

for (const filePath of files) {
  const content = readFileSync(filePath, "utf-8");
  const fname = filePath.split("/").pop();
  const urls = [...content.matchAll(URL_PATTERN)].map(m => m[0]);
  if (!urls.length) continue;

  let cat = "autre", subcat = null;
  for (const [key, [c, s]] of Object.entries(FILE_MAPPING)) {
    if (fname.includes(key.replace(".tsx", "").replace(".ts", ""))) {
      cat = c; subcat = s; break;
    }
  }

  for (const url of urls) {
    if (seen.has(url)) continue;
    seen.add(url);

    const idx = content.indexOf(url);
    const context = content.slice(Math.max(0, idx - 200), idx + 200);
    const altMatch = ALT_PATTERN.exec(context);
    const alt = altMatch ? altMatch[1] : "";
    const title = alt || url.split("/").pop().replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    const source = url.includes("cloudfront") ? "external" : "migration";
    const filename = url.split("/").pop();

    items.push({ url, filename, alt, title, category: cat, subcategory: subcat, source });
  }
}

// ─── Résumé avant insertion ───────────────────────────────────────────────────

console.log(`\n📊 URLs trouvées : ${items.length}`);
console.log(`   R2 (migration) : ${items.filter(i => i.source === "migration").length}`);
console.log(`   CloudFront (external) : ${items.filter(i => i.source === "external").length}`);
console.log("\n📂 Par catégorie :");
const cats = {};
for (const i of items) cats[i.category] = (cats[i.category] || 0) + 1;
for (const [c, n] of Object.entries(cats)) console.log(`   ${c}: ${n}`);

if (dryRun) {
  console.log("\n🔍 Dry-run terminé. Relancez sans --dry-run pour insérer en base.");
  process.exit(0);
}

// ─── Connexion DB et insertion ────────────────────────────────────────────────

console.log("\n🔌 Connexion à MySQL...");
const db = await mysql.createConnection({ uri: process.env.DATABASE_URL });
console.log("✅ Connecté\n");

let inserted = 0, skipped = 0, errors = 0;

for (const item of items) {
  try {
    // Vérifier si déjà en base
    const [existing] = await db.execute(
      "SELECT id FROM media_library WHERE url = ? LIMIT 1",
      [item.url]
    );
    if (existing.length > 0) {
      console.log(`  ⏭️  [SKIP] ${item.filename}`);
      skipped++;
      continue;
    }

    await db.execute(
      `INSERT INTO media_library
         (url, filename, alt, title, category, subcategory, source, active, usageCount, sortOrder, mimeType)
       VALUES (?, ?, ?, ?, ?, ?, ?, true, 0, 0, ?)`,
      [
        item.url,
        item.filename,
        item.alt || null,
        item.title,
        item.category,
        item.subcategory || null,
        item.source,
        item.url.endsWith(".webp") ? "image/webp"
          : item.url.endsWith(".png") ? "image/png"
          : "image/jpeg",
      ]
    );

    console.log(`  ✅ [${item.category}${item.subcategory ? "/" + item.subcategory : ""}] ${item.filename}`);
    inserted++;

  } catch (err) {
    console.error(`  ❌ ${item.filename} — ${err.message}`);
    errors++;
  }
}

await db.end();

// ─── Résumé final ─────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`📊 Migration terminée : ${inserted} insérées, ${skipped} ignorées, ${errors} erreurs`);
console.log("\n✅ Les pages du site continuent de fonctionner normalement.");
console.log("   Les URLs sont maintenant référencées en DB — prêtes pour la Phase 3.");
