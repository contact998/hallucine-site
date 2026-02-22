/*
 * Page Galerie
 * Grille de photos d'événements avec filtrage par catégorie
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const photos = [
  // Écrans gonflables
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/oDtUBYZZFsCNDfjT.JPG", alt: "Écran gonflable 2.5m sur pieds pour projection en extérieur", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/jehwdTBugibhhkqD.jpg", alt: "Écran de cinéma gonflable de nuit sur toit d'immeuble", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ToYOcoZKNzviDegc.jpg", alt: "Projection nocturne sur écran gonflable installé sur un toit", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/JMsbNQksEitYvcle.JPG", alt: "Écran gonflable avec arche sur toit-terrasse", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/GLxgsBrksfUScqkK.webp", alt: "Écran 5m léger en gymnase pour la FIFA", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/MKPEYgRVUhwZagRz.webp", alt: "Le plus fin écran gonflable 8m de large", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/dnaHKJUkWzquIkBm.webp", alt: "Écran gonflable 8m de base à Saint-Germain", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/PNHSEIDaxMouReeA.webp", alt: "Écran géant gonflable 24m à Marseille", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/ecran%20etanches.jpg", alt: "Écran de cinéma gonflable étanche à l'air, idéal pour les piscines", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/Le%20cin%C3%A9ma%20%C3%A0%20la%20maison%20037.jpg", alt: "Comparaison de la taille d'un écran gonflable étanche avec une personne", cat: "Écrans gonflables" },
  { src: "https://www.hallucinecran.com/ECRAN%207-5.jpg", alt: "Vue arrière d'un écran de cinéma gonflable étanche de 7.5 mètres", cat: "Écrans gonflables" },

  // Événements & Projections
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/BTjyZEhykZpPjzlQ.webp", alt: "Séance de cinéma en plein air avec public nombreux", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/DJEXdRAiXtMmgFgf.webp", alt: "Projection à Bruxelles à la tombée de la nuit", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/GpjovoMlGINeFMkR.webp", alt: "Événement cinéma en plein air avec écran gonflable", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/lcLThLwfTTAXwyBC.webp", alt: "Projection en plein air à Toulouse", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ZJLHpcrslCpBUeho.webp", alt: "Projecteur 2x7kW laser au Vélodrome de Marseille", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HFTCwgTzDKgkyobW.webp", alt: "Cinéma drive-in en Suisse avec écran gonflable", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/hCyoAdrmBRzMqSkf.webp", alt: "Projection événementielle en extérieur", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/VVKgUSkUMrWjPLli.webp", alt: "Cinéma en plein air à Paris, Cour du Ritz", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/LjmRQcBgphFHinix.webp", alt: "Passeur d'images — projection itinérante", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/AVwdDnnQdSJYUpVA.webp", alt: "3 écrans pour mapping vidéo à Dunkerque", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/LlViPqGlNfhaOSBj.webp", alt: "Projection événementielle grand format en extérieur", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/hQhZlOwcgvxTqzcb.webp", alt: "Installation haubanée à Saint-Denis avec bouches d'égout", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ORldRrkOZGNhugrg.webp", alt: "Projection en ville sur écran gonflable", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/mMmglvIttlPcaegT.webp", alt: "Événement cinéma plein air nocturne", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/JKWZTtzrHGzWkLIy.webp", alt: "Projection en extérieur avec public assis", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HGcGiGvBnBpnEaiM.webp", alt: "Séance de cinéma en plein air ambiance festive", cat: "Événements" },
  { src: "https://www.hallucinecran.com/Gallery/46.webp", alt: "Concert de musique classique en soirée avec un orchestre sur scène", cat: "Événements" },
  { src: "https://www.hallucinecran.com/Gallery/47.webp", alt: "Ambiance d'une séance de cinéma en plein air de nuit", cat: "Événements" },
  { src: "https://www.hallucinecran.com/Gallery/48.webp", alt: "Projection d'un film en extérieur pour un petit groupe sur l'herbe", cat: "Événements" },
  { src: "https://www.hallucinecran.com/Gallery/49.webp", alt: "Séance de cinéma drive-in avec voitures devant un grand écran gonflable", cat: "Événements" },

  // Équipement technique
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/nbvuaBPDkUozfSFa.webp", alt: "Projecteur Barco en hauteur pour projection grand format", cat: "Équipement" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/hlNfdLDVazoQchxk.webp", alt: "Cabine de projection mobile pour cinéma en plein air", cat: "Équipement" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/qtzJtKXwRloXHfEO.webp", alt: "Équipement audiovisuel pour projection en extérieur", cat: "Équipement" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/lmEozjPugTLSAHVj.webp", alt: "Setup technique pour événement cinéma plein air", cat: "Équipement" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/JQhWDpMEkFFtjlJP.webp", alt: "Installation technique complète pour projection en extérieur", cat: "Équipement" },

  // Tentes
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/tente-x.jpg", alt: "Tente gonflable en forme de X pour événements", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/671bade5ef4fb27a93d3034de910dc4.jpg", alt: "Tente gonflable événementielle en forme de X", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/1078c8cca1c101dbe2d41d70cadf4a0.jpg", alt: "Tentes gonflables en forme de X personnalisées avec logos", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/ntent.jpg", alt: "Tente gonflable modèle N Hallucine", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/761c537e749de68e706a65456057742.jpg", alt: "Tente gonflable modèle N personnalisée Volvo", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/tentes-gonflables-n-croix-rouge.jpg", alt: "Tente gonflable modèle N Croix-Rouge", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%201.jpg", alt: "Tente gonflable blanche en forme de V", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%202.jpg", alt: "Tente gonflable blanche en forme de V — autre vue", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/Tentes/Tents%20spider/Sider%20tentes%20bleues.jpg", alt: "Tentes gonflables bleues en forme d'araignée", cat: "Tentes" },
  { src: "https://www.hallucinecran.com/photoset/Tents%20spider/Sider%20tentes%20noir%20jaunes.jpg", alt: "Tentes gonflables en forme d'araignée noire et jaune", cat: "Tentes" },

  // Arches
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/msjlSvvcXPPgZNDW.png", alt: "Arche gonflable pour festival de cinéma en plein air", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/qaWexEDLrhQudeax.png", alt: "Arche gonflable ligne d'arrivée course sportive", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CZcgjOTtIqUOapyp.jpg", alt: "Arche gonflable personnalisée pour projection en plein air", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/dRuvKidcdjNXhYOn.jpg", alt: "Arche gonflable de bienvenue pour événement", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/zbkdmCgoFZLzrsJh.jpg", alt: "Arche gonflable blanche personnalisable", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/PccZsJjRQKmTphXx.jpg", alt: "Arche gonflable bleue pour événement sportif", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/eWinssACUrKSNlmM.jpg", alt: "Arche gonflable publicitaire SKYGO", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/QBUmTczXjVzScxWG.jpg", alt: "Arche gonflable modèle standard Hallucine", cat: "Arches" },

  // Mobilier
  { src: "https://www.hallucinecran.com/Tentes/meubles/canape%20fauteuil%20noir%20rouge.jpg", alt: "Canapé et fauteuil gonflables noirs et rouges", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/fauteuil.jpg", alt: "Fauteuil gonflable individuel pour événement", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/Bar.jpg", alt: "Bar comptoir gonflable pour événement en plein air", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/mange%20debout.jpg", alt: "Table mange-debout gonflable pour cocktail", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/fauteuils%20tabouret.jpg", alt: "Fauteuils et tabourets gonflables espace lounge", cat: "Mobilier" },
  { src: "https://www.hallucinecran.com/Tentes/meubles/canape%20bleu.jpg", alt: "Canapé gonflable bleu deux places", cat: "Mobilier" },
];

const categories = ["Tous", "Écrans gonflables", "Événements", "Équipement", "Tentes", "Arches", "Mobilier"];

export default function Galerie() {
  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "Tous" ? photos : photos.filter((p) => p.cat === filter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-black">
        <div className="relative w-full" style={{ aspectRatio: '16/7' }}>
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/BTjyZEhykZpPjzlQ.webp"
            alt="Cinéma en plein air Hallucine"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/20" />
          {/* Titre + filtres sur la même ligne en haut */}
          <div className="absolute top-0 left-0 right-0 container z-10 pt-40">
            <div className="flex items-center gap-6 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-bold text-ivory leading-tight shrink-0">
                Galerie
              </h1>
              <div className="flex flex-wrap gap-2 items-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-3 py-1.5 text-xs rounded transition-colors ${
                      cat === filter
                        ? "bg-warm text-charcoal font-semibold"
                        : "bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:text-warm hover:border-warm/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Description centrée en bas */}
          <div className="absolute bottom-0 left-0 right-0 z-10 pb-6">
            <p className="text-white/50 text-base md:text-lg max-w-3xl mx-auto text-center leading-relaxed">
              Découvrez nos réalisations à travers le monde. Écrans de cinéma gonflables, tentes événementielles, 
              arches et mobilier — nos produits en action lors d'événements réels.
            </p>
          </div>
        </div>
      </section>



      {/* Barre filtres centrée */}
      <div className="bg-background border-b border-border">
        <div className="container py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={`bar-${cat}`}
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
      </div>

      {/* Grille photos */}
      <section className="py-12 bg-background">
        <div className="container">
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
