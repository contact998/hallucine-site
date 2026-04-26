import { JsonLd } from "@/components/JsonLd";
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
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={localBusinessSchema()} />
    </>
  );
}
