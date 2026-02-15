/**
 * emailIntelligence.ts — Extraction intelligente de nom/prénom/entreprise depuis une adresse email
 *
 * Logique 100% côté client, aucun appel réseau.
 * Analyse le local-part (avant @) et le domaine (après @) pour déduire :
 *  - Prénom
 *  - Nom
 *  - Entreprise (depuis le domaine, si non-générique)
 *
 * Gère les cas : prenom.nom, prenom_nom, prenom-nom, initiales, rôles génériques,
 * domaines composés (mairie-lyon, gl-events), domaines génériques (gmail, yahoo...),
 * noms composés (jean-baptiste, marie-claire), et cas internationaux.
 */

// ─── Domaines génériques (pas d'entreprise à extraire) ────────────────────────
const GENERIC_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.fr", "yahoo.co.uk",
  "hotmail.com", "hotmail.fr", "outlook.com", "outlook.fr",
  "live.com", "live.fr", "msn.com",
  "icloud.com", "me.com", "mac.com",
  "aol.com", "aol.fr",
  "protonmail.com", "proton.me", "pm.me",
  "mail.com", "email.com", "zoho.com",
  "orange.fr", "wanadoo.fr", "free.fr", "sfr.fr", "laposte.net",
  "bbox.fr", "numericable.fr", "neuf.fr", "alice.fr",
  "gmx.com", "gmx.fr", "gmx.de",
  "yandex.com", "yandex.ru",
  "mail.ru", "inbox.ru",
  "tutanota.com", "fastmail.com",
  "hey.com", "duck.com",
]);

// ─── Rôles génériques (ne pas extraire comme prénom/nom) ──────────────────────
const GENERIC_ROLES = new Set([
  "contact", "info", "information", "admin", "administrator", "administration",
  "direction", "directeur", "directrice",
  "commercial", "commerciale", "vente", "ventes", "sales",
  "location", "locations", "rental",
  "support", "aide", "help",
  "hello", "bonjour", "hi", "hola",
  "noreply", "no-reply", "no_reply", "donotreply",
  "webmaster", "postmaster", "hostmaster", "abuse",
  "accueil", "reception", "secretariat",
  "service", "services",
  "equipe", "team", "staff",
  "office", "bureau",
  "ceo", "cfo", "cto", "coo", "cmo", "dg", "pdg", "rh", "drh",
  "comptabilite", "facturation", "billing", "invoice",
  "marketing", "communication", "com", "presse", "press", "media",
  "technique", "tech", "it", "dev",
  "reservation", "reservations", "booking",
  "event", "events", "evenement", "evenements",
  "projet", "projets", "project", "projects",
]);

// ─── Prénoms français courants (pour désambiguïser) ───────────────────────────
const COMMON_FIRST_NAMES = new Set([
  // Masculins
  "jean", "pierre", "paul", "jacques", "michel", "philippe", "alain", "patrick",
  "nicolas", "christophe", "david", "thomas", "laurent", "daniel", "eric",
  "stephane", "frederic", "olivier", "franck", "francois", "marc", "antoine",
  "julien", "alexandre", "maxime", "vincent", "guillaume", "sebastien",
  "romain", "mathieu", "benoit", "arnaud", "hugo", "lucas", "louis",
  "gabriel", "raphael", "arthur", "leo", "adam", "noah", "nathan",
  "charles", "henri", "bernard", "robert", "andre", "rene", "claude",
  "yves", "dominique", "bruno", "didier", "thierry", "pascal", "gilles",
  "jerome", "emmanuel", "xavier", "cedric", "fabien", "fabrice",
  // Féminins
  "marie", "anne", "sophie", "nathalie", "isabelle", "catherine", "christine",
  "sylvie", "monique", "nicole", "sandrine", "valerie", "caroline", "virginie",
  "celine", "aurelie", "emilie", "julie", "camille", "claire", "charlotte",
  "emma", "lea", "manon", "chloe", "sarah", "laura", "marine", "pauline",
  "alice", "lucie", "margaux", "helene", "florence", "patricia", "brigitte",
  "martine", "francoise", "colette", "genevieve", "madeleine",
  // Internationaux courants
  "mohammed", "mohamed", "ahmed", "fatima", "amina", "youssef", "omar",
  "hassan", "ali", "karim", "rachid", "said", "nadia", "leila", "samira",
  "hans", "karl", "fritz", "anna", "maria",
  "carlos", "jose", "juan", "pedro", "miguel", "rosa", "carmen",
  "john", "james", "robert", "william", "michael", "david", "richard",
  "jennifer", "jessica", "sarah", "elizabeth", "mary", "patricia",
  "yuki", "kenji", "hiroshi", "akira", "sakura", "haruki",
]);

