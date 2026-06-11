// shared/slots.ts
// ──────────────────────────────────────────────────────────────────────────────
// Registre UNIQUE des emplacements média du site (la « refonte »).
//
// Un emplacement = un endroit qui affiche une ou plusieurs images, piochées dans
// la Bibliothèque (table `assets`). C'est la SOURCE DE VÉRITÉ commune à :
//   - l'admin (écran « Emplacements » : ce qu'on peut remplir),
//   - la lecture côté site (useSlot / useGallery),
//   - la reprise de données (mapping de l'ancien page/section → clés ici).
//
// Remplace shared/mediaPages.ts (supprimé en fin de chantier).
// ──────────────────────────────────────────────────────────────────────────────

export type SlotKind = "single" | "gallery";

export interface MediaSlot {
  /** Clé stable, ex. "accueil:bandeau" ou "blog:cover". Ne jamais renommer après prod. */
  key: string;
  /** Libellé FR lisible (admin). */
  label: string;
  /** single = 1 image ; gallery = N images ordonnées. */
  kind: SlotKind;
  /** Un emplacement par entité (ex. une couverture par article de blog → entity_id requis). */
  perEntity?: boolean;
}

export interface SlotGroup {
  /** Clé de regroupement (page du site). */
  key: string;
  label: string;
  slots: MediaSlot[];
}

/** Helper interne : fabrique une clé "page:section". */
const k = (page: string, section: string) => `${page}:${section}`;

// ──────────────────────────────────────────────────────────────────────────────
// Emplacements par page. `kind` reflète ce que la page affiche réellement
// (bandeau/schéma/fiche = 1 image ; le reste = galerie ordonnée).
// ──────────────────────────────────────────────────────────────────────────────
export const SLOT_GROUPS: SlotGroup[] = [
  { key: "accueil", label: "Accueil", slots: [
    { key: k("accueil", "bandeau"),      label: "Bandeau principal",   kind: "single" },
    { key: k("accueil", "produits"),     label: "Produits en vedette", kind: "gallery" },
    { key: k("accueil", "techno"),       label: "Technologie",         kind: "gallery" },
    { key: k("accueil", "histoire"),     label: "Notre histoire",      kind: "gallery" },
    { key: k("accueil", "realisations"), label: "Réalisations",        kind: "gallery" },
  ]},

  { key: "ecrans", label: "Écrans (hub)", slots: [
    { key: k("ecrans", "bandeau"), label: "Bandeau", kind: "single" },
  ]},
  { key: "ecran-geant", label: "Écran Géant", slots: [
    { key: k("ecran-geant", "galerie"), label: "Galerie",          kind: "gallery" },
    { key: k("ecran-geant", "icones"),  label: "Icônes arguments",  kind: "gallery" },
  ]},
  { key: "ecran-etanche", label: "Écran Étanche", slots: [
    { key: k("ecran-etanche", "galerie"), label: "Galerie", kind: "gallery" },
  ]},
  { key: "ecran-economique", label: "Écran Économique", slots: [
    { key: k("ecran-economique", "galerie-avec-souffleur"), label: "Galerie — avec souffleur", kind: "gallery" },
    { key: k("ecran-economique", "galerie-sans-souffleur"), label: "Galerie — sans souffleur", kind: "gallery" },
    { key: k("ecran-economique", "galerie-finale"),         label: "Galerie finale",           kind: "gallery" },
  ]},
  { key: "ecrans-led", label: "Écrans LED", slots: [
    { key: k("ecrans-led", "galerie"), label: "Galerie", kind: "gallery" },
  ]},
  { key: "comparaison", label: "Comparaison", slots: [
    { key: k("comparaison", "comparatif"), label: "Tableau comparatif", kind: "single" },
  ]},
  { key: "configurateur", label: "Configurateur", slots: [
    { key: k("configurateur", "bandeau"), label: "Bandeau", kind: "single" },
  ]},

  { key: "tentes", label: "Tentes (hub)", slots: [
    { key: k("tentes", "bandeau"), label: "Bandeau", kind: "single" },
  ]},
  { key: "tente-x", label: "Tente X", slots: [
    { key: k("tente-x", "galerie"),          label: "Galerie",          kind: "gallery" },
    { key: k("tente-x", "personnalisation"), label: "Personnalisation", kind: "gallery" },
  ]},
  { key: "tente-n", label: "Tente N", slots: [
    { key: k("tente-n", "galerie"), label: "Galerie",          kind: "gallery" },
    { key: k("tente-n", "schema"),  label: "Schéma technique", kind: "single" },
  ]},
  { key: "tente-v", label: "Tente V", slots: [
    { key: k("tente-v", "galerie"), label: "Galerie",          kind: "gallery" },
    { key: k("tente-v", "schema"),  label: "Schéma technique", kind: "single" },
  ]},
  { key: "tente-araignee", label: "Tente Araignée", slots: [
    { key: k("tente-araignee", "galerie"), label: "Galerie", kind: "gallery" },
  ]},

  { key: "arches", label: "Arches gonflables", slots: [
    { key: k("arches", "galerie"), label: "Galerie", kind: "gallery" },
  ]},
  { key: "mobilier", label: "Mobilier", slots: [
    { key: k("mobilier", "bandeau"),   label: "Bandeau",               kind: "single" },
    { key: k("mobilier", "produits"),  label: "Produits",              kind: "gallery" },
    { key: k("mobilier", "transport"), label: "Transport & stockage",  kind: "gallery" },
  ]},
  { key: "accessoires", label: "Accessoires", slots: [
    { key: k("accessoires", "produits"), label: "Produits", kind: "gallery" },
  ]},

  { key: "location", label: "Location", slots: [
    { key: k("location", "bandeau"), label: "Bandeau", kind: "single" },
  ]},
  { key: "packs", label: "Packs clé en main", slots: [
    { key: k("packs", "bandeau"), label: "Bandeau", kind: "single" },
  ]},
  { key: "drive-in", label: "Drive-in", slots: [
    { key: k("drive-in", "bandeau"),       label: "Bandeau",       kind: "single" },
    { key: k("drive-in", "fiche-produit"), label: "Fiche produit", kind: "single" },
    { key: k("drive-in", "galerie"),       label: "Galerie",       kind: "gallery" },
  ]},
  { key: "cinema-plein-air", label: "Cinéma plein air", slots: [
    { key: k("cinema-plein-air", "bandeau"), label: "Bandeau", kind: "single" },
  ]},

  { key: "galerie", label: "Galerie", slots: [
    { key: k("galerie", "principale"), label: "Galerie principale", kind: "gallery" },
  ]},
  { key: "histoire", label: "Histoire", slots: [
    { key: k("histoire", "bandeau"),  label: "Bandeau",            kind: "single" },
    { key: k("histoire", "timeline"), label: "Frise chronologique", kind: "gallery" },
  ]},
  { key: "mode-emploi", label: "Mode d'emploi", slots: [
    { key: k("mode-emploi", "montage"),  label: "Étapes de montage",   kind: "gallery" },
    { key: k("mode-emploi", "materiel"), label: "Matériel nécessaire", kind: "gallery" },
  ]},
  { key: "a-propos", label: "À propos", slots: [
    { key: k("a-propos", "bandeau"), label: "Bandeau", kind: "single" },
  ]},

  { key: "etudes-cas", label: "Études de cas", slots: [
    { key: k("etudes-cas", "bandeau"), label: "Bandeau", kind: "single" },
  ]},
  { key: "cas-velodrome", label: "Cas — Vélodrome", slots: [
    { key: k("cas-velodrome", "bandeau"), label: "Bandeau", kind: "single" },
    { key: k("cas-velodrome", "galerie"), label: "Galerie", kind: "gallery" },
  ]},
  { key: "cas-oran", label: "Cas — Oran", slots: [
    { key: k("cas-oran", "bandeau"), label: "Bandeau", kind: "single" },
    { key: k("cas-oran", "galerie"), label: "Galerie", kind: "gallery" },
  ]},
];

