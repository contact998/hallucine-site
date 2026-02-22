import { useState } from "react";
import { Link } from "wouter";
import { Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoLightbox from "@/components/VideoLightbox";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function GalerieVideo() {
  useDocumentMeta("Galerie Vidéo | Nos Produits en Action", "Vidéos de nos écrans de cinéma gonflables, tentes et mobilier événementiel en action. Montage, installation et événements filmés.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/oDtUBYZZFsCNDfjT.JPG");

  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  const videos = [
    {
      id: "bAxDUrxFUXw",
      title: "Montage écran soufflerie 10m",
      category: "Tutoriel"
    },
    {
      id: "sHeVec7oZfQ",
      title: "Démontage écran soufflerie",
      category: "Tutoriel"
    },
    {
      id: "lnZ_fbEXH44",
      title: "Écran gonflable en action",
      category: "Événement"
    },
    {
      id: "UQmA8fZRDYg",
      title: "Tutoriel montage complet",
      category: "Tutoriel"
    },
    {
      id: "hmSlBIWP_jI",
      title: "Présentation produit Hallucine",
      category: "Présentation"
    },
    {
      id: "-cga1EVZQtg",
      title: "Tente gonflable V — Montage",
      category: "Tutoriel"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#1a1a2e] text-white py-20 md:py-28">
        <div className="container max-w-5xl text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Galerie Vidéo
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            Découvrez nos écrans gonflables, tentes et mobilier en action. 
            Tutoriels de montage, démonstrations produits et événements filmés.
          </p>
        </div>
      </section>

      {/* Grille vidéos — miniatures cliquables */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setActiveVideo({ id: video.id, title: video.title })}
              >
                {/* Miniature YouTube avec bouton play */}
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  decoding="async" />
                  {/* Overlay sombre au hover */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  {/* Bouton play central */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-7 h-7 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <span className="inline-block text-xs font-medium bg-[#DAA520]/10 text-[#DAA520] px-2 py-1 rounded mb-2">
                    {video.category}
                  </span>
                  <h3 className="font-semibold text-base">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Lien chaîne YouTube */}
          <div className="text-center mt-12 p-8 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-display text-2xl font-bold mb-3">
              Retrouvez toutes nos vidéos
            </h3>
            <p className="text-muted-foreground mb-6">
              Abonnez-vous à notre chaîne YouTube pour ne manquer aucune nouvelle vidéo.
            </p>
            <a
              href="https://www.youtube.com/channel/UCqIaNSl1_6_I3ABfzFIJ2Ow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              S'abonner à notre chaîne YouTube
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#8B7500] text-white text-center">
        <div className="container max-w-3xl">
          <h2 className="font-display text-3xl font-bold mb-4">
            Besoin d'un mode d'emploi détaillé ?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Consultez notre guide d'installation étape par étape avec vidéos et instructions écrites.
          </p>
          <Link href="/mode-emploi" className="inline-block bg-white text-[#8B7500] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Voir le mode d'emploi
          </Link>
        </div>
      </section>

      <Footer />

      {/* Lightbox vidéo */}
      {activeVideo && (
        <VideoLightbox
          videoId={activeVideo.id}
          title={activeVideo.title}
          isOpen={true}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
}
