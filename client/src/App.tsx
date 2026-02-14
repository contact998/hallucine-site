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
      <Route path={"/ecrans"} component={Ecrans} />
      <Route path={"/ecran-gonflable-geant"} component={EcranGeant} />
      <Route path={"/ecran-gonflable-etanche"} component={EcranEtanche} />
      <Route path={"/ecran-economique"} component={EcranEconomique} />
      {/* Tentes */}
      <Route path={"/tentes"} component={Tentes} />
      <Route path={"/tentes-x"} component={TentesX} />
      <Route path={"/tentes-n"} component={TentesN} />
      <Route path={"/tentes-v"} component={TentesV} />
      <Route path={"/tentes-araignees"} component={TentesAraignees} />
      {/* Arches */}
      <Route path={"/arches-gonflables"} component={ArchesGonflables} />
      {/* Mobilier */}
      <Route path={"/mobilier"} component={Mobilier} />
      {/* Accessoires */}
      <Route path={"/accessoires"} component={Accessoires} />
      {/* Galerie */}
      <Route path={"/galerie"} component={Galerie} />
      {/* Contact */}
      <Route path={"/contact"} component={Contact} />
      {/* Plus */}
      <Route path={"/a-propos"} component={APropos} />
      <Route path={"/notre-histoire"} component={Histoire} />
      <Route path={"/demande-de-prix"} component={DemandePrix} />
      {/* Légal */}
      <Route path={"/mentions-legales"} component={MentionsLegales} />
      <Route path={"/confidentialite"} component={Confidentialite} />
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
