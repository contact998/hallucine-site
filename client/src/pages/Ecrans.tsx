/*
 * Page dédiée : Nos Écrans de Cinéma Gonflables
 * Détails complets des deux gammes technologiques
 * Photos réelles uniquement
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Feather, Wind, Ruler, ChevronRight, Check, ArrowDown } from "lucide-react";

// Photos réelles
const HERO_ECRAN = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/qIDIIXPgHeWcNdTq.jpg";
const ECRAN_AERIEN = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/PGaRdZUncWXjznrw.JPG";
const ECRAN_RAPPROCHE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UjFqdXoLutZxgPuy.JPG";
const ECRAN_FOULE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/jPYZoxFIkhGeMpkL.jpg";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const airtightSizes = [
  { size: "2m", usage: "Privé / Petit événement", weight: "~8 kg" },
  { size: "3m", usage: "Jardin / Terrasse", weight: "~12 kg" },
  { size: "4m", usage: "Petit événement", weight: "~18 kg" },
  { size: "5m", usage: "Événement moyen", weight: "~25 kg" },
  { size: "6m", usage: "Festival / Corporate", weight: "~35 kg" },
  { size: "8m", usage: "Grand événement", weight: "~50 kg" },
];

const soufflerieSizes = [
  { size: "10m", usage: "Festival / Cinéma plein air", weight: "~80 kg" },
  { size: "12m", usage: "Grand événement", weight: "~100 kg" },
  { size: "15m", usage: "Événement majeur", weight: "~130 kg" },
  { size: "18m", usage: "Stade / Arena", weight: "~160 kg" },
  { size: "20m", usage: "Événement exceptionnel", weight: "~180 kg" },
  { size: "24m", usage: "Le plus grand", weight: "~200 kg" },
];

const scrollToContact = () => {
  window.location.href = "/#contact";
};

export default function Ecrans() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_ECRAN} alt="Écran gonflable Hallucine en projection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.03_260_/_0.92)] via-[oklch(0.12_0.03_260_/_0.75)] to-[oklch(0.10_0.03_260_/_0.4)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-transparent to-transparent" />
        </div>
        <div className="relative container pt-32 pb-16">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">Nos écrans</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 leading-tight max-w-3xl">
              Écrans de cinéma gonflables<br />
              <span className="text-gradient-gold">de 2m à 24m</span>
            </h1>
            <p className="text-white/70 mt-6 text-lg max-w-2xl leading-relaxed">
              Deux technologies, une même obsession : la légèreté. Nos écrans sont 3 fois plus légers que ceux de la concurrence, garantis 10 ans.
            </p>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ArrowDown className="w-6 h-6 text-white/40" />
        </motion.div>
      </section>

      {/* Gamme Airtight */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
              <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/20 rounded-sm mb-4">
                <span className="text-gold text-sm font-bold">Technologie Airtight</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Gamme Airtight<br />
                <span className="text-white/60 text-2xl md:text-3xl">2m à 8m — Étanche, sans soufflerie</span>
              </h2>
              <p className="text-white/60 mt-4 leading-relaxed">
                Inspirée directement du kitesurf, cette technologie utilise des chambres à air scellées. Une fois gonflé, l'écran est autonome : pas de soufflerie, pas de bruit, pas de câble électrique. Idéal pour les événements où le silence compte.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Chambre à air scellée — gonflage unique",
                  "Aucune soufflerie nécessaire — 100% silencieux",
                  "Ultra-léger — transportable par une seule personne",
                  "Montage en quelques minutes",
                  "Même technologie pour tentes et mobilier",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                    <span className="text-white/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={scrollToContact} className="mt-8 flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
                Demander un devis <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1}>
              <img src={ECRAN_FOULE} alt="Écran Airtight en projection devant un public" className="w-full rounded-sm border border-white/10" />
            </motion.div>
          </div>

          {/* Tailles Airtight */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={2} className="mt-16">
            <h3 className="text-xl font-bold text-white mb-6">Tailles disponibles — Gamme Airtight</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {airtightSizes.map((s, i) => (
                <div key={i} className="p-4 border border-white/10 rounded-sm bg-white/[0.02] hover:border-gold/30 transition-colors text-center">
                  <div className="text-2xl font-bold text-gold">{s.size}</div>
                  <div className="text-white/50 text-xs mt-1">{s.usage}</div>
                  <div className="text-white/30 text-xs mt-2 flex items-center justify-center gap-1">
                    <Feather className="w-3 h-3" /> {s.weight}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="container"><div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" /></div>

      {/* Gamme Soufflerie */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="order-2 lg:order-1">
              <img src={ECRAN_RAPPROCHE} alt="Écran géant Hallucine - structure gonflable" className="w-full rounded-sm border border-white/10" />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1} className="order-1 lg:order-2">
              <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-sm mb-4">
                <span className="text-white text-sm font-bold">Soufflerie permanente</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Gamme Pro<br />
                <span className="text-white/60 text-2xl md:text-3xl">10m à 24m — Tissu d'airbag automobile</span>
              </h2>
              <p className="text-white/60 mt-4 leading-relaxed">
                Née dans une voilerie bretonne à La Trinité-sur-Mer, cette gamme utilise un polyamide haute ténacité de DuPont de Nemours — le même tissu que les airbags automobiles. Résultat : un écran de 15m qui pèse 200 kg au lieu de 600 kg chez la concurrence.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Tissu polyamide haute ténacité — secret des airbags",
                  "3× plus léger que la concurrence",
                  "Garanti 10 ans",
                  "Rangement en sac à voile — pas de pliage",
                  "Montage par 2 personnes, sans engin de levage",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                    <span className="text-white/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={scrollToContact} className="mt-8 flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
                Demander un devis <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

          {/* Tailles Soufflerie */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={2} className="mt-16">
            <h3 className="text-xl font-bold text-white mb-6">Tailles disponibles — Gamme Pro (Soufflerie)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {soufflerieSizes.map((s, i) => (
                <div key={i} className="p-4 border border-white/10 rounded-sm bg-white/[0.02] hover:border-gold/30 transition-colors text-center">
                  <div className="text-2xl font-bold text-white">{s.size}</div>
                  <div className="text-white/50 text-xs mt-1">{s.usage}</div>
                  <div className="text-white/30 text-xs mt-2 flex items-center justify-center gap-1">
                    <Feather className="w-3 h-3" /> {s.weight}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparatif */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Quelle gamme choisir ?</h2>
            <p className="text-white/60 mt-4">Voici un comparatif rapide pour vous aider à choisir.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1} className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/50 font-medium">Critère</th>
                  <th className="text-center py-4 px-4 text-gold font-bold">Airtight (2-8m)</th>
                  <th className="text-center py-4 px-4 text-white font-bold">Soufflerie (10-24m)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["Technologie", "Chambre à air scellée", "Soufflerie permanente"],
                  ["Tailles", "2m à 8m", "10m à 24m"],
                  ["Soufflerie requise", "Non", "Oui (incluse)"],
                  ["Bruit", "Silencieux", "Léger bruit de soufflerie"],
                  ["Montage", "1 personne, 5 min", "2 personnes, 30 min"],
                  ["Tissu", "Polyamide Airtight", "Polyamide haute ténacité (airbag)"],
                  ["Garantie", "10 ans", "10 ans"],
                  ["Rangement", "Sac compact", "Sac à voile"],
                  ["Idéal pour", "Événements privés, petits festivals", "Grands festivals, stades, corporate"],
                ].map(([critere, airtight, soufflerie], i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-white/70 font-medium">{critere}</td>
                    <td className="py-3 px-4 text-center text-white/60">{airtight}</td>
                    <td className="py-3 px-4 text-center text-white/60">{soufflerie}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <div className="text-center mt-12">
            <button onClick={scrollToContact} className="px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
              Demander un devis personnalisé
            </button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 md:py-32">
        <div className="container">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Nos écrans en action</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { src: ECRAN_AERIEN, alt: "Vue aérienne d'un écran géant Hallucine" },
              { src: ECRAN_FOULE, alt: "Projection avec foule devant écran Hallucine" },
            ].map((img, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={i} className="overflow-hidden rounded-sm border border-white/10">
                <img src={img.src} alt={img.alt} className="w-full h-80 object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
