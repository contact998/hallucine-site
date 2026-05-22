/*
 * Page Devenir Distributeur — Contenu du site d'origine
 * Design: cinéma vintage — fond sombre, accents dorés
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Users, TrendingUp, Award, MessageCircle } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";
import EmailLink from "@/components/EmailLink";

export default function DevenirDistributeur() {
  const route = useRoutes();
  const { t } = useTranslation("devenir-distributeur");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/vajzfoYsbBMsDfIq.webp");

  const avantages = [
    { icon: Award, title: t("av1_title"), desc: t("av1_desc") },
    { icon: TrendingUp, title: t("av2_title"), desc: t("av2_desc") },
    { icon: Users, title: t("av3_title"), desc: t("av3_desc") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("breadcrumb_page"), routeKey: "devenir-distributeur" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("section_label")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")}{" "}<br />
            <span className="text-warm">{t("hero_colored")}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            {t("hero_desc")}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container max-w-4xl">
          <div className="space-y-6 text-white/70 leading-relaxed">
            <p>{t("intro_text")}</p>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-10">{t("avantages_title")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {avantages.map((a, i) => (
              <div key={i} className="p-8 bg-card border border-border rounded-lg">
                <a.icon className="w-10 h-10 text-warm mb-4" />
                <h3 className="text-ivory font-bold text-xl mb-4">{a.title}</h3>
                <p className="text-white/60 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment devenir distributeur */}
      <section className="py-16 bg-background">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("comment_title")}</h2>
          <div className="space-y-6 text-white/70 leading-relaxed">
            <p>{t("comment_p1")}</p>
            <p>{t("comment_p2")}</p>
            <p>{t("comment_p3")}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <MessageCircle className="w-12 h-12 text-warm mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            {t("cta_desc")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={route('contact')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_contact")}
            </Link>
            <EmailLink className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
