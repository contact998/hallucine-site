/**
 * webmcp.ts — Expose les actions clés du site aux agents navigateur via WebMCP
 * (`navigator.modelContext.registerTool`). Spec : https://webmachinelearning.github.io/webmcp/
 *
 * Feature-detect strict : **no-op** si l'API est absente (cas de la quasi-totalité
 * des navigateurs aujourd'hui — API expérimentale Chrome EPP). Aucun impact UI,
 * aucun script externe, exécuté uniquement côté client après hydratation.
 *
 * Les outils exposent de VRAIES actions (catalogue, demande de devis, contact) —
 * pas de coquille vide. `request_quote` ne crée pas de lead en silence : il renvoie
 * l'URL de contact + le récapitulatif (Hallucine = B2B sur-mesure, devis humain).
 */
import { detectLanguage, LANGUAGE_DOMAINS } from "../i18n/domains";
import { ROUTES, type RouteKey } from "../i18n/routes";

interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => unknown;
}

interface ModelContext {
  registerTool?: (tool: WebMcpTool) => unknown;
  provideContext?: (ctx: { tools: WebMcpTool[] }) => unknown;
}

let registered = false;

/** Produits exposés : clé de route (URL réelle via ROUTES) → libellé court. */
const PRODUCT_KEYS: Array<{ key: RouteKey; label: string }> = [
  { key: "ecrans", label: "Écrans de cinéma gonflables (3 m à 24 m)" },
  { key: "ecran-geant", label: "Écran gonflable géant à soufflerie" },
  { key: "ecran-etanche", label: "Écran gonflable étanche à l'air (TPU)" },
  { key: "ecran-economique", label: "Écran gonflable économique" },
  { key: "ecrans-led", label: "Écrans LED géants" },
  { key: "tentes", label: "Tentes gonflables événementielles" },
  { key: "arches", label: "Arches gonflables publicitaires" },
  { key: "mobilier", label: "Mobilier gonflable" },
  { key: "accessoires", label: "Accessoires cinéma plein air" },
];

function originFor(lang: string): string {
  return LANGUAGE_DOMAINS[lang as keyof typeof LANGUAGE_DOMAINS] ?? LANGUAGE_DOMAINS.fr;
}

/** Construit les définitions d'outils, URLs localisées selon le TLD/langue courant. */
export function buildTools(): WebMcpTool[] {
  const lang = detectLanguage();
  const base = originFor(lang);
  const routes = ROUTES[lang] ?? ROUTES.fr;
  const contactUrl = `${base}${routes["contact"] ?? "/contactez-nous"}`;

  return [
    {
      name: "list_products",
      description:
        "List Hallucine's product range — giant inflatable cinema screens, LED screens, inflatable tents, advertising arches, furniture and open-air cinema accessories — with their page URLs.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      execute: () =>
        PRODUCT_KEYS.map(({ key, label }) => ({
          name: label,
          url: `${base}${routes[key] ?? "/"}`,
        })),
    },
    {
      name: "request_quote",
      description:
        "Prepare a custom quote request for Hallucine (B2B, custom-built, priced on quote — no online checkout). Returns the contact page URL and a summary of the details to submit; a human replies with a tailored quote.",
      inputSchema: {
        type: "object",
        properties: {
          product: { type: "string", description: "Product of interest, e.g. 'inflatable screen 8 m'" },
          size: { type: "string", description: "Desired screen/structure size" },
          event_type: { type: "string", description: "Event type / intended use" },
          event_date: { type: "string", description: "Event date (YYYY-MM-DD)" },
          country: { type: "string" },
          city: { type: "string" },
          name: { type: "string" },
          email: { type: "string", description: "Contact email" },
          phone: { type: "string" },
          message: { type: "string" },
        },
        required: ["product", "email"],
      },
      execute: (input: Record<string, unknown>) => ({
        status: "ready",
        contact_url: contactUrl,
        message:
          "Open the contact page to send this quote request to Hallucine; a human replies with a tailored quote, usually within one business day.",
        summary: input,
      }),
    },
    {
      name: "get_contact_info",
      description: "Get Hallucine's contact details and localized site URLs.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      execute: () => ({
        email: "contact@hallucine.fr",
        contact_url: contactUrl,
        sites: {
          fr: LANGUAGE_DOMAINS.fr,
          en: LANGUAGE_DOMAINS.en,
          de: LANGUAGE_DOMAINS.de,
          es: LANGUAGE_DOMAINS.es,
          it: LANGUAGE_DOMAINS.it,
        },
      }),
    },
  ];
}

/** Enregistre les outils WebMCP si l'API est présente. Idempotent ; no-op sinon. */
export function registerWebMcpTools(): void {
  if (registered) return;
  if (typeof navigator === "undefined") return;
  const mc = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
  if (!mc) return;
  try {
    const tools = buildTools();
    if (typeof mc.registerTool === "function") {
      for (const t of tools) mc.registerTool(t);
    } else if (typeof mc.provideContext === "function") {
      mc.provideContext({ tools });
    } else {
      return;
    }
    registered = true;
  } catch (e) {
    // API expérimentale : ne JAMAIS casser la page si la forme diffère.
    if (typeof console !== "undefined") console.debug("[webmcp] registration ignorée:", e);
  }
}
