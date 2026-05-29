/**
 * server/seo.ts
 * Overrides SEO appliqués AU RUNTIME (par chemin d'URL), sans toucher au prerender.
 * - cache mémoire (TTL) pour ne pas taper la DB à chaque requête
 * - applySeoOverride() réécrit title/description/og/robots dans le HTML servi
 * - helpers convention (list/byId/create/update/deleteOne) pour Refine
 */
import { eq, and, sql, desc, asc, or, like, isNull } from "drizzle-orm";
import { db } from "./db";
import { seoOverrides } from "../drizzle/schema";
import type { SeoOverride } from "../drizzle/schema";

// ─── Normalisation de chemin ────────────────────────────────────────────────────
export function normalizeSeoPath(p: string): string {
  let path = (p || "/").split("?")[0].split("#")[0];
  if (!path.startsWith("/")) path = "/" + path;
  if (path.length > 1 && path.endsWith("/")) path = path.replace(/\/+$/, "");
  return path || "/";
}

// ─── Cache mémoire des overrides actifs ─────────────────────────────────────────
let cache: Map<string, SeoOverride> | null = null;
let cacheAt = 0;
const TTL_MS = 60_000;

async function loadCache(): Promise<Map<string, SeoOverride>> {
  const rows = await db.select().from(seoOverrides)
    .where(and(eq(seoOverrides.active, true), isNull(seoOverrides.deletedAt)));
  const m = new Map<string, SeoOverride>();
  for (const r of rows) m.set(normalizeSeoPath(r.path), r);
  return m;
}

/** Override actif pour ce chemin, ou null. Tolérant aux pannes DB (renvoie null). */
export async function getSeoOverrideForPath(path: string, now: number): Promise<SeoOverride | null> {
  try {
    if (!cache || now - cacheAt > TTL_MS) {
      cache = await loadCache();
      cacheAt = now;
    }
    return cache.get(normalizeSeoPath(path)) ?? null;
  } catch (e) {
    console.error("[seo] getSeoOverrideForPath échec:", e instanceof Error ? e.message : e);
    return null;
  }
}

/** Invalide le cache (après une écriture admin) → prise en compte immédiate. */
export function bumpSeoCache(): void { cache = null; cacheAt = 0; }

// ─── Application dans le HTML ────────────────────────────────────────────────────
function esc(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function setMetaContent(html: string, identifier: string, value: string): string {
  const id = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(<meta[^>]*${id}[^>]*content=")[^"]*(")`, "i");
  return html.replace(re, `$1${esc(value)}$2`);
}

/** Réécrit les balises SEO du HTML selon l'override. Tolérant : si une balise
 *  n'existe pas, on l'ignore. À appeler dans un try/catch côté serveur. */
export function applySeoOverride(html: string, ov: SeoOverride): string {
  let out = html;
  if (ov.title) {
    out = out.replace(/<title>[^<]*<\/title>/i, `<title>${esc(ov.title)}</title>`);
    out = setMetaContent(out, 'property="og:title"', ov.title);
    out = setMetaContent(out, 'name="twitter:title"', ov.title);
  }
  if (ov.description) {
    out = setMetaContent(out, 'name="description"', ov.description);
    out = setMetaContent(out, 'property="og:description"', ov.description);
    out = setMetaContent(out, 'name="twitter:description"', ov.description);
  }
  if (ov.ogImage) {
    out = setMetaContent(out, 'property="og:image"', ov.ogImage);
    out = setMetaContent(out, 'name="twitter:image"', ov.ogImage);
  }
  if (ov.noindex) {
    out = setMetaContent(out, 'name="robots"', "noindex, nofollow");
  }
  return out;
}

// ─── Convention « ressource » (Refine) ──────────────────────────────────────────
export type SeoFilter = { field: string; operator: string; value: unknown };
export type SeoSort   = { field: string; order: "asc" | "desc" };

export async function listSeoResource(opts: {
  pagination: { page: number; perPage: number };
  sort?: SeoSort[];
  filters?: SeoFilter[];
}): Promise<{ data: SeoOverride[]; total: number }> {
  const { pagination, sort, filters } = opts;
  const conditions: any[] = [isNull(seoOverrides.deletedAt)];
  for (const f of filters ?? []) {
    const v = f.value;
    if (v === undefined || v === "" || v === null) continue;
    switch (f.field) {
      case "active": conditions.push(eq(seoOverrides.active, Boolean(v))); break;
      case "q":
      case "search": {
        const q = `%${String(v).trim().replace(/[%_]/g, "\\$&")}%`;
        conditions.push(or(like(seoOverrides.path, q), like(seoOverrides.title, q))!);
        break;
      }
    }
  }
  const where = and(...conditions);
  const s = sort?.[0];
  const col = s?.field === "title" ? seoOverrides.title : seoOverrides.path;
  const order = s ? (s.order === "desc" ? desc(col) : asc(col)) : asc(seoOverrides.path);
  const perPage = Math.min(Math.max(pagination.perPage, 1), 200);
  const page = Math.max(pagination.page, 1);
  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(seoOverrides).where(where);
  const data = await db.select().from(seoOverrides).where(where)
    .orderBy(order).limit(perPage).offset((page - 1) * perPage);
  return { data, total: Number(count) };
}

export async function getSeoById(id: number): Promise<SeoOverride | null> {
  const [r] = await db.select().from(seoOverrides).where(eq(seoOverrides.id, id)).limit(1);
  return r ?? null;
}

export async function createSeo(data: {
  path: string; title?: string | null; description?: string | null;
  ogImage?: string | null; noindex?: boolean; active?: boolean;
}): Promise<SeoOverride> {
  const path = normalizeSeoPath(data.path);
  await db.insert(seoOverrides).values({
    path,
    title: data.title ?? null,
    description: data.description ?? null,
    ogImage: data.ogImage ?? null,
    noindex: data.noindex ?? false,
    active: data.active ?? true,
  });
  bumpSeoCache();
  const [r] = await db.select().from(seoOverrides).where(eq(seoOverrides.path, path)).orderBy(desc(seoOverrides.id)).limit(1);
  return r;
}

export async function updateSeo(id: number, data: {
  path?: string; title?: string | null; description?: string | null;
  ogImage?: string | null; noindex?: boolean; active?: boolean;
}): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (data.path        !== undefined) patch.path        = normalizeSeoPath(data.path);
  if (data.title       !== undefined) patch.title       = data.title;
  if (data.description !== undefined) patch.description = data.description;
  if (data.ogImage     !== undefined) patch.ogImage     = data.ogImage;
  if (data.noindex     !== undefined) patch.noindex     = data.noindex;
  if (data.active      !== undefined) patch.active      = data.active;
  if (Object.keys(patch).length) {
    await db.update(seoOverrides).set(patch).where(eq(seoOverrides.id, id));
    bumpSeoCache();
  }
}

export async function softDeleteSeo(id: number): Promise<void> {
  await db.update(seoOverrides).set({ deletedAt: new Date() }).where(eq(seoOverrides.id, id));
  bumpSeoCache();
}
