/**
 * locales-bundled.node.ts
 * Version Node.js de locales-bundled.ts — remplace import.meta.glob par fs.readFileSync
 * Utilisé uniquement par le script de pre-rendering SSR (scripts/prerender.mjs)
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Résolution robuste du dossier locales selon le contexte d'exécution :
//  • prerender (tsx, sources)      → __dirname = client/src/i18n → ../locales
//  • runtime serveur bundlé        → import.meta.url pointe sur dist/ ; les sources
//    sont absentes sur Railway → on lit dist/locales (copié au build:server).
//  • dev local bundlé              → les sources existent encore (cwd).
const LOCALES_CANDIDATES = [
  join(__dirname, '../locales'),             // sources (prerender)
  join(__dirname, 'locales'),                // dist/locales (runtime bundlé)
  join(process.cwd(), 'dist/locales'),       // dist/locales via cwd
  join(process.cwd(), 'client/src/locales'), // sources via cwd (dev local)
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
