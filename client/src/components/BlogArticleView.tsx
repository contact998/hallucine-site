import type { ElementType } from "react";
import { ArrowLeft, Calendar, User } from "lucide-react";

/**
 * BlogArticleView — rendu visuel d'un article de blog, PUR et PARTAGÉ.
 *
 * Utilisé à l'identique :
 *  - côté client par BlogPost.tsx (avec wouter <Link> pour la nav SPA),
 *  - côté serveur par server/_core/renderBlogArticle.tsx via renderToStaticMarkup
 *    (avec de simples <a>) pour que le PREMIER PAINT soit déjà stylé + image.
 *
 * Avant : le serveur envoyait du HTML brut (texte pleine largeur, sans image),
 * que le client jetait pour reconstruire la version stylée → « flash ». En
 * partageant CE composant, le HTML serveur est déjà la version finale : plus de
 * texte brut, image de couverture présente d'emblée.
 *
 * Contraintes (sinon le bundle serveur casse) : aucun hook, aucun accès à
 * window/document, aucun import CSS, aucune dépendance wouter/i18n. Toutes les
 * valeurs dynamiques (libellés, liens, date, HTML assaini) arrivent par props.
 */

export interface BlogArticleLabels {
  backToBlog: string;
  allArticles: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: string;
}

const DEFAULT_LABELS: BlogArticleLabels = {
  backToBlog: "Retour au blog",
  allArticles: "Tous les articles",
  ctaTitle: "Vous avez un projet ?",
  ctaDesc: "Demandez un devis gratuit — réponse sous 24h.",
  ctaButton: "Demander un devis",
};

export interface BlogArticleViewProps {
  title: string;
  category?: string | null;
  author?: string | null;
  /** Date déjà formatée dans la langue de l'article (ex: « 8 juin 2026 »). */
  dateLabel?: string;
  /** Image de couverture (bandeau en tête d'article). */
  coverImageUrl?: string | null;
  excerpt?: string | null;
  /** HTML de l'article DÉJÀ assaini par l'appelant (DOMPurify côté client). */
  contentHtml: string;
  blogHref: string;
  contactHref: string;
  /** true pour la 1re image visible (LCP) → priorité de chargement haute. */
  coverPriority?: boolean;
  /** Composant lien : wouter <Link> côté client, "a" (défaut) côté serveur. */
  linkComponent?: ElementType;
  labels?: Partial<BlogArticleLabels>;
}

export default function BlogArticleView({
  title,
  category,
  author,
  dateLabel,
  coverImageUrl,
  excerpt,
  contentHtml,
  blogHref,
  contactHref,
  coverPriority = false,
  linkComponent,
  labels,
}: BlogArticleViewProps) {
  const A: ElementType = linkComponent ?? "a";
  const l = { ...DEFAULT_LABELS, ...labels };

  return (
    <>
      {/* Photo de couverture — bandeau pleine largeur en tête d'article */}
      {coverImageUrl && (
        <div className="w-full bg-card">
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full aspect-[16/9] md:aspect-[21/9] object-cover"
            width={1600}
            height={840}
            fetchPriority={coverPriority ? "high" : undefined}
            loading={coverPriority ? undefined : "lazy"}
            decoding="async"
          />
        </div>
      )}

      {/* En-tête */}
      <section className="bg-card text-white py-12 md:py-16">
        <div className="container max-w-3xl">
          <A
            href={blogHref}
            className="inline-flex items-center gap-2 text-primary hover:underline mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {l.backToBlog}
          </A>
          {category && (
            <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full mb-4">
              {category}
            </span>
          )}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            {author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {author}
              </span>
            )}
            {dateLabel && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {dateLabel}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          {excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 pb-8 border-b border-border font-medium">
              {excerpt}
            </p>
          )}

          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:text-foreground
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* CTA */}
          <div className="mt-16 p-8 bg-card rounded-xl text-white text-center">
            <h2 className="font-display text-2xl font-bold mb-3">{l.ctaTitle}</h2>
            <p className="text-white/70 mb-6">{l.ctaDesc}</p>
            <A
              href={contactHref}
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
            >
              {l.ctaButton}
            </A>
          </div>

          {/* Retour */}
          <div className="mt-12 pt-8 border-t border-border">
            <A
              href={blogHref}
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              {l.allArticles}
            </A>
          </div>
        </div>
      </section>
    </>
  );
}
