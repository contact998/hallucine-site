import { eq, desc, and, sql, asc, or, like, isNotNull } from "drizzle-orm";
import { blogPosts, InsertBlogPost, BlogPost } from "../drizzle/schema";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const blogPool = mysql.createPool({
  uri: process.env.BLOG_DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 5,
});
const db = drizzle(blogPool, { mode: "default" });

// ─── DeepL ───────────────────────────────────────────────────────

export const DEEPL_LANGS: Record<string, string> = {
  en: "EN-GB",
  de: "DE",
  es: "ES",
  it: "IT",
  pt: "PT-PT",
};

/** Les clés DeepL Free se terminent par ":fx" et utilisent api-free.deepl.com ;
 *  les clés Pro utilisent api.deepl.com. Même détection que translate-locales.mjs. */
export function deeplHostForKey(apiKey: string): string {
  return apiKey.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";
}

async function translateWithDeepL(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY not configured");

  const res = await fetch(`https://${deeplHostForKey(apiKey)}/v2/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `DeepL-Auth-Key ${apiKey}` },
    body: JSON.stringify({
      text: [text],
      target_lang: targetLang,
      source_lang: "FR",
      tag_handling: "html",
    }),
  });

  if (!res.ok) throw new Error(`DeepL error: ${res.status}`);
  const data = await res.json() as { translations: { text: string }[] };
  return data.translations[0].text;
}

/** Traduit un article vers UNE langue et publie la traduction. Renvoie le slug créé. */
async function translatePostToLang(originalPost: BlogPost, lang: string, deeplLang: string): Promise<string> {
  const [translatedTitle, translatedContent, translatedExcerpt, translatedMeta] = await Promise.all([
    translateWithDeepL(originalPost.title, deeplLang),
    translateWithDeepL(originalPost.content, deeplLang),
    originalPost.excerpt ? translateWithDeepL(originalPost.excerpt, deeplLang) : Promise.resolve(null),
    originalPost.metaDescription ? translateWithDeepL(originalPost.metaDescription, deeplLang) : Promise.resolve(null),
  ]);

  // DeepL renvoie des entités HTML (&#x27; …) : on décode les champs texte
  // (titre, extrait, meta) avant stockage — le contenu reste du HTML.
  const cleanTitle = decodeHtmlEntities(translatedTitle);
  const cleanExcerpt = translatedExcerpt ? decodeHtmlEntities(translatedExcerpt) : null;
  const cleanMeta = translatedMeta ? decodeHtmlEntities(translatedMeta) : null;
  const slug = await uniqueSlug(slugify(cleanTitle));

  await db.insert(blogPosts).values({
    title: cleanTitle,
    slug,
    content: translatedContent,
    excerpt: cleanExcerpt,
    imageUrl: originalPost.imageUrl ?? null,
    lang,
    parentId: originalPost.id,
    status: "published",
    // La traduction garde la date de l'original : l'ordre chronologique des
    // blogs étrangers reste celui du blog FR, y compris lors d'un rattrapage.
    publishedAt: originalPost.publishedAt ?? new Date(),
    metaKeywords: originalPost.metaKeywords ?? null,
    metaDescription: cleanMeta,
    author: originalPost.author ?? "Hallucine",
    category: originalPost.category ?? null,
  });

  return slug;
}

/** Traduit et publie un article dans toutes les langues via DeepL */
export async function translateAndPublishPost(originalPost: BlogPost): Promise<void> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.warn("[Blog] DEEPL_API_KEY absent — traduction ignorée");
    return;
  }

  for (const [lang, deeplLang] of Object.entries(DEEPL_LANGS)) {
    try {
      const slug = await translatePostToLang(originalPost, lang, deeplLang);
      console.log(`[Blog] Traduction ${lang} publiée : ${slug}`);
    } catch (err) {
      console.error(`[Blog] Erreur traduction ${lang}:`, err);
    }
  }
}



// ─── Helpers ────────────────────────────────────────────────────

/**
 * Décode les entités HTML courantes. DeepL (tag_handling:"html") renvoie les
 * apostrophes en `&#x27;`, ce qui polluait les slugs en « x27 » (et `&amp;` → « amp »).
 */
export function decodeHtmlEntities(input: string): string {
  if (!input) return input;
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&"); // en dernier, pour ne pas re-décoder une entité déjà décodée
}

/** Génère un slug URL propre depuis un titre (décode d'abord les entités HTML). */
export function slugify(title: string): string {
  return decodeHtmlEntities(title)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 200);
}



/** Hash simple et stable pour répartir les articles sur la bibliothèque d'images */
function stableStringHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

async function pickDeterministicHeaderImage(seed: string): Promise<string | null> {
  try {
    const { getMediaByCategory } = await import("./mediaLibrary");
    const items = await getMediaByCategory("blog");
    if (items.length > 0) {
      const index = stableStringHash(seed) % items.length;
      return items[index]?.url ?? null;
    }
  } catch (err) {
    console.warn("[Blog] Impossible de lire la médiathèque :", err);
  }
  const raw = (process.env.BLOG_IMAGE_URLS ?? "").split(/[\n,;]/).map(u => u.trim()).filter(u => /^https?:\/\//i.test(u));
  if (raw.length === 0) return null;
  return raw[stableStringHash(seed) % raw.length] ?? null;
}

/** Génère un slug unique (ajoute -2, -3... si conflit) */
async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let attempt = 1;
  while (true) {
    const existing = await db.select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    if (existing.length === 0) return slug;
    attempt++;
    slug = `${base}-${attempt}`;
  }
}

// ─── CRUD ────────────────────────────────────────────────────────

/** Créer un article */
export async function createBlogPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  lang?: string;
  parentId?: number;
  status?: "draft" | "published" | "scheduled";
  publishedAt?: Date;
  metaKeywords?: string;
  metaDescription?: string;
  author?: string;
  category?: string;
}): Promise<BlogPost> {
  const slug = await uniqueSlug(slugify(data.title));
  const resolvedImageUrl =
    data.imageUrl?.trim() || await pickDeterministicHeaderImage(`${data.lang ?? "fr"}:${slug}`);

  await db.insert(blogPosts).values({
    title: data.title,
    slug,
    content: data.content,
    excerpt: data.excerpt ?? null,
    imageUrl: resolvedImageUrl ?? null,
    lang: data.lang ?? "fr",
    parentId: data.parentId ?? null,
    status: data.status ?? "draft",
    publishedAt: data.publishedAt ?? null,
    metaKeywords: data.metaKeywords ?? null,
    metaDescription: data.metaDescription ?? null,
    author: data.author ?? "OpenClaw",
    category: data.category ?? null,
  });

  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return post;
}

