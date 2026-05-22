/*
 * Page Comparaison Écrans Gonflables — Hallucine vs Concurrent
 * Contenu i18n via namespace "comparaison"
 */
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmCountdown from "@/components/FilmCountdown";
import { Link } from "wouter";
import { useState } from "react";
import { Check, X, Trophy, Feather, Clock, Shield, Wind, Truck, Wrench, Leaf, Users, Mountain, Package, Ruler, Star } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useRoutes } from "@/i18n/useRoutes";

export default function Comparaison() {
  const route = useRoutes();
  const { t } = useTranslation("comparaison");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/vajzfoYsbBMsDfIq.webp");

  const [showCountdown, setShowCountdown] = useState(true);

  const comparisonData = [
    { carac: t("crit_weight"), hallucine: t("hall_weight"), concurrent: t("comp_weight"), icon: Feather },
    { carac: t("crit_material"), hallucine: t("hall_material"), concurrent: t("comp_material"), icon: Shield },
    { carac: t("crit_logistics"), hallucine: t("hall_logistics"), concurrent: t("comp_logistics"), icon: Truck },
    { carac: t("crit_screen"), hallucine: t("hall_screen"), concurrent: t("comp_screen"), icon: Wrench },
    { carac: t("crit_storage"), hallucine: t("hall_storage"), concurrent: t("comp_storage"), icon: Package },
    { carac: t("crit_wind"), hallucine: t("hall_wind"), concurrent: t("comp_wind"), icon: Wind },
    { carac: t("crit_setup"), hallucine: t("hall_setup"), concurrent: t("comp_setup"), icon: Clock },
    { carac: t("crit_teardown"), hallucine: t("hall_teardown"), concurrent: t("comp_teardown"), icon: Clock },
    { carac: t("crit_versatility"), hallucine: t("hall_versatility"), concurrent: t("comp_versatility"), icon: Mountain },
    { carac: t("crit_warranty"), hallucine: t("hall_warranty"), concurrent: t("comp_warranty"), icon: Star },
    { carac: t("crit_experience"), hallucine: t("hall_experience"), concurrent: t("comp_experience"), icon: Trophy },
    { carac: t("crit_safety"), hallucine: t("hall_safety"), concurrent: t("comp_safety"), icon: Users },
    { carac: t("crit_flexibility"), hallucine: t("hall_flexibility"), concurrent: t("comp_flexibility"), icon: Wind },
    { carac: t("crit_impact"), hallucine: t("hall_impact"), concurrent: t("comp_impact"), icon: Mountain },
    { carac: t("crit_carbon"), hallucine: t("hall_carbon"), concurrent: t("comp_carbon"), icon: Leaf },
    { carac: t("crit_handling"), hallucine: t("hall_handling"), concurrent: t("comp_handling"), icon: Ruler },
  ];

  const arguments7 = [
    { num: "1", title: t("arg1_title"), text: t("arg1_text") },
    { num: "2", title: t("arg2_title"), text: t("arg2_text") },
    { num: "3", title: t("arg3_title"), text: t("arg3_text") },
    { num: "4", title: t("arg4_title"), text: t("arg4_text") },
    { num: "5", title: t("arg5_title"), text: t("arg5_text") },
    { num: "6", title: t("arg6_title"), text: t("arg6_text") },
    { num: "7", title: t("arg7_title"), text: t("arg7_text") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: "Comparaison", routeKey: "comparaison" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
        }}
        faqs={arguments7.map((arg) => ({ question: arg.title, answer: arg.text }))}
      />
      {showCountdown && <FilmCountdown onComplete={() => setShowCountdown(false)} />}
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("section_label")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")}{" "}<br />
            <span className="text-warm">{t("hero_title_colored")}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">{t("hero_desc")}</p>
        </div>
      </section>

      {/* Tableau comparatif visuel */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("table_title")}</h2>
          <p className="text-white/60 mb-10 max-w-3xl">{t("table_desc")}</p>

          {/* En-tête du tableau */}
          <div className="hidden md:grid md:grid-cols-[2fr_3fr_3fr] gap-0 mb-1">
            <div className="p-4 bg-warm/20 rounded-tl-lg">
              <span className="text-warm font-bold text-sm uppercase tracking-wider">{t("col_criterion")}</span>
            </div>
            <div className="p-4 bg-warm/20 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warm" />
              <span className="text-warm font-bold text-sm uppercase tracking-wider">{t("col_hallucine")}</span>
            </div>
            <div className="p-4 bg-white/5 rounded-tr-lg">
              <span className="text-white/40 font-bold text-sm uppercase tracking-wider">{t("col_competitor")}</span>
            </div>
          </div>

          {/* Lignes du tableau */}
          <div className="space-y-px">
            {comparisonData.map((row, i) => {
              const Icon = row.icon;
              return (
                <div
                  key={i}
                  className={`grid grid-cols-1 md:grid-cols-[2fr_3fr_3fr] gap-0 ${
                    i % 2 === 0 ? "bg-card" : "bg-card/60"
                  } ${i === comparisonData.length - 1 ? "rounded-b-lg" : ""}`}
                >
                  <div className="p-4 flex items-center gap-3 border-b border-white/5 md:border-b-0 md:border-r md:border-r-white/5">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-warm/15 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-warm" />
                    </div>
                    <span className="font-semibold text-ivory text-sm">{row.carac}</span>
                  </div>
                  <div className="p-4 flex items-start gap-3 border-b border-white/5 md:border-b-0 md:border-r md:border-r-white/5 bg-green-950/10">
                    <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm leading-relaxed">{row.hallucine}</span>
                  </div>
                  <div className="p-4 flex items-start gap-3 bg-red-950/10">
                    <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-white/50 text-sm leading-relaxed">{row.concurrent}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visuels comparatifs */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("visuels_title")}</h2>
          <p className="text-white/60 mb-10 max-w-3xl">{t("visuels_desc")}</p>
          <div className="grid md:grid-cols-2 gap-6">
            <img
              src="/img/comparaison-transport.jpg"
              alt={t("visuel1_alt")}
              className="w-full rounded-lg border border-border"
              loading="lazy"
              decoding="async"
            />
            <img
              src="/img/comparaison-poids.jpg"
              alt={t("visuel2_alt")}
              className="w-full rounded-lg border border-border"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* 7 arguments détaillés */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("args_title")}</h2>
          <p className="text-white/60 mb-12 max-w-3xl">{t("args_desc")}</p>
          <div className="space-y-8 max-w-4xl">
            {arguments7.map((arg) => (
              <div key={arg.num} className="flex gap-6 p-6 bg-card border border-border rounded-lg">
                <div className="shrink-0 w-12 h-12 rounded-full bg-warm/20 flex items-center justify-center">
                  <span className="text-warm font-bold text-lg">{arg.num}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ivory mb-3">{arg.title}</h3>
                  <p className="text-white/65 leading-relaxed">{arg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bénéfices */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("benefits_title")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("benefit1_title")}</h3>
              <p className="text-white/65 text-sm leading-relaxed">{t("benefit1_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("benefit2_title")}</h3>
              <p className="text-white/65 text-sm leading-relaxed">{t("benefit2_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("benefit3_title")}</h3>
              <p className="text-white/65 text-sm leading-relaxed">{t("benefit3_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/65 mb-8 max-w-xl mx-auto">{t("cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={route('ecrans')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_screens")}
            </Link>
            <Link href={route('contact')} className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              {t("cta_devis")}
            </Link>
            <Link href={route('contact')} className="px-8 py-3 border border-white/20 text-white/70 font-semibold rounded hover:bg-white/5 transition-colors">
              {t("cta_contact")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
