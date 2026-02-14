/*
 * Design: "Nuit Étoilée" – Section Technologie
 * UNIQUEMENT des photos réelles du client
 * Comparatif poids Hallucine vs concurrence
 * Histoire du tissu d'airbag automobile
 */
import { motion } from "framer-motion";
import { Scale, Zap, ShieldCheck, Award } from "lucide-react";

// Photo réelle : vue rapprochée de l'écran gonflable montrant la structure et le tissu
const ECRAN_STRUCTURE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UjFqdXoLutZxgPuy.JPG";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15 },
  }),
};

export default function TechnologySection() {
  return (
    <section id="technologie" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.12_0.04_260_/_0.5)] to-transparent" />

      <div className="container relative">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          custom={0}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Notre technologie</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 leading-tight">
            Le secret des airbags automobiles,<br />
            <span className="text-gradient-gold">au service du cinéma</span>
          </h2>
          <p className="text-white/60 mt-6 text-lg leading-relaxed">
            Quand les constructeurs automobiles nous ont dit que leur tissu était "secret défense", nous ne nous sommes pas découragés. Nous avons trouvé la réponse à Lyon : un polyamide haute ténacité de DuPont de Nemours.
          </p>
        </motion.div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image réelle */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={1}
            className="relative"
          >
            <div className="overflow-hidden rounded-sm">
              <img
                src={ECRAN_STRUCTURE}
                alt="Structure gonflable et tissu technique d'un écran Hallucine - vue rapprochée"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 md:bottom-6 md:right-6 bg-gold text-navy-deep p-4 md:p-6 rounded-sm shadow-xl">
              <div className="text-3xl md:text-4xl font-bold">3×</div>
              <div className="text-xs md:text-sm font-medium">plus léger</div>
            </div>
          </motion.div>

          {/* Comparison & features */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={2}
          >
            {/* Weight comparison */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-white mb-6">Comparatif de poids — Écran 15m</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Concurrence (bâche camion)</span>
                    <span className="text-white font-semibold">600 kg</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                      className="h-full bg-white/30 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gold font-medium">Hallucine (polyamide)</span>
                    <span className="text-gold font-bold">200 kg</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "33%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature list */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Scale, title: "Ultra-léger", desc: "Polyamide haute ténacité DuPont de Nemours" },
                { icon: Zap, title: "Résistant", desc: "Le même tissu que les airbags automobiles" },
                { icon: ShieldCheck, title: "Garanti 10 ans", desc: "Durabilité éprouvée sur le terrain" },
                { icon: Award, title: "Savoir-faire", desc: "Né dans une voilerie bretonne" },
              ].map((feat, i) => (
                <div key={i} className="flex gap-3">
                  <feat.icon className="w-5 h-5 text-gold mt-1 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-semibold">{feat.title}</div>
                    <div className="text-white/40 text-xs mt-0.5 leading-relaxed">{feat.desc}</div>
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
