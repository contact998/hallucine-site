/*
 * Section Cas d'Usage — Refactorisé avec i18n
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ChevronRight, Film, Music, Briefcase, Heart, Trophy, Car, Hotel } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { getRoute } from "@/i18n/routes";

const ICONS = [Film, Music, Briefcase, Heart, Trophy, Car, Hotel];

export default function UseCasesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t, i18n } = useTranslation("home");
  const lang = (i18n.language || "fr") as "fr" | "en" | "de" | "es";

  const useCases = [
    {
      icon: Film,
      key: "cinema",
    },
    {
      icon: Music,
      key: "festival",
    },
    {
      icon: Briefcase,
      key: "corporate",
    },
    {
      icon: Heart,
      key: "mariage",
    },
    {
      icon: Trophy,
      key: "sport",
    },
    {
      icon: Car,
      key: "drivein",
    },
    {
      icon: Hotel,
      key: "hotel",
    },
  ];

  return (
    <section id="usages" className="relative py-32 overflow-hidden bg-white/[0.02]">
      <div ref={ref} className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.3em] uppercase">{t("usecases.section_label")}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
            {t("usecases.section_title")}
          </h2>
          <p className="text-white/70 text-lg mt-6 max-w-xl leading-relaxed">
            {t("usecases.section_desc")}
          </p>
        </motion.div>
        {/* Use cases grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className="p-6 border border-white/[0.06] bg-white/[0.02] hover:border-gold/20 transition-all duration-500 group"
            >
              <uc.icon className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-bold text-white mb-3">{t(`usecases.${uc.key}_title`)}</h3>
              <p className="text-white/75 text-base leading-relaxed mb-4">{t(`usecases.${uc.key}_desc`)}</p>
              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex items-start gap-2">
                  <span className="text-gold text-sm font-semibold shrink-0 mt-0.5">{t("usecases.sizes_label")}</span>
                  <span className="text-white/70 text-sm">{t(`usecases.${uc.key}_sizes`)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold text-sm font-semibold shrink-0 mt-0.5">{t("usecases.examples_label")}</span>
                  <span className="text-white/70 text-sm">{t(`usecases.${uc.key}_examples`)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-white/75 text-base mb-4">{t("usecases.cta_text")}</p>
          <Link href={getRoute("contact", lang)} className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-lg hover:bg-gold-light transition-all glow-gold">
            {t("usecases.cta_button")} <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
