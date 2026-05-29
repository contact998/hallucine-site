// shared/mediaPages.ts
export interface MediaSection { key: string; label: string }
export interface MediaPage { key: string; label: string; sections: MediaSection[] }

export const MEDIA_PAGES: MediaPage[] = [
  // ── Accueil ──────────────────────────────────────────────────────────────
  { key: "accueil", label: "Accueil", sections: [
    { key: "bandeau",     label: "Bandeau principal" },
    { key: "produits",    label: "Produits en vedette" },
    { key: "techno",      label: "Technologie" },
    { key: "histoire",    label: "Notre histoire" },
    { key: "realisations", label: "Réalisations" },
  ]},

  // ── Écrans ───────────────────────────────────────────────────────────────
  { key: "ecrans",           label: "Écrans (hub)",        sections: [
    { key: "bandeau",    label: "Bandeau" },
  ]},
  { key: "ecran-geant",      label: "Écran Géant",         sections: [
    { key: "galerie",    label: "Galerie" },
    { key: "icones",     label: "Icônes arguments" },
  ]},
  { key: "ecran-etanche",    label: "Écran Étanche",       sections: [
    { key: "galerie",    label: "Galerie" },
  ]},
  { key: "ecran-economique", label: "Écran Économique",    sections: [
    { key: "galerie-avec-souffleur",  label: "Galerie — avec souffleur" },
    { key: "galerie-sans-souffleur",  label: "Galerie — sans souffleur" },
    { key: "galerie-finale",          label: "Galerie finale" },
  ]},
  { key: "ecrans-led",       label: "Écrans LED",          sections: [
    { key: "galerie",    label: "Galerie" },
  ]},
  { key: "comparaison",      label: "Comparaison",         sections: [
    { key: "comparatif", label: "Tableau comparatif" },
  ]},
  { key: "configurateur",    label: "Configurateur",       sections: [
    { key: "bandeau",    label: "Bandeau" },
  ]},

  // ── Tentes ───────────────────────────────────────────────────────────────
  { key: "tentes",           label: "Tentes (hub)",        sections: [
    { key: "bandeau",    label: "Bandeau" },
  ]},
  { key: "tente-x",          label: "Tente X",             sections: [
    { key: "galerie",           label: "Galerie" },
    { key: "personnalisation",  label: "Personnalisation" },
  ]},
  { key: "tente-n",          label: "Tente N",             sections: [
    { key: "galerie",    label: "Galerie" },
    { key: "schema",     label: "Schéma technique" },
  ]},
  { key: "tente-v",          label: "Tente V",             sections: [
    { key: "galerie",    label: "Galerie" },
    { key: "schema",     label: "Schéma technique" },
  ]},
  { key: "tente-araignee",   label: "Tente Araignée",      sections: [
    { key: "galerie",    label: "Galerie" },
  ]},

  // ── Accessoires & mobilier ────────────────────────────────────────────────
  { key: "arches",           label: "Arches gonflables",   sections: [
    { key: "galerie",    label: "Galerie" },
  ]},
  { key: "mobilier",         label: "Mobilier",            sections: [
    { key: "bandeau",    label: "Bandeau" },
    { key: "produits",   label: "Produits" },
    { key: "transport",  label: "Transport & stockage" },
  ]},
  { key: "accessoires",      label: "Accessoires",         sections: [
    { key: "produits",   label: "Produits" },
  ]},

  // ── Offres ────────────────────────────────────────────────────────────────
  { key: "location",         label: "Location",            sections: [
    { key: "bandeau",    label: "Bandeau" },
  ]},
  { key: "packs",            label: "Packs clé en main",   sections: [
    { key: "bandeau",    label: "Bandeau" },
  ]},
  { key: "drive-in",         label: "Drive-in",            sections: [
    { key: "bandeau",       label: "Bandeau" },
    { key: "fiche-produit", label: "Fiche produit" },
    { key: "galerie",       label: "Galerie" },
  ]},

  // ── Galerie & édito ───────────────────────────────────────────────────────
  { key: "galerie",          label: "Galerie",             sections: [
    { key: "galerie",    label: "Galerie principale" },
  ]},
  { key: "histoire",         label: "Histoire",            sections: [
    { key: "bandeau",    label: "Bandeau" },
    { key: "timeline",   label: "Frise chronologique" },
  ]},
  { key: "mode-emploi",      label: "Mode d'emploi",       sections: [
    { key: "montage",    label: "Étapes de montage" },
    { key: "materiel",   label: "Matériel nécessaire" },
  ]},
  { key: "a-propos",         label: "À propos",            sections: [
    { key: "bandeau",    label: "Bandeau" },
  ]},

  // ── Études de cas ────────────────────────────────────────────────────────
  { key: "etudes-cas",       label: "Études de cas",       sections: [
    { key: "bandeau",    label: "Bandeau" },
  ]},
  { key: "cas-velodrome",    label: "Cas — Vélodrome",     sections: [
    { key: "bandeau",    label: "Bandeau" },
    { key: "galerie",    label: "Galerie" },
  ]},
  { key: "cas-oran",         label: "Cas — Oran",          sections: [
    { key: "bandeau",    label: "Bandeau" },
    { key: "galerie",    label: "Galerie" },
  ]},
];

export const MEDIA_PAGE_KEYS = MEDIA_PAGES.map(p => p.key);
export function pageLabel(key: string) { return MEDIA_PAGES.find(p => p.key === key)?.label ?? key; }
