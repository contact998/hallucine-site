/**
 * scripts/seed-media-library.mjs
 *
 * Insère en base de données les images actuellement en dur dans le code,
 * avec leur sous-catégorie / alt / sortOrder. Idempotent : si une URL
 * existe déjà, elle n'est pas dupliquée.
 *
 * Usage :
 *   DATABASE_URL='...' node scripts/seed-media-library.mjs
 *   DATABASE_URL='...' node scripts/seed-media-library.mjs --dry-run
 *
 * Après exécution, toutes les pages du site peuvent être pilotées depuis
 * /admin/media en filtrant par catégorie + sous-catégorie.
 */
import mysql from "mysql2/promise";

const R2_BASE = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/";

const DRY = process.argv.includes("--dry-run");

// ─── Catalogue des images à seeder ────────────────────────────────────────────
// Chaque entrée = { url, category, subcategory, alt, title, sortOrder }
// Le sortOrder définit l'ordre d'affichage dans la page (0 = premier).

const ENTRIES = [

  // ───── Accueil — Notre Histoire (timeline 9 chapitres) ──────────────────────
  { url: R2_BASE + "1779578749911-c9425a005493-ecran-8-m-cadre-aluminium.jpg",
    category: "produits", subcategory: "accueil-histoire",
    title: "1992 — Premier écran 8m aluminium",
    alt: "Premier écran de cinéma Hallucine — structure tubulaire en aluminium 8 mètres, prototype fondateur (1992)",
    sortOrder: 0 },
  { url: R2_BASE + "1779578888369-951ff08bc2f1-ecran-structure-1-1.jpg",
    category: "produits", subcategory: "accueil-histoire",
    title: "1993 — L'école des forains",
    alt: "Écran de cinéma Hallucine monté sur structure forain en plein air — apprentissage du montage rapide (1993)",
    sortOrder: 1 },
  { url: R2_BASE + "1779584723959-a9169ab7bfc6-histoire-ecran-anglais.jpg",
    category: "produits", subcategory: "accueil-histoire",
    title: "1994 — L'erreur fatale",
    alt: "Écran de cinéma 15 mètres en bâche à camion, 600 kg — l'erreur fatale qui fonde la quête de légèreté Hallucine (1994)",
    sortOrder: 2 },
  { url: R2_BASE + "1779587607712-ce2b14189c08-ecran-cinema-gonflable-voilerie-bretonne.webp",
    category: "produits", subcategory: "accueil-histoire",
    title: "1995 — La voilerie bretonne",
    alt: "Écran de cinéma gonflable Hallucine dans un jardin — voilerie bretonne, La Trinité-sur-Mer (1995)",
    sortOrder: 3 },
  { url: R2_BASE + "1779587893638-07ef453d5255-kitesurf-hong-kong-inspiration-ecran-gonflable.webp",
    category: "produits", subcategory: "accueil-histoire",
    title: "2004 — L'étincelle Hong Kong",
    alt: "Kitesurf sur une plage de Hong Kong — l'inspiration des boudins gonflables des écrans de cinéma Hallucine (2004)",
    sortOrder: 4 },
  { url: R2_BASE + "1779587896624-615d7348493d-vue-eclatee-ecran-cinema-gonflable-etanche-tissu-airbag.webp",
    category: "produits", subcategory: "accueil-histoire",
    title: "2005 — Le secret des airbags",
    alt: "Vue éclatée d'un écran de cinéma gonflable étanche Hallucine — tissu polyamide haute ténacité issu des airbags automobiles (2005)",
    sortOrder: 5 },
  { url: R2_BASE + "1779587898704-f934a4160b12-ecran-cinema-gonflable-etanche-5m-6m-hallucine.webp",
    category: "produits", subcategory: "accueil-histoire",
    title: "2010 — La gamme étanche",
    alt: "Gamme d'écrans de cinéma gonflables étanches Hallucine 5 et 6 mètres — chambre à air scellée, sans soufflerie (2010)",
    sortOrder: 6 },
  { url: R2_BASE + "1779587900924-b22ae92f259c-hallucine-shenzhen-covid-fabrication-ecran.webp",
    category: "produits", subcategory: "accueil-histoire",
    title: "2020 — Shenzhen COVID",
    alt: "Bloqué à Shenzhen pendant le COVID — Hallucine continue depuis la Chine, sourcing et fabrication d'écrans gonflables (2020)",
    sortOrder: 7 },
  { url: R2_BASE + "1779587902974-6a126291762f-trois-ecrans-cinema-gonflables-hallucine-innovation.webp",
    category: "produits", subcategory: "accueil-histoire",
    title: "Aujourd'hui — 30 ans d'innovation",
    alt: "Trois écrans de cinéma gonflables Hallucine — 30 ans d'innovation française, fabrication usine partenaire Dongguan",
    sortOrder: 8 },

  // ───── Page Drive-In ────────────────────────────────────────────────────────
  { url: R2_BASE + "1779589688540-cc4404c27d95-ecran-cinema-drive-in-gonflable-10m-voitures-coucher-soleil.webp",
    category: "produits", subcategory: "drive-in",
    title: "Écran Drive-In 10m avec voitures",
    alt: "Écran de cinéma gonflable Hallucine 10m installé pour drive-in, voitures stationnées au coucher du soleil",
    sortOrder: 0 },

];

// ─── Exécution ────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL manquante");
    process.exit(1);
  }
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  let inserted = 0;
  let updated  = 0;
  let skipped  = 0;

  for (const e of ENTRIES) {
    const filename = e.url.split("/").pop();
    const [rows] = await conn.execute(
      "SELECT id FROM media_library WHERE url = ? LIMIT 1",
      [e.url],
    );

    if (rows.length > 0) {
      // Existe déjà : on remet à jour alt / title / category / subcategory / sortOrder
      // pour réaligner avec le code (cas où un précédent seed avait des valeurs différentes)
      if (DRY) {
        console.log(`  [dry] UPDATE id=${rows[0].id} ${e.subcategory} #${e.sortOrder}`);
      } else {
        await conn.execute(
          `UPDATE media_library
             SET category = ?, subcategory = ?, alt = ?, title = ?, sortOrder = ?, active = TRUE
           WHERE id = ?`,
          [e.category, e.subcategory, e.alt, e.title, e.sortOrder, rows[0].id],
        );
      }
      updated++;
    } else {
      if (DRY) {
        console.log(`  [dry] INSERT ${e.subcategory} #${e.sortOrder} → ${filename}`);
      } else {
        await conn.execute(
          `INSERT INTO media_library
             (url, filename, category, subcategory, alt, title, sortOrder, active, source)
           VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, 'migration')`,
          [e.url, filename, e.category, e.subcategory, e.alt, e.title, e.sortOrder],
        );
      }
      inserted++;
    }
  }

  console.log(`\n✓ ${inserted} insertion(s), ${updated} mise(s) à jour, ${skipped} ignoré(s)`);
  await conn.end();
}

main().catch((err) => {
  console.error("❌ Erreur seed :", err);
  process.exit(1);
});
