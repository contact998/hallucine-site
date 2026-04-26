/*
 * Design: "Nuit Étoilée" – Section Contact
 * Utilise le SmartForm unifié intelligent en 6 étapes
 * Refactorisé avec i18n
 */
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import SmartForm from "./SmartForm";
import { AvailabilityExtended } from "./AvailabilityIndicator";
import { useTranslation } from "react-i18next";

export default function ContactSection() {
  const { t } = useTranslation("contact");

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.10_0.04_260_/_0.5)] to-[oklch(0.14_0.03_260)]" />
      <div className="container relative">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left side - Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-gold text-sm font-semibold tracking-widest uppercase">{t("label")}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">
                {t("title_before")}<br />
                <span className="text-gradient-gold text-glow-gold-intense">{t("title_highlight")}</span>
              </h2>
              <p className="text-white/75 text-base mt-4 leading-relaxed">
                {t("subtitle")}
              </p>
              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-base">{t("email_label")}</div>
                    <div className="text-white/70 text-base">contact@hallucine.fr</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-base">{t("phone_label")}</div>
                    <div className="text-white/70 text-base">+33 6 80 14 76 94</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-base">{t("address_label")}</div>
                    <div className="text-white/70 text-base">{t("address_value")}</div>
                  </div>
                </div>
              </div>
              {/* Indicateur de disponibilité IA */}
              <div className="mt-8">
                <AvailabilityExtended />
              </div>
            </motion.div>
          </div>
          {/* Right side - SmartForm */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white/[0.04] border border-white/10 rounded-lg p-6 md:p-8"
            >
              <SmartForm />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
