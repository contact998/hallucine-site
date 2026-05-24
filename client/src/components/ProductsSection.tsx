/*
 * Section Produits — Design éditorial haut de gamme
 * Écrans (produit phare) en premier, puis tentes et mobilier
 * Photos réelles classées par catégorie
 */
import { motion, useInView } from "framer-motion";
import { ArrowRight, Shield, Wind, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { getRoute } from "@/i18n/routes";

const ECRAN_ETANCHE = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/tWHlxkXeLyoqBOzz.webp";
const ECRAN_SOUFFLERIE = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/HpSkkCcPrajdeXOF.webp";
const TENTE_IMG = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/zisRVgFNBpzCScJO.webp";
const MOBILIER_IMG = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/yLbqpriBLKZrILqt.webp";

export default function ProductsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t, i18n } = useTranslation("home");
  const lang = (i18n.language || "fr") as "fr" | "en" | "de" | "es";

  return (
    <section id="produits" className="relative py-32 bg-background overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, oklch(0.78 0.12 85) 1px, transparent 0)",
        backgroundSize: "48px 48px",
      }} />

      <div ref={ref} className="container relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.3em] uppercase">{t("products.section_label")}</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
            {t("products.section_title_1")}<br />
            <span className="text-gradient-gold text-glow-gold-intense">{t("products.section_title_2")}</span>
          </h2>
          <p className="text-white/70 text-lg mt-6 max-w-xl leading-relaxed">
            {t("products.section_desc")}
          </p>
        </motion.div>

        {/* Two main product families */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Gamme Étanche */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link href={getRoute("ecran-etanche", lang)} className="group block relative overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-gold/30 transition-all duration-700 h-full" style={{ boxShadow: '0 0 20px rgba(212, 175, 55, 0.08), 0 0 40px rgba(212, 175, 55, 0.03)' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.2), 0 0 60px rgba(212, 175, 55, 0.1), 0 0 90px rgba(212, 175, 55, 0.05)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.08), 0 0 40px rgba(212, 175, 55, 0.03)'}>
              <div className="relative h-72 overflow-hidden">
                <img loading="lazy"
                  src={ECRAN_ETANCHE}
                  alt="Trois écrans gonflables Hallucine avec canapé gonflable rouge"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={800} height={450}
                decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-[oklch(0.14_0.03_260_/_0.2)] to-transparent" style={{opacity: '0.2'}} />
                <div className="absolute top-4 left-4 px-3 py-1 bg-gold text-navy-deep text-xs font-bold tracking-[0.2em] uppercase">
                  {t("products.etanche_label")}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-gold transition-colors duration-500">
                      {t("products.etanche_title")}
                    </h3>
                    <p className="text-gold/80 text-sm mt-1 font-medium">{t("products.etanche_size")}</p>
                  </div>
                  <Shield className="w-8 h-8 text-white/[0.06] group-hover:text-gold/20 transition-colors" />
                </div>
                <p className="text-white/75 text-base leading-relaxed mb-6 font-serif italic">
                  {t("products.etanche_desc")}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[t("products.etanche_f1"), t("products.etanche_f2"), t("products.etanche_f3"), t("products.etanche_f4")].map((f) => (
                    <span key={f} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] text-white/75 text-sm text-center">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-gold text-sm font-semibold group-hover:gap-3 transition-all duration-500">
                  {t("products.etanche_cta")} <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Gamme Soufflerie */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <Link href={getRoute("ecran-geant", lang)} className="group block relative overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-gold/30 transition-all duration-700 h-full" style={{ boxShadow: '0 0 20px rgba(212, 175, 55, 0.08), 0 0 40px rgba(212, 175, 55, 0.03)' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.2), 0 0 60px rgba(212, 175, 55, 0.1), 0 0 90px rgba(212, 175, 55, 0.05)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.08), 0 0 40px rgba(212, 175, 55, 0.03)'}>
              <div className="relative h-72 overflow-hidden">
                <img loading="lazy"
                  src={ECRAN_SOUFFLERIE}
                  alt="Écran gonflable soufflerie Hallucine 9m en extérieur avec équipe technique"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={800} height={450}
                decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-navy-deep text-xs font-bold tracking-[0.2em] uppercase">
                  {t("products.soufflerie_label")}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-gold transition-colors duration-500">
                      {t("products.soufflerie_title")}
                    </h3>
                    <p className="text-gold/80 text-sm mt-1 font-medium">{t("products.soufflerie_size")}</p>
                  </div>
                  <Wind className="w-8 h-8 text-white/[0.06] group-hover:text-gold/20 transition-colors" />
                </div>
                <p className="text-white/75 text-base leading-relaxed mb-6 font-serif italic">
                  {t("products.soufflerie_desc")}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[t("products.soufflerie_f1"), t("products.soufflerie_f2"), t("products.soufflerie_f3"), t("products.soufflerie_f4")].map((f) => (
                    <span key={f} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] text-white/75 text-sm text-center">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-gold text-sm font-semibold group-hover:gap-3 transition-all duration-500">
                  {t("products.soufflerie_cta")} <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Secondary products — Tentes et Mobilier */}
        <div className="grid sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link href={getRoute("tentes", lang)} className="group flex gap-6 p-6 border border-white/[0.06] bg-white/[0.02] hover:border-gold/30 transition-all duration-700 h-full" style={{ boxShadow: '0 0 15px rgba(212, 175, 55, 0.06), 0 0 30px rgba(212, 175, 55, 0.02)' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 25px rgba(212, 175, 55, 0.18), 0 0 50px rgba(212, 175, 55, 0.08), 0 0 80px rgba(212, 175, 55, 0.04)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.06), 0 0 30px rgba(212, 175, 55, 0.02)'}>
              <div className="w-28 h-28 shrink-0 overflow-hidden">
                <img loading="lazy" src={TENTE_IMG} alt="Tente gonflable Hallucine" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" width={200} height={200} decoding="async" />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors duration-500">
                  {t("products.tentes_title")}
                </h3>
                <p className="text-gold/80 text-sm mt-1 font-medium">{t("products.tentes_tech")}</p>
                <p className="text-white/75 text-base mt-3 leading-relaxed line-clamp-2">
                  {t("products.tentes_desc")}
                </p>
                <div className="flex items-center gap-2 text-gold text-sm font-medium mt-4 group-hover:gap-3 transition-all">
                  {t("products.tentes_cta")} <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href={getRoute("mobilier", lang)} className="group flex gap-6 p-6 border border-white/[0.06] bg-white/[0.02] hover:border-gold/30 transition-all duration-700 h-full" style={{ boxShadow: '0 0 15px rgba(212, 175, 55, 0.06), 0 0 30px rgba(212, 175, 55, 0.02)' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 25px rgba(212, 175, 55, 0.18), 0 0 50px rgba(212, 175, 55, 0.08), 0 0 80px rgba(212, 175, 55, 0.04)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.06), 0 0 30px rgba(212, 175, 55, 0.02)'}>
              <div className="w-28 h-28 shrink-0 overflow-hidden">
                <img loading="lazy" src={MOBILIER_IMG} alt="Mobilier gonflable Hallucine" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" width={200} height={200} decoding="async" />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors duration-500">
                  {t("products.mobilier_title")}
                </h3>
                <p className="text-gold/80 text-sm mt-1 font-medium">{t("products.mobilier_tech")}</p>
                <p className="text-white/75 text-base mt-3 leading-relaxed line-clamp-2">
                  {t("products.mobilier_desc")}
                </p>
                <div className="flex items-center gap-2 text-gold text-sm font-medium mt-4 group-hover:gap-3 transition-all">
                  {t("products.mobilier_cta")} <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
