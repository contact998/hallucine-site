// shared/mediaPages.ts
export interface MediaSection { key: string; label: string }
export interface MediaPage { key: string; label: string; sections: MediaSection[] }

export const MEDIA_PAGES: MediaPage[] = [
  { key: "accueil", label: "Accueil", sections: [
    { key: "produits", label: "Produits en vedette" },
    { key: "realisations", label: "Réalisations" },
    { key: "histoire", label: "Notre histoire" },
    { key: "cinema", label: "Cinéma / ambiance" },
    { key: "techno", label: "Technologie" },
  ]},
  { key: "ecran-geant",      label: "Écran Géant",        sections: [{ key: "galerie", label: "Galerie" }, { key: "bandeau", label: "Bandeau" }] },
  { key: "ecran-etanche",    label: "Écran Étanche",      sections: [{ key: "galerie", label: "Galerie" }, { key: "bandeau", label: "Bandeau" }] },
  { key: "ecran-economique", label: "Écran Économique",   sections: [{ key: "galerie", label: "Galerie" }, { key: "bandeau", label: "Bandeau" }] },
  { key: "ecrans-led",       label: "Écrans LED",         sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "arches",           label: "Arches gonflables",  sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "mobilier",         label: "Mobilier",           sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "accessoires",      label: "Accessoires",        sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "tente-x",          label: "Tente X",            sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "tente-n",          label: "Tente N",            sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "tente-v",          label: "Tente V",            sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "tente-araignee",   label: "Tente Araignée",     sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "galerie",          label: "Galerie",            sections: [{ key: "principale", label: "Galerie principale" }] },
  { key: "histoire",         label: "Histoire",           sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "mode-emploi",      label: "Mode d'emploi",      sections: [{ key: "etapes", label: "Étapes" }] },
  { key: "cas-velodrome",    label: "Cas — Vélodrome",    sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "cas-oran",         label: "Cas — Oran",         sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "drive-in",         label: "Drive-in",           sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "a-propos",         label: "À propos",           sections: [{ key: "galerie", label: "Galerie" }] },
];

export const MEDIA_PAGE_KEYS = MEDIA_PAGES.map(p => p.key);
export function pageLabel(key: string) { return MEDIA_PAGES.find(p => p.key === key)?.label ?? key; }
