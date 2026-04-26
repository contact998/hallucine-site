import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbSchema,
  productSchema,
  faqSchema,
  articleSchema,
  webPageSchema,
} from "@/lib/structuredData";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface ProductInfo {
  name: string;
  description: string;
  image: string | string[];
  url: string;
  category?: string;
  sku?: string;
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
  url: string;
  datePublished?: string;
  dateModified?: string;
}

interface PageInfo {
  name: string;
  description: string;
  url: string;
}

interface Props {
  breadcrumbs?: BreadcrumbItem[];
  product?: ProductInfo;
  faqs?: FaqItem[];
  article?: ArticleInfo;
  page?: PageInfo;
  id: string;
}

/**
 * Composant qui injecte les données structurées spécifiques à une page.
 * Supporte : BreadcrumbList, Product, FAQPage, Article, WebPage
 * Rendu direct via <script type="application/ld+json"> (SSR-friendly).
 */
export default function PageStructuredData({
  breadcrumbs,
  product,
  faqs,
  article,
  page,
}: Props) {
  return (
    <>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      )}
      {product && <JsonLd data={productSchema(product)} />}
      {faqs && faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
      {article && <JsonLd data={articleSchema(article)} />}
      {page && <JsonLd data={webPageSchema(page)} />}
    </>
  );
}
