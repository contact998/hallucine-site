/*
 * Page Cas signature — Stade Vélodrome × Orange « Faisons Cinéma »
 * Le projet qui prouve la légèreté Hallucine : un écran de 24 m posé
 * sur la pelouse d'un stade sans engin de levage, sans dommage.
 */
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ZoomImage from "@/components/ZoomImage";
import PageStructuredData from "@/components/PageStructuredData";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useRoutes } from "@/i18n/useRoutes";

const PHOTOS = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/nRCfDZHKAKZaVovJ.webp", altKey: "img1_alt" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/yOODHxsfnoySvIeF.webp", altKey: "img4_alt" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/OWMdZNnUOoKKIQbm.webp", altKey: "img2_alt" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/KyASvJooCSwRBpRc.webp", altKey: "img3_alt" },
];

export default function CasVelodrome() {
  const route = useRoutes();
  const { t } = useTranslation("cas-velodrome");
  useDocumentMeta(t("meta_title"), t("meta_desc"), PHOTOS[0].src);

  const stats = [
    { value: t("stat1_value"), suffix: t("stat1_suffix"), label: t("stat1_label") },
    { value: t("stat2_value"), suffix: t("stat2_suffix"), label: t("stat2_label") },
    { value: t("stat3_value"), suffix: t("stat3_suffix"), label: t("stat3_label") },
    { value: t("stat4_value"), suffix: t("stat4_suffix"), label: t("stat4_label") },
  ];

  const gallery = PHOTOS.map((p) => ({ src: p.src, alt: t(p.altKey) }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: "Études de cas", routeKey: "etudes-cas" },
          { name: "Vélodrome × Orange", routeKey: "cas-velodrome" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-charcoal-light overflow-hidden">
        <div className="container relative z-10">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">
            {t("section_label")}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-3">
            {t("hero_title")}
          </h1>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm leading-tight mb-8 italic">
            {t("hero_subtitle")}
          </p>
          <p className="text-white/75 text-lg max-w-3xl leading-relaxed">
            {t("hero_intro")}
          </p>
        </div>
      </section>

      {/* Photo signature */}
      <section className="bg-background">
        <div className="container py-8">
          <ZoomImage
            src={gallery[0].src}
            alt={gallery[0].alt}
            gallery={gallery}
            index={0}
            wrapperClassName="rounded-lg w-full"
            className="w-full max-h-[640px] object-cover"
            loading="eager"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/15 bg-white/[0.02] backdrop-blur-sm rounded-lg border border-white/10">
            {stats.map((s, i) => (
              <div key={i} className="text-center py-8 px-4">
                <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {s.value}
                  <span className="text-warm">{s.suffix}</span>
                </div>
                <div className="text-xs text-white/60 mt-3 tracking-[0.18em] uppercase font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="py-20 bg-charcoal-light">
        <div className="container max-w-4xl">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-3">
            {t("challenge_label")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-8">
            {t("challenge_title")}
          </h2>
          <p className="text-white/75 text-lg leading-relaxed mb-5">{t("challenge_p1")}</p>
          <p className="text-white/75 text-lg leading-relaxed">{t("challenge_p2")}</p>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-3">
            {t("solution_label")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-8">
            {t("solution_title")}
          </h2>
          <p className="text-white/75 text-lg leading-relaxed mb-5">{t("solution_p1")}</p>
          <p className="text-white/75 text-lg leading-relaxed mb-5">{t("solution_p2")}</p>
          <p className="text-warm text-xl font-semibold leading-relaxed">{t("solution_p3")}</p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("gallery_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gallery.slice(1).map((img, i) => (
              <ZoomImage
                key={i}
                src={img.src}
                alt={img.alt}
                gallery={gallery}
                index={i + 1}
                wrapperClassName="aspect-[4/3] rounded-lg"
                className="w-full h-full object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Result */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-3">
            {t("result_label")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-8">
            {t("result_title")}
          </h2>
          <p className="text-white/75 text-lg leading-relaxed mb-5">{t("result_p1")}</p>
          <p className="text-white/75 text-lg leading-relaxed">{t("result_p2")}</p>
        </div>
      </section>

      {/* Why unique */}
      <section className="py-20 bg-charcoal-light">
        <div className="container max-w-4xl">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-3">
            {t("why_label")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-8">
            {t("why_title")}
          </h2>
          <p className="text-white/75 text-lg leading-relaxed mb-5">{t("why_p1")}</p>
          <p className="text-white/75 text-lg leading-relaxed">{t("why_p2")}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background border-t border-white/5">
        <div className="container text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-5">
            {t("cta_title")}
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10">{t("cta_desc")}</p>
          <Link
            href={route("contact")}
            className="inline-flex items-center gap-3 px-8 py-4 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
          >
            {t("cta_button")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
