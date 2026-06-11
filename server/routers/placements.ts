/**
 * server/routers/placements.ts
 * API des emplacements média (refonte « fond + emplacements »).
 *   - Lecture site (publicProcedure) : sert useSlot / useGallery et le prerender SSR.
 *   - Gestion admin (adminProcedure) : piocher dans le fond, réordonner, retirer.
 * S'appuie sur le contrat server/placements.ts.
 */
import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getPlacedAssets,
  getPlacedAsset,
  setSingle,
  addToGallery,
  removePlacement,
  reorderGallery,
  setGallery,
} from "../placements";

const slotKey  = z.string().min(1).max(80);
const entityId = z.number().int().positive().nullish();
const assetId  = z.number().int().positive();

export const placementsRouter = router({
  // ─── Lecture (site / SSR) ──────────────────────────────────────────────────
  bySlot: publicProcedure
    .input(z.object({ slotKey, entityId }))
    .query(({ input }) => getPlacedAssets(input.slotKey, input.entityId ?? null)),

  single: publicProcedure
    .input(z.object({ slotKey, entityId }))
    .query(({ input }) => getPlacedAsset(input.slotKey, input.entityId ?? null)),

  // ─── Gestion (admin) ───────────────────────────────────────────────────────
  setSingle: adminProcedure
    .input(z.object({ slotKey, entityId, assetId: assetId.nullable() }))
    .mutation(({ input }) => setSingle(input.slotKey, input.entityId ?? null, input.assetId)),

  addToGallery: adminProcedure
    .input(z.object({ slotKey, entityId, assetId }))
    .mutation(({ input }) => addToGallery(input.slotKey, input.assetId, input.entityId ?? null)),

  remove: adminProcedure
    .input(z.object({ placementId: z.number().int().positive() }))
    .mutation(({ input }) => removePlacement(input.placementId)),

  reorder: adminProcedure
    .input(z.object({ placementIds: z.array(z.number().int().positive()) }))
    .mutation(({ input }) => reorderGallery(input.placementIds)),

  setGallery: adminProcedure
    .input(z.object({ slotKey, entityId, assetIds: z.array(assetId) }))
    .mutation(({ input }) => setGallery(input.slotKey, input.assetIds, input.entityId ?? null)),
});

export type PlacementsRouter = typeof placementsRouter;