export interface EmailExtraction {
  prenom: string;
  nom: string;
  entreprise: string;
  confidence: "high" | "medium" | "low";
}

/**
 * Nettoie et capitalise un segment de nom
 * "jean-baptiste" → "Jean-Baptiste"
 * "dupont" → "Dupont"
 */
function capitalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^|[-'\s])(\w)/g, (_, sep, char) => sep + char.toUpperCase());
}

/**
 * Supprime les chiffres parasites d'un segment
 * "dupont2024" → "dupont"
 * "jean123" → "jean"
 */
function stripNumbers(str: string): string {
  return str.replace(/\d+/g, "").trim();
}

/**
 * Vérifie si un segment ressemble à une initiale
 * "j" → true, "jb" → true, "jean" → false
 */
function isInitial(str: string): boolean {
  return str.length <= 2 && /^[a-z]+$/i.test(str);
}

/**
 * Formate une initiale
 * "j" → "J.", "jb" → "J.B."
 */
function formatInitial(str: string): string {
  return str.toUpperCase().split("").join(".") + ".";
}

/**
 * Extrait le nom d'entreprise depuis un domaine non-générique
 * "mairie-lyon.fr" → "Mairie Lyon"
 * "gl-events.com" → "GL Events"
 * "sous-domaine.entreprise.co.uk" → "Entreprise"
 * "ocp.ma" → "OCP"
 */
function extractCompanyFromDomain(domain: string): string {
  // Retirer les TLD connus (multi-niveaux d'abord)
  const multiTlds = [".co.uk", ".co.jp", ".com.br", ".com.au", ".co.za", ".com.mx", ".org.uk"];
  let base = domain.toLowerCase();
  for (const tld of multiTlds) {
    if (base.endsWith(tld)) {
      base = base.slice(0, -tld.length);
      break;
    }
  }
  // TLD simple
  if (base.includes(".")) {
    const parts = base.split(".");
    // Si plusieurs sous-domaines, prendre le principal (avant-dernier ou dernier significatif)
    if (parts.length > 2) {
      // ex: "mail.entreprise" → "entreprise"
      base = parts[parts.length - 1];
      // Mais si c'est un TLD, prendre l'avant-dernier
      if (base.length <= 3) {
        base = parts[parts.length - 2];
      }
    } else {
      base = parts[0];
    }
  }

  if (!base || base.length < 2) return "";

  // Acronymes courts (3 lettres ou moins) → tout en majuscules
  if (base.length <= 3 && !base.includes("-")) {
    return base.toUpperCase();
  }

  // Nettoyer et capitaliser
  return capitalize(base.replace(/[-_]/g, " ").trim());
}

/**
 * Extraction principale : analyse une adresse email et retourne
 * le prénom, nom et entreprise déduits.
 */
