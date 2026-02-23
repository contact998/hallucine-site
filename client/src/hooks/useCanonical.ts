import { useEffect } from "react";
import { useLocation } from "wouter";

const BASE_URL = "https://hallucinecran.fr";

/**
 * Hook qui met à jour dynamiquement les balises <link rel="canonical"> et <meta property="og:url">
 * selon la route active. Indispensable pour le SEO : chaque page doit avoir sa propre URL canonique.
 */
export function useCanonical() {
  const [location] = useLocation();

  useEffect(() => {
    // Construire l'URL canonique (sans trailing slash sauf pour la racine)
    const canonicalUrl =
      location === "/" ? BASE_URL + "/" : BASE_URL + location.replace(/\/$/, "");

    // Mettre à jour ou créer la balise <link rel="canonical">
    let canonicalLink = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // Mettre à jour ou créer la balise <meta property="og:url">
    let ogUrl = document.querySelector(
      'meta[property="og:url"]'
    ) as HTMLMetaElement | null;
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", canonicalUrl);
  }, [location]);
}
