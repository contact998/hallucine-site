import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { buildAgentSkillsIndex, getSkillMd, AGENT_SKILLS } from "./agentSkills";

describe("agent skills discovery index", () => {
  const idx = buildAgentSkillsIndex("https://hallucinecran.fr");

  it("porte le $schema de découverte v0.2.0", () => {
    expect(idx.$schema).toBe("https://schemas.agentskills.io/discovery/0.2.0/schema.json");
  });

  it("expose au moins une skill avec tous les champs requis", () => {
    expect(idx.skills.length).toBeGreaterThan(0);
    for (const s of idx.skills) {
      expect(s.name).toMatch(/^[a-z0-9-]+$/);
      expect(s.type).toBe("skill-md");
      expect(s.description.length).toBeGreaterThan(10);
      expect(s.url).toMatch(/^https:\/\/[^/]+\/\.well-known\/agent-skills\/[a-z0-9-]+\/SKILL\.md$/);
      expect(s.digest).toMatch(/^sha256:[a-f0-9]{64}$/);
    }
  });

  it("le digest = SHA-256 des octets exacts du SKILL.md servi", () => {
    for (const s of idx.skills) {
      const md = getSkillMd(s.name);
      expect(md).toBeTruthy();
      const want = "sha256:" + createHash("sha256").update(md!, "utf8").digest("hex");
      expect(s.digest).toBe(want);
    }
  });

  it("utilise l'origine de la requête pour les URLs absolues (multi-TLD)", () => {
    const de = buildAgentSkillsIndex("https://hallucinecran.de");
    expect(de.skills[0]!.url.startsWith("https://hallucinecran.de/.well-known/agent-skills/")).toBe(true);
  });

  it("getSkillMd renvoie null pour une skill inconnue", () => {
    expect(getSkillMd("does-not-exist")).toBeNull();
    expect(getSkillMd(AGENT_SKILLS[0]!.name)).toContain("# Request a Quote");
  });
});
