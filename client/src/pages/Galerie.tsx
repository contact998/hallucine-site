/*
 * Page Galerie
 * Grille de photos d'événements avec filtrage par catégorie
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import FlashEffect from "@/components/FlashEffect";

const photos = [
  // Écrans gonflables
  { src: "https://www.hallucinecran.com/Giant%20Inf/1.webp", alt: "Écran géant gonflable centre-ville de Paris", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Products/21.PNG", alt: "Écran géant gonflable au château de Vincennes", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Products/ecran-geant-gonflable-24x15-metres.PNG", alt: "Écran géant gonflable 24×15m au stade Vélodrome", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Products/23.PNG", alt: "Écran géant gonflable Air Tahiti Nui", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Products/24.PNG", alt: "Écran géant gonflable Orange Vélodrome Marseille", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/4.webp", alt: "Écran géant gonflable sur bateau de croisière", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/6.webp", alt: "Trois écrans géants gonflables avec feu d'artifice", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/8.webp", alt: "Trois écrans géants au coucher du soleil", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/9.webp", alt: "Montage écran géant — 3 personnes suffisent", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/10.webp", alt: "Écran géant au stade Vélodrome Orange Marseille", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/ecran%20etanches.jpg", alt: "Écran gonflable étanche à l'air", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Le%20cin%C3%A9ma%20%C3%A0%20la%20maison%20037.jpg", alt: "Écran étanche — comparaison taille humaine", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/ECRAN%207-5.jpg", alt: "Écran étanche 7.5m vue arrière", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/1/20160902_183937.jpg", alt: "Écran économique dans la cour d'un bâtiment", cat: "Écrans gonflables" },
  // Tentes
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/tente-x.jpg", alt: "Tente gonflable X — vue de côté", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/671bade5ef4fb27a93d3034de910dc4.jpg", alt: "Tente gonflable X — vue de face", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/1078c8cca1c101dbe2d41d70cadf4a0.jpg", alt: "Tentes gonflables X personnalisables", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/ntent.jpg", alt: "Tente N Hallucine — vue de côté", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/761c537e749de68e706a65456057742.jpg", alt: "Tente N Volvo", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/tentes-gonflables-n-croix-rouge.jpg", alt: "Tente N premiers secours Croix-Rouge", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%201.jpg", alt: "Tente V blanche — vue 1", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%202.jpg", alt: "Tente V blanche — vue 2", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tents%20spider/Sider%20tentes%20bleues.jpg", alt: "Tentes araignées bleues", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/photoset/Tents%20spider/Sider%20tentes%20noir%20jaunes.jpg", alt: "Tentes araignées noir et jaune", cat: "Tentes" },
  // Arches
  { src: "https://www.hallucinecran.com/Tentes/Arches/arche%20bleue.jpg", alt: "Arche gonflable bleue", cat: "Arches" },
  { src: "https://www.hallucinecran.com/Tentes/Arches/arche%20orange.jpg", alt: "Arche gonflable orange", cat: "Arches" },
  { src: "https://www.hallucinecran.com/Tentes/Arches/arche%20rouge.jpg", alt: "Arche gonflable rouge", cat: "Arches" },
  { src: "https://www.hallucinecran.com/Tentes/Arches/arche%20verte.jpg", alt: "Arche gonflable verte", cat: "Arches" },
  { src: "https://www.hallucinecran.com/Tentes/Arches/arche%20blanche.jpg", alt: "Arche gonflable blanche", cat: "Arches" },
  { src: "https://www.hallucinecran.com/Tentes/Arches/arche%20noire.jpg", alt: "Arche gonflable noire", cat: "Arches" },
  // Mobilier
  { src: "https://www.hallucinecran.com/Tentes/meubles/canape%20fauteuil%20noir%20rouge.jpg", alt: "Canapé et fauteuil gonflable noir et rouge", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/fauteuil.jpg", alt: "Fauteuil gonflable", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/Bar.jpg", alt: "Bar gonflable", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/mange%20debout.jpg", alt: "Mange-debout gonflable", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/fauteuils%20tabouret.jpg", alt: "Fauteuils et tabourets gonflables", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/canape%20bleu.jpg", alt: "Canapé gonflable bleu", cat: "Mobilier" },
  // Événements
  { src: "https://www.hallucinecran.com/Gallery/37.webp", alt: "Événement Canal+ avec écran géant", cat: "Événements" },
  { src: "https://www.hallucinecran.com/Gallery/46.webp", alt: "Concert de musique classique en plein air", cat: "Événements" },
  { src: "https://www.hallucinecran.com/Gallery/47.webp", alt: "Cinéma en plein air — ambiance nocturne", cat: "Événements" },
  { src: "https://www.hallucinecran.com/Gallery/48.webp", alt: "Projection en extérieur — petit public", cat: "Événements" },
  { src: "https://www.hallucinecran.com/Gallery/49.webp", alt: "Cinéma drive-in avec écran gonflable", cat: "Événements" },
];

const categories = ["Tous", "Écrans gonflables", "Tentes", "Arches", "Mobilier", "Événements"];

export default function Galerie() {
  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "Tous" ? photos : photos.filter((p) => p.cat === filter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <FlashEffect />
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
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  cat === filter
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

      {/* Grille photos */}
      <section className="py-12 bg-background">
        <div className="container">
          <p className="text-white/50 text-sm mb-6">{filtered.length} photo{filtered.length > 1 ? "s" : ""}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((photo, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => setLightbox(i)}
              >
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">{photo.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          {lightbox > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
            >
              ‹
            </button>
          )}
          {lightbox < filtered.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
            >
              ›
            </button>
          )}
          <div className="max-w-5xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <img src={filtered[lightbox].src} alt={filtered[lightbox].alt} className="max-w-full max-h-[80vh] object-contain rounded" />
            <p className="text-white/70 text-sm mt-3 text-center">{filtered[lightbox].alt}</p>
          </div>
        </div>
      )}

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
