/*
 * Page Tentes Gonflables X
 * Contenu i18n via namespace "tente-x"
 */
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, X as XIcon } from "lucide-react";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useRoutes } from "@/i18n/useRoutes";
import { RelatedProducts } from "@/components/RelatedProducts";
import { useProductImages } from "@/hooks/useProductImages";
import EmailLink from "@/components/EmailLink";

const FALLBACK_IMAGES_TENTE_X = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/fHOHtmjSEZCdfvZR.webp", alt: "Tentes gonflables X Meguiar's noires et jaunes de nuit" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/upTjWnEqwNFkSAuN.webp", alt: "Tente gonflable X Hallucine noire avec logo" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/snASjOxpYmvdMRXE.webp", alt: "Tentes gonflables X personnalisées multiples" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ZgESYNaQchclOBaW.webp", alt: "Tente gonflable X Ealing Eagles personnalisée" },
];

const contentImages = {
  tentePerso: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/YDVeZvrXTWvHTZKL.webp",
};

function ImageCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));
  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-black/20">
      <img src={images[idx].src} alt={images[idx].alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors" aria-label="Image précédente">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors" aria-label="Image suivante">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === idx ? "bg-warm" : "bg-white/40"}`} aria-label={`Image ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ImageLightbox({ src, alt, isOpen, onClose }: { src: string; alt: string; isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Fermer">
        <XIcon className="w-6 h-6" />
      </button>
      <img loading="lazy" src={src} alt={alt} className="max-w-[92vw] max-h-[88vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} decoding="async" />
    </div>
  );
}

