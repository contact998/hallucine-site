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
  | "configurateur"
  | "drive-in"
  | "packs"
  | "cinema-plein-air"
  | "prix"
  | "mairie"
  | "hotel"
  | "evenement"
  | "location"
  | "etudes-cas"
  | "cas-velodrome"
  | "cas-oran"
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
    configurateur: "/configurateur-ecran-gonflable",
    "drive-in": "/ecran-gonflable-drive-in",
    packs: "/pack-cinema-plein-air",
    "cinema-plein-air": "/cinema-plein-air",
    prix: "/prix-ecran-gonflable",
    mairie: "/cinema-plein-air-mairie",
    hotel: "/cinema-plein-air-hotel",
    evenement: "/ecran-geant-evenement",
    location: "/location-ecran-gonflable",
    "etudes-cas": "/etudes-de-cas",
    "cas-velodrome": "/realisation-velodrome-orange-stade-marseille",
    "cas-oran": "/realisation-festival-oran-ecran-12m-algerie",
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
    configurateur: "/inflatable-screen-configurator",
    "drive-in": "/inflatable-drive-in-screen",
    packs: "/outdoor-cinema-package",
    "cinema-plein-air": "/open-air-cinema",
    prix: "/inflatable-screen-price",
    mairie: "/open-air-cinema-for-councils",
    hotel: "/open-air-cinema-for-hotels",
    evenement: "/giant-screen-for-events",
    location: "/inflatable-screen-rental",
    "etudes-cas": "/case-studies",
    "cas-velodrome": "/case-velodrome-orange-marseille-stadium",
    "cas-oran": "/case-oran-festival-12m-screen-algeria",
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
    configurateur: "/aufblasbarer-bildschirm-konfigurator",
    "drive-in": "/aufblasbarer-drive-in-bildschirm",
    packs: "/freiluftkino-paket",
    "cinema-plein-air": "/freiluftkino",
    prix: "/aufblasbarer-bildschirm-preis",
    mairie: "/freiluftkino-fuer-gemeinden",
    hotel: "/freiluftkino-fuer-hotels",
    evenement: "/grossleinwand-fuer-events",
    location: "/aufblasbarer-bildschirm-mieten",
    "etudes-cas": "/fallstudien",
    "cas-velodrome": "/fallstudie-velodrome-orange-marseille-stadion",
    "cas-oran": "/fallstudie-oran-festival-12m-leinwand-algerien",
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
    configurateur: "/configurador-pantalla-inflable",
    "drive-in": "/pantalla-inflable-autocine",
    packs: "/paquete-cine-aire-libre",
    "cinema-plein-air": "/cine-al-aire-libre",
    prix: "/precio-pantalla-inflable",
    mairie: "/cine-al-aire-libre-ayuntamientos",
    hotel: "/cine-al-aire-libre-hoteles",
    evenement: "/pantalla-gigante-para-eventos",
    location: "/alquiler-pantalla-inflable",
    "etudes-cas": "/casos-de-exito",
    "cas-velodrome": "/caso-velodrome-orange-estadio-marsella",
    "cas-oran": "/caso-oran-festival-pantalla-12m-argelia",
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
  it: {
    home: "/",
    ecrans: "/schermo-gonfiabile",
    "ecran-geant": "/schermo-gonfiabile-gigante",
    "ecran-etanche": "/schermo-gonfiabile-impermeabile",
    "ecran-economique": "/schermo-gonfiabile-economico",
    comparaison: "/confronto-schermo-gonfiabile",
    configurateur: "/configuratore-schermo-gonfiabile",
    "drive-in": "/schermo-gonfiabile-drive-in",
    packs: "/pacchetto-cinema-all-aperto",
    "cinema-plein-air": "/cinema-all-aperto",
    prix: "/prezzo-schermo-gonfiabile",
    mairie: "/cinema-all-aperto-comuni",
    hotel: "/cinema-all-aperto-hotel",
    evenement: "/maxischermo-per-eventi",
    location: "/noleggio-schermo-gonfiabile",
    "etudes-cas": "/casi-studio",
    "cas-velodrome": "/caso-velodrome-orange-stadio-marsiglia",
    "cas-oran": "/caso-oran-festival-schermo-12m-algeria",
    "ecrans-led": "/schermi-led",
    tentes: "/tenda-gonfiabile",
    "tente-x": "/tenda-gonfiabile-x",
    "tente-n": "/tenda-gonfiabile-n",
    "tente-v": "/tenda-gonfiabile-v",
    "tente-araignee": "/tenda-gonfiabile-ragno",
    arches: "/arco-gonfiabile",
    mobilier: "/mobili-gonfiabili",
    accessoires: "/accessori-cinema-all-aperto",
    galerie: "/galleria-eventi",
    "galerie-video": "/galleria-video",
    contact: "/contattaci",
    "a-propos": "/chi-siamo-hallucine",
    histoire: "/storia-hallucine",
    blog: "/blog",
    "mode-emploi": "/manuale-utente",
    "devenir-distributeur": "/diventare-distributore",
    "trouver-distributeur": "/trovare-distributore",
    "mentions-legales": "/note-legali",
    confidentialite: "/politica-privacy",
    cookies: "/politica-cookie",
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
    it: "https://hallucinecran.it",
  };
  return Object.fromEntries(
    Object.entries(domains).map(([lang, domain]) => [
      lang,
      `${domain}${ROUTES[lang][routeKey]}`,
    ])
  );
}
