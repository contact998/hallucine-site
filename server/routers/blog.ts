import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostBySlug,
  getBlogPostById,
  getPublishedPosts,
  getAllBlogPosts,
  publishBlogPost,
  countPublishedPosts,
  translateAndPublishPost,
  backfillMissingTranslations,
  harmonizeTranslationImages,
} from "../blog";

/** Clé read/write : update, delete, adminList, publish (BLOG_API_KEY_2) */
function isValidBlogWriteKey(apiKey?: string | null): boolean {
  return Boolean(apiKey && apiKey === process.env.BLOG_API_KEY_2);
}

export const blogRouter = router({
  /** Lister les articles publiés (public) */
  list: publicProcedure
    .input(z.object({
      lang: z.string().default("fr"),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      const lang = input?.lang ?? "fr";
      const limit = input?.limit ?? 20;
      const offset = input?.offset ?? 0;
      const [posts, total] = await Promise.all([
        getPublishedPosts(lang, limit, offset),
        countPublishedPosts(lang),
      ]);
      return { posts, total };
    }),

  /** Récupérer un article par slug (public) */
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await getBlogPostBySlug(input.slug);
      if (!post || post.status !== "published") return null;
      return post;
    }),

  /** Créer un article — accessible via clé API (OpenClaw) ou admin connecté */
  create: publicProcedure
    .input(z.object({
      apiKey: z.string().optional(),
      title: z.string()
        .min(1, "Le titre est requis")
        .max(48, "Titre trop long (max 48 car. — le titre HTML final sera '${title} | Hallucine' soit 60 car. max)"),
      content: z.string().min(1, "Le contenu est requis"),
      excerpt: z.string()
        .max(160, "L'excerpt ne peut pas dépasser 160 caractères (meta description SEO)")
        .optional(),
      imageUrl: z.string().url("URL d'image invalide").optional().or(z.literal("")),
      lang: z.string().default("fr"),
      status: z.enum(["draft", "published", "scheduled"]).default("draft"),
      metaKeywords: z.string().optional(),
      metaDescription: z.string()
        .max(160, "La meta description ne peut pas dépasser 160 caractères")
        .optional(),
      author: z.string().optional(),
      category: z.string().optional(),
    }).superRefine((data, ctx) => {
      if (data.status === "published" && (!data.excerpt || data.excerpt.trim().length < 50)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["excerpt"],
          message: "L'excerpt est obligatoire pour publier un article (min 50 car.) — il sera utilisé comme meta description SEO sur Google",
        });
      }
    }))
    .mutation(async ({ input, ctx }) => {
      const validApiKey1 = process.env.BLOG_API_KEY;
      const validApiKey2 = process.env.BLOG_API_KEY_2;
      const isApiKey = (validApiKey1 && input.apiKey === validApiKey1) || (validApiKey2 && input.apiKey === validApiKey2);
      const isAdmin = ctx.user?.role === "admin";
      if (!isApiKey && !isAdmin) {
        throw new Error("Non autorisé");
      }
      const post = await createBlogPost({
        title: input.title,
        content: input.content,
        excerpt: input.excerpt,
        imageUrl: input.imageUrl?.trim() || undefined,
        lang: input.lang,
        status: input.status,
        publishedAt: input.status === "published" ? new Date() : undefined,
        metaKeywords: input.metaKeywords,
        metaDescription: input.metaDescription,
        author: input.author ?? "OpenClaw",
        category: input.category,
      });

      // Traduction automatique DeepL si l'article est publié en français
      if (input.status === "published" && input.lang === "fr") {
        translateAndPublishPost(post).catch(err =>
          console.error("[Blog] Erreur traduction automatique:", err)
        );
      }

      return { success: true, post };
    }),

  /** Lister tous les articles (admin ou apiKey write) */
  adminList: publicProcedure
    .input(z.object({ apiKey: z.string().optional() }).optional())
    .query(async ({ input, ctx }) => {
      const isAdmin = (ctx as any).user?.role === "admin";
      const isApiKey = isValidBlogWriteKey(input?.apiKey);
      if (!isAdmin && !isApiKey) throw new Error("Non autorise");
      return getAllBlogPosts(200);
    }),

  /** Publier un article (admin ou apiKey write) */
  publish: publicProcedure
    .input(z.object({ id: z.number(), apiKey: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const post = await getBlogPostById(input.id);
      if (!post) throw new Error("Article introuvable");
      if (!post.excerpt || post.excerpt.trim().length < 50) {
        throw new Error(
          "Impossible de publier : l'excerpt est manquant ou trop court (min 50 car.). " +
          "Il sera utilisé comme meta description SEO sur Google."
        );
      }
      if (post.title.length > 48) {
        throw new Error(
          `Impossible de publier : le titre est trop long (${post.title.length}/48 car.). ` +
          `Le titre HTML final sera '${post.title} | Hallucine' soit ${post.title.length + 12} car. ` +
          "(max 60 car. recommandé par Google)."
        );
      }
      const isAdmin2 = (ctx as any).user?.role === "admin";
      const isApiKey2 = isValidBlogWriteKey((input as any).apiKey);
      if (!isAdmin2 && !isApiKey2) throw new Error("Non autorise");
      await publishBlogPost(input.id);
      // Purge du cache Cloudflare si configuré (optionnel — no-op si variables absentes)
      if (process.env.CLOUDFLARE_ZONE_ID && process.env.CLOUDFLARE_API_TOKEN) {
        fetch(
          `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ purge_everything: true }),
          }
        ).catch((err) =>
          console.error("[Cache] Erreur purge Cloudflare:", err)
        );
      }
      // Traduction automatique si article français
      const published = await getBlogPostById(input.id);
      if (published && published.lang === "fr") {
        translateAndPublishPost(published).catch(err =>
          console.error("[Blog] Erreur traduction:", err)
        );
      }
      return { success: true };
    }),

  /** Mettre a jour un article (admin ou apiKey write) */
  update: publicProcedure
    .input(z.object({
      apiKey: z.string().optional(),
      id: z.number(),
      title: z.string()
        .min(1)
        .max(48, "Titre trop long (max 48 car. — le titre HTML final sera '${title} | Hallucine' soit 60 car. max)")
        .optional(),
      content: z.string().optional(),
      excerpt: z.string()
        .min(50, "L'excerpt doit faire au moins 50 caractères")
        .max(160, "L'excerpt ne peut pas dépasser 160 caractères")
        .optional(),
      imageUrl: z.string().url("URL d'image invalide").optional().or(z.literal("")),
      status: z.enum(["draft", "published", "scheduled"]).optional(),
      metaKeywords: z.string().optional(),
      metaDescription: z.string()
        .max(160, "La meta description ne peut pas dépasser 160 caractères")
        .optional(),
      author: z.string().max(100).optional(),
      category: z.string().optional(),
    }).superRefine((data, ctx) => {
      if (data.status === "published" && data.excerpt !== undefined && data.excerpt.trim().length < 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["excerpt"],
          message: "L'excerpt doit faire au moins 50 caractères avant de publier",
        });
      }
    }))
    .mutation(async ({ input, ctx }) => {
      const isAdminU = (ctx as any).user?.role === "admin";
      const isApiKeyU = isValidBlogWriteKey(input.apiKey);
      if (!isAdminU && !isApiKeyU) throw new Error("Non autorise");
      const { id, apiKey: _apiKey, ...data } = input;
      await updateBlogPost(id, data as any);
      return { success: true };
    }),

  /** Rattrapage : traduit les articles FR publiés dans les langues manquantes (admin ou apiKey write).
   *  Batché — relancer tant que remaining > 0. */
  backfillTranslations: publicProcedure
    .input(z.object({
      apiKey: z.string().optional(),
      maxItems: z.number().min(1).max(50).default(8),
    }))
    .mutation(async ({ input, ctx }) => {
      const isAdmin = (ctx as any).user?.role === "admin";
      if (!isAdmin && !isValidBlogWriteKey(input.apiKey)) throw new Error("Non autorise");
      return backfillMissingTranslations(input.maxItems);
    }),

  /** Aligne l'image des traductions sur celle de leur parent FR (admin ou apiKey write) */
  harmonizeImages: publicProcedure
    .input(z.object({ apiKey: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const isAdmin = (ctx as any).user?.role === "admin";
      if (!isAdmin && !isValidBlogWriteKey(input.apiKey)) throw new Error("Non autorise");
      return harmonizeTranslationImages();
    }),

  /** Supprimer un article (admin ou apiKey write) */
  delete: publicProcedure
    .input(z.object({ id: z.number(), apiKey: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const isAdminD = (ctx as any).user?.role === "admin";
      const isApiKeyD = isValidBlogWriteKey(input.apiKey);
      if (!isAdminD && !isApiKeyD) throw new Error("Non autorise");
      await deleteBlogPost(input.id);
      return { success: true };
    }),
});
