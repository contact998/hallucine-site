/*
 * Page dédiée Écrans - Gamme Étanche + Gamme Soufflerie
 * Photos CORRECTES par catégorie et par taille
 * Terminologie française : "étanche" (pas "Airtight")
 */
import { motion } from "framer-motion";
import { Shield, Wind, Feather, Ruler, ChevronRight, Check, ArrowLeft, ArrowDown } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Photos CORRECTES - Écrans étanches
const ETANCHE_3M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/XkmcCQJvGfnRZRxz.jpg";
const ETANCHE_4M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UsYUSDaqdvtdYUuR.jpg";
const ETANCHE_5M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CzprNCGHiOGRIkTg.jpg";
const ETANCHE_5M_ECLATE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HGkkpfyaxsgmapYw.jpg";
const ETANCHE_6M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/wjOpqTzVwXDYFRcz.jpg";
const ETANCHE_7M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ztusfncqjZbnObZq.jpg";
const ETANCHE_8M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/VEbmfwItAbfpcPkZ.jpg";

// Photos CORRECTES - Écrans soufflerie
const SOUFFLERIE_8M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/KFRWoeCersYiDqXf.jpg";
const SOUFFLERIE_10M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/wQxSrNHWpcNFqINL.jpg";
const SOUFFLERIE_12M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/AFizhJVCNHvXVtJS.jpg";
const SOUFFLERIE_13M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bWqLOjfHSsVoXNHz.jpg";
const SOUFFLERIE_15M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/xEbWQMioMZQLtuDK.jpg";
const SOUFFLERIE_17M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CAeHAHuCCqWzSkLI.jpg";
const SOUFFLERIE_24M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/KzXxmgVsjMoEdlML.jpg";
const SOUFFLERIE_24M_B = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/FdcsGRVCOGXGHcKi.jpg";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const etancheScreens = [
  { size: "3m", img: ETANCHE_3M, usage: "Jardin / Terrasse", weight: "~12 kg", desc: "Idéal pour les événements intimes" },
  { size: "4m", img: ETANCHE_4M, usage: "Petit événement", weight: "~18 kg", desc: "Soirées privées et petits festivals" },
  { size: "5m", img: ETANCHE_5M, usage: "Événement moyen", weight: "~25 kg", desc: "Le format polyvalent, du Ritz aux plages" },
  { size: "6m", img: ETANCHE_6M, usage: "Festival / Corporate", weight: "~35 kg", desc: "Grand format étanche, événements corporate" },
  { size: "7m", img: ETANCHE_7M, usage: "Grand événement", weight: "~40 kg", desc: "Format intermédiaire avec pieds stabilisateurs" },
  { size: "8m", img: ETANCHE_8M, usage: "Le plus grand étanche", weight: "~50 kg", desc: "Le plus grand de la gamme étanche" },
];

const soufflerieScreens = [
  { size: "8m", img: SOUFFLERIE_8M, usage: "Projection nocturne", weight: "~60 kg", desc: "Format compact avec soufflerie" },
  { size: "10m", img: SOUFFLERIE_10M, usage: "Drive-in / Plein air", weight: "~80 kg", desc: "Cinéma en plein air et drive-in" },
  { size: "12m", img: SOUFFLERIE_12M, usage: "Festival", weight: "~100 kg", desc: "Festivals et événements de taille moyenne" },
  { size: "13m", img: SOUFFLERIE_13M, usage: "Culturel / Arènes", weight: "~110 kg", desc: "Événements culturels, arènes, places publiques" },
  { size: "15m", img: SOUFFLERIE_15M, usage: "Événement majeur", weight: "~130 kg", desc: "Grand format pro, 3× plus léger que la concurrence" },
  { size: "17m", img: SOUFFLERIE_17M, usage: "Spectaculaire", weight: "~160 kg", desc: "Format spectaculaire pour grands événements" },
  { size: "24m", img: SOUFFLERIE_24M, usage: "Le plus grand", weight: "~200 kg", desc: "Le plus grand écran gonflable au monde" },
];

