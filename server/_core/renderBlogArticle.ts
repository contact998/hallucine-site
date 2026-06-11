/**
 * renderBlogArticle — rend l'article de blog en HTML statique côté serveur,
 * À PARTIR DU MÊME composant React que le client (BlogArticleView).
 *
 * But : le premier paint servi par /blog/:slug (cf. vite.ts) est déjà la version
 * finale (stylée, avec image de couverture), au lieu du texte brut pleine
 * largeur que le client jetait ensuite (« flash »). Zéro duplication de markup :
 * une seule source de vérité, rendue serveur (renderToStaticMarkup → <a>) et
 * client (BlogArticleView avec wouter <Link>).
 *
 * On passe par createElement (pas de JSX ici) pour cantonner la transformation
 * JSX au seul fichier BlogArticleView.tsx.
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BlogArticleView from "../../client/src/components/BlogArticleView";
import { getRoute } from "../../client/src/i18n/routes";
import { formatPostDate } from "../../client/src/i18n/formatPostDate";

export interface RenderBlogArticleInput {
  locale: string;
  title: string;
  category?: string | null;
  author?: string | null;
  publishedAt?: string | Date | null;
  coverImageUrl?: string | null;
  excerpt?: string | null;
  /** HTML de l'article DÉJÀ assaini par l'appelant. */
  contentHtml: string;
}

export function renderBlogArticleHtml(input: RenderBlogArticleInput): string {
  return renderToStaticMarkup(
    createElement(BlogArticleView, {
      title: input.title,
      category: input.category ?? null,
      author: input.author ?? null,
      dateLabel: formatPostDate(input.publishedAt ?? null, input.locale),
      coverImageUrl: input.coverImageUrl ?? null,
      excerpt: input.excerpt ?? null,
      contentHtml: input.contentHtml,
      blogHref: getRoute("blog", input.locale),
      contactHref: getRoute("contact", input.locale),
      coverPriority: true,
      // linkComponent par défaut = "a" → liens classiques côté serveur.
    }),
  );
}
