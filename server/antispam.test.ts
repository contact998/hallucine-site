/**
 * Tests pour les 3 protections anti-spam invisibles
 * 1. Honeypot : champ caché rempli → rejet silencieux
 * 2. Rate limiting : max 5 soumissions/heure par IP
 * 3. Délai minimum : soumission < 5 secondes → rejet silencieux
 */
import { describe, it, expect, beforeEach } from "vitest";

// ─── Réplique de la logique anti-spam depuis routers.ts ─────────────────────

/** Honeypot : si le champ est rempli, c'est un bot */
function checkHoneypot(hp: string | undefined): boolean {
  return !!hp;
}

/** Délai minimum : si soumission < 5000ms après ouverture, c'est un bot */
function checkMinDelay(ts: number | undefined): boolean {
  if (!ts) return false;
  const elapsed = Date.now() - ts;
  return elapsed < 5000;
}

/** Rate limiting en mémoire */
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string, maxPerHour: number = 5): { blocked: boolean; count: number } {
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

// ─── 1. Tests Honeypot ──────────────────────────────────────────────────────

describe("Anti-spam — Honeypot", () => {
  it("détecte un bot quand le champ honeypot est rempli", () => {
    expect(checkHoneypot("spam content")).toBe(true);
    expect(checkHoneypot("http://spam.com")).toBe(true);
  });

  it("laisse passer quand le champ honeypot est vide", () => {
    expect(checkHoneypot("")).toBe(false);
    expect(checkHoneypot(undefined)).toBe(false);
  });
});

// ─── 2. Tests Rate Limiting ─────────────────────────────────────────────────

describe("Anti-spam — Rate limiting", () => {
  beforeEach(() => {
    rateLimitMap.clear();
  });

  it("autorise les 5 premières soumissions", () => {
    for (let i = 1; i <= 5; i++) {
      const result = checkRateLimit("192.168.1.1");
      expect(result.blocked).toBe(false);
      expect(result.count).toBe(i);
    }
  });

  it("bloque la 6ème soumission", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("192.168.1.2");
    }
    const result = checkRateLimit("192.168.1.2");
    expect(result.blocked).toBe(true);
  });

  it("ne bloque pas une IP différente", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("192.168.1.3");
    }
    const result = checkRateLimit("10.0.0.1");
    expect(result.blocked).toBe(false);
  });

  it("nettoie les entrées expirées (> 1 heure)", () => {
    // Simuler des entrées anciennes
    const oldTimestamp = Date.now() - 3700000; // > 1 heure
    rateLimitMap.set("192.168.1.4", [oldTimestamp, oldTimestamp, oldTimestamp, oldTimestamp, oldTimestamp]);

    // La prochaine soumission devrait passer car les anciennes sont nettoyées
    const result = checkRateLimit("192.168.1.4");
    expect(result.blocked).toBe(false);
    expect(result.count).toBe(1);
  });
});

// ─── 3. Tests Délai Minimum ─────────────────────────────────────────────────

describe("Anti-spam — Délai minimum", () => {
  it("détecte une soumission trop rapide (< 5 secondes)", () => {
    const justNow = Date.now() - 1000; // 1 seconde
    expect(checkMinDelay(justNow)).toBe(true);
  });

  it("détecte une soumission instantanée", () => {
    const instant = Date.now(); // 0 seconde
    expect(checkMinDelay(instant)).toBe(true);
  });

  it("laisse passer une soumission après 5 secondes", () => {
    const fiveSecondsAgo = Date.now() - 6000; // 6 secondes
    expect(checkMinDelay(fiveSecondsAgo)).toBe(false);
  });

  it("laisse passer une soumission après 30 secondes", () => {
    const thirtySecondsAgo = Date.now() - 30000;
    expect(checkMinDelay(thirtySecondsAgo)).toBe(false);
  });

  it("laisse passer si pas de timestamp fourni", () => {
    expect(checkMinDelay(undefined)).toBe(false);
  });
});

// ─── Tests d'intégration : combinaison des 3 protections ───────────────────

describe("Anti-spam — Combinaison des 3 protections", () => {
  beforeEach(() => {
    rateLimitMap.clear();
  });

  it("un humain normal passe les 3 vérifications", () => {
    const hp = "";
    const ts = Date.now() - 60000; // 1 minute
    const ip = "203.0.113.1";

    expect(checkHoneypot(hp)).toBe(false);
    expect(checkMinDelay(ts)).toBe(false);
    expect(checkRateLimit(ip).blocked).toBe(false);
  });

  it("un bot qui remplit le honeypot est bloqué", () => {
    const hp = "buy cheap stuff";
    expect(checkHoneypot(hp)).toBe(true);
    // Pas besoin de vérifier les autres
  });

  it("un bot rapide est bloqué par le délai minimum", () => {
    const hp = "";
    const ts = Date.now() - 500; // 0.5 seconde
    expect(checkHoneypot(hp)).toBe(false);
    expect(checkMinDelay(ts)).toBe(true);
  });

  it("un spammeur répétitif est bloqué par le rate limit", () => {
    const hp = "";
    const ts = Date.now() - 60000;
    const ip = "198.51.100.1";

    for (let i = 0; i < 5; i++) {
      expect(checkHoneypot(hp)).toBe(false);
      expect(checkMinDelay(ts)).toBe(false);
      expect(checkRateLimit(ip).blocked).toBe(false);
    }
    // 6ème tentative
    expect(checkRateLimit(ip).blocked).toBe(true);
  });
});
