import { useMemo } from "react";
import { useStructuredData } from "@/hooks/useStructuredData";
import {
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
} from "@/lib/structuredData";

/**
 * Composant global qui injecte les données structurées communes à toutes les pages :
 * - Organization (infos entreprise, logo, réseaux sociaux)
 * - WebSite (nom du site, langue)
 * - LocalBusiness (adresse, horaires, coordonnées GPS)
 */
export default function GlobalStructuredData() {
  const schemas = useMemo(
    () => [organizationSchema(), websiteSchema(), localBusinessSchema()],
    []
  );

  useStructuredData(schemas, "global");

  return null;
}
