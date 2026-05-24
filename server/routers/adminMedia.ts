/**
 * server/routers/adminMedia.ts
 * Router tRPC pour la médiathèque centrale (admin only).
 */
import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  uploadToR2,
  deleteFromR2,
  urlToR2Key,
  renameOnR2,
  buildSeoKey,
} from "../r2Upload";
import {
  createMediaItem,
  getMediaById,
  getMediaByUrl,
  getMediaByIds,
  getMediaByCategory,
  listMedia,
  updateMediaItem,
  updateMediaR2Key,
  updateSortOrders,
  deactivateMediaItem,
  deleteMediaItem,
  bulkDeactivateMedia,
  bulkDeleteMedia,
  bulkUpdateCategory,
} from "../mediaLibrary";

// ─── Validation ───────────────────────────────────────────────────────────────

// SVG retiré : risque XSS (un SVG peut contenir <script> et s'exécuter
// sur l'origine où il est servi). Les uploads sont restreints aux formats
// raster, validés par signature binaire dans r2Upload.uploadToR2().
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo

const categoryEnum = z.enum(["blog", "realisations", "galerie", "produits", "ui", "og", "autre"]);
const sortFieldEnum = z.enum(["sortOrder", "createdAt", "filesize", "title", "usageCount"]);
const sortDirEnum   = z.enum(["asc", "desc"]);

// ─── Router ───────────────────────────────────────────────────────────────────

export const adminMediaRouter = router({

  // ─── Lecture (admin) ────────────────────────────────────────────────────────

  list: adminProcedure
    .input(z.object({
      category:    categoryEnum.optional(),
      subcategory: z.string().optional(),
      activeOnly:  z.boolean().default(true),
      search:      z.string().optional(),
      sortBy:      sortFieldEnum.optional(),
      sortDir:     sortDirEnum.optional(),
      limit:       z.number().min(1).max(200).default(50),
      offset:      z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) =>
      listMedia({
        category:    input?.category,
        subcategory: input?.subcategory,
        activeOnly:  input?.activeOnly ?? true,
        search:      input?.search,
        sortBy:      input?.sortBy,
        sortDir:     input?.sortDir,
        limit:       input?.limit ?? 50,
        offset:      input?.offset ?? 0,
      })
    ),

  get: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => getMediaById(input.id)),

  /**
   * Cherche où une image est référencée dans le code source.
   * Scan ./client/src + ./server pour l'URL ou le nom de fichier.
   * Retourne max 50 occurrences.
   */
  findUsage: adminProcedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ input }) => {
      const url      = input.url;
      const filename = url.split("/").pop() ?? "";
      const needles  = [url, filename].filter(Boolean);

      const roots = ["client/src", "server"].map((r) => path.resolve(process.cwd(), r));
      const exts  = new Set([".tsx", ".ts", ".jsx", ".js", ".json", ".md", ".html", ".css"]);
      const skipDirs = new Set(["node_modules", "dist", ".git", ".vite", ".turbo"]);

      const matches: { file: string; line: number; snippet: string }[] = [];
      const MAX = 50;

      async function walk(dir: string): Promise<void> {
        if (matches.length >= MAX) return;
        let entries: import("fs").Dirent[];
        try {
          entries = await fs.readdir(dir, { withFileTypes: true });
        } catch {
          return;
        }
        for (const e of entries) {
          if (matches.length >= MAX) return;
          const p = path.join(dir, e.name);
          if (e.isDirectory()) {
            if (skipDirs.has(e.name)) continue;
            await walk(p);
          } else if (e.isFile() && exts.has(path.extname(e.name))) {
            try {
              const content = await fs.readFile(p, "utf-8");
              if (needles.some((n) => content.includes(n))) {
                const lines = content.split("\n");
                lines.forEach((line, i) => {
                  if (matches.length >= MAX) return;
                  if (needles.some((n) => line.includes(n))) {
                    matches.push({
                      file:    path.relative(process.cwd(), p),
                      line:    i + 1,
                      snippet: line.trim().slice(0, 200),
                    });
                  }
                });
              }
            } catch {
              // ignore unreadable file
            }
          }
        }
      }

      for (const root of roots) {
        await walk(root);
      }

      return { matches, truncated: matches.length >= MAX };
    }),

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

  /**
   * Renomme la clé R2 d'une image (SEO-friendly slug).
   * Côté R2 : copy + delete de l'ancienne clé.
   * Côté DB : url + filename mis à jour.
   * ATTENTION : casse les références hardcodées si l'image est utilisée
   * en dur dans le code (usageCount > 0). Le client doit confirmer.
   */
  renameR2: adminProcedure
    .input(z.object({
      id:        z.number().int().positive(),
      slug:      z.string().min(2).max(100),  // slug descriptif (ex: "ecran-cinema-jardin")
    }))
    .mutation(async ({ input }) => {
      const item = await getMediaById(input.id);
      if (!item) throw new Error("Image introuvable");

      const oldKey = urlToR2Key(item.url);
      const folder = oldKey.split("/")[0] as "blog" | "media" | "og" | "assets";
      // Conserver l'extension d'origine
      const ext    = (oldKey.split(".").pop() ?? "jpg").toLowerCase();

      const newKey = buildSeoKey(folder, input.slug, ext);
      const { newUrl } = await renameOnR2(oldKey, newKey, item.mimeType ?? undefined);

      const newFilename = newKey.split("/").pop()!;
      await updateMediaR2Key(item.id, newUrl, newFilename);

      return { success: true, oldKey, newKey, newUrl };
    }),

  reorder: adminProcedure
    .input(z.array(z.object({
      id:        z.number().int().positive(),
      sortOrder: z.number().int().min(0),
    })))
    .mutation(async ({ input }) => {
      await updateSortOrders(input);
      return { success: true };
    }),

  // ─── Opérations en masse ─────────────────────────────────────────────────────

  bulkDeactivate: adminProcedure
    .input(z.object({ ids: z.array(z.number().int().positive()).min(1).max(200) }))
    .mutation(async ({ input }) => {
      const n = await bulkDeactivateMedia(input.ids);
      return { success: true, count: n };
    }),

  bulkUpdateCategory: adminProcedure
    .input(z.object({
      ids:         z.array(z.number().int().positive()).min(1).max(200),
      category:    categoryEnum,
      subcategory: z.string().max(100).optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      const n = await bulkUpdateCategory(input.ids, input.category, input.subcategory);
      return { success: true, count: n };
    }),

  bulkDelete: adminProcedure
    .input(z.object({
      ids:        z.array(z.number().int().positive()).min(1).max(200),
      deleteOnR2: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const { keys } = await bulkDeleteMedia(input.ids);
      if (input.deleteOnR2) {
        for (const key of keys) {
          try {
            await deleteFromR2(key);
          } catch (err) {
            console.error("[Media bulk] R2 delete fail:", key, err);
          }
        }
      }
      return { success: true, count: keys.length };
    }),

  // ─── Supprimer / Désactiver (unitaire) ───────────────────────────────────────

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
