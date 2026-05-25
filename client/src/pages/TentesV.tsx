/*
 * Page Tentes V — Tentes Gonflables en Forme de V
 * Contenu i18n via namespace "tente-v"
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ZoomImage from "@/components/ZoomImage";
import { Play } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import ProductPageShell from "@/components/product/ProductPageShell";
import ProductButton from "@/components/product/ProductButton";
import { useRoutes } from "@/i18n/useRoutes";
import { useProductImages } from "@/hooks/useProductImages";

const FALLBACK_IMAGES_TENTE_V = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/HiOAOTLZaOhqpcQk.webp", alt: "Tente gonflable V blanche vue de face" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/nvpNhKQWdZSYGIgR.webp", alt: "Tente gonflable V blanche vue d'ensemble" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/EpaIyWYtXIFowiQT.webp", alt: "Tente gonflable V personnalisée avec logo" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/deVDPczivrfxEEVT.webp", alt: "Tente gonflable V stand événement extérieur" },
];

const schemaEclate = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/qSTOOwNPJJIAFgwe.webp";

export default function TentesV() {
  const route = useRoutes();
  const { t } = useTranslation("tente-v");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/HiOAOTLZaOhqpcQk.webp");
  const heroImages = useProductImages("tente-v", FALLBACK_IMAGES_TENTE_V);
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  return (
    <ProductPageShell
      relatedProductsKey="tente-v"
      activeVideo={activeVideo}
      onCloseVideo={() => setActiveVideo(null)}
    >
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: "Tentes Gonflables", routeKey: "tentes" },
          { name: "Tentes en Forme de V", routeKey: "tente-v" },
        ]}
        product={{
          name: "Tente Gonflable en Forme de V",
          description: "Tente gonflable V au design élégant et moderne. Idéale pour événements haut de gamme, mariages et réceptions. Personnalisation complète.",
          image: heroImages.map(img => img.src),
          category: "Tentes gonflables",
          minPrice: 1490,
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("section_label")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-10">
            {t("hero_title")}{" "}<br />
            <span className="text-warm">{t("hero_colored")}</span>
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {heroImages.map((img, i) => (
              <ZoomImage key={i} src={img.src} alt={img.alt} gallery={heroImages} index={i} width={img.width ?? undefined} height={img.height ?? undefined} wrapperClassName="rounded-lg aspect-[4/3]" className="w-full h-full object-cover" />
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container text-center max-w-4xl mx-auto">
          <p className="text-white/70 text-lg leading-relaxed mb-6">{t("intro_desc")}</p>
        </div>
      </section>

      {/* Pourquoi choisir */}
      <section className="py-20 bg-charcoal-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img width={heroImages[0].width ?? undefined} height={heroImages[0].height ?? undefined} loading="lazy" src={heroImages[0].src} alt="" className="w-full h-full object-cover" decoding="async" />
        </div>
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-6">
                {t("why_title")}<br />
                <span className="text-warm">{t("why_colored")}</span>
              </h2>
              <p className="text-white/70 leading-relaxed">{t("why_desc")}</p>
            </div>

            {/* Card Caractéristiques principales */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
              <h3 className="text-warm font-bold text-xl mb-4">{t("features_title")}</h3>
              <ul className="space-y-3 text-white/70 text-sm leading-relaxed">
                <li><strong className="text-ivory">{t("feat1_bold")}</strong> {t("feat1")}</li>
                <li><strong className="text-ivory">{t("feat2_bold")}</strong> {t("feat2")}</li>
                <li><strong className="text-ivory">{t("feat3_bold")}</strong> {t("feat3")}</li>
                <li><strong className="text-ivory">{t("feat4_bold")}</strong> {t("feat4")}</li>
                <li><strong className="text-ivory">{t("feat5_bold")}</strong> {t("feat5")}</li>
              </ul>
            </div>

            {/* Card Applications courantes */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
              <h3 className="text-warm font-bold text-xl mb-4">{t("apps_title")}</h3>
              <ul className="space-y-3 text-white/70 text-sm leading-relaxed">
                <li><strong className="text-ivory">{t("app1_bold")}</strong> {t("app1")}</li>
                <li><strong className="text-ivory">{t("app2_bold")}</strong> {t("app2")}</li>
                <li><strong className="text-ivory">{t("app3_bold")}</strong> {t("app3")}</li>
                <li><strong className="text-ivory">{t("app4_bold")}</strong> {t("app4")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Performance + Vidéo */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-4">
                {t("perf_title")}<br />
                <span className="text-warm">{t("perf_colored")}</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">{t("perf_desc")}</p>
              <h3 className="text-warm font-semibold text-lg mb-3">{t("sizes_title")}</h3>
              <p className="text-white/60 leading-relaxed mb-4">{t("sizes_desc")}</p>
              <ul className="space-y-2 text-white/70 mb-6">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-warm rounded-full shrink-0" /><strong className="text-ivory">{t("size1")}</strong></li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-warm rounded-full shrink-0" /><strong className="text-ivory">{t("size2")}</strong></li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-warm rounded-full shrink-0" /><strong className="text-ivory">{t("size3")}</strong></li>
              </ul>
              <p className="text-white/60 text-sm leading-relaxed">{t("sizes_note")}</p>
            </div>

            {/* Vidéo YouTube */}
            <div className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer group" onClick={() => setActiveVideo({ id: '-cga1EVZQtg', title: t("video_title") })}>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <img width={480} height={360} src="https://img.youtube.com/vi/-cga1EVZQtg/hqdefault.jpg" alt={t("video_title")} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-ivory font-semibold">{t("video_title")}</h3>
                <p className="text-white/60 text-sm">{t("video_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-10">
            {t("adv_title")} <span className="text-warm">{t("adv_colored")}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <div className="shrink-0 w-10 h-10 rounded-full bg-warm/20 flex items-center justify-center">
                  <span className="text-warm font-bold">{n}</span>
                </div>
                <div>
                  <h3 className="text-ivory font-semibold mb-2">{t(`adv${n}_title`)}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{t(`adv${n}_desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schéma éclaté */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8 text-center">
            {t("schema_title")} <span className="text-warm">{t("schema_colored")}</span>
          </h2>
          <ZoomImage src={schemaEclate} alt="Schéma éclaté des composants de la Tente Gonflable V" wrapperClassName="max-w-4xl mx-auto rounded-lg shadow-lg" className="w-full" />
          <p className="text-white/50 text-sm text-center mt-4">{t("schema_zoom")}</p>
        </div>
      </section>

      {/* Caractéristiques techniques */}
      <section className="py-20 bg-charcoal-light">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-ivory mb-8">
            {t("tech_title")} <span className="text-warm">{t("tech_colored")}</span>
          </h2>
          <ul className="space-y-6 text-white/70 leading-relaxed">
            <li className="flex gap-4"><span className="shrink-0 w-2 h-2 bg-warm rounded-full mt-2" /><div><strong className="text-ivory">{t("tech1_bold")}</strong> {t("tech1")}</div></li>
            <li className="flex gap-4"><span className="shrink-0 w-2 h-2 bg-warm rounded-full mt-2" /><div><strong className="text-ivory">{t("tech2_bold")}</strong> {t("tech2")}</div></li>
            <li className="flex gap-4"><span className="shrink-0 w-2 h-2 bg-warm rounded-full mt-2" /><div>{t("tech3")}</div></li>
            <li className="flex gap-4"><span className="shrink-0 w-2 h-2 bg-warm rounded-full mt-2" /><div><strong className="text-ivory">{t("tech4_bold")}</strong> {t("tech4")}</div></li>
            <li className="flex gap-4"><span className="shrink-0 w-2 h-2 bg-warm rounded-full mt-2" /><div><strong className="text-ivory">{t("tech5_bold")}</strong> {t("tech5")}</div></li>
          </ul>
        </div>
      </section>

      {/* Poids + Personnalisation */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold text-ivory mb-4">{t("weight_title")} <span className="text-warm">{t("weight_colored")}</span></h3>
              <p className="text-white/70 leading-relaxed">{t("weight_desc")}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold text-ivory mb-4">{t("custom_title")} <span className="text-warm">{t("custom_colored")}</span></h3>
              <p className="text-white/70 leading-relaxed">{t("custom_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion + CTA */}
      <section className="py-16 bg-charcoal-light">
        <div className="container text-center max-w-4xl mx-auto">
          <p className="text-white/70 text-lg leading-relaxed mb-8">{t("conclusion")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <ProductButton href={route('contact')} variant="primary">{t("cta_contact")}</ProductButton>
            <ProductButton href={route('contact')} variant="secondary">{t("cta_devis")}</ProductButton>
          </div>
        </div>
      </section>
    </ProductPageShell>
  );
}
