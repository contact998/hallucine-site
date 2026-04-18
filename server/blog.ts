import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { blogPosts, InsertBlogPost, BlogPost } from "../drizzle/schema";

// Connexion dédiée à la base blog (MySQL-4O8O sur Railway)
const blogPool = mysql.createPool({
  uri: process.env.BLOG_DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 5,
  connectTimeout: 10_000,
});

const db = drizzle(blogPool, { mode: "default" });

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

  await db.insert(blogPosts).values({
    title: data.title,
    slug,
    content: data.content,
    excerpt: data.excerpt ?? null,
    imageUrl: data.imageUrl ?? null,
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
      eq(blogPosts.lang, lang)
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
