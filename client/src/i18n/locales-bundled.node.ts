/**
 * locales-bundled.node.ts
 * Version Node.js de locales-bundled.ts — remplace import.meta.glob par fs.readFileSync
 * Utilisé uniquement par le script de pre-rendering SSR (scripts/prerender.mjs)
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, '../locales');

type Resources = Record<string, Record<string, Record<string, unknown>>>;

export const bundledResources: Resources = {};

for (const lang of readdirSync(LOCALES_DIR)) {
  const langDir = join(LOCALES_DIR, lang);
  bundledResources[lang] = {};
  for (const file of readdirSync(langDir)) {
    if (!file.endsWith('.json')) continue;
    const ns = file.replace('.json', '');
    bundledResources[lang][ns] = JSON.parse(readFileSync(join(langDir, file), 'utf-8'));
  }
}
