/*
 * Design: "Nuit Étoilée" – Section Technologie
 * Photos réelles : écran étanche vue éclatée + écran soufflerie 12m
 * Comparatif poids Hallucine vs concurrence
 * Histoire du tissu d'airbag automobile
 */
import { motion } from "framer-motion";
import { Scale, Zap, ShieldCheck, Award } from "lucide-react";

// Photo réelle : vue éclatée d'un écran étanche montrant la structure technique
const ECRAN_ECLATE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HGkkpfyaxsgmapYw.jpg";
// Photo réelle : écran soufflerie 12m montrant le tissu polyamide
const ECRAN_SOUFFLERIE_12 = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/AFizhJVCNHvXVtJS.jpg";

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

        {/* Two technologies side by side */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* Technologie Étanche */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={1}
            className="relative"
          >
            <div className="overflow-hidden rounded-sm border border-white/10">
              <img
                src={ECRAN_ECLATE}
                alt="Vue éclatée d'un écran étanche Hallucine montrant la chambre à air et la structure"
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-white mb-2">Technologie Étanche</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Inspirée du kitesurf. Une chambre à air scellée, comme un boudin de kitesurf, qui se gonfle une seule fois. Pas de soufflerie, pas de bruit, pas de dépendance électrique. L'écran est autonome.
              </p>
            </div>
          </motion.div>

          {/* Technologie Soufflerie */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={2}
            className="relative"
          >
            <div className="overflow-hidden rounded-sm border border-white/10">
              <img
                src={ECRAN_SOUFFLERIE_12}
                alt="Écran soufflerie 12m Hallucine en tissu polyamide haute ténacité"
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-white mb-2">Technologie Soufflerie</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Pour les grands formats (5-24m), un tissu de polyamide haute ténacité — le même que celui des airbags automobiles. Soufflerie permanente, et l'écran tombe dans un grand sac à voile après la projection. Pas de pliage.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Weight comparison */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={3}
          >
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

            <p className="text-white/40 text-sm mt-6 italic">
              « Nos concurrents n'ont jamais eu, à 3h du matin, à devoir replier un écran pour aller se coucher. »
            </p>
          </motion.div>

          {/* Feature list */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={4}
          >
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Scale, title: "Ultra-léger", desc: "Polyamide haute ténacité DuPont de Nemours — 3× plus léger que la bâche camion" },
                { icon: Zap, title: "Tissu d'airbag", desc: "Le même tissu que les airbags automobiles, trouvé après une enquête à Lyon" },
                { icon: ShieldCheck, title: "Garanti 10 ans", desc: "Durabilité éprouvée sur le terrain, de la Bretagne à la Chine" },
                { icon: Award, title: "Savoir-faire voilier", desc: "Né dans une voilerie bretonne à La Trinité-sur-Mer avec Jean-Christophe" },
              ].map((feat, i) => (
                <div key={i} className="flex gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-sm">
                  <feat.icon className="w-6 h-6 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-semibold mb-1">{feat.title}</div>
                    <div className="text-white/40 text-xs leading-relaxed">{feat.desc}</div>
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
