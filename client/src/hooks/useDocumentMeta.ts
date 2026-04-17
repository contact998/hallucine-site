import { useContext, useEffect } from "react";
import { SSRMetaContext } from "../context/SSRMetaContext";

const DEFAULT_TITLE = "Hallucine — Écrans de Cinéma Gonflables | Fabricant depuis 1995";
const DEFAULT_DESCRIPTION =
  "Hallucine, fabricant français d'écrans de cinéma gonflables depuis 1995. Écrans géants, tentes gonflables, arches, mobilier événementiel. Livraison mondiale.";
const DEFAULT_IMAGE =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vajzfoYsbBMsDfIq.webp";

const SITE_NAME = "Hallucine";

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
 *
 * En SSR (prerender) : collecte les metas via SSRMetaContext pour injection dans le HTML.
 * En client : met à jour le DOM directement, se réinitialise au démontage.
 */
export function useDocumentMeta(title?: string, description?: string, image?: string) {
  // ─── SSR : collecte des metas pendant renderToString ───────────────────────
  // Principe : first-write-wins — seul le premier appelant (la page) définit les metas.
  // Les composants enfants (PageStructuredData, etc.) n'écrasent pas.
  const ssrMeta = useContext(SSRMetaContext);

  if (ssrMeta !== null && !ssrMeta.locked) {
    ssrMeta.locked = true;
    ssrMeta.setMeta({
      title: title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE,
      description: description ?? DEFAULT_DESCRIPTION,
      image: image ?? DEFAULT_IMAGE,
    });
  }

  // ─── Client : mise à jour DOM ───────────────────────────────────────────────
  useEffect(() => {
    const prevTitle = document.title;
    const fullTitle = title ? `${title} | ${SITE_NAME}` : undefined;

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