export function extractFromEmail(email: string): EmailExtraction {
  const result: EmailExtraction = {
    prenom: "",
    nom: "",
    entreprise: "",
    confidence: "low",
  };

  if (!email || !email.includes("@")) return result;

  const [localPart, domainFull] = email.toLowerCase().split("@");
  if (!localPart || !domainFull) return result;

  // ─── Extraction entreprise depuis le domaine ────────────────────────
  if (!GENERIC_DOMAINS.has(domainFull)) {
    result.entreprise = extractCompanyFromDomain(domainFull);
  }

  // ─── Analyse du local-part ──────────────────────────────────────────
  const cleanLocal = stripNumbers(localPart);
  if (!cleanLocal || cleanLocal.length < 2) return result;

  // Vérifier si c'est un rôle générique
  const localNormalized = cleanLocal.replace(/[-_.]/g, "").toLowerCase();
  if (GENERIC_ROLES.has(localNormalized) || GENERIC_ROLES.has(cleanLocal.replace(/[-_]/g, ""))) {
    // Pas de nom/prénom, mais on garde l'entreprise
    if (result.entreprise) result.confidence = "medium";
    return result;
  }

  // Aussi vérifier chaque segment individuellement contre les rôles
  // ex: "contact.dupont" → "contact" est un rôle mais "dupont" pourrait être un nom
  // On ne filtre que si le local-part ENTIER est un rôle

  // Séparer le local-part en segments
  // Gère : prenom.nom, prenom_nom, prenom-nom, prenomnom (si reconnu)
  let segments: string[] = [];

  if (cleanLocal.includes(".")) {
    segments = cleanLocal.split(".");
  } else if (cleanLocal.includes("_")) {
    segments = cleanLocal.split("_");
  } else if (cleanLocal.includes("-")) {
    // Attention : "jean-baptiste" est un prénom composé, pas prénom-nom
    // Heuristique : si le premier segment est un prénom connu ET le second aussi,
    // c'est probablement prénom-nom. Sinon c'est un prénom composé.
    const parts = cleanLocal.split("-");
    if (parts.length === 2) {
      const bothKnown = COMMON_FIRST_NAMES.has(parts[0]) && COMMON_FIRST_NAMES.has(parts[1]);
      const firstKnownSecondNot = COMMON_FIRST_NAMES.has(parts[0]) && !COMMON_FIRST_NAMES.has(parts[1]);
      if (bothKnown) {
        // "jean-marie" → probablement un prénom composé
        // Sauf si le second est très courant comme nom de famille aussi
        // On traite comme prénom composé par défaut
        segments = [cleanLocal]; // Garder comme un seul segment = prénom composé
      } else if (firstKnownSecondNot) {
        // "jean-dupont" → prénom + nom
        segments = parts;
      } else {
        // Inconnu - traiter comme segments séparés
        segments = parts;
      }
    } else {
      segments = parts;
    }
  } else {
    // Pas de séparateur : "jdupont", "fdupont", "dupont"
    // Essayer de détecter initiale + nom
    if (cleanLocal.length > 2) {
      // D'abord vérifier si le mot entier est un prénom connu
      if (COMMON_FIRST_NAMES.has(cleanLocal.toLowerCase())) {
        segments = [cleanLocal];
      } else {
        const firstChar = cleanLocal[0];
        const rest = cleanLocal.slice(1);
        // Vérifier si "rest" est un mot connu (prénom ou suffisamment long)
        // Ne séparer que si le reste commence par une majuscule logique (>= 4 chars)
        // et que le premier char est bien une initiale isolée
        if (/^[a-z]$/.test(firstChar) && rest.length >= 4 && !COMMON_FIRST_NAMES.has(cleanLocal)) {
          // Vérifier que le rest n'est pas le mot complet tronqué
          // ex: "dupont" → ne pas couper en "d" + "upont"
          // Heuristique : si le mot complet (cleanLocal) ressemble à un nom de famille
          // (pas de voyelle en position 2 après la coupure = probablement pas un vrai mot)
          const restLower = rest.toLowerCase();
          const firstVowelPos = restLower.search(/[aeiouy]/);
          if (firstVowelPos === 0) {
            // Le reste commence par une voyelle → probablement une coupure artificielle
            // ex: "dupont" → "d" + "upont" (upont commence par voyelle = mauvaise coupure)
            segments = [cleanLocal];
          } else {
            segments = [firstChar, rest];
          }
        } else {
          // Mot unique — pourrait être un nom, un pseudo...
          segments = [cleanLocal];
        }
      }
    } else {
      return result; // Trop court
    }
  }

  // Filtrer les segments vides et nettoyer
  segments = segments.map(s => s.trim()).filter(s => s.length > 0);

  if (segments.length === 0) return result;

  // ─── Attribution prénom / nom ───────────────────────────────────────

  if (segments.length === 1) {
    const seg = segments[0];
    const cleaned = stripNumbers(seg);
    if (!cleaned) return result;

    // Un seul segment : c'est probablement un nom ou un prénom
    if (COMMON_FIRST_NAMES.has(cleaned.toLowerCase())) {
      result.prenom = capitalize(cleaned);
      result.confidence = "low";
    } else if (cleaned.includes("-")) {
      // Prénom composé potentiel : "jean-baptiste"
      const subParts = cleaned.split("-");
      if (subParts.length === 2 && COMMON_FIRST_NAMES.has(subParts[0])) {
        result.prenom = capitalize(cleaned);
        result.confidence = "medium";
      } else {
        result.nom = capitalize(cleaned);
        result.confidence = "low";
      }
    } else {
      // Nom de famille probable
      result.nom = capitalize(cleaned);
      result.confidence = "low";
    }
  } else if (segments.length === 2) {
    const [seg1, seg2] = segments;
    const clean1 = stripNumbers(seg1);
    const clean2 = stripNumbers(seg2);

    if (!clean1 && !clean2) return result;
    if (!clean1) {
      result.nom = capitalize(clean2);
      result.confidence = "low";
      return result;
    }
    if (!clean2) {
      result.prenom = isInitial(clean1) ? formatInitial(clean1) : capitalize(clean1);
      result.confidence = "low";
      return result;
    }

    // Vérifier si seg1 est un rôle générique (ex: "contact.dupont")
    if (GENERIC_ROLES.has(clean1)) {
      result.nom = capitalize(clean2);
      result.confidence = "low";
      return result;
    }

    // Cas classique : prénom.nom
    if (isInitial(clean1)) {
      result.prenom = formatInitial(clean1);
    } else {
      result.prenom = capitalize(clean1);
    }
    result.nom = capitalize(clean2);

    // Évaluer la confiance
    if (COMMON_FIRST_NAMES.has(clean1.toLowerCase()) && clean2.length >= 3) {
      result.confidence = "high";
    } else if (clean1.length >= 2 && clean2.length >= 3) {
      result.confidence = "medium";
    } else {
      result.confidence = "low";
    }
  } else if (segments.length >= 3) {
    // 3+ segments : "anne.sophie.petit" ou "le.petit.prince"
    // Heuristique : dernier segment = nom, le reste = prénom(s)
    const lastSeg = stripNumbers(segments[segments.length - 1]);
    const firstSegs = segments.slice(0, -1).map(s => stripNumbers(s)).filter(Boolean);

    if (firstSegs.length > 0) {
      // Vérifier si le premier segment est un rôle
      if (GENERIC_ROLES.has(firstSegs[0].toLowerCase())) {
        // "service.jean.dupont" → ignorer "service"
        if (firstSegs.length > 1) {
          result.prenom = firstSegs.slice(1).map(s => capitalize(s)).join(" ");
        }
      } else {
        result.prenom = firstSegs.map(s =>
          isInitial(s) ? formatInitial(s) : capitalize(s)
        ).join(" ");
      }
    }
    if (lastSeg) {
      result.nom = capitalize(lastSeg);
    }
    result.confidence = firstSegs.length > 0 && lastSeg ? "medium" : "low";
  }

  // Boost de confiance si on a aussi l'entreprise
  if (result.entreprise && result.prenom && result.nom) {
    if (result.confidence === "medium") result.confidence = "high";
  }

  return result;
}

/**
 * Vérifie si un domaine email est générique (Gmail, Yahoo, etc.)
 */
export function isGenericDomain(email: string): boolean {
  if (!email.includes("@")) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? GENERIC_DOMAINS.has(domain) : false;
}

/**
 * Retourne le domaine nettoyé d'un email (sans TLD)
 * Utile pour la suggestion d'entreprise
 */
export function getDomainName(email: string): string {
  if (!email.includes("@")) return "";
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain || GENERIC_DOMAINS.has(domain)) return "";
  return extractCompanyFromDomain(domain);
}
