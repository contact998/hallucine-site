/**
 * registry.ts — Source unique des pages (imports dynamiques / code-splitting).
 *
 * Utilisé par :
 *  - App.tsx          → composants de page (code-splitting + navigation)
 *  - main.tsx         → preloadCurrentPage() : précharge le chunk de la page
 *                       courante AVANT hydrateRoot.
 *
 * `lazyPage` (lazy maison) : contrairement à React.lazy — qui suspend TOUJOURS
 * à son premier rendu, même chunk déjà en cache — un composant `lazyPage`
 * rend de façon SYNCHRONE dès que son module a été préchargé. C'est ce qui
 * permet l'hydratation sans flash : la page courante est préchargée puis
 * rendue synchrone, donc identique au HTML serveur.
 */
import { createElement, type ComponentType } from "react";
import { ROUTES } from "../i18n/routes";
import { detectLanguage } from "../i18n/domains";

type PageModule = { default: ComponentType<any> };
type PageComponent = ComponentType<any> & {
  preload: () => Promise<void>;
};

/** Crée un composant de page : synchrone si préchargé, suspend sinon. */
function lazyPage(factory: () => Promise<PageModule>): PageComponent {
  let mod: PageModule | null = null;
  let promise: Promise<void> | null = null;
  const load = () => {
    if (!promise) promise = factory().then((m) => { mod = m; });
    return promise;
  };
  const Page = (props: any) => {
    if (mod) return createElement(mod.default, props);
    throw load(); // suspend — capté par le <Suspense> parent
  };
  (Page as PageComponent).preload = load;
  return Page as PageComponent;
}

// ─── Fabriques d'import dynamique ───────────────────────────────────────────
const F = {
  Home:                () => import("./Home"),
  Ecrans:              () => import("./Ecrans"),
  EcranGeant:          () => import("./EcranGeant"),
  EcranEtanche:        () => import("./EcranEtanche"),
  EcranEconomique:     () => import("./EcranEconomique"),
  Comparaison:         () => import("./Comparaison"),
  EcransLED:           () => import("./EcransLED"),
  Tentes:              () => import("./Tentes"),
  TentesX:             () => import("./TentesX"),
  TentesN:             () => import("./TentesN"),
  TentesV:             () => import("./TentesV"),
  TentesAraignees:     () => import("./TentesAraignees"),
  ArchesGonflables:    () => import("./ArchesGonflables"),
  Mobilier:            () => import("./Mobilier"),
  Accessoires:         () => import("./Accessoires"),
  Galerie:             () => import("./Galerie"),
  GalerieVideo:        () => import("./GalerieVideo"),
  Contact:             () => import("./Contact"),
  APropos:             () => import("./APropos"),
  Histoire:            () => import("./Histoire"),
  ModeEmploi:          () => import("./ModeEmploi"),
  Blog:                () => import("./Blog"),
  BlogPost:            () => import("./BlogPost"),
  DevenirDistributeur: () => import("./DevenirDistributeur"),
  TrouverDistributeur: () => import("./TrouverDistributeur"),
  MentionsLegales:     () => import("./MentionsLegales"),
  Confidentialite:     () => import("./Confidentialite"),
  PolitiqueCookies:    () => import("./PolitiqueCookies"),
  Profil:              () => import("./Profil"),
  Admin:               () => import("./Admin"),
  AdminDashboard:      () => import("./AdminDashboard"),
  AdminAuditHistory:   () => import("./AdminAuditHistory"),
  AdminCalculateurs:   () => import("./AdminCalculateurs"),
  AdminMedia:          () => import("./AdminMedia"),
  AdminBlog:           () => import("./AdminBlog"),
  Login:               () => import("./Login"),
  NotFound:            () => import("./NotFound"),
} as const;

