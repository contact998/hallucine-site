# Architecture hallucine-site

Site statique multi-langues construit sans framework (pas de Next.js / Remix).
Cette doc explique les choix structurels et les pièges à connaître.

## Stack

- **React 19** + **Vite** + **TypeScript**
- **wouter** pour le routing client (lightweight, ~1.5 Ko)
- **react-i18next** pour l'i18n (5 langues × 1 fichier par namespace)
- **TanStack Query** + **tRPC** pour les appels API au backend Express
- **framer-motion** pour les animations
- **Tailwind CSS v4** (utilise `oklch()` partout)

## Pipeline de rendu

```
build  →  Vite SSR + scripts/prerender.mjs  →  dist/public/{route}/index.html
                                                     ↓
runtime  →  Express + Cloudflare  →  HTML statique  →  Browser
                                                          ↓
                                            React hydrate (main.tsx)
```

### Côté build (`scripts/prerender.mjs`)

1. Charge `client/src/entry-server.tsx` (lui-même importe `client/src/App.tsx`)
2. Pour chaque route × langue : appelle `render(url, lang)` → `renderToString(<App />)`
3. Écrit le HTML dans `dist/public/{langPrefix}/{url}/index.html`

### Côté runtime (Express + serveStatic)

1. Détermine la langue via le domaine (`hallucinecran.fr` → fr, `.com` → en, etc.)
2. Cherche `dist/public/{langPrefix}/{url}/index.html`
3. Sert le HTML statique → hydratation client par `main.tsx`

### Côté client (`client/src/main.tsx`)

1. Précharge le chunk JS de la page courante (`preloadCurrentPage`)
2. `hydrateRoot` avec **exactement le même arbre** que le SSR (cf. règle d'or)

## La règle d'or : SSR ≡ client

**Le SSR doit rendre EXACTEMENT le même arbre React que `hydrateRoot`.** Pas
seulement le même rendu visuel — la même structure Fiber, mêmes providers
dans le même ordre, mêmes Suspense boundaries, mêmes wrappers.

Concrètement, les deux entrées doivent assembler le même arbre :

```tsx
<I18nextProvider i18n={i18n}>
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <SSRMetaContext.Provider value={ssrMeta /* null côté client */}>
        <WouterRouter hook={ssrLocationHook /* absent côté client */}>
          <App />
        </WouterRouter>
      </SSRMetaContext.Provider>
    </QueryClientProvider>
  </trpc.Provider>
</I18nextProvider>
```

Si tu ajoutes un nouveau provider, il DOIT apparaître au même endroit dans
`entry-server.tsx` et `main.tsx`. Sinon → hydration mismatch garanti.

## Pages lazy-loadées (`client/src/pages/registry.ts`)

Chaque page est wrappée dans `lazyPage(() => import("./X"))` pour le code
splitting client. Le wrapper expose `.preload()` qui charge le chunk.

- **Côté client** : `preloadCurrentPage()` charge le chunk de la page
  courante AVANT `hydrateRoot` → rendu synchrone, pas de flash.
- **Côté SSR** : `preloadAllPages()` charge TOUS les chunks AVANT le 1er
  `render()` → les `lazyPage` rendent en synchrone (`renderToString` ne
  supporte pas Suspense, donc on doit éviter toute suspension).

**Piège** : `preloadAllPages` doit appeler `Page.preload()`, PAS `factory()`
directement. Le `factory()` télécharge le chunk mais n'assigne pas le
`mod` interne au wrapper `lazyPage` → le composant continue de suspendre.

## Mock DOM en SSR (`entry-server.tsx`)

renderToString s'exécute dans Node, sans DOM. Certaines libs (framer-motion,
radix-ui) accèdent à `window`/`document` au moment du rendu. On stub donc :

```ts
globalThis.window = { addEventListener, removeEventListener, matchMedia,
  innerWidth, requestAnimationFrame, localStorage, document: {...}, ... };
globalThis.document = window.document;
```

**Tout est no-op** — les vrais effets sont dans `useEffect` qui ne tourne
qu'au client. Le mock évite juste les `TypeError` pendant `renderToString`.

Si une nouvelle lib échoue en SSR avec `X is not a function`, ajouter le
stub correspondant dans `entry-server.tsx`.

**Alternative future** : `happy-dom` ou `jsdom` fournissent un vrai
environnement DOM. Plus complet mais introduit du risque (les libs
exécutent vraiment leur code au lieu de no-op).

