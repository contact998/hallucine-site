/**
 * entry-server.tsx — Entrypoint SSR dédié
 *
 * ✅ Rend EXACTEMENT le même arbre React que le client (<App />)
 *    → hydratation sans mismatch (plus de "updateSuspenseComponent" warning)
 * ✅ Préchargement de toutes les pages via preloadAllPages() → les lazyPage
 *    rendent en synchrone pendant renderToPipeableStream (qui est synchrone)
 * ✅ N'importe JAMAIS i18n/config.ts (qui utilise import.meta.glob — Vite-only)
 * ✅ Instance i18n créée par render() pour éviter les race conditions entre langues
 * ✅ Utilisé uniquement par scripts/prerender.mjs
 */
import { renderToPipeableStream } from "react-dom/server";
import { Writable } from "node:stream";
import { Router as WouterRouter } from "wouter";
import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Window } from "happy-dom";
import { trpc } from "./lib/trpc.ts";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

// Ressources locales chargées via fs.readFileSync (Node-only, pas import.meta.glob)
import { bundledResources } from "./i18n/locales-bundled.node.ts";

import App from "./App.tsx";
import { preloadAllPages } from "./pages/registry.ts";
import { SSRMetaContext, type SSRMeta } from "./context/SSRMetaContext.ts";
import type { Resource } from "i18next";

