import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAdminContext() {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@hallucine.fr",
      name: "Admin Hallucine",
      loginMethod: "manus",
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  } satisfies TrpcContext;
}

function createUserContext() {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  } satisfies TrpcContext;
}

function createAnonContext() {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  } satisfies TrpcContext;
}

describe("admin routes - access control", () => {
  it("rejects unauthenticated users from admin.allSubmissions", async () => {
    const caller = appRouter.createCaller(createAnonContext());
    await expect(caller.admin.allSubmissions()).rejects.toThrow();
  });

  it("rejects regular users from admin.allSubmissions", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.allSubmissions()).rejects.toThrow();
  });

  it("rejects unauthenticated users from admin.stats", async () => {
    const caller = appRouter.createCaller(createAnonContext());
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("rejects regular users from admin.stats", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("rejects regular users from admin.updateStatus", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.admin.updateStatus({ submissionId: 1, status: "en_cours" })
    ).rejects.toThrow();
  });

  it("rejects regular users from admin.updateNote", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.admin.updateNote({ submissionId: 1, note: "test" })
    ).rejects.toThrow();
  });

  it("rejects regular users from admin.deleteSubmission", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.admin.deleteSubmission({ submissionId: 1 })
    ).rejects.toThrow();
  });
});

describe("admin routes - input validation", () => {
  it("validates status enum in updateStatus", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.admin.updateStatus({ submissionId: 1, status: "invalid_status" as any })
    ).rejects.toThrow();
  });

  it("requires submissionId in deleteSubmission", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.admin.deleteSubmission({ submissionId: undefined as any })
    ).rejects.toThrow();
  });
});
