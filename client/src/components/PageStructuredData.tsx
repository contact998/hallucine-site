import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbSchema,
  productSchema,
  faqSchema,
  articleSchema,
  webPageSchema,
} from "@/lib/structuredData";
import {
  LANGUAGE_DOMAINS,
  LANGUAGE_LOCALES,
  SupportedLanguage,
  buildCanonicalUrl,
} from "@/i18n/domains";
import { getRoute, RouteKey } from "@/i18n/routes";

interface BreadcrumbItem {
  name: string;
  /** Clé de route i18n — résolue vers l'URL localisée du domaine courant. */
  routeKey: RouteKey;
}

interface ProductInfo {
  name: string;
  description: string;
  image: string | string[];
  category?: string;
  minPrice?: number;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ArticleInfo {
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}

interface PageInfo {
  name: string;
  description: string;
}

interface Props {
  breadcrumbs?: BreadcrumbItem[];
  product?: ProductInfo;
  faqs?: FaqItem[];
  article?: ArticleInfo;
  page?: PageInfo;
}

/**
 * Composant qui injecte les données structurées spécifiques à une page.
 * Supporte : BreadcrumbList, Product, FAQPage, Article, WebPage
 * Rendu direct via <script type="application/ld+json"> (SSR-friendly).
 *
 * Toutes les URLs sont conscientes du domaine ET de la locale :
 * - URL propre de la page (page/product/article + dernier fil d'Ariane) →
 *   URL canonique courante (domaine courant + chemin courant).
 * - Éléments intermédiaires du fil d'Ariane → route localisée (ROUTES[lang])
 *   préfixée du domaine courant.
 */
export default function PageStructuredData({
  breadcrumbs,
  product,
  faqs,
  article,
  page,
}: Props) {
  const [location] = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const currentUrl = buildCanonicalUrl(lang, location);
  const siteUrl = LANGUAGE_DOMAINS[lang as SupportedLanguage] ?? LANGUAGE_DOMAINS.fr;
  const inLanguage = LANGUAGE_LOCALES[lang as SupportedLanguage] ?? LANGUAGE_LOCALES.fr;

  // Le dernier élément du fil d'Ariane est la page courante → URL canonique.
  // Les éléments intermédiaires sont résolus via la route localisée.
  const resolvedBreadcrumbs = breadcrumbs?.map((item, index) => ({
    name: item.name,
    url:
      index === breadcrumbs.length - 1
        ? currentUrl
        : buildCanonicalUrl(lang, getRoute(item.routeKey, lang)),
  }));

  return (
    <>
      {resolvedBreadcrumbs && resolvedBreadcrumbs.length > 0 && (
        <JsonLd data={breadcrumbSchema(resolvedBreadcrumbs)} />
      )}
      {product && (
        <JsonLd
          data={productSchema({
            ...product,
            url: currentUrl,
            siteUrl,
            contactUrl: buildCanonicalUrl(lang, getRoute("contact", lang)),
          })}
        />
      )}
      {faqs && faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
      {article && (
        <JsonLd
          data={articleSchema({
            ...article,
            url: currentUrl,
            siteUrl,
            inLanguage,
          })}
        />
      )}
      {page && (
        <JsonLd
          data={webPageSchema({ ...page, url: currentUrl, siteUrl, inLanguage })}
        />
      )}
    </>
  );
}