## Collecte des metas SEO (`useDocumentMeta` + `SSRMetaContext`)

Pattern « first-write-wins » :

1. En SSR, `entry-server.tsx` crée un objet `ssrMeta` avec un flag `locked`
2. Le composant de page appelle `useDocumentMeta(title, desc, image)` en
   premier (par convention, en haut du composant)
3. Le hook mute `ssrMeta` (set title/desc/image puis `locked = true`)
4. Les enfants peuvent aussi appeler le hook → ignoré car `locked = true`
5. Après `renderToString`, `prerender.mjs` lit `ssrMeta` pour injecter
   `<title>`, `<meta description>`, `og:*` dans le template HTML

C'est de la mutation pendant le rendu — impur en théorie, mais safe ici
car `renderToString` est synchrone et mono-passe (pas de strict mode,
pas de concurrent rendering). C'est le même pattern que `react-helmet`.

## Détection de langue (`detectLanguage` dans `i18n/domains.ts`)

Ordre de priorité :

1. `?lang=xx` dans l'URL (dev only, pour tester sans changer de domaine)
2. `window.__INITIAL_LOCALE__` (injecté par le serveur en SSR, lu au client)
3. `window.location.hostname` → `DOMAIN_LANG_MAP` (`.fr` → fr, etc.)
4. Fallback : `"fr"`

En SSR, `entry-server.tsx` injecte `window.__INITIAL_LOCALE__ = lang` AVANT
`renderToString` pour garantir que le composant utilise la bonne langue.

## Données structurées JSON-LD

Deux niveaux :

- **`GlobalStructuredData`** (rendu dans `App`) : Organization + WebSite + LocalBusiness — identique sur toutes les pages
- **`PageStructuredData`** (rendu dans chaque page) : Breadcrumb + Page + optionnel (Product/FAQ/Article selon la page)

Audit prod : 6 schémas distincts sur le home, 0 doublon. Les `@type`
répétés au compte brut sont des références imbriquées valides
(ex. `WebSite.publisher: Organization`).

## Pièges connus

### 1. Ajouter un provider sans toucher au SSR

Si tu wrappes l'App dans un nouveau provider côté client sans le faire
côté SSR, l'arbre diverge → hydration mismatch.

**Fix** : modifier les DEUX (`entry-server.tsx` et `main.tsx`) en miroir.

### 2. Composant qui accède à `window` au render

Code SSR-unsafe :
```tsx
const isMobile = window.innerWidth < 768;  // ← exécuté au render !
return <div>{isMobile ? <Mobile /> : <Desktop />}</div>;
```

Côté SSR : utilise la valeur du mock (`innerWidth: 1280`).
Côté client : valeur réelle du navigateur.
Si elles diffèrent → mismatch.

**Fix** : démarrer avec une valeur déterministe (Desktop par défaut), lire
`window` dans `useEffect`, mettre à jour le state.

```tsx
const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
  setIsMobile(window.innerWidth < 768);
}, []);
```

### 3. Math.random / Date.now / crypto.randomUUID au render

Génèrent des valeurs différentes à chaque render → SSR ≠ client → mismatch.

**Fix** : déplacer dans `useEffect` ou `useState` initializer (s'exécute une fois).

### 4. localStorage / sessionStorage au render

N'existent pas en Node. Le mock retourne `null`.

**Fix** : utiliser `safeLocalStorage` (`client/src/lib/storage.ts`) qui
gère le `typeof window === "undefined"`.

## Ce qui n'existe pas dans cette stack

- ❌ Streaming SSR (`renderToPipeableStream`) — pas nécessaire, on fait du SSG
- ❌ Suspense pour le data fetching en SSR — toute la donnée est bakée au build
- ❌ Hydration partielle / Islands — tout est hydraté ensemble
- ❌ React Server Components — Vite ne le supporte pas en SSG
- ❌ Edge runtime — on tourne sur Railway (Node.js)

## Quand reconsidérer la stack

Si un de ces besoins émerge, repenser :

- **Data fetching dynamique pendant SSR** (catalogue temps-réel) → Next.js
- **Hydratation partielle** (large bundle, mobile-first) → Astro
- **Streaming + Suspense en prod** → Next.js / Remix
- **Edge rendering géo-distribué** → Vercel Edge / Cloudflare Workers

D'ici là : la stack actuelle est rapide (~1s LCP), simple (pas de magie),
et 100% prévisible. Trade-off conscient.
