/*
 * Page Hub Écrans Gonflables
 * Redirige vers les 3 sous-pages : Géant (soufflerie), Étanche, Économique
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmCountdown from "@/components/FilmCountdown";
import { Link } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";

export default function Ecrans() {
  const route = useRoutes();
  const { t } = useTranslation("ecrans");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vajzfoYsbBMsDfIq.webp");

  const gammes = [
    { title: t("g1_title"), desc: t("g1_desc"), href: route("ecran-geant"), highlight: t("g1_highlight") },
    { title: t("g2_title"), desc: t("g2_desc"), href: route("ecran-etanche"), highlight: t("g2_highlight") },
    { title: t("g3_title"), desc: t("g3_desc"), href: route("ecran-economique"), highlight: t("g3_highlight") },
    { title: t("g4_title"), desc: t("g4_desc"), href: route("comparaison"), highlight: t("g4_highlight") },
    { title: t("g5_title"), desc: t("g5_desc"), href: route("ecrans-led"), highlight: t("g5_highlight") },
  ];

  const avantages = [
    { title: t("av1_title"), desc: t("av1_desc") },
    { title: t("av2_title"), desc: t("av2_desc") },
    { title: t("av3_title"), desc: t("av3_desc") },
    { title: t("av4_title"), desc: t("av4_desc") },
  ];

  const faqItems = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
    { q: t("faq_q6"), a: t("faq_a6") },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(true);

  const ecransFaqs = faqItems.map(f => ({ question: f.q, answer: f.a }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="ecrans"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: t("meta_title"), url: "/ecran-gonflable" },
        ]}
        product={{
          name: "Écrans de Cinéma Gonflables Hallucine",
          description: t("meta_desc"),
          image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vajzfoYsbBMsDfIq.webp",
          url: "/ecran-gonflable",
          category: t("section_label"),
          minPrice: 990,
        }}
        faqs={ecransFaqs}
      />
      {showCountdown && <FilmCountdown onComplete={() => setShowCountdown(false)} />}
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("section_label")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")}<br />
            <span className="text-warm">{t("hero_colored")}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            {t("hero_desc")}
          </p>
        </div>
      </section>

      {/* Les gammes */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("gammes_title")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {gammes.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group p-8 bg-card border border-border rounded-lg card-hover block"
              >
                <h3 className="text-xl font-bold text-ivory mb-3 group-hover:text-warm transition-colors">
                  {g.title}
                </h3>
                <p className="text-warm text-sm font-medium mb-3">{g.highlight}</p>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{g.desc}</p>
                <span className="inline-flex items-center gap-2 text-warm text-sm font-medium">
                  {t("voir_details")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("avantages_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {avantages.map((item) => (
              <div key={item.title} className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-warm font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("faq_title")}</h2>
          <div className="max-w-3xl space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-ivory font-medium pr-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-warm shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-white/60 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/60 mb-8">{t("cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={route('contact')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_contact")}
            </Link>
            <Link href={route('contact')} className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              {t("cta_prix")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
