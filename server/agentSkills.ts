/**
 * agentSkills.ts — Agent Skills Discovery (agentskills.io, RFC v0.2.0).
 *
 * Sert :
 *   - GET /.well-known/agent-skills/index.json        → l'index de découverte
 *   - GET /.well-known/agent-skills/:name/SKILL.md     → l'artefact d'une skill
 *
 * Le `digest` de l'index est calculé à partir des octets EXACTS du SKILL.md
 * servi (même constante `md`) → il ne peut jamais diverger du contenu réel.
 *
 * Routes dynamiques (et non fichiers statiques) car express.static est configuré
 * en `dotfiles: 'ignore'` et ne sert donc pas /.well-known (cf. server/_core/vite.ts).
 */
import { createHash } from "node:crypto";

export interface AgentSkillDef {
  /** identifiant : minuscules + tirets */
  name: string;
  description: string;
  /** contenu brut du SKILL.md, servi tel quel */
  md: string;
}

/** Skill « request-quote » — aide un agent à demander un devis Hallucine. */
const REQUEST_QUOTE_SKILL_MD = `# Request a Quote from Hallucine

Hallucine is a French manufacturer of giant inflatable cinema screens, inflatable
tents, advertising arches and event structures. Products are custom-built and
**priced on quote** — there is no online checkout.

Use this skill to help a user request a personalised quote (devis).

## What Hallucine sells

- Inflatable cinema screens from 3 m to 24 m (giant blower-inflated, air-tight TPU,
  economic, drive-in)
- Giant LED screens
- Inflatable tents (X, N, V and spider shapes) and advertising arches
- Inflatable furniture and open-air cinema accessories

## How to request a quote

1. Collect from the user:
   - Product(s) of interest (e.g. "inflatable screen 8 m wide")
   - Intended use / event type and date
   - Delivery country and city
   - Contact name, email and phone number
2. Submit the request on the contact page: https://hallucinecran.fr/contactez-nous
   A human replies with a tailored quote, usually within one business day.
3. Or email contact@hallucine.fr directly with the details above.

## Notes

- B2B, custom orders, payment by bank transfer — no self-service purchase.
- International delivery from France.
- Localised sites: FR https://hallucinecran.fr · EN https://hallucinecran.com ·
  DE https://hallucinecran.de · ES https://hallucinecran.es · IT https://hallucinecran.it
`;

export const AGENT_SKILLS: AgentSkillDef[] = [
  {
    name: "request-quote",
    description:
      "Help a user request a personalised quote for Hallucine's custom inflatable cinema screens, tents and event structures (B2B, no online checkout).",
    md: REQUEST_QUOTE_SKILL_MD,
  },
];

/** `sha256:<hex>` des octets UTF-8 d'un SKILL.md. */
export function skillDigest(md: string): string {
  return "sha256:" + createHash("sha256").update(md, "utf8").digest("hex");
}

/** Contenu d'un SKILL.md par nom, ou null si inconnu. */
export function getSkillMd(name: string): string | null {
  return AGENT_SKILLS.find((s) => s.name === name)?.md ?? null;
}

export interface AgentSkillsIndex {
  $schema: string;
  skills: Array<{
    name: string;
    type: "skill-md";
    description: string;
    url: string;
    digest: string;
  }>;
}

/** Index de découverte, URLs absolues basées sur l'origine de la requête (multi-TLD). */
export function buildAgentSkillsIndex(origin: string): AgentSkillsIndex {
  const base = origin.replace(/\/+$/, "");
  return {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: AGENT_SKILLS.map((s) => ({
      name: s.name,
      type: "skill-md" as const,
      description: s.description,
      url: `${base}/.well-known/agent-skills/${s.name}/SKILL.md`,
      digest: skillDigest(s.md),
    })),
  };
}
