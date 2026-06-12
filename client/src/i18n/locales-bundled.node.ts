/**
 * locales-bundled.node.ts
 * Version Node.js de locales-bundled.ts — remplace import.meta.glob par fs.readFileSync
 * Utilisé uniquement par le script de pre-rendering SSR (scripts/prerender.mjs)
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Résolution robuste du dossier locales :
//  • depuis les sources (prerender via tsx) → ../locales relatif à ce module.
//  • bundlé dans dist/index.js (runtime serveur) → import.meta.url pointe sur
//    dist/, le chemin relatif casse ; on retombe sur les sources via cwd.
const LOCALES_CANDIDATES = [
  join(__dirname, '../locales'),
  join(process.cwd(), 'client/src/locales'),
];
const LOCALES_DIR = LOCALES_CANDIDATES.find((p) => existsSync(p)) ?? LOCALES_CANDIDATES[0];

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
