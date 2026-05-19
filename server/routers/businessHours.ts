import { z } from "zod";
import { publicProcedure, adminProcedure, router } from "../_core/trpc";
import {
  getBusinessHoursConfig,
  updateBusinessHoursSetting,
  isCurrentlyAvailable,
  COMMON_TIMEZONES,
} from "../businessHours";

/** Offset UTC d'un fuseau horaire en minutes pour une date donnée. */
function getTimezoneOffset(tz: string, date: Date): number {
  const utcStr = date.toLocaleString("en-US", { timeZone: "UTC" });
  const tzStr = date.toLocaleString("en-US", { timeZone: tz });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
}

export const businessHoursRouter = router({
  /** Récupérer les heures de présence et le statut en ligne (public) */
  getStatus: publicProcedure.query(async () => {
    const config = await getBusinessHoursConfig();
    const available = isCurrentlyAvailable(config);
    return {
      timezone: config.timezone,
      startTime: config.startTime,
      endTime: config.endTime,
      workDays: config.workDays,
      isAvailable: available,
    };
  }),

  /** Récupérer la config complète + liste des fuseaux horaires (admin) */
  getConfig: adminProcedure.query(async () => {
    const config = await getBusinessHoursConfig();
    return { config, timezones: COMMON_TIMEZONES };
  }),

  /** Mettre à jour le fuseau horaire (admin) */
  updateTimezone: adminProcedure
    .input(z.object({ timezone: z.string() }))
    .mutation(async ({ input }) => {
      await updateBusinessHoursSetting("business_timezone", JSON.stringify(input.timezone));
      return { success: true };
    }),

  /** Mettre à jour les heures de présence (admin) */
  updateHours: adminProcedure
    .input(z.object({ startTime: z.string(), endTime: z.string() }))
    .mutation(async ({ input }) => {
      await updateBusinessHoursSetting("business_hours_start", JSON.stringify(input.startTime));
      await updateBusinessHoursSetting("business_hours_end", JSON.stringify(input.endTime));
      return { success: true };
    }),

  /** Mettre à jour les jours de travail (admin) */
  updateWorkDays: adminProcedure
    .input(z.object({ workDays: z.array(z.number().min(1).max(7)) }))
    .mutation(async ({ input }) => {
      await updateBusinessHoursSetting("business_days", JSON.stringify(input.workDays));
      return { success: true };
    }),

  /** Message WhatsApp adapté selon la disponibilité et le fuseau du visiteur */
  getSmartMessage: publicProcedure
    .input(z.object({ visitorTimezone: z.string().optional() }))
    .query(async ({ input }) => {
      const config = await getBusinessHoursConfig();
      const available = isCurrentlyAvailable(config);
      const visitorTz = input.visitorTimezone || "Europe/Paris";

      const now = new Date();
      const [sH, sM] = config.startTime.split(":").map(Number);
      const [eH, eM] = config.endTime.split(":").map(Number);

      const formatInVisitorTz = (hour: number, minute: number) => {
        const dateStr = now.toLocaleDateString("en-CA", { timeZone: config.timezone });
        const bizOffsetMs = getTimezoneOffset(config.timezone, now) * 60000;
        const utcDate = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00.000Z`);
        const realUtcDate = new Date(utcDate.getTime() - bizOffsetMs);
        return realUtcDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: visitorTz });
      };

      let visitorStart: string;
      let visitorEnd: string;
      try {
        visitorStart = formatInVisitorTz(sH, sM);
        visitorEnd = formatInVisitorTz(eH, eM);
      } catch {
        visitorStart = config.startTime;
        visitorEnd = config.endTime;
      }

      return {
        isAvailable: available,
        businessTimezone: config.timezone,
        visitorTimezone: visitorTz,
        hoursInVisitorTz: { start: visitorStart, end: visitorEnd },
        hoursInBusinessTz: { start: config.startTime, end: config.endTime },
        message: available
          ? `Nous sommes en ligne ! Réponse immédiate.`
          : `Hors ligne. Nos horaires : ${visitorStart} - ${visitorEnd} (votre heure). Laissez un message, nous répondrons dès notre retour.`,
      };
    }),
});
