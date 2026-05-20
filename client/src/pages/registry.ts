/**
 * registry.ts — Source unique des pages (imports dynamiques / code-splitting).
 *
 * Utilisé par :
 *  - App.tsx          → composants lazy (code-splitting + navigation)
 *  - main.tsx         → preloadCurrentPage() : précharge le chunk de la page
 *                       courante AVANT hydrateRoot, pour que React rende la
 *                       vraie page (et non un spinner Suspense) et puisse
 *                       s'hydrater sur le HTML pré-rendu sans flash.
 */
import { lazy } from "react";
import { ROUTES } from "../i18n/routes";
import { detectLanguage } from "../i18n/domains";

// ─── Fabriques d'import dynamique (clé = nom de page) ───────────────────────
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
};

// ─── Composants lazy (importés par App.tsx) ─────────────────────────────────
export const Home = lazy(F.Home);
export const Ecrans = lazy(F.Ecrans);
export const EcranGeant = lazy(F.EcranGeant);
export const EcranEtanche = lazy(F.EcranEtanche);
export const EcranEconomique = lazy(F.EcranEconomique);
export const Comparaison = lazy(F.Comparaison);
export const EcransLED = lazy(F.EcransLED);
export const Tentes = lazy(F.Tentes);
export const TentesX = lazy(F.TentesX);
export const TentesN = lazy(F.TentesN);
export const TentesV = lazy(F.TentesV);
export const TentesAraignees = lazy(F.TentesAraignees);
export const ArchesGonflables = lazy(F.ArchesGonflables);
export const Mobilier = lazy(F.Mobilier);
export const Accessoires = lazy(F.Accessoires);
export const Galerie = lazy(F.Galerie);
export const GalerieVideo = lazy(F.GalerieVideo);
export const Contact = lazy(F.Contact);
export const APropos = lazy(F.APropos);
export const Histoire = lazy(F.Histoire);
export const ModeEmploi = lazy(F.ModeEmploi);
export const Blog = lazy(F.Blog);
export const BlogPost = lazy(F.BlogPost);
export const DevenirDistributeur = lazy(F.DevenirDistributeur);
export const TrouverDistributeur = lazy(F.TrouverDistributeur);
export const MentionsLegales = lazy(F.MentionsLegales);
export const Confidentialite = lazy(F.Confidentialite);
export const PolitiqueCookies = lazy(F.PolitiqueCookies);
export const Profil = lazy(F.Profil);
export const Admin = lazy(F.Admin);
export const AdminDashboard = lazy(F.AdminDashboard);
export const AdminAuditHistory = lazy(F.AdminAuditHistory);
export const AdminCalculateurs = lazy(F.AdminCalculateurs);
export const AdminMedia = lazy(F.AdminMedia);
export const AdminBlog = lazy(F.AdminBlog);
export const Login = lazy(F.Login);
export const NotFound = lazy(F.NotFound);

// ─── Préchargement de la page courante (avant hydrateRoot) ──────────────────

/** Clé de route i18n (ROUTES) → fabrique de la page correspondante */
const ROUTE_KEY_TO_FACTORY: Record<string, () => Promise<unknown>> = {
  home:                   F.Home,
  ecrans:                 F.Ecrans,
  "ecran-geant":          F.EcranGeant,
  "ecran-etanche":        F.EcranEtanche,
  "ecran-economique":     F.EcranEconomique,
  comparaison:            F.Comparaison,
  "ecrans-led":           F.EcransLED,
  tentes:                 F.Tentes,
  "tente-x":              F.TentesX,
  "tente-n":              F.TentesN,
  "tente-v":              F.TentesV,
  "tente-araignee":       F.TentesAraignees,
  arches:                 F.ArchesGonflables,
  mobilier:               F.Mobilier,
  accessoires:            F.Accessoires,
  galerie:                F.Galerie,
  "galerie-video":        F.GalerieVideo,
  contact:                F.Contact,
  "a-propos":             F.APropos,
  histoire:               F.Histoire,
  "mode-emploi":          F.ModeEmploi,
  blog:                   F.Blog,
  "devenir-distributeur": F.DevenirDistributeur,
  "trouver-distributeur": F.TrouverDistributeur,
  "mentions-legales":     F.MentionsLegales,
  confidentialite:        F.Confidentialite,
  cookies:                F.PolitiqueCookies,
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

  let factory: (() => Promise<unknown>) | undefined;
  const key = Object.keys(routes).find((k) => norm(routes[k] ?? "") === path);
  if (key) factory = ROUTE_KEY_TO_FACTORY[key];
  else if (path.startsWith("/blog/")) factory = F.BlogPost;
  else if (path === "/profil") factory = F.Profil;
  else if (path === "/login") factory = F.Login;
  else if (path === "/admin" || path.startsWith("/admin/")) factory = F.Admin;
  if (!factory) factory = F.NotFound;

  try {
    await factory();
  } catch {
    /* en cas d'échec, lazy() rechargera le chunk normalement */
  }
}
