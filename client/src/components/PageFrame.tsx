/*
 * PageFrame — fin cadre doré en overlay viewport, opacité pulsée.
 *
 * Affiché sur toutes les pages, y compris admin/login/profil. Identité de marque.
 *
 * pointer-events:none → n'interfère avec aucune interaction.
 * Le CSS et l'animation sont définis dans index.css (`.hallucine-page-frame`).
 */
export default function PageFrame() {
  // Désactivé temporairement pour diagnostiquer un décalage côté droit
  // signalé par l'utilisateur. À ré-activer une fois la cause identifiée.
  return null;
}