// ──────────────────────────────────────────────────────────────────────────────
// Blog : une couverture PAR article (perEntity). entity_id = id de l'article FR.
// Remplace blog_posts.imageUrl. Les traductions héritent du placement du parent FR.
// ──────────────────────────────────────────────────────────────────────────────
export const BLOG_COVER_SLOT: MediaSlot = {
  key: "blog:cover",
  label: "Couverture d'article",
  kind: "single",
  perEntity: true,
};

export const BLOG_GROUP: SlotGroup = {
  key: "blog",
  label: "Blog",
  slots: [BLOG_COVER_SLOT],
};

// ──────────────────────────────────────────────────────────────────────────────
// Index & helpers
// ──────────────────────────────────────────────────────────────────────────────
export const ALL_GROUPS: SlotGroup[] = [...SLOT_GROUPS, BLOG_GROUP];
export const ALL_SLOTS: MediaSlot[] = ALL_GROUPS.flatMap(g => g.slots);

const SLOT_BY_KEY: Map<string, MediaSlot> = new Map(ALL_SLOTS.map(s => [s.key, s]));

export function slotByKey(key: string): MediaSlot | undefined {
  return SLOT_BY_KEY.get(key);
}

export function isGallery(key: string): boolean {
  return slotByKey(key)?.kind === "gallery";
}

export function isPerEntity(key: string): boolean {
  return slotByKey(key)?.perEntity === true;
}

/** Mapping de reprise : ancien (page, section) → clé d'emplacement. Identité ici
 *  (les clés sont "page:section"), isolé pour que le script de migration s'appuie
 *  dessus et qu'on trace les sections orphelines. */
export function legacyPageSectionToSlotKey(page: string | null, section: string | null): string | null {
  if (!page) return null;
  const key = section ? `${page}:${section}` : page;
  return SLOT_BY_KEY.has(key) ? key : null;
}
