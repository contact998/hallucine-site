import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
