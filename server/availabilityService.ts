/**
 * Service Indicateur de Disponibilité IA
 * 
 * Croise les fuseaux horaires de DC (Daniel), JB (Jonathan) et du visiteur.
 * Les commerciaux sont disponibles de 8h à 16h dans leur fuseau respectif.
 * L'IA génère un message personnalisé et contextuel.
 * 
 * Les fuseaux horaires sont lus depuis le CRM via la route publique
 * commercials.timezones (pas de token, pas d'expiration).
 */

import axios from "axios";
import { invokeLLM } from "./_core/llm";

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

// ─── Configuration ────────────────────────────────────────────────

// URL du CRM — route tRPC publique, pas de token nécessaire
const CRM_BASE_URL = "https://hallucine-crm-production.up.railway.app";
const CRM_TIMEZONES_URL = `${CRM_BASE_URL}/api/trpc/commercials.timezones`;

// Fallback si le CRM est inaccessible (DC et JB sont en Chine)
const FALLBACK_COMMERCIALS = [
  { initials: "DC", name: "Daniel", timezone: "Asia/Shanghai" },
  { initials: "JB", name: "Jonathan", timezone: "Asia/Shanghai" },
];

// Cache des fuseaux CRM (5 minutes TTL)
let crmCache: { data: typeof FALLBACK_COMMERCIALS; timestamp: number } | null = null;
const CRM_CACHE_TTL = 5 * 60 * 1000;

// Heures de travail : 8h00 à 16h00
const WORK_START_HOUR = 8;
const WORK_END_HOUR = 16;
// Jours de travail : lundi (1) à vendredi (5)
const WORK_DAYS = [1, 2, 3, 4, 5];

// ─── Récupération des fuseaux horaires depuis le CRM ─────────────

interface CrmCommercial {
  initials: string;
  name: string;
  timezone: string;
}

/**
 * Récupère les fuseaux horaires des commerciaux depuis le CRM.
 * Route publique, pas de token. Cache de 5 minutes.
 * Fallback sur Asia/Shanghai si le CRM est inaccessible.
 */
async function getCommercialsFromCrm(): Promise<CrmCommercial[]> {
  // Vérifier le cache
  if (crmCache && Date.now() - crmCache.timestamp < CRM_CACHE_TTL) {
    return crmCache.data;
  }

  try {
    const response = await axios.get(CRM_TIMEZONES_URL, { timeout: 5000 });
    const data = response.data?.result?.data?.json;

    if (Array.isArray(data) && data.length > 0) {
      const commercials = data.map((c: any) => ({
        initials: String(c.initials || "??"),
        name: String(c.name || "Inconnu"),
        timezone: String(c.timezone || "Asia/Shanghai"),
      }));
      crmCache = { data: commercials, timestamp: Date.now() };
      console.log(`[Availability] Fuseaux CRM chargés: ${commercials.map((c: CrmCommercial) => `${c.initials}=${c.timezone}`).join(", ")}`);
      return commercials;
    }
  } catch (err) {
    console.log("[Availability] CRM inaccessible, fallback Asia/Shanghai utilisé");
  }

  // Fallback
  return FALLBACK_COMMERCIALS;
}

// ─── Fonctions utilitaires ────────────────────────────────────────

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

    let hoursUntilOpen: number;

    if (WORK_DAYS.includes(dayOfWeek)) {
      if (hour < WORK_START_HOUR) {
        hoursUntilOpen = WORK_START_HOUR - hour;
      } else {
        hoursUntilOpen = findHoursUntilNextWorkday(hour, dayOfWeek);
      }
    } else {
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

  hoursAhead += 24 - hour;
  day = day === 7 ? 1 : day + 1;

  while (!WORK_DAYS.includes(day)) {
    hoursAhead += 24;
    day = day === 7 ? 1 : day + 1;
  }

  hoursAhead += WORK_START_HOUR;

  return hoursAhead;
}

// ─── Conversion d'heures entre fuseaux ──────────────────────────────

/**
 * Convertit une heure d'un fuseau horaire à un autre.
 */
function convertHourBetweenTimezones(
  hour: number,
  minute: number,
  fromTimezone: string,
  toTimezone: string,
  referenceDate?: Date
): string {
  const ref = referenceDate || new Date();

  const dateStr = ref.toLocaleDateString("en-CA", { timeZone: fromTimezone });

  const utcStr = ref.toLocaleString("en-US", { timeZone: "UTC" });
  const fromStr = ref.toLocaleString("en-US", { timeZone: fromTimezone });
  const fromOffsetMs = (new Date(fromStr).getTime() - new Date(utcStr).getTime());

  const asUtc = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00.000Z`);
  const realUtc = new Date(asUtc.getTime() - fromOffsetMs);

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

  let nextAvailVisitorTime = "";
  if (nextAvailability) {
    const nextDate = new Date(nextAvailability);
    nextAvailVisitorTime = nextDate.toLocaleTimeString("fr-FR", {
      timeZone: visitorTimezone,
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const commercialSchedules = commercials.map(c => {
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
 * Lit les fuseaux depuis le CRM (route publique), fallback Asia/Shanghai.
 */
export async function getAvailability(visitorTimezone: string): Promise<AvailabilityResult> {
  const now = new Date();

  // Récupérer les commerciaux depuis le CRM
  const crmCommercials = await getCommercialsFromCrm();

  const commercials: CommercialAvailability[] = [];
  for (const config of crmCommercials) {
    const { hour, minute, localTime, dayOfWeek } = getLocalTimeInfo(config.timezone, now);
    const available = isCommercialAvailable(hour, dayOfWeek);

    const startInVisitorTz = convertHourBetweenTimezones(WORK_START_HOUR, 0, config.timezone, visitorTimezone, now);
    const endInVisitorTz = convertHourBetweenTimezones(WORK_END_HOUR, 0, config.timezone, visitorTimezone, now);

    commercials.push({
      initials: config.initials,
      name: config.name,
      timezone: config.timezone,
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

  const crmCommercials = await getCommercialsFromCrm();

  const commercials: CommercialAvailability[] = [];
  for (const config of crmCommercials) {
    const { hour, minute, localTime, dayOfWeek } = getLocalTimeInfo(config.timezone, now);
    const available = isCommercialAvailable(hour, dayOfWeek);

    const startInVisitorTz = convertHourBetweenTimezones(WORK_START_HOUR, 0, config.timezone, visitorTimezone, now);
    const endInVisitorTz = convertHourBetweenTimezones(WORK_END_HOUR, 0, config.timezone, visitorTimezone, now);

    commercials.push({
      initials: config.initials,
      name: config.name,
      timezone: config.timezone,
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
