/**
 * server/routers/mediaResource.ts
 * Ressource « media » au format CONVENTION générique du back-office Refine.
 *
 * Toute ressource admin (media, puis blogPosts, seoPages…) expose EXACTEMENT
 * ces 5 procédures avec les mêmes formes d'entrée/sortie. Un seul dataProvider
 * côté client les consomme toutes. Les actions spéciales média (upload R2,
 * remplacement, usages) restent dans le routeur `media` (adminMedia.ts) — elles
 * ne polluent pas cette convention.
 */
import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  listMediaResource,
  getMediaById,
  createMediaItem,
  updateMediaItem,
  softDeleteMediaItem,
} from "../mediaLibrary";

const categoryEnum = z.enum(["blog", "realisations", "galerie", "produits", "ui", "og", "autre"]);

// ─── Formes partagées de la convention ──────────────────────────────────────────
const listInput = z.object({
  pagination: z.object({
    page:    z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(200).default(24),
  }).default({ page: 1, perPage: 24 }),
  sort: z.array(z.object({
    field: z.string(),
    order: z.enum(["asc", "desc"]),
  })).optional(),
  filters: z.array(z.object({
    field:    z.string(),
    operator: z.string().default("eq"),
    value:    z.any(),
  })).optional(),
});

// Champs éditables d'une image (utilisés par create/update)
const dataInput = z.object({
  alt:      z.string().max(500).nullable().optional(),
  title:    z.string().max(500).nullable().optional(),
  page:     z.string().max(40).nullable().optional(),
  section:  z.string().max(40).nullable().optional(),
  active:   z.boolean().optional(),
  sortOrder:z.number().int().min(0).optional(),
  category: categoryEnum.optional(),
  // create-only
  url:      z.string().url().optional(),
  filename: z.string().max(500).optional(),
  mimeType: z.string().max(100).optional(),
});

export const mediaResourceRouter = router({
  list: adminProcedure
    .input(listInput)
    .query(({ input }) => listMediaResource(input)),

  byId: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const item = await getMediaById(input.id);
      if (!item) throw new Error("Image introuvable");
      return item;
    }),

  create: adminProcedure
    .input(z.object({ data: dataInput }))
    .mutation(async ({ input, ctx }) => {
      const d = input.data;
      if (!d.url || !d.filename) {
        throw new Error("Création directe : url + filename requis (sinon passez par media.upload).");
      }
      return createMediaItem({
        url:      d.url,
        filename: d.filename,
        mimeType: d.mimeType ?? undefined,
        alt:      d.alt ?? undefined,
        title:    d.title ?? undefined,
        page:     d.page ?? null,
        section:  d.section ?? null,
        category: d.category,
        source:   "upload_web",
        uploadedBy: ctx.user.id,
      });
    }),

  update: adminProcedure
    .input(z.object({ id: z.number().int().positive(), data: dataInput }))
    .mutation(async ({ input }) => {
      const item = await getMediaById(input.id);
      if (!item) throw new Error("Image introuvable");
      const d = input.data;
      await updateMediaItem(input.id, {
        alt:       d.alt ?? undefined,
        title:     d.title ?? undefined,
        page:      d.page,          // null explicite autorisé (= à ranger)
        section:   d.section,
        active:    d.active,
        sortOrder: d.sortOrder,
        category:  d.category,
      });
      return getMediaById(input.id);
    }),

  deleteOne: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const item = await getMediaById(input.id);
      if (!item) throw new Error("Image introuvable");
      await softDeleteMediaItem(input.id);    // soft delete — R2 intact
      return { id: input.id };
    }),
});

export type MediaResourceRouter = typeof mediaResourceRouter;
