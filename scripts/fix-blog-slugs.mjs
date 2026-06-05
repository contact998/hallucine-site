/**
 * fix-blog-slugs.mjs — Migration ponctuelle : nettoie les slugs/titres d'articles
 * de blog pollués par des entités HTML (DeepL renvoie `&#x27;` → slug en « x27 »).
 *
 * Réutilise la logique TESTÉE de server/blog.ts (decodeHtmlEntities + slugify) ;
 * I/O en mysql2 brut sur des colonnes LÉGÈRES (sans `content`) — un SELECT * sur
 * des dizaines d'articles HTML fait sauter le proxy TCP public Railway (ECONNRESET).
 *
 * Usage :
 *   # local (.env.local) → vise la base DATABASE_URL :
 *   npx tsx scripts/fix-blog-slugs.mjs            # DRY-RUN
 *   npx tsx scripts/fix-blog-slugs.mjs --apply    # applique
 *   # blog de prod (service MySQL-blog) → fournir son URL publique :
 *   BLOG_DATABASE_URL="<MYSQL_PUBLIC_URL de MySQL-blog>" npx tsx scripts/fix-blog-slugs.mjs [--apply]
 *
 * Les couples ancien→nouveau slug imprimés sont figés dans
 * server/blogSlugRedirects.ts (301 servies par server/_core/index.ts).
 */
import { config } from "dotenv";
import mysql from "mysql2/promise";
config({ path: ".env.local" });
config();

// blog_posts vit dans la base `railway`. En prod, BLOG_DATABASE_URL pointe le
// service MySQL-blog ; en local on retombe sur DATABASE_URL (.env.local).
if (!process.env.BLOG_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.BLOG_DATABASE_URL = process.env.DATABASE_URL;
  console.log("ℹ️  BLOG_DATABASE_URL absent → fallback sur DATABASE_URL.");
}
const DB_URL = process.env.BLOG_DATABASE_URL;
if (!DB_URL) {
  console.error("❌ Ni BLOG_DATABASE_URL ni DATABASE_URL trouvée — fournis l'une des deux.");
  process.exit(1);
}

const APPLY = process.argv.includes("--apply");

// Helpers PURS (aucun accès DB) — source de vérité unique pour la logique de slug.
const { slugify, decodeHtmlEntities } = await import("../server/blog.ts");

const conn = await mysql.createConnection(DB_URL);
// Colonnes légères uniquement : surtout PAS `content` (payload trop gros via proxy).
const [posts] = await conn.query(
  "SELECT id, lang, slug, title, excerpt, metaDescription FROM blog_posts ORDER BY createdAt DESC LIMIT 5000",
);
console.log(`ℹ️  ${posts.length} article(s) chargé(s).`);

// Un article est « pollué » si un de ses champs texte porte une entité HTML (cause
// racine), ou si le slug porte déjà un résidu d'entité.
const ENTITY_RESIDUE = /x27|x2019|x26|x3c|x3e|amp|quot|apos|nbsp|&#/i;
const isPolluted = (p) =>
  decodeHtmlEntities(p.title) !== p.title ||
  (p.excerpt && decodeHtmlEntities(p.excerpt) !== p.excerpt) ||
  (p.metaDescription && decodeHtmlEntities(p.metaDescription) !== p.metaDescription) ||
  ENTITY_RESIDUE.test(p.slug);

const targets = posts.filter(isPolluted);
console.log(`🔎 ${targets.length} article(s) à nettoyer.\n`);

// Unicité : on réserve tous les slugs existants, puis on libère celui de chaque
// cible avant de lui recalculer un slug propre unique.
const taken = new Set(posts.map((p) => p.slug));
const redirects = [];
for (const p of targets) {
  taken.delete(p.slug);
  const base = slugify(p.title);
  if (!base) { console.warn(`⚠️  [id ${p.id}] titre vide après nettoyage, ignoré.`); continue; }
  let newSlug = base, n = 1;
  while (taken.has(newSlug)) { n++; newSlug = `${base}-${n}`; }
  taken.add(newSlug);

  const cleanTitle = decodeHtmlEntities(p.title);
  const cleanExcerpt = p.excerpt ? decodeHtmlEntities(p.excerpt) : p.excerpt;
  const cleanMeta = p.metaDescription ? decodeHtmlEntities(p.metaDescription) : p.metaDescription;

  console.log(`[${p.lang}] id ${p.id}`);
  if (newSlug !== p.slug) {
    console.log(`   slug : ${p.slug}\n       → ${newSlug}`);
    redirects.push({ lang: p.lang, from: p.slug, to: newSlug });
  }
  if (cleanTitle !== p.title) console.log(`   titre: ${p.title}\n       → ${cleanTitle}`);

  if (APPLY) {
    await conn.query(
      "UPDATE blog_posts SET slug = ?, title = ?, excerpt = ?, metaDescription = ? WHERE id = ?",
      [newSlug, cleanTitle, cleanExcerpt ?? null, cleanMeta ?? null, p.id],
    );
    console.log("   ✅ mis à jour");
  }
}

console.log(`\n${APPLY ? "✅ Migration appliquée" : "🟡 DRY-RUN (rien modifié — relance avec --apply)"} : ${targets.length} article(s).`);
if (redirects.length) {
  console.log("\n--- Couples 301 (ancien → nouveau, slug nu) pour server/blogSlugRedirects.ts ---");
  console.log(JSON.stringify(redirects, null, 2));
}
await conn.end();
process.exit(0);
