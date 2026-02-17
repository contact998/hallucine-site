/**
 * Service Indicateur de Disponibilité IA
 * 
 * Croise les fuseaux horaires de DC (Daniel), JB (Jonathan) et du visiteur.
 * Les commerciaux sont disponibles de 8h à 16h dans leur fuseau respectif.
 * L'IA génère un message personnalisé et contextuel.
 */

import axios from "axios";
import { invokeLLM } from "./_core/llm";
import { getBusinessHoursConfig } from "./businessHours";
import { getDb } from "./db";
import { siteSettings } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// ─── Types ─────────────────────────────────────────────────────────

export interface CommercialAvailability {
  initials: string;
  name: string;
  timezone: string;
  localTime: string;
  hour: number;
  minute: number;
  available: boolean;
  dayOfWeek: number; // 1=lundi à 7=dimanche
  workHoursInVisitorTz?: string; // ex: "08:00 - 16:00" converti dans le fuseau du visiteur
}

export interface AvailabilityResult {
  available: boolean;
  commercials: CommercialAvailability[];
  aiMessage: string;
  nextAvailability: string | null;
  visitorTimezone: string;
  visitorLocalTime: string;
}

// ─── Configuration des commerciaux ────────────────────────────────

interface CommercialConfig {
  initials: string;
  name: string;
  settingKey: string; // clé dans siteSettings pour le fuseau
  defaultTimezone: string;
}

const COMMERCIALS: CommercialConfig[] = [
  {
    initials: "DC",
    name: "Daniel",
    settingKey: "commercial_dc_timezone",
    defaultTimezone: "Europe/Paris",
  },
  {
    initials: "JB",
    name: "Jonathan",
    settingKey: "commercial_jb_timezone",
    defaultTimezone: "Asia/Shanghai",
  },
];

// Heures de travail : 8h00 à 16h00
const WORK_START_HOUR = 8;
const WORK_END_HOUR = 16;
// Jours de travail : lundi (1) à vendredi (5)
const WORK_DAYS = [1, 2, 3, 4, 5];

// ─── Récupération des fuseaux horaires ────────────────────────────

/**
 * Récupère le fuseau horaire d'un commercial depuis la DB (siteSettings).
 * Fallback sur le fuseau par défaut si non configuré.
 */
async function getCommercialTimezone(config: CommercialConfig): Promise<string> {
  try {
    const db = await getDb();
    if (!db) return config.defaultTimezone;

    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.settingKey, config.settingKey))
      .limit(1);

    if (rows.length > 0 && rows[0].settingValue) {
      return JSON.parse(rows[0].settingValue);
    }
  } catch (err) {
    console.error(`[Availability] Erreur lecture fuseau ${config.initials}:`, err);
  }
  return config.defaultTimezone;
}

/**
 * Récupère l'heure locale et le jour de la semaine dans un fuseau horaire donné.
 */
export function getLocalTimeInfo(timezone: string, now?: Date): {
  hour: number;
  minute: number;
  localTime: string;
  dayOfWeek: number;
} {
  const date = now || new Date();

  const timeFmt = new Intl.DateTimeFormat("fr-FR", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const localTime = timeFmt.format(date);
  const [hourStr, minuteStr] = localTime.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const dayFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
  });
  const weekday = dayFmt.format(date);
  const dayMap: Record<string, number> = {
    Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7,
  };
  const dayOfWeek = dayMap[weekday] ?? 0;

  return { hour, minute, localTime, dayOfWeek };
}

/**
 * Vérifie si un commercial est disponible à l'heure donnée.
 */
export function isCommercialAvailable(hour: number, dayOfWeek: number): boolean {
  if (!WORK_DAYS.includes(dayOfWeek)) return false;
  return hour >= WORK_START_HOUR && hour < WORK_END_HOUR;
}

// ─── Calcul de la prochaine disponibilité ─────────────────────────

/**
 * Calcule la prochaine disponibilité parmi tous les commerciaux.
 * Retourne un ISO string UTC ou null si quelqu'un est déjà disponible.
 */
