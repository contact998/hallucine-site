/*
 * Page Contact — Contenu texte enrichi
 * Formulaire intelligent + infos pratiques + réassurance + FAQ
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ChevronDown, Clock, Globe, Shield, Truck, HelpCircle } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import EmailLink from "@/components/EmailLink";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function Contact() {
  const { t } = useTranslation("contact");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/vajzfoYsbBMsDfIq.webp");

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const reassuranceItems = [
    { icon: Clock, title: t("r1_title"), desc: t("r1_desc") },
    { icon: Globe, title: t("r2_title"), desc: t("r2_desc") },
    { icon: Shield, title: t("r3_title"), desc: t("r3_desc") },
    { icon: Truck, title: t("r4_title"), desc: t("r4_desc") },
  ];

  const faqContact = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="contact"
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: "Contact", routeKey: "contact" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
        }}
        faqs={faqContact.map(f => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <h1 className="sr-only">{t("meta_title")}</h1>
      <div className="pt-24">
        <ContactSection />
      </div>

      {/* Réassurance */}
      <section className="py-20 md:py-24 bg-white/[0.02]">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reassuranceItems.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="p-5 border border-white/[0.06] rounded-lg"
              >
                <item.icon className="w-6 h-6 text-gold mb-3" />
                <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infos pratiques */}
      <section className="py-20 md:py-24">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">{t("infos_title")}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-white/60 text-sm leading-relaxed">
                <h3 className="text-white font-semibold text-base mb-2">{t("coords_title")}</h3>
                <p>
                  <strong className="text-white/80">{t("phone_label_long")}</strong> +33 4 58 21 20 10
                </p>
                <p>
                  <strong className="text-white/80">{t("mobile_label")}</strong> +33 6 80 14 76 94
                </p>
                <p>
                  <strong className="text-white/80">{t("whatsapp_label")}</strong> +33 6 80 14 76 94
                </p>
                <p>
                  <strong className="text-white/80">{t("wechat_label")}</strong> (+86) 13172020714
                </p>
                <p>
                  <strong className="text-white/80">{t("email_label_long")}</strong>{" "}
                  <EmailLink className="text-gold hover:underline" />
                </p>
                <p>
                  <strong className="text-white/80">{t("langues_label")}</strong> {t("langues_value")}
                </p>
              </div>
              <div className="space-y-4 text-white/60 text-sm leading-relaxed">
                <h3 className="text-white font-semibold text-base mb-2">{t("fab_title")}</h3>
                <p>{t("fab_desc")}</p>
                <p>
                  <strong className="text-white/80">{t("qualite_label")}</strong> {t("qualite_desc")}
                </p>
                <p>
                  <strong className="text-white/80">{t("expedition_label")}</strong> {t("expedition_desc")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Contact */}
      <section className="py-20 md:py-24 bg-white/[0.02]">
        <div className="container max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
            <HelpCircle className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">{t("faq_title")}</h2>
          </motion.div>

          <div className="space-y-3">
            {faqContact.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="border border-white/10 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white font-medium text-sm pr-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gold shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
