import { db } from '../server/db.ts';
import { blogPosts } from '../drizzle/schema.ts';
import { like, or } from 'drizzle-orm';

const r = await db.select({ slug: blogPosts.slug, title: blogPosts.title }).from(blogPosts).where(
  or(like(blogPosts.slug, '%ecrans-geants%'), like(blogPosts.slug, '%projections-grandioses%'))
);
console.log('Résultats:', JSON.stringify(r, null, 2));
console.log('Total:', r.length);
process.exit(0);
