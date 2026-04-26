#!/usr/bin/env node
/**
 * optimize-images.mjs
 *
 * Automatisation des images responsives pour le site Hallucine.
 *
 * Ce script :
 * 1. Scanne tous les fichiers TSX/JSX du dossier client/src/
 * 2. Détecte les balises <img> avec src="https://files.manuscdn.com/..." sans srcSet
 * 3. Pour chaque image non encore optimisée :
 *    a. Télécharge l'image originale
 *    b. Génère des variantes WebP (400w, 800w, 1200w) avec sharp
 *    c. Uploade les variantes sur le CDN Manus via manus-upload-file --webdev
 *    d. Met à jour le code source avec srcSet + sizes
 * 4. Sauvegarde un cache JSON pour éviter les re-uploads
 *
 * Usage :
 *   node scripts/optimize-images.mjs           # Traite les nouvelles images
 *   node scripts/optimize-images.mjs --dry-run # Affiche sans modifier
 *   node scripts/optimize-images.mjs --force   # Re-traite toutes les images
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { tmpdir } from "os";
import { randomBytes } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC_DIR = join(ROOT, "client", "src");
const CACHE_FILE = join(__dirname, "image-cache.json");
const TMP_DIR = join(tmpdir(), "hallucine-img-opt");

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");

// Tailles de variantes à générer (largeur en px)
const VARIANTS = [400, 800, 1200];

// Regex pour détecter les images manuscdn sans srcSet
const IMG_REGEX = /<img\s[^>]*src=["'`](https:\/\/files\.manuscdn\.com\/[^"'`]+)["'`][^>]*>/gms;
const SRCSET_CHECK = /srcSet|srcset/;

// ─── Cache ────────────────────────────────────────────────────────────────────

function loadCache() {
  if (existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(readFileSync(CACHE_FILE, "utf8"));
    } catch {
      return {};
    }
  }
  return {};
}

function saveCache(cache) {
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function extractImageId(url) {
  // Extrait le nom du fichier sans extension depuis l'URL manuscdn
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.replace(/\.[^.]+$/, ""); // retire l'extension
}

async function downloadImage(url, destPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} pour ${url}`);
  const fileStream = createWriteStream(destPath);
  await pipeline(response.body, fileStream);
}

function generateVariants(inputPath, imageId, outputDir) {
  const variants = [];
  for (const width of VARIANTS) {
    const outputPath = join(outputDir, `${imageId}_${width}w.webp`);
    try {
      // Utilise sharp via npx pour le redimensionnement
      execSync(
        `node -e "
          import('sharp').then(({default: sharp}) => {
            sharp('${inputPath}')
              .resize(${width}, null, { withoutEnlargement: true })
              .webp({ quality: 82 })
              .toFile('${outputPath}')
              .then(() => process.exit(0))
              .catch(e => { console.error(e); process.exit(1); });
          });
        "`,
        { stdio: "pipe" }
      );
      variants.push({ width, path: outputPath });
    } catch (err) {
      console.warn(`  ⚠ Variante ${width}w échouée pour ${imageId}: ${err.message}`);
    }
  }
  return variants;
}

const CDN_BASE = "https://d2xsxph8kpxj0f.cloudfront.net";

function uploadVariant(filePath) {
  try {
    const result = execSync(`manus-upload-file --webdev "${filePath}"`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    // L'outil retourne "Storage Path: /manus-storage/xxx.webp"
    // On construit l'URL CloudFront publique depuis ce chemin
    const storagePath = result
      .split("\n")
      .map(l => l.trim())
      .find(l => l.startsWith("Storage Path:"));
    if (storagePath) {
      const key = storagePath.replace("Storage Path:", "").trim();
      return `${CDN_BASE}${key}`;
    }
    // Fallback : chercher une URL https directe
    const url = result.trim().split("\n").find(line => line.startsWith("https://"));
    return url || null;
  } catch (err) {
    console.warn(`  ⚠ Upload échoué pour ${filePath}: ${err.message}`);
    return null;
  }
}

// ─── Scan des fichiers source ─────────────────────────────────────────────────

function scanSourceFiles() {
  const results = []; // { file, originalUrl, imageId, imgTag, lineNum }

  function scanDir(dir) {
    const entries = execSync(`find "${dir}" -name "*.tsx" -o -name "*.jsx" -o -name "*.ts"`, {
      encoding: "utf8",
    })
      .trim()
      .split("\n")
      .filter(Boolean);

    for (const file of entries) {
      const content = readFileSync(file, "utf8");
      let match;
      IMG_REGEX.lastIndex = 0;

      while ((match = IMG_REGEX.exec(content)) !== null) {
        const imgTag = match[0];
        const url = match[1];

        // Ignorer si srcSet est déjà présent dans la balise
        if (SRCSET_CHECK.test(imgTag)) continue;

        // Ignorer les images qui ne sont pas des photos (logos, icônes)
        if (url.includes(".svg")) continue;

        const imageId = extractImageId(url);
        const lineNum = content.substring(0, match.index).split("\n").length;

        results.push({ file, originalUrl: url, imageId, imgTag, lineNum });
      }
    }
  }

  scanDir(SRC_DIR);
  return results;
}

// ─── Mise à jour du code source ───────────────────────────────────────────────

function buildSrcSet(variants) {
  return variants
    .filter(v => v.cdnUrl)
    .map(v => `${v.cdnUrl} ${v.width}w`)
    .join(", ");
}

function buildSizes(imgTag) {
  // Détermine les sizes selon le contexte de l'image
  if (imgTag.includes("object-cover") && imgTag.includes("w-full")) {
    if (imgTag.includes("grid-cols") || imgTag.includes("col-span")) {
      return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px";
    }
    return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px";
  }
  return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px";
}

function patchImageTag(imgTag, srcSet, sizes, newSrc) {
  // Remplace le src par la version 800w (ou la plus grande disponible)
  let patched = imgTag.replace(
    /src=["'`](https:\/\/files\.manuscdn\.com\/[^"'`]+)["'`]/,
    `src="${newSrc}"`
  );

  // Ajoute srcSet et sizes avant la fermeture />
  patched = patched.replace(
    /(\s*\/>|>)$/,
    ` srcSet="${srcSet}" sizes="${sizes}"$1`
  );

  return patched;
}

function updateSourceFile(file, patches) {
  let content = readFileSync(file, "utf8");

  for (const { originalTag, patchedTag } of patches) {
    if (content.includes(originalTag)) {
      content = content.replace(originalTag, patchedTag);
    }
  }

  writeFileSync(file, content, "utf8");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔍 Scan des images non optimisées...");

  const cache = loadCache();
  const found = scanSourceFiles();

  if (found.length === 0) {
    console.log("✅ Toutes les images sont déjà optimisées.");
    return;
  }

  // Dédupliquer par imageId
  const unique = new Map();
  for (const item of found) {
    if (!unique.has(item.imageId)) {
      unique.set(item.imageId, item);
    }
  }

  // Filtrer selon le cache (sauf --force)
  const toProcess = FORCE
    ? [...unique.values()]
    : [...unique.values()].filter(item => !cache[item.imageId]);

  if (toProcess.length === 0) {
    console.log(`✅ Aucune nouvelle image à traiter (${unique.size} déjà en cache).`);
    console.log("   Utilisez --force pour re-traiter toutes les images.");
    return;
  }

  console.log(`📸 ${toProcess.length} image(s) à optimiser :`);
  toProcess.forEach(item => console.log(`   - ${item.imageId} (${item.file.replace(ROOT, "")})`));

  if (DRY_RUN) {
    console.log("\n🔵 Mode --dry-run : aucune modification effectuée.");
    return;
  }

  // Créer le dossier temporaire
  mkdirSync(TMP_DIR, { recursive: true });

  let processed = 0;

  for (const item of toProcess) {
    const { imageId, originalUrl } = item;
    console.log(`\n⚙ Traitement de ${imageId}...`);

    try {
      // 1. Télécharger l'image originale
      const ext = originalUrl.split(".").pop().split("?")[0] || "webp";
      const tmpInput = join(TMP_DIR, `${imageId}_orig.${ext}`);
      console.log(`  ↓ Téléchargement...`);
      await downloadImage(originalUrl, tmpInput);

      // 2. Générer les variantes WebP
      console.log(`  🔧 Génération des variantes WebP...`);
      const variantFiles = generateVariants(tmpInput, imageId, TMP_DIR);

      if (variantFiles.length === 0) {
        console.warn(`  ⚠ Aucune variante générée pour ${imageId}, ignoré.`);
        continue;
      }

      // 3. Uploader les variantes
      console.log(`  ↑ Upload sur CDN Manus...`);
      const variantsWithUrls = variantFiles.map(v => {
        const cdnUrl = uploadVariant(v.path);
        console.log(`    ${v.width}w → ${cdnUrl || "ÉCHEC"}`);
        return { ...v, cdnUrl };
      });

      const successfulVariants = variantsWithUrls.filter(v => v.cdnUrl);
      if (successfulVariants.length === 0) {
        console.warn(`  ⚠ Tous les uploads ont échoué pour ${imageId}.`);
        continue;
      }

      // 4. Sauvegarder dans le cache
      cache[imageId] = {
        originalUrl,
        variants: successfulVariants.map(v => ({ width: v.width, cdnUrl: v.cdnUrl })),
        processedAt: new Date().toISOString(),
      };
      saveCache(cache);

      processed++;
    } catch (err) {
      console.error(`  ✗ Erreur pour ${imageId}: ${err.message}`);
    }
  }

  // 5. Mettre à jour tous les fichiers source
  console.log("\n✏ Mise à jour du code source...");

  // Regrouper les patches par fichier
  const filePatches = new Map();

  for (const item of found) {
    const cached = cache[item.imageId];
    if (!cached || cached.variants.length === 0) continue;

    const srcSet = buildSrcSet(cached.variants);
    const sizes = buildSizes(item.imgTag);
    // Utiliser la variante 800w comme src par défaut, ou la plus grande disponible
    const defaultVariant =
      cached.variants.find(v => v.width === 800) ||
      cached.variants[cached.variants.length - 1];
    const newSrc = defaultVariant.cdnUrl;

    const patchedTag = patchImageTag(item.imgTag, srcSet, sizes, newSrc);

    if (!filePatches.has(item.file)) {
      filePatches.set(item.file, []);
    }
    filePatches.get(item.file).push({
      originalTag: item.imgTag,
      patchedTag,
    });
  }

  for (const [file, patches] of filePatches) {
    console.log(`  📝 ${file.replace(ROOT, "")}`);
    updateSourceFile(file, patches);
  }

  console.log(`\n✅ Terminé ! ${processed} image(s) optimisée(s), ${filePatches.size} fichier(s) mis à jour.`);
  console.log("   N'oubliez pas de commiter les changements et de pousser vers GitHub.");
}

main().catch(err => {
  console.error("❌ Erreur fatale:", err);
  process.exit(1);
});
