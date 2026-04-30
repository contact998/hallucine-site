import type { Express, Request, Response } from "express";
import crypto from "node:crypto";
import { parse as parseCookieHeader } from "cookie";
import * as db from "./db";
import { sdk } from "./_core/sdk";
import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ENV } from "./_core/env";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const STATE_COOKIE = "google_oauth_state";
const STATE_MAX_AGE_MS = 10 * 60 * 1000; // 10 min

export function registerGoogleAuthRoutes(app: Express) {
  /**
   * GET /api/auth/google
   * Redirige vers Google avec un state sécurisé (CSRF protection)
   */
  app.get("/api/auth/google", (req: Request, res: Response) => {
    if (!ENV.googleClientId || !ENV.googleCallbackUrl) {
      res.status(500).json({ error: "Google OAuth non configuré (variables manquantes)" });
      return;
    }

    const state = crypto.randomBytes(16).toString("hex");

    // Stocker le state en cookie httpOnly
    res.cookie(STATE_COOKIE, state, {
      httpOnly: true,
      secure: ENV.isProduction,
      sameSite: "lax",
      maxAge: STATE_MAX_AGE_MS,
      path: "/",
    });

    const params = new URLSearchParams({
      client_id: ENV.googleClientId,
      redirect_uri: ENV.googleCallbackUrl,
      response_type: "code",
      scope: "openid email profile",
      state,
      access_type: "online",
    });

    res.redirect(302, `${GOOGLE_AUTH_URL}?${params.toString()}`);
  });

  /**
   * GET /api/auth/google/callback
   * Callback Google — vérifie state, échange le code, crée la session
   */
  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
    const code = typeof req.query.code === "string" ? req.query.code : null;
    const stateParam = typeof req.query.state === "string" ? req.query.state : null;
    const error = typeof req.query.error === "string" ? req.query.error : null;

    // Refus explicite par l'utilisateur
    if (error) {
      res.redirect(302, "/login?error=cancelled");
      return;
    }

    if (!code || !stateParam) {
      res.status(400).json({ error: "code et state requis" });
      return;
    }

    // Vérifier le state contre le cookie (protection CSRF)
    const rawCookies = parseCookieHeader(req.headers.cookie ?? "");
    const storedState = rawCookies[STATE_COOKIE];

    res.clearCookie(STATE_COOKIE, {
      httpOnly: true,
      secure: ENV.isProduction,
      sameSite: "lax",
      path: "/",
    });

    if (!storedState || storedState !== stateParam) {
      res.status(403).json({ error: "State OAuth invalide (possible CSRF)" });
      return;
    }

    try {
      // Échanger le code contre un access token
      const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: ENV.googleClientId,
          client_secret: ENV.googleClientSecret,
          redirect_uri: ENV.googleCallbackUrl,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.text();
        console.error("[GoogleAuth] Token exchange failed:", err);
        res.redirect(302, "/login?error=token");
        return;
      }

      const tokenData = await tokenRes.json() as { access_token: string };

      // Récupérer les infos utilisateur
      const userInfoRes = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userInfoRes.ok) {
        console.error("[GoogleAuth] UserInfo fetch failed");
        res.redirect(302, "/login?error=userinfo");
        return;
      }

      const userInfo = await userInfoRes.json() as {
        sub: string;
        email: string;
        name: string;
        picture?: string;
      };

      if (!userInfo.email || !userInfo.sub) {
        res.redirect(302, "/login?error=no_email");
        return;
      }

      // Vérifier que l'email est autorisé (ADMIN_EMAIL)
      if (ENV.adminEmail && userInfo.email.toLowerCase() !== ENV.adminEmail.toLowerCase()) {
        console.warn(`[GoogleAuth] Accès refusé pour ${userInfo.email}`);
        res.redirect(302, "/login?error=unauthorized");
        return;
      }

      // Upsert en base avec rôle admin
      const openId = `google_${userInfo.sub}`;
      await db.upsertUser({
        openId,
        name: userInfo.name || null,
        email: userInfo.email,
        loginMethod: "google",
        role: "admin",
        lastSignedIn: new Date(),
      });

      // Créer la session JWT
      const sessionToken = await sdk.createSessionToken(openId, {
        name: userInfo.name || userInfo.email,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/admin");
    } catch (err) {
      console.error("[GoogleAuth] Callback error:", err);
      res.redirect(302, "/login?error=server");
    }
  });
}
