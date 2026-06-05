/**
 * blogSlugRedirects.ts — Redirections 301 des anciens slugs d'articles de blog
 * pollués par des entités HTML (`&#x27;` → résidu « x27 »), AVANT le correctif
 * `decodeHtmlEntities` (commit b02bba4).
 *
 * Ensemble BORNÉ et historique : généré une fois à partir de
 * `scripts/fix-blog-slugs.mjs` (dry-run, 2026-06-05) sur les 7 articles `it`
 * concernés. Les nouveaux articles ont déjà des slugs propres (slugify décode
 * désormais), donc cette table n'a pas vocation à grandir.
 *
 * Même principe que `LEGACY_DISTRIBUTOR_REDIRECTS` (cf. server/_core/vite.ts) :
 * une map statique en code plutôt qu'une table DB, pour un nettoyage ponctuel.
 *
 * Clé = ancien slug (tel qu'indexé), valeur = nouveau slug propre — SANS le
 * préfixe `/blog/`. Le handler (server/_core/index.ts) émet le 301.
 */
export const BLOG_SLUG_REDIRECTS: Record<string, string> = {
  "cinema-allx27aperto-in-germania-particolarita-regionali-prezzi-e-luoghi-storici":
    "cinema-allaperto-in-germania-particolarita-regionali-prezzi-e-luoghi-storici",
  "cinema-allx27aperto-in-italia-luoghi-storici-e-cene-allx27aperto":
    "cinema-allaperto-in-italia-luoghi-storici-e-cene-allaperto",
  "festival-cinematografici-allx27aperto-2026-la-guida-completa-2":
    "festival-cinematografici-allaperto-2026-la-guida-completa",
  "festival-cinematografici-allx27aperto-2026-la-guida-completa":
    "festival-cinematografici-allaperto-2026-la-guida-completa-2",
  "cinema-allx27aperto-in-citta-sedie-a-sdraio-cuffie-e-vin-brule-2":
    "cinema-allaperto-in-citta-sedie-a-sdraio-cuffie-e-vin-brule",
  "cinema-allx27aperto-in-citta-sedie-a-sdraio-cuffie-e-vin-brule":
    "cinema-allaperto-in-citta-sedie-a-sdraio-cuffie-e-vin-brule-2",
  "cinema-allx27aperto-in-citta-unx27esperienza-urbana-accogliente":
    "cinema-allaperto-in-citta-unesperienza-urbana-accogliente",
};
