/**
 * client/src/data/mediaPages.ts
 *
 * Référentiel des sous-catégories de la médiathèque, mappées à chaque
 * page / section du site. Chaque entrée correspond à un dossier d'images
 * éditable depuis /admin/media.
 *
 * Catégorie = "produits" pour tout sauf cas spéciaux (réalisations / galerie
 * gardent leur propre catégorie).
 *
 * Pour changer une image visible quelque part :
 *   1. Allez sur /admin/media
 *   2. Filtrez par catégorie + tapez la sous-catégorie ci-dessous
 *   3. Uploadez la nouvelle image avec cette sous-catégorie
 *   4. (optionnel) Masquez l'ancienne
 */

import type { MediaCategory } from "../../../drizzle/schema";

export interface MediaPage {
  key:         string;
  category:    MediaCategory;
  subcategory: string;
  label:       string;
  description: string;
}

export const MEDIA_PAGES: readonly MediaPage[] = [
  // ─── Page d'accueil ────────────────────────────────────────────────────────
  { key: "accueil-banniere",     category: "produits",    subcategory: "accueil-banniere",     label: "Accueil — Bannière",       description: "Image principale (hero) du haut de la page d'accueil." },
  { key: "accueil-histoire",     category: "produits",    subcategory: "accueil-histoire",     label: "Accueil — Notre Histoire", description: "Les 9 chapitres de la timeline historique sur l'accueil." },
  { key: "accueil-produits",     category: "produits",    subcategory: "accueil-produits",     label: "Accueil — Produits",       description: "Cartes produits visibles sur la page d'accueil." },
  { key: "accueil-technologie",  category: "produits",    subcategory: "accueil-technologie",  label: "Accueil — Technologie",    description: "Section technique de la page d'accueil." },
  { key: "accueil-cas-usage",    category: "produits",    subcategory: "accueil-cas-usage",    label: "Accueil — Cas d'usage",    description: "Section cas d'usage / use-cases sur l'accueil." },

  // ─── Pages produits ────────────────────────────────────────────────────────
  { key: "drive-in",             category: "produits",    subcategory: "drive-in",             label: "Page Drive-In",            description: "Visuels de la page écran drive-in." },
  { key: "ecran-geant",          category: "produits",    subcategory: "ecran-geant",          label: "Page Écran Géant",         description: "Visuels de la page écran géant." },
  { key: "ecran-etanche",        category: "produits",    subcategory: "ecran-etanche",        label: "Page Écran Étanche",       description: "Visuels de la page écran étanche." },
  { key: "ecran-economique",     category: "produits",    subcategory: "ecran-economique",     label: "Page Écran Économique",    description: "Visuels de la page écran économique." },
  { key: "ecrans-led",           category: "produits",    subcategory: "ecrans-led",           label: "Page Écrans LED",          description: "Visuels de la page écrans LED." },

  // ─── Tentes ────────────────────────────────────────────────────────────────
  { key: "tente-x",              category: "produits",    subcategory: "tente-x",              label: "Page Tente X",             description: "Visuels de la tente X." },
  { key: "tente-n",              category: "produits",    subcategory: "tente-n",              label: "Page Tente N",             description: "Visuels de la tente N." },
  { key: "tente-v",              category: "produits",    subcategory: "tente-v",              label: "Page Tente V",             description: "Visuels de la tente V." },
  { key: "tente-araignee",       category: "produits",    subcategory: "tente-araignee",       label: "Page Tente Araignée",      description: "Visuels de la tente araignée." },

  // ─── Autres produits ───────────────────────────────────────────────────────
  { key: "arches-gonflables",    category: "produits",    subcategory: "arches-gonflables",    label: "Page Arches Gonflables",   description: "Visuels de la page arches gonflables." },
  { key: "mobilier",             category: "produits",    subcategory: "mobilier",             label: "Page Mobilier",            description: "Visuels de la page mobilier événementiel." },
  { key: "accessoires",          category: "produits",    subcategory: "accessoires",          label: "Page Accessoires",         description: "Visuels de la page accessoires." },

  // ─── Pages éditoriales ─────────────────────────────────────────────────────
  { key: "page-histoire",        category: "produits",    subcategory: "page-histoire",        label: "Page Notre Histoire",      description: "Visuels de la page Histoire (version longue)." },
  { key: "mode-emploi",          category: "produits",    subcategory: "mode-emploi",          label: "Page Mode d'emploi",       description: "Visuels du guide d'utilisation." },
  { key: "devenir-distributeur", category: "produits",    subcategory: "devenir-distributeur", label: "Page Devenir Distributeur", description: "Visuels de la page partenariat." },
  { key: "contact",              category: "produits",    subcategory: "contact",              label: "Page Contact",             description: "Visuels de la page contact." },
  { key: "apropos",              category: "produits",    subcategory: "apropos",              label: "Page À Propos",            description: "Visuels de la page à propos." },

  // ─── Galeries (catégories dédiées) ─────────────────────────────────────────
  { key: "realisations",         category: "realisations", subcategory: "",                    label: "Galerie Réalisations",     description: "Galerie masonry des réalisations clients (page d'accueil + page dédiée)." },
  { key: "galerie",              category: "galerie",      subcategory: "",                    label: "Page Galerie",             description: "Page galerie publique du site." },

  // ─── UI/Footer/Navbar ──────────────────────────────────────────────────────
  { key: "ui-logo",              category: "ui",           subcategory: "logo",                label: "Logo Hallucine",           description: "Logo dans la navbar + footer." },
];

/** Récupère la déclaration d'une page par sa clé */
export function getMediaPage(key: string): MediaPage | undefined {
  return MEDIA_PAGES.find(p => p.key === key);
}

/** Liste des sous-catégories utilisées dans le code (pour validation admin) */
export const KNOWN_SUBCATEGORIES = MEDIA_PAGES.map(p => p.subcategory).filter(Boolean);
