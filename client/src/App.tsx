import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Ecrans from "./pages/Ecrans";
import EcranGeant from "./pages/EcranGeant";
import EcranEtanche from "./pages/EcranEtanche";
import EcranEconomique from "./pages/EcranEconomique";
import Tentes from "./pages/Tentes";
import TentesX from "./pages/TentesX";
import TentesN from "./pages/TentesN";
import TentesV from "./pages/TentesV";
import TentesAraignees from "./pages/TentesAraignees";
import ArchesGonflables from "./pages/ArchesGonflables";
import Mobilier from "./pages/Mobilier";
import Accessoires from "./pages/Accessoires";
import Galerie from "./pages/Galerie";
import Contact from "./pages/Contact";
import APropos from "./pages/APropos";
import DemandePrix from "./pages/DemandePrix";
import Histoire from "./pages/Histoire";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Écrans */}
      <Route path={"/ecran-gonflable"} component={Ecrans} />
      <Route path={"/ecran-gonflable-geant-soufflerie"} component={EcranGeant} />
      <Route path={"/ecran-gonflable-etanche-air"} component={EcranEtanche} />
      <Route path={"/ecran-gonflable-economique"} component={EcranEconomique} />
      {/* Tentes */}
      <Route path={"/tente-gonflable"} component={Tentes} />
      <Route path={"/tente-gonflable-x"} component={TentesX} />
      <Route path={"/tente-gonflable-n"} component={TentesN} />
      <Route path={"/tente-gonflable-v"} component={TentesV} />
      <Route path={"/tente-gonflable-araignee"} component={TentesAraignees} />
      {/* Arches */}
      <Route path={"/arche-gonflable"} component={ArchesGonflables} />
      {/* Mobilier */}
      <Route path={"/mobilier-gonflable"} component={Mobilier} />
      {/* Accessoires */}
      <Route path={"/accessoire-cinema-plein-air"} component={Accessoires} />
      {/* Galerie */}
      <Route path={"/galerie-evenements"} component={Galerie} />
      {/* Contact */}
      <Route path={"/contactez-nous"} component={Contact} />
      {/* Plus */}
      <Route path={"/a-propos-hallucine"} component={APropos} />
      <Route path={"/histoire-hallucine"} component={Histoire} />
      <Route path={"/tarifs-ecran-gonflable"} component={DemandePrix} />
      {/* Légal */}
      <Route path={"/mentions-legales"} component={MentionsLegales} />
      <Route path={"/politique-confidentialite"} component={Confidentialite} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
