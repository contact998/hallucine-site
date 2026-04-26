/**
 * RelatedProducts.tsx v3 — Section "Produits similaires" autonome + i18n
 *
 * Usage : <RelatedProducts currentPage="arches" />
 *
 * Le composant calcule lui-même les voisins depuis RELATED_CONFIG.
 * Placer juste avant <Footer /> dans chaque page produit.
 *
 * POUR AJOUTER UNE NOUVELLE PAGE :
 *   1. Ajouter la RouteKey dans routes.ts
 *   2. Ajouter son entrée dans PRODUCTS_CONFIG ci-dessous (titleKey, descKey, image, imageAlt)
 *   3. Ajouter les clés related_*_title et related_*_desc dans toutes les locales
 *   4. Ajouter sa ligne dans relatedProductsConfig.ts
 *   → Rien d'autre à toucher
 */
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";
import type { RouteKey } from "@/i18n/routes";
import { RELATED_CONFIG } from "@/i18n/relatedProductsConfig";
import { ArrowRight } from "lucide-react";

// ─── Config produits ────────────────────────────────────────────────────────

const CDN = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825";

interface ProductMeta {
  titleKey: string;
  descKey: string;
  image: string;
  imageAlt: string;
}

/**
 * Métadonnées visuelles de chaque produit.
 * La clé = RouteKey exacte (même convention que routes.ts).
 * titleKey/descKey = clés i18n dans common.json (related_*_title / related_*_desc)
 */
const PRODUCTS_CONFIG: Partial<Record<RouteKey, ProductMeta>> = {
  "ecrans": {
    titleKey: "related_ecrans_title",
    descKey: "related_ecrans_desc",
    image: `${CDN}/vajzfoYsbBMsDfIq.webp`,
    imageAlt: "Écran gonflable de cinéma en plein air Hallucine",
  },
  "ecran-geant": {
    titleKey: "related_ecran_geant_title",
    descKey: "related_ecran_geant_desc",
    image: `${CDN}/ibUxsSdoHUCVTWXC.webp`,
    imageAlt: "Écran de cinéma géant gonflable installé en plein air",
  },
  "ecran-etanche": {
    titleKey: "related_ecran_etanche_title",
    descKey: "related_ecran_etanche_desc",
    image: `${CDN}/IhxDeQNxHxMYBwlG.webp`,
    imageAlt: "Écran gonflable étanche à l'air technologie TPU Hallucine",
  },
  "ecran-economique": {
    titleKey: "related_ecran_economique_title",
    descKey: "related_ecran_economique_desc",
    image: `${CDN}/WXsnQMOOUttRbUlr.webp`,
    imageAlt: "Écran gonflable économique prix accessible Hallucine",
  },
  "ecrans-led": {
    titleKey: "related_ecrans_led_title",
    descKey: "related_ecrans_led_desc",
    image: `${CDN}/cNgCebtnqSvVUvmF.webp`,
    imageAlt: "Écran LED géant événementiel Hallucine",
  },
  "comparaison": {
    titleKey: "related_comparaison_title",
    descKey: "related_comparaison_desc",
    image: `${CDN}/vajzfoYsbBMsDfIq.webp`,
    imageAlt: "Comparaison écrans gonflables Hallucine",
  },
  "tentes": {
    titleKey: "related_tentes_title",
    descKey: "related_tentes_desc",
    image: `${CDN}/TVmrusoKmXcTvkKP.webp`,
    imageAlt: "Tente gonflable événementielle Hallucine",
  },
  "tente-x": {
    titleKey: "related_tente_x_title",
    descKey: "related_tente_x_desc",
    image: `${CDN}/fHOHtmjSEZCdfvZR.webp`,
    imageAlt: "Tente gonflable X Hallucine événementielle",
  },
  "tente-n": {
    titleKey: "related_tente_n_title",
    descKey: "related_tente_n_desc",
    image: `${CDN}/TVmrusoKmXcTvkKP.webp`,
    imageAlt: "Tente gonflable N Hallucine modulable",
  },
  "tente-v": {
    titleKey: "related_tente_v_title",
    descKey: "related_tente_v_desc",
    image: `${CDN}/HiOAOTLZaOhqpcQk.webp`,
    imageAlt: "Tente gonflable V Hallucine design premium",
  },
  "tente-araignee": {
    titleKey: "related_tente_araignee_title",
    descKey: "related_tente_araignee_desc",
    image: `${CDN}/TVmrusoKmXcTvkKP.webp`,
    imageAlt: "Tente araignée gonflable Hallucine 360 degrés",
  },
  "arches": {
    titleKey: "related_arches_title",
    descKey: "related_arches_desc",
    image: `${CDN}/vbfbnQBVCUGrWUOw.webp`,
    imageAlt: "Arche gonflable publicitaire Hallucine",
  },
  "mobilier": {
    titleKey: "related_mobilier_title",
    descKey: "related_mobilier_desc",
    image: `${CDN}/efvnhrOKvRVMyuHr.webp`,
    imageAlt: "Mobilier gonflable événementiel Hallucine",
  },
  "accessoires": {
    titleKey: "related_accessoires_title",
    descKey: "related_accessoires_desc",
    image: `${CDN}/vajzfoYsbBMsDfIq.webp`,
    imageAlt: "Accessoires écran gonflable cinéma plein air Hallucine",
  },
  "contact": {
    titleKey: "related_contact_title",
    descKey: "related_contact_desc",
    image: `${CDN}/vajzfoYsbBMsDfIq.webp`,
    imageAlt: "Demander un devis écran gonflable Hallucine",
  },
  "a-propos": {
    titleKey: "related_a_propos_title",
    descKey: "related_a_propos_desc",
    image: `${CDN}/vajzfoYsbBMsDfIq.webp`,
    imageAlt: "L'histoire d'Hallucine fabricant écrans gonflables",
  },
  "histoire": {
    titleKey: "related_histoire_title",
    descKey: "related_histoire_desc",
    image: `${CDN}/vajzfoYsbBMsDfIq.webp`,
    imageAlt: "Histoire Hallucine fabricant écrans gonflables depuis 1992",
  },
  "mode-emploi": {
    titleKey: "related_mode_emploi_title",
    descKey: "related_mode_emploi_desc",
    image: `${CDN}/vajzfoYsbBMsDfIq.webp`,
    imageAlt: "Guide installation écran gonflable Hallucine",
  },
  "blog": {
    titleKey: "related_blog_title",
    descKey: "related_blog_desc",
    image: `${CDN}/vajzfoYsbBMsDfIq.webp`,
    imageAlt: "Blog cinéma en plein air Hallucine actualités",
  },
};

