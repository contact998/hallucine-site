/*
 * ScrollToTop — remet la fenêtre en haut à chaque changement de route.
 *
 * Sans ce composant, wouter ne réinitialise pas la position de scroll au
 * changement d'URL : tu cliques sur un lien en bas d'une page longue,
 * tu te retrouves au milieu (ou en bas) de la nouvelle page.
 *
 * On ignore les URLs avec ancre (#section) pour ne pas casser le défilement
 * vers une cible interne. Le déclenchement se fait dans un useEffect après
 * le rendu de la nouvelle page → l'utilisateur ne voit pas de saut visuel.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Si l'URL contient une ancre (#section), on laisse le navigateur
    // gérer le scroll vers la cible.
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  return null;
}
