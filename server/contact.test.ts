import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database, notification, and CRM sync functions
vi.mock("./db", () => ({
  insertContactSubmission: vi.fn().mockResolvedValue(true),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./crmSync", () => ({
  syncSubmissionToCrm: vi.fn().mockResolvedValue({ success: false, error: "not configured" }),
  isCrmSyncConfigured: vi.fn().mockReturnValue(false),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  it("accepts a valid contact submission and returns success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      type: "contact",
      nom: "Jean Dupont",
      email: "jean@example.com",
      telephone: "+33 6 12 34 56 78",
      entreprise: "Cinéma Plein Air",
      sujet: "Écran 10m — Usage: Festival — Pays: France",
      message: "Je souhaite un devis pour un écran 10m.",
      produit: "Écran 10m",
      objectif: "festival",
    });

    expect(result.success).toBe(true);
  });

  it("accepts a minimal contact submission (nom + email only)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      type: "devis",
      nom: "Marie Martin",
      email: "marie@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("rejects submission with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        type: "contact",
        nom: "Test",
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        type: "contact",
        nom: "",
        email: "test@example.com",
      })
    ).rejects.toThrow();
  });

  it("accepts distributeur type submission", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      type: "distributeur",
      nom: "Pierre Durand",
      email: "pierre@company.com",
      entreprise: "Event Pro SARL",
      message: "Nous souhaitons devenir distributeur.",
    });

    expect(result.success).toBe(true);
  });
});