// ─── Composant ──────────────────────────────────────────────────────────────

interface RelatedProductsProps {
  /** RouteKey de la page courante — détermine les voisins via RELATED_CONFIG */
  currentPage: RouteKey;
  /** Titre de section personnalisé — optionnel */
  title?: string;
}

export function RelatedProducts({ currentPage, title }: RelatedProductsProps) {
  const { t } = useTranslation();
  const route = useRoutes();

  // Récupérer les voisins depuis la config centralisée
  const items = RELATED_CONFIG[currentPage];

  // Si pas de config pour cette page, ne rien afficher
  if (!items || items.length < 1) return null;

  // Filtrer les items dont la config produit existe
  const validItems = items.filter((key) => PRODUCTS_CONFIG[key]);

  if (validItems.length === 0) return null;

  return (
    <section
      aria-label={t("related_discover_also")}
      className="py-16 px-4 bg-[oklch(0.12_0.02_45)]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Titre */}
        <h2 className="text-2xl font-bold text-white/90 mb-8 text-center">
          {title ?? t("related_discover_also")}
        </h2>

        {/* Grille — 2 ou 3 colonnes selon le nombre d'items */}
        <div
          className={`grid gap-6 ${
            validItems.length === 2
              ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
              : "grid-cols-1 sm:grid-cols-3"
          }`}
        >
          {validItems.map((key) => {
            const product = PRODUCTS_CONFIG[key]!;
            const href = route(key);

            return (
              <Link
                key={key}
                href={href}
                className="group block rounded-2xl overflow-hidden border border-white/8 bg-[oklch(0.16_0.02_45)] hover:border-warm/40 transition-[border-color,box-shadow] duration-300 hover:shadow-lg hover:shadow-warm/10"
              >
                {/* Image */}
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

                {/* Texte */}
                <div className="p-5">
                  <h3 className="text-white font-semibold text-base mb-1 group-hover:text-warm transition-colors duration-200">
                    {t(product.titleKey)}
                  </h3>
                  <p className="text-white/50 text-sm mb-3 leading-relaxed">
                    {t(product.descKey)}
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
