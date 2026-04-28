import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import WhatsAppButton from "./components/WhatsAppButton";
const HallucineChatbot = lazy(() => import("./components/HallucineChatbot"));
import { ThemeProvider } from "./contexts/ThemeContext";
import { usePageTracking } from "./hooks/useAnalytics";
import { useCanonical } from "./hooks/useCanonical";
import GlobalStructuredData from "./components/GlobalStructuredData";
import { detectLanguage } from "./i18n/domains";
import { ROUTES } from "./i18n/routes";

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
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Profil = lazy(() => import("./pages/Profil"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminAuditHistory = lazy(() => import("./pages/AdminAuditHistory"));
const AdminCalculateurs = lazy(() => import("./pages/AdminCalculateurs"));
const AdminMedia = lazy(() => import("./pages/AdminMedia"));
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
  // Détecte la langue selon le domaine (production) ou ?lang= (dev)
  const lang = detectLanguage();
  const r = ROUTES[lang] ?? ROUTES["fr"];

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Home} />
        {/* Écrans */}
        <Route path={r["ecrans"]} component={Ecrans} />
        <Route path={r["ecran-geant"]} component={EcranGeant} />
        <Route path={r["ecran-etanche"]} component={EcranEtanche} />
        <Route path={r["ecran-economique"]} component={EcranEconomique} />
        <Route path={r["comparaison"]} component={Comparaison} />
        <Route path={r["ecrans-led"]} component={EcransLED} />
        {/* Tentes */}
        <Route path={r["tentes"]} component={Tentes} />
        <Route path={r["tente-x"]} component={TentesX} />
        <Route path={r["tente-n"]} component={TentesN} />
        <Route path={r["tente-v"]} component={TentesV} />
        <Route path={r["tente-araignee"]} component={TentesAraignees} />
        {/* Arches */}
        <Route path={r["arches"]} component={ArchesGonflables} />
        {/* Mobilier */}
        <Route path={r["mobilier"]} component={Mobilier} />
        {/* Accessoires */}
        <Route path={r["accessoires"]} component={Accessoires} />
        {/* Galerie */}
        <Route path={r["galerie"]} component={Galerie} />
        <Route path={r["galerie-video"]} component={GalerieVideo} />
        {/* Contact */}
        <Route path={r["contact"]} component={Contact} />
        {/* Plus */}
        <Route path={r["a-propos"]} component={APropos} />
        <Route path={r["histoire"]} component={Histoire} />
        {/* Mode d'emploi */}
        <Route path={r["mode-emploi"]} component={ModeEmploi} />
        {/* Blog */}
        <Route path={r["blog"]} component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        {/* Distributeurs */}
        <Route path={r["devenir-distributeur"]} component={DevenirDistributeur} />
        <Route path={r["trouver-distributeur"]} component={TrouverDistributeur} />
        {/* Légal */}
        <Route path={r["mentions-legales"]} component={MentionsLegales} />
        <Route path={r["confidentialite"]} component={Confidentialite} />
        <Route path={r["cookies"]} component={PolitiqueCookies} />
        {/* Redirections FR legacy (compatibilité) */}
        <Route path="/devis">{() => <Redirect to={r["contact"]} />}</Route>
        <Route path="/tarifs-ecran-gonflable">{() => <Redirect to={r["contact"]} />}</Route>
        <Route path="/demande-de-prix">{() => <Redirect to={r["contact"]} />}</Route>
        {/* Profil */}
        <Route path={"/profil"} component={Profil} />
        {/* Admin */}
        <Route path={"/login"} component={Login} />
        <Route path={"/admin"} component={Admin} />
        <Route path={"/admin/analytics"} component={AdminDashboard} />
        <Route path={"/admin/audits"} component={AdminAuditHistory} />
        <Route path={"/admin/calculateurs"} component={AdminCalculateurs} />
        <Route path={"/admin/media"} component={AdminMedia} />
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

function CanonicalUpdater() {
  useCanonical();
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <AnalyticsTracker />
          <CanonicalUpdater />
          <GlobalStructuredData />
          <Router />
          <WhatsAppButton />
          <Suspense fallback={null}>
            <HallucineChatbot />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
