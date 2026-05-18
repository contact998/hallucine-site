/**
 * server/routers/adminMedia.ts
 * Router tRPC pour la médiathèque centrale (admin only).
 */
import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { uploadToR2, deleteFromR2, urlToR2Key } from "../r2Upload";
import {
  createMediaItem,
  getMediaById,
  getMediaByUrl,
  getMediaByCategory,
  listMedia,
  updateMediaItem,
  updateSortOrders,
  deactivateMediaItem,
  deleteMediaItem,
} from "../mediaLibrary";

// ─── Validation ───────────────────────────────────────────────────────────────

// SVG retiré : risque XSS (un SVG peut contenir <script> et s'exécuter
// sur l'origine où il est servi). Les uploads sont restreints aux formats
// raster, validés par signature binaire dans r2Upload.uploadToR2().
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo

const categoryEnum = z.enum(["blog", "realisations", "galerie", "produits", "ui", "og", "autre"]);

// ─── Router ───────────────────────────────────────────────────────────────────

export const adminMediaRouter = router({

  // ─── Lecture (admin) ────────────────────────────────────────────────────────

  list: adminProcedure
    .input(z.object({
      category:    categoryEnum.optional(),
      subcategory: z.string().optional(),
      activeOnly:  z.boolean().default(true),
      limit:       z.number().min(1).max(200).default(50),
      offset:      z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) =>
      listMedia({
        category:    input?.category,
        subcategory: input?.subcategory,
        activeOnly:  input?.activeOnly ?? true,
        limit:       input?.limit ?? 50,
        offset:      input?.offset ?? 0,
      })
    ),

  get: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => getMediaById(input.id)),

  // ─── Lecture (public) — utilisé par les pages du site en Phase 3 ────────────

  byCategory: publicProcedure
    .input(z.object({
      category:    categoryEnum,
      subcategory: z.string().optional(),
    }))
    .query(async ({ input }) =>
      getMediaByCategory(input.category, input.subcategory)
    ),

  // ─── Upload ─────────────────────────────────────────────────────────────────

  upload: adminProcedure
    .input(z.object({
      filename:    z.string().min(1).max(500),
      fileData:    z.string().min(1),           // Base64
      mimeType:    z.string().refine(
                     (v) => (ALLOWED_MIME as readonly string[]).includes(v),
                     { message: "Format non supporté (JPEG, PNG, WebP, GIF)" }
                   ),
      alt:         z.string().max(500).optional(),
      title:       z.string().max(500).optional(),
      tags:        z.array(z.string()).optional(),
      category:    categoryEnum.default("autre"),
      subcategory: z.string().max(100).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Décoder Base64
      let buffer: Buffer;
      try {
        buffer = Buffer.from(input.fileData, "base64");
      } catch {
        throw new Error("Données Base64 invalides");
      }

      if (buffer.length > MAX_SIZE_BYTES) {
        throw new Error(`Fichier trop volumineux (max ${MAX_SIZE_BYTES / 1024 / 1024} Mo)`);
      }

      // Déterminer le dossier R2 selon la catégorie
      const folder = input.category === "og" ? "og"
                   : input.category === "blog" ? "blog"
                   : "media";

      // Upload vers R2
      const r2 = await uploadToR2(buffer, input.mimeType, input.filename, folder);

      // Vérifier unicité (ne devrait pas arriver vu les noms aléatoires)
      const existing = await getMediaByUrl(r2.url);
      if (existing) throw new Error("Cette URL existe déjà en base");

      // Insérer en DB
      const item = await createMediaItem({
        url:         r2.url,
        filename:    r2.filename,
        mimeType:    r2.mimeType,
        filesize:    r2.filesize,
        alt:         input.alt,
        title:       input.title ?? input.filename.replace(/\.[^.]+$/, ""),
        tags:        input.tags,
        category:    input.category,
        subcategory: input.subcategory,
        source:      "upload_web",
        uploadedBy:  ctx.user.id,
      });

      return { success: true, item };
    }),

  // ─── Modifier ───────────────────────────────────────────────────────────────

  update: adminProcedure
    .input(z.object({
      id:          z.number().int().positive(),
      alt:         z.string().max(500).optional(),
      title:       z.string().max(500).optional(),
      tags:        z.array(z.string()).optional(),
      category:    categoryEnum.optional(),
      subcategory: z.string().max(100).optional(),
      active:      z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const item = await getMediaById(id);
      if (!item) throw new Error("Image introuvable");
      await updateMediaItem(id, data);
      return { success: true, item: await getMediaById(id) };
    }),

  /** Réordonner les images (drag & drop dans l'admin) */
  reorder: adminProcedure
    .input(z.array(z.object({
      id:        z.number().int().positive(),
      sortOrder: z.number().int().min(0),
    })))
    .mutation(async ({ input }) => {
      await updateSortOrders(input);
      return { success: true };
    }),

  // ─── Supprimer / Désactiver ──────────────────────────────────────────────────

  /** Désactive sans supprimer (recommandé si usageCount > 0) */
  deactivate: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deactivateMediaItem(input.id);
      return { success: true };
    }),

  /**
   * Supprime définitivement — DB + R2.
   * Refusé si usageCount > 0.
   */
  delete: adminProcedure
    .input(z.object({
      id:          z.number().int().positive(),
      deleteOnR2:  z.boolean().default(true), // false = garder le fichier sur R2
    }))
    .mutation(async ({ input }) => {
      const { key } = await deleteMediaItem(input.id);

      if (input.deleteOnR2) {
        try {
          await deleteFromR2(key);
        } catch (err) {
          // Log mais ne bloque pas — la ligne DB est déjà supprimée
          console.error("[Media] Échec suppression R2 (fichier déjà supprimé ?):", err);
        }
      }

      return { success: true };
    }),
});

export type AdminMediaRouter = typeof adminMediaRouter;
