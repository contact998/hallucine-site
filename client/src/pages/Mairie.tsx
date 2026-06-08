/* Page segment — cinéma plein air pour les mairies / collectivités. */
import IntentLandingPage from "./IntentLandingPage";
import { Package, CalendarClock, Monitor, Volume2 } from "lucide-react";

export default function Mairie() {
  return (
    <IntentLandingPage
      namespace="cinema-plein-air-mairie"
      routeKey="mairie"
      cards={[
        { id: "c1", icon: Package, to: "packs" },
        { id: "c2", icon: CalendarClock, to: "location" },
        { id: "c3", icon: Monitor, to: "ecrans" },
        { id: "c4", icon: Volume2, to: "accessoires" },
      ]}
    />
  );
}
