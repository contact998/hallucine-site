/**
 * Lexique i18n — terminologie de référence par marché.
 *
 * Source de vérité du vocabulaire à employer sur chaque TLD : le terme que le
 * marché cherche réellement (SEO) et les contresens DeepL connus à ne jamais
 * laisser passer. Consulté via /admin/lexique.
 *
 * Règles transverses (s'appliquent aux 5 langues) :
 *  - « Fabricant français depuis 1992 » se GARDE partout : argument de marque
 *    à l'export, pas du franco-centrisme.
 *  - Tenue au vent = « jusqu'à 38 km/h (6 Beaufort) » partout, dégonflage
 *    au-delà. Ne jamais réintroduire d'anciens chiffres.
 *  - `pnpm translate` ne retouche JAMAIS une clé existante : tout patch manuel
 *    dans les JSON de langue est définitif.
 */

export interface LexiqueEntry {
  /** Concept côté FR (la clé mentale). */
  concept: string;
  /** Terme officiel à employer dans cette langue. */
  terme: string;
  /** Variantes / mots-clés que le marché emploie aussi (SEO). */
  variantes?: string;
  /** Contresens DeepL ou faux ami à bannir. */
  piege?: string;
}

export interface LexiqueLangue {
  code: "en" | "de" | "es" | "it" | "pt";
  label: string;
  domaine: string;
  /** Ancrages culturels du marché : ce qui parle au client local. */
  culture: string;
  entrees: LexiqueEntry[];
}

