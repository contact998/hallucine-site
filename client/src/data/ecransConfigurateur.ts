/**
 * Données des écrans gonflables Hallucine — tarif client 2026 HT.
 * Source : « FR Hallucine Tarifs 2026 - Écrans Géants Gonflables ».
 * Consommé par le configurateur (pages/Configurateur.tsx).
 *
 * Les dimensions et prix sont neutres en langue ; seuls les libellés
 * d'interface sont traduits (namespace i18n « configurateur »).
 */

export type GammeEcran = "etanche" | "soufflerie";

export interface ModeleEcran {
  id: string;
  gamme: GammeEcran;
  /** Variante drive-in : base d'image surélevée pour les rangs de voitures. */
  driveIn?: boolean;
  /** Dimensions hors tout (structure gonflée). */
  tailleHorsTout: string;
  /** Dimensions de la toile de projection. */
  toile: string;
  /** Largeur de toile en mètres — clé de correspondance avec l'audience. */
  toileLargeurM: number;
  poidsKg: number;
  /** Hauteur entre le sol et le bas de l'image projetée. */
  hauteurBaseImageM: number;
  montageMinutes: number;
  personnesMin: number;
  personnesMax?: number;
  garantieAns: number;
  prixHT: number;
}

/** Gamme étanche — sans soufflerie permanente, garantie 3 ans. */
const ETANCHE: ModeleEcran[] = [
  { id: "et-2",  gamme: "etanche", tailleHorsTout: "2,15 m × 1,86 m",  toile: "2,00 m × 1,22 m",  toileLargeurM: 2,  poidsKg: 6,  hauteurBaseImageM: 0.5, montageMinutes: 10, personnesMin: 1, garantieAns: 3, prixHT: 1600 },
  { id: "et-25", gamme: "etanche", tailleHorsTout: "2,85 m × 1,80 m",  toile: "2,50 m × 1,40 m",  toileLargeurM: 2.5, poidsKg: 7,  hauteurBaseImageM: 0.5, montageMinutes: 10, personnesMin: 1, garantieAns: 3, prixHT: 1800 },
  { id: "et-3",  gamme: "etanche", tailleHorsTout: "3,14 m × 2,34 m",  toile: "3,00 m × 1,70 m",  toileLargeurM: 3,  poidsKg: 8,  hauteurBaseImageM: 0.5, montageMinutes: 20, personnesMin: 1, garantieAns: 3, prixHT: 2300 },
  { id: "et-4",  gamme: "etanche", tailleHorsTout: "4,26 m × 3,52 m",  toile: "4,00 m × 2,25 m",  toileLargeurM: 4,  poidsKg: 15, hauteurBaseImageM: 1.0, montageMinutes: 20, personnesMin: 1, garantieAns: 3, prixHT: 3800 },
  { id: "et-5",  gamme: "etanche", tailleHorsTout: "5,20 m × 4,30 m",  toile: "5,00 m × 2,50 m",  toileLargeurM: 5,  poidsKg: 20, hauteurBaseImageM: 1.2, montageMinutes: 20, personnesMin: 1, garantieAns: 3, prixHT: 4400 },
  { id: "et-6",  gamme: "etanche", tailleHorsTout: "6,20 m × 5,05 m",  toile: "6,00 m × 3,38 m",  toileLargeurM: 6,  poidsKg: 32, hauteurBaseImageM: 1.5, montageMinutes: 30, personnesMin: 1, garantieAns: 3, prixHT: 6700 },
  { id: "et-7",  gamme: "etanche", tailleHorsTout: "7,24 m × 5,85 m",  toile: "7,00 m × 3,95 m",  toileLargeurM: 7,  poidsKg: 45, hauteurBaseImageM: 1.6, montageMinutes: 30, personnesMin: 2, garantieAns: 3, prixHT: 8300 },
  { id: "et-8",  gamme: "etanche", tailleHorsTout: "8,20 m × 6,30 m",  toile: "8,00 m × 4,50 m",  toileLargeurM: 8,  poidsKg: 50, hauteurBaseImageM: 1.6, montageMinutes: 30, personnesMin: 2, garantieAns: 3, prixHT: 11300 },
  { id: "et-9",  gamme: "etanche", tailleHorsTout: "9,20 m × 6,85 m",  toile: "9,00 m × 5,06 m",  toileLargeurM: 9,  poidsKg: 62, hauteurBaseImageM: 1.6, montageMinutes: 40, personnesMin: 2, personnesMax: 3, garantieAns: 3, prixHT: 12900 },
  { id: "et-10", gamme: "etanche", tailleHorsTout: "10,24 m × 7,53 m", toile: "10,00 m × 5,70 m", toileLargeurM: 10, poidsKg: 75, hauteurBaseImageM: 1.6, montageMinutes: 40, personnesMin: 2, personnesMax: 3, garantieAns: 3, prixHT: 13200 },
];

