/*
 * Page Tentes Gonflables N
 * Contenu i18n via namespace "tente-n"
 */
import { useTranslation } from "react-i18next";
import ZoomImage from "@/components/ZoomImage";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import PageShell from "@/components/PageShell";
import ProductButton from "@/components/product/ProductButton";
import { useRoutes } from "@/i18n/useRoutes";
import { useGallery } from "@/hooks/useSlot";

const FALLBACK_IMAGES_TENTE_N = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/TVmrusoKmXcTvkKP.webp", alt: "Tente gonflable N Hallucine blanche dans la neige" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/apmHySbtINxVnjYV.webp", alt: "Tente gonflable N Volvo Discover dans la neige" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/erdtrTEYYaBaTrbE.webp", alt: "Tente gonflable N blanche grande vue latérale" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/WMxgFPZnUaijiyGz.webp", alt: "Tente gonflable N Croix-Rouge verte" },
];

const FALLBACK_SCHEMA = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/BhBEducothOIuNNg.webp", alt: "Schéma éclaté des éléments techniques de la tente gonflable N" },
];

export default function TentesN() {
  const route = useRoutes();
  const { t } = useTranslation("tente-n");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/TVmrusoKmXcTvkKP.webp");
  const heroImages = useGallery("tente-n:galerie", FALLBACK_IMAGES_TENTE_N);
  const schemaImages = useGallery("tente-n:schema", FALLBACK_SCHEMA);

  return (
    <PageShell relatedProductsKey="tente-n">
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: "Tentes gonflables", routeKey: "tentes" },
          { name: "Tentes en forme de N", routeKey: "tente-n" },
        ]}
        product={{
          name: "Tentes en forme de N",
          description: "Tente gonflable N polyvalente. Utilisée par la Croix-Rouge et pour événements.",
          image: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/TVmrusoKmXcTvkKP.webp",
          category: "Tentes gonflables",
          minPrice: 1990,
        }}
      />

      {/* Hero */}
      {heroImages.length > 0 && (
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("section_label")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-10">
            {t("hero_title")}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {heroImages.map((img, i) => (
              <ZoomImage key={i} src={img.src} alt={img.alt} gallery={heroImages} index={i} width={img.width ?? undefined} height={img.height ?? undefined} wrapperClassName="rounded-lg aspect-[4/3]" className="w-full h-full object-cover" />
            ))}
          </div>
        </div>
      </section>
      )}

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
            <ZoomImage src={heroImages[0].src} alt={heroImages[0].alt} gallery={heroImages} index={0} width={heroImages[0].width ?? undefined} height={heroImages[0].height ?? undefined} wrapperClassName="rounded-lg shadow-lg" className="w-full" />
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
            <ZoomImage src={heroImages[1].src} alt={heroImages[1].alt} gallery={heroImages} index={1} width={heroImages[1].width ?? undefined} height={heroImages[1].height ?? undefined} wrapperClassName="rounded-lg shadow-lg" className="w-full" />
          </div>
        </div>
      </section>

      {/* Personnalisation */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <ZoomImage src={heroImages[2].src} alt={heroImages[2].alt} gallery={heroImages} index={2} width={heroImages[2].width ?? undefined} height={heroImages[2].height ?? undefined} wrapperClassName="rounded-lg shadow-lg" className="w-full" />
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
            <ZoomImage src={heroImages[3].src} alt={heroImages[3].alt} gallery={heroImages} index={3} width={heroImages[3].width ?? undefined} height={heroImages[3].height ?? undefined} wrapperClassName="rounded-lg shadow-lg" className="w-full" />
          </div>
        </div>
      </section>

      {/* Caractéristiques techniques */}
      {schemaImages.length > 0 && (
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <ZoomImage src={schemaImages[0]?.src ?? FALLBACK_SCHEMA[0].src} alt={schemaImages[0]?.alt ?? FALLBACK_SCHEMA[0].alt} wrapperClassName="rounded-lg shadow-lg" className="w-full" />
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
      )}

      {/* Conclusion + CTA */}
      <section className="py-16 bg-charcoal-light">
        <div className="container text-center max-w-4xl mx-auto">
          <p className="text-white/70 text-lg leading-relaxed mb-8">{t("conclusion_p1")}</p>
          <p className="text-white/60 leading-relaxed mb-10">{t("conclusion_p2")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <ProductButton href={route('contact')} variant="primary">{t("cta_contact")}</ProductButton>
            <ProductButton href={route('contact')} variant="secondary">{t("cta_devis")}</ProductButton>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
