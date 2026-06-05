/**
 * fix-blog-slugs.mjs — Migration ponctuelle : nettoie les slugs/titres d'articles
 * de blog pollués par des entités HTML (DeepL renvoie `&#x27;` → slug en « x27 »).
 *
 * Réutilise la logique testée de server/blog.ts (decodeHtmlEntities + slugify).
 * Le titre stocké contient encore l'entité, donc on peut recalculer un slug propre.
 *
 * Usage (en local via .env.local — blog_posts vit dans la base `railway`, donc
 * DATABASE_URL suffit ; ou via `railway run` en prod) :
 *   npx tsx scripts/fix-blog-slugs.mjs           # DRY-RUN : liste ce qui changerait
 *   npx tsx scripts/fix-blog-slugs.mjs --apply   # applique les mises à jour
 *
 * Sortie : les couples ancien_slug → nouveau_slug. Ces couples sont figés dans
 * server/blogSlugRedirects.ts (301 servies par server/_core/index.ts).
 */

import { config } from "dotenv";
config({ path: ".env.local" });
config();

// blog_posts vit dans la base `railway`. En prod, BLOG_DATABASE_URL la pointe ;
// en local seul DATABASE_URL est présent (.env.local) → on retombe dessus (même
// base). DOIT être défini AVANT d'importer server/blog.ts (le pool y est créé à
// l'import, il capturerait sinon une URL vide).
if (!process.env.BLOG_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.BLOG_DATABASE_URL = process.env.DATABASE_URL;
  console.log("ℹ️  BLOG_DATABASE_URL absent → fallback sur DATABASE_URL (même base).");
}
if (!process.env.BLOG_DATABASE_URL) {
  console.error("❌ Ni BLOG_DATABASE_URL ni DATABASE_URL trouvée — lance via `railway run` ou ajoute-la dans .env.local.");
  process.exit(1);
}

const APPLY = process.argv.includes("--apply");

// Import dynamique APRÈS config() (cf. note ci-dessus sur l'ordre d'init du pool).
const { getAllBlogPosts, updateBlogPost, slugify, decodeHtmlEntities } = await import("../server/blog.ts");

const posts = await getAllBlogPosts(5000);
console.log(`ℹ️  ${posts.length} article(s) chargé(s).`);

// Un slug est « pollué » si son titre contient une entité HTML (la cause racine),
// ou si le slug lui-même porte un résidu d'entité.
const ENTITY_RESIDUE = /x27|x2019|x26|x3c|x3e|amp|quot|apos|nbsp|&#/i;
const isPolluted = (p) =>
  decodeHtmlEntities(p.title) !== p.title ||
  (p.excerpt && decodeHtmlEntities(p.excerpt) !== p.excerpt) ||
  (p.metaDescription && decodeHtmlEntities(p.metaDescription) !== p.metaDescription) ||
  ENTITY_RESIDUE.test(p.slug);

const targets = posts.filter(isPolluted);
console.log(`🔎 ${targets.length} article(s) à nettoyer.\n`);

// Unicité : on réserve les slugs déjà pris par d'autres articles.
const taken = new Set(posts.map((p) => p.slug));

const redirects = [];
for (const p of targets) {
  taken.delete(p.slug); // on libère l'ancien slug de cet article
  let newSlug = slugify(p.title);
  if (!newSlug) { console.warn(`⚠️  [id ${p.id}] titre vide après nettoyage, ignoré.`); continue; }
  let candidate = newSlug, n = 1;
  while (taken.has(candidate)) { n++; candidate = `${newSlug}-${n}`; }
  newSlug = candidate;
  taken.add(newSlug);

  const cleanTitle = decodeHtmlEntities(p.title);
  const cleanExcerpt = p.excerpt ? decodeHtmlEntities(p.excerpt) : p.excerpt;
  const cleanMeta = p.metaDescription ? decodeHtmlEntities(p.metaDescription) : p.metaDescription;

  console.log(`[${p.lang}] id ${p.id}`);
  if (newSlug !== p.slug) console.log(`   slug : ${p.slug}\n       → ${newSlug}`);
  if (cleanTitle !== p.title) console.log(`   titre: ${p.title}\n       → ${cleanTitle}`);
  redirects.push({ lang: p.lang, from: `/blog/${p.slug}`, to: `/blog/${newSlug}` });

  if (APPLY) {
    await updateBlogPost(p.id, {
      slug: newSlug,
      title: cleanTitle,
      excerpt: cleanExcerpt ?? null,
      metaDescription: cleanMeta ?? null,
    });
    console.log("   ✅ mis à jour");
  }
}

console.log(`\n${APPLY ? "✅ Migration appliquée" : "🟡 DRY-RUN (rien modifié — relance avec --apply)"} : ${targets.length} article(s).`);
if (redirects.length) {
  console.log("\n--- Couples de redirection 301 (ancien → nouveau), par TLD ---");
  console.log(JSON.stringify(redirects, null, 2));
}
process.exit(0);
