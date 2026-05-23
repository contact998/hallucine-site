/*
 * PageFrame — fin cadre doré en overlay viewport, opacité pulsée.
 *
 * Affiché sur toutes les pages publiques. Exclu sur /admin/*, /login, /profil
 * (écrans de gestion qui n'ont pas vocation à porter cet effet de marque).
 *
 * pointer-events:none → n'interfère avec aucune interaction.
 * Le CSS et l'animation sont définis dans index.css (`.hallucine-page-frame`).
 */
import { useLocation } from "wouter";

const HIDDEN_PREFIXES = ["/admin", "/login", "/profil"] as const;

export default function PageFrame() {
  const [location] = useLocation();
  const hidden = HIDDEN_PREFIXES.some((p) => location === p || location.startsWith(p + "/"));
  if (hidden) return null;
  return <div aria-hidden className="hallucine-page-frame" />;
}
