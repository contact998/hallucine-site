import { useEffect } from "react";

const DEFAULT_TITLE = "Hallucine — Écrans de Cinéma Gonflables | Fabricant depuis 1995";
const DEFAULT_DESCRIPTION =
  "Hallucine, fabricant français d'écrans de cinéma gonflables depuis 1995. Écrans géants, tentes gonflables, arches, mobilier événementiel. Livraison mondiale.";
const DEFAULT_IMAGE =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/XoVIsDKghhCzbhqj.webp";

function setMeta(selector: string, attr: string, value: string | undefined, prev: { value: string; el: Element | null }) {
  const el = document.querySelector(selector);
  prev.el = el;
  prev.value = el?.getAttribute(attr) ?? "";
  if (value && el) el.setAttribute(attr, value);
}

function restoreMeta(prev: { value: string; el: Element | null }, attr: string) {
  if (prev.el) prev.el.setAttribute(attr, prev.value);
}

/**
 * Met à jour le titre, la description meta, et les balises Open Graph / Twitter de la page.
 * Se réinitialise au démontage du composant.
 */
export function useDocumentMeta(title?: string, description?: string, image?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    const fullTitle = title ? `${title} | Hallucine` : undefined;

    if (fullTitle) {
      document.title = fullTitle;
    }

    const prevDesc = { value: "", el: null as Element | null };
    const prevOgTitle = { value: "", el: null as Element | null };
    const prevOgDesc = { value: "", el: null as Element | null };
    const prevOgImage = { value: "", el: null as Element | null };
    const prevOgUrl = { value: "", el: null as Element | null };
    const prevTwTitle = { value: "", el: null as Element | null };
    const prevTwDesc = { value: "", el: null as Element | null };
    const prevTwImage = { value: "", el: null as Element | null };

    setMeta('meta[name="description"]', "content", description, prevDesc);
    setMeta('meta[property="og:title"]', "content", fullTitle, prevOgTitle);
    setMeta('meta[property="og:description"]', "content", description, prevOgDesc);
    setMeta('meta[property="og:image"]', "content", image, prevOgImage);
    setMeta('meta[property="og:url"]', "content", typeof window !== "undefined" ? window.location.href : undefined, prevOgUrl);
    setMeta('meta[name="twitter:title"]', "content", fullTitle, prevTwTitle);
    setMeta('meta[name="twitter:description"]', "content", description, prevTwDesc);
    setMeta('meta[name="twitter:image"]', "content", image, prevTwImage);

    return () => {
      document.title = prevTitle;
      restoreMeta(prevDesc, "content");
      restoreMeta(prevOgTitle, "content");
      restoreMeta(prevOgDesc, "content");
      restoreMeta(prevOgImage, "content");
      restoreMeta(prevOgUrl, "content");
      restoreMeta(prevTwTitle, "content");
      restoreMeta(prevTwDesc, "content");
      restoreMeta(prevTwImage, "content");
    };
  }, [title, description, image]);
}
