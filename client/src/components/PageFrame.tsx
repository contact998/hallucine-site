/*
 * PageFrame — fin cadre doré en overlay viewport, opacité pulsée.
 *
 * Affiché sur toutes les pages, y compris admin/login/profil. Identité de marque.
 *
 * pointer-events:none → n'interfère avec aucune interaction.
 * Le CSS et l'animation sont définis dans index.css (`.hallucine-page-frame`).
 */
export default function PageFrame() {
  return <div aria-hidden className="hallucine-page-frame" />;
}
