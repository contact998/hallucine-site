/*
 * Page Galerie
 * Grille de photos d'événements — placeholder pour les vraies photos
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Camera } from "lucide-react";

const categories = [
  "Tous", "Écrans gonflables", "Tentes", "Arches", "Mobilier", "Événements"
];

export default function Galerie() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Portfolio</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Galerie
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Découvrez nos réalisations à travers le monde. Écrans de cinéma gonflables, tentes événementielles, 
            arches et mobilier — nos produits en action lors d'événements réels.
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  cat === "Tous"
                    ? "bg-warm text-charcoal font-semibold"
                    : "bg-card border border-border text-white/60 hover:text-warm hover:border-warm/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grille placeholder */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-card border border-border rounded-lg flex flex-col items-center justify-center gap-3 hover:border-warm/30 transition-colors"
              >
                <Camera className="w-8 h-8 text-white/20" />
                <p className="text-white/30 text-xs">Photo à venir</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-white/50 text-sm">
              Cette galerie sera bientôt enrichie avec les photos de nos réalisations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Envie de voir votre événement ici ?</h2>
          <p className="text-white/60 mb-8">Contactez-nous pour organiser votre prochain événement avec Hallucine.</p>
          <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors inline-block">
            Nous Contacter
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
