/* Page segment — écran géant pour événements : festivals, concerts, CE, sport. */
import IntentLandingPage from "./IntentLandingPage";
import { Package, CalendarClock, Monitor, Volume2 } from "lucide-react";

export default function Evenement() {
  return (
    <IntentLandingPage
      namespace="ecran-geant-evenement"
      routeKey="evenement"
      cards={[
        { id: "c1", icon: CalendarClock, to: "location" },
        { id: "c2", icon: Package, to: "packs" },
        { id: "c3", icon: Monitor, to: "ecrans-led" },
        { id: "c4", icon: Volume2, to: "accessoires" },
      ]}
    />
  );
}
