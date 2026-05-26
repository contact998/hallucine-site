import { Suspense, lazy, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import PageFrame from "./components/PageFrame";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import FloatingContactWidget from "./components/FloatingContactWidget";
const HallucineChatbot = lazy(() => import("./components/HallucineChatbot"));
import { ThemeProvider } from "./contexts/ThemeContext";
import { usePageTracking } from "./hooks/useAnalytics";
import { useCanonical } from "./hooks/useCanonical";
import GlobalStructuredData from "./components/GlobalStructuredData";
import { detectLanguage } from "./i18n/domains";
import { ROUTES } from "./i18n/routes";

// Pages — composants lazy via le registre (source unique partagée avec main.tsx)
import {
  Home, Ecrans, EcranGeant, EcranEtanche, EcranEconomique, Comparaison,
  Configurateur, DriveIn, Packs, Location, EtudesCas, CasVelodrome, CasOran, EcransLED, Tentes, TentesX, TentesN, TentesV, TentesAraignees,
  ArchesGonflables, Mobilier, Accessoires, Galerie, GalerieVideo, Contact,
  APropos, Histoire, ModeEmploi, Blog, BlogPost, DevenirDistributeur,
  MentionsLegales, Confidentialite, PolitiqueCookies,
  Profil, Admin, AdminDashboard, AdminAuditHistory, AdminCalculateurs,
  AdminMedia, AdminBlog, Login, NotFound,
} from "./pages/registry";

function PageLoader() {
  // N'affiche l'indicateur que si le chargement dépasse 200 ms. Les chargements
  // rapides ne montrent rien → plus de flash furtif du spinner à la navigation.
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-warm border-t-transparent rounded-full animate-spin" />
        <span className="text-muted-foreground text-sm">Chargement…</span>
      </div>
    </div>
  );
}

function RoutesSwitch() {
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
        <Route path={r["configurateur"]} component={Configurateur} />
        <Route path={r["drive-in"]} component={DriveIn} />
        <Route path={r["packs"]} component={Packs} />
        <Route path={r["location"]} component={Location} />
        <Route path={r["etudes-cas"]} component={EtudesCas} />
        <Route path={r["cas-velodrome"]} component={CasVelodrome} />
        <Route path={r["cas-oran"]} component={CasOran} />
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
        {/* Ancienne page « Trouver un distributeur » fusionnée → redirection */}
        <Route path={r["trouver-distributeur"]}>{() => <Redirect to={r["devenir-distributeur"]} />}</Route>
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
        <Route path={"/admin/blog"} component={AdminBlog} />
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
  // Les widgets purement client (Toaster, WhatsApp, chatbot) ne sont PAS dans
  // le HTML pré-rendu. On les monte après l'hydratation pour que le 1er rendu
  // client corresponde exactement au rendu serveur (GlobalStructuredData + page).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          {/* Contenu hydraté — identique au SSR */}
          <AnalyticsTracker />
          <CanonicalUpdater />
          <ScrollToTop />
          <GlobalStructuredData />
          <RoutesSwitch />
          <PageFrame />
          {/* Widgets client-only — montés après hydratation */}
          {mounted && (
            <>
              <Toaster />
              <FloatingContactWidget />
              <WhatsAppButton />
              <Suspense fallback={null}>
                <HallucineChatbot />
              </Suspense>
            </>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
