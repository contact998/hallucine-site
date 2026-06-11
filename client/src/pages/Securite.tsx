/* Page Vent & sécurité — répond à l'objection n°1 des mairies et
 * organisateurs : la tenue au vent. Limite officielle UNIQUE : 38 km/h
 * (6 Beaufort) toutes gammes, dégonfler au-delà (décision 2026-06-11) ;
 * aucune certification inventée — les pièces de dossier renvoient vers
 * le devis. */
import IntentLandingPage from "./IntentLandingPage";
import { Wind, Fan, Anchor, FileCheck } from "lucide-react";

export default function Securite() {
  return (
    <IntentLandingPage
      namespace="securite"
      routeKey="securite-vent"
      cards={[
        { id: "c1", icon: Wind, to: "ecran-etanche" },
        { id: "c2", icon: Fan, to: "ecran-geant" },
        { id: "c3", icon: Anchor },
        { id: "c4", icon: FileCheck, to: "mairie" },
      ]}
    />
  );
}
