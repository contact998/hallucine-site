/**
 * Module anti-spam robuste
 * Combine plusieurs couches de protection invisibles pour l'utilisateur :
 * 1. Honeypot (champ caché)
 * 2. Délai minimum (temps de remplissage)
 * 3. Rate limiting par IP
 * 4. Proof of Work (PoW) — challenge côté client
 * 5. Validation email renforcée (domaines jetables)
 * 6. Score de confiance composite
 */

// ─── Liste de domaines email jetables (top 100+) ───
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "tempmail.com",
  "throwaway.email", "temp-mail.org", "fakeinbox.com", "sharklasers.com",
  "guerrillamailblock.com", "grr.la", "dispostable.com", "yopmail.com",
  "yopmail.fr", "yopmail.net", "cool.fr.nf", "jetable.fr.nf", "nospam.ze.tc",
  "nomail.xl.cx", "mega.zik.dj", "speed.1s.fr", "courriel.fr.nf",
  "moncourrier.fr.nf", "monemail.fr.nf", "monmail.fr.nf", "tempail.com",
  "tempr.email", "discard.email", "discardmail.com", "discardmail.de",
  "trashmail.com", "trashmail.me", "trashmail.net", "trashmail.org",
  "trashmail.at", "trashmail.io", "trash-mail.com", "trashemail.de",
  "wegwerfmail.de", "wegwerfmail.net", "wegwerfmail.org", "emailondeck.com",
  "33mail.com", "maildrop.cc", "mailnesia.com", "mailcatch.com",
  "mailexpire.com", "mailforspam.com", "mailmoat.com", "mailnull.com",
  "mailscrap.com", "mailshell.com", "mailsiphon.com", "mailslurp.com",
  "mailtemp.info", "mailtothis.com", "mailzilla.com", "mailzilla.org",
  "mohmal.com", "mt2015.com", "mytemp.email", "mytrashmail.com",
  "nobulk.com", "noclickemail.com", "nogmailspam.info", "nomail.ch",
  "nomail.xl.cx", "nospam.ze.tc", "notmailinator.com", "nowmymail.com",
  "objectmail.com", "obobbo.com", "onewaymail.com", "otherinbox.com",
  "owlpic.com", "pjjkp.com", "plexolan.de", "pookmail.com",
  "proxymail.eu", "putthisinyouremail.com", "reallymymail.com",
  "receiveee.com", "regbypass.com", "rhyta.com", "rklips.com",
  "rmqkr.net", "royal.net", "rppkn.com", "rtrtr.com", "rustyload.com",
  "s0ny.net", "safe-mail.net", "safersignup.de", "safetymail.info",
  "safetypost.de", "sandelf.de", "saynotospams.com", "scatmail.com",
  "schafmail.de", "selfdestructingmail.com", "sendspamhere.com",
  "shiftmail.com", "skeefmail.com", "slaskpost.se", "slipry.net",
  "slopsbox.com", "smashmail.de", "soodonims.com", "spam4.me",
  "spamavert.com", "spambob.com", "spambob.net", "spambob.org",
  "spambox.us", "spamcero.com", "spamday.com", "spamex.com",
  "spamfighter.cf", "spamfighter.ga", "spamfighter.gq", "spamfighter.ml",
  "spamfighter.tk", "spamfree24.com", "spamfree24.de", "spamfree24.eu",
  "spamfree24.info", "spamfree24.net", "spamfree24.org", "spamgoes.in",
  "spamherelots.com", "spamhereplease.com", "spamhole.com", "spamify.com",
  "spaminator.de", "spamkill.info", "spaml.com", "spaml.de",
  "spamoff.de", "spamslicer.com", "spamspot.com", "spamstack.net",
  "spamthis.co.uk", "spamtrap.ro", "spamtrail.com", "spamwc.de",
  "10minutemail.com", "10minutemail.net", "minutemail.com",
  "getairmail.com", "getnada.com", "harakirimail.com", "imgof.com",
  "incognitomail.org", "inboxalias.com", "mailhazard.com",
  "crazymailing.com", "deadaddress.com", "despammed.com",
  "devnullmail.com", "dfgh.net", "digitalsanctuary.com",
  "disposableaddress.com", "disposableemailaddresses.emailmiser.com",
  "disposableinbox.com", "dispose.it", "dm.w3internet.co.uk",
  "dodgeit.com", "dodgit.com", "dontreg.com", "dontsendmespam.de",
  "drdrb.com", "dump-email.info", "dumpandjunk.com", "dumpyemail.com",
  "e4ward.com", "easytrashmail.com", "einrot.com", "email60.com",
  "emailgo.de", "emailias.com", "emailigo.de", "emailinfive.com",
  "emailable.rocks", "emailmiser.com", "emailproxsy.com",
  "emailsensei.com", "emailtemporario.com.br", "emailto.de",
  "emailwarden.com", "emailx.at.hm", "emailxfer.com",
  "emz.net", "enterto.com", "ephemail.net", "etranquil.com",
  "etranquil.net", "etranquil.org", "evopo.com", "explodemail.com",
  "express.net.ua", "eyepaste.com", "fastacura.com", "fastchevy.com",
  "fastchrysler.com", "fastkawasaki.com", "fastmazda.com",
  "fastnissan.com", "fastsubaru.com", "fastsuzuki.com",
  "fasttoyota.com", "fastyamaha.com",
]);

