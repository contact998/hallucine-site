import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Ecrans from "./pages/Ecrans";
import Tentes from "./pages/Tentes";
import Mobilier from "./pages/Mobilier";
import Histoire from "./pages/Histoire";
import Contact from "./pages/Contact";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/ecrans"} component={Ecrans} />
      <Route path={"/tentes"} component={Tentes} />
      <Route path={"/mobilier"} component={Mobilier} />
      <Route path={"/notre-histoire"} component={Histoire} />
      <Route path={"/contact"} component={Contact} />
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