export function calculateNextAvailability(
  commercials: CommercialAvailability[],
  now?: Date
): string | null {
  const currentTime = now || new Date();

  if (commercials.some(c => c.available)) return null;

  let earliestMs = Infinity;

  for (const c of commercials) {
    const { hour, dayOfWeek } = c;

    // Calculer combien d'heures jusqu'à la prochaine ouverture (8h) dans son fuseau
    let hoursUntilOpen: number;

    if (WORK_DAYS.includes(dayOfWeek)) {
      if (hour < WORK_START_HOUR) {
        // Avant 8h un jour de travail → attendre jusqu'à 8h
        hoursUntilOpen = WORK_START_HOUR - hour;
      } else {
        // Après 16h ou pendant les heures (mais marqué indisponible = après 16h)
        // Trouver le prochain jour de travail
        hoursUntilOpen = findHoursUntilNextWorkday(hour, dayOfWeek);
      }
    } else {
      // Week-end → trouver le prochain lundi
      hoursUntilOpen = findHoursUntilNextWorkday(hour, dayOfWeek);
    }

    const msUntilOpen = hoursUntilOpen * 3600000;
    if (msUntilOpen < earliestMs) {
      earliestMs = msUntilOpen;
    }
  }

  if (earliestMs === Infinity) return null;

  return new Date(currentTime.getTime() + earliestMs).toISOString();
}

/**
 * Calcule le nombre d'heures jusqu'au prochain jour de travail à 8h.
 */
function findHoursUntilNextWorkday(currentHour: number, currentDay: number): number {
  let hoursAhead = 0;
  let day = currentDay;
  let hour = currentHour;

  // Avancer jusqu'à minuit
  hoursAhead += 24 - hour;
  day = day === 7 ? 1 : day + 1;

  // Avancer jour par jour jusqu'à un jour de travail
  while (!WORK_DAYS.includes(day)) {
    hoursAhead += 24;
    day = day === 7 ? 1 : day + 1;
  }

  // Ajouter les heures jusqu'à 8h
  hoursAhead += WORK_START_HOUR;

  return hoursAhead;
}

// ─── Tentative d'appel au CRM ─────────────────────────────────────

const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL || "";
const CRM_WEBHOOK_TOKEN = process.env.CRM_WEBHOOK_TOKEN || "";

/**
 * Tente d'appeler le CRM pour obtenir les disponibilités.
 * Retourne null si le CRM n'est pas accessible.
 */
async function tryGetFromCrm(visitorTimezone: string): Promise<AvailabilityResult | null> {
  if (!CRM_WEBHOOK_URL || !CRM_WEBHOOK_TOKEN) return null;

  try {
    // Construire l'URL de l'endpoint availability du CRM
    const baseUrl = CRM_WEBHOOK_URL.replace("/api/webhook/new-prospect", "");
    const availabilityUrl = `${baseUrl}/api/webhook/availability`;

    const response = await axios.get(availabilityUrl, {
      params: { tz: visitorTimezone },
      headers: {
        Authorization: `Bearer ${CRM_WEBHOOK_TOKEN}`,
      },
      timeout: 5000,
    });

    if (response.data?.success) {
      return response.data as AvailabilityResult;
    }
  } catch (err) {
    console.log("[Availability] CRM non accessible, calcul local utilisé");
  }

  return null;
}

// ─── Conversion d'heures entre fuseaux ──────────────────────────────

/**
 * Convertit une heure d'un fuseau horaire à un autre.
 * Retourne l'heure formatée "HH:MM" dans le fuseau cible.
 * 
 * Méthode : on construit un timestamp UTC représentant hour:minute dans fromTimezone,
 * puis on formate ce timestamp dans toTimezone.
 * Indépendant du fuseau horaire du serveur.
 */
