import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { insertContactSubmission } from "../db";
import { sendProspectToCrm, isCrmWebhookConfigured } from "../crmWebhook";
import { computeSpamScore } from "../antispam";

export const contactRouter = router({
  abandonPartial: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email invalide"),
        prenom: z.string().optional(),
        nom: z.string().optional(),
        entreprise: z.string().optional(),
        telephone: z.string().optional(),
        product: z.string().optional(),
        productDetail: z.string().optional(),
        country: z.string().optional(),
        city: z.string().optional(),
        lastStep: z.number(),
        totalSteps: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const fullName = [input.prenom, input.nom].filter(Boolean).join(" ") || "Inconnu";
      const progress = Math.round((input.lastStep / input.totalSteps) * 100);

      console.log(`[Abandon] Formulaire abandonne par ${input.email} a l'etape ${input.lastStep}/${input.totalSteps} (${progress}%)`);

      let crmOk = false;
      if (isCrmWebhookConfigured()) {
        try {
          const result = await sendProspectToCrm({
            entreprise: input.entreprise || `Particulier - ${fullName}`,
            personne: input.nom || null,
            prenom: input.prenom || null,
            email: input.email,
            telephone: input.telephone || null,
            ville: input.city || null,
            pays: input.country || null,
            produit: input.product || null,
            notes: [
              "Source : formulaire site web hallucine.fr",
              `[ABANDON étape ${input.lastStep}/${input.totalSteps} - ${progress}%]`,
              input.productDetail ? `Détail : ${input.productDetail}` : null,
            ].filter(Boolean).join("\n"),
            abandonPartiel: true,
          });
          crmOk = result.success;
          if (result.success) {
            console.log(`[Abandon] Prospect partiel envoyé au CRM (id: ${result.prospectId}) pour ${input.email}`);
          }
        } catch (err) {
          console.warn("[Abandon] Erreur webhook CRM:", err);
        }
      }

      return { success: true };
    }),

  submit: publicProcedure
    .input(
      z.object({
        type: z.enum(["contact", "devis", "distributeur"]),
        nom: z.string().min(1, "Le nom est requis"),
        email: z.string().email("Email invalide"),
        telephone: z.string().optional(),
        entreprise: z.string().optional(),
        sujet: z.string().optional(),
        message: z.string().optional(),
        produit: z.string().optional(),
        objectif: z.string().optional(),
        _hp: z.string().optional(),
        _ts: z.number().optional(),
        _powChallenge: z.string().optional(),
        _powNonce: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const clientIp = ctx.req.ip || ctx.req.headers["x-forwarded-for"] as string || "unknown";
      const spamResult = await computeSpamScore({
        honeypot: input._hp,
        timestamp: input._ts,
        ip: clientIp,
        email: input.email,
        powChallenge: input._powChallenge,
        powNonce: input._powNonce,
      });

      if (spamResult.blocked) {
        console.log(`[Anti-spam] BLOQUÉ (score=${spamResult.score}) pour ${input.email} — ${spamResult.reasons.join(", ")}`);
        return { success: true, crmSynced: false };
      }

      if (spamResult.score < 70) {
        console.log(`[Anti-spam] SUSPECT (score=${spamResult.score}) pour ${input.email} — ${spamResult.reasons.join(", ")}`);
      }

      await insertContactSubmission({
        type: input.type,
        nom: input.nom,
        email: input.email,
        telephone: input.telephone ?? null,
        entreprise: input.entreprise ?? null,
        sujet: input.sujet ?? null,
        message: input.message ?? null,
        produit: input.produit ?? null,
        objectif: input.objectif ?? null,
        userId: ctx.user?.id ?? null,
        status: "en_attente",
      });

      let crmSync: { success: boolean; error?: string } = { success: false, error: "not configured" };

      const nameParts = input.nom.split(" ");
      const prospectPrenom = nameParts[0] || null;
      const prospectNom = nameParts.slice(1).join(" ") || null;

      let prospectVille: string | null = null;
      let prospectCodePostal: string | null = null;
      let prospectPays: string | null = null;
      if (input.sujet) {
        const locationPart = input.sujet.split(" -- ")[1];
        if (locationPart) {
          const parts = locationPart.split(", ").map(s => s.trim());
          prospectVille = parts[0] || null;
          prospectCodePostal = parts[1] || null;
          prospectPays = parts[2] || null;
        }
      }

      if (isCrmWebhookConfigured()) {
        try {
          const result = await sendProspectToCrm({
            entreprise: input.entreprise || `Particulier - ${input.nom}`,
            personne: prospectNom,
            prenom: prospectPrenom,
            email: input.email,
            telephone: input.telephone || null,
            ville: prospectVille,
            codePostal: prospectCodePostal,
            pays: prospectPays,
            produit: input.produit || null,
            contactType: "mail",
            notes: [
              "Source : formulaire site web hallucine.fr",
              input.message ? `Message : ${input.message}` : null,
              input.objectif ? `Objectif : ${input.objectif}` : null,
            ].filter(Boolean).join("\n"),
          });
          crmSync = result;
          if (result.success) {
            console.log(`[CRM Webhook] Prospect créé (id: ${result.prospectId}) pour ${input.nom}`);
          } else {
            console.warn(`[CRM Webhook] Échec pour ${input.nom}: ${result.error}`);
          }
        } catch (err) {
          console.error(`[CRM Webhook] Erreur pour ${input.nom}:`, err);
          crmSync = { success: false, error: String(err) };
        }
      }

      return { success: true, crmSynced: crmSync.success };
    }),
});
