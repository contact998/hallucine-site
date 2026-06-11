/*
 * ScrollToTop — défilement à chaque changement de route.
 *
 * - Navigation AVANT (clic sur un lien → PUSH) : remet la fenêtre en haut.
 *   (corrige le bug « cliquer Accueil depuis une page produit atterrit en bas ».)
 * - Back/forward du navigateur (POP) : RESTAURE la position quittée. Sans ça,
 *   revenir sur la liste /blog repartait du haut au lieu de l'article lu.
 *
 * Détection PUSH vs POP : on patche history.pushState/replaceState (appelés par
 * wouter au clic d'un lien) pour marquer une navigation « avant ». Tout le reste
 * (boutons précédent/suivant) est un POP → on restaure. C'est fiable car
 * pushState est synchrone, contrairement à un flag posé sur l'événement popstate
 * (qui arrive APRÈS le flush synchrone de React dans les gestionnaires d'events).
 *
 * Sauvegarde des positions : indexée sur l'URL LIVE au moment du scroll, jamais
 * sur une ref qui serait déjà passée à la page suivante — sinon le « clamp » de
 * scroll qui suit un changement de page écrase la bonne valeur par 0.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

const scrollPositions = new Map<string, number>();

function key(): string {
  return window.location.pathname + window.location.search;
}

let navAction: "push" | "pop" = "pop";
let patched = false;

// Route précédente (pathname), pour les liens « Retour au blog » intelligents :
// si on vient de la liste, le lien fait un history.back() (→ POP → scroll
// restauré) au lieu d'un push (→ haut de page).
let previousPath: string | null = null;
let lastPath: string | null = null;

export function getPreviousPath(): string | null {
  return previousPath;
}

function ensureHistoryPatched() {
  if (patched || typeof window === "undefined") return;
  patched = true;
  const h = window.history;
  const origPush = h.pushState.bind(h);
  const origReplace = h.replaceState.bind(h);
  h.pushState = function (...args: Parameters<History["pushState"]>) {
    navAction = "push";
    return origPush(...args);
  };
  h.replaceState = function (...args: Parameters<History["replaceState"]>) {
    navAction = "push"; // un « replace » ne doit pas restaurer une ancienne position
    return origReplace(...args);
  };
}

export default function ScrollToTop() {
  const [location] = useLocation();

  // Montage : restauration manuelle + patch history + mémorisation continue.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    ensureHistoryPatched();
    const onScroll = () => { scrollPositions.set(key(), window.scrollY); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Mémoriser la route précédente.
    const path = window.location.pathname;
    if (path !== lastPath) {
      if (lastPath !== null) previousPath = lastPath;
      lastPath = path;
    }

    const isPop = navAction === "pop";
    navAction = "pop"; // réarmer : la prochaine nav est un POP sauf pushState

    if (window.location.hash) return; // respecter le défilement vers une ancre

    const k = key();
    const target = isPop && scrollPositions.has(k) ? scrollPositions.get(k)! : 0;

    // Double rAF : laisser la nouvelle page peindre/se mettre en page (hauteur
    // disponible) avant de positionner le scroll.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        window.scrollTo({ top: target, left: 0, behavior: "instant" });
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [location]);

  return null;
}