// ─── Composants de page (importés par App.tsx) ──────────────────────────────
export const Home = lazyPage(F.Home);
export const Ecrans = lazyPage(F.Ecrans);
export const EcranGeant = lazyPage(F.EcranGeant);
export const EcranEtanche = lazyPage(F.EcranEtanche);
export const EcranEconomique = lazyPage(F.EcranEconomique);
export const Comparaison = lazyPage(F.Comparaison);
export const EcransLED = lazyPage(F.EcransLED);
export const Tentes = lazyPage(F.Tentes);
export const TentesX = lazyPage(F.TentesX);
export const TentesN = lazyPage(F.TentesN);
export const TentesV = lazyPage(F.TentesV);
export const TentesAraignees = lazyPage(F.TentesAraignees);
export const ArchesGonflables = lazyPage(F.ArchesGonflables);
export const Mobilier = lazyPage(F.Mobilier);
export const Accessoires = lazyPage(F.Accessoires);
export const Galerie = lazyPage(F.Galerie);
export const GalerieVideo = lazyPage(F.GalerieVideo);
export const Contact = lazyPage(F.Contact);
export const APropos = lazyPage(F.APropos);
export const Histoire = lazyPage(F.Histoire);
export const ModeEmploi = lazyPage(F.ModeEmploi);
export const Blog = lazyPage(F.Blog);
export const BlogPost = lazyPage(F.BlogPost);
export const DevenirDistributeur = lazyPage(F.DevenirDistributeur);
export const TrouverDistributeur = lazyPage(F.TrouverDistributeur);
export const MentionsLegales = lazyPage(F.MentionsLegales);
export const Confidentialite = lazyPage(F.Confidentialite);
export const PolitiqueCookies = lazyPage(F.PolitiqueCookies);
export const Profil = lazyPage(F.Profil);
export const Admin = lazyPage(F.Admin);
export const AdminDashboard = lazyPage(F.AdminDashboard);
export const AdminAuditHistory = lazyPage(F.AdminAuditHistory);
export const AdminCalculateurs = lazyPage(F.AdminCalculateurs);
export const AdminMedia = lazyPage(F.AdminMedia);
export const AdminBlog = lazyPage(F.AdminBlog);
export const Login = lazyPage(F.Login);
export const NotFound = lazyPage(F.NotFound);

// ─── Préchargement de la page courante (avant hydrateRoot) ──────────────────

/** Clé de route i18n (ROUTES) → composant de page correspondant */
const ROUTE_KEY_TO_PAGE: Record<string, PageComponent> = {
  home:                   Home,
  ecrans:                 Ecrans,
  "ecran-geant":          EcranGeant,
  "ecran-etanche":        EcranEtanche,
  "ecran-economique":     EcranEconomique,
  comparaison:            Comparaison,
  "ecrans-led":           EcransLED,
  tentes:                 Tentes,
  "tente-x":              TentesX,
  "tente-n":              TentesN,
  "tente-v":              TentesV,
  "tente-araignee":       TentesAraignees,
  arches:                 ArchesGonflables,
  mobilier:               Mobilier,
  accessoires:            Accessoires,
  galerie:                Galerie,
  "galerie-video":        GalerieVideo,
  contact:                Contact,
  "a-propos":             APropos,
  histoire:               Histoire,
  "mode-emploi":          ModeEmploi,
  blog:                   Blog,
  "devenir-distributeur": DevenirDistributeur,
  "trouver-distributeur": TrouverDistributeur,
  "mentions-legales":     MentionsLegales,
  confidentialite:        Confidentialite,
  cookies:                PolitiqueCookies,
};

const norm = (p: string) => p.replace(/\/+$/, "") || "/";

/**
 * Précharge le chunk JS de la page correspondant à l'URL courante.
 * À appeler AVANT hydrateRoot pour une hydratation sans flash.
 */
export async function preloadCurrentPage(): Promise<void> {
  if (typeof window === "undefined") return;
  const routes = (ROUTES[detectLanguage()] ?? ROUTES["fr"]) as Record<string, string>;
  const path = norm(window.location.pathname);

  let page: PageComponent | undefined;
  const key = Object.keys(routes).find((k) => norm(routes[k] ?? "") === path);
  if (key) page = ROUTE_KEY_TO_PAGE[key];
  else if (path.startsWith("/blog/")) page = BlogPost;
  else if (path === "/profil") page = Profil;
  else if (path === "/login") page = Login;
  else if (path === "/admin" || path.startsWith("/admin/")) page = Admin;
  if (!page) page = NotFound;

  try {
    await page.preload();
  } catch {
    /* en cas d'échec, le composant rechargera le chunk au rendu */
  }
}
