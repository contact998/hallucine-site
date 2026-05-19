/*
 * Page À propos — Histoire de Daniel et Hallucine
 * Contenu fidèle au site d'origine hallucinecran.com
 * Design: cinéma vintage — fond sombre, accents dorés
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";

export default function APropos() {
  const route = useRoutes();
  const { t } = useTranslation("a-propos");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/vajzfoYsbBMsDfIq.webp");

  const chiffres = [
    { value: "25+", label: t("stat1_label") },
    { value: "1000+", label: t("stat2_label") },
    { value: "30+", label: t("stat3_label") },
    { value: "1992", label: t("stat4_label") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="a-propos-hallucine"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: t("meta_title"), url: "/a-propos-hallucine" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
          url: "https://hallucinecran.com/a-propos-hallucine",
        }}
        article={{
          headline: t("histoire_title"),
          description: t("hero_desc"),
          image: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/vajzfoYsbBMsDfIq.webp",
          url: "https://hallucinecran.com/a-propos-hallucine",
          datePublished: "1992-01-01T00:00:00Z",
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

      {/* Chiffres clés */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {chiffres.map((c) => (
              <div key={c.label} className="text-center p-6 bg-card border border-border rounded-lg">
                <p className="text-warm text-3xl md:text-4xl font-bold mb-2">{c.value}</p>
                <p className="text-white/60 text-sm">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* L'histoire de Daniel */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("histoire_title")}</h2>
          <div className="max-w-4xl space-y-8">
            <div className="p-8 bg-card border border-border rounded-lg">
              <p className="text-warm font-semibold text-lg mb-4 italic">
                "{t("daniel_quote")}"
              </p>
              <p className="text-white/70 leading-relaxed">
                {t("daniel_intro")}
              </p>
            </div>

            <div>
              <h3 className="text-warm font-semibold text-xl mb-4">{t("ch1_title")}</h3>
              <p className="text-white/70 leading-relaxed">
                {t("ch1_p1")}
              </p>
              <p className="text-white/70 leading-relaxed mt-4">
                {t("ch1_p2_before")}<strong className="text-ivory">{t("ch1_p2_year")}</strong>{t("ch1_p2_after")}
              </p>
            </div>

            <div>
              <h3 className="text-warm font-semibold text-xl mb-4">{t("ch2_title")}</h3>
              <p className="text-white/70 leading-relaxed">
                {t("ch2_p1_before")}<strong className="text-ivory">{t("ch2_p1_countries")}</strong>{t("ch2_p1_after")}
              </p>
              <p className="text-white/70 leading-relaxed mt-4">
                {t("ch2_p2")}
              </p>
              <p className="text-white/70 leading-relaxed mt-4">
                {t("ch2_p3")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cinéma en plein air */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("cinema_title")}</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-warm font-semibold text-xl mb-4">{t("cinema1_title")}</h3>
              <p className="text-white/70 leading-relaxed">{t("cinema1_p1")}</p>
              <p className="text-white/70 leading-relaxed mt-4">{t("cinema1_p2")}</p>
            </div>
            <div>
              <h3 className="text-warm font-semibold text-xl mb-4">{t("cinema2_title")}</h3>
              <p className="text-white/70 leading-relaxed">{t("cinema2_p1")}</p>
              <p className="text-white/70 leading-relaxed mt-4">{t("cinema2_p2")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("valeurs_title")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-bold text-xl mb-4">{t("val1_title")}</h3>
              <p className="text-white/60 leading-relaxed">{t("val1_desc")}</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-bold text-xl mb-4">{t("val2_title")}</h3>
              <p className="text-white/60 leading-relaxed">{t("val2_desc")}</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-bold text-xl mb-4">{t("val3_title")}</h3>
              <p className="text-white/60 leading-relaxed">{t("val3_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/60 mb-8">{t("cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={route('contact')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_contact")}
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              {t("cta_devis")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
