import { useState } from "react";
import { Link } from "wouter";
import { Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoLightbox from "@/components/VideoLightbox";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";

export default function GalerieVideo() {
  const route = useRoutes();
  const { t } = useTranslation("galerie-video");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/IDghLbPxebJUfXVC.webp");

  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  const videos = [
    { id: "bAxDUrxFUXw", title: t("v1_title"), category: t("v1_cat") },
    { id: "sHeVec7oZfQ", title: t("v2_title"), category: t("v2_cat") },
    { id: "lnZ_fbEXH44", title: t("v3_title"), category: t("v3_cat") },
    { id: "UQmA8fZRDYg", title: t("v4_title"), category: t("v4_cat") },
    { id: "hmSlBIWP_jI", title: t("v5_title"), category: t("v5_cat") },
    { id: "-cga1EVZQtg", title: t("v6_title"), category: t("v6_cat") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("hero_title"), routeKey: "galerie-video" },
        ]}
        page={{
          name: t("hero_title"),
          description: t("meta_desc"),
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative bg-card text-white py-20 md:py-28">
        <div className="container max-w-5xl text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t("hero_title")}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            {t("hero_desc")}
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
                    width={480}
                    height={360}
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded mb-2">
                    {video.category}
                  </span>
                  <h2 className="font-semibold text-base">{video.title}</h2>
                </div>
              </div>
            ))}
          </div>

          {/* Lien chaîne YouTube */}
          <div className="text-center mt-12 p-8 bg-muted/30 rounded-lg border border-border">
            <h2 className="font-display text-2xl font-bold mb-3">
              {t("youtube_title")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t("youtube_desc")}
            </p>
            <a
              href="https://www.youtube.com/@Hallucinecran"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              {t("youtube_btn")}
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#8B7500] text-white text-center">
        <div className="container max-w-3xl">
          <h2 className="font-display text-3xl font-bold mb-4">
            {t("cta_title")}
          </h2>
          <p className="text-lg opacity-90 mb-8">
            {t("cta_desc")}
          </p>
          <Link href={route('mode-emploi')} className="inline-block bg-white text-[#8B7500] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            {t("cta_btn")}
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
