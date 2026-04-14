/**
 * instance.ts — Instance i18next partagée explicite
 *
 * ✅ Une seule instance, initialisée différemment selon l'environnement :
 *   - config.ts (client Vite) : init avec locales-bundled.ts (import.meta.glob)
 *   - config.node.ts (SSR Node) : init avec locales-bundled.node.ts (fs.readFileSync)
 *
 * ✅ Tous les composants importent depuis ici :
 *   import { i18n } from "@/i18n/instance"
 *
 * ❌ Ne jamais importer i18n depuis "@/i18n/config" ou "i18next" directement
 */
import i18next from "i18next";

export const i18n = i18next.createInstance();
