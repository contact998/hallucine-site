import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import WhatsAppButton from "./components/WhatsAppButton";
import HallucineChatbot from "./components/HallucineChatbot";
import { ThemeProvider } from "./contexts/ThemeContext";
import { usePageTracking } from "./hooks/useAnalytics";
import Home from "./pages/Home";
import Ecrans from "./pages/Ecrans";
import EcranGeant from "./pages/EcranGeant";
import EcranEtanche from "./pages/EcranEtanche";
import EcranEconomique from "./pages/EcranEconomique";
import Comparaison from "./pages/Comparaison";
import EcransLED from "./pages/EcransLED";
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
import { Redirect } from "wouter";
import Histoire from "./pages/Histoire";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";
import PolitiqueCookies from "./pages/PolitiqueCookies";
import DevenirDistributeur from "./pages/DevenirDistributeur";
import TrouverDistributeur from "./pages/TrouverDistributeur";
import ModeEmploi from "./pages/ModeEmploi";
import GalerieVideo from "./pages/GalerieVideo";
import Blog from "./pages/Blog";
import Profil from "./pages/Profil";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAuditHistory from "./pages/AdminAuditHistory";
import AdminCalculateurs from "./pages/AdminCalculateurs";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Écrans */}
      <Route path={"/ecran-gonflable"} component={Ecrans} />
      <Route path={"/ecran-gonflable-geant-soufflerie"} component={EcranGeant} />
      <Route path={"/ecran-gonflable-etanche-air"} component={EcranEtanche} />
      <Route path={"/ecran-gonflable-economique"} component={EcranEconomique} />
      <Route path={"/comparaison-ecran-gonflable"} component={Comparaison} />
      <Route path={"/ecrans-led"} component={EcransLED} />
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
      <Route path="/devis">{() => <Redirect to="/contactez-nous" />}</Route>
      <Route path="/tarifs-ecran-gonflable">{() => <Redirect to="/contactez-nous" />}</Route>
      <Route path="/demande-de-prix">{() => <Redirect to="/contactez-nous" />}</Route>
      {/* Mode d'emploi & Vidéos */}
      <Route path={"/mode-emploi"} component={ModeEmploi} />
      <Route path={"/galerie-video"} component={GalerieVideo} />
      {/* Blog */}
      <Route path={"/blog"} component={Blog} />
      {/* Distributeurs */}
      <Route path={"/devenir-distributeur"} component={DevenirDistributeur} />
      <Route path={"/trouver-distributeur"} component={TrouverDistributeur} />
      {/* Profil */}
      <Route path={"/profil"} component={Profil} />
      {/* Admin */}
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/analytics"} component={AdminDashboard} />
      <Route path={"/admin/audits"} component={AdminAuditHistory} />
      <Route path={"/admin/calculateurs"} component={AdminCalculateurs} />
      {/* Légal */}
      <Route path={"/mentions-legales"} component={MentionsLegales} />
      <Route path={"/politique-confidentialite"} component={Confidentialite} />
      <Route path={"/politique-cookies"} component={PolitiqueCookies} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AnalyticsTracker() {
  usePageTracking();
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <AnalyticsTracker />
          <Router />
          <WhatsAppButton />
          <HallucineChatbot />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