/** Gamme soufflerie — soufflerie permanente, garantie 10 ans. */
const SOUFFLERIE: ModeleEcran[] = [
  { id: "sf-8",  gamme: "soufflerie", tailleHorsTout: "8 m × 6 m",   toile: "7 m × 4 m",     toileLargeurM: 7,  poidsKg: 35,  hauteurBaseImageM: 1.6, montageMinutes: 30, personnesMin: 1, garantieAns: 10, prixHT: 7990 },
  { id: "sf-9",  gamme: "soufflerie", tailleHorsTout: "9 m × 6,5 m", toile: "8 m × 4,5 m",   toileLargeurM: 8,  poidsKg: 36,  hauteurBaseImageM: 1.6, montageMinutes: 30, personnesMin: 1, garantieAns: 10, prixHT: 11800 },
  { id: "sf-10", gamme: "soufflerie", tailleHorsTout: "10 m × 7 m",  toile: "9 m × 5 m",     toileLargeurM: 9,  poidsKg: 50,  hauteurBaseImageM: 2.0, montageMinutes: 30, personnesMin: 1, garantieAns: 10, prixHT: 12800 },
  { id: "sf-drivein", gamme: "soufflerie", driveIn: true, tailleHorsTout: "10 m × 8 m", toile: "9 m × 5 m", toileLargeurM: 9, poidsKg: 60, hauteurBaseImageM: 3.0, montageMinutes: 30, personnesMin: 1, garantieAns: 10, prixHT: 13900 },
  { id: "sf-11", gamme: "soufflerie", tailleHorsTout: "11 m × 8 m",  toile: "10 m × 5,5 m",  toileLargeurM: 10, poidsKg: 55,  hauteurBaseImageM: 2.2, montageMinutes: 30, personnesMin: 1, garantieAns: 10, prixHT: 14024 },
  { id: "sf-12", gamme: "soufflerie", tailleHorsTout: "12 m × 8 m",  toile: "11 m × 5,6 m",  toileLargeurM: 11, poidsKg: 62,  hauteurBaseImageM: 2.2, montageMinutes: 30, personnesMin: 1, garantieAns: 10, prixHT: 17000 },
  { id: "sf-13", gamme: "soufflerie", tailleHorsTout: "13 m × 9 m",  toile: "12 m × 6,8 m",  toileLargeurM: 12, poidsKg: 80,  hauteurBaseImageM: 2.2, montageMinutes: 40, personnesMin: 1, garantieAns: 10, prixHT: 17705 },
  { id: "sf-14", gamme: "soufflerie", tailleHorsTout: "14 m × 10 m", toile: "13 m × 7 m",    toileLargeurM: 13, poidsKg: 90,  hauteurBaseImageM: 2.2, montageMinutes: 45, personnesMin: 2, garantieAns: 10, prixHT: 23767 },
  { id: "sf-15", gamme: "soufflerie", tailleHorsTout: "15 m × 10 m", toile: "14 m × 8 m",    toileLargeurM: 14, poidsKg: 110, hauteurBaseImageM: 2.2, montageMinutes: 45, personnesMin: 2, garantieAns: 10, prixHT: 31105 },
  { id: "sf-17", gamme: "soufflerie", tailleHorsTout: "17 m × 12 m", toile: "15 m × 8,5 m",  toileLargeurM: 15, poidsKg: 180, hauteurBaseImageM: 2.2, montageMinutes: 60, personnesMin: 2, garantieAns: 10, prixHT: 34105 },
  { id: "sf-20", gamme: "soufflerie", tailleHorsTout: "20 m × 14 m", toile: "18 m × 10 m",   toileLargeurM: 18, poidsKg: 220, hauteurBaseImageM: 2.2, montageMinutes: 75, personnesMin: 3, garantieAns: 10, prixHT: 41233 },
  { id: "sf-24", gamme: "soufflerie", tailleHorsTout: "24 m × 14 m", toile: "22 m × 12 m",   toileLargeurM: 22, poidsKg: 280, hauteurBaseImageM: 2.2, montageMinutes: 90, personnesMin: 4, garantieAns: 10, prixHT: 48258 },
];

