/**
 * Script de traduction automatique
 * Traduit les fichiers JSON FR vers EN, DE, ES
 * Utilise l'API LLM Manus (BUILT_IN_FORGE_API_KEY)
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = resolve(__dirname, "../client/src/locales");
const FORGE_API_URL = process.env.FORGE_API_URL || "https://api.anthropic.com";
const API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const API_URL = `${FORGE_API_URL.replace(/\/$/, "")}/v1/chat/completions`;

if (!API_KEY) {
  console.error("❌ BUILT_IN_FORGE_API_KEY requis");
  process.exit(1);
}
console.log(`🔗 API URL: ${API_URL}`);

const LANGUAGES = {
  en: "English",
  de: "German",
  es: "Spanish",
};

async function translateJson(jsonObj, targetLang, targetLangName, namespace) {
  const jsonStr = JSON.stringify(jsonObj, null, 2);

  const prompt = `You are a professional translator specializing in marketing and e-commerce for inflatable cinema screens and event equipment.

Translate the following JSON file from French to ${targetLangName}.
This is for the website of Hallucine, a French manufacturer of inflatable cinema screens since 1995.

Rules:
- Translate ONLY the values, never the keys
- Keep the exact same JSON structure
- Use professional, marketing-oriented language
- Keep brand names unchanged: "Hallucine", "Tente X", "Tente N", "Tente V", "Tente Araignée"
- Keep technical terms appropriate for the target language
- Keep URLs, emails, phone numbers unchanged
- Return ONLY valid JSON, no explanations

French JSON to translate:
${jsonStr}`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Extraire le JSON de la réponse
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`No JSON found in response for ${namespace} → ${targetLang}`);
  }

  return JSON.parse(jsonMatch[0]);
}

async function main() {
  const frDir = resolve(LOCALES_DIR, "fr");
  const files = readdirSync(frDir).filter((f) => f.endsWith(".json"));

  console.log(`📁 Fichiers à traduire : ${files.join(", ")}`);
  console.log(`🌍 Langues cibles : ${Object.keys(LANGUAGES).join(", ")}\n`);

  for (const file of files) {
    const namespace = file.replace(".json", "");
    const frPath = resolve(frDir, file);
    const frContent = JSON.parse(readFileSync(frPath, "utf-8"));

    for (const [lang, langName] of Object.entries(LANGUAGES)) {
      const targetPath = resolve(LOCALES_DIR, lang, file);

      // Vérifier si le fichier existe déjà
      try {
        const existing = JSON.parse(readFileSync(targetPath, "utf-8"));
        if (Object.keys(existing).length > 0) {
          console.log(`⏭️  ${lang}/${file} déjà traduit, ignoré`);
          continue;
        }
      } catch {
        // Fichier n'existe pas encore
      }

      console.log(`🔄 Traduction ${namespace} → ${lang}...`);

      try {
        const translated = await translateJson(frContent, lang, langName, namespace);
        writeFileSync(targetPath, JSON.stringify(translated, null, 2) + "\n");
        console.log(`✅ ${lang}/${file} traduit (${Object.keys(translated).length} clés)`);
      } catch (err) {
        console.error(`❌ Erreur pour ${lang}/${file}: ${err.message}`);
      }

      // Pause pour éviter le rate limiting
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log("\n🎉 Traduction terminée !");
}

main().catch(console.error);
