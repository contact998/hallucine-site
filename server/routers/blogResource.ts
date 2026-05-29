/**
 * server/routers/blogResource.ts
 * Ressource « blogPosts » au format CONVENTION (dataProvider Refine).
 * Mêmes 5 procédures que mediaResource — prouve que le dataProvider est générique.
 * Admin-only. Le PUBLISH reste géré par blog.publish (pipeline traduction/cache).
 */
import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  listBlogResource,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../blog";

const listInput = z.object({
  pagination: z.object({
    page:    z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(200).default(20),
  }).default({ page: 1, perPage: 20 }),
  sort: z.array(z.object({ field: z.string(), order: z.enum(["asc", "desc"]) })).optional(),
  filters: z.array(z.object({ field: z.string(), operator: z.string().default("eq"), value: z.any() })).optional(),
});

const statusEnum = z.enum(["draft", "published", "scheduled"]);

const dataInput = z.object({
  title:           z.string().max(500).optional(),
  excerpt:         z.string().nullable().optional(),
  content:         z.string().optional(),
  imageUrl:        z.string().nullable().optional(),
  category:        z.string().max(100).nullable().optional(),
  metaDescription: z.string().max(500).nullable().optional(),
  metaKeywords:    z.string().max(500).nullable().optional(),
  status:          statusEnum.optional(),
  lang:            z.string().max(10).optional(),
});

export const blogResourceRouter = router({
  list: adminProcedure
    .input(listInput)
    .query(({ input }) => listBlogResource(input)),

  byId: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const post = await getBlogPostById(input.id);
      if (!post) throw new Error("Article introuvable");
      return post;
    }),

  create: adminProcedure
    .input(z.object({ data: dataInput }))
    .mutation(async ({ input }) => {
      const d = input.data;
      if (!d.title || !d.title.trim()) throw new Error("Titre requis pour créer un article.");
      return createBlogPost({
        title:           d.title,
        content:         d.content ?? "",
        excerpt:         d.excerpt ?? undefined,
        imageUrl:        d.imageUrl ?? undefined,
        category:        d.category ?? undefined,
        metaDescription: d.metaDescription ?? undefined,
        metaKeywords:    d.metaKeywords ?? undefined,
        status:          d.status ?? "draft",
        lang:            d.lang ?? "fr",
      });
    }),

  update: adminProcedure
    .input(z.object({ id: z.number().int().positive(), data: dataInput }))
    .mutation(async ({ input }) => {
      const post = await getBlogPostById(input.id);
      if (!post) throw new Error("Article introuvable");
      const d = input.data;
      const patch: Record<string, unknown> = {};
      if (d.title           !== undefined) patch.title           = d.title;
      if (d.excerpt         !== undefined) patch.excerpt         = d.excerpt;
      if (d.content         !== undefined) patch.content         = d.content;
      if (d.imageUrl        !== undefined) patch.imageUrl        = d.imageUrl;
      if (d.category        !== undefined) patch.category        = d.category;
      if (d.metaDescription !== undefined) patch.metaDescription = d.metaDescription;
      if (d.metaKeywords    !== undefined) patch.metaKeywords    = d.metaKeywords;
      if (d.status          !== undefined) patch.status          = d.status;
      await updateBlogPost(input.id, patch);
      return getBlogPostById(input.id);
    }),

  deleteOne: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const post = await getBlogPostById(input.id);
      if (!post) throw new Error("Article introuvable");
      await deleteBlogPost(input.id);   // réutilise la suppression métier existante (physique)
      return { id: input.id };
    }),
});

export type BlogResourceRouter = typeof blogResourceRouter;
