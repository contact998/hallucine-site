// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from "vitest";

// Module-level guard `registered` → on réimporte frais à chaque test.
async function freshRegister() {
  vi.resetModules();
  return (await import("./webmcp")).registerWebMcpTools;
}

describe("registerWebMcpTools", () => {
  beforeEach(() => {
    delete (navigator as unknown as { modelContext?: unknown }).modelContext;
  });

  it("ne casse pas quand l'API WebMCP est absente (no-op)", async () => {
    const registerWebMcpTools = await freshRegister();
    expect(() => registerWebMcpTools()).not.toThrow();
  });

  it("enregistre des outils valides via navigator.modelContext.registerTool", async () => {
    const tools: Array<Record<string, unknown>> = [];
    (navigator as unknown as { modelContext: unknown }).modelContext = {
      registerTool: (t: Record<string, unknown>) => tools.push(t),
    };
    const registerWebMcpTools = await freshRegister();
    registerWebMcpTools();

    expect(tools.length).toBeGreaterThan(0);
    for (const t of tools) {
      expect(t.name).toMatch(/^[a-z_]+$/); // identifiant lisible
      expect(typeof t.description).toBe("string");
      expect((t.description as string).length).toBeGreaterThan(10);
      expect(t.inputSchema).toBeTruthy();
      expect(typeof t.execute).toBe("function");
    }
    const names = tools.map((t) => t.name);
    expect(names).toContain("list_products");
    expect(names).toContain("request_quote");
    expect(names).toContain("get_contact_info");
  });

  it("request_quote.execute renvoie l'URL de contact réelle + le récapitulatif (pas de lead silencieux)", async () => {
    const tools: Array<Record<string, unknown>> = [];
    (navigator as unknown as { modelContext: unknown }).modelContext = {
      registerTool: (t: Record<string, unknown>) => tools.push(t),
    };
    const registerWebMcpTools = await freshRegister();
    registerWebMcpTools();

    const rq = tools.find((t) => t.name === "request_quote") as { execute: (i: unknown) => any };
    const out = rq.execute({ product: "écran 8m", email: "x@y.z" });
    expect(out.contact_url).toMatch(/hallucinecran\.fr\/contactez-nous/);
    expect(out.summary.product).toBe("écran 8m");
  });

  it("list_products renvoie des URLs absolues réelles", async () => {
    const tools: Array<Record<string, unknown>> = [];
    (navigator as unknown as { modelContext: unknown }).modelContext = {
      registerTool: (t: Record<string, unknown>) => tools.push(t),
    };
    const registerWebMcpTools = await freshRegister();
    registerWebMcpTools();

    const lp = tools.find((t) => t.name === "list_products") as { execute: () => Array<{ name: string; url: string }> };
    const list = lp.execute();
    expect(list.length).toBeGreaterThan(3);
    expect(list[0]!.url).toMatch(/^https:\/\/hallucinecran\.fr\//);
  });

  it("utilise provideContext en repli si registerTool est absent", async () => {
    let provided: { tools: unknown[] } | null = null;
    (navigator as unknown as { modelContext: unknown }).modelContext = {
      provideContext: (ctx: { tools: unknown[] }) => { provided = ctx; },
    };
    const registerWebMcpTools = await freshRegister();
    registerWebMcpTools();
    expect(provided).not.toBeNull();
    expect(provided!.tools.length).toBeGreaterThan(0);
  });
});
