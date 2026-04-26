/**
 * relatedProductsConfig.ts — Configuration centralisée du maillage interne
 *
 * Chaque clé = une page produit
 * Chaque valeur = liste des RouteKey à afficher comme "produits similaires"
 *
 * COMMENT AJOUTER UNE NOUVELLE PAGE :
 * 1. Ajouter la RouteKey dans routes.ts
 * 2. Ajouter son entrée dans PRODUCTS_CONFIG (RelatedProducts.tsx)
 * 3. Ajouter sa ligne ici dans RELATED_CONFIG
 * 4. L'ajouter dans les items de 2-3 pages voisines
 * → Aucune autre modification nécessaire
 */

import type { RouteKey } from "@/i18n/routes";

/**
 * Map des relations entre pages.
 * Maximum 3 items par page pour ne pas surcharger visuellement.
 */
export const RELATED_CONFIG: Partial<Record<RouteKey, [RouteKey, RouteKey] | [RouteKey, RouteKey, RouteKey]>> = {
  // ── Écrans ─────────────────────────────────────────────────────────────
  "ecrans":          ["ecran-geant",    "ecran-etanche",    "comparaison"],
  "ecran-geant":     ["ecran-etanche",  "ecran-economique", "accessoires"],
  "ecran-etanche":   ["ecran-geant",    "ecran-economique", "accessoires"],
  "ecran-economique":["ecran-geant",    "ecran-etanche",    "comparaison"],
  "ecrans-led":      ["ecran-geant",    "arches",           "comparaison"],
  "comparaison":     ["ecrans",         "ecran-geant",      "contact"],

  // ── Tentes ─────────────────────────────────────────────────────────────
  "tentes":          ["tente-x",        "arches",           "mobilier"],
  "tente-x":         ["tente-n",        "tente-v",          "tente-araignee"],
  "tente-n":         ["tente-x",        "tente-v",          "tente-araignee"],
  "tente-v":         ["tente-x",        "tente-n",          "tente-araignee"],
  "tente-araignee":  ["tente-x",        "tente-n",          "mobilier"],

  // ── Autres produits ────────────────────────────────────────────────────
  "arches":          ["ecran-geant",    "tentes",           "mobilier"],
  "mobilier":        ["tentes",         "accessoires",      "contact"],
  "accessoires":     ["ecrans",         "arches",           "contact"],

  // ── Pages informationnelles ────────────────────────────────────────────
  "mode-emploi":     ["ecrans",         "accessoires",      "contact"],
  "histoire":        ["ecrans",         "a-propos",         "contact"],
  "a-propos":        ["histoire",       "ecrans",           "contact"],
  "blog":            ["ecrans",         "comparaison",      "contact"],
};
