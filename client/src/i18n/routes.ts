/**
 * Mapping des URLs traduites par langue
 *
 * Chaque route a une clé canonique (FR) et ses traductions.
 * Utilisé pour :
 * - Générer les liens hreflang
 * - Rediriger vers la bonne page selon la langue
 * - Construire les sitemaps
 */

import { LANGUAGE_DOMAINS } from "./domains";

export type RouteKey =
  | "home"
  | "ecrans"
  | "ecran-geant"
  | "ecran-etanche"
  | "ecran-economique"
  | "comparaison"
  | "configurateur"
  | "taille-ecran"
  | "securite-vent"
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
    "taille-ecran": "/taille-ecran-cinema-plein-air",
    "securite-vent": "/ecran-gonflable-vent-securite",
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
    "ecran-etanche": "/airtight-inflatable-screen",
    "ecran-economique": "/budget-inflatable-screen",
    comparaison: "/inflatable-screen-comparison",
    configurateur: "/inflatable-screen-configurator",
    "taille-ecran": "/outdoor-cinema-screen-size",
    "securite-vent": "/inflatable-screen-wind-safety",
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
    ecrans: "/aufblasbare-leinwand",
    "ecran-geant": "/grosse-aufblasbare-leinwand",
    "ecran-etanche": "/luftdichte-aufblasbare-leinwand",
    "ecran-economique": "/guenstige-aufblasbare-leinwand",
    comparaison: "/aufblasbare-leinwand-vergleich",
    configurateur: "/aufblasbare-leinwand-konfigurator",
    "taille-ecran": "/leinwandgroesse-freiluftkino",
    "securite-vent": "/aufblasbare-leinwand-wind-sicherheit",
    "drive-in": "/aufblasbare-drive-in-leinwand",
    packs: "/freiluftkino-paket",
    "cinema-plein-air": "/freiluftkino",
    prix: "/aufblasbare-leinwand-preis",
    mairie: "/freiluftkino-fuer-gemeinden",
    hotel: "/freiluftkino-fuer-hotels",
    evenement: "/grossleinwand-fuer-events",
    location: "/aufblasbare-leinwand-mieten",
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
    ecrans: "/pantalla-hinchable",
    "ecran-geant": "/pantalla-hinchable-gigante",
    "ecran-etanche": "/pantalla-hinchable-estanca",
    "ecran-economique": "/pantalla-hinchable-economica",
    comparaison: "/comparacion-pantalla-hinchable",
    configurateur: "/configurador-pantalla-hinchable",
    "taille-ecran": "/tamano-pantalla-cine-aire-libre",
    "securite-vent": "/pantalla-hinchable-viento-seguridad",
    "drive-in": "/pantalla-hinchable-autocine",
    packs: "/paquete-cine-aire-libre",
    "cinema-plein-air": "/cine-al-aire-libre",
    prix: "/precio-pantalla-hinchable",
    mairie: "/cine-al-aire-libre-ayuntamientos",
    hotel: "/cine-al-aire-libre-hoteles",
    evenement: "/pantalla-gigante-para-eventos",
    location: "/alquiler-pantalla-hinchable",
    "etudes-cas": "/casos-de-exito",
    "cas-velodrome": "/caso-velodrome-orange-estadio-marsella",
    "cas-oran": "/caso-oran-festival-pantalla-12m-argelia",
    "ecrans-led": "/pantallas-led",
    tentes: "/tienda-hinchable",
    "tente-x": "/tienda-hinchable-x",
    "tente-n": "/tienda-hinchable-n",
    "tente-v": "/tienda-hinchable-v",
    "tente-araignee": "/tienda-hinchable-arana",
    arches: "/arco-hinchable",
    mobilier: "/mobiliario-hinchable",
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
    "ecran-etanche": "/schermo-gonfiabile-a-tenuta-stagna",
    "ecran-economique": "/schermo-gonfiabile-economico",
    comparaison: "/confronto-schermo-gonfiabile",
    configurateur: "/configuratore-schermo-gonfiabile",
    "taille-ecran": "/dimensioni-schermo-cinema-all-aperto",
    "securite-vent": "/schermo-gonfiabile-vento-sicurezza",
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
  pt: {
    home: "/",
    ecrans: "/ecra-insuflavel",
    "ecran-geant": "/ecra-insuflavel-gigante-soprador",
    "ecran-etanche": "/ecra-insuflavel-estanque",
    "ecran-economique": "/ecra-insuflavel-economico",
    comparaison: "/comparacao-ecra-insuflavel",
    configurateur: "/configurador-ecra-insuflavel",
    "taille-ecran": "/tamanho-ecra-cinema-ao-ar-livre",
    "securite-vent": "/ecra-insuflavel-vento-seguranca",
    "drive-in": "/ecra-insuflavel-drive-in",
    packs: "/pacote-cinema-ao-ar-livre",
    "cinema-plein-air": "/cinema-ao-ar-livre",
    prix: "/preco-ecra-insuflavel",
    mairie: "/cinema-ao-ar-livre-municipios",
    hotel: "/cinema-ao-ar-livre-hoteis",
    evenement: "/ecra-gigante-eventos",
    location: "/aluguer-ecra-insuflavel",
    "etudes-cas": "/casos-de-estudo",
    "cas-velodrome": "/caso-velodromo-orange-estadio-marselha",
    "cas-oran": "/caso-oran-festival-ecra-12m-argelia",
    "ecrans-led": "/ecras-led",
    tentes: "/tenda-insuflavel",
    "tente-x": "/tenda-insuflavel-x",
    "tente-n": "/tenda-insuflavel-n",
    "tente-v": "/tenda-insuflavel-v",
    "tente-araignee": "/tenda-insuflavel-aranha",
    arches: "/arco-insuflavel",
    mobilier: "/mobiliario-insuflavel",
    accessoires: "/acessorios-cinema-ao-ar-livre",
    galerie: "/galeria-eventos",
    "galerie-video": "/galeria-video",
    contact: "/contacte-nos",
    "a-propos": "/sobre-hallucine",
    histoire: "/historia-hallucine",
    blog: "/blog",
    "mode-emploi": "/manual-utilizador",
    "devenir-distributeur": "/tornar-se-distribuidor",
    "trouver-distributeur": "/encontrar-distribuidor",
    "mentions-legales": "/aviso-legal",
    confidentialite: "/politica-privacidade",
    cookies: "/politica-cookies",
  },
};