export default function Ecrans() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero avec photo soufflerie 24m */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={SOUFFLERIE_24M_B} alt="Écran gonflable Hallucine 24m en projection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.03_260_/_0.92)] via-[oklch(0.12_0.03_260_/_0.75)] to-[oklch(0.10_0.03_260_/_0.4)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-transparent to-transparent" />
        </div>
        <div className="relative container pt-32 pb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
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

      {/* Gamme Étanche */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
              <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/20 rounded-sm mb-4">
                <span className="text-gold text-sm font-bold">Technologie Étanche</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Gamme Étanche<br />
                <span className="text-white/60 text-2xl md:text-3xl">2m à 8m — Sans soufflerie</span>
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
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
                Demander un devis <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1}>
              <img src={ETANCHE_5M_ECLATE} alt="Vue éclatée d'un écran étanche Hallucine montrant la chambre à air" className="w-full rounded-sm border border-white/10" />
            </motion.div>
          </div>

          {/* Grille photos écrans étanches */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {etancheScreens.map((screen, i) => (
              <motion.div
                key={screen.size}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
                custom={i + 1}
                className="group overflow-hidden rounded-sm border border-white/10 bg-white/[0.03] hover:border-gold/30 transition-colors duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={screen.img}
                    alt={`Écran étanche Hallucine ${screen.size}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-gold text-navy-deep text-xs font-bold rounded-sm">
                    {screen.size}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1">Écran étanche {screen.size}</h3>
                  <p className="text-white/50 text-sm mb-2">{screen.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1"><Feather className="w-3 h-3" /> {screen.weight}</span>
                    <span>{screen.usage}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container"><div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" /></div>

      {/* Gamme Soufflerie */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="order-2 lg:order-1">
              <img src={SOUFFLERIE_15M} alt="Écran soufflerie Hallucine 15m en projection nocturne" className="w-full rounded-sm border border-white/10" />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1} className="order-1 lg:order-2">
              <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-sm mb-4">
                <span className="text-white text-sm font-bold">Soufflerie permanente</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Gamme Pro<br />
                <span className="text-white/60 text-2xl md:text-3xl">5m à 24m — Tissu d'airbag automobile</span>
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
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
                Demander un devis <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Grille photos écrans soufflerie */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soufflerieScreens.map((screen, i) => (
              <motion.div
                key={screen.size}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
                custom={i + 1}
                className="group overflow-hidden rounded-sm border border-white/10 bg-white/[0.03] hover:border-white/20 transition-colors duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={screen.img}
                    alt={`Écran soufflerie Hallucine ${screen.size}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white text-navy-deep text-xs font-bold rounded-sm">
                    {screen.size}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1">Écran soufflerie {screen.size}</h3>
                  <p className="text-white/50 text-sm mb-2">{screen.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1"><Feather className="w-3 h-3" /> {screen.weight}</span>
                    <span>{screen.usage}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
                  <th className="text-center py-4 px-4 text-gold font-bold">Étanche (2-8m)</th>
                  <th className="text-center py-4 px-4 text-white font-bold">Soufflerie (5-24m)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["Technologie", "Chambre à air scellée", "Soufflerie permanente"],
                  ["Tailles", "2m à 8m", "5m à 24m"],
                  ["Soufflerie requise", "Non", "Oui (incluse)"],
                  ["Bruit", "Silencieux", "Léger bruit de soufflerie"],
                  ["Montage", "1 personne, 5 min", "2 personnes, 30 min"],
                  ["Tissu", "Polyamide étanche", "Polyamide haute ténacité (airbag)"],
                  ["Garantie", "10 ans", "10 ans"],
                  ["Rangement", "Sac compact", "Sac à voile"],
                  ["Idéal pour", "Événements privés, petits festivals", "Grands festivals, stades, corporate"],
                ].map(([critere, etanche, soufflerie], i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-white/70 font-medium">{critere}</td>
                    <td className="py-3 px-4 text-center text-white/60">{etanche}</td>
                    <td className="py-3 px-4 text-center text-white/60">{soufflerie}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

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
