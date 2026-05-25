/*
 * Page Tentes Gonflables X
 * Contenu i18n via namespace "tente-x"
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ZoomImage from "@/components/ZoomImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import ProductPageShell from "@/components/product/ProductPageShell";
import ProductButton from "@/components/product/ProductButton";
import { useRoutes } from "@/i18n/useRoutes";
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

export default function TentesX() {
  const route = useRoutes();
  const { t } = useTranslation("tente-x");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/og-tente-x-AET6EuZJEbKcpbEmxnmWTB.png");
  const heroImages = useProductImages("tente-x", FALLBACK_IMAGES_TENTE_X);

  return (
    <ProductPageShell relatedProductsKey="tente-x">
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

      {/* Hero */}
      <section className="pt-32 pb-12 bg-charcoal-light">
        <div className="container">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory text-center mb-10">
            {t("hero_title")} <span className="text-warm">{t("hero_title_colored")}</span>
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {heroImages.map((img, i) => (
              <ZoomImage key={i} src={img.src} alt={img.alt} gallery={heroImages} index={i} width={img.width ?? undefined} height={img.height ?? undefined} wrapperClassName="rounded-lg" className="w-full aspect-[4/3] object-cover" />
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <ZoomImage src={heroImages[0].src} alt={heroImages[0].alt} gallery={heroImages} index={0} width={heroImages[0].width ?? undefined} height={heroImages[0].height ?? undefined} wrapperClassName="rounded-lg shadow-lg" className="w-full" />
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
            <ZoomImage src={heroImages[1].src} alt={heroImages[1].alt} gallery={heroImages} index={1} width={heroImages[1].width ?? undefined} height={heroImages[1].height ?? undefined} wrapperClassName="rounded-lg shadow-lg" className="w-full" />
          </div>
        </div>
      </section>

      {/* Système fiable */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <ZoomImage src={heroImages[2].src} alt={heroImages[2].alt} gallery={heroImages} index={2} width={heroImages[2].width ?? undefined} height={heroImages[2].height ?? undefined} wrapperClassName="rounded-lg shadow-lg order-2 md:order-1" className="w-full" />
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
            <ZoomImage src={heroImages[3].src} alt={heroImages[3].alt} gallery={heroImages} index={3} width={heroImages[3].width ?? undefined} height={heroImages[3].height ?? undefined} wrapperClassName="rounded-lg shadow-lg" className="w-full" />
          </div>
        </div>
      </section>

      {/* Personnalisation */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <ZoomImage src={contentImages.tentePerso} alt="Tentes gonflables X personnalisées avec différentes couleurs et logos" wrapperClassName="rounded-lg shadow-lg order-2 md:order-1" className="w-full" />
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
            <ProductButton href={route('contact')} variant="primary">{t("cta_contact")}</ProductButton>
            <ProductButton href={route('contact')} variant="secondary">{t("cta_devis")}</ProductButton>
            <BrochureDownloadButton productSlug="tente-x" productName="Tente X" variant="compact" />
          </div>
        </div>
      </section>
    </ProductPageShell>
  );
}
