/**
 * entry-server.tsx — Entrypoint SSR dédié
 *
 * ✅ N'importe JAMAIS i18n/config.ts (qui utilise import.meta.glob — Vite-only)
 * ✅ Instance i18n créée par render() pour éviter les race conditions entre langues
 * ✅ Utilisé uniquement par scripts/prerender.mjs
 *
 * Architecture :
 *   render(url, lang) → createInstance() → init(bundledResources, lang)
 *   → renderToString(<I18nextProvider><Router><Page /></Router></I18nextProvider>)
 */
import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./lib/trpc.ts";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

// Ressources locales chargées via fs.readFileSync (Node-only, pas import.meta.glob)
import { bundledResources } from "./i18n/locales-bundled.node.ts";

// Import direct des pages publiques (pas App.tsx qui importe config.ts → locales-bundled.ts)
import Home from "./pages/Home.tsx";
import Ecrans from "./pages/Ecrans.tsx";
import EcranGeant from "./pages/EcranGeant.tsx";
import EcranEtanche from "./pages/EcranEtanche.tsx";
import EcranEconomique from "./pages/EcranEconomique.tsx";
import Comparaison from "./pages/Comparaison.tsx";
import EcransLED from "./pages/EcransLED.tsx";
import Tentes from "./pages/Tentes.tsx";
import TentesX from "./pages/TentesX.tsx";
import TentesN from "./pages/TentesN.tsx";
import TentesV from "./pages/TentesV.tsx";
import TentesAraignees from "./pages/TentesAraignees.tsx";
import ArchesGonflables from "./pages/ArchesGonflables.tsx";
import Mobilier from "./pages/Mobilier.tsx";
import Accessoires from "./pages/Accessoires.tsx";
import Galerie from "./pages/Galerie.tsx";
import GalerieVideo from "./pages/GalerieVideo.tsx";
import Contact from "./pages/Contact.tsx";
import APropos from "./pages/APropos.tsx";
import Histoire from "./pages/Histoire.tsx";
import Blog from "./pages/Blog.tsx";
import ModeEmploi from "./pages/ModeEmploi.tsx";
import DevenirDistributeur from "./pages/DevenirDistributeur.tsx";
import TrouverDistributeur from "./pages/TrouverDistributeur.tsx";
import MentionsLegales from "./pages/MentionsLegales.tsx";
import Confidentialite from "./pages/Confidentialite.tsx";
import PolitiqueCookies from "./pages/PolitiqueCookies.tsx";

import { ROUTES } from "./i18n/routes.ts";
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
  "ecrans-led", "ecrans", "tentes", "tente-x", "tente-n", "tente-v",
  "tente-araignee", "arches-gonflables", "mobilier", "accessoires",
  "a-propos", "mode-emploi", "mentions-legales", "devenir-distributeur",
  "trouver-distributeur", "galerie", "galerie-video", "politique-cookies",
  "confidentialite", "blog", "histoire", "not-found"
];

// Préparer les ressources i18n une seule fois (lecture disque)
const resources: Resource = {};
for (const lang of VALID_LANGS) {
  resources[lang] = (bundledResources[lang] as Resource[string]) ?? {};
}

/**
 * Mapping routeKey → composant React
 */
const PAGE_MAP: Record<string, React.ComponentType> = {
  home: Home,
  ecrans: Ecrans,
  "ecran-geant": EcranGeant,
  "ecran-etanche": EcranEtanche,
  "ecran-economique": EcranEconomique,
  comparaison: Comparaison,
  "ecrans-led": EcransLED,
  tentes: Tentes,
  "tente-x": TentesX,
  "tente-n": TentesN,
  "tente-v": TentesV,
  "tente-araignee": TentesAraignees,
  arches: ArchesGonflables,
  mobilier: Mobilier,
  accessoires: Accessoires,
  galerie: Galerie,
  "galerie-video": GalerieVideo,
  contact: Contact,
  "a-propos": APropos,
  histoire: Histoire,
  blog: Blog,
  "mode-emploi": ModeEmploi,
  "devenir-distributeur": DevenirDistributeur,
  "trouver-distributeur": TrouverDistributeur,
  "mentions-legales": MentionsLegales,
  confidentialite: Confidentialite,
  cookies: PolitiqueCookies,
};

/**
 * Trouve le composant de page correspondant à une URL dans une langue donnée
 */
function getPageComponent(url: string, lang: string): React.ComponentType {
  const langRoutes = ROUTES[lang] ?? ROUTES["fr"];
  const entry = Object.entries(langRoutes).find(([, routeUrl]) => routeUrl === url);
  if (entry) {
    const [routeKey] = entry;
    return PAGE_MAP[routeKey] ?? Home;
  }
  console.warn(`  SSR route: [${lang}] ${url} → NOT FOUND, fallback Home`);
  return Home;
}

/**
 * Rend une page en HTML statique pour une URL et une langue données
 *
 * @param url - URL de la page (ex: "/ecran-gonflable")
 * @param lang - Code langue (ex: "fr", "en", "de", "es", "it")
 * @returns HTML statique + metas collectées pendant le rendu
 */
export async function render(url: string, lang: string): Promise<{ html: string; meta: SSRMeta }> {
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

  // Mettre à jour window.location.pathname pour les composants qui l'utilisent
  if (typeof window !== "undefined") {
    (window.location as unknown as Record<string, unknown>).pathname = url;
    (window.location as unknown as Record<string, unknown>).href = `http://localhost:3000${url}`;
  }

  // Contexte SSR pour collecter les metas pendant renderToString
  const ssrMeta: SSRMeta = {
    title: "Hallucine — Écrans de Cinéma Gonflables | Fabricant depuis 1992",
    description: "Hallucine, fabricant français d'écrans de cinéma gonflables depuis 1992. Écrans géants, tentes gonflables, arches, mobilier événementiel. Livraison mondiale.",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vajzfoYsbBMsDfIq.webp",
    url: `https://hallucinecran.fr${url}`,
    locked: false,
    setMeta(data) {
      if (data.title) this.title = data.title;
      if (data.description) this.description = data.description;
      if (data.image) this.image = data.image;
      if (data.url) this.url = data.url;
    },
  };

  const Page = getPageComponent(url, lang);

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

  const html = renderToString(
    <I18nextProvider i18n={i18n}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <SSRMetaContext.Provider value={ssrMeta}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Router hook={ssrLocationHook as any}>
              <Page />
            </Router>
          </SSRMetaContext.Provider>
        </QueryClientProvider>
      </trpc.Provider>
    </I18nextProvider>
  );

  return { html, meta: ssrMeta };
}