export const ECRANS: ModeleEcran[] = [...ETANCHE, ...SOUFFLERIE];

export const ECRAN_DRIVE_IN = SOUFFLERIE.find((m) => m.driveIn)!;

export type UsageConfig = "interieur" | "exterieur" | "drive-in";

/** Paliers d'audience proposés à l'utilisateur (largeur de toile cible indicative). */
export interface PalierAudience {
  id: string;
  /** Largeur de toile visée, en mètres. */
  toileCibleM: number;
}

export const PALIERS_AUDIENCE: PalierAudience[] = [
  { id: "p1", toileCibleM: 4 },
  { id: "p2", toileCibleM: 6 },
  { id: "p3", toileCibleM: 8 },
  { id: "p4", toileCibleM: 12 },
  { id: "p5", toileCibleM: 18 },
];

export interface Recommandation {
  principal: ModeleEcran;
  alternatives: ModeleEcran[];
  /** Clé i18n d'une note contextuelle, si pertinent. */
  noteKey?: string;
}

/** Plus petit modèle dont la toile couvre la largeur cible, sinon le plus grand. */
function choisirParToile(candidats: ModeleEcran[], cibleM: number): ModeleEcran {
  const tries = [...candidats].sort((a, b) => a.toileLargeurM - b.toileLargeurM);
  return tries.find((m) => m.toileLargeurM >= cibleM) ?? tries[tries.length - 1];
}

function voisins(candidats: ModeleEcran[], principal: ModeleEcran): ModeleEcran[] {
  const tries = [...candidats].sort((a, b) => a.toileLargeurM - b.toileLargeurM);
  const i = tries.findIndex((m) => m.id === principal.id);
  return [tries[i - 1], tries[i + 1]].filter((m): m is ModeleEcran => Boolean(m));
}

/**
 * Recommande un écran à partir d'un palier d'audience et d'un usage.
 * Logique déterministe — aucun appel réseau, sûr pour le rendu SSR.
 */
export function recommander(palier: PalierAudience, usage: UsageConfig): Recommandation {
  if (usage === "drive-in") {
    return { principal: ECRAN_DRIVE_IN, alternatives: [], noteKey: "note_drivein" };
  }

  const cible = palier.toileCibleM;

  if (usage === "interieur") {
    const principal = choisirParToile(ETANCHE, cible);
    return {
      principal,
      alternatives: voisins(ETANCHE, principal),
      noteKey: cible > principal.toileLargeurM ? "note_interieur_grand" : undefined,
    };
  }

  // Extérieur : étanche jusqu'à 6 m de toile, soufflerie au-delà.
  if (cible <= 6) {
    const principal = choisirParToile(ETANCHE, cible);
    return { principal, alternatives: voisins(ETANCHE, principal) };
  }

  const grandPublic = SOUFFLERIE.filter((m) => !m.driveIn);
  const principal = choisirParToile(grandPublic, cible);
  return { principal, alternatives: voisins(grandPublic, principal) };
}
