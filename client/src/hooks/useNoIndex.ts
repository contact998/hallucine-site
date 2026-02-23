import { useEffect } from "react";

/**
 * Ajoute une balise <meta name="robots" content="noindex, nofollow">
 * au <head> de la page. Utilisé sur les pages admin et profil
 * pour empêcher leur indexation par les moteurs de recherche.
 * La balise est retirée au démontage du composant.
 */
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);
}
