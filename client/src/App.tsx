import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import WhatsAppButton from "./components/WhatsAppButton";
import HallucineChatbot from "./components/HallucineChatbot";
import { ThemeProvider } from "./contexts/ThemeContext";
import { usePageTracking } from "./hooks/useAnalytics";

// Lazy-loaded pages (code splitting)
const Home = lazy(() => import("./pages/Home"));
const Ecrans = lazy(() => import("./pages/Ecrans"));
const EcranGeant = lazy(() => import("./pages/EcranGeant"));
const EcranEtanche = lazy(() => import("./pages/EcranEtanche"));
const EcranEconomique = lazy(() => import("./pages/EcranEconomique"));
const Comparaison = lazy(() => import("./pages/Comparaison"));
const EcransLED = lazy(() => import("./pages/EcransLED"));
const Tentes = lazy(() => import("./pages/Tentes"));
const TentesX = lazy(() => import("./pages/TentesX"));
const TentesN = lazy(() => import("./pages/TentesN"));
const TentesV = lazy(() => import("./pages/TentesV"));
const TentesAraignees = lazy(() => import("./pages/TentesAraignees"));
const ArchesGonflables = lazy(() => import("./pages/ArchesGonflables"));
const Mobilier = lazy(() => import("./pages/Mobilier"));
const Accessoires = lazy(() => import("./pages/Accessoires"));
const Galerie = lazy(() => import("./pages/Galerie"));
const Contact = lazy(() => import("./pages/Contact"));
const APropos = lazy(() => import("./pages/APropos"));
const Histoire = lazy(() => import("./pages/Histoire"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const Confidentialite = lazy(() => import("./pages/Confidentialite"));
const PolitiqueCookies = lazy(() => import("./pages/PolitiqueCookies"));
const DevenirDistributeur = lazy(() => import("./pages/DevenirDistributeur"));
const TrouverDistributeur = lazy(() => import("./pages/TrouverDistributeur"));
const ModeEmploi = lazy(() => import("./pages/ModeEmploi"));
const GalerieVideo = lazy(() => import("./pages/GalerieVideo"));
const Blog = lazy(() => import("./pages/Blog"));
const Profil = lazy(() => import("./pages/Profil"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminAuditHistory = lazy(() => import("./pages/AdminAuditHistory"));
const AdminCalculateurs = lazy(() => import("./pages/AdminCalculateurs"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#DAA520] border-t-transparent rounded-full animate-spin" />
        <span className="text-muted-foreground text-sm">Chargement…</span>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
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
