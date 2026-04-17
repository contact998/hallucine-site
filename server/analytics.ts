/**
 * Service Analytics — Tracking des visites et événements
 * Collecte les page views et événements côté serveur,
 * fournit les agrégations pour le dashboard admin.
 */

import { eq, desc, sql, and, gte, lte, count } from "drizzle-orm";
import { db } from "./db";
import { pageViews, analyticsEvents, InsertPageView, InsertAnalyticsEvent } from "../drizzle/schema";

// ─── Catégorisation du trafic ───────────────────────────────────────

export function categorizeTrafficSource(referrer: string | null | undefined): string {
  if (!referrer || referrer === "" || referrer === "direct") return "direct";

  const ref = referrer.toLowerCase();

  // Moteurs de recherche
  if (ref.includes("google.") || ref.includes("bing.") || ref.includes("yahoo.")
    || ref.includes("duckduckgo.") || ref.includes("baidu.") || ref.includes("ecosia.")) {
    return "organic";
  }

  // Réseaux sociaux
  if (ref.includes("facebook.") || ref.includes("fb.") || ref.includes("instagram.")
    || ref.includes("linkedin.") || ref.includes("twitter.") || ref.includes("x.com")
    || ref.includes("youtube.") || ref.includes("tiktok.") || ref.includes("pinterest.")) {
    return "social";
  }

  // Email
  if (ref.includes("mail") || ref.includes("outlook") || ref.includes("gmail")) {
    return "email";
  }

  // Publicité payante
  if (ref.includes("gclid") || ref.includes("fbclid") || ref.includes("ads.")
    || ref.includes("adwords") || ref.includes("doubleclick")) {
    return "paid";
  }

  return "referral";
}

// ─── Détection du type d'appareil ───────────────────────────────────

export function detectDeviceType(userAgent: string | null | undefined): string {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) return "mobile";
  if (ua.includes("tablet") || ua.includes("ipad")) return "tablet";
  return "desktop";
}

// ─── Insertion de données ───────────────────────────────────────────

export async function trackPageView(data: {
  path: string;
  pageTitle?: string;
  referrer?: string;
  userAgent?: string;
  sessionId?: string;
  userId?: number;
  duration?: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): Promise<boolean> {
  

  try {
    const trafficSource = categorizeTrafficSource(data.referrer);
    const deviceType = detectDeviceType(data.userAgent);

    await db.insert(pageViews).values({
      path: data.path,
      pageTitle: data.pageTitle ?? null,
      referrer: data.referrer ?? null,
      trafficSource,
      userAgent: data.userAgent ?? null,
      deviceType,
      sessionId: data.sessionId ?? null,
      userId: data.userId ?? null,
      duration: data.duration ?? null,
      utmSource: data.utmSource ?? null,
      utmMedium: data.utmMedium ?? null,
      utmCampaign: data.utmCampaign ?? null,
    });
    return true;
  } catch (err) {
    console.error("[Analytics] Erreur tracking page view:", err);
    return false;
  }
}

export async function trackEvent(data: {
  eventType: string;
  eventData?: string;
  path?: string;
  sessionId?: string;
  userId?: number;
}): Promise<boolean> {
  

  try {
    await db.insert(analyticsEvents).values({
      eventType: data.eventType,
      eventData: data.eventData ?? null,
      path: data.path ?? null,
      sessionId: data.sessionId ?? null,
      userId: data.userId ?? null,
    });
    return true;
  } catch (err) {
    console.error("[Analytics] Erreur tracking event:", err);
    return false;
  }
}

// ─── Agrégations pour le dashboard ──────────────────────────────────

/** Statistiques globales sur une période */
export async function getAnalyticsOverview(daysBack: number = 30) {
  

  const since = new Date();
  since.setDate(since.getDate() - daysBack);

  // Total page views
  const [pvTotal] = await db.select({ count: sql<number>`count(*)` })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since));

  // Visiteurs uniques (sessions)
  const [uniqueSessions] = await db.select({ count: sql<number>`count(distinct ${pageViews.sessionId})` })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since));

  // Total événements
  const [evTotal] = await db.select({ count: sql<number>`count(*)` })
    .from(analyticsEvents)
    .where(gte(analyticsEvents.createdAt, since));

  // Durée moyenne de visite
  const [avgDuration] = await db.select({ avg: sql<number>`COALESCE(AVG(${pageViews.duration}), 0)` })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), sql`${pageViews.duration} IS NOT NULL`));

  return {
    totalPageViews: pvTotal?.count ?? 0,
    uniqueVisitors: uniqueSessions?.count ?? 0,
    totalEvents: evTotal?.count ?? 0,
    avgDuration: Math.round(avgDuration?.avg ?? 0),
  };
}

