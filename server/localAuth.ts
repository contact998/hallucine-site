import type { Express, Request, Response } from "express";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { nanoid } from "nanoid";
import { db } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { sdk } from "./_core/sdk";
import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

function resetRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

// ─── Hashage mot de passe ────────────────────────────────────────────────────
// Format actuel : "scrypt$N$r$p$base64(salt)$base64(hash)"
// Format legacy : 64 caractères hex (sha256 + pepper partagé) — accepté en
// lecture, rehashé automatiquement à la connexion.
// Le pepper PASSWORD_PEPPER est distinct de JWT_SECRET pour qu'une rotation
// JWT n'invalide pas les comptes.
//
// Paramètres OWASP scrypt recommandés (2024) : N=2^15, r=8, p=1 ≈ 64Mo RAM.
const SCRYPT_N = 1 << 15;
const SCRYPT_r = 8;
const SCRYPT_p = 1;
const SCRYPT_KEYLEN = 64;

function getPepper(): string {
  // Préférer PASSWORD_PEPPER ; fallback sur JWT_SECRET pour ne pas casser les
  // installations existantes (warning à logger en production).
  const pepper = process.env.PASSWORD_PEPPER ?? process.env.JWT_SECRET ?? "";
  if (!pepper) {
    console.warn("[LocalAuth] PASSWORD_PEPPER non défini — sécurité dégradée.");
  }
  return pepper;
}

function hashPasswordScrypt(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password + getPepper(), salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N, r: SCRYPT_r, p: SCRYPT_p, maxmem: 128 * 1024 * 1024,
  });
  return `scrypt$${SCRYPT_N}$${SCRYPT_r}$${SCRYPT_p}$${salt.toString("base64")}$${derived.toString("base64")}`;
}

function verifyScrypt(password: string, hash: string): boolean {
  const parts = hash.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const N = parseInt(parts[1], 10);
  const r = parseInt(parts[2], 10);
  const p = parseInt(parts[3], 10);
  const salt = Buffer.from(parts[4], "base64");
  const expected = Buffer.from(parts[5], "base64");
  try {
    const derived = scryptSync(password + getPepper(), salt, expected.length, {
      N, r, p, maxmem: 128 * 1024 * 1024,
    });
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

function verifyLegacySha256(password: string, hash: string): boolean {
  // Legacy : sha256(password + JWT_SECRET) en hex, 64 caractères, pas de "$".
  if (hash.length !== 64 || hash.includes("$")) return false;
  const computed = createHash("sha256")
    .update(password + (process.env.JWT_SECRET ?? ""))
    .digest("hex");
  try {
    return timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  } catch {
    return false;
  }
}

function verifyPassword(password: string, hash: string): boolean {
  if (hash.startsWith("scrypt$")) return verifyScrypt(password, hash);
  return verifyLegacySha256(password, hash);
}

function isLegacyHash(hash: string): boolean {
  return !hash.startsWith("scrypt$");
}

export function registerLocalAuthRoutes(app: Express) {

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const ip = (req.ip ?? req.headers["x-forwarded-for"] as string ?? "unknown");
    if (!checkRateLimit(ip)) {
      res.status(429).json({ error: "Trop de tentatives. Reessayez dans 15 minutes." });
      return;
    }
    const { email, password } = req.body ?? {};
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "Email et mot de passe requis." });
      return;
    }
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
      if (!user || user.role !== "admin") {
        await new Promise(r => setTimeout(r, 200));
        res.status(401).json({ error: "Email ou mot de passe incorrect." });
        return;
      }
      const passwordHash = user.loginMethod;
      if (!passwordHash || !verifyPassword(password, passwordHash)) {
        await new Promise(r => setTimeout(r, 200));
        res.status(401).json({ error: "Email ou mot de passe incorrect." });
        return;
      }
      // Migration progressive : si l'utilisateur a encore un hash sha256 legacy,
      // on profite de la connexion (où le cleartext est disponible) pour le
      // rehasher en scrypt. Best-effort, n'empêche pas la connexion en cas d'échec.
      if (isLegacyHash(passwordHash)) {
        try {
          await db
            .update(users)
            .set({ loginMethod: hashPasswordScrypt(password) })
            .where(eq(users.email, email.toLowerCase().trim()));
        } catch (err) {
          console.error("[LocalAuth] Rehash legacy → scrypt échoué :", err);
        }
      }
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name ?? email,
        expiresInMs: ONE_YEAR_MS,
      });
      resetRateLimit(ip);
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, redirect: "/admin" });
    } catch (err) {
      console.error("[LocalAuth] Login error:", err);
      res.status(500).json({ error: "Erreur serveur." });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });

  app.post("/api/auth/setup", async (req: Request, res: Response) => {
    const { email, password, setupKey } = req.body ?? {};
    const expectedKey = process.env.SETUP_SECRET_KEY;
    if (!expectedKey || setupKey !== expectedKey) {
      res.status(403).json({ error: "Cle de setup invalide." });
      return;
    }
    if (!email || !password) {
      res.status(400).json({ error: "Email et mot de passe requis." });
      return;
    }
    try {
      const [existing] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
      const passwordHash = hashPasswordScrypt(password);
      if (existing) {
        await db.update(users).set({ role: "admin", loginMethod: passwordHash, lastSignedIn: new Date() }).where(eq(users.email, email.toLowerCase().trim()));
        res.json({ success: true, action: "updated", email });
      } else {
        await db.insert(users).values({
          openId: "local_" + nanoid(),
          email: email.toLowerCase().trim(),
          name: "Admin",
          role: "admin",
          loginMethod: passwordHash,
          lastSignedIn: new Date(),
        });
        res.json({ success: true, action: "created", email });
      }
    } catch (err) {
      console.error("[LocalAuth] Setup error:", err);
      res.status(500).json({ error: "Erreur serveur." });
    }
  });
}
// mar. 28 avr. 2026 22:05:47 CST
