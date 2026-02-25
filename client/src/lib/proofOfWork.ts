/**
 * Proof of Work côté client
 * Le navigateur doit trouver un nonce tel que SHA-256(challenge + nonce)
 * commence par un certain nombre de zéros.
 * Invisible pour l'utilisateur, coûteux pour un bot qui spamme en masse.
 * Typiquement ~100-500ms sur un navigateur moderne.
 */

const DIFFICULTY = 4; // Nombre de zéros en préfixe du hash

/**
 * Génère un challenge unique
 */
export function generateChallenge(): string {
  return `hallucine_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Résout le Proof of Work en trouvant un nonce valide
 * Retourne le nonce trouvé
 */
export async function solveProofOfWork(challenge: string): Promise<number> {
  let nonce = 0;
  const prefix = "0".repeat(DIFFICULTY);
  const encoder = new TextEncoder();

  while (true) {
    const data = `${challenge}:${nonce}`;
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    if (hashHex.startsWith(prefix)) {
      return nonce;
    }
    nonce++;

    // Yield au navigateur toutes les 1000 itérations pour ne pas bloquer l'UI
    if (nonce % 1000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}
