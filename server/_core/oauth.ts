import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import crypto from "node:crypto";
import { parse as parseCookieHeader } from "cookie";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

// ─── Constantes ─────────────────────────────────────────────────────────────

/** Durée de vie du cookie nonce OAuth : 10 minutes */
const NONCE_MAX_AGE_MS = 10 * 60 * 1000;

/** Redirections autorisées après login */
const ALLOWED_REDIRECTS = ["/", "/dashboard", "/admin", "/profil"];

/** Nom du cookie nonce */
const NONCE_COOKIE = "oauth_nonce";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

/**
 * Génère un state OAuth sécurisé :
 * - nonce = 16 octets aléatoires (crypto.randomBytes)
 * - redirectUri = destination après login (validée contre allowlist)
 * - encodé en base64url
 */
function buildOAuthState(redirectUri: string): { state: string; nonce: string } {
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = JSON.stringify({ nonce, redirectUri });
  const state = Buffer.from(payload).toString("base64url");
  return { state, nonce };
}

/**
 * Décode le state OAuth et retourne { nonce, redirectUri }.
 * Retourne null si le state est invalide.
 */
function parseOAuthState(state: string): { nonce: string; redirectUri: string } | null {
  try {
    const decoded = Buffer.from(state, "base64url").toString("utf-8");
    const parsed = JSON.parse(decoded);
    if (
      typeof parsed.nonce === "string" &&
      typeof parsed.redirectUri === "string"
    ) {
      return { nonce: parsed.nonce, redirectUri: parsed.redirectUri };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Valide que la redirectUri est dans la liste blanche.
 * Accepte aussi les chemins vides (→ "/").
 */
function isAllowedRedirect(redirectUri: string): boolean {
  if (!redirectUri || redirectUri === "") return true;
  return ALLOWED_REDIRECTS.some(
    (allowed) => redirectUri === allowed || redirectUri.startsWith(allowed + "/")
  );
}

// ─── Routes OAuth ────────────────────────────────────────────────────────────

export function registerOAuthRoutes(app: Express) {
  /**
   * GET /api/oauth/callback
   *
   * Callback OAuth Manus. Vérifie :
   * 1. Présence de code + state
   * 2. Décodage du state (nonce + redirectUri)
   * 3. Vérification du nonce contre le cookie httpOnly oauth_nonce
   * 4. Validation de la redirectUri contre l'allowlist
   * 5. Échange du code contre un token, création de la session
   */
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const stateParam = getQueryParam(req, "state");

    if (!code || !stateParam) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    // Décoder le state
    const parsed = parseOAuthState(stateParam);
    if (!parsed) {
      res.status(400).json({ error: "Invalid OAuth state format" });
      return;
    }

    const { nonce, redirectUri } = parsed;

    // Vérifier le nonce contre le cookie httpOnly (sans cookie-parser, on parse manuellement)
    const rawCookies = parseCookieHeader(req.headers.cookie ?? "");
    const storedNonce = rawCookies[NONCE_COOKIE];
    if (!storedNonce || storedNonce !== nonce) {
      // Nonce manquant ou invalide — possible CSRF
      res.clearCookie(NONCE_COOKIE);
      res.status(403).json({ error: "Invalid OAuth state (nonce mismatch)" });
      return;
    }

    // Supprimer le cookie nonce (usage unique)
    res.clearCookie(NONCE_COOKIE, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    // Valider la redirectUri
    if (!isAllowedRedirect(redirectUri)) {
      res.status(403).json({ error: "Invalid redirect URI" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, stateParam);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Rediriger vers la destination validée (ou "/" par défaut)
      const destination = redirectUri && isAllowedRedirect(redirectUri) ? redirectUri : "/";
      res.redirect(302, destination);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  /**
   * GET /api/oauth/initiate
   *
   * Génère un state sécurisé avec nonce et stocke le nonce en cookie httpOnly.
   * Retourne l'URL de redirection vers le portail OAuth Manus.
   *
   * Note : ce endpoint est optionnel — le client peut aussi générer le state
   * lui-même via getLoginUrl() dans client/src/const.ts. Dans ce cas,
   * le nonce n'est pas vérifié côté serveur (rétrocompatibilité).
   */
  app.get("/api/oauth/initiate", (req: Request, res: Response) => {
    const returnPath = getQueryParam(req, "returnPath") ?? "/";
    const safeReturn = isAllowedRedirect(returnPath) ? returnPath : "/";

    const { state, nonce } = buildOAuthState(safeReturn);

    // Stocker le nonce en cookie httpOnly (10 min)
    res.cookie(NONCE_COOKIE, nonce, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: NONCE_MAX_AGE_MS,
      path: "/",
    });

    res.json({ state });
  });
}