function convertHourBetweenTimezones(
  hour: number,
  minute: number,
  fromTimezone: string,
  toTimezone: string,
  referenceDate?: Date
): string {
  const ref = referenceDate || new Date();

  // Obtenir la date actuelle dans le fuseau source
  const dateStr = ref.toLocaleDateString("en-CA", { timeZone: fromTimezone });

  // Calculer l'offset du fuseau source par rapport à UTC (en ms)
  const utcStr = ref.toLocaleString("en-US", { timeZone: "UTC" });
  const fromStr = ref.toLocaleString("en-US", { timeZone: fromTimezone });
  const fromOffsetMs = (new Date(fromStr).getTime() - new Date(utcStr).getTime());

  // Construire un timestamp UTC : on prend hour:minute comme si c'était UTC,
  // puis on soustrait l'offset du fuseau source pour obtenir le vrai UTC
  const asUtc = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00.000Z`);
  const realUtc = new Date(asUtc.getTime() - fromOffsetMs);

  // Formater dans le fuseau cible
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: toTimezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(realUtc);
}

// ─── Génération du message IA ─────────────────────────────────────

/**
 * Génère un message personnalisé via LLM en fonction de la disponibilité.
 */
async function generateAiMessage(
  commercials: CommercialAvailability[],
  anyAvailable: boolean,
  visitorTimezone: string,
  visitorLocalTime: string,
  nextAvailability: string | null
): Promise<string> {
  const availableNames = commercials.filter(c => c.available).map(c => c.name);
  const nextAvailHours = nextAvailability
    ? Math.round((new Date(nextAvailability).getTime() - Date.now()) / 3600000)
    : null;

  // Calculer l'heure de prochaine dispo en heure locale du visiteur
  let nextAvailVisitorTime = "";
  if (nextAvailability) {
    const nextDate = new Date(nextAvailability);
    nextAvailVisitorTime = nextDate.toLocaleTimeString("fr-FR", {
      timeZone: visitorTimezone,
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Pré-calculer les horaires de travail de chaque commercial convertis dans le fuseau du visiteur
  const commercialSchedules = commercials.map(c => {
    // Créer une date fictive pour 8h00 dans le fuseau du commercial
    const today = new Date();
    const startInVisitorTz = convertHourBetweenTimezones(WORK_START_HOUR, 0, c.timezone, visitorTimezone, today);
    const endInVisitorTz = convertHourBetweenTimezones(WORK_END_HOUR, 0, c.timezone, visitorTimezone, today);
    return {
      name: c.name,
      initials: c.initials,
      available: c.available,
      localTime: c.localTime,
      timezone: c.timezone,
      workHoursInVisitorTz: `${startInVisitorTz} - ${endInVisitorTz}`,
    };
  });

  const prompt = `Tu es l'assistant commercial d'Hallucine, une entreprise française de location et vente d'écrans géants gonflables.

Contexte actuel :
- Heure du visiteur : ${visitorLocalTime} (fuseau : ${visitorTimezone})
- Commerciaux :
${commercialSchedules.map(c => `  - ${c.name} (${c.initials}) : il est ${c.localTime} chez lui (${c.timezone}), ${c.available ? "DISPONIBLE" : "INDISPONIBLE"}, horaires de travail en heure du visiteur : ${c.workHoursInVisitorTz}`).join("\n")}
- Au moins un commercial disponible : ${anyAvailable ? "OUI" : "NON"}
${!anyAvailable && nextAvailHours !== null ? `- Prochaine disponibilité dans environ ${nextAvailHours}h (à ${nextAvailVisitorTime} heure du visiteur)` : ""}

Génère un message court (2 phrases max) et chaleureux pour le visiteur du site web :
- Si quelqu'un est disponible : encourage à nous contacter maintenant (appel, email, formulaire)
- Si personne n'est disponible : indique les horaires de travail EN HEURE DU VISITEUR (utilise EXACTEMENT les horaires pré-calculés ci-dessus, NE LES RECALCULE PAS) et encourage à laisser un email
- Adapte le ton selon l'heure du visiteur (bonjour le matin, bonsoir le soir)
- Mentionne le prénom du commercial disponible si possible
- Ne mentionne PAS les fuseaux horaires techniques, parle uniquement en heure du visiteur
- UTILISE UNIQUEMENT les horaires fournis ci-dessus, ne fais AUCUN calcul de conversion toi-même
- Sois naturel et commercial, pas robotique`;

  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Tu génères des messages de disponibilité pour un site web commercial. Réponds uniquement avec le message, sans guillemets ni formatage.",
        },
        { role: "user", content: prompt },
      ],
    });

    const content = result.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.trim().length > 0) {
      return content.trim();
    }
  } catch (err) {
    console.error("[Availability] Erreur LLM:", err);
  }

  // Fallback sans IA
  if (anyAvailable) {
    const names = availableNames.join(" et ");
    return `${names} ${availableNames.length > 1 ? "sont" : "est"} disponible${availableNames.length > 1 ? "s" : ""} ! Contactez-nous maintenant par téléphone ou formulaire.`;
  } else {
    return "Nos équipes sont actuellement en repos. Laissez-nous votre email et nous vous recontacterons dès l'ouverture !";
  }
}

// ─── Fonction principale ──────────────────────────────────────────

/**
 * Calcule la disponibilité des commerciaux et génère un message IA.
 * Tente d'abord le CRM, puis calcule localement en fallback.
 */
export async function getAvailability(visitorTimezone: string): Promise<AvailabilityResult> {
  // 1. Tenter le CRM d'abord
  const crmResult = await tryGetFromCrm(visitorTimezone);
  if (crmResult) return crmResult;

  // 2. Calcul local
  const now = new Date();

  // Récupérer les fuseaux des commerciaux
  const commercials: CommercialAvailability[] = [];
  for (const config of COMMERCIALS) {
    const timezone = await getCommercialTimezone(config);
    const { hour, minute, localTime, dayOfWeek } = getLocalTimeInfo(timezone, now);
    const available = isCommercialAvailable(hour, dayOfWeek);

    const startInVisitorTz = convertHourBetweenTimezones(WORK_START_HOUR, 0, timezone, visitorTimezone, now);
    const endInVisitorTz = convertHourBetweenTimezones(WORK_END_HOUR, 0, timezone, visitorTimezone, now);

    commercials.push({
      initials: config.initials,
      name: config.name,
      timezone,
      localTime,
      hour,
      minute,
      available,
      dayOfWeek,
      workHoursInVisitorTz: `${startInVisitorTz} - ${endInVisitorTz}`,
    });
  }

  const anyAvailable = commercials.some(c => c.available);

  // 3. Calculer la prochaine disponibilité
  const nextAvailability = calculateNextAvailability(commercials, now);

  // 4. Heure locale du visiteur
  const visitorInfo = getLocalTimeInfo(visitorTimezone, now);

  // 5. Générer le message IA
  const aiMessage = await generateAiMessage(
    commercials,
    anyAvailable,
    visitorTimezone,
    visitorInfo.localTime,
    nextAvailability
  );

  return {
    available: anyAvailable,
    commercials,
    aiMessage,
    nextAvailability,
    visitorTimezone,
    visitorLocalTime: visitorInfo.localTime,
  };
}

/**
 * Version sans IA (rapide, pour le cache ou les tests).
 * Retourne les données de disponibilité sans appeler le LLM.
 */
export async function getAvailabilityFast(visitorTimezone: string): Promise<Omit<AvailabilityResult, "aiMessage"> & { aiMessage: string }> {
  const now = new Date();

  const commercials: CommercialAvailability[] = [];
  for (const config of COMMERCIALS) {
    const timezone = await getCommercialTimezone(config);
    const { hour, minute, localTime, dayOfWeek } = getLocalTimeInfo(timezone, now);
    const available = isCommercialAvailable(hour, dayOfWeek);

    const startInVisitorTz = convertHourBetweenTimezones(WORK_START_HOUR, 0, timezone, visitorTimezone, now);
    const endInVisitorTz = convertHourBetweenTimezones(WORK_END_HOUR, 0, timezone, visitorTimezone, now);

    commercials.push({
      initials: config.initials,
      name: config.name,
      timezone,
      localTime,
      hour,
      minute,
      available,
      dayOfWeek,
      workHoursInVisitorTz: `${startInVisitorTz} - ${endInVisitorTz}`,
    });
  }

  const anyAvailable = commercials.some(c => c.available);
  const nextAvailability = calculateNextAvailability(commercials, now);
  const visitorInfo = getLocalTimeInfo(visitorTimezone, now);

  // Message fallback sans IA
  const availableNames = commercials.filter(c => c.available).map(c => c.name);
  let aiMessage: string;
  if (anyAvailable) {
    const names = availableNames.join(" et ");
    aiMessage = `${names} ${availableNames.length > 1 ? "sont" : "est"} disponible${availableNames.length > 1 ? "s" : ""} ! Contactez-nous maintenant.`;
  } else {
    aiMessage = "Nos équipes sont actuellement en repos. Laissez-nous votre email !";
  }

  return {
    available: anyAvailable,
    commercials,
    aiMessage,
    nextAvailability,
    visitorTimezone,
    visitorLocalTime: visitorInfo.localTime,
  };
}
