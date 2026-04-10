import { useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { LANGUAGE_DOMAINS, SupportedLanguage } from "@/i18n/config";

/**
 * Hook qui met à jour dynamiquement les balises <link rel="canonical"> et <meta property="og:url">
 * selon la route active et le domaine correspondant à la langue courante.
 * Indispensable pour le SEO : chaque page doit avoir sa propre URL canonique sur le bon domaine.
 */
export function useCanonical() {
  const [location] = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language as SupportedLanguage;
    const baseUrl = LANGUAGE_DOMAINS[lang] ?? LANGUAGE_DOMAINS["fr"];

    // Construire l'URL canonique (sans trailing slash sauf pour la racine)
    const canonicalUrl =
      location === "/" ? baseUrl + "/" : baseUrl + location.replace(/\/$/, "");

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

    // Ajouter noindex et nofollow pour les pages admin et profil
    const isAdminOrProfil = location.startsWith("/admin") || location.startsWith("/profil");
    let robotsMeta = document.querySelector(
      'meta[name="robots"]'
    ) as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute("content", isAdminOrProfil ? "noindex, nofollow" : "index, follow");
  }, [location, i18n.language]);
}