/**
 * Anciens slugs → nouvelle URL (redirections 301 servies côté serveur).
 * Campagne lexique 2026-06-12 : les slugs portaient les contresens DeepL
 * (bildschirm, inflable, waterproof, impermeabile). On référence la langue
 * + la clé de route pour que la cible suive ROUTES si un slug rebouge.
 * Ne JAMAIS retirer une entrée : les anciens liens externes vivent longtemps.
 */
export const LEGACY_SLUG_REDIRECTS: Record<string, { lang: string; key: RouteKey }> = {
  // EN
  "/waterproof-inflatable-screen": { lang: "en", key: "ecran-etanche" },
  // DE — bildschirm → leinwand
  "/aufblasbarer-bildschirm": { lang: "de", key: "ecrans" },
  "/grosser-aufblasbarer-bildschirm": { lang: "de", key: "ecran-geant" },
  "/wasserdichter-aufblasbarer-bildschirm": { lang: "de", key: "ecran-etanche" },
  "/guenstiger-aufblasbarer-bildschirm": { lang: "de", key: "ecran-economique" },
  "/aufblasbarer-bildschirm-vergleich": { lang: "de", key: "comparaison" },
  "/aufblasbarer-bildschirm-konfigurator": { lang: "de", key: "configurateur" },
  "/aufblasbarer-drive-in-bildschirm": { lang: "de", key: "drive-in" },
  "/aufblasbarer-bildschirm-preis": { lang: "de", key: "prix" },
  "/aufblasbarer-bildschirm-mieten": { lang: "de", key: "location" },
  // ES — inflable → hinchable
  "/pantalla-inflable": { lang: "es", key: "ecrans" },
  "/pantalla-inflable-gigante": { lang: "es", key: "ecran-geant" },
  "/pantalla-inflable-impermeable": { lang: "es", key: "ecran-etanche" },
  "/pantalla-inflable-economica": { lang: "es", key: "ecran-economique" },
  "/comparacion-pantalla-inflable": { lang: "es", key: "comparaison" },
  "/configurador-pantalla-inflable": { lang: "es", key: "configurateur" },
  "/pantalla-inflable-viento-seguridad": { lang: "es", key: "securite-vent" },
  "/pantalla-inflable-autocine": { lang: "es", key: "drive-in" },
  "/precio-pantalla-inflable": { lang: "es", key: "prix" },
  "/alquiler-pantalla-inflable": { lang: "es", key: "location" },
  "/tienda-inflable": { lang: "es", key: "tentes" },
  "/tienda-inflable-x": { lang: "es", key: "tente-x" },
  "/tienda-inflable-n": { lang: "es", key: "tente-n" },
  "/tienda-inflable-v": { lang: "es", key: "tente-v" },
  "/tienda-inflable-arana": { lang: "es", key: "tente-araignee" },
  "/arco-inflable": { lang: "es", key: "arches" },
  "/mobiliario-inflable": { lang: "es", key: "mobilier" },
  // IT — impermeabile → a tenuta stagna
  "/schermo-gonfiabile-impermeabile": { lang: "it", key: "ecran-etanche" },
};

/** Résout un chemin legacy vers sa nouvelle URL, ou null. */
export function getLegacyRedirect(path: string): string | null {
  const entry = LEGACY_SLUG_REDIRECTS[path];
  if (!entry) return null;
  const target = ROUTES[entry.lang]?.[entry.key];
  return target && target !== path ? target : null;
}

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
 * Retourne toutes les URLs hreflang pour une route donnée.
 * Dérivé de LANGUAGE_DOMAINS (source unique) — une map locale dupliquée ici
 * avait oublié `pt` → hreflang="pt" href="undefined" dans tous les sitemaps.
 */
export function getHreflangUrls(routeKey: RouteKey): Record<string, string> {
  return Object.fromEntries(
    Object.entries(LANGUAGE_DOMAINS).map(([lang, domain]) => [
      lang,
      `${domain}${ROUTES[lang][routeKey]}`,
    ])
  );
}
