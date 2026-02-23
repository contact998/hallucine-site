import { useMemo } from "react";
import { useStructuredData } from "@/hooks/useStructuredData";
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
 */
export default function PageStructuredData({
  breadcrumbs,
  product,
  faqs,
  article,
  page,
  id,
}: Props) {
  const schemas = useMemo(() => {
    const result: Record<string, unknown>[] = [];

    if (breadcrumbs && breadcrumbs.length > 0) {
      result.push(breadcrumbSchema(breadcrumbs));
    }
    if (product) {
      result.push(productSchema(product));
    }
    if (faqs && faqs.length > 0) {
      result.push(faqSchema(faqs));
    }
    if (article) {
      result.push(articleSchema(article));
    }
    if (page) {
      result.push(webPageSchema(page));
    }

    return result;
  }, [breadcrumbs, product, faqs, article, page]);

  useStructuredData(schemas, id);

  return null;
}
