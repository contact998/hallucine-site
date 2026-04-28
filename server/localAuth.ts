import type { Express, Request, Response } from "express";
import { createHash, timingSafeEqual } from "crypto";
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

function hashPassword(password: string): string {
  return createHash("sha256").update(password + (process.env.JWT_SECRET ?? "")).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  const computed = hashPassword(password);
  try {
    return timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  } catch {
    return false;
  }
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
      const passwordHash = hashPassword(password);
      if (existing) {
        await db.update(users).set({ role: "admin", loginMethod: passwordHash, lastSignedIn: new Date() }).where(eq(users.email, email.toLowerCase().trim()));
        res.json({ success: true, action: "updated", email });
      } else {
        await db.insert(users).values({
          openId: "local_" + Date.now(),
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
