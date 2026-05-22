/*
 * Page Tentes Gonflables N
 * Contenu i18n via namespace "tente-n"
 */
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { X as XIcon } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useRoutes } from "@/i18n/useRoutes";
import { RelatedProducts } from "@/components/RelatedProducts";
import { useProductImages } from "@/hooks/useProductImages";

const FALLBACK_IMAGES_TENTE_N = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/TVmrusoKmXcTvkKP.webp", alt: "Tente gonflable N Hallucine blanche dans la neige" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/apmHySbtINxVnjYV.webp", alt: "Tente gonflable N Volvo Discover dans la neige" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/erdtrTEYYaBaTrbE.webp", alt: "Tente gonflable N blanche grande vue latérale" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/WMxgFPZnUaijiyGz.webp", alt: "Tente gonflable N Croix-Rouge verte" },
];

const contentImages = {
  schemaEclate: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/BhBEducothOIuNNg.webp",
};

export default function TentesN() {
  const route = useRoutes();
  const { t } = useTranslation("tente-n");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/TVmrusoKmXcTvkKP.webp");
  const heroImages = useProductImages("tente-n", FALLBACK_IMAGES_TENTE_N);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const openLightbox = useCallback((src: string, alt: string) => setLightbox({ src, alt }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="tentes-n-page"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: "Tentes gonflables", url: "https://hallucinecran.fr/tentes-gonflables" },
          { name: "Tentes en forme de N", url: "https://hallucinecran.fr/tentes-gonflables-n" },
        ]}
        product={{
          name: "Tentes en forme de N",
          description: "Tente gonflable N polyvalente. Utilisée par la Croix-Rouge et pour événements.",
          image: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/TVmrusoKmXcTvkKP.webp",
          url: "https://hallucinecran.fr/tentes-gonflables-n",
          category: "Tentes gonflables",
          minPrice: 1990,
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("section_label")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-10">
            {t("hero_title")}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {heroImages.map((img, i) => (
              <div key={i} className="cursor-pointer rounded-lg overflow-hidden aspect-[4/3]" onClick={() => openLightbox(img.src, img.alt)}>
                <img width={img.width ?? undefined} height={img.height ?? undefined} src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container text-center max-w-4xl mx-auto">
          <p className="text-white/70 text-lg leading-relaxed mb-6">{t("intro_desc")}</p>
          <h2 className="text-2xl font-bold text-warm mb-4">{t("intro_quality_title")}</h2>
          <p className="text-white/60 leading-relaxed">{t("intro_quality_desc")}</p>
        </div>
      </section>

      {/* Ultra-Résistante */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[0].src, heroImages[0].alt)}>
              <img width={heroImages[0].width ?? undefined} height={heroImages[0].height ?? undefined} src={heroImages[0].src} alt={heroImages[0].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-4">
                {t("resistant_title")}<br />
                <span className="text-warm">{t("resistant_colored")}</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">{t("resistant_desc")}</p>
              <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
                <li><strong className="text-warm">{t("resistant_tpu_title")}</strong> : {t("resistant_tpu_desc")}</li>
                <li><strong className="text-warm">{t("resistant_zip_title")}</strong> : {t("resistant_zip_desc")}</li>
                <li><strong className="text-warm">{t("resistant_roof_title")}</strong> : {t("resistant_roof_desc")}</li>
                <li><strong className="text-warm">{t("resistant_para_title")}</strong> : {t("resistant_para_desc")}</li>
                <li><strong className="text-warm">{t("resistant_skin_title")}</strong> : {t("resistant_skin_desc")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Qualité */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-4">
                <span className="text-warm">{t("quality_title")}</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">{t("quality_desc")}</p>
            </div>
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[1].src, heroImages[1].alt)}>
              <img width={heroImages[1].width ?? undefined} height={heroImages[1].height ?? undefined} src={heroImages[1].src} alt={heroImages[1].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* Personnalisation */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[2].src, heroImages[2].alt)}>
              <img width={heroImages[2].width ?? undefined} height={heroImages[2].height ?? undefined} src={heroImages[2].src} alt={heroImages[2].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-4">
                {t("custom_title")}<br />
                <span className="text-warm">{t("custom_colored")}</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">{t("custom_desc")}</p>
              <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
                <li><strong className="text-warm">{t("custom_walls_title")}</strong> : {t("custom_walls_desc")}</li>
                <li><strong className="text-warm">{t("custom_color_title")}</strong> : {t("custom_color_desc")}</li>
                <li><strong className="text-warm">{t("custom_print_title")}</strong> : {t("custom_print_desc")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transport */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-4">
                {t("transport_title")}<br />
                <span className="text-warm">{t("transport_colored")}</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">{t("transport_desc")}</p>
              <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
                <li><strong className="text-warm">{t("transport_light_title")}</strong> : {t("transport_light_desc")}</li>
                <li><strong className="text-warm">{t("transport_sand_title")}</strong> : {t("transport_sand_desc")}</li>
                <li><strong className="text-warm">{t("transport_pump_title")}</strong> : {t("transport_pump_desc")}</li>
              </ul>
            </div>
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[3].src, heroImages[3].alt)}>
              <img width={heroImages[3].width ?? undefined} height={heroImages[3].height ?? undefined} src={heroImages[3].src} alt={heroImages[3].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* Caractéristiques techniques */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="cursor-pointer" onClick={() => openLightbox(contentImages.schemaEclate, "Schéma éclaté des éléments techniques de la tente N")}>
              <img src={contentImages.schemaEclate} alt="Schéma éclaté des éléments techniques de la tente gonflable N" className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-6">
                {t("specs_title")}<br />
                <span className="text-warm">{t("specs_colored")}</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">{t("specs_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion + CTA */}
      <section className="py-16 bg-charcoal-light">
        <div className="container text-center max-w-4xl mx-auto">
          <p className="text-white/70 text-lg leading-relaxed mb-8">{t("conclusion_p1")}</p>
          <p className="text-white/60 leading-relaxed mb-10">{t("conclusion_p2")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={route('contact')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_contact")}
            </Link>
            <Link href={route('contact')} className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              {t("cta_devis")}
            </Link>
          </div>
        </div>
      </section>

      <RelatedProducts currentPage="tente-n" />
      <Footer />

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors" aria-label="Fermer">
            <XIcon className="w-6 h-6" />
          </button>
          <img src={lightbox.src} alt={lightbox.alt} className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} decoding="async" loading="lazy" />
        </div>
      )}
    </div>
  );
}
