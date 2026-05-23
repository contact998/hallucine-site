/**
 * entry-server.tsx — Entrypoint SSR dédié
 *
 * ✅ Rend EXACTEMENT le même arbre React que le client (<App />)
 *    → hydratation sans mismatch (plus de "updateSuspenseComponent" warning)
 * ✅ Préchargement de toutes les pages via preloadAllPages() → les lazyPage
 *    rendent en synchrone pendant renderToString (qui est synchrone)
 * ✅ N'importe JAMAIS i18n/config.ts (qui utilise import.meta.glob — Vite-only)
 * ✅ Instance i18n créée par render() pour éviter les race conditions entre langues
 * ✅ Utilisé uniquement par scripts/prerender.mjs
 */
import { renderToString } from "react-dom/server";
import { Router as WouterRouter } from "wouter";
import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./lib/trpc.ts";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

// Ressources locales chargées via fs.readFileSync (Node-only, pas import.meta.glob)
import { bundledResources } from "./i18n/locales-bundled.node.ts";

import App from "./App.tsx";
import { preloadAllPages } from "./pages/registry.ts";
import { SSRMetaContext, type SSRMeta } from "./context/SSRMetaContext.ts";
import type { Resource } from "i18next";

// Simuler window pour les composants qui en ont besoin
// (tous les usages réels sont dans useEffect ou handlers, donc ignorés en SSR)
if (typeof window === "undefined") {
  (globalThis as unknown as Record<string, unknown>).window = {
    location: {
      origin: "http://localhost:3000",
      hostname: "localhost",
      pathname: "/",
      search: "",
      href: "http://localhost:3000/",
    },
    history: { replaceState: () => {} },
  };
}

// Simuler import.meta.env pour les composants qui l'utilisent (const.ts, etc.)
if (!(import.meta as unknown as Record<string, unknown>).env) {
  (import.meta as unknown as Record<string, unknown>).env = {
    VITE_OAUTH_PORTAL_URL: "",
    VITE_APP_ID: "",
    VITE_APP_TITLE: "Hallucine",
    VITE_APP_LOGO: "",
  };
}

const VALID_LANGS = ["fr", "en", "de", "es", "it"] as const;

const NS = [
  "common", "home", "products", "contact", "legal", "nav",
  "ecran-geant", "ecran-etanche", "ecran-economique", "comparaison",
  "configurateur", "drive-in", "packs", "location", "etudes-cas", "ecrans-led", "ecrans", "tentes", "tente-x", "tente-n", "tente-v",
  "tente-araignee", "arches-gonflables", "mobilier", "accessoires",
  "a-propos", "mode-emploi", "mentions-legales", "devenir-distributeur",
  "galerie", "galerie-video", "politique-cookies",
  "confidentialite", "blog", "histoire", "not-found"
];

// Préparer les ressources i18n une seule fois (lecture disque)
const resources: Resource = {};
for (const lang of VALID_LANGS) {
  resources[lang] = (bundledResources[lang] as Resource[string]) ?? {};
}

// Précharge tous les modules de pages → les lazyPage de <App /> rendent en
// synchrone pendant renderToString. Idempotent : seul le 1er await prend du
// temps, les suivants sont des no-ops (promesses déjà résolues).
let pagesPreloaded: Promise<void> | null = null;
function ensurePagesPreloaded(): Promise<void> {
  if (!pagesPreloaded) pagesPreloaded = preloadAllPages();
  return pagesPreloaded;
}

/**
 * Rend une page en HTML statique pour une URL et une langue données
 *
 * @param url - URL de la page (ex: "/ecran-gonflable")
 * @param lang - Code langue (ex: "fr", "en", "de", "es", "it")
 * @param mediaCache - Images bakées depuis la DB (clé "categorie|souscategorie")
 * @returns HTML statique + metas collectées pendant le rendu
 */
export async function render(
  url: string,
  lang: string,
  mediaCache?: Record<string, unknown>
): Promise<{ html: string; meta: SSRMeta }> {
  // S'assurer que tous les modules de pages sont chargés avant le 1er render
  await ensurePagesPreloaded();

  // Images bakées au build → lues par useProductImages/useMediaByCategory
  // pour que le HTML pré-rendu contienne directement les vraies images.
  if (mediaCache) {
    (globalThis as unknown as Record<string, unknown>).__SSR_MEDIA__ = mediaCache;
  }

  // ✅ Instance i18n créée par render() — pas de race conditions entre langues
  const i18n = createInstance();
  await i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: "fr",
    supportedLngs: [...VALID_LANGS],
    ns: NS,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    react: { useSuspense: false }, // false en SSR pour éviter les Suspense boundaries
  });

  // Mettre à jour window.location.pathname + injecter __INITIAL_LOCALE__
  // pour que detectLanguage() (utilisé dans App.tsx) retourne la bonne langue
  if (typeof window !== "undefined") {
    (window.location as unknown as Record<string, unknown>).pathname = url;
    (window.location as unknown as Record<string, unknown>).href = `http://localhost:3000${url}`;
    (window as unknown as Record<string, unknown>).__INITIAL_LOCALE__ = lang;
  }

  // Contexte SSR pour collecter les metas pendant renderToString
  const ssrMeta: SSRMeta = {
    title: "Hallucine — Écrans de Cinéma Gonflables | Fabricant depuis 1992",
    description: "Hallucine, fabricant français d'écrans de cinéma gonflables depuis 1992. Écrans géants, tentes gonflables, arches, mobilier événementiel. Livraison mondiale.",
    image: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/vajzfoYsbBMsDfIq.webp",
    url: `https://hallucinecran.fr${url}`,
    locked: false,
    setMeta(data) {
      if (data.title) this.title = data.title;
      if (data.description) this.description = data.description;
      if (data.image) this.image = data.image;
      if (data.url) this.url = data.url;
    },
  };

  // Hook wouter SSR : retourne directement [url, noop] sans useSyncExternalStore
  // (useSyncExternalStore de wouter/memory-location n'a pas de getServerSnapshot)
  const ssrLocationHook = () => [url, () => {}] as [string, () => void];

  // Provider tRPC minimal (requis par useAuth dans Navbar)
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, enabled: false } },
  });
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/api/trpc",
        transformer: superjson,
      }),
    ],
  });

  // ✅ Arbre SSR strictement identique à l'arbre client.
  // Les widgets client-only (Toaster, WhatsApp, HallucineChatbot) sont gated
  // par `mounted` dans App.tsx → false en SSR ET au 1er rendu client (avant
  // hydratation), donc invisibles des deux côtés. Le Switch fait le matching
  // d'URL via le hook ssrLocationHook → la bonne page est rendue.
  const html = renderToString(
    <I18nextProvider i18n={i18n}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <SSRMetaContext.Provider value={ssrMeta}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <WouterRouter hook={ssrLocationHook as any}>
              <App />
            </WouterRouter>
          </SSRMetaContext.Provider>
        </QueryClientProvider>
      </trpc.Provider>
    </I18nextProvider>
  );

  return { html, meta: ssrMeta };
}
