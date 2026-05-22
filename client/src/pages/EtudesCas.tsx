/*
 * Page Témoignages — retours clients réels sur les écrans Hallucine.
 * Contenu i18n via le namespace « etudes-cas ».
 */
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageStructuredData from "@/components/PageStructuredData";
import PagePhoto from "@/components/PagePhoto";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useRoutes } from "@/i18n/useRoutes";

const TEMOIGNAGES = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"];

export default function EtudesCas() {
  const { t } = useTranslation("etudes-cas");
  const route = useRoutes();
  useDocumentMeta(t("meta_title"), t("meta_desc"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="etudes-cas-page"
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("breadcrumb"), routeKey: "etudes-cas" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-10 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">
            {t("section_label")}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">{t("hero_desc")}</p>
        </div>
      </section>

      {/* Photo */}
      <PagePhoto src="/img/etudes-cas-projection.jpg" alt={t("photo_alt")} />

      {/* Témoignages */}
      <section className="py-16 bg-background">
        <div className="container">
          <p className="text-white/60 mb-10 max-w-2xl leading-relaxed">{t("intro")}</p>
          <div className="grid md:grid-cols-2 gap-6">
            {TEMOIGNAGES.map((id) => (
              <figure
                key={id}
                className="flex flex-col bg-card border border-border rounded-xl p-6"
              >
                <Quote className="w-8 h-8 text-warm/40 mb-3 shrink-0" />
                <blockquote className="text-white/80 leading-relaxed flex-1">
                  « {t(`${id}_quote`)} »
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-white/10 text-sm">
                  <span className="text-ivory font-semibold">{t(`${id}_author`)}</span>
                  <span className="text-white/50"> — {t(`${id}_role`)}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/65 mb-8 max-w-xl mx-auto">{t("cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={route("contact")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
            >
              {t("cta_devis")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={route("galerie")}
              className="px-8 py-3 border border-warm/40 text-warm font-semibold rounded hover:bg-warm/10 transition-colors"
            >
              {t("cta_gallery")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