/** Mettre à jour un article */
export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<void> {
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

/** Supprimer un article */
export async function deleteBlogPost(id: number): Promise<void> {
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

/** Récupérer un article par slug */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return post ?? null;
}

/** Récupérer un article par ID */
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return post ?? null;
}

/** Lister les articles publiés (public) */
export async function getPublishedPosts(lang: string = "fr", limit: number = 20, offset: number = 0): Promise<BlogPost[]> {
  return db.select().from(blogPosts)
    .where(and(
      eq(blogPosts.status, "published"),
      eq(blogPosts.lang, lang),
    ))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset);
}

/** Lister tous les articles (admin) */
export async function getAllBlogPosts(limit: number = 100): Promise<BlogPost[]> {
  return db.select().from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
    .limit(limit);
}

/** Publier un article */
export async function publishBlogPost(id: number): Promise<void> {
  await db.update(blogPosts).set({
    status: "published",
    publishedAt: new Date(),
  }).where(eq(blogPosts.id, id));
}

/** Compter les articles publiés */
export async function countPublishedPosts(lang: string = "fr"): Promise<number> {
  const [result] = await db.select({ count: sql<number>`count(*)` })
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), eq(blogPosts.lang, lang)));
  return Number(result?.count ?? 0);
}

// ─── Rattrapage traductions ──────────────────────────────────────

export type BackfillReport = {
  processed: { parentId: number; lang: string; slug: string }[];
  errors: { parentId: number; lang: string; error: string }[];
  skippedNonPublished: { parentId: number; lang: string; status: string }[];
  remaining: number;
};

/**
 * Traduit les articles FR publiés dans les langues où la traduction MANQUE
 * (aucune ligne enfant, quel que soit son statut). Batché (`maxItems`) pour
 * rester sous le timeout HTTP Cloudflare (100 s) — relancer jusqu'à remaining=0.
 */
export async function backfillMissingTranslations(maxItems: number = 8): Promise<BackfillReport> {
  const frPosts = await db.select().from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), eq(blogPosts.lang, "fr")))
    .orderBy(asc(blogPosts.id));

  const todo: { post: BlogPost; lang: string; deeplLang: string }[] = [];
  const skippedNonPublished: BackfillReport["skippedNonPublished"] = [];

  for (const post of frPosts) {
    const existing = await db.select({ lang: blogPosts.lang, status: blogPosts.status })
      .from(blogPosts)
      .where(eq(blogPosts.parentId, post.id));
    const statusByLang = new Map(existing.map(r => [r.lang, r.status]));
    for (const [lang, deeplLang] of Object.entries(DEEPL_LANGS)) {
      const status = statusByLang.get(lang);
      if (status === undefined) todo.push({ post, lang, deeplLang });
      else if (status !== "published") skippedNonPublished.push({ parentId: post.id, lang, status });
    }
  }

  const processed: BackfillReport["processed"] = [];
  const errors: BackfillReport["errors"] = [];

  for (const item of todo.slice(0, maxItems)) {
    try {
      const slug = await translatePostToLang(item.post, item.lang, item.deeplLang);
      processed.push({ parentId: item.post.id, lang: item.lang, slug });
      console.log(`[Blog] Rattrapage ${item.lang} : ${slug} (parent ${item.post.id})`);
    } catch (err) {
      errors.push({
        parentId: item.post.id,
        lang: item.lang,
        error: err instanceof Error ? err.message : String(err),
      });
      console.error(`[Blog] Erreur rattrapage ${item.lang} (parent ${item.post.id}):`, err);
    }
  }

  return { processed, errors, skippedNonPublished, remaining: Math.max(0, todo.length - maxItems) };
}

