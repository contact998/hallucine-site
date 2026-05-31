import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  // DEV UNIQUEMENT — admin local sans login Google (jamais en prod : le build
  // prod fixe NODE_ENV="production"). Pour prévisualiser l'admin sur localhost
  // sans déployer. À NE PAS committer/pousser.
  if (!user && process.env.NODE_ENV !== "production") {
    user = { id: 0, email: "dev@local", role: "admin", name: "Dev Admin" } as unknown as User;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