// ─── Environnement DOM SSR via happy-dom ────────────────────────────────────
// Vrai Window/Document conformes au standard WHATWG. Remplace le stub manuel
// no-op qui devait être étendu à chaque nouvelle lib (framer-motion, radix...).
// happy-dom : ~250 ko, utilisé par Vitest, parfait pour SSR/SSG sans framework.
if (typeof window === "undefined") {
  const happyWindow = new Window({ url: "http://localhost:3000/" });
  // Cast `unknown` puis assignation : happy-dom expose une API très proche du
  // DOM standard mais n'est pas typée identique à `globalThis.Window`.
  // Définir les globaux DOM avec defineProperty pour ne pas se faire bloquer
  // par les getters readonly de Node (ex: globalThis.navigator).
  const defineGlobal = (name: string, value: unknown) => {
    try {
      Object.defineProperty(globalThis, name, { value, writable: true, configurable: true });
    } catch {
      // Si la propriété n'est ni writable ni configurable, on tente
      // l'assignation directe — silencieusement ignorée si bloquée.
      try { (globalThis as unknown as Record<string, unknown>)[name] = value; } catch { /* ignore */ }
    }
  };
  defineGlobal("window", happyWindow);
  defineGlobal("document", happyWindow.document);
  defineGlobal("navigator", happyWindow.navigator);
  defineGlobal("HTMLElement", happyWindow.HTMLElement);
  defineGlobal("Element", happyWindow.Element);
  defineGlobal("Node", happyWindow.Node);
  defineGlobal("getComputedStyle", happyWindow.getComputedStyle.bind(happyWindow));
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

const VALID_LANGS = ["fr", "en", "de", "es", "it", "pt"] as const;

const NS = [
  "common", "home", "products", "contact", "legal", "nav",
  "ecran-geant", "ecran-etanche", "ecran-economique", "comparaison",
  "configurateur", "taille", "securite", "drive-in", "packs", "cinema-plein-air", "prix", "mairie", "hotel", "evenement", "location", "etudes-cas", "cas-velodrome", "cas-oran", "ecrans-led", "ecrans", "tentes", "tente-x", "tente-n", "tente-v",
  "tente-araignee", "arches-gonflables", "mobilier", "accessoires",
  "a-propos", "mode-emploi", "mentions-legales", "devenir-distributeur",
  "galerie", "galerie-video", "politique-cookies",
  "confidentialite", "blog", "histoire", "not-found", "smartform"
];

// Préparer les ressources i18n une seule fois (lecture disque)
const resources: Resource = {};
for (const lang of VALID_LANGS) {
  resources[lang] = (bundledResources[lang] as Resource[string]) ?? {};
}

// Précharge tous les modules de pages → les lazyPage de <App /> rendent en
// synchrone pendant renderToPipeableStream. Idempotent : seul le 1er await prend du
// temps, les suivants sont des no-ops (promesses déjà résolues).
let pagesPreloaded: Promise<void> | null = null;
function ensurePagesPreloaded(): Promise<void> {
  if (!pagesPreloaded) pagesPreloaded = preloadAllPages();
  return pagesPreloaded;
}

/**
 * Données pré-chargées injectables avant le rendu SSR.
 * Pour les routes dont le contenu vient de la DB (ex: /blog/:slug), le
 * serveur fetch les données puis les passe à render() qui pré-popule
 * le cache React Query → le composant rend en synchrone avec les données.
 */
export interface SSRInitialData {
  blogPost?: { slug: string; data: unknown };
  /** Liste d'articles pré-chargée pour la page /blog → pré-peuple trpc.blog.list
   *  pour que la liste (et ses liens vers les articles) soit rendue en SSR. */
  blogList?: { lang: string; limit: number; data: unknown };
}

/**
 * Rend une page en HTML statique pour une URL et une langue données
 *
 * @param url - URL de la page (ex: "/ecran-gonflable")
 * @param lang - Code langue (ex: "fr", "en", "de", "es", "it", "pt")
 * @param mediaCache - Images bakées depuis la DB (clé "categorie|souscategorie")
 * @param initialData - Données pré-chargées (ex: article de blog par slug)
 * @returns HTML statique + metas collectées pendant le rendu
 */
export async function render(
  url: string,
  lang: string,
  mediaCache?: Record<string, unknown>,
  initialData?: SSRInitialData
): Promise<{ html: string; meta: SSRMeta }> {
  // S'assurer que tous les modules de pages sont chargés avant le 1er render
  await ensurePagesPreloaded();

  // ─── Sauvegarde des globaux (réentrance) ─────────────────────────────────
  // render() est appelé séquentiellement par scripts/prerender.mjs, mais
  // on capture les valeurs précédentes pour les restaurer en `finally`
  // → safe si render() est appelé en parallèle ou re-entré accidentellement.
  const g = globalThis as unknown as Record<string, unknown>;
  const w = window as unknown as Record<string, unknown> | undefined;
  const wLoc = w?.location as Record<string, unknown> | undefined;
  const prev = {
    ssrMedia: g.__SSR_MEDIA__,
    pathname: wLoc?.pathname,
    href: wLoc?.href,
    initialLocale: w?.__INITIAL_LOCALE__,
  };

  // Images bakées au build → lues par useProductImages/useMediaByCategory
  if (mediaCache) g.__SSR_MEDIA__ = mediaCache;

  // ✅ Instance i18n locale (pas de race conditions entre langues)
  const i18n = createInstance();
  await i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: "fr",
    supportedLngs: [...VALID_LANGS],
    ns: NS,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    react: { useSuspense: false }, // identique au client
  });

  // window.location + __INITIAL_LOCALE__ pour que detectLanguage() (App.tsx)
  // retourne la bonne langue côté SSR
  if (wLoc) {
    wLoc.pathname = url;
    wLoc.href = `http://localhost:3000${url}`;
  }
  if (w) w.__INITIAL_LOCALE__ = lang;

  // Contexte SSR pour collecter les metas pendant renderToPipeableStream
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

  // Pré-population du cache React Query pour les routes dynamiques.
  // BlogPost.tsx fait `trpc.blog.bySlug.useQuery({ slug })` → la clé tRPC est
  // [['blog', 'bySlug'], { input: { slug }, type: 'query' }]. En pré-injectant
  // les données ici, le `useQuery` côté SSR retourne immédiatement le post →
  // le contenu de l'article est rendu dans le HTML (Google le voit).
  if (initialData?.blogPost) {
    queryClient.setQueryData(
      [["blog", "bySlug"], { input: { slug: initialData.blogPost.slug }, type: "query" }],
      initialData.blogPost.data,
    );
  }
  // Idem pour la page liste /blog : la clé tRPC doit correspondre EXACTEMENT à
  // l'appel client `trpc.blog.list.useQuery({ lang, limit })` (sans offset).
  if (initialData?.blogList) {
    queryClient.setQueryData(
      [["blog", "list"], { input: { lang: initialData.blogList.lang, limit: initialData.blogList.limit }, type: "query" }],
      initialData.blogList.data,
    );
  }

  // ✅ Arbre SSR strictement identique à l'arbre client.
  // Les widgets client-only (Toaster, WhatsApp) sont gated
  // par `mounted` dans App.tsx → false en SSR ET au 1er rendu client (avant
  // hydratation), donc invisibles des deux côtés. Le Switch fait le matching
  // d'URL via le hook ssrLocationHook → la bonne page est rendue.
  const tree = (
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

  try {
    // ✅ renderToPipeableStream (recommandé React 19) au lieu de renderToString.
    // On bufferise le flux dans une chaîne pour l'écrire sur disque (SSG).
    let html: string = await new Promise<string>((resolve, reject) => {
      let buf = "";
      const sink = new Writable({
        write(chunk, _encoding, cb) {
          buf += chunk.toString("utf-8");
          cb();
        },
      });
      sink.on("finish", () => resolve(buf));
      sink.on("error", reject);

      const { pipe } = renderToPipeableStream(tree, {
        onAllReady() { pipe(sink); },
        onShellError: reject,
        onError(err) { reject(err instanceof Error ? err : new Error(String(err))); },
      });
    });

    // Exposer les données SSR pour que le client puisse hydrater avec les
    // mêmes données (sinon refetch → tree différent → mismatch). Le
    // template (cf. prerender.mjs injectIntoTemplate) insère ce HTML dans
    // le <head> du template, pas dans `html` (qui est juste le body React).
    if (initialData?.blogPost || initialData?.blogList) {
      const json = JSON.stringify(initialData).replace(/</g, "\\u003c");
      ssrMeta.headExtra = `<script>window.__SSR_INITIAL_DATA__=${json}</script>`;
    }

    return { html, meta: ssrMeta };
  } finally {
    // Restaurer les globaux modifiés pour la réentrance/parallélisme
    if (prev.ssrMedia === undefined) delete g.__SSR_MEDIA__;
    else g.__SSR_MEDIA__ = prev.ssrMedia;
    if (wLoc) {
      if (prev.pathname !== undefined) wLoc.pathname = prev.pathname;
      if (prev.href !== undefined) wLoc.href = prev.href;
    }
    if (w) {
      if (prev.initialLocale === undefined) delete w.__INITIAL_LOCALE__;
      else w.__INITIAL_LOCALE__ = prev.initialLocale;
    }
  }
}