/** Aligne l'image de chaque traduction sur celle de son article parent (source FR). */
export async function harmonizeTranslationImages(): Promise<{ checked: number; updated: number }> {
  const translations = await db.select().from(blogPosts).where(isNotNull(blogPosts.parentId));
  let updated = 0;
  for (const t of translations) {
    const parent = t.parentId ? await getBlogPostById(t.parentId) : null;
    if (!parent) continue;
    const target = parent.imageUrl ?? null;
    if ((t.imageUrl ?? null) !== target) {
      await db.update(blogPosts).set({ imageUrl: target }).where(eq(blogPosts.id, t.id));
      updated++;
    }
  }
  return { checked: translations.length, updated };
}

/**
 * Articles publiés (TOUTES langues) projetés pour le sitemap dynamique.
 * Renvoie de quoi construire les <loc> par TLD et les hreflang croisés (parentId).
 */
export async function getAllPublishedForSitemap(): Promise<
  { id: number; slug: string; lang: string; parentId: number | null; updatedAt: Date }[]
> {
  return db.select({
    id: blogPosts.id,
    slug: blogPosts.slug,
    lang: blogPosts.lang,
    parentId: blogPosts.parentId,
    updatedAt: blogPosts.updatedAt,
  })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));
}

// ─── Convention « ressource » (dataProvider Refine) ─────────────────────────────
// Même forme que mediaResource : list({pagination,sort,filters})→{data,total}.

export type BlogResourceFilter = { field: string; operator: string; value: unknown };
export type BlogResourceSort   = { field: string; order: "asc" | "desc" };

/** Liste paginée/filtrée/triée des articles pour l'admin (exclut les soft-deleted). */
export async function listBlogResource(opts: {
  pagination: { page: number; perPage: number };
  sort?: BlogResourceSort[];
  filters?: BlogResourceFilter[];
}): Promise<{ data: BlogPost[]; total: number }> {
  const { pagination, sort, filters } = opts;
  const conditions: any[] = [];

  for (const f of filters ?? []) {
    const v = f.value;
    if (v === undefined || v === "" || v === null) continue;
    switch (f.field) {
      case "lang":     conditions.push(eq(blogPosts.lang, String(v))); break;
      case "status":   conditions.push(eq(blogPosts.status, String(v) as "draft" | "published" | "scheduled")); break;
      case "category": conditions.push(eq(blogPosts.category, String(v))); break;
      case "q":
      case "search": {
        const q = `%${String(v).trim().replace(/[%_]/g, "\\$&")}%`;
        conditions.push(or(like(blogPosts.title, q), like(blogPosts.excerpt, q), like(blogPosts.slug, q))!);
        break;
      }
    }
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const sortCol = (field?: string) =>
    field === "title"       ? blogPosts.title :
    field === "publishedAt" ? blogPosts.publishedAt :
    field === "status"      ? blogPosts.status :
    blogPosts.createdAt;
  const s = sort?.[0];
  const order = s ? (s.order === "asc" ? asc(sortCol(s.field)) : desc(sortCol(s.field))) : desc(blogPosts.createdAt);

  const perPage = Math.min(Math.max(pagination.perPage, 1), 200);
  const page    = Math.max(pagination.page, 1);

  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts).where(where);
  const data = await db.select().from(blogPosts).where(where)
    .orderBy(order, desc(blogPosts.createdAt))
    .limit(perPage).offset((page - 1) * perPage);

  return { data, total: Number(count) };
}

/** Soft delete blog — DÉSACTIVÉ tant que la colonne deletedAt n'existe pas sur la
 *  base du blog (BLOG_DATABASE_URL ≠ DATABASE_URL). Réactiver après ALTER. */
export async function softDeleteBlogPost(_id: number): Promise<void> {
  throw new Error("Retrait d'article temporairement indisponible (colonne deletedAt à ajouter sur la base blog).");
}
