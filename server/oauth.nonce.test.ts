/**
 * Tests d'intégration pour le flux OAuth nonce (server/_core/oauth.ts)
 *
 * Vérifie :
 * 1. /api/oauth/initiate génère un state valide et pose un cookie nonce httpOnly
 * 2. /api/oauth/callback avec nonce valide → échange du code (mocké) → 302
 * 3. /api/oauth/callback avec nonce invalide → 403
 * 4. /api/oauth/callback sans cookie nonce → 403
 * 5. /api/oauth/callback sans code ni state → 400
 * 6. /api/oauth/callback avec state malformé → 400
 * 7. /api/oauth/callback avec redirectUri hors allowlist → 403
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import supertest from "supertest";
import { parse as parseCookieHeader } from "cookie";

// ─── Mocks (hoistés avant tout import statique par vitest) ────────────────────
vi.mock("./_core/sdk", () => ({
  sdk: {
    exchangeCodeForToken: vi.fn().mockResolvedValue({ accessToken: "mock-access-token" }),
    getUserInfo: vi.fn().mockResolvedValue({
      openId: "mock-open-id",
      name: "Mock User",
      email: "mock@example.com",
      loginMethod: "manus",
      platform: "manus",
    }),
    createSessionToken: vi.fn().mockResolvedValue("mock-session-token"),
  },
}));

vi.mock("./db", () => ({
  upsertUser: vi.fn().mockResolvedValue(undefined),
}));

// ─── Import STATIQUE après les mocks (vitest hoist les vi.mock) ───────────────
import { registerOAuthRoutes } from "./_core/oauth";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Crée une app Express minimale avec les routes OAuth. */
function createTestApp() {
  const app = express();
  app.use(express.json());
  registerOAuthRoutes(app);
  return app;
}

/**
 * Extrait la valeur d'un cookie depuis les headers Set-Cookie.
 */
function extractCookieValue(setCookieHeader: string[] | string | undefined, name: string): string | null {
  if (!setCookieHeader) return null;
  const headers = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  for (const header of headers) {
    const firstPart = header.split(";")[0];
    const parsed = parseCookieHeader(firstPart);
    if (name in parsed) return parsed[name];
  }
  return null;
}

/**
 * Extrait les attributs d'un cookie Set-Cookie header.
 */
function parseCookieAttributes(setCookieHeader: string[] | string | undefined, name: string): Record<string, string | boolean> | null {
  if (!setCookieHeader) return null;
  const headers = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  for (const header of headers) {
    const parts = header.split(";").map(p => p.trim());
    const [nameValue, ...attrs] = parts;
    const parsed = parseCookieHeader(nameValue);
    if (!(name in parsed)) continue;
    const result: Record<string, string | boolean> = { value: parsed[name] };
    for (const attr of attrs) {
      const eqIdx = attr.indexOf("=");
      const k = eqIdx >= 0 ? attr.slice(0, eqIdx).toLowerCase() : attr.toLowerCase();
      const v = eqIdx >= 0 ? attr.slice(eqIdx + 1) : true;
      result[k] = v;
    }
    return result;
  }
  return null;
}

/**
 * Appelle /api/oauth/initiate et retourne { state, nonce, setCookieHeader }.
 */
