/**
 * Script de traduction automatique FR → EN/DE/ES
 * Utilise le LLM Manus intégré
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const LOCALES_DIR = resolve("client/public/locales");
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "https://forge.manus.im";
const API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const API_URL = `${FORGE_API_URL.replace(/\/$/, "")}/v1/chat/completions`;

const LANGUAGES = { en: "English", de: "German", es: "Spanish" };
const FILES = ["common", "home", "nav", "products", "contact", "legal"];

async function translateJson(jsonObj, targetLangName) {
  const jsonStr = JSON.stringify(jsonObj, null, 2);
  const prompt = `You are a professional translator. Translate this JSON from French to ${targetLangName}. 
Rules:
- Only translate the VALUES, never the KEYS
- Keep all special characters, HTML entities, and placeholders ({{variable}}) unchanged
- For German, use formal "Sie" form
- For product names like "Hallucine", keep them as-is
- Return ONLY valid JSON, no markdown, no explanation

JSON to translate:
${jsonStr}`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: "gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });
  const data = await response.json();
  const content = data.choices[0].message.content;
  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON found in response: ${content.slice(0, 200)}`);
  return JSON.parse(jsonMatch[0]);
}

async function main() {
  if (!API_KEY) {
    console.error("❌ BUILT_IN_FORGE_API_KEY not set");
    process.exit(1);
  }

  for (const file of FILES) {
    const frPath = resolve(LOCALES_DIR, `fr/${file}.json`);
    if (!existsSync(frPath)) {
      console.log(`⏭️  Skipping ${file}.json (not found)`);
      continue;
    }
    const frContent = JSON.parse(readFileSync(frPath, "utf-8"));

    for (const [lang, langName] of Object.entries(LANGUAGES)) {
      const outPath = resolve(LOCALES_DIR, `${lang}/${file}.json`);
      console.log(`🔄 ${file}.json → ${lang} (${langName})...`);
      try {
        const translated = await translateJson(frContent, langName);
        writeFileSync(outPath, JSON.stringify(translated, null, 2) + "\n");
        console.log(`✅ ${lang}/${file}.json`);
        await new Promise(r => setTimeout(r, 800));
      } catch (err) {
        console.error(`❌ Error translating ${file}.json → ${lang}:`, err.message);
      }
    }
  }
  console.log("\n🎉 All translations done!");
}

main().catch(console.error);
