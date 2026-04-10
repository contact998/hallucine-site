/*
 * Section FAQ — Refactorisé avec i18n
 */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { getRoute } from "@/i18n/routes";

export default function FaqSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { t, i18n } = useTranslation("home");
  const lang = (i18n.language || "fr") as "fr" | "en" | "de" | "es";

  const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6"];

  return (
    <section id="faq" className="relative py-32 overflow-hidden">
      <div ref={ref} className="container relative max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <HelpCircle className="w-8 h-8 text-gold mx-auto mb-4" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            {t("faq.section_title")}
          </h2>
          <p className="text-white/75 text-lg mt-4 leading-relaxed">
            {t("faq.section_desc")}
          </p>
        </motion.div>
        {/* FAQ items */}
        <div className="space-y-3">
          {faqKeys.map((key, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
              className="border border-[#D4AF37]/30 rounded-xl overflow-hidden bg-white/[0.04]"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-white font-medium text-base pr-4">{t(`faq.${key}`)}</span>
                <ChevronDown className={`w-5 h-5 text-gold shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5">
                  <p className="text-white/80 text-base leading-relaxed">{t(`faq.a${key.slice(1)}`)}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/70 text-base mb-4">{t("faq.cta_text")}</p>
          <Link href={getRoute("contact", lang)} className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-lg hover:bg-gold-light transition-all glow-gold">
            {t("faq.cta_button")} <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
