/*
 * Page dédiée : Mobilier Gonflable
 * Technologie étanche — même que les écrans étanches et les tentes
 * Photos RÉELLES de mobilier et accessoires
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, ChevronRight, Feather, Clock, Shield, Palette, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Photos RÉELLES de mobilier et accessoires
const MOBILIER_SUPPORT = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/wUlrsuGxNIzhQWtt.jpg";
const MOBILIER_FAUTEUIL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bejqCXUcdKFhPUrA.jpg";
const ACCESSOIRE_CHARIOT = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/DoSomqHuWBbunOHC.jpg";
const ACCESSOIRE_FLYCASE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/tTDGORaRVTsImQcZ.jpg";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export default function Mobilier() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={MOBILIER_FAUTEUIL} alt="Mobilier gonflable Hallucine" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.03_260_/_0.92)] via-[oklch(0.12_0.03_260_/_0.75)] to-[oklch(0.10_0.03_260_/_0.4)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-transparent to-transparent" />
        </div>
        <div className="relative container pt-32 pb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">Mobilier & Accessoires</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 leading-tight max-w-3xl">
              Mobilier gonflable<br />
              <span className="text-gradient-gold">& accessoires</span>
            </h1>
            <p className="text-white/70 mt-6 text-lg max-w-2xl leading-relaxed">
              La même technologie étanche que nos écrans et nos tentes, appliquée au mobilier événementiel et aux accessoires de transport. Léger, élégant, prêt en quelques minutes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="order-2 lg:order-1">
              <img src={MOBILIER_SUPPORT} alt="Support mobilier gonflable Hallucine" className="w-full rounded-sm border border-white/10" />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1} className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Le confort gonflable<br />
                <span className="text-white/60 text-2xl">pour vos événements</span>
              </h2>
              <p className="text-white/60 mt-6 leading-relaxed">
                Notre mobilier gonflable utilise la technologie étanche, la même que nos écrans de 2 à 8 mètres et nos tentes. Des chambres à air scellées qui se gonflent une seule fois et restent stables toute la durée de l'événement. Pas de soufflerie, pas de bruit, pas de câble.
              </p>
              <p className="text-white/60 mt-4 leading-relaxed">
                Canapés, fauteuils, bars, comptoirs... Chaque pièce est conçue pour être transportée facilement, montée en quelques minutes et personnalisée aux couleurs de votre événement.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Feather, label: "Ultra-léger", desc: "Transport facile" },
                  { icon: Clock, label: "Montage express", desc: "Quelques minutes" },
                  { icon: Shield, label: "Résistant", desc: "Usage intensif" },
                  { icon: Palette, label: "Personnalisable", desc: "Couleurs et marquage" },
                ].map((f, i) => (
                  <div key={i} className="p-4 border border-white/10 rounded-sm bg-white/[0.02]">
                    <f.icon className="w-6 h-6 text-gold mb-2" />
                    <div className="text-white font-semibold text-sm">{f.label}</div>
                    <div className="text-white/40 text-xs">{f.desc}</div>
                  </div>
                ))}
              </div>

              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
                Demander un devis <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Galerie produits */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Nos produits</h2>
            <p className="text-white/60 mt-4">Mobilier et accessoires pour vos événements</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { src: MOBILIER_FAUTEUIL, alt: "Fauteuil gonflable Hallucine", title: "Fauteuils & Canapés", desc: "Assises confortables pour vos espaces lounge" },
              { src: MOBILIER_SUPPORT, alt: "Support gonflable Hallucine", title: "Supports & Structures", desc: "Éléments structurels pour vos installations" },
              { src: ACCESSOIRE_CHARIOT, alt: "Chariot de transport Hallucine", title: "Chariots de transport", desc: "Solutions de transport pour vos écrans et tentes" },
              { src: ACCESSOIRE_FLYCASE, alt: "Flycase Hallucine", title: "Flycases", desc: "Protection et rangement professionnel" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i}
                className="group overflow-hidden rounded-sm border border-white/10 bg-white/[0.03]"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold mb-1">{item.title}</h3>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Cas d'utilisation</h2>
            <p className="text-white/60 mt-4">Notre mobilier s'adapte à tous les types d'événements.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Festivals et concerts", desc: "Zones lounge, espaces VIP, bars et comptoirs pour accueillir vos visiteurs avec style." },
              { title: "Événements corporate", desc: "Mobilier aux couleurs de votre marque pour salons, lancements de produit et séminaires." },
              { title: "Mariages et réceptions", desc: "Espaces détente élégants pour vos invités, en intérieur comme en extérieur." },
              { title: "Événements sportifs", desc: "Zones d'accueil, podiums et espaces partenaires pour retransmissions et compétitions." },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={i} className="p-6 border border-white/10 rounded-sm bg-white/[0.02]">
                <h3 className="text-lg font-bold text-gold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
              Demander un devis personnalisé <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
