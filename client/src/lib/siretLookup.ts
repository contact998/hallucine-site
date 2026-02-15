/**
 * Module de recherche SIRET/SIREN via l'API Recherche d'Entreprises (gouv.fr)
 * API gratuite, sans clé, 7 req/sec max
 * https://recherche-entreprises.api.gouv.fr/docs/
 */

const API_BASE = "https://recherche-entreprises.api.gouv.fr/search";

export interface SiretResult {
  siren: string;
  siret: string;
  nomComplet: string;
  nomRaisonSociale: string;
  adresse: string;
  codePostal: string;
  ville: string;
  departement: string;
  activitePrincipale: string;
  categorieEntreprise: string;
  etatAdministratif: string;
  dateCreation: string;
  /** true si l'entreprise est active */
  estActive: boolean;
}

export interface SiretSearchResponse {
  results: SiretResult[];
  totalResults: number;
  error?: string;
}

/**
 * Nettoie un numéro SIRET/SIREN (retire espaces, tirets, points)
 */
export function cleanSiretInput(input: string): string {
  return input.replace(/[\s.\-/]/g, "");
}

/**
 * Vérifie si la chaîne ressemble à un SIRET (14 chiffres) ou SIREN (9 chiffres)
 */
export function isSiretOrSiren(input: string): boolean {
  const cleaned = cleanSiretInput(input);
  return /^\d{9}$/.test(cleaned) || /^\d{14}$/.test(cleaned);
}

/**
 * Vérifie la validité d'un SIRET via l'algorithme de Luhn
 * Le SIRET est valide si la somme de contrôle est divisible par 10
 * Exception : La Poste (SIREN 356000000) utilise un algorithme différent
 */
export function isValidSiretLuhn(siret: string): boolean {
  const cleaned = cleanSiretInput(siret);
  if (!/^\d{14}$/.test(cleaned)) return false;

  // Exception La Poste
  if (cleaned.startsWith("356000000")) return true;

  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(cleaned[i], 10);
    // Position paire (0-indexed) : multiplier par 1
    // Position impaire : multiplier par 2
    if (i % 2 !== 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/**
 * Vérifie la validité d'un SIREN via l'algorithme de Luhn
 */
export function isValidSirenLuhn(siren: string): boolean {
  const cleaned = cleanSiretInput(siren);
  if (!/^\d{9}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(cleaned[i], 10);
    if (i % 2 !== 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/**
 * Parse la réponse de l'API en format exploitable
 */
function parseApiResult(item: Record<string, unknown>): SiretResult {
  const siege = (item.siege || {}) as Record<string, unknown>;
  return {
    siren: (item.siren as string) || "",
    siret: (siege.siret as string) || "",
    nomComplet: (item.nom_complet as string) || "",
    nomRaisonSociale: (item.nom_raison_sociale as string) || "",
    adresse: (siege.geo_adresse as string) || (siege.adresse as string) || "",
    codePostal: (siege.code_postal as string) || "",
    ville: (siege.libelle_commune as string) || "",
    departement: (siege.departement as string) || "",
    activitePrincipale: (item.activite_principale as string) || "",
    categorieEntreprise: (item.categorie_entreprise as string) || "",
    etatAdministratif: (item.etat_administratif as string) || "A",
    dateCreation: (item.date_creation as string) || "",
    estActive: (item.etat_administratif as string) === "A",
  };
}

/**
 * Recherche une entreprise par SIRET, SIREN ou nom
 * Retourne les résultats formatés
 */
export async function searchEntreprise(
  query: string,
  options: { perPage?: number; activeOnly?: boolean } = {}
): Promise<SiretSearchResponse> {
  const { perPage = 5, activeOnly = true } = options;

  if (!query || query.trim().length < 2) {
    return { results: [], totalResults: 0 };
  }

  const cleaned = cleanSiretInput(query);
  const params = new URLSearchParams({
    q: cleaned,
    per_page: String(perPage),
    page: "1",
  });

  // Si on cherche uniquement les entreprises actives
  if (activeOnly) {
    params.set("etat_administratif", "A");
  }

  try {
    const response = await fetch(`${API_BASE}?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Hallucine-Site/1.0",
      },
    });

    if (response.status === 429) {
      return {
        results: [],
        totalResults: 0,
        error: "Trop de requêtes. Veuillez patienter quelques secondes.",
      };
    }

    if (!response.ok) {
      return {
        results: [],
        totalResults: 0,
        error: `Erreur API (${response.status})`,
      };
    }

    const data = await response.json();
    const results = ((data.results || []) as Record<string, unknown>[]).map(parseApiResult);

    return {
      results,
      totalResults: data.total_results || 0,
    };
  } catch (err) {
    console.warn("[SIRET Lookup] Erreur réseau:", err);
    return {
      results: [],
      totalResults: 0,
      error: "Erreur de connexion. Vérifiez votre connexion internet.",
    };
  }
}

/**
 * Recherche rapide par SIRET exact (14 chiffres)
 * Retourne le premier résultat ou null
 */
export async function lookupBySiret(siret: string): Promise<SiretResult | null> {
  const cleaned = cleanSiretInput(siret);
  if (!/^\d{14}$/.test(cleaned)) return null;

  const response = await searchEntreprise(cleaned, { perPage: 1 });
  if (response.results.length > 0 && response.results[0].siret === cleaned) {
    return response.results[0];
  }
  return response.results.length > 0 ? response.results[0] : null;
}

/**
 * Recherche rapide par SIREN (9 chiffres)
 * Retourne le premier résultat (siège) ou null
 */
export async function lookupBySiren(siren: string): Promise<SiretResult | null> {
  const cleaned = cleanSiretInput(siren);
  if (!/^\d{9}$/.test(cleaned)) return null;

  const response = await searchEntreprise(cleaned, { perPage: 1 });
  if (response.results.length > 0 && response.results[0].siren === cleaned) {
    return response.results[0];
  }
  return response.results.length > 0 ? response.results[0] : null;
}

/**
 * Recherche par nom d'entreprise avec auto-complétion
 * Retourne jusqu'à 5 suggestions
 */
export async function searchByName(name: string): Promise<SiretResult[]> {
  if (!name || name.trim().length < 2) return [];

  const response = await searchEntreprise(name, { perPage: 5 });
  return response.results;
}

/**
 * Formate un SIRET pour l'affichage : 352 094 421 00025
 */
export function formatSiret(siret: string): string {
  const cleaned = cleanSiretInput(siret);
  if (cleaned.length !== 14) return siret;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
}

/**
 * Formate un SIREN pour l'affichage : 352 094 421
 */
export function formatSiren(siren: string): string {
  const cleaned = cleanSiretInput(siren);
  if (cleaned.length !== 9) return siren;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
}
