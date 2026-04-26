/*
 * Section Technologie — Design premium
 * Histoire du tissu d airbag + technologie kitesurf
 * Refactorise avec i18n
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Feather, Shield, Zap, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TechnologySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation("home");

  return (
    <section id="technologie" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[oklch(0.12_0.04_260)] to-background" />

      <div ref={ref} className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.3em] uppercase">{t("technology.section_label")}</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
            {t("technology.title_1")}<br />
            <span className="text-gradient-gold text-glow-gold-intense">{t("technology.title_2")}</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-20"
        >
          <div className="overflow-hidden rounded-lg">
            <img loading="lazy"
              src="/manus-storage/zjGTWRUKMYDyOTDz_800w_50dc5107.webp"
              srcSet="/manus-storage/zjGTWRUKMYDyOTDz_400w_e23fd0ca.webp 400w, /manus-storage/zjGTWRUKMYDyOTDz_800w_50dc5107.webp 800w, /manus-storage/zjGTWRUKMYDyOTDz_1000w_8f742ba6.webp 1000w"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 456px"
              alt="Ecran 24m gonfle au Stade Velodrome"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              width={600} height={400} decoding="async" />
          </div>
          <div className="overflow-hidden rounded-lg">
            <img loading="lazy"
              src="/manus-storage/fVlIGWRbdtnxnbtQ_800w_cc15f0a6.webp"
              srcSet="/manus-storage/fVlIGWRbdtnxnbtQ_400w_948ee7e0.webp 400w, /manus-storage/fVlIGWRbdtnxnbtQ_800w_cc15f0a6.webp 800w, /manus-storage/fVlIGWRbdtnxnbtQ_1000w_9a186ba2.webp 1000w"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 527px"
              alt="Ecran 24m a plat au Stade Velodrome"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              width={600} height={400} decoding="async" />
          </div>
          <div className="overflow-hidden rounded-lg">
            <img loading="lazy"
              src="/manus-storage/ahSYgICnXZOUogFE_800w_202cd49e.webp"
              srcSet="/manus-storage/ahSYgICnXZOUogFE_400w_d8721546.webp 400w, /manus-storage/ahSYgICnXZOUogFE_800w_202cd49e.webp 800w, /manus-storage/ahSYgICnXZOUogFE_1200w_8b3ffffd.webp 1200w"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 391px"
              alt="Equipe portant l ecran 24m a dos d homme"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              width={600} height={400} decoding="async" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center text-3xl lg:text-5xl font-bold italic text-white mb-20 leading-tight"
        >
          {t("technology.quote_1_before")} <span className="text-gold">{t("technology.quote_1_highlight")}</span> {t("technology.quote_1_after")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center text-2xl lg:text-4xl font-bold italic text-white mb-20 leading-tight"
        >
          {t("technology.quote_2")}
        </motion.p>

        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">{t("technology.story_title")}</h3>

            <div className="space-y-5 text-white/75 text-base leading-relaxed">
              <p>
                {t("technology.story_p1_before")}{" "}
                <strong className="text-white/90">{t("technology.story_p1_highlight")}</strong>{" "}
                {t("technology.story_p1_after")}
              </p>
              <p>
                {t("technology.story_p2_before")}{" "}
                <strong className="text-white/90">{t("technology.story_p2_highlight")}</strong>.
              </p>
              <p>{t("technology.story_p3")}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { icon: Feather, label: t("technology.badge_leger"), desc: t("technology.badge_leger_desc") },
                { icon: Shield, label: t("technology.badge_garantie"), desc: t("technology.badge_garantie_desc") },
                { icon: Zap, label: t("technology.badge_montage"), desc: t("technology.badge_montage_desc") },
                { icon: Award, label: t("technology.badge_france"), desc: t("technology.badge_france_desc") },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.05]">
                  <item.icon className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-sm font-semibold">{item.label}</div>
                    <div className="text-white/65 text-sm mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