export default function TentesX() {
  const route = useRoutes();
  const { t } = useTranslation("tente-x");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/og-tente-x-AET6EuZJEbKcpbEmxnmWTB.png");
  const heroImages = useProductImages("tente-x", FALLBACK_IMAGES_TENTE_X);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);
  const openLightbox = useCallback((src: string, alt: string) => { setLightboxImg({ src, alt }); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: "Tentes gonflables", routeKey: "tentes" },
          { name: "Tentes X", routeKey: "tente-x" },
        ]}
        product={{
          name: "Tente Gonflable X",
          description: "La tente gonflable Hallucine X est la solution parfaite pour vos événements extérieurs.",
          image: heroImages.map(img => img.src),
          category: "Tentes gonflables",
          minPrice: 1490,
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-charcoal-light">
        <div className="container">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory text-center mb-10">
            {t("hero_title")} <span className="text-warm">{t("hero_title_colored")}</span>
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {heroImages.map((img, i) => (
              <div key={i} className="cursor-pointer overflow-hidden rounded-lg" onClick={() => openLightbox(img.src, img.alt)}>
                <img width={img.width ?? undefined} height={img.height ?? undefined} src={img.src} alt={img.alt} className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[0].src, heroImages[0].alt)}>
              <img width={heroImages[0].width ?? undefined} height={heroImages[0].height ?? undefined} src={heroImages[0].src} alt={heroImages[0].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-4">
                {t("intro_title")}<br />
                <span className="text-warm">{t("intro_title_colored")}</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">{t("intro_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Design pratique et résistant */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-6">{t("design_title")}</h2>
              <p className="text-white/70 leading-relaxed mb-6">{t("design_desc")}</p>
              <ul className="space-y-4">
                <li className="text-white/70 leading-relaxed"><strong className="text-warm">{t("design_tpu_title")}</strong> : {t("design_tpu_desc")}</li>
                <li className="text-white/70 leading-relaxed"><strong className="text-warm">{t("design_dacron_title")}</strong> : {t("design_dacron_desc")}</li>
                <li className="text-white/70 leading-relaxed"><strong className="text-warm">{t("design_polyester_title")}</strong> : {t("design_polyester_desc")}</li>
              </ul>
            </div>
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[1].src, heroImages[1].alt)}>
              <img width={heroImages[1].width ?? undefined} height={heroImages[1].height ?? undefined} src={heroImages[1].src} alt={heroImages[1].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* Système fiable */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="cursor-pointer order-2 md:order-1" onClick={() => openLightbox(heroImages[2].src, heroImages[2].alt)}>
              <img width={heroImages[2].width ?? undefined} height={heroImages[2].height ?? undefined} src={heroImages[2].src} alt={heroImages[2].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-ivory mb-6">{t("reliable_title")}</h2>
              <p className="text-white/70 leading-relaxed mb-6">{t("reliable_desc")}</p>
              <ul className="space-y-4">
                <li className="text-white/70 leading-relaxed"><strong className="text-warm">{t("reliable_maintenance_title")}</strong> : {t("reliable_maintenance_desc")}</li>
                <li className="text-white/70 leading-relaxed"><strong className="text-warm">{t("reliable_custom_title")}</strong> : {t("reliable_custom_desc")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Accessoires et stabilité */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-6">{t("accessories_title")}</h2>
              <p className="text-white/70 leading-relaxed mb-6">{t("accessories_desc")}</p>
              <ul className="space-y-4">
                <li className="text-white/70 leading-relaxed"><strong className="text-warm">{t("accessories_bags_title")}</strong> : {t("accessories_bags_desc")}</li>
                <li className="text-white/70 leading-relaxed"><strong className="text-warm">{t("accessories_alu_title")}</strong> : {t("accessories_alu_desc")}</li>
              </ul>
            </div>
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[3].src, heroImages[3].alt)}>
              <img width={heroImages[3].width ?? undefined} height={heroImages[3].height ?? undefined} src={heroImages[3].src} alt={heroImages[3].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* Personnalisation */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="cursor-pointer order-2 md:order-1" onClick={() => openLightbox(contentImages.tentePerso, "Tentes gonflables X personnalisées")}>
              <img src={contentImages.tentePerso} alt="Tentes gonflables X personnalisées avec différentes couleurs et logos" className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-ivory mb-6">{t("custom_title")}</h2>
              <p className="text-white/70 leading-relaxed mb-6">{t("custom_desc")}</p>
              <ul className="space-y-4">
                <li className="text-white/70 leading-relaxed"><strong className="text-warm">{t("custom_roof_title")}</strong> : {t("custom_roof_desc")}</li>
                <li className="text-white/70 leading-relaxed"><strong className="text-warm">{t("custom_curtain_title")}</strong> : {t("custom_curtain_desc")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Caractéristiques techniques */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8 text-center">{t("specs_title")}</h2>
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4">
{["spec1", "spec2", "spec3", "spec4", "spec5", "spec6"].map((key) => (
              <li key={key} className="flex gap-3 items-start p-4 bg-card border border-border rounded-lg">
                <span className="text-warm font-bold shrink-0">•</span>
                <p className="text-white/70">
                  <strong className="text-ivory">{t(`${key}_bold`)}</strong> : {t(key)}
                </p>
              </li>
            ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Fiabilité, Expertise, Qualité */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4 text-center">{t("quality_title")}</h2>
          <p className="text-white/60 text-center mb-10 max-w-2xl mx-auto">{t("quality_subtitle")}</p>
          <p className="text-white/70 leading-relaxed max-w-4xl mx-auto mb-10 text-center">{t("quality_desc")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-warm font-bold text-xl mb-3">{t("quality_reliability_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("quality_reliability_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-warm font-bold text-xl mb-3">{t("quality_expertise_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("quality_expertise_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-warm font-bold text-xl mb-3">{t("quality_quality_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("quality_quality_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* En résumé */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-ivory mb-6">{t("summary_title")}</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-6">{t("summary_desc")}</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-8 bg-background">
        <div className="container text-center">
          <p className="text-white/60 text-sm">
            Mail : <EmailLink className="text-warm hover:underline" />
            {" / "}Tel : <a href="tel:+33458212010" className="text-warm hover:underline">+33 4 58 21 20 10</a>
            {" / "}<a href="https://wa.me/33680147694" target="_blank" rel="noopener noreferrer" className="text-warm hover:underline">WhatsApp</a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">{t("cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={route('contact')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_contact")}
            </Link>
            <Link href={route('contact')} className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              {t("cta_devis")}
            </Link>
            <BrochureDownloadButton productSlug="tente-x" productName="Tente X" variant="compact" />
          </div>
        </div>
      </section>

      <RelatedProducts currentPage="tente-x" />
      <Footer />
      <ImageLightbox src={lightboxImg?.src ?? ""} alt={lightboxImg?.alt ?? ""} isOpen={lightboxImg !== null} onClose={() => setLightboxImg(null)} />
    </div>
  );
}
