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
  Configurateur:       () => import("./Configurateur"),
  TailleEcran:         () => import("./TailleEcran"),
  Securite:            () => import("./Securite"),
  DriveIn:             () => import("./DriveIn"),
  Packs:               () => import("./Packs"),
  CinemaPleinAir:      () => import("./CinemaPleinAir"),
  Prix:                () => import("./Prix"),
  Mairie:              () => import("./Mairie"),
  Hotel:               () => import("./Hotel"),
  Evenement:           () => import("./Evenement"),
  Location:            () => import("./Location"),
  EtudesCas:           () => import("./EtudesCas"),
  CasVelodrome:        () => import("./CasVelodrome"),
  CasOran:             () => import("./CasOran"),
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
  MentionsLegales:     () => import("./MentionsLegales"),
  Confidentialite:     () => import("./Confidentialite"),
  PolitiqueCookies:    () => import("./PolitiqueCookies"),
  Profil:              () => import("./Profil"),
  Admin:               () => import("./Admin"),
  AdminDashboard:      () => import("./AdminDashboard"),
  AdminAuditHistory:   () => import("./AdminAuditHistory"),
  AdminCalculateurs:   () => import("./AdminCalculateurs"),
  AdminLexique:        () => import("./AdminLexique"),
  AdminMedia:          () => import("./AdminMedia"),
  AdminMediaV2:        () => import("./AdminMediaV2"),
  AdminBlog:           () => import("./AdminBlog"),
  Login:               () => import("./Login"),
  NotFound:            () => import("./NotFound"),
} as const;

// ─── Préchargement global (utilisé en SSR) ──────────────────────────────────
// Doit être déclaré APRÈS les exports `lazyPage(...)` pour pouvoir les
// référencer — voir plus bas dans le fichier.

// ─── Composants de page (importés par App.tsx) ──────────────────────────────
export const Home = lazyPage(F.Home);
export const Ecrans = lazyPage(F.Ecrans);
export const EcranGeant = lazyPage(F.EcranGeant);
export const EcranEtanche = lazyPage(F.EcranEtanche);
export const EcranEconomique = lazyPage(F.EcranEconomique);
export const Comparaison = lazyPage(F.Comparaison);
export const Configurateur = lazyPage(F.Configurateur);
export const TailleEcran = lazyPage(F.TailleEcran);
export const Securite = lazyPage(F.Securite);
export const DriveIn = lazyPage(F.DriveIn);
export const Packs = lazyPage(F.Packs);
export const CinemaPleinAir = lazyPage(F.CinemaPleinAir);
export const Prix = lazyPage(F.Prix);
export const Mairie = lazyPage(F.Mairie);
export const Hotel = lazyPage(F.Hotel);
export const Evenement = lazyPage(F.Evenement);
export const Location = lazyPage(F.Location);
export const EtudesCas = lazyPage(F.EtudesCas);
export const CasVelodrome = lazyPage(F.CasVelodrome);
export const CasOran = lazyPage(F.CasOran);
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
export const MentionsLegales = lazyPage(F.MentionsLegales);
export const Confidentialite = lazyPage(F.Confidentialite);
export const PolitiqueCookies = lazyPage(F.PolitiqueCookies);
export const Profil = lazyPage(F.Profil);
export const Admin = lazyPage(F.Admin);
export const AdminDashboard = lazyPage(F.AdminDashboard);
export const AdminAuditHistory = lazyPage(F.AdminAuditHistory);
export const AdminCalculateurs = lazyPage(F.AdminCalculateurs);
export const AdminLexique = lazyPage(F.AdminLexique);
export const AdminMedia = lazyPage(F.AdminMedia);
export const AdminMediaV2 = lazyPage(F.AdminMediaV2);
export const AdminBlog = lazyPage(F.AdminBlog);
export const Login = lazyPage(F.Login);
export const NotFound = lazyPage(F.NotFound);

// ─── Préchargement global (utilisé en SSR) ──────────────────────────────────

const ALL_LAZY_PAGES: readonly PageComponent[] = [
  Home, Ecrans, EcranGeant, EcranEtanche, EcranEconomique, Comparaison,
  Configurateur, DriveIn, Packs, Location, EtudesCas, CasVelodrome, CasOran, EcransLED,
  Tentes, TentesX, TentesN, TentesV, TentesAraignees,
  ArchesGonflables, Mobilier, Accessoires, Galerie, GalerieVideo, Contact,
  APropos, Histoire, ModeEmploi, Blog, BlogPost, DevenirDistributeur,
  MentionsLegales, Confidentialite, PolitiqueCookies,
  Profil, Admin, AdminDashboard, AdminAuditHistory, AdminCalculateurs, AdminLexique,
  AdminMedia, AdminMediaV2, AdminBlog, Login, NotFound,
];

/**
 * Précharge TOUS les modules de pages → après cet await, le champ `mod`
 * interne à chaque `lazyPage` est rempli, donc le composant rend de façon
 * SYNCHRONE pendant renderToPipeableStream. À appeler une fois en SSR avant tout
 * render(). Idempotent : les appels suivants sont des no-ops (promesses
 * déjà résolues côté de chaque lazyPage).
 */
export async function preloadAllPages(): Promise<void> {
  await Promise.all(ALL_LAZY_PAGES.map((p) => p.preload()));
}

// ─── Préchargement de la page courante (avant hydrateRoot) ──────────────────

/** Clé de route i18n (ROUTES) → composant de page correspondant */
const ROUTE_KEY_TO_PAGE: Record<string, PageComponent> = {
  home:                   Home,
  ecrans:                 Ecrans,
  "ecran-geant":          EcranGeant,
  "ecran-etanche":        EcranEtanche,
  "ecran-economique":     EcranEconomique,
  comparaison:            Comparaison,
  configurateur:          Configurateur,
  "drive-in":             DriveIn,
  packs:                  Packs,
  location:               Location,
  "etudes-cas":           EtudesCas,
  "cas-velodrome":        CasVelodrome,
  "cas-oran":             CasOran,
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

  // Mapping URL admin → composant exact (sinon /admin/media précharge `Admin`
  // mais le routeur rend `AdminMedia` → suspension au premier render).
  const ADMIN_SUBROUTES: Record<string, PageComponent> = {
    "/admin":              Admin,
    "/admin/analytics":    AdminDashboard,
    "/admin/audits":       AdminAuditHistory,
    "/admin/calculateurs": AdminCalculateurs,
    "/admin/lexique":      AdminLexique,
    "/admin/media":        AdminMedia,
    "/admin-v2":           AdminMediaV2,
    "/admin/blog":         AdminBlog,
  };

  let page: PageComponent | undefined;
  const key = Object.keys(routes).find((k) => norm(routes[k] ?? "") === path);
  if (key) page = ROUTE_KEY_TO_PAGE[key];
  else if (path.startsWith("/blog/")) page = BlogPost;
  else if (path === "/profil") page = Profil;
  else if (path === "/login") page = Login;
  else if (path in ADMIN_SUBROUTES) page = ADMIN_SUBROUTES[path];
  else if (path.startsWith("/admin/") || path === "/admin") page = Admin;
  if (!page) page = NotFound;

  try {
    await page.preload();
  } catch {
    /* en cas d'échec, le composant rechargera le chunk au rendu */
  }
}
