/*
 * Design: "Nuit Étoilée" – Section Produits
 * Photos CORRECTES par catégorie :
 * - Gamme Étanche : photo d'un écran étanche (5m Ritz)
 * - Gamme Soufflerie : photo d'un écran soufflerie (15m nuit)
 * - Tentes : photo de tente réelle
 * - Mobilier : photo de mobilier réel
 */
import { motion } from "framer-motion";
import { Wind, Shield, Feather, Ruler, ChevronRight } from "lucide-react";
import { Link } from "wouter";

// Photos CORRECTES par catégorie
const ECRAN_ETANCHE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CzprNCGHiOGRIkTg.jpg"; // Écran étanche 5m Ritz
const ECRAN_SOUFFLERIE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/xEbWQMioMZQLtuDK.jpg"; // Écran soufflerie 15m nuit
const TENTE_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/YqpLPgGtuwNJbHEB.png"; // Tente gonflable réelle
const MOBILIER_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bejqCXUcdKFhPUrA.jpg"; // Fauteuil gonflable réel

const scrollToContact = () => {
  const el = document.querySelector("#contact");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15 },
  }),
};

export default function ProductsSection() {
  return (
    <section id="produits" className="py-24 md:py-32 relative">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          custom={0}
          className="max-w-2xl mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Nos produits</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 leading-tight">
            Des écrans conçus par ceux qui les utilisent
          </h2>
          <p className="text-white/60 mt-4 text-lg leading-relaxed">
            Deux technologies, une même obsession : la légèreté et la fiabilité. Chaque écran Hallucine est le fruit de 30 ans d'expérience terrain.
          </p>
        </motion.div>

        {/* Two product families */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gamme Étanche */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={1}
            className="group relative overflow-hidden rounded-sm border border-white/10 bg-white/[0.03]"
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src={ECRAN_ETANCHE}
                alt="Écran gonflable étanche Hallucine 5m installé au Ritz - technologie étanche"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-gold text-navy-deep text-xs font-bold tracking-wider uppercase rounded-sm">
                Technologie Étanche
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Gamme Étanche — 2m à 8m</h3>
              <p className="text-white/50 text-sm mb-6 font-serif italic">
                Inspirée du kitesurf. Chambre à air scellée, autonome, sans soufflerie.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">100% étanche</div>
                    <div className="text-white/40 text-xs">Chambre à air scellée</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Feather className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">Ultra-léger</div>
                    <div className="text-white/40 text-xs">3× plus léger que la concurrence</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wind className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">Sans soufflerie</div>
                    <div className="text-white/40 text-xs">Silencieux, autonome</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ruler className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">2m à 8m</div>
                    <div className="text-white/40 text-xs">Toutes tailles disponibles</div>
                  </div>
                </div>
              </div>
              <Link href="/ecrans" className="flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all duration-300">
                Voir la gamme étanche <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Gamme Soufflerie */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={2}
            className="group relative overflow-hidden rounded-sm border border-white/10 bg-white/[0.03]"
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src={ECRAN_SOUFFLERIE}
                alt="Écran gonflable géant Hallucine 15m à soufflerie permanente - projection nocturne"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-white text-navy-deep text-xs font-bold tracking-wider uppercase rounded-sm">
                Soufflerie permanente
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Gamme Pro — 5m à 24m</h3>
              <p className="text-white/50 text-sm mb-6 font-serif italic">
                Tissu d'airbag automobile. Né dans une voilerie bretonne.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">Garanti 10 ans</div>
                    <div className="text-white/40 text-xs">Polyamide haute ténacité</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Feather className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">200 kg max</div>
                    <div className="text-white/40 text-xs">vs 600 kg chez la concurrence</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wind className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">Sac à voile</div>
                    <div className="text-white/40 text-xs">Rangement sans pliage</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ruler className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">5m à 24m</div>
                    <div className="text-white/40 text-xs">Événements majeurs</div>
                  </div>
                </div>
              </div>
              <Link href="/ecrans" className="flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all duration-300">
                Voir la gamme soufflerie <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Secondary products - Tentes et Mobilier avec VRAIES photos */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          custom={3}
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          <Link href="/tentes" className="group block overflow-hidden rounded-sm border border-white/10 bg-white/[0.02] hover:border-gold/30 transition-colors duration-300">
            <div className="flex gap-4 p-4">
              <div className="w-28 h-28 shrink-0 overflow-hidden rounded-sm">
                <img src={TENTE_IMG} alt="Tente gonflable Hallucine - technologie étanche" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-2">Tentes gonflables</h4>
                <p className="text-white/50 text-sm mb-3">
                  Même technologie étanche que nos écrans. Montage en quelques minutes, sans soufflerie permanente.
                </p>
                <span className="text-gold text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  En savoir plus <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
          <Link href="/mobilier" className="group block overflow-hidden rounded-sm border border-white/10 bg-white/[0.02] hover:border-gold/30 transition-colors duration-300">
            <div className="flex gap-4 p-4">
              <div className="w-28 h-28 shrink-0 overflow-hidden rounded-sm">
                <img src={MOBILIER_IMG} alt="Fauteuil gonflable Hallucine - mobilier événementiel" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-2">Mobilier gonflable</h4>
                <p className="text-white/50 text-sm mb-3">
                  Canapés, fauteuils, comptoirs. Technologie étanche pour un mobilier léger et élégant.
                </p>
                <span className="text-gold text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  En savoir plus <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
