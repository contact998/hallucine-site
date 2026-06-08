/**
 * translate-locales.mjs — Traduction automatique des locales via DeepL.
 *
 * Le français (client/src/locales/fr/*.json) est la SOURCE UNIQUE.
 * Pour chaque autre langue (en, de, es, it, pt), ce script complète les clés
 * manquantes en les traduisant via l'API DeepL — le même DeepL que le blog.
 *
 * Descend récursivement dans les objets imbriqués et les tableaux : home.json
 * (hero, products, faq…) est presque entièrement nesté ; un traitement à plat
 * ne traduirait que meta_title/meta_desc et laisserait le corps en français.
 *
 * Incrémental : ne traduit QUE les feuilles (chaînes) absentes. Les traductions
 * déjà présentes ne sont jamais retouchées (corrections manuelles préservées).
 *
 * Sans DEEPL_API_KEY : avertit et s'arrête proprement (exit 0) — le build
 * continue, les pages non traduites retombent simplement sur le français.
 *
 * Lancé automatiquement en tête de `pnpm build`. Manuellement : `pnpm translate`.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── Charge .env.local puis .env (clé DeepL en dev local) ───────────────
for (const envFile of [".env.local", ".env"]) {
  const path = join(ROOT, envFile);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const apiKey = process.env.DEEPL_API_KEY;
if (!apiKey) {
  console.warn("[i18n] DEEPL_API_KEY absente — traduction des locales ignorée (fallback FR).");
  process.exit(0);
}

// Les clés DeepL API Free se terminent par ":fx" et utilisent api-free.deepl.com ;
// les clés Pro utilisent api.deepl.com. Détection automatique selon le suffixe.
const DEEPL_HOST = apiKey.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";

const LOCALES = join(ROOT, "client/src/locales");
const FR_DIR = join(LOCALES, "fr");
const DEEPL_LANGS = { en: "EN-GB", de: "DE", es: "ES", it: "IT", pt: "PT-PT" };

// DeepL accepte au plus 50 textes par requête : on découpe en lots.
const BATCH = 45;

// ── Aplatissement / reconstruction de structures imbriquées ────────────
// flatten : { hero: { quote: "x" }, tags: ["a"] } → Map { "hero.quote"→"x", "tags.0"→"a" }
// (feuilles chaînes uniquement ; les autres primitives sont ignorées ici et
//  recopiées telles quelles depuis le FR lors de la reconstruction).
function flattenStrings(node, prefix, out) {
  if (typeof node === "string") {
    out.set(prefix, node);
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => flattenStrings(v, prefix ? `${prefix}.${i}` : String(i), out));
  } else if (node && typeof node === "object") {
    for (const k of Object.keys(node)) {
      flattenStrings(node[k], prefix ? `${prefix}.${k}` : k, out);
    }
  }
}

// rebuild : reconstruit en suivant la structure et l'ordre des clés du FR,
// en tirant chaque feuille chaîne depuis `resolved` (existant + traductions).
function rebuild(frNode, prefix, resolved) {
  if (typeof frNode === "string") {
    return resolved.has(prefix) ? resolved.get(prefix) : frNode;
  }
  if (Array.isArray(frNode)) {
    return frNode.map((v, i) => rebuild(v, prefix ? `${prefix}.${i}` : String(i), resolved));
  }
  if (frNode && typeof frNode === "object") {
    const obj = {};
    for (const k of Object.keys(frNode)) {
      obj[k] = rebuild(frNode[k], prefix ? `${prefix}.${k}` : k, resolved);
    }
    return obj;
  }
  return frNode; // primitive non-chaîne : recopiée telle quelle
}

// ── Protection des placeholders {{...}} : DeepL ne doit pas les traduire ──
function protect(text) {
  const tokens = [];
  // Échappe &, <, > : sinon le tag_handling XML de DeepL rejette tout le lot
  // (ex. "Blog & Actualités" → "invalid token"). Déséchappé dans restore().
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const out = escaped.replace(/\{\{.*?\}\}/g, (m) => {
    tokens.push(m);
    return `<x id="${tokens.length - 1}"/>`;
  });
  return { out, tokens };
}
function restore(text, tokens) {
  return text
    .replace(/<x id="(\d+)"\s*\/?>(?:<\/x>)?/g, (_, i) => tokens[Number(i)] ?? "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

async function deepl(texts, targetLang) {
  const res = await fetch(`https://${DEEPL_HOST}/v2/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `DeepL-Auth-Key ${apiKey}`,
    },
    body: JSON.stringify({
      text: texts,
      target_lang: targetLang,
      source_lang: "FR",
      tag_handling: "xml",
      ignore_tags: ["x"],
    }),
  });
  if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.translations.map((t) => t.text);
}

// ── Boucle principale ──────────────────────────────────────────────────
try {
  let total = 0;
  const frFiles = readdirSync(FR_DIR).filter((f) => f.endsWith(".json"));

  for (const lang of Object.keys(DEEPL_LANGS)) {
    const langDir = join(LOCALES, lang);
    if (!existsSync(langDir)) mkdirSync(langDir, { recursive: true });

    for (const file of frFiles) {
      const fr = JSON.parse(readFileSync(join(FR_DIR, file), "utf8"));
      const targetPath = join(langDir, file);
      const target = existsSync(targetPath)
        ? JSON.parse(readFileSync(targetPath, "utf8"))
        : {};

      // Feuilles (chaînes) présentes en FR mais absentes dans la langue cible.
      const frFlat = new Map();
      flattenStrings(fr, "", frFlat);
      const targetFlat = new Map();
      flattenStrings(target, "", targetFlat);
      const missing = [...frFlat.keys()].filter((p) => !targetFlat.has(p));
      if (missing.length === 0) continue;

      try {
        // Conserve l'existant (traductions/corrections déjà en place).
        const resolved = new Map(targetFlat);

        for (let i = 0; i < missing.length; i += BATCH) {
          const batch = missing.slice(i, i + BATCH);
          const protectedTexts = [];
          const tokenSets = [];
          for (const p of batch) {
            const { out, tokens } = protect(frFlat.get(p));
            protectedTexts.push(out);
            tokenSets.push(tokens);
          }
          const translated = await deepl(protectedTexts, DEEPL_LANGS[lang]);
          batch.forEach((p, j) => resolved.set(p, restore(translated[j], tokenSets[j])));
        }

        // Réécrit en suivant la structure et l'ordre des clés du FR.
        const rebuilt = rebuild(fr, "", resolved);
        writeFileSync(targetPath, JSON.stringify(rebuilt, null, 2) + "\n");

        total += missing.length;
        console.log(`[i18n] ${lang}/${file} — ${missing.length} clé(s) traduite(s)`);
      } catch (err) {
        console.warn(`[i18n] ${lang}/${file} — échec: ${err.message} (ignoré)`);
      }
    }
  }
  console.log(`[i18n] Traduction terminée — ${total} clé(s) au total.`);
} catch (err) {
  console.warn(`[i18n] Traduction interrompue: ${err.message} (build poursuivi).`);
  process.exit(0);
}
