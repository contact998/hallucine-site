/* Page Prix — capte l'intention « prix / tarif écran gonflable ». Pas de prix
 * fixe inventé : facteurs de prix + fourchettes indicatives + renvoi devis. */
import IntentLandingPage from "./IntentLandingPage";
import { Ruler, Cpu, Package, CalendarClock } from "lucide-react";

export default function Prix() {
  return (
    <IntentLandingPage
      namespace="prix"
      routeKey="prix"
      cards={[
        { id: "c1", icon: Ruler, to: "taille-ecran" },
        { id: "c2", icon: Cpu },
        { id: "c3", icon: Package },
        { id: "c4", icon: CalendarClock, to: "location" },
      ]}
    />
  );
}
