/**
 * translate-locales.mjs — Traduction automatique des locales via DeepL.
 *
 * Le français (client/src/locales/fr/*.json) est la SOURCE UNIQUE.
 * Pour chaque autre langue (en, de, es, it), ce script complète les clés
 * manquantes en les traduisant via l'API DeepL — le même DeepL que le blog.
 *
 * Incrémental : ne traduit QUE les clés absentes. Les traductions déjà
 * présentes ne sont jamais retouchées (corrections manuelles préservées).
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

const LOCALES = join(ROOT, "client/src/locales");
const FR_DIR = join(LOCALES, "fr");
const DEEPL_LANGS = { en: "EN-GB", de: "DE", es: "ES", it: "IT" };

// ── Protection des placeholders {{...}} : DeepL ne doit pas les traduire ──
function protect(text) {
  const tokens = [];
  const out = text.replace(/\{\{.*?\}\}/g, (m) => {
    tokens.push(m);
    return `<x id="${tokens.length - 1}"/>`;
  });
  return { out, tokens };
}
function restore(text, tokens) {
  return text.replace(/<x id="(\d+)"\s*\/?>(?:<\/x>)?/g, (_, i) => tokens[Number(i)] ?? "");
}

async function deepl(texts, targetLang) {
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
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

      // Clés présentes en FR (chaînes) mais absentes dans la langue cible.
      const missing = Object.keys(fr).filter(
        (k) => typeof fr[k] === "string" && !(k in target)
      );
      if (missing.length === 0) continue;

      try {
        const protectedTexts = [];
        const tokenSets = [];
        for (const k of missing) {
          const { out, tokens } = protect(fr[k]);
          protectedTexts.push(out);
          tokenSets.push(tokens);
        }

        const translated = await deepl(protectedTexts, DEEPL_LANGS[lang]);
        missing.forEach((k, i) => {
          target[k] = restore(translated[i], tokenSets[i]);
        });

        // Réécrit le fichier dans l'ordre des clés du FR.
        const ordered = {};
        for (const k of Object.keys(fr)) if (k in target) ordered[k] = target[k];
        writeFileSync(targetPath, JSON.stringify(ordered, null, 2) + "\n");

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
