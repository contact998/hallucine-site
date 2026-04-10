/*
 * Page 404 — Design cinéma vintage
 * Cohérent avec le thème du site (fond sombre, accents dorés)
 */
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Home, Search, Film, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function NotFound() {
  useDocumentMeta("Page non trouvée | Hallucine", "La page que vous recherchez n'existe pas ou a été déplacée.");

  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container text-center max-w-2xl">
          {/* Bobine de film animée */}
          <div className="relative mb-8 inline-block">
            <div className="w-32 h-32 mx-auto relative">
              {/* Cercle extérieur — bobine */}
              <div className="absolute inset-0 rounded-full border-4 border-warm/40 animate-spin" style={{ animationDuration: '8s' }}>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-warm/60" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-warm/60" />
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-warm/60" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-warm/60" />
              </div>
              {/* Centre */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Film className="w-12 h-12 text-warm" />
              </div>
            </div>
          </div>

          {/* 404 */}
          <h1 className="text-8xl md:text-9xl font-bold text-warm mb-4 tracking-tight" style={{ textShadow: '0 0 40px rgba(212, 175, 55, 0.3)' }}>
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-4">
            Scène introuvable
          </h2>

          <p className="text-white/60 text-lg mb-4 leading-relaxed max-w-lg mx-auto">
            On dirait que cette bobine s'est perdue en chemin.
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>

          <p className="text-white/40 text-sm mb-10">
            Pas de panique — le projecteur tourne toujours.
          </p>

          {/* Pellicule décorative */}
          <div className="flex justify-center gap-1 mb-10 opacity-30">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-6 h-8 border border-warm/50 rounded-sm" />
            ))}
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-warm/30 text-warm rounded hover:bg-warm/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
            >
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Link>
            <Link
              href="/contactez-nous"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white/70 rounded hover:text-warm hover:border-warm/30 transition-colors"
            >
              <Search className="w-4 h-4" />
              Nous contacter
            </Link>
          </div>

          {/* Liens rapides */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-white/40 text-sm mb-4">Pages populaires</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "Écrans gonflables", href: "/ecran-gonflable" },
                { label: "Tentes gonflables", href: "/tente-gonflable" },
                { label: "Galerie", href: "/galerie-evenements" },
                { label: "Demander un devis", href: "/contactez-nous" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded text-white/60 hover:text-warm hover:border-warm/30 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
