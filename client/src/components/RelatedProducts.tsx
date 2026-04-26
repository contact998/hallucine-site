/**
 * RelatedProducts.tsx — Section "Produits similaires" pour le maillage interne
 *
 * Usage : <RelatedProducts items={["ecranGeant", "tentes", "arches"]} />
 *
 * Placer juste avant <Footer /> dans chaque page produit.
 * Les clés disponibles sont définies dans PRODUCTS_CONFIG ci-dessous.
 */
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";
import type { RouteKey } from "@/i18n/routes";
import { ArrowRight } from "lucide-react";

// ─── Configuration centrale ────────────────────────────────────────────────

const CDN = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825";

export type ProductKey =
  | "ecrans"
  | "ecranGeant"
  | "ecranEtanche"
  | "ecranEconomique"
  | "ecransLED"
  | "comparaison"
  | "tentes"
  | "tentesX"
  | "tentesN"
  | "tentesV"
  | "tentesAraignee"
  | "arches"
  | "mobilier"
  | "accessoires"
  | "contact";

interface ProductMeta {
  routeKey: string;
  titleFr: string;
  descFr: string;
  image: string;
  imageAlt: string;
}

const PRODUCTS_CONFIG: Record<ProductKey, ProductMeta> = {
  ecrans: {
    routeKey: "ecrans",
    titleFr: "Écrans Gonflables",
    descFr: "Catalogue complet — du 3m au 24m",
    image: `${CDN}/vajzfoYsbBMsDfIq.webp`,
    imageAlt: "Écran gonflable de cinéma en plein air Hallucine",
  },
  ecranGeant: {
    routeKey: "ecran-geant",
    titleFr: "Écran Géant à Soufflerie",
    descFr: "De 5m à 24m — installation 45 min",
    image: `${CDN}/ibUxsSdoHUCVTWXC.webp`,
    imageAlt: "Écran de cinéma géant gonflable installé en plein air",
  },
  ecranEtanche: {
    routeKey: "ecran-etanche",
    titleFr: "Écran Étanche à l'Air",
    descFr: "Silencieux, autonome — technologie TPU",
    image: `${CDN}/IhxDeQNxHxMYBwlG.webp`,
    imageAlt: "Écran gonflable étanche à l'air technologie TPU Hallucine",
  },
  ecranEconomique: {
    routeKey: "ecran-economique",
    titleFr: "Écran Économique",
    descFr: "Le meilleur rapport qualité/prix",
    image: `${CDN}/WXsnQMOOUttRbUlr.webp`,
    imageAlt: "Écran gonflable économique prix accessible Hallucine",
  },
  ecransLED: {
    routeKey: "ecrans-led",
    titleFr: "Écrans LED Géants",
    descFr: "Visibilité maximale en plein jour",
    image: `${CDN}/cNgCebtnqSvVUvmF.webp`,
    imageAlt: "Écran LED géant événementiel Hallucine",
  },
  comparaison: {
    routeKey: "comparaison",
    titleFr: "Comparaison des Écrans",
    descFr: "Trouvez le modèle adapté à votre usage",
    image: `${CDN}/vajzfoYsbBMsDfIq.webp`,
    imageAlt: "Comparaison écrans gonflables Hallucine",
  },
  tentes: {
    routeKey: "tentes",
    titleFr: "Tentes Gonflables",
    descFr: "Structures événementielles — montage 5 min",
    image: `${CDN}/TVmrusoKmXcTvkKP.webp`,
    imageAlt: "Tente gonflable événementielle Hallucine",
  },
  tentesX: {
    routeKey: "tente-x",
    titleFr: "Tente Gonflable X",
    descFr: "La plus compacte et légère",
    image: `${CDN}/fHOHtmjSEZCdfvZR.webp`,
    imageAlt: "Tente gonflable X Hallucine événementielle",
  },
  tentesN: {
    routeKey: "tente-n",
    titleFr: "Tente Gonflable N",
    descFr: "Modulable et personnalisable",
    image: `${CDN}/TVmrusoKmXcTvkKP.webp`,
    imageAlt: "Tente gonflable N Hallucine modulable",
  },
  tentesV: {
    routeKey: "tente-v",
    titleFr: "Tente Gonflable V",
    descFr: "Design premium, grand volume",
    image: `${CDN}/HiOAOTLZaOhqpcQk.webp`,
    imageAlt: "Tente gonflable V Hallucine design premium",
  },
  tentesAraignee: {
    routeKey: "tente-araignee",
    titleFr: "Tente Araignée",
    descFr: "360° ouvert, impact visuel maximal",
    image: `${CDN}/TVmrusoKmXcTvkKP.webp`,
    imageAlt: "Tente araignée gonflable Hallucine 360 degrés",
  },
  arches: {
    routeKey: "arches",
    titleFr: "Arches Gonflables",
    descFr: "Départ, arrivée, podiums — personnalisables",
    image: `${CDN}/vbfbnQBVCUGrWUOw.webp`,
    imageAlt: "Arche gonflable publicitaire Hallucine",
  },
  mobilier: {
    routeKey: "mobilier",
    titleFr: "Mobilier Gonflable",
    descFr: "Tables, chaises, bars — livrés en 24h",
    image: `${CDN}/efvnhrOKvRVMyuHr.webp`,
    imageAlt: "Mobilier gonflable événementiel Hallucine",
  },
  accessoires: {
    routeKey: "accessoires",
    titleFr: "Accessoires",
    descFr: "Tout pour vos projections en plein air",
    image: `${CDN}/vajzfoYsbBMsDfIq.webp`,
    imageAlt: "Accessoires écran gonflable cinéma plein air Hallucine",
  },
  contact: {
    routeKey: "contact",
    titleFr: "Demander un Devis",
    descFr: "Réponse sous 24h — conseil gratuit",
    image: `${CDN}/vajzfoYsbBMsDfIq.webp`,
    imageAlt: "Demander un devis écran gonflable Hallucine",
  },
};

// ─── Composant ─────────────────────────────────────────────────────────────

interface RelatedProductsProps {
  items: [ProductKey, ProductKey] | [ProductKey, ProductKey, ProductKey];
  title?: string;
}

export function RelatedProducts({ items, title }: RelatedProductsProps) {
  const { t } = useTranslation("common");
  const route = useRoutes();

  return (
    <section
      aria-label="Produits similaires"
      className="py-16 px-4 bg-[oklch(0.12_0.02_45)]"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white/90 mb-8 text-center">
          {title ?? t("related_discover_also")}
        </h2>

        <div
          className={`grid gap-6 ${
            items.length === 2
              ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
              : "grid-cols-1 sm:grid-cols-3"
          }`}
        >
          {items.map((key) => {
            const product = PRODUCTS_CONFIG[key];
            if (!product) return null;

            const href = route(product.routeKey as RouteKey);

            return (
              <Link
                key={key}
                href={href}
                className="group block rounded-2xl overflow-hidden border border-white/8 bg-[oklch(0.16_0.02_45)] hover:border-warm/40 transition-[border-color,box-shadow] duration-300 hover:shadow-lg hover:shadow-warm/10"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.02_45)]/80 to-transparent" />
                </div>

                <div className="p-5">
                  <h3 className="text-white font-semibold text-base mb-1 group-hover:text-warm transition-colors duration-200">
                    {product.titleFr}
                  </h3>
                  <p className="text-white/50 text-sm mb-3 leading-relaxed">
                    {product.descFr}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-warm text-sm font-medium">
                    {t("related_discover")}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
