/**
 * fix-blog-slugs.mjs — Migration ponctuelle : nettoie les slugs/titres d'articles
 * de blog pollués par des entités HTML (DeepL renvoie `&#x27;` → slug en « x27 »).
 *
 * Réutilise la logique testée de server/blog.ts (decodeHtmlEntities + slugify).
 * Le titre stocké contient encore l'entité, donc on peut recalculer un slug propre.
 *
 * Usage (là où BLOG_DATABASE_URL est joignable — ex. `railway run`) :
 *   npx tsx scripts/fix-blog-slugs.mjs           # DRY-RUN : liste ce qui changerait
 *   npx tsx scripts/fix-blog-slugs.mjs --apply   # applique les mises à jour
 *
 * Sortie : les couples ancien_slug → nouveau_slug (utile si on veut poser des 301).
 */

import { getAllBlogPosts, updateBlogPost, slugify, decodeHtmlEntities } from "../server/blog.ts";

const APPLY = process.argv.includes("--apply");

if (!process.env.BLOG_DATABASE_URL) {
  console.error("❌ BLOG_DATABASE_URL absent de l'environnement — lance via `railway run` ou exporte la variable.");
  process.exit(1);
}

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
