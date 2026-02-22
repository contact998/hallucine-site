import { useEffect } from "react";

const DEFAULT_TITLE = "Hallucine — Écrans de Cinéma Gonflables | Fabricant depuis 1995";
const DEFAULT_DESCRIPTION =
  "Hallucine, fabricant français d'écrans de cinéma gonflables depuis 1995. Écrans géants, tentes gonflables, arches, mobilier événementiel. Livraison mondiale.";

/**
 * Met à jour le titre et la description meta de la page.
 * Se réinitialise au démontage du composant.
 */
export function useDocumentMeta(title?: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title;

    if (title) {
      document.title = `${title} | Hallucine`;
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";
    if (description && metaDesc) {
      metaDesc.setAttribute("content", description);
    }

    // OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const prevOgTitle = ogTitle?.getAttribute("content") ?? "";
    if (title && ogTitle) {
      ogTitle.setAttribute("content", `${title} | Hallucine`);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    const prevOgDesc = ogDesc?.getAttribute("content") ?? "";
    if (description && ogDesc) {
      ogDesc.setAttribute("content", description);
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.setAttribute("content", prevDesc);
      if (ogTitle) ogTitle.setAttribute("content", prevOgTitle);
      if (ogDesc) ogDesc.setAttribute("content", prevOgDesc);
    };
  }, [title, description]);
}
