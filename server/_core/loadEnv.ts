/*
 * Amorçage de l'environnement — DOIT être importé en tout premier dans
 * server/_core/index.ts (avant tout module qui lit process.env, ex. la DB).
 *
 * En ESM, les `import` sont évalués avant les statements du corps du module ;
 * mettre les appels dotenv.config() dans index.ts les ferait tourner APRÈS
 * l'init de la DB → variables manquantes. Un import à effet de bord garantit
 * que l'env est chargé avant l'évaluation des imports suivants.
 *
 * Priorité : .env.local (secrets de dev local) puis .env. dotenv n'écrase
 * jamais une variable déjà définie : en prod (Railway), la plateforme gagne
 * et .env.local n'existe pas.
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();
