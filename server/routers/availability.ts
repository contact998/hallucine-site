import { z } from "zod";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "../_core/trpc";
import { getAvailability } from "../availabilityService";

export const availabilityRouter = router({
  /** Récupère la disponibilité des commerciaux avec message IA */
  check: publicProcedure
    .input(z.object({
      visitorTimezone: z.string().default("Europe/Paris"),
    }))
    .query(async ({ input }) => {
      return getAvailability(input.visitorTimezone);
    }),

  /** Met à jour le fuseau horaire d'un commercial (admin) */
  updateCommercialTimezone: adminProcedure
    .input(z.object({
      commercial: z.enum(["dc", "jb"]),
      timezone: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { updateBusinessHoursSetting } = await import("../businessHours");
      const key = `commercial_${input.commercial}_timezone`;
      const success = await updateBusinessHoursSetting(key, JSON.stringify(input.timezone));
      return { success, commercial: input.commercial.toUpperCase(), timezone: input.timezone };
    }),

  /** Récupère les fuseaux horaires configurés des commerciaux (admins connectés) */
  getCommercialTimezones: protectedProcedure.query(async () => {
    const result = await getAvailability("Europe/Paris");
    const dcCommercial = result.commercials.find((c: any) => c.initials === "DC");
    const jbCommercial = result.commercials.find((c: any) => c.initials === "JB");
    return {
      dc: dcCommercial?.timezone || "Europe/Paris",
      jb: jbCommercial?.timezone || "Asia/Shanghai",
      dcTime: dcCommercial?.localTime || "",
      jbTime: jbCommercial?.localTime || "",
      dcAvailable: dcCommercial?.available ?? false,
      jbAvailable: jbCommercial?.available ?? false,
    };
  }),
});