/**
 * Vérifie si un email utilise un domaine jetable
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}

/**
 * Vérifie le honeypot
 */
export function checkHoneypot(value: string | undefined): boolean {
  return !!value && value.trim().length > 0;
}

/**
 * Vérifie le délai minimum de remplissage
 */
export function checkMinDelay(timestamp: number | undefined, minMs: number = 5000): boolean {
  if (!timestamp) return false; // pas de timestamp = pas de vérification
  const elapsed = Date.now() - timestamp;
  return elapsed < minMs;
}

/**
 * Rate limiting en mémoire par IP
 */
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(ip: string, maxPerHour: number = 5): { blocked: boolean; count: number } {
  const now = Date.now();
  const hourAgo = now - 3600000;

  // Nettoyer les anciennes entrées
  Array.from(rateLimitMap.entries()).forEach(([key, timestamps]) => {
    const recent = timestamps.filter((t: number) => t > hourAgo);
    if (recent.length === 0) rateLimitMap.delete(key);
    else rateLimitMap.set(key, recent);
  });

  const ipTimestamps = rateLimitMap.get(ip) || [];
  if (ipTimestamps.length >= maxPerHour) {
    return { blocked: true, count: ipTimestamps.length };
  }
  rateLimitMap.set(ip, [...ipTimestamps, now]);
  return { blocked: false, count: ipTimestamps.length + 1 };
}

/**
 * Vérifie le Proof of Work (PoW)
 * Le client envoie un challenge + nonce. Le serveur vérifie que
 * SHA-256(challenge + nonce) commence par le nombre requis de zéros.
 */
export async function verifyProofOfWork(
  challenge: string | undefined,
  nonce: number | undefined,
  difficulty: number = 4
): Promise<boolean> {
  if (!challenge || nonce === undefined) return false;

  const data = `${challenge}:${nonce}`;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  const prefix = "0".repeat(difficulty);
  return hashHex.startsWith(prefix);
}

/**
 * Génère un challenge PoW (côté serveur si besoin, mais on le fait côté client)
 */
export function generateChallenge(): string {
  return `hallucine_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Score de confiance composite (0-100)
 * 100 = totalement fiable, 0 = spam certain
 */
export interface SpamCheckResult {
  score: number;
  reasons: string[];
  blocked: boolean;
}

export async function computeSpamScore(params: {
  honeypot?: string;
  timestamp?: number;
  ip: string;
  email: string;
  powChallenge?: string;
  powNonce?: number;
}): Promise<SpamCheckResult> {
  const reasons: string[] = [];
  let score = 100;

  // 1. Honeypot (-100 points = bloqué immédiatement)
  if (checkHoneypot(params.honeypot)) {
    score -= 100;
    reasons.push("Honeypot rempli");
  }

  // 2. Délai minimum (-50 points)
  if (checkMinDelay(params.timestamp, 3000)) {
    score -= 50;
    reasons.push(`Soumission trop rapide (${params.timestamp ? Date.now() - params.timestamp : 0}ms)`);
  } else if (checkMinDelay(params.timestamp, 5000)) {
    score -= 20;
    reasons.push("Soumission rapide (3-5s)");
  }

  // 3. Rate limiting (-40 points si proche de la limite)
  const rateResult = checkRateLimit(params.ip);
  if (rateResult.blocked) {
    score -= 60;
    reasons.push(`Rate limit dépassé (${rateResult.count}/h)`);
  } else if (rateResult.count >= 3) {
    score -= 15;
    reasons.push(`Soumissions fréquentes (${rateResult.count}/h)`);
  }

  // 4. Email jetable (-40 points)
  if (isDisposableEmail(params.email)) {
    score -= 40;
    reasons.push("Domaine email jetable détecté");
  }

  // 5. Proof of Work (-30 points si absent, -50 si invalide)
  if (!params.powChallenge || params.powNonce === undefined) {
    score -= 30;
    reasons.push("Proof of Work absent");
  } else {
    const powValid = await verifyProofOfWork(params.powChallenge, params.powNonce);
    if (!powValid) {
      score -= 50;
      reasons.push("Proof of Work invalide");
    }
  }

  // 6. Vérifications email basiques
  const emailParts = params.email.split("@");
  if (emailParts.length !== 2 || !emailParts[1].includes(".")) {
    score -= 30;
    reasons.push("Format email suspect");
  }

  // Normaliser le score entre 0 et 100
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    reasons,
    blocked: score <= 30, // Bloqué si score <= 30
  };
}

/**
 * Réinitialiser le rate limit (pour les tests)
 */
export function resetRateLimit(): void {
  rateLimitMap.clear();
}
