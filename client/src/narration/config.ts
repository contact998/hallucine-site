/**
 * Flag central d'activation de la narration vocale.
 *
 * Contrôlé par la variable d'environnement VITE_NARRATION_ENABLED.
 * Si elle est absente ou != "true", toute la feature est désactivée :
 * - le rideau fonctionne comme avant (sans voix)
 * - les sections ne déclenchent aucun audio
 * - le bouton mute n'apparaît pas
 *
 * Pour activer : dans le .env ou .env.local du projet, ajouter :
 *   VITE_NARRATION_ENABLED=true
 *
 * Pour désactiver instantanément : retirer la variable ou la mettre à "false".
 * Aucun redéploiement nécessaire côté code — juste un redémarrage Vite.
 */

export const NARRATION_ENABLED =
  typeof import.meta !== 'undefined' &&
  import.meta.env?.VITE_NARRATION_ENABLED === 'true';
