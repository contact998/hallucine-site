/*
 * Section Technologie — Design premium
 * Comparatif de poids multi-tailles avec barres animées
 * Histoire du tissu d'airbag + technologie kitesurf
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Feather, Shield, Zap, Award } from "lucide-react";

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

        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
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
        </div>
      </div>
    </section>
  );
}
