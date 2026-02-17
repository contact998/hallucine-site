/*
 * Section Technologie — Design premium
 * Comparatif de poids multi-tailles avec barres animées
 * Histoire du tissu d'airbag + technologie kitesurf
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Feather, Shield, Zap, Award } from "lucide-react";

const ECRAN_ECLATE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HGkkpfyaxsgmapYw.jpg";
const ECRAN_SOUFFLERIE_12 = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/AFizhJVCNHvXVtJS.jpg";

const weightData = [
  { size: "10m", hallucine: 45, competitor: 150 },
  { size: "15m", hallucine: 80, competitor: 300 },
  { size: "20m", hallucine: 140, competitor: 500 },
  { size: "24m", hallucine: 200, competitor: 600 },
];

export default function TechnologySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="technologie" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[oklch(0.12_0.04_260)] to-background" />

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
            <span className="text-gold text-sm font-semibold tracking-[0.3em] uppercase">Technologie</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
            3× plus léger.<br />
            <span className="text-gradient-gold text-glow-gold-intense">Ce n'est pas un slogan.</span>
          </h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Innovation story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Two tech images side by side */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="relative overflow-hidden">
                <img src={ECRAN_ECLATE} alt="Structure écran étanche Hallucine" className="w-full aspect-[3/4] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.04_260)] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold bg-navy-deep/80 px-2 py-1">Étanche</span>
                </div>
              </div>
              <div className="relative overflow-hidden">
                <img src={ECRAN_SOUFFLERIE_12} alt="Écran soufflerie 12m Hallucine" className="w-full aspect-[3/4] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.04_260)] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-white bg-navy-deep/80 px-2 py-1">Soufflerie</span>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6">Du secret défense à l'écran de cinéma</h3>

            <div className="space-y-5 text-white/75 text-base leading-relaxed">
              <p>
                Tout commence à Lyon, capitale historique du textile. En cherchant un tissu à la fois léger et indestructible, nous avons découvert que les <strong className="text-white/90">airbags automobiles</strong> utilisaient exactement ce que nous cherchions.
              </p>
              <p>
                Les constructeurs nous ont dit que c'était «&nbsp;secret défense&nbsp;». Nous ne nous sommes pas découragés. Après des mois d'enquête, nous avons identifié le tissu : un <strong className="text-white/90">polyamide haute ténacité de Dupont de Nemours</strong>.
              </p>
              <p>
                Pour la gamme étanche, l'inspiration est venue d'ailleurs : sur une plage de Hong Kong, en observant des kitesurfs. Leurs boudins gonflables étaient légers, résistants, et parfaitement étanches. La technologie était là, sous nos yeux.
              </p>
            </div>

            {/* Innovation badges */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { icon: Feather, label: "Ultra-léger", desc: "Polyamide haute ténacité" },
                { icon: Shield, label: "Garanti 10 ans", desc: "Tissu d'airbag automobile" },
                { icon: Zap, label: "Montage rapide", desc: "3 min pour un écran étanche" },
                { icon: Award, label: "Conception française", desc: "Design et R&D en France" },
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

          {/* Right: Weight comparison */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="sticky top-32">
              <h3 className="text-2xl font-bold text-white mb-3">Comparatif de poids</h3>
              <p className="text-white/70 text-base mb-8">
                Écrans à soufflerie — Hallucine vs. concurrence (bâche camion)
              </p>

              {/* Weight bars */}
              <div className="space-y-6 mb-12">
                {weightData.map((item, i) => (
                  <motion.div
                    key={item.size}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">Écran {item.size}</span>
                      <span className="text-gold font-bold text-sm">{(item.competitor / item.hallucine).toFixed(1)}× plus léger</span>
                    </div>
                    {/* Hallucine bar */}
                    <div className="relative h-8 bg-white/[0.03] border border-white/[0.06] mb-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${(item.hallucine / item.competitor * 100)}%` } : {}}
                        transition={{ duration: 1.2, delay: 0.7 + i * 0.1, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/80 to-gold/40"
                      />
                      <div className="relative h-full flex items-center px-3 justify-between">
                        <span className="text-xs font-semibold text-navy-deep">Hallucine</span>
                        <span className="text-xs font-bold text-navy-deep">{item.hallucine} kg</span>
                      </div>
                    </div>
                    {/* Competitor bar */}
                    <div className="relative h-8 bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: "100%" } : {}}
                        transition={{ duration: 1.2, delay: 0.7 + i * 0.1, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 bg-white/[0.08]"
                      />
                      <div className="relative h-full flex items-center px-3 justify-between">
                        <span className="text-xs font-medium text-white/70">Concurrence</span>
                        <span className="text-xs font-medium text-white/70">~{item.competitor} kg</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <div className="border-l-2 border-gold/40 pl-6 py-2">
                <p className="text-white/80 text-base font-serif italic leading-relaxed">
                  «&nbsp;Nos concurrents n'ont jamais eu, à 3h du matin, à devoir replier un écran pour aller se coucher.&nbsp;»
                </p>
                <p className="text-gold/80 text-sm mt-2 font-medium">— Fondateur d'Hallucine</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
