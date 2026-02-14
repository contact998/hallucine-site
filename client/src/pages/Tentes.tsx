/*
 * Page dédiée : Tentes Gonflables
 * Technologie Airtight — même que les écrans étanches
 * Photos réelles uniquement
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, ChevronRight, Wind, Shield, Feather, Clock } from "lucide-react";

const HERO_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/IbNUEdhyhiTLcBgz.JPG";
const DETAIL_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UjFqdXoLutZxgPuy.JPG";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const scrollToContact = () => {
  window.location.href = "/#contact";
};

export default function Tentes() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Tente gonflable Hallucine lors d'un événement" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.03_260_/_0.92)] via-[oklch(0.12_0.03_260_/_0.75)] to-[oklch(0.10_0.03_260_/_0.4)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-transparent to-transparent" />
        </div>
        <div className="relative container pt-32 pb-16">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">Tentes gonflables</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 leading-tight max-w-3xl">
              Tentes gonflables<br />
              <span className="text-gradient-gold">Technologie Airtight</span>
            </h1>
            <p className="text-white/70 mt-6 text-lg max-w-2xl leading-relaxed">
              La même technologie que nos écrans étanches, appliquée aux structures événementielles. Montage rapide, ultra-légères, sans soufflerie.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                L'expertise du kitesurf<br />
                <span className="text-white/60 text-2xl">au service de l'événementiel</span>
              </h2>
              <p className="text-white/60 mt-6 leading-relaxed">
                Nos tentes gonflables utilisent la même technologie Airtight que nos écrans de 2 à 8 mètres. Inspirée des boudins de kitesurf, cette technologie à chambre à air scellée permet un gonflage unique : une fois en place, la tente est autonome, sans soufflerie, sans bruit, sans câble.
              </p>
              <p className="text-white/60 mt-4 leading-relaxed">
                Le résultat : des structures événementielles ultra-légères, montées en quelques minutes, qui tiennent au vent et à la pluie. Idéales pour les festivals, les événements corporate, les marchés et les salons.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Feather, label: "Ultra-légères", desc: "Transport facile" },
                  { icon: Clock, label: "Montage rapide", desc: "Quelques minutes" },
                  { icon: Shield, label: "Étanches", desc: "Pluie et vent" },
                  { icon: Wind, label: "Sans soufflerie", desc: "100% silencieux" },
                ].map((f, i) => (
                  <div key={i} className="p-4 border border-white/10 rounded-sm bg-white/[0.02]">
                    <f.icon className="w-6 h-6 text-gold mb-2" />
                    <div className="text-white font-semibold text-sm">{f.label}</div>
                    <div className="text-white/40 text-xs">{f.desc}</div>
                  </div>
                ))}
              </div>

              <button onClick={scrollToContact} className="mt-8 flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
                Demander un devis <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1}>
              <img src={DETAIL_IMG} alt="Détail structure gonflable Hallucine" className="w-full rounded-sm border border-white/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Pourquoi choisir nos tentes ?</h2>
          </motion.div>
          <div className="space-y-6">
            {[
              "Technologie Airtight éprouvée — la même que nos écrans depuis 30 ans",
              "Chambre à air scellée — un seul gonflage suffit pour toute la durée de l'événement",
              "Aucune soufflerie nécessaire — pas de bruit, pas de câble électrique",
              "Ultra-légères — une seule personne peut transporter et monter la tente",
              "Résistantes au vent et à la pluie — conçues pour l'extérieur",
              "Personnalisables — formes, tailles et marquage selon vos besoins",
              "Garantie 10 ans — la même exigence de qualité que pour nos écrans",
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={i} className="flex items-start gap-4 p-4 border border-white/5 rounded-sm">
                <Check className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                <span className="text-white/70">{item}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button onClick={scrollToContact} className="px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
              Demander un devis personnalisé
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
