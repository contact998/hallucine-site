/*
 * ScrollToTop — remet la fenêtre en haut à chaque changement de route.
 *
 * - Désactive la restauration automatique du navigateur (cause du bug où
 *   on atterrit en bas de la page d'accueil quand on clique Accueil depuis
 *   une page produit).
 * - Scroll au top via requestAnimationFrame pour s'exécuter APRÈS le rendu
 *   et le layout de la nouvelle page.
 * - Ignore les URLs avec ancre (#section) pour respecter le défilement
 *   vers une cible interne.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();

  // Désactiver la restauration auto du navigateur — une seule fois au montage.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    // rAF garantit que le scroll se fait après que la nouvelle page soit
    // peinte (sinon certains navigateurs réécrasent le scrollTop juste après).
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(id);
  }, [location]);

  return null;
}
