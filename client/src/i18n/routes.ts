/**
 * Mapping des URLs traduites par langue
 *
 * Chaque route a une clé canonique (FR) et ses traductions.
 * Utilisé pour :
 * - Générer les liens hreflang
 * - Rediriger vers la bonne page selon la langue
 * - Construire les sitemaps
 */

export type RouteKey =
  | "home"
  | "ecrans"
  | "ecran-geant"
  | "ecran-etanche"
  | "ecran-economique"
  | "comparaison"
  | "ecrans-led"
  | "tentes"
  | "tente-x"
  | "tente-n"
  | "tente-v"
  | "tente-araignee"
  | "arches"
  | "mobilier"
  | "accessoires"
  | "galerie"
  | "galerie-video"
  | "contact"
  | "a-propos"
  | "histoire"
  | "blog"
  | "mode-emploi"
  | "devenir-distributeur"
  | "trouver-distributeur"
  | "mentions-legales"
  | "confidentialite"
  | "cookies";

export type LangRoutes = Record<RouteKey, string>;

export const ROUTES: Record<string, LangRoutes> = {
  fr: {
    home: "/",
    ecrans: "/ecran-gonflable",
    "ecran-geant": "/ecran-gonflable-geant-soufflerie",
    "ecran-etanche": "/ecran-gonflable-etanche-air",
    "ecran-economique": "/ecran-gonflable-economique",
    comparaison: "/comparaison-ecran-gonflable",
    "ecrans-led": "/ecrans-led",
    tentes: "/tente-gonflable",
    "tente-x": "/tente-gonflable-x",
    "tente-n": "/tente-gonflable-n",
    "tente-v": "/tente-gonflable-v",
    "tente-araignee": "/tente-gonflable-araignee",
    arches: "/arche-gonflable",
    mobilier: "/mobilier-gonflable",
    accessoires: "/accessoire-cinema-plein-air",
    galerie: "/galerie-evenements",
    "galerie-video": "/galerie-video",
    contact: "/contactez-nous",
    "a-propos": "/a-propos-hallucine",
    histoire: "/histoire-hallucine",
    blog: "/blog",
    "mode-emploi": "/mode-emploi",
    "devenir-distributeur": "/devenir-distributeur",
    "trouver-distributeur": "/trouver-distributeur",
    "mentions-legales": "/mentions-legales",
    confidentialite: "/politique-confidentialite",
    cookies: "/politique-cookies",
  },
  en: {
    home: "/",
    ecrans: "/inflatable-screen",
    "ecran-geant": "/giant-inflatable-screen",
    "ecran-etanche": "/waterproof-inflatable-screen",
    "ecran-economique": "/budget-inflatable-screen",
    comparaison: "/inflatable-screen-comparison",
    "ecrans-led": "/led-screens",
    tentes: "/inflatable-tent",
    "tente-x": "/inflatable-tent-x",
    "tente-n": "/inflatable-tent-n",
    "tente-v": "/inflatable-tent-v",
    "tente-araignee": "/spider-inflatable-tent",
    arches: "/inflatable-arch",
    mobilier: "/inflatable-furniture",
    accessoires: "/outdoor-cinema-accessories",
    galerie: "/events-gallery",
    "galerie-video": "/video-gallery",
    contact: "/contact-us",
    "a-propos": "/about-hallucine",
    histoire: "/hallucine-history",
    blog: "/blog",
    "mode-emploi": "/user-guide",
    "devenir-distributeur": "/become-distributor",
    "trouver-distributeur": "/find-distributor",
    "mentions-legales": "/legal-notice",
    confidentialite: "/privacy-policy",
    cookies: "/cookie-policy",
  },
  de: {
    home: "/",
    ecrans: "/aufblasbarer-bildschirm",
    "ecran-geant": "/grosser-aufblasbarer-bildschirm",
    "ecran-etanche": "/wasserdichter-aufblasbarer-bildschirm",
    "ecran-economique": "/guenstiger-aufblasbarer-bildschirm",
    comparaison: "/aufblasbarer-bildschirm-vergleich",
    "ecrans-led": "/led-bildschirme",
    tentes: "/aufblasbares-zelt",
    "tente-x": "/aufblasbares-zelt-x",
    "tente-n": "/aufblasbares-zelt-n",
    "tente-v": "/aufblasbares-zelt-v",
    "tente-araignee": "/spinnen-aufblasbares-zelt",
    arches: "/aufblasbarer-bogen",
    mobilier: "/aufblasbares-mobiliar",
    accessoires: "/freiluftkino-zubehoer",
    galerie: "/veranstaltungsgalerie",
    "galerie-video": "/videogalerie",
    contact: "/kontakt",
    "a-propos": "/ueber-hallucine",
    histoire: "/hallucine-geschichte",
    blog: "/blog",
    "mode-emploi": "/bedienungsanleitung",
    "devenir-distributeur": "/haendler-werden",
    "trouver-distributeur": "/haendler-finden",
    "mentions-legales": "/impressum",
    confidentialite: "/datenschutz",
    cookies: "/cookie-richtlinie",
  },
  es: {
    home: "/",
    ecrans: "/pantalla-inflable",
    "ecran-geant": "/pantalla-inflable-gigante",
    "ecran-etanche": "/pantalla-inflable-impermeable",
    "ecran-economique": "/pantalla-inflable-economica",
    comparaison: "/comparacion-pantalla-inflable",
    "ecrans-led": "/pantallas-led",
    tentes: "/tienda-inflable",
    "tente-x": "/tienda-inflable-x",
    "tente-n": "/tienda-inflable-n",
    "tente-v": "/tienda-inflable-v",
    "tente-araignee": "/tienda-inflable-arana",
    arches: "/arco-inflable",
    mobilier: "/mobiliario-inflable",
    accessoires: "/accesorios-cine-aire-libre",
    galerie: "/galeria-eventos",
    "galerie-video": "/galeria-video",
    contact: "/contactenos",
    "a-propos": "/sobre-hallucine",
    histoire: "/historia-hallucine",
    blog: "/blog",
    "mode-emploi": "/manual-usuario",
    "devenir-distributeur": "/convertirse-distribuidor",
    "trouver-distributeur": "/encontrar-distribuidor",
    "mentions-legales": "/aviso-legal",
    confidentialite: "/politica-privacidad",
    cookies: "/politica-cookies",
  },
};

/**
 * Retourne l'URL traduite pour une route donnée dans une langue donnée
 */
export function getRoute(routeKey: RouteKey, lang: string): string {
  return ROUTES[lang]?.[routeKey] ?? ROUTES["fr"][routeKey];
}

/**
 * Retourne la clé de route à partir d'un chemin URL dans une langue donnée
 */
export function getRouteKey(path: string, lang: string): RouteKey | null {
  const langRoutes = ROUTES[lang];
  if (!langRoutes) return null;
  const entry = Object.entries(langRoutes).find(([, url]) => url === path);
  return entry ? (entry[0] as RouteKey) : null;
}

/**
 * Retourne toutes les URLs hreflang pour une route donnée
 */
export function getHreflangUrls(routeKey: RouteKey): Record<string, string> {
  const domains: Record<string, string> = {
    fr: "https://hallucinecran.fr",
    en: "https://hallucinecran.com",
    de: "https://hallucinecran.de",
    es: "https://hallucinecran.es",
  };
  return Object.fromEntries(
    Object.entries(domains).map(([lang, domain]) => [
      lang,
      `${domain}${ROUTES[lang][routeKey]}`,
    ])
  );
}