export const LEXIQUE: LexiqueLangue[] = [
  {
    code: "en",
    label: "Anglais (EN-GB)",
    domaine: "hallucinecran.com",
    culture:
      "Marché international servi en anglais britannique. Interlocuteurs publics = local councils (pas « town halls », qui désigne le bâtiment). Événementiel : community events, summer screenings, festivals.",
    entrees: [
      { concept: "cinéma plein air", terme: "outdoor cinema", variantes: "open-air cinema, outdoor movie night" },
      { concept: "écran gonflable", terme: "inflatable screen", variantes: "inflatable movie screen, inflatable cinema screen" },
      { concept: "mairie / commune", terme: "local council", piege: "« town hall » = le bâtiment, « city hall » = américain" },
      { concept: "étanche (à l'air)", terme: "airtight", piege: "« waterproof » = étanche à l'eau, contresens DeepL récurrent" },
      { concept: "soufflerie / gonfleur", terme: "blower", piege: "« wind tunnel » = tunnel aérodynamique (contresens DeepL)" },
      { concept: "location", terme: "hire (screen hire)", variantes: "rental (audience US)", piege: "« location » en anglais = un lieu" },
      { concept: "devis", terme: "free quote", piege: "« estimate » = estimation vague" },
      { concept: "séance", terme: "screening", piege: "« session » = réunion" },
      { concept: "jour J", terme: "event day / on the day", piege: "« D-Day » = débarquement" },
      { concept: "toile (de projection)", terme: "projection surface", piege: "« canvas » = toile de peintre" },
    ],
  },
  {
    code: "de",
    label: "Allemand",
    domaine: "hallucinecran.de",
    culture:
      "Tradition forte du Sommerkino / Freiluftkino. Interlocuteurs publics = Gemeinden et Stadtverwaltungen ; les Betriebsräte (comités d'entreprise) sont un vrai canal. Sensibilité aux specs techniques et à la fiabilité.",
    entrees: [
      { concept: "cinéma plein air", terme: "Open-Air-Kino", variantes: "Freiluftkino, Sommerkino (1er mot-clé hors marque du concurrent en DE)" },
      { concept: "écran gonflable", terme: "aufblasbare Leinwand", piege: "« Bildschirm » = écran TV/ordinateur, jamais pour une toile" },
      { concept: "mairie / commune", terme: "Gemeinde / Stadtverwaltung", piege: "« Rathaus » = le bâtiment" },
      { concept: "étanche (à l'air)", terme: "luftdicht", piege: "« wasserdicht » = étanche à l'eau (contresens DeepL)" },
      { concept: "soufflerie / gonfleur", terme: "Gebläse", piege: "« Windkanal » = tunnel aérodynamique (contresens DeepL)" },
      { concept: "location", terme: "Vermietung / mieten" },
      { concept: "devis", terme: "kostenloses Angebot", variantes: "Kostenvoranschlag (plus administratif)" },
      { concept: "séance", terme: "Vorführung / Filmvorführung" },
      { concept: "comité d'entreprise", terme: "Betriebsrat" },
      { concept: "jour J", terme: "am Veranstaltungstag", piege: "« Segeltour » déjà produit par DeepL (contresens total)" },
    ],
  },
  {
    code: "es",
    label: "Espagnol",
    domaine: "hallucinecran.es",
    culture:
      "Le « cine de verano » est une institution culturelle (Andalousie surtout) : c'est LE mot-clé du marché, à employer en priorité. Interlocuteurs publics = ayuntamientos ; fort usage municipal et festif (fiestas, verbenas).",
    entrees: [
      { concept: "cinéma plein air", terme: "cine de verano", variantes: "cine al aire libre" },
      { concept: "écran gonflable", terme: "pantalla hinchable", variantes: "pantalla de cine hinchable", piege: "« inflable » = usage latino-américain, pas Espagne" },
      { concept: "mairie / commune", terme: "ayuntamiento" },
      { concept: "étanche (à l'air)", terme: "estanca (al aire)", piege: "« impermeable » = étanche à l'eau (contresens DeepL)" },
      { concept: "soufflerie / gonfleur", terme: "soplador", piege: "« túnel de viento » = tunnel aérodynamique (contresens DeepL)" },
      { concept: "taille (écran)", terme: "tamaño", piege: "« tallas » = tailles de vêtements (contresens DeepL)" },
      { concept: "location", terme: "alquiler" },
      { concept: "devis", terme: "presupuesto gratuito" },
      { concept: "séance", terme: "sesión / proyección" },
    ],
  },
  {
    code: "it",
    label: "Italien",
    domaine: "hallucinecran.it",
    culture:
      "L'« arena estiva » (cinéma d'été en plein air, souvent en piazza) est un repère culturel fort. Interlocuteurs publics = comuni. Variante poétique répandue : « cinema sotto le stelle ».",
    entrees: [
      { concept: "cinéma plein air", terme: "cinema all'aperto", variantes: "arena estiva, cinema sotto le stelle" },
      { concept: "écran gonflable", terme: "schermo gonfiabile", variantes: "maxischermo gonfiabile" },
      { concept: "mairie / commune", terme: "comune", piege: "« municipio » = le bâtiment" },
      { concept: "étanche (à l'air)", terme: "stagna (all'aria)", piege: "« impermeabile » = étanche à l'eau (contresens DeepL)" },
      { concept: "soufflerie / gonfleur", terme: "soffiante", piege: "« galleria del vento » = tunnel aérodynamique (contresens DeepL)" },
      { concept: "taille (écran)", terme: "dimensione", piege: "« taglie » = tailles de vêtements (contresens DeepL)" },
      { concept: "location", terme: "noleggio" },
      { concept: "devis", terme: "preventivo gratuito" },
      { concept: "séance", terme: "proiezione" },
      { concept: "jour J", terme: "il giorno dell'evento", piege: "« regata » déjà produit par DeepL (contresens total)" },
    ],
  },
  {
    code: "pt",
    label: "Portugais (PT-PT)",
    domaine: "hallucinecran.pt",
    culture:
      "Portugais européen strictement (pas de brésilien : aluguer et non aluguel, insuflável et non inflável). Interlocuteurs publics = câmaras municipais ; usage municipal et festas locales.",
    entrees: [
      { concept: "cinéma plein air", terme: "cinema ao ar livre" },
      { concept: "écran gonflable", terme: "tela insuflável", piege: "« inflável » = brésilien" },
      { concept: "mairie / commune", terme: "câmara municipal" },
      { concept: "étanche (à l'air)", terme: "à prova de ar", piege: "« impermeável » = étanche à l'eau (contresens DeepL)" },
      { concept: "soufflerie / gonfleur", terme: "ventilador", piege: "« túnel de vento » a déjà été en prod (contresens DeepL)" },
      { concept: "taille (écran)", terme: "tamanho" },
      { concept: "location", terme: "aluguer", piege: "« aluguel » = brésilien" },
      { concept: "devis", terme: "orçamento gratuito" },
      { concept: "séance", terme: "sessão" },
    ],
  },
];

/** Pages dont les locales ont divergé du FR (adaptation culturelle manuelle,
 *  campagne 2026-06-12 : gammes soufflerie/étanche, Bildschirm→Leinwand,
 *  hinchable/insuflável, cine de verano, arena estiva, page mairie ×5).
 *  Si une de ces pages change côté FR, réviser les langues à la main :
 *  les clés existantes ne sont jamais re-traduites par `pnpm translate`. */
export const PAGES_ADAPTEES: string[] = [
  "a-propos", "arches-gonflables", "blog", "cas-oran", "cas-velodrome",
  "cinema-plein-air", "cinema-plein-air-hotel", "cinema-plein-air-mairie",
  "common", "comparaison", "configurateur", "contact", "drive-in",
  "ecran-economique", "ecran-etanche", "ecran-geant", "ecran-geant-evenement",
  "ecrans", "etudes-cas", "galerie-video", "histoire", "home", "location",
  "mobilier", "mode-emploi", "nav", "packs", "prix", "products", "securite",
  "smartform", "tente-araignee", "tente-n", "tente-v", "tente-x", "tentes",
];
