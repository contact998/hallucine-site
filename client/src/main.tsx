import { trpc } from "@/lib/trpc";
import "./i18n/config"; // Initialisation i18n — doit être importé avant App
import { i18n } from "./i18n/instance"; // Instance partagée (initialisée par config.ts ci-dessus)
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, retryLink, TRPCClientError } from "@trpc/client";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Router as WouterRouter } from "wouter";
import superjson from "superjson";
import App from "./App";
import { preloadCurrentPage } from "./pages/registry";
import { SSRMetaContext } from "./context/SSRMetaContext";
import { getLoginUrl, initLoginUrl } from "./const";
import "./index.css";

// Pré-charger la config OAuth depuis /api/config au démarrage
initLoginUrl();

/**
 * Détecte si une erreur tRPC est causée par une réponse HTML (502/503 du proxy)
 * au lieu d'une réponse JSON valide. Cela arrive quand le serveur redémarre
 * ou que le proxy Manus a un souci réseau transitoire.
 */
function isTransientProxyError(error: unknown): boolean {
  if (!(error instanceof TRPCClientError)) return false;
  const msg = error.message ?? "";
  // Réponse HTML au lieu de JSON (proxy renvoie une page d'erreur)
  if (msg.includes("is not valid JSON") || msg.includes("Unexpected token '<'")) return true;
  // Erreurs réseau classiques
  if (msg.includes("fetch failed") || msg.includes("Failed to fetch") || msg.includes("NetworkError")) return true;
  return false;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // React Query retry : 2 tentatives supplémentaires pour les erreurs transitoires
      retry: (failureCount, error) => {
        if (failureCount >= 3) return false;
        return isTransientProxyError(error);
      },
      retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 5000),
    },
    mutations: {
      // Les mutations aussi peuvent être retentées sur erreur proxy
      retry: (failureCount, error) => {
        if (failureCount >= 2) return false;
        return isTransientProxyError(error);
      },
      retryDelay: 1500,
    },
  },
});

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    // Ne pas logger les erreurs transitoires proxy (elles seront retentées)
    if (!isTransientProxyError(error)) {
      console.error("[API Query Error]", error);
    }
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    if (!isTransientProxyError(error)) {
      console.error("[API Mutation Error]", error);
    }
  }
});

const trpcClient = trpc.createClient({
  links: [
    // Retry au niveau tRPC : relance les requêtes sur erreur transitoire
    retryLink({
      retry(opts) {
        // Ne pas retenter les erreurs d'auth
        if (opts.error.message === UNAUTHED_ERR_MSG) return false;
        // Retenter jusqu'à 3 fois sur erreur proxy/réseau
        if (opts.attempts > 3) return false;
        return isTransientProxyError(opts.error);
      },
    }),
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

// Précharge le chunk de la page courante PUIS hydrate le HTML pré-rendu.
// Sans ce préchargement, la page (lazy) suspendrait pendant l'hydratation
// → React afficherait le spinner ≠ HTML serveur → pré-rendu jeté (flash).
preloadCurrentPage().finally(() => {
  // ✅ Arbre client strictement identique à l'arbre SSR (entry-server.tsx).
  // Mêmes providers, même ordre, même <WouterRouter> wrapper, même
  // <SSRMetaContext.Provider> (avec value=null côté client puisque les
  // metas ne sont collectées qu'en SSR).
  hydrateRoot(
    document.getElementById("root")!,
    <I18nextProvider i18n={i18n}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <SSRMetaContext.Provider value={null}>
            <WouterRouter>
              <App />
            </WouterRouter>
          </SSRMetaContext.Provider>
        </QueryClientProvider>
      </trpc.Provider>
    </I18nextProvider>
  );
});
