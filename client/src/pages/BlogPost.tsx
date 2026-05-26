import { useParams, Link } from "wouter";
import PageShell from "@/components/PageShell";
import DOMPurify from "dompurify";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { trpc } from "@/lib/trpc";
import { useRoutes } from "@/i18n/useRoutes";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

/**
 * Lit les données SSR injectées dans le HTML par le pre-rendering blog.
 * Cf. entry-server.tsx → meta.headExtra → prerender.mjs injectIntoTemplate.
 * Permet à useQuery de renvoyer la donnée dès le 1er rendu client →
 * hydratation propre, pas de mismatch avec le SSR.
 */
function readSsrBlogPost(slug: string): unknown | undefined {
  if (typeof window === "undefined") return undefined;
  const ssr = (window as unknown as { __SSR_INITIAL_DATA__?: { blogPost?: { slug: string; data: unknown } } })
    .__SSR_INITIAL_DATA__;
  return ssr?.blogPost?.slug === slug ? ssr.blogPost.data : undefined;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const route = useRoutes();

  const { data: post, isLoading, error } = trpc.blog.bySlug.useQuery(
    { slug: slug ?? "" },
    {
      enabled: !!slug,
      initialData: slug ? (readSsrBlogPost(slug) as never) : undefined,
    }
  );

  useDocumentMeta(
    post?.title ?? "Article | Hallucine",
    post?.metaDescription ?? post?.excerpt ?? "",
    post?.imageUrl ?? undefined
  );

  const formatDate = (dateStr: string | Date | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        </PageShell>
    );
  }

  if (error || !post) {
    return (
      <PageShell>
        <div className="container max-w-3xl py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Article introuvable</h1>
          <p className="text-muted-foreground mb-8">
            Cet article n'existe pas ou a été supprimé.
          </p>
          <Link
            href={route("blog")}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
        </PageShell>
    );
  }

  return (
    <PageShell>

      {/* Hero */}
      <section className="bg-card text-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <Link
            href={route("blog")}
            className="inline-flex items-center gap-2 text-primary hover:underline mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
          {post.category && (
            <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
          )}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16">
        <div className="container max-w-3xl">
          {/* Image principale */}
          {post.imageUrl && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
                width={1200} height={600}
                decoding="async"
              />
            </div>
          )}

          {post.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 pb-8 border-b border-border font-medium">
              {post.excerpt}
            </p>
          )}

          {/* Article HTML */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:text-foreground
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          {/* CTA */}
          <div className="mt-16 p-8 bg-card rounded-xl text-white text-center">
            <h2 className="font-display text-2xl font-bold mb-3">
              Vous avez un projet ?
            </h2>
            <p className="text-white/70 mb-6">
              Demandez un devis gratuit — réponse sous 24h.
            </p>
            <Link
              href={route("contact")}
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
            >
              Demander un devis
            </Link>
          </div>

          {/* Retour */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href={route("blog")}
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Tous les articles
            </Link>
          </div>
        </div>
      </section>

      </PageShell>
  );
}
