/*
 * Page Galerie
 * Grille de photos d'événements avec filtrage par catégorie
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

const photos = [
  // Écrans gonflables
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/iHeKkriOUImCLwKk.webp", alt: "Écran gonflable 2.5m sur pieds pour projection en extérieur", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/lIHVsQcOijumuBQx.webp", alt: "Écran de cinéma gonflable de nuit sur toit d'immeuble", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/hZzmERjPunHTTNsQ.webp", alt: "Projection nocturne sur écran gonflable installé sur un toit", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ucPMyEUniRmyKEdn.webp", alt: "Écran gonflable avec arche sur toit-terrasse", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/GLxgsBrksfUScqkK.webp", alt: "Écran 5m léger en gymnase pour la FIFA", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/MKPEYgRVUhwZagRz.webp", alt: "Le plus fin écran gonflable 8m de large", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/dnaHKJUkWzquIkBm.webp", alt: "Écran gonflable 8m de base à Saint-Germain", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/PNHSEIDaxMouReeA.webp", alt: "Écran géant gonflable 24m à Marseille", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/YMJYpUnslhOmIiPC.webp", alt: "Écran de cinéma gonflable étanche à l'air, idéal pour les piscines", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/TXuxOQPMMNpkSJyD.webp", alt: "Comparaison de la taille d'un écran gonflable étanche avec une personne", cat: "Écrans gonflables" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/XDRRcwbNXnMRbTnK.webp", alt: "Vue arrière d'un écran de cinéma gonflable étanche de 7.5 mètres", cat: "Écrans gonflables" },

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
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ZoMWmWANxpLZiwgl.webp", alt: "Concert de musique classique en soirée avec un orchestre sur scène", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ncYxRulsuwTbmqyt.webp", alt: "Ambiance d'une séance de cinéma en plein air de nuit", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/BFaZoFomGXqerqBf.webp", alt: "Projection d'un film en extérieur pour un petit groupe sur l'herbe", cat: "Événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/wfNnGSUZpZLANRrm.webp", alt: "Séance de cinéma drive-in avec voitures devant un grand écran gonflable", cat: "Événements" },

  // Équipement technique
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/nbvuaBPDkUozfSFa.webp", alt: "Projecteur Barco en hauteur pour projection grand format", cat: "Équipement" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/hlNfdLDVazoQchxk.webp", alt: "Cabine de projection mobile pour cinéma en plein air", cat: "Équipement" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/qtzJtKXwRloXHfEO.webp", alt: "Équipement audiovisuel pour projection en extérieur", cat: "Équipement" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/lmEozjPugTLSAHVj.webp", alt: "Setup technique pour événement cinéma plein air", cat: "Équipement" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/JQhWDpMEkFFtjlJP.webp", alt: "Installation technique complète pour projection en extérieur", cat: "Équipement" },

  // Tentes
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/WBPtkVmXwYeQzylG.webp", alt: "Tente gonflable en forme de X pour événements", cat: "Tentes" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/gfjZlUztmRpFkTMl.webp", alt: "Tente gonflable événementielle en forme de X", cat: "Tentes" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/wSyrwQstEehyPZjG.webp", alt: "Tentes gonflables en forme de X personnalisées avec logos", cat: "Tentes" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/datZthCdkwHITcDv.webp", alt: "Tente gonflable modèle N Hallucine", cat: "Tentes" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/wxhmpeFVNRrkuyZM.webp", alt: "Tente gonflable modèle N personnalisée Volvo", cat: "Tentes" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/PSRTSVMjlaeIrCsx.webp", alt: "Tente gonflable modèle N Croix-Rouge", cat: "Tentes" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/sULADLfdWVDOnRle.webp", alt: "Tente gonflable blanche en forme de V", cat: "Tentes" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/smDtImRPUmKTicoC.webp", alt: "Tente gonflable blanche en forme de V — autre vue", cat: "Tentes" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/XOAINGMCdjrkSVSl.webp", alt: "Tentes gonflables bleues en forme d'araignée", cat: "Tentes" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/foieoRxOMClglGqw.webp", alt: "Tentes gonflables en forme d'araignée noire et jaune", cat: "Tentes" },

  // Arches
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/AmZzmccAPAWiJMXu.webp", alt: "Arche gonflable pour festival de cinéma en plein air", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/URHUGqPUFQmnMZRI.webp", alt: "Arche gonflable ligne d'arrivée course sportive", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/uMgcuJpZiBQPPGmX.webp", alt: "Arche gonflable personnalisée pour projection en plein air", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ugvUXaZIOpaTTSGL.webp", alt: "Arche gonflable de bienvenue pour événement", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/nNXWzRdxpJfkgHDY.webp", alt: "Arche gonflable blanche personnalisable", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/VAKfQtrSnnVPEWpY.webp", alt: "Arche gonflable bleue pour événement sportif", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/LAhtJVWpmNguSbyg.webp", alt: "Arche gonflable publicitaire SKYGO", cat: "Arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/SozTrHGryVKjifJR.webp", alt: "Arche gonflable modèle standard Hallucine", cat: "Arches" },

  // Mobilier
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UIcmejSadRWEtlDG.webp", alt: "Canapé et fauteuil gonflables noirs et rouges", cat: "Mobilier" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/kCJQHsGvphErugzQ.webp", alt: "Fauteuil gonflable individuel pour événement", cat: "Mobilier" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/hsXciBAkABiYidtp.webp", alt: "Bar comptoir gonflable pour événement en plein air", cat: "Mobilier" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/cfUCARloUkKyBbnx.webp", alt: "Table mange-debout gonflable pour cocktail", cat: "Mobilier" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/QMaiyJJpGNDlQYCM.webp", alt: "Fauteuils et tabourets gonflables espace lounge", cat: "Mobilier" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ywPRhTcuHiFXaBee.webp", alt: "Canapé gonflable bleu deux places", cat: "Mobilier" },
];

const categories = ["Tous", "Écrans gonflables", "Événements", "Équipement", "Tentes", "Arches", "Mobilier"];

export default function Galerie() {
  useDocumentMeta("Galerie Photos | Nos Réalisations", "Découvrez nos réalisations en images : écrans de cinéma gonflables, tentes événementielles, arches et mobilier en action lors d'événements réels.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/iHeKkriOUImCLwKk.webp");

  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "Tous" ? photos : photos.filter((p) => p.cat === filter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="galerie-evenements"
        breadcrumbs={[{ name: "Accueil", url: "/" }, { name: "Galerie", url: "/galerie-evenements" }]}
        page={{
          name: "Galerie Photos | Nos Réalisations",
          description: "Découvrez nos réalisations en images : écrans de cinéma gonflables, tentes événementielles, arches et mobilier en action lors d'événements réels.",
          url: "https://hallucine.fr/galerie-evenements"
        }}
      />
      <Navbar />

      {/* Hero avec barre filtres en overlay en haut */}
      <section className="relative overflow-hidden bg-black">
        <div className="relative w-full" style={{ aspectRatio: '16/7' }}>
          <img loading="lazy"
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/BTjyZEhykZpPjzlQ.webp"
            alt="Cinéma en plein air Hallucine"
            className="w-full h-full object-contain"
          decoding="async" />
          <div className="absolute inset-0 bg-black/20" />

          {/* Barre filtres overlay en haut de l'image */}
          <div className="absolute top-[160px] left-0 right-0 z-20 bg-black/60 backdrop-blur-sm py-3">
            <div className="container relative flex items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-ivory shrink-0">
                Galerie
              </h1>
              <div className="absolute inset-0 flex flex-wrap gap-2 sm:gap-4 items-center justify-center pointer-events-none">
                <div className="hidden xl:flex flex-wrap gap-2 sm:gap-4 items-center justify-center">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 pointer-events-auto ${
                        filter === cat ? "bg-accent text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/70"
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Dropdown pour mobile/tablette */}
                <div className="relative xl:hidden">
                  <select
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter}
                    className="px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 pointer-events-auto appearance-none bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 focus:outline-none focus:ring-2 focus:ring-accent/80 pr-8"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grille photos */}
      <main className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((photo, index) => (
            <div key={index} className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer" onClick={() => setLightbox(index)}>
              <img loading="lazy" src={photo.src} alt={photo.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" decoding="async" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <p className="text-white text-center text-sm font-medium">{photo.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img src={filtered[lightbox].src} alt={filtered[lightbox].alt} className="max-w-full max-h-full object-contain rounded-lg" loading="lazy" decoding="async" />
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white text-3xl font-bold">&times;</button>
            {lightbox > 0 && (
              <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold">‹</button>
            )}
            {lightbox < filtered.length - 1 && (
              <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold">›</button>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
