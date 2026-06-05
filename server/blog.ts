import { eq, desc, and, sql, asc, or, like } from "drizzle-orm";
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

const DEEPL_LANGS: Record<string, string> = {
  en: "EN-GB",
  de: "DE",
  es: "ES",
  it: "IT",
};

async function translateWithDeepL(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY not configured");

  const res = await fetch("https://api-free.deepl.com/v2/translate", {
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

/** Traduit et publie un article dans toutes les langues via DeepL */
export async function translateAndPublishPost(originalPost: BlogPost): Promise<void> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.warn("[Blog] DEEPL_API_KEY absent — traduction ignorée");
    return;
  }

  for (const [lang, deeplLang] of Object.entries(DEEPL_LANGS)) {
    try {
      const [translatedTitle, translatedContent, translatedExcerpt, translatedMeta] = await Promise.all([
        translateWithDeepL(originalPost.title, deeplLang),
        translateWithDeepL(originalPost.content, deeplLang),
        originalPost.excerpt ? translateWithDeepL(originalPost.excerpt, deeplLang) : Promise.resolve(null),
        originalPost.metaDescription ? translateWithDeepL(originalPost.metaDescription, deeplLang) : Promise.resolve(null),
      ]);

      const slug = await uniqueSlug(slugify(translatedTitle));

      await db.insert(blogPosts).values({
        title: translatedTitle,
        slug,
        content: translatedContent,
        excerpt: translatedExcerpt ?? null,
        imageUrl: originalPost.imageUrl ?? null,
        lang,
        parentId: originalPost.id,
        status: "published",
        publishedAt: new Date(),
        metaKeywords: originalPost.metaKeywords ?? null,
        metaDescription: translatedMeta ?? null,
        author: originalPost.author ?? "Hallucine",
        category: originalPost.category ?? null,
      });

      console.log(`[Blog] Traduction ${lang} publiée : ${slug}`);
    } catch (err) {
      console.error(`[Blog] Erreur traduction ${lang}:`, err);
    }
  }
}



// ─── Helpers ────────────────────────────────────────────────────

/** Génère un slug URL propre depuis un titre */
export function slugify(title: string): string {
  return title
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
