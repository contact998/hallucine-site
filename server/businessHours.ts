/**
 * Service Heures de Présence — Gestion du fuseau horaire et des heures de disponibilité
 * Configurable par l'admin (quand il voyage, il peut changer son fuseau horaire)
 * Le frontend convertit automatiquement au fuseau du visiteur
 */

import { eq } from "drizzle-orm";
import { db } from "./db";
import { siteSettings } from "../drizzle/schema";

export interface BusinessHoursConfig {
  timezone: string;       // ex: "Asia/Shanghai"
  startTime: string;      // ex: "08:00"
  endTime: string;        // ex: "18:00"
  workDays: number[];     // ex: [1,2,3,4,5] (lundi=1 à dimanche=7)
}

const DEFAULT_CONFIG: BusinessHoursConfig = {
  timezone: "Asia/Shanghai",
  startTime: "08:00",
  endTime: "18:00",
  workDays: [1, 2, 3, 4, 5],
};

/** Récupérer la configuration des heures de présence depuis la DB */
export async function getBusinessHoursConfig(): Promise<BusinessHoursConfig> {
  

  try {
    const rows = await db.select().from(siteSettings);
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.settingKey] = row.settingValue;
    }

    return {
      timezone: settings.business_timezone ? JSON.parse(settings.business_timezone) : DEFAULT_CONFIG.timezone,
      startTime: settings.business_hours_start ? JSON.parse(settings.business_hours_start) : DEFAULT_CONFIG.startTime,
      endTime: settings.business_hours_end ? JSON.parse(settings.business_hours_end) : DEFAULT_CONFIG.endTime,
      workDays: settings.business_days ? JSON.parse(settings.business_days) : DEFAULT_CONFIG.workDays,
    };
  } catch (err) {
    console.error("[BusinessHours] Erreur lecture config:", err);
    return DEFAULT_CONFIG;
  }
}

/** Mettre à jour un paramètre des heures de présence */
export async function updateBusinessHoursSetting(key: string, value: string): Promise<boolean> {
  

  try {
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, key)).limit(1);
    if (existing.length > 0) {
      await db.update(siteSettings).set({ settingValue: value }).where(eq(siteSettings.settingKey, key));
    } else {
      await db.insert(siteSettings).values({ settingKey: key, settingValue: value });
    }
    return true;
  } catch (err) {
    console.error("[BusinessHours] Erreur mise à jour:", err);
    return false;
  }
}

/** Vérifier si on est actuellement dans les heures de présence */
export function isCurrentlyAvailable(config: BusinessHoursConfig): boolean {
  try {
    const now = new Date();
    // Obtenir l'heure actuelle dans le fuseau horaire configuré
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: config.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      weekday: "short",
    });

    const parts = formatter.formatToParts(now);
    const hour = parseInt(parts.find(p => p.type === "hour")?.value ?? "0");
    const minute = parseInt(parts.find(p => p.type === "minute")?.value ?? "0");
    const weekday = parts.find(p => p.type === "weekday")?.value ?? "";

    // Convertir le jour de la semaine en nombre (1=lundi à 7=dimanche)
    const dayMap: Record<string, number> = {
      Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7,
    };
    const dayNum = dayMap[weekday] ?? 0;

    // Vérifier si c'est un jour de travail
    if (!config.workDays.includes(dayNum)) return false;

    // Vérifier les heures
    const [startH, startM] = config.startTime.split(":").map(Number);
    const [endH, endM] = config.endTime.split(":").map(Number);

    const currentMinutes = hour * 60 + minute;
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } catch {
    return false;
  }
}

/** Liste des fuseaux horaires courants pour le sélecteur admin */
export const COMMON_TIMEZONES = [
  { value: "Asia/Shanghai", label: "Chine (UTC+8)", city: "Pékin/Shanghai" },
  { value: "Europe/Paris", label: "France (UTC+1/+2)", city: "Paris" },
  { value: "Europe/London", label: "Royaume-Uni (UTC+0/+1)", city: "Londres" },
  { value: "America/New_York", label: "Est USA (UTC-5/-4)", city: "New York" },
  { value: "America/Los_Angeles", label: "Ouest USA (UTC-8/-7)", city: "Los Angeles" },
  { value: "Asia/Tokyo", label: "Japon (UTC+9)", city: "Tokyo" },
  { value: "Asia/Dubai", label: "Émirats (UTC+4)", city: "Dubaï" },
  { value: "Asia/Singapore", label: "Singapour (UTC+8)", city: "Singapour" },
  { value: "Asia/Bangkok", label: "Thaïlande (UTC+7)", city: "Bangkok" },
  { value: "Asia/Kolkata", label: "Inde (UTC+5:30)", city: "Mumbai" },
  { value: "Europe/Berlin", label: "Allemagne (UTC+1/+2)", city: "Berlin" },
  { value: "Europe/Rome", label: "Italie (UTC+1/+2)", city: "Rome" },
  { value: "Europe/Madrid", label: "Espagne (UTC+1/+2)", city: "Madrid" },
  { value: "Australia/Sydney", label: "Australie (UTC+10/+11)", city: "Sydney" },
  { value: "Africa/Casablanca", label: "Maroc (UTC+0/+1)", city: "Casablanca" },
  { value: "Pacific/Noumea", label: "Nouvelle-Calédonie (UTC+11)", city: "Nouméa" },
];