async function initiateOAuth(app: ReturnType<typeof express>, returnPath = "/") {
  const res = await supertest(app).get(`/api/oauth/initiate?returnPath=${encodeURIComponent(returnPath)}`);
  const setCookieHeader = res.headers["set-cookie"];
  const nonce = extractCookieValue(setCookieHeader, "oauth_nonce");
  const { state } = res.body as { state: string };
  return { res, state, nonce, setCookieHeader };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("OAuth nonce — /api/oauth/initiate", () => {
  let app: ReturnType<typeof express>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createTestApp();
  });

  it("Test 1 : initiate génère un state valide et un cookie nonce httpOnly", async () => {
    const { res, state, nonce, setCookieHeader } = await initiateOAuth(app, "/");

    expect(res.status).toBe(200);
    expect(typeof state).toBe("string");
    expect(state.length).toBeGreaterThan(10);

    // Vérifier que le nonce est présent dans le cookie
    expect(nonce).not.toBeNull();
    expect(typeof nonce).toBe("string");
    expect(nonce!.length).toBeGreaterThan(0);

    // Vérifier les attributs du cookie nonce
    const attrs = parseCookieAttributes(setCookieHeader, "oauth_nonce");
    expect(attrs).not.toBeNull();
    expect(attrs!["httponly"]).toBe(true);
    expect(attrs!["samesite"]).toBe("Lax");

    // Vérifier que le state contient le nonce et la redirectUri
    const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
    expect(decoded.nonce).toBe(nonce);
    expect(decoded.redirectUri).toBe("/");
  });

  it("Test 1b : initiate avec returnPath invalide → redirectUri = '/'", async () => {
    const { res, state } = await initiateOAuth(app, "https://evil.com/steal");

    expect(res.status).toBe(200);
    const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
    expect(decoded.redirectUri).toBe("/");
  });

  it("Test 1c : deux appels initiate génèrent des nonces différents", async () => {
    const { nonce: nonce1 } = await initiateOAuth(app);
    const { nonce: nonce2 } = await initiateOAuth(app);
    expect(nonce1).not.toBe(nonce2);
  });
});

describe("OAuth nonce — /api/oauth/callback", () => {
  let app: ReturnType<typeof express>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createTestApp();
  });

  it("Test 2 : callback avec nonce valide → 302 redirect vers '/'", async () => {
    // Étape 1 : obtenir un state + nonce via initiate
    const { state, nonce } = await initiateOAuth(app, "/");
    expect(nonce).not.toBeNull();

    // Étape 2 : appeler le callback avec le nonce dans le cookie
    const res = await supertest(app)
      .get(`/api/oauth/callback?code=mock-code&state=${encodeURIComponent(state)}`)
      .set("Cookie", `oauth_nonce=${nonce}`);

    expect(res.status).toBe(302);
    expect(res.headers["location"]).toBe("/");
  });

  it("Test 3 : callback avec nonce invalide → 403", async () => {
    const { state } = await initiateOAuth(app, "/");

    const res = await supertest(app)
      .get(`/api/oauth/callback?code=mock-code&state=${encodeURIComponent(state)}`)
      .set("Cookie", "oauth_nonce=invalid-nonce-value");

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/nonce mismatch/i);
  });

  it("Test 4 : callback sans cookie nonce → 403", async () => {
    const { state } = await initiateOAuth(app, "/");

    // Pas de cookie du tout
    const res = await supertest(app)
      .get(`/api/oauth/callback?code=mock-code&state=${encodeURIComponent(state)}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/nonce mismatch/i);
  });

  it("Test 5 : callback sans code ni state → 400", async () => {
    const res = await supertest(app).get("/api/oauth/callback");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/code and state/i);
  });

  it("Test 6 : callback avec state malformé → 400", async () => {
    const res = await supertest(app)
      .get("/api/oauth/callback?code=mock-code&state=not-valid-base64url!!!")
      .set("Cookie", "oauth_nonce=some-nonce");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid OAuth state format/i);
  });

  it("Test 7 : callback avec redirectUri hors allowlist → 403", async () => {
    // Construire manuellement un state avec une redirectUri invalide
    const nonce = "test-nonce-12345";
    const payload = JSON.stringify({ nonce, redirectUri: "https://evil.com/steal" });
    const state = Buffer.from(payload).toString("base64url");

    const res = await supertest(app)
      .get(`/api/oauth/callback?code=mock-code&state=${encodeURIComponent(state)}`)
      .set("Cookie", `oauth_nonce=${nonce}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/Invalid redirect URI/i);
  });
});