/** Pages les plus visitées */
export async function getTopPages(daysBack: number = 30, limit: number = 20) {
  

  const since = new Date();
  since.setDate(since.getDate() - daysBack);

  return db.select({
    path: pageViews.path,
    pageTitle: pageViews.pageTitle,
    views: sql<number>`count(*)`,
    uniqueVisitors: sql<number>`count(distinct ${pageViews.sessionId})`,
  })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(pageViews.path, pageViews.pageTitle)
    .orderBy(sql`count(*) DESC`)
    .limit(limit);
}

/** Sources de trafic */
export async function getTrafficSources(daysBack: number = 30) {
  

  const since = new Date();
  since.setDate(since.getDate() - daysBack);

  return db.select({
    source: pageViews.trafficSource,
    views: sql<number>`count(*)`,
    uniqueVisitors: sql<number>`count(distinct ${pageViews.sessionId})`,
  })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(pageViews.trafficSource)
    .orderBy(sql`count(*) DESC`);
}

/** Répartition par type d'appareil */
export async function getDeviceBreakdown(daysBack: number = 30) {
  

  const since = new Date();
  since.setDate(since.getDate() - daysBack);

  return db.select({
    device: pageViews.deviceType,
    views: sql<number>`count(*)`,
  })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(pageViews.deviceType)
    .orderBy(sql`count(*) DESC`);
}

/** Visites par jour (pour graphique en courbe) */
export async function getDailyPageViews(daysBack: number = 30) {
  

  const since = new Date();
  since.setDate(since.getDate() - daysBack);

  return db.select({
    date: sql<string>`DATE(${pageViews.createdAt})`,
    views: sql<number>`count(*)`,
    uniqueVisitors: sql<number>`count(distinct ${pageViews.sessionId})`,
  })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(sql`DATE(${pageViews.createdAt})`)
    .orderBy(sql`DATE(${pageViews.createdAt}) ASC`);
}

/** Événements les plus fréquents */
export async function getTopEvents(daysBack: number = 30, limit: number = 20) {
  

  const since = new Date();
  since.setDate(since.getDate() - daysBack);

  return db.select({
    eventType: analyticsEvents.eventType,
    count: sql<number>`count(*)`,
  })
    .from(analyticsEvents)
    .where(gte(analyticsEvents.createdAt, since))
    .groupBy(analyticsEvents.eventType)
    .orderBy(sql`count(*) DESC`)
    .limit(limit);
}

/** Referrers externes les plus fréquents */
export async function getTopReferrers(daysBack: number = 30, limit: number = 15) {
  

  const since = new Date();
  since.setDate(since.getDate() - daysBack);

  return db.select({
    referrer: pageViews.referrer,
    views: sql<number>`count(*)`,
  })
    .from(pageViews)
    .where(and(
      gte(pageViews.createdAt, since),
      sql`${pageViews.referrer} IS NOT NULL AND ${pageViews.referrer} != ''`
    ))
    .groupBy(pageViews.referrer)
    .orderBy(sql`count(*) DESC`)
    .limit(limit);
}
