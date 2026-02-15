import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

vi.mock("./crmSync", () => ({
  syncSubmissionToCrm: vi.fn().mockResolvedValue({ success: false, error: "not configured" }),
  isCrmSyncConfigured: vi.fn().mockReturnValue(false),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAnonContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("profile.mySubmissions", () => {
  it("returns an array for authenticated user", async () => {
    const ctx = createAuthContext(999);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.mySubmissions();
    expect(Array.isArray(result)).toBe(true);
  });

  it("throws UNAUTHORIZED for anonymous user", async () => {
    const ctx = createAnonContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.mySubmissions()).rejects.toThrow();
  });
});

describe("profile.cancelSubmission", () => {
  it("throws UNAUTHORIZED for anonymous user", async () => {
    const ctx = createAnonContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.profile.cancelSubmission({ submissionId: 1 })
    ).rejects.toThrow();
  });
});

describe("contact.submit", () => {
  it("validates required fields", async () => {
    const ctx = createAnonContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        type: "devis",
        nom: "",
        email: "invalid",
      })
    ).rejects.toThrow();
  });

  it("accepts valid devis submission", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      type: "devis",
      nom: "Jean Dupont",
      email: "jean@example.com",
      telephone: "0612345678",
      entreprise: "Test Corp",
      produit: "Écran gonflable 8m",
      objectif: "achat",
    });

    expect(result.success).toBe(true);
  });
});
