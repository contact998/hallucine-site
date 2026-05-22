import { useTranslation } from "react-i18next";
import { JsonLd } from "@/components/JsonLd";
import {
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
} from "@/lib/structuredData";
import {
  LANGUAGE_DOMAINS,
  LANGUAGE_LOCALES,
  SupportedLanguage,
} from "@/i18n/domains";

/**
 * Composant global qui injecte les données structurées communes à toutes les pages :
 * - Organization (infos entreprise, logo, réseaux sociaux)
 * - WebSite (nom du site, langue)
 * - LocalBusiness (adresse, horaires, coordonnées GPS)
 *
 * Les URLs et la langue sont résolues selon le domaine courant.
 */
export default function GlobalStructuredData() {
  const { i18n } = useTranslation();
  const lang = i18n.language as SupportedLanguage;
  const siteUrl = LANGUAGE_DOMAINS[lang] ?? LANGUAGE_DOMAINS.fr;
  const inLanguage = LANGUAGE_LOCALES[lang] ?? LANGUAGE_LOCALES.fr;

  return (
    <>
      <JsonLd data={organizationSchema(siteUrl)} />
      <JsonLd data={websiteSchema(siteUrl, inLanguage)} />
      <JsonLd data={localBusinessSchema(siteUrl)} />
    </>
  );
}
