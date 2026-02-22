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
  { src: "https://www.hallucinecran.com/Giant%20Inf/1.webp", alt: "Écran géant gonflable pour cinéma en plein air dans le centre-ville de Paris", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Products/21.PNG", alt: "Installation d'un écran géant gonflable pour un événement au château de Vincennes", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Products/ecran-geant-gonflable-24x15-metres.PNG", alt: "Très grand écran de cinéma gonflable de 24x15 mètres au stade Vélodrome de Marseille", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Products/23.PNG", alt: "Écran géant gonflable publicitaire pour la compagnie aérienne Air Tahiti Nui", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Products/24.PNG", alt: "Écran de cinéma gonflable géant installé sur la pelouse du stade Orange Vélodrome à Marseille", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/4.webp", alt: "Diffusion d'un film sur un écran géant gonflable sur le pont d'un bateau de croisière", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/6.webp", alt: "Spectacle nocturne avec trois écrans géants gonflables et un feu d'artifice", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/8.webp", alt: "Trois écrans de cinéma gonflables installés en plein air au coucher du soleil", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/9.webp", alt: "Démonstration du montage facile d'un écran géant gonflable par une équipe de trois personnes", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/10.webp", alt: "Vue de l'écran géant gonflable depuis les gradins du stade Vélodrome Orange à Marseille", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/ecran%20etanches.jpg", alt: "Présentation d'un écran de cinéma gonflable étanche à l'air, idéal pour les piscines", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Le%20cin%C3%A9ma%20%C3%A0%20la%20maison%20037.jpg", alt: "Comparaison de la taille d'un écran gonflable étanche avec une personne pour montrer son échelle", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/ECRAN%207-5.jpg", alt: "Vue arrière d'un écran de cinéma gonflable et étanche de 7.5 mètres de large", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/1/20160902_183937.jpg", alt: "Installation d'un écran gonflable économique pour une projection dans la cour d'un immeuble", cat: "Écrans gonflables" },
  // Tentes
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/tente-x.jpg", alt: "Vue de profil d'une tente gonflable en forme de X pour événements", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/671bade5ef4fb27a93d3034de910dc4.jpg", alt: "Vue de face d'une tente gonflable événementielle en forme de X", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/1078c8cca1c101dbe2d41d70cadf4a0.jpg", alt: "Exemples de tentes gonflables en forme de X personnalisées avec des logos de marques", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/ntent.jpg", alt: "Vue latérale d'une tente gonflable modèle N de marque Hallucine", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/761c537e749de68e706a65456057742.jpg", alt: "Tente gonflable modèle N personnalisée pour la marque automobile Volvo", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/tentes-gonflables-n-croix-rouge.jpg", alt: "Tente gonflable modèle N utilisée comme poste de premiers secours par la Croix-Rouge", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%201.jpg", alt: "Vue d'une tente gonflable événementielle blanche en forme de V", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%202.jpg", alt: "Autre vue d'une tente gonflable événementielle blanche en forme de V", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tents%20spider/Sider%20tentes%20bleues.jpg", alt: "Plusieurs tentes gonflables bleues en forme d'araignée pour un événement en extérieur", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/photoset/Tents%20spider/Sider%20tentes%20noir%20jaunes.jpg", alt: "Tentes gonflables événementielles en forme d'araignée, de couleur noire et jaune", cat: "Tentes" },
  // Arches
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/msjlSvvcXPPgZNDW.png", alt: "Arche gonflable pour l'entrée d'un festival de cinéma en plein air 'Cinéma sous les étoiles", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/qaWexEDLrhQudeax.png", alt: "Arche gonflable marquant la ligne d'arrivée d'une course ou d'un marathon", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CZcgjOTtIqUOapyp.jpg", alt: "Arche gonflable personnalisée pour l'entrée d'une projection de film en plein air", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/dRuvKidcdjNXhYOn.jpg", alt: "Arche gonflable de bienvenue pour un événement de rentrée scolaire en 2025", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/zbkdmCgoFZLzrsJh.jpg", alt: "Arche gonflable blanche et personnalisable pour un mariage ou un événement d'entreprise", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/PccZsJjRQKmTphXx.jpg", alt: "Arche gonflable de couleur bleue pour un événement sportif ou commercial", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/eWinssACUrKSNlmM.jpg", alt: "Installation d'une arche gonflable publicitaire bleue pour la marque SKYGO", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/QBUmTczXjVzScxWG.jpg", alt: "Modèle standard d'une arche gonflable de la marque Hallucine", cat: "Arches" },
  // Mobilier
  { src: "https://www.hallucinecran.com/Tentes/meubles/canape%20fauteuil%20noir%20rouge.jpg", alt: "Ensemble de mobilier événementiel gonflable comprenant un canapé et un fauteuil noirs et rouges", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/fauteuil.jpg", alt: "Fauteuil gonflable individuel pour se détendre lors d'un événement individuel pour se détendre lors d'un événement", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/Bar.jpg", alt: "Bar ou comptoir de service gonflable pour un événement en plein air", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/mange%20debout.jpg", alt: "Table haute de type mange-debout gonflable pour un cocktail ou une réception", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/fauteuils%20tabouret.jpg", alt: "Assortiment de fauteuils et tabourets gonflables pour un espace lounge événementiel", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/canape%20bleu.jpg", alt: "Canapé gonflable deux places de couleur bleue pour un événement", cat: "Mobilier" },
  // Événements
  { src: "https://www.hallucinecran.com/Gallery/37.webp", alt: "Événement en plein air organisé par Canal+ avec un grand écran gonflable", cat: "Événements" },
  { src: "https://www.hallucinecran.com/Gallery/46.webp", alt: "Concert de musique classique en soirée avec un orchestre sur scène et un écran géant", cat: "Événements" },
  { src: "https://www.hallucinecran.com/Gallery/47.webp", alt: "Ambiance d'une séance de cinéma en plein air de nuit avec un public nombreux", cat: "Événements" },
  { src: "https://www.hallucinecran.com/Gallery/48.webp", alt: "Projection d'un film en extérieur pour un petit groupe de personnes assises sur l'herbe", cat: "Événements" },
  { src: "https://www.hallucinecran.com/Gallery/49.webp", alt: "Séance de cinéma drive-in avec des voitures garées devant un grand écran gonflable", cat: "Événements" },
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
      <section className="relative overflow-hidden min-h-[500px] flex items-center justify-center">
        <img
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/BTjyZEhykZpPjzlQ.webp"
          alt="Cinéma en plein air Hallucine"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 70%' }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <FlashEffect />
        <div className="container relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight">
            Galerie
          </h1>
        </div>
      </section>

      {/* Description sous l'image */}
      <section className="py-8 bg-background">
        <div className="container">
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
