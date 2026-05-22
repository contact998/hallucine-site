/**
 * Données structurées Schema.org (JSON-LD) pour le SEO
 * Chaque fonction retourne un objet conforme au format Schema.org
 */

const LOGO_URL = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/vajzfoYsbBMsDfIq.webp";
const COMPANY_PHONE = "+33 6 63 91 72 50";
const COMPANY_EMAIL = "contact@hallucine.fr";

// ─── Organization ────────────────────────────────────────────────────────────

export function organizationSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hallucine",
    alternateName: "Halluciné",
    url: siteUrl,
    logo: LOGO_URL,
    image: LOGO_URL,
    description:
      "Fabricant français d'écrans de cinéma gonflables, tentes gonflables, arches gonflables et mobilier gonflable. 30 ans d'expertise.",
    foundingDate: "1992",
    telephone: COMPANY_PHONE,
    email: COMPANY_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "4 rue des Musiciens",
      addressLocality: "Barr",
      postalCode: "67140",
      addressRegion: "Grand Est",
      addressCountry: "FR",
    },
    sameAs: [
      "https://www.facebook.com/Hallucinecran",
      "https://www.instagram.com/hallucine_ecrans/",
      "https://www.youtube.com/@Hallucinecran",
      "https://www.linkedin.com/company/hallucinecran/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY_PHONE,
      contactType: "sales",
      availableLanguage: ["French", "English", "Spanish", "German"],
    },
  };
}

// ─── WebSite ─────────────────────────────────────────────────────────────────

export function websiteSchema(siteUrl: string, inLanguage: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hallucine — Écrans de Cinéma Gonflables",
    url: siteUrl,
    description:
      "Fabricant français d'écrans de cinéma gonflables ultra-légers. De 2m à 24m, technologie étanche et soufflerie. Garantie 10 ans.",
    publisher: {
      "@type": "Organization",
      name: "Hallucine",
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
    inLanguage,
  };
}

// ─── LocalBusiness ───────────────────────────────────────────────────────────

export function localBusinessSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: "Hallucine",
    image: LOGO_URL,
    url: siteUrl,
    telephone: COMPANY_PHONE,
    email: COMPANY_EMAIL,
    priceRange: "€€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "4 rue des Musiciens",
      addressLocality: "Barr",
      postalCode: "67140",
      addressRegion: "Grand Est",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 48.4078,
      longitude: 7.4497,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: 48.8566, longitude: 2.3522 },
      geoRadius: "5000 km",
    },
  };
}

// ─── BreadcrumbList ──────────────────────────────────────────────────────────

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── Product ─────────────────────────────────────────────────────────────────

interface ProductData {
  name: string;
  description: string;
  image: string | string[];
  /** URL canonique absolue de la page produit (domaine + locale courants). */
  url: string;
  /** Racine du domaine courant — pour l'entité manufacturer. */
  siteUrl: string;
  /** URL absolue localisée de la page contact — pour offers.url. */
  contactUrl: string;
  category?: string;
  minPrice?: number;
}

export function productSchema(product: ProductData) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url,
    brand: {
      "@type": "Brand",
      name: "Hallucine",
    },
    category: product.category,
    manufacturer: {
      "@type": "Organization",
      name: "Hallucine",
      url: product.siteUrl,
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "EUR",
      price: product.minPrice || 990,
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      seller: {
        "@type": "Organization",
        name: "Hallucine",
      },
      url: product.contactUrl,
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "EUR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "WORLD",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 5,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 7,
            maxValue: 30,
            unitCode: "DAY",
          },
        },
        doesNotShip: false,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "WORLD",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        merchantReturnDays: 0,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "52",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

// ─── FAQPage ─────────────────────────────────────────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

export function faqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── Article / BlogPosting ───────────────────────────────────────────────────

interface ArticleData {
  headline: string;
  description: string;
  image?: string;
  /** URL canonique absolue de l'article (domaine + locale courants). */
  url: string;
  /** Racine du domaine courant — pour l'entité author. */
  siteUrl: string;
  /** Code locale BCP-47 de la langue courante (ex. "fr-FR"). */
  inLanguage: string;
  datePublished?: string;
  dateModified?: string;
}

export function articleSchema(article: ArticleData) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    image: article.image || LOGO_URL,
    url: article.url,
    datePublished: article.datePublished || "2024-01-01",
    dateModified: article.dateModified || new Date().toISOString().split("T")[0],
    author: {
      "@type": "Organization",
      name: "Hallucine",
      url: article.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Hallucine",
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
    inLanguage: article.inLanguage,
  };
}

// ─── WebPage (générique) ─────────────────────────────────────────────────────

interface WebPageData {
  name: string;
  description: string;
  /** URL canonique absolue de la page (domaine + locale courants). */
  url: string;
  /** Racine du domaine courant — pour l'entité isPartOf (WebSite). */
  siteUrl: string;
  /** Code locale BCP-47 de la langue courante (ex. "fr-FR"). */
  inLanguage: string;
}

export function webPageSchema(page: WebPageData) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.name,
    description: page.description,
    url: page.url,
    isPartOf: {
      "@type": "WebSite",
      name: "Hallucine",
      url: page.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Hallucine",
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
    inLanguage: page.inLanguage,
  };
}
