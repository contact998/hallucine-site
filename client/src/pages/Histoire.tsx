/*
 * Page Histoire — Contenu texte complet et enrichi
 * Timeline narrative + chiffres clés + fondateur + valeurs développées
 */
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { ArrowLeft, Globe, Award, Feather, Users, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";
import ZoomImage from "@/components/ZoomImage";

const ETANCHE_3M = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/hIDMieDLnUJYNHGY.webp";
const ETANCHE_5M_RITZ = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/IzUUAouVxqDCjGMh.webp";
const SOUFFLERIE_13M = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ATgcmLVpJkJrnbvK.webp";
const SOUFFLERIE_24M = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/eEXwXGCYYCdjehRy.webp";
const SOUFFLERIE_15M = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/VWHPufHDlQZZyhyU.webp";
const SOUFFLERIE_12M = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ZsaxtYrqVuqTZtAv.webp";
const TENTE = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/sEPwifSRENrYAMaz.webp";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function Histoire() {
  const route = useRoutes();
  const { t } = useTranslation("histoire");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/vajzfoYsbBMsDfIq.webp");

  const chapters = [
    { year: t("ch1_year"), title: t("ch1_title"), text: t("ch1_text"), image: null, quote: null },
    { year: t("ch2_year"), title: t("ch2_title"), text: t("ch2_text"), image: ETANCHE_3M, quote: null },
    { year: t("ch3_year"), title: t("ch3_title"), text: t("ch3_text"), image: null, quote: t("ch3_quote") },
    { year: t("ch4_year"), title: t("ch4_title"), text: t("ch4_text"), image: SOUFFLERIE_12M, quote: null },
    { year: t("ch5_year"), title: t("ch5_title"), text: t("ch5_text"), image: SOUFFLERIE_24M, quote: t("ch5_quote") },
    { year: t("ch6_year"), title: t("ch6_title"), text: t("ch6_text"), image: ETANCHE_5M_RITZ, quote: null },
    { year: t("ch7_year"), title: t("ch7_title"), text: t("ch7_text"), image: null, quote: null },
    { year: t("ch8_year"), title: t("ch8_title"), text: t("ch8_text"), image: SOUFFLERIE_13M, quote: null },
    { year: t("ch9_year"), title: t("ch9_title"), text: t("ch9_text"), image: null, quote: t("ch9_quote") },
    { year: t("ch10_year"), title: t("ch10_title"), text: t("ch10_text"), image: SOUFFLERIE_15M, quote: null },
  ];

  const keyFigures = [
    { number: t("stat1_num"), label: t("stat1_label"), suffix: t("stat1_suffix") },
    { number: t("stat2_num"), label: t("stat2_label"), suffix: t("stat2_suffix") },
    { number: t("stat3_num"), label: t("stat3_label"), suffix: t("stat3_suffix") },
    { number: t("stat4_num"), label: t("stat4_label"), suffix: t("stat4_suffix") },
  ];

  const values = [
    { title: t("v1_title"), desc: t("v1_desc"), stat: t("v1_stat") },
    { title: t("v2_title"), desc: t("v2_desc"), stat: t("v2_stat") },
    { title: t("v3_title"), desc: t("v3_desc"), stat: t("v3_stat") },
  ];

  return (
    <PageShell>
      <PageStructuredData
        breadcrumbs={[{ name: "Accueil", routeKey: "home" }, { name: t("breadcrumb"), routeKey: "histoire" }]}
        article={{
          headline: t("meta_title"),
          description: t("meta_desc"),
          image: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/vajzfoYsbBMsDfIq.webp",
          datePublished: "2023-01-15T09:00:00+00:00",
          dateModified: "2024-05-20T14:30:00+00:00",
        }}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
        }}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img loading="lazy" src={TENTE} alt="Tente gonflable Hallucine lors d'un événement en plein air" className="w-full h-full object-cover" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.03_260_/_0.95)] via-[oklch(0.12_0.03_260_/_0.80)] to-[oklch(0.10_0.03_260_/_0.6)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-transparent to-transparent" />
        </div>
        <div className="relative container pt-32 pb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> {t("back_home")}
          </Link>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">{t("badge")}</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 leading-tight max-w-3xl">
              {t("hero_title")}{" "}<br />
              <span className="text-gradient-gold">{t("hero_title2")}</span>
            </h1>
            <p className="text-white/70 mt-6 text-xl max-w-2xl leading-relaxed font-serif italic">
              {t("hero_desc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 md:py-20 border-b border-white/5">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {keyFigures.map((fig, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gold">
                  {fig.number}<span className="text-gold/60">{fig.suffix}</span>
                </div>
                <div className="text-white/50 text-sm mt-2">{fig.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />

        <div className="container max-w-5xl">
          {chapters.map((chapter, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeIn}
              className={`relative mb-20 lg:mb-28 flex flex-col ${
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 lg:gap-16 items-start`}
            >
              <div className="absolute left-1/2 -translate-x-1/2 top-2 z-10 hidden lg:block">
                <div className="w-4 h-4 rounded-full bg-gold border-4 border-[oklch(0.14_0.03_260)] shadow-lg shadow-gold/30" />
              </div>

              <div className="flex-1 lg:max-w-[45%]">
                <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/20 rounded-lg mb-4">
                  <span className="text-gold text-sm font-bold">{chapter.year}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{chapter.title}</h2>
                <p className="text-white/60 leading-relaxed text-base">{chapter.text}</p>
                {chapter.quote && (
                  <blockquote className="mt-6 pl-4 border-l-2 border-gold/40">
                    <p className="text-gold/80 font-serif italic text-lg leading-relaxed">{chapter.quote}</p>
                  </blockquote>
                )}
              </div>

              {chapter.image && (
                <div className="flex-1 lg:max-w-[45%] w-full">
                  <ZoomImage
                    src={chapter.image}
                    alt={chapter.title}
                    wrapperClassName="rounded-lg border border-white/10"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Le fondateur */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-[1px] bg-gold" />
              <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">{t("founder_label")}</span>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("founder_title")}</h2>
                <div className="space-y-4 text-white/60 leading-relaxed">
                  <p>{t("founder_p1")}</p>
                  <p>{t("founder_p2")}</p>
                  <p>{t("founder_p3")}</p>
                </div>
              </div>
              <div className="p-6 border border-gold/20 rounded-lg bg-gold/5">
                <h3 className="text-lg font-bold text-gold mb-4">{t("founder_brief")}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span className="text-white/60">{t("founder_location")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span className="text-white/60">{t("founder_exp")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span className="text-white/60">{t("founder_events")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Feather className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span className="text-white/60">{t("founder_inventor")}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-24 md:py-32">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("values_title")}</h2>
              <p className="text-white/50 max-w-xl mx-auto">{t("values_desc")}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((v, i) => (
                <div key={i} className="p-6 border border-white/10 rounded-lg">
                  <h3 className="text-xl font-bold text-gold mb-4">{v.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{v.desc}</p>
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-gold/60 text-xs font-semibold">{v.stat}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white/[0.02]">
        <div className="container text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t("cta_title")}</h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">{t("cta_desc")}</p>
            <Link href={route('contact')} className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-lg hover:bg-gold-light transition-all glow-gold">
              {t("cta_btn")} <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      </PageShell>
  );
}
