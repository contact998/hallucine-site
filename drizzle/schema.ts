import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** Fuseau horaire de l'utilisateur (ex: "Europe/Paris"). Null = détection automatique via navigateur */
  timezone: varchar("timezone", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Table pour stocker les soumissions de formulaires de contact et demandes de devis
export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["contact", "devis", "distributeur"]).notNull(),
  nom: varchar("nom", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  telephone: varchar("telephone", { length: 50 }),
  entreprise: varchar("entreprise", { length: 255 }),
  sujet: varchar("sujet", { length: 500 }),
  message: text("message"),
  produit: varchar("produit", { length: 255 }),
  objectif: varchar("objectif", { length: 50 }),
  /** ID de l'utilisateur connecté (null si soumission anonyme) */
  userId: int("userId"),
  /** Statut de la demande */
  status: mysqlEnum("status", ["en_attente", "en_cours", "traite", "annule"]).default("en_attente").notNull(),
  /** Note admin interne */
  adminNote: text("adminNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

// Table pour le tracking analytics des visites de pages
export const pageViews = mysqlTable("page_views", {
  id: int("id").autoincrement().primaryKey(),
  /** Chemin de la page visitée (ex: /ecran-gonflable-geant-soufflerie) */
  path: varchar("path", { length: 500 }).notNull(),
  /** Titre de la page */
  pageTitle: varchar("pageTitle", { length: 500 }),
  /** Referrer (source de trafic) */
  referrer: varchar("referrer", { length: 1000 }),
  /** Source de trafic catégorisée (direct, organic, social, referral, email, paid) */
  trafficSource: varchar("trafficSource", { length: 50 }),
  /** User agent du navigateur */
  userAgent: varchar("userAgent", { length: 1000 }),
  /** Type d'appareil détecté (desktop, mobile, tablet) */
  deviceType: varchar("deviceType", { length: 20 }),
  /** Pays (détecté via headers ou IP) */
  country: varchar("country", { length: 100 }),
  /** Identifiant de session anonyme (hash) */
  sessionId: varchar("sessionId", { length: 64 }),
  /** ID utilisateur si connecté */
  userId: int("userId"),
  /** Durée de la visite en secondes */
  duration: int("duration"),
  /** Paramètres UTM */
  utmSource: varchar("utmSource", { length: 255 }),
  utmMedium: varchar("utmMedium", { length: 255 }),
  utmCampaign: varchar("utmCampaign", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;

// Table pour le tracking des événements (clics CTA, téléchargements, chatbot, etc.)
export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  /** Type d'événement (cta_click, brochure_download, chatbot_open, form_submit, whatsapp_click) */
  eventType: varchar("eventType", { length: 100 }).notNull(),
  /** Détails de l'événement (ex: nom du produit, bouton cliqué) */
  eventData: text("eventData"),
  /** Page où l'événement s'est produit */
  path: varchar("path", { length: 500 }),
  /** Identifiant de session anonyme */
  sessionId: varchar("sessionId", { length: 64 }),
  /** ID utilisateur si connecté */
  userId: int("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;

// Table de paramètres du site (fuseau horaire, heures de présence, etc.)
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  /** Clé du paramètre */
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  /** Valeur du paramètre (JSON ou texte) */
  settingValue: text("settingValue").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

// Table pour l'historique des audits IA hebdomadaires
export const auditHistory = mysqlTable("audit_history", {
  id: int("id").autoincrement().primaryKey(),
  /** Période couverte par l'audit (ex: "08/02/2026 — 15/02/2026") */
  period: varchar("period", { length: 100 }).notNull(),
  /** Fuseau horaire utilisé */
  timezone: varchar("timezone", { length: 100 }).notNull(),
  /** Résumé des performances */
  performanceSummary: text("performanceSummary").notNull(),
  /** Analyse du workflow */
  workflowAnalysis: text("workflowAnalysis").notNull(),
  /** Analyse de conversion */
  conversionAnalysis: text("conversionAnalysis").notNull(),
  /** Recommandations techniques */
  codeRecommendations: text("codeRecommendations").notNull(),
  /** Actions prioritaires */
  prioritizedActions: text("prioritizedActions").notNull(),
  /** Métriques brutes en JSON */
  rawMetrics: text("rawMetrics").notNull(),
  /** KPIs clés pour comparaison rapide */
  totalPageViews: int("totalPageViews").default(0).notNull(),
  uniqueVisitors: int("uniqueVisitors").default(0).notNull(),
  totalEvents: int("totalEvents").default(0).notNull(),
  avgDuration: int("avgDuration").default(0).notNull(),
  totalSubmissions: int("totalSubmissions").default(0).notNull(),
  weeklySubmissions: int("weeklySubmissions").default(0).notNull(),
  /** Sujet et body de l'email envoyé */
  emailSubject: varchar("emailSubject", { length: 500 }),
  emailBody: text("emailBody"),
  /** Statut de l'envoi email */
  emailSent: mysqlEnum("emailSent", ["pending", "sent", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditHistoryEntry = typeof auditHistory.$inferSelect;
export type InsertAuditHistoryEntry = typeof auditHistory.$inferInsert;

// Table pour les articles de blog créés par OpenClaw
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  /** Titre de l'article */
  title: varchar("title", { length: 500 }).notNull(),
  /** Slug URL (ex: mon-article-de-blog) */
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  /** Résumé court pour les listes et SEO */
  excerpt: text("excerpt"),
  /** Contenu complet en HTML ou Markdown */
  content: text("content").notNull(),
  /** URL de l'image principale */
  imageUrl: varchar("imageUrl", { length: 1000 }),
  /** Langue de l'article (fr, en, de, es, it) */
  lang: varchar("lang", { length: 10 }).notNull().default("fr"),
  /** ID de l'article parent si c'est une traduction */
  parentId: int("parentId"),
  /** Statut : brouillon, publié, programmé */
  status: mysqlEnum("status", ["draft", "published", "scheduled"]).default("draft").notNull(),
  /** Date de publication prévue */
  publishedAt: timestamp("publishedAt"),
  /** Mots-clés SEO */
  metaKeywords: varchar("metaKeywords", { length: 500 }),
  /** Description SEO */
  metaDescription: varchar("metaDescription", { length: 500 }),
  /** Auteur (par défaut: OpenClaw) */
  author: varchar("author", { length: 100 }).default("OpenClaw"),
  /** Catégorie */
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// ─── Médiathèque centrale ─────────────────────────────────────────────────────
export const mediaLibrary = mysqlTable("media_library", {
  id:          int("id").autoincrement().primaryKey(),
  // ─── Fichier ─────────────────────────────────────────────────────────────
  /** URL publique R2 — clé unique, jamais modifiée après upload */
  url:         varchar("url", { length: 512 }).notNull().unique(),
  /** Nom de fichier original (ex: "ecran-geant-paris.webp") */
  filename:    varchar("filename", { length: 500 }).notNull(),
  /** Taille en octets */
  filesize:    int("filesize"),
  /** Dimensions en pixels */
  width:       int("width"),
  height:      int("height"),
  /** MIME type (image/webp, image/jpeg, image/png) */
  mimeType:    varchar("mimeType", { length: 50 }),
  // ─── Métadonnées éditoriales ──────────────────────────────────────────────
  /** Texte alternatif pour l'accessibilité et le SEO */
  alt:         varchar("alt", { length: 500 }),
  /** Nom lisible affiché dans l'admin */
  title:       varchar("title", { length: 500 }),
  /** Tags JSON array — ex: '["cinema","exterieur","nuit"]' */
  tags:        varchar("tags", { length: 1000 }),
  // ─── Catégorie ────────────────────────────────────────────────────────────
  category:    mysqlEnum("category", [
                 "blog",         // images articles blog
                 "realisations", // galerie réalisations
                 "galerie",      // page galerie publique
                 "produits",     // pages produits (écrans, tentes...)
                 "ui",           // logos, icônes, images d'interface
                 "og",           // Open Graph / réseaux sociaux
                 "autre",        // tout le reste
               ]).notNull().default("autre"),
  /** Sous-catégorie libre — ex: "ecran-geant", "tente-x", "events" */
  subcategory: varchar("subcategory", { length: 100 }),
  // ─── Tri et visibilité ────────────────────────────────────────────────────
  /** Ordre d'affichage dans les galeries (plus petit = premier) */
  sortOrder:   int("sortOrder").default(0).notNull(),
  /** false = masqué dans le site mais conservé en DB et sur R2 */
  active:      boolean("active").default(true).notNull(),
  // ─── Traçabilité ──────────────────────────────────────────────────────────
  source:      mysqlEnum("source", [
                 "upload_web",  // uploadé via l'interface admin
                 "upload_cli",  // uploadé via le script CLI local
                 "migration",   // importé depuis le code (Phase 2)
                 "external",    // URL externe, non hébergée sur R2
               ]).notNull().default("upload_web"),
  /** ID admin qui a uploadé — null si migration ou CLI sans auth */
  uploadedBy:  int("uploadedBy"),
  /** Nombre de fois que cette image est référencée en DB */
  usageCount:  int("usageCount").default(0).notNull(),
  createdAt:   timestamp("createdAt").defaultNow().notNull(),
  updatedAt:   timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MediaItem = typeof mediaLibrary.$inferSelect;
export type InsertMediaItem = typeof mediaLibrary.$inferInsert;
export type MediaCategory = "blog" | "realisations" | "galerie" | "produits" | "ui" | "og" | "autre";
export type MediaSource = "upload_web" | "upload_cli" | "migration" | "external";
