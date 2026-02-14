/*
 * Section Produits — Design éditorial haut de gamme
 * Écrans (produit phare) en premier, puis tentes et mobilier
 * Photos réelles classées par catégorie
 */
import { motion, useInView } from "framer-motion";
import { ArrowRight, Shield, Wind, Feather, Ruler, ChevronRight, Tent, Armchair } from "lucide-react";
import { Link } from "wouter";
import { useRef } from "react";

const ECRAN_ETANCHE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CzprNCGHiOGRIkTg.jpg";
const ECRAN_SOUFFLERIE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/xEbWQMioMZQLtuDK.jpg";
const TENTE_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/YqpLPgGtuwNJbHEB.png";
const MOBILIER_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bejqCXUcdKFhPUrA.jpg";

export default function ProductsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

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
            <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Nos produits</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
            Des écrans conçus par ceux<br />
            <span className="text-gradient-gold">qui les utilisent</span>
          </h2>
          <p className="text-white/45 text-lg mt-6 max-w-xl leading-relaxed">
            Deux technologies, une même obsession : la légèreté et la fiabilité. 30 ans d'expérience terrain dans chaque couture.
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
            <Link href="/ecrans" className="group block relative overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-gold/20 transition-all duration-700 h-full">
              <div className="relative h-72 overflow-hidden">
                <img
                  src={ECRAN_ETANCHE}
                  alt="Écran gonflable étanche Hallucine 5m"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-[oklch(0.14_0.03_260_/_0.2)] to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-gold text-navy-deep text-[10px] font-bold tracking-[0.2em] uppercase">
                  Best-seller
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-gold transition-colors duration-500">
                      Gamme Étanche
                    </h3>
                    <p className="text-gold/60 text-sm mt-1 font-medium">De 2 à 8 mètres</p>
                  </div>
                  <Shield className="w-8 h-8 text-white/[0.06] group-hover:text-gold/20 transition-colors" />
                </div>
                <p className="text-white/45 text-sm leading-relaxed mb-6 font-serif italic">
                  Inspirée du kitesurf. Chambre à air scellée, gonflage unique en 3 minutes, aucune soufflerie nécessaire. Ultra-légers et transportables par une seule personne.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {["Gonflage unique", "Sans soufflerie", "1 personne suffit", "3× plus léger"].map((f) => (
                    <span key={f} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.05] text-white/50 text-xs text-center">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-gold text-sm font-semibold group-hover:gap-3 transition-all duration-500">
                  Découvrir la gamme <ArrowRight className="w-4 h-4" />
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
            <Link href="/ecrans" className="group block relative overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-gold/20 transition-all duration-700 h-full">
              <div className="relative h-72 overflow-hidden">
                <img
                  src={ECRAN_SOUFFLERIE}
                  alt="Écran gonflable soufflerie Hallucine 15m"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-[oklch(0.14_0.03_260_/_0.2)] to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-navy-deep text-[10px] font-bold tracking-[0.2em] uppercase">
                  Spectaculaire
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-gold transition-colors duration-500">
                      Gamme Soufflerie
                    </h3>
                    <p className="text-gold/60 text-sm mt-1 font-medium">De 5 à 24 mètres</p>
                  </div>
                  <Wind className="w-8 h-8 text-white/[0.06] group-hover:text-gold/20 transition-colors" />
                </div>
                <p className="text-white/45 text-sm leading-relaxed mb-6 font-serif italic">
                  Tissu d'airbag automobile Dupont de Nemours. Soufflerie permanente pour les très grands formats. Se range dans un sac à voile sans pliage. Garantie 10 ans.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {["Tissu d'airbag", "Sac à voile", "Garantie 10 ans", "200 kg max"].map((f) => (
                    <span key={f} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.05] text-white/50 text-xs text-center">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-gold text-sm font-semibold group-hover:gap-3 transition-all duration-500">
                  Découvrir la gamme <ArrowRight className="w-4 h-4" />
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
            <Link href="/tentes" className="group flex gap-6 p-6 border border-white/[0.06] bg-white/[0.02] hover:border-gold/20 transition-all duration-700 h-full">
              <div className="w-28 h-28 shrink-0 overflow-hidden">
                <img src={TENTE_IMG} alt="Tente gonflable Hallucine" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors duration-500">
                  Tentes gonflables
                </h3>
                <p className="text-gold/50 text-xs mt-1 font-medium">Technologie étanche</p>
                <p className="text-white/40 text-sm mt-3 leading-relaxed line-clamp-2">
                  Même technologie que nos écrans. Montage rapide, sans outils, sans soufflerie.
                </p>
                <div className="flex items-center gap-2 text-gold text-xs font-medium mt-4 group-hover:gap-3 transition-all">
                  Découvrir <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/mobilier" className="group flex gap-6 p-6 border border-white/[0.06] bg-white/[0.02] hover:border-gold/20 transition-all duration-700 h-full">
              <div className="w-28 h-28 shrink-0 overflow-hidden">
                <img src={MOBILIER_IMG} alt="Mobilier gonflable Hallucine" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors duration-500">
                  Mobilier gonflable
                </h3>
                <p className="text-gold/50 text-xs mt-1 font-medium">Technologie étanche</p>
                <p className="text-white/40 text-sm mt-3 leading-relaxed line-clamp-2">
                  Canapés, fauteuils, comptoirs. Léger, transportable, élégant.
                </p>
                <div className="flex items-center gap-2 text-gold text-xs font-medium mt-4 group-hover:gap-3 transition-all">
                  Découvrir <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
