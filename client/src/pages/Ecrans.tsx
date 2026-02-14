/*
 * Page Écrans — Contenu texte complet et enrichi
 * Gamme Étanche (2-8m) + Gamme Soufflerie (5-24m)
 * Fiches techniques, guide d'achat, FAQ, accessoires
 * Photos = placeholders que le client remplacera
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Wind, Feather, Ruler, ChevronRight, Check, ArrowLeft, ArrowDown, ChevronDown, HelpCircle, Package, Wrench } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Photos existantes — le client les remplacera
const ETANCHE_3M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/XkmcCQJvGfnRZRxz.jpg";
const ETANCHE_4M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UsYUSDaqdvtdYUuR.jpg";
const ETANCHE_5M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CzprNCGHiOGRIkTg.jpg";
const ETANCHE_5M_ECLATE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HGkkpfyaxsgmapYw.jpg";
const ETANCHE_6M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/wjOpqTzVwXDYFRcz.jpg";
const ETANCHE_7M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ztusfncqjZbnObZq.jpg";
const ETANCHE_8M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/VEbmfwItAbfpcPkZ.jpg";

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
  { size: "3m", img: ETANCHE_3M, usage: "Jardin, terrasse, camping", weight: "~12 kg", surface: "2,4 × 1,35 m (16:9)", packed: "80 × 40 × 30 cm", persons: "50–100", setup: "1 pers., 5 min", desc: "Le format intime. Idéal pour les soirées privées, les campings et les petites terrasses. Se transporte dans un sac à dos." },
  { size: "4m", img: ETANCHE_4M, usage: "Soirée privée, petit festival", weight: "~18 kg", surface: "3,2 × 1,8 m (16:9)", packed: "90 × 45 × 35 cm", persons: "100–200", setup: "1 pers., 5 min", desc: "Le format polyvalent pour les soirées entre amis, les petits festivals de quartier et les événements associatifs." },
  { size: "5m", img: ETANCHE_5M, usage: "Événement moyen, hôtellerie", weight: "~25 kg", surface: "4,0 × 2,25 m (16:9)", packed: "100 × 50 × 35 cm", persons: "200–400", setup: "1 pers., 5 min", desc: "Notre best-seller. Du Ritz Carlton aux plages de Méditerranée, c'est le format qui s'adapte à tout." },
  { size: "6m", img: ETANCHE_6M, usage: "Festival, corporate", weight: "~35 kg", surface: "4,8 × 2,7 m (16:9)", packed: "110 × 55 × 40 cm", persons: "300–600", setup: "1–2 pers., 8 min", desc: "Le grand format étanche. Parfait pour les événements corporate, les festivals de taille moyenne et les retransmissions sportives." },
  { size: "7m", img: ETANCHE_7M, usage: "Grand événement", weight: "~40 kg", surface: "5,6 × 3,15 m (16:9)", packed: "120 × 55 × 45 cm", persons: "400–800", setup: "2 pers., 10 min", desc: "Format intermédiaire avec pieds stabilisateurs intégrés. Pour les événements qui demandent de l'impact sans la complexité d'une soufflerie." },
  { size: "8m", img: ETANCHE_8M, usage: "Le plus grand étanche", weight: "~50 kg", surface: "6,4 × 3,6 m (16:9)", packed: "130 × 60 × 45 cm", persons: "500–1000", setup: "2 pers., 10 min", desc: "Le plus grand écran étanche au monde. Même technologie, même simplicité, mais un impact visuel considérable." },
];

const soufflerieScreens = [
  { size: "8m", img: SOUFFLERIE_8M, usage: "Projection nocturne", weight: "~60 kg", surface: "6,4 × 3,6 m (16:9)", persons: "500–1000", setup: "2 pers., 20 min", desc: "Le format d'entrée de gamme soufflerie. Pour ceux qui veulent la robustesse du tissu d'airbag sur un format compact." },
  { size: "10m", img: SOUFFLERIE_10M, usage: "Drive-in, plein air", weight: "~80 kg", surface: "8,0 × 4,5 m (16:9)", persons: "800–1500", setup: "2 pers., 25 min", desc: "Le format drive-in par excellence. Visible à plus de 100 mètres, il transforme n'importe quel parking en cinéma." },
  { size: "12m", img: SOUFFLERIE_12M, usage: "Festival", weight: "~100 kg", surface: "9,6 × 5,4 m (16:9)", persons: "1000–2000", setup: "2 pers., 30 min", desc: "Le format festival. Né dans une voilerie bretonne, il se range dans un sac à voile sans pliage. Garanti 10 ans." },
  { size: "13m", img: SOUFFLERIE_13M, usage: "Culturel, arènes", weight: "~110 kg", surface: "10,4 × 5,85 m (16:9)", persons: "1500–3000", setup: "2–3 pers., 30 min", desc: "Le format culturel. Arènes, places publiques, parvis de cathédrales — il s'impose dans les lieux les plus prestigieux." },
  { size: "15m", img: SOUFFLERIE_15M, usage: "Événement majeur", weight: "~130 kg", surface: "12,0 × 6,75 m (16:9)", persons: "2000–5000", setup: "3 pers., 35 min", desc: "Le grand format professionnel. 130 kg au lieu de 400 kg chez la concurrence. Pas besoin d'engin de levage." },
  { size: "17m", img: SOUFFLERIE_17M, usage: "Spectaculaire", weight: "~160 kg", surface: "13,6 × 7,65 m (16:9)", persons: "3000–8000", setup: "3–4 pers., 40 min", desc: "Le format spectaculaire. Pour les événements qui veulent marquer les esprits. Stades, concerts, événements nationaux." },
  { size: "24m", img: SOUFFLERIE_24M, usage: "Le plus grand au monde", weight: "~200 kg", surface: "19,2 × 10,8 m (16:9)", persons: "5000+", setup: "4–5 pers., 45 min", desc: "Le plus grand écran gonflable au monde. 200 kg au lieu de 600 kg chez la concurrence. Une prouesse technique unique." },
];

const faqItems = [
  {
    q: "Quelle est la différence entre un écran étanche et un écran soufflerie ?",
    a: "L'écran étanche utilise une chambre à air scellée (comme un boudin de kitesurf) : vous le gonflez une fois, il reste en forme toute la soirée sans électricité ni bruit. L'écran soufflerie utilise une soufflerie permanente qui maintient l'air en continu — nécessaire pour les très grands formats (au-delà de 8m) où la pression d'air doit être constante. La soufflerie est silencieuse et incluse avec l'écran."
  },
  {
    q: "Combien de temps faut-il pour monter un écran ?",
    a: "Un écran étanche se monte en 5 à 10 minutes par une seule personne. Il suffit de le dérouler, le gonfler avec la pompe fournie, et le haubanage. Un écran soufflerie se monte en 20 à 45 minutes selon la taille, par 2 à 5 personnes. Aucun outil spécial n'est nécessaire, et aucun engin de levage — même pour le 24 mètres."
  },
  {
    q: "Pourquoi vos écrans sont-ils 3× plus légers que la concurrence ?",
    a: "La concurrence utilise principalement de la bâche PVC (type bâche de camion), un matériau lourd et rigide. Nous utilisons deux tissus techniques : un polyamide étanche inspiré du kitesurf pour la gamme étanche, et un polyamide haute ténacité de DuPont de Nemours (le tissu des airbags automobiles) pour la gamme soufflerie. Ces tissus sont à la fois plus légers, plus résistants et plus durables."
  },
  {
    q: "Quelle taille d'écran choisir pour mon événement ?",
    a: "La règle générale : la distance maximale de visionnage confortable est d'environ 6 à 8 fois la largeur de l'écran. Pour 100 personnes, un écran de 3 à 5m suffit. Pour 500 personnes, visez 8 à 12m. Pour 1000+ personnes, il faut 15m ou plus. Contactez-nous avec les détails de votre événement, nous vous conseillerons la taille idéale."
  },
  {
    q: "Les écrans résistent-ils au vent ?",
    a: "Oui. Les écrans étanches résistent à des vents de 40 à 50 km/h grâce au haubanage et aux pieds stabilisateurs. Les écrans soufflerie résistent à des vents de 50 à 60 km/h. Au-delà, nous recommandons de dégonfler l'écran par précaution — ce qui prend moins de 5 minutes."
  },
  {
    q: "Peut-on projeter en rétroprojection ?",
    a: "Oui. Tous nos écrans sont conçus pour la projection frontale et la rétroprojection. La toile de projection est amovible et réversible. En rétroprojection, le projecteur est placé derrière l'écran, ce qui libère l'espace devant le public et évite les ombres."
  },
  {
    q: "Quelle est la garantie ?",
    a: "Tous nos écrans sont garantis 10 ans sur la structure gonflable. La toile de projection est garantie 5 ans. Cette garantie couvre les défauts de fabrication, les coutures et l'étanchéité. Elle ne couvre pas les dommages causés par une mauvaise utilisation ou des conditions météorologiques extrêmes."
  },
  {
    q: "Livrez-vous à l'international ?",
    a: "Oui. Nous livrons dans le monde entier. Nos écrans sont fabriqués dans notre usine partenaire à Dongguan (Chine) et expédiés directement. Les délais de livraison sont de 2 à 4 semaines selon la destination. Pour l'Europe, comptez 2 semaines."
  },
];

export default function Ecrans() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={SOUFFLERIE_24M_B} alt="Écran gonflable Hallucine 24m en projection nocturne" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.03_260_/_0.92)] via-[oklch(0.12_0.03_260_/_0.75)] to-[oklch(0.10_0.03_260_/_0.4)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-transparent to-transparent" />
        </div>
        <div className="relative container pt-32 pb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">Nos écrans de cinéma gonflables</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 leading-tight max-w-3xl">
              De 2 mètres à 24 mètres.<br />
              <span className="text-gradient-gold">3× plus légers.</span>
            </h1>
            <p className="text-white/70 mt-6 text-lg max-w-2xl leading-relaxed">
              Deux gammes technologiques pour tous les usages : la gamme étanche (sans soufflerie, de 2 à 8m) et la gamme soufflerie (tissu d'airbag, de 5 à 24m). Tous nos écrans sont garantis 10 ans et fabriqués avec des matériaux techniques de pointe.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <a href="#etanche" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold text-sm">
                <Shield className="w-4 h-4" /> Gamme Étanche (2–8m)
              </a>
              <a href="#soufflerie" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white/90 font-medium rounded-sm hover:border-gold/40 hover:text-gold transition-all text-sm">
                <Wind className="w-4 h-4" /> Gamme Soufflerie (5–24m)
              </a>
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ArrowDown className="w-6 h-6 text-white/40" />
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* GAMME ÉTANCHE */}
      {/* ============================================ */}
      <section id="etanche" className="py-24 md:py-32">
        <div className="container">
          {/* Intro étanche */}
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
                Inspirée directement du kitesurf, cette technologie utilise des chambres à air scellées en polyamide étanche. Une fois gonflé à la pompe manuelle ou électrique, l'écran est totalement autonome : pas de soufflerie, pas de bruit, pas de câble électrique. L'air reste emprisonné dans les boudins pendant toute la durée de l'événement.
              </p>
              <p className="text-white/60 mt-3 leading-relaxed">
                C'est la solution idéale pour les événements où le silence est important : cinéma en plein air, mariages, soirées privées, hôtellerie de luxe. Une seule personne peut transporter, monter et démonter l'écran en quelques minutes.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Chambre à air scellée — un seul gonflage pour toute la soirée",
                  "Aucune soufflerie — 100% silencieux, aucun câble électrique",
                  "Ultra-léger — de 12 à 50 kg selon la taille",
                  "Montage par 1 personne en 5 à 10 minutes",
                  "Tissu polyamide étanche — technologie issue du kitesurf",
                  "Projection frontale et rétroprojection",
                  "Toile de projection amovible et lavable",
                  "Garantie 10 ans sur la structure",
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
              <img src={ETANCHE_5M_ECLATE} alt="Vue éclatée d'un écran étanche Hallucine montrant la chambre à air scellée" className="w-full rounded-sm border border-white/10" />
              <p className="text-white/40 text-xs mt-3 text-center italic">Vue de la structure étanche — chambre à air scellée en polyamide</p>
            </motion.div>
          </div>

          {/* Fiches produits étanches */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="mb-6">
            <h3 className="text-2xl font-bold text-white">Tous les modèles étanches</h3>
            <p className="text-white/50 mt-2 text-sm">Cliquez sur un modèle pour voir les détails techniques. Le client remplacera les photos.</p>
          </motion.div>

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
                    alt={`Écran étanche Hallucine ${screen.size} — ${screen.usage}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-gold text-navy-deep text-xs font-bold rounded-sm">
                    {screen.size}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2">Écran étanche {screen.size}</h3>
                  <p className="text-white/50 text-sm mb-4">{screen.desc}</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-white/40 border-b border-white/5 pb-1">
                      <span>Surface de projection</span>
                      <span className="text-white/60 font-medium">{screen.surface}</span>
                    </div>
                    <div className="flex justify-between text-white/40 border-b border-white/5 pb-1">
                      <span>Poids total</span>
                      <span className="text-white/60 font-medium">{screen.weight}</span>
                    </div>
                    <div className="flex justify-between text-white/40 border-b border-white/5 pb-1">
                      <span>Dimensions pliées</span>
                      <span className="text-white/60 font-medium">{screen.packed}</span>
                    </div>
                    <div className="flex justify-between text-white/40 border-b border-white/5 pb-1">
                      <span>Public estimé</span>
                      <span className="text-white/60 font-medium">{screen.persons} pers.</span>
                    </div>
                    <div className="flex justify-between text-white/40">
                      <span>Montage</span>
                      <span className="text-white/60 font-medium">{screen.setup}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Accessoires inclus étanche */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="mt-16 p-6 md:p-8 border border-white/10 rounded-sm bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-gold" />
              <h3 className="text-xl font-bold text-white">Accessoires inclus avec chaque écran étanche</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Sac de transport", desc: "Sac renforcé avec roulettes pour les modèles 6m+" },
                { name: "Pompe électrique", desc: "Pompe 12V/220V avec adaptateur allume-cigare" },
                { name: "Kit de haubanage", desc: "Sangles, piquets et tendeurs en acier inoxydable" },
                { name: "Toile de projection", desc: "Toile amovible, lavable, recto-verso (front/rétro)" },
              ].map((acc, i) => (
                <div key={i} className="p-4 border border-white/5 rounded-sm">
                  <div className="text-white font-semibold text-sm mb-1">{acc.name}</div>
                  <div className="text-white/40 text-xs">{acc.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="container"><div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" /></div>

      {/* ============================================ */}
      {/* GAMME SOUFFLERIE */}
      {/* ============================================ */}
      <section id="soufflerie" className="py-24 md:py-32">
        <div className="container">
          {/* Intro soufflerie */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="order-2 lg:order-1">
              <img src={SOUFFLERIE_15M} alt="Écran soufflerie Hallucine 15m en projection nocturne" className="w-full rounded-sm border border-white/10" />
              <p className="text-white/40 text-xs mt-3 text-center italic">Écran soufflerie 15m — tissu polyamide haute ténacité (airbag automobile)</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1} className="order-1 lg:order-2">
              <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-sm mb-4">
                <span className="text-white text-sm font-bold">Technologie Soufflerie</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Gamme Soufflerie<br />
                <span className="text-white/60 text-2xl md:text-3xl">5m à 24m — Tissu d'airbag automobile</span>
              </h2>
              <p className="text-white/60 mt-4 leading-relaxed">
                Née dans une voilerie bretonne à La Trinité-sur-Mer, cette gamme utilise un polyamide haute ténacité de DuPont de Nemours — le même tissu que les airbags automobiles. Ce tissu, découvert après des mois d'enquête à Lyon (ancienne capitale du textile), est à la fois ultra-léger et quasi indestructible.
              </p>
              <p className="text-white/60 mt-3 leading-relaxed">
                Résultat concret : un écran de 15m Hallucine pèse 130 kg. Le même écran chez la concurrence (en bâche PVC) pèse 400 kg et nécessite un engin de levage. Le nôtre se monte à la main par 3 personnes. Après la projection, l'écran tombe dans un grand sac à voile — pas besoin de le replier.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Tissu polyamide haute ténacité DuPont de Nemours (airbag)",
                  "3× plus léger que la concurrence en bâche PVC",
                  "Aucun engin de levage nécessaire — même pour le 24m",
                  "Rangement en sac à voile — pas de pliage fastidieux",
                  "Soufflerie silencieuse incluse avec chaque écran",
                  "Projection frontale et rétroprojection",
                  "Résistance au vent jusqu'à 60 km/h",
                  "Garantie 10 ans sur la structure",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white/50 mt-0.5 shrink-0" />
                    <span className="text-white/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
                Demander un devis <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Fiches produits soufflerie */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="mb-6">
            <h3 className="text-2xl font-bold text-white">Tous les modèles soufflerie</h3>
            <p className="text-white/50 mt-2 text-sm">Du 8m compact au 24m spectaculaire. Le client remplacera les photos.</p>
          </motion.div>

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
                    alt={`Écran soufflerie Hallucine ${screen.size} — ${screen.usage}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white text-navy-deep text-xs font-bold rounded-sm">
                    {screen.size}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2">Écran soufflerie {screen.size}</h3>
                  <p className="text-white/50 text-sm mb-4">{screen.desc}</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-white/40 border-b border-white/5 pb-1">
                      <span>Surface de projection</span>
                      <span className="text-white/60 font-medium">{screen.surface}</span>
                    </div>
                    <div className="flex justify-between text-white/40 border-b border-white/5 pb-1">
                      <span>Poids total</span>
                      <span className="text-white/60 font-medium">{screen.weight}</span>
                    </div>
                    <div className="flex justify-between text-white/40 border-b border-white/5 pb-1">
                      <span>Public estimé</span>
                      <span className="text-white/60 font-medium">{screen.persons} pers.</span>
                    </div>
                    <div className="flex justify-between text-white/40">
                      <span>Montage</span>
                      <span className="text-white/60 font-medium">{screen.setup}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Accessoires inclus soufflerie */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="mt-16 p-6 md:p-8 border border-white/10 rounded-sm bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-gold" />
              <h3 className="text-xl font-bold text-white">Accessoires inclus avec chaque écran soufflerie</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Sac à voile", desc: "Grand sac de rangement — l'écran tombe dedans, pas de pliage" },
                { name: "Soufflerie", desc: "Soufflerie électrique silencieuse, adaptée à la taille de l'écran" },
                { name: "Kit de haubanage", desc: "Sangles, piquets et tendeurs professionnels" },
                { name: "Toile de projection", desc: "Toile amovible recto-verso (front/rétro), lavable" },
              ].map((acc, i) => (
                <div key={i} className="p-4 border border-white/5 rounded-sm">
                  <div className="text-white font-semibold text-sm mb-1">{acc.name}</div>
                  <div className="text-white/40 text-xs">{acc.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* COMPARATIF ÉTANCHE vs SOUFFLERIE */}
      {/* ============================================ */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="text-center max-w-3xl mx-auto mb-16">
            <Wrench className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Comment choisir ?</h2>
            <p className="text-white/60 mt-4">Étanche ou soufflerie ? Voici un comparatif pour vous aider à choisir la technologie adaptée à votre usage.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1} className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/50 font-medium">Critère</th>
                  <th className="text-center py-4 px-4 text-gold font-bold">Gamme Étanche</th>
                  <th className="text-center py-4 px-4 text-white font-bold">Gamme Soufflerie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["Tailles disponibles", "2m, 3m, 4m, 5m, 6m, 7m, 8m", "8m, 10m, 12m, 13m, 15m, 17m, 24m"],
                  ["Technologie", "Chambre à air scellée (kitesurf)", "Soufflerie permanente (airbag)"],
                  ["Tissu", "Polyamide étanche", "Polyamide haute ténacité DuPont"],
                  ["Soufflerie nécessaire", "Non — gonflage unique", "Oui — incluse avec l'écran"],
                  ["Bruit", "Silencieux (0 dB)", "Léger bruit de soufflerie (~45 dB)"],
                  ["Électricité requise", "Non (pompe manuelle possible)", "Oui (pour la soufflerie)"],
                  ["Montage", "1 personne, 5–10 min", "2–5 personnes, 20–45 min"],
                  ["Poids", "12 à 50 kg", "60 à 200 kg"],
                  ["Rangement", "Sac de transport compact", "Sac à voile (pas de pliage)"],
                  ["Résistance au vent", "40–50 km/h", "50–60 km/h"],
                  ["Garantie structure", "10 ans", "10 ans"],
                  ["Projection", "Frontale + rétro", "Frontale + rétro"],
                  ["Idéal pour", "Privé, hôtellerie, petits festivals", "Grands festivals, stades, corporate"],
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

          {/* Conseil rapide */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={2} className="max-w-3xl mx-auto mt-12 p-6 border border-gold/20 rounded-sm bg-gold/5">
            <h3 className="text-lg font-bold text-gold mb-3">Notre conseil</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              <strong className="text-white/80">Jusqu'à 8m</strong>, la gamme étanche est presque toujours le meilleur choix : plus simple, plus silencieuse, plus légère, et sans besoin d'électricité. <strong className="text-white/80">Au-delà de 8m</strong>, la gamme soufflerie s'impose : le tissu d'airbag et la soufflerie permanente garantissent une tenue parfaite même par grand vent. <strong className="text-white/80">Pour le format 8m</strong>, les deux technologies sont disponibles — contactez-nous pour un conseil personnalisé.
            </p>
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
              Demander un devis personnalisé <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* COMPARATIF POIDS vs CONCURRENCE */}
      {/* ============================================ */}
      <section className="py-24 md:py-32">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="text-center mb-16">
            <Feather className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">3× plus léger : les chiffres</h2>
            <p className="text-white/60 mt-4">Comparatif de poids entre nos écrans soufflerie et les écrans concurrents en bâche PVC.</p>
          </motion.div>

          <div className="space-y-6">
            {[
              { size: "10m", hallucine: 80, competitor: 250 },
              { size: "12m", hallucine: 100, competitor: 350 },
              { size: "15m", hallucine: 130, competitor: 400 },
              { size: "20m", hallucine: 170, competitor: 550 },
              { size: "24m", hallucine: 200, competitor: 600 },
            ].map((item, i) => (
              <motion.div
                key={item.size}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">Écran {item.size}</span>
                  <span className="text-gold font-bold text-sm">{(item.competitor / item.hallucine).toFixed(1)}× plus léger</span>
                </div>
                <div className="relative h-8 bg-white/[0.03] border border-white/[0.06] mb-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(item.hallucine / item.competitor * 100)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/80 to-gold/40"
                  />
                  <div className="relative h-full flex items-center px-3 justify-between">
                    <span className="text-[11px] font-semibold text-navy-deep">Hallucine</span>
                    <span className="text-[11px] font-bold text-navy-deep">{item.hallucine} kg</span>
                  </div>
                </div>
                <div className="relative h-8 bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-white/[0.08]"
                  />
                  <div className="relative h-full flex items-center px-3 justify-between">
                    <span className="text-[11px] font-medium text-white/40">Concurrence (bâche PVC)</span>
                    <span className="text-[11px] font-medium text-white/40">~{item.competitor} kg</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 border-l-2 border-gold/40 pl-6 py-2">
            <p className="text-white/60 text-sm font-serif italic leading-relaxed">
              «&nbsp;Nos concurrents n'ont jamais eu, à 3h du matin, à devoir replier un écran pour aller se coucher. Nous, si. C'est pour cela que tout ce que nous fabriquons est plus léger, plus rapide, plus simple.&nbsp;»
            </p>
            <p className="text-gold/50 text-xs mt-2 font-medium">— Fondateur d'Hallucine</p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FAQ */}
      {/* ============================================ */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="text-center mb-16">
            <HelpCircle className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Questions fréquentes</h2>
            <p className="text-white/60 mt-4">Tout ce que vous devez savoir sur nos écrans de cinéma gonflables.</p>
          </motion.div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i}
                className="border border-white/10 rounded-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white font-medium text-sm pr-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gold shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-white/50 text-sm mb-4">Vous avez d'autres questions ?</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
              Contactez-nous <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
