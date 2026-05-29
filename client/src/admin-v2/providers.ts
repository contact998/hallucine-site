/**
 * Providers Refine pour le back-office Hallucine.
 *
 * - dataProvider : GÉNÉRIQUE. Mappe les méthodes Refine vers la convention tRPC
 *   `trpc[resource].{list,byId,create,update,deleteOne}`. Aucune logique spécifique
 *   média ici — le blog (et la suite) réutilisent ce même provider tel quel.
 * - authProvider : s'appuie sur l'auth Google existante (`auth.me`).
 * - notificationProvider : branché sur sonner (erreurs/succès visibles).
 */
import type { DataProvider, AuthProvider, NotificationProvider } from "@refinedev/core";
import { toast } from "sonner";
import { trpcVanilla } from "./trpcVanilla";
import { getLoginUrl } from "../const";

// Accès dynamique à une ressource du client tRPC (typage volontairement souple :
// la convention garantit la même forme pour toutes les ressources).
const res = (resource: string) => (trpcVanilla as any)[resource];

export const dataProvider: DataProvider = {
  getApiUrl: () => "/api/trpc",

  getList: async ({ resource, pagination, sorters, filters }) => {
    const page    = pagination?.current ?? 1;
    const perPage = pagination?.pageSize ?? 24;

    const sort = (sorters ?? []).map((s) => ({ field: s.field, order: s.order }));

    // On ne garde que les filtres logiques {field, operator, value}. Les valeurs
    // null sont CONSERVÉES (ex: page=null = « à ranger »).
    const f = (filters ?? [])
      .filter((x: any) => "field" in x)
      .map((x: any) => ({ field: x.field, operator: x.operator ?? "eq", value: x.value }));

    const { data, total } = await res(resource).list.query({
      pagination: { page, perPage },
      ...(sort.length ? { sort } : {}),
      ...(f.length ? { filters: f } : {}),
    });
    return { data, total };
  },

  getOne: async ({ resource, id }) => {
    const data = await res(resource).byId.query({ id: Number(id) });
    return { data };
  },

  create: async ({ resource, variables }) => {
    const data = await res(resource).create.mutate({ data: variables });
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const data = await res(resource).update.mutate({ id: Number(id), data: variables });
    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    const data = await res(resource).deleteOne.mutate({ id: Number(id) });
    return { data };
  },
};

export const authProvider: AuthProvider = {
  check: async () => {
    try {
      const user = await trpcVanilla.auth.me.query();
      if (user && (user as any).role === "admin") return { authenticated: true };
    } catch { /* non connecté */ }
    return { authenticated: false, redirectTo: getLoginUrl(), logout: true };
  },
  login:  async () => ({ success: true }),
  logout: async () => ({ success: true, redirectTo: getLoginUrl() }),
  onError: async () => ({}),
  getIdentity: async () => {
    try {
      const user = await trpcVanilla.auth.me.query();
      if (!user) return null;
      return { id: (user as any).id, name: (user as any).name, email: (user as any).email };
    } catch { return null; }
  },
};

export const notificationProvider: NotificationProvider = {
  open: ({ type, message, description, key }) => {
    const text = description ? `${message} — ${description}` : message;
    if (type === "success") toast.success(text, { id: key });
    else if (type === "error") toast.error(text, { id: key });
    else toast(text, { id: key });
  },
  close: (key) => { if (key) toast.dismiss(key); },
};
