/* Page Vent & sécurité — répond à l'objection n°1 des mairies et
 * organisateurs : la tenue au vent. Chiffres = revendications déjà publiées
 * sur le site (étanche 40-50 km/h, soufflerie testée 60 km/h, dégonfler
 * au-delà) ; aucune certification inventée — les pièces de dossier renvoient
 * vers le devis. */
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
