import { useParams, Link } from "wouter";
import PageShell from "@/components/PageShell";
import BlogArticleView from "@/components/BlogArticleView";
import DOMPurify from "dompurify";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { trpc } from "@/lib/trpc";
import { useRoutes } from "@/i18n/useRoutes";
import { detectLanguage } from "@/i18n/domains";
import { formatPostDate } from "@/i18n/formatPostDate";
import { ArrowLeft } from "lucide-react";

/**
 * Lit les données SSR injectées dans le HTML par le rendu blog (runtime ou
 * pré-rendu). Cf. server/_core/vite.ts (handler /blog/:slug) et entry-server.
 * Permet à useQuery de renvoyer la donnée dès le 1er rendu client → pas de
 * spinner, rendu identique au HTML serveur (même composant BlogArticleView).
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
      <BlogArticleView
        title={post.title}
        category={post.category}
        author={post.author}
        dateLabel={formatPostDate(post.publishedAt, detectLanguage())}
        coverImageUrl={post.imageUrl}
        excerpt={post.excerpt}
        contentHtml={DOMPurify.sanitize(post.content)}
        blogHref={route("blog")}
        contactHref={route("contact")}
        coverPriority
        linkComponent={Link}
      />
    </PageShell>
  );
}
