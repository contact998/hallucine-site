/**
 * server/routers/seoResource.ts
 * Ressource « seo_overrides » au format convention (dataProvider Refine), admin-only.
 */
import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  listSeoResource, getSeoById, createSeo, updateSeo, softDeleteSeo,
} from "../seo";

const listInput = z.object({
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(200).default(50),
  }).default({ page: 1, perPage: 50 }),
  sort: z.array(z.object({ field: z.string(), order: z.enum(["asc", "desc"]) })).optional(),
  filters: z.array(z.object({ field: z.string(), operator: z.string().default("eq"), value: z.any() })).optional(),
});

const dataInput = z.object({
  path:        z.string().min(1).max(255).optional(),
  title:       z.string().max(255).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  ogImage:     z.string().max(1000).nullable().optional(),
  noindex:     z.boolean().optional(),
  active:      z.boolean().optional(),
});

export const seoResourceRouter = router({
  list: adminProcedure.input(listInput).query(({ input }) => listSeoResource(input)),

  byId: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const r = await getSeoById(input.id);
      if (!r) throw new Error("Override introuvable");
      return r;
    }),

  create: adminProcedure
    .input(z.object({ data: dataInput }))
    .mutation(async ({ input }) => {
      if (!input.data.path) throw new Error("Chemin requis (ex: /ecran-geant).");
      return createSeo({ ...input.data, path: input.data.path });
    }),

  update: adminProcedure
    .input(z.object({ id: z.number().int().positive(), data: dataInput }))
    .mutation(async ({ input }) => {
      const r = await getSeoById(input.id);
      if (!r) throw new Error("Override introuvable");
      await updateSeo(input.id, input.data);
      return getSeoById(input.id);
    }),

  deleteOne: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const r = await getSeoById(input.id);
      if (!r) throw new Error("Override introuvable");
      await softDeleteSeo(input.id);
      return { id: input.id };
    }),
});

export type SeoResourceRouter = typeof seoResourceRouter;
