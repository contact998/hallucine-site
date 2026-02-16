/*
 * Page Mobilier Gonflable — Contenu texte complet et enrichi
 * Détails produits, dimensions, personnalisation, accessoires transport, FAQ
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, ChevronRight, ChevronDown, Feather, Clock, Shield, Palette, ArrowLeft, Package, HelpCircle, Sofa, Wine, Truck, Ruler } from "lucide-react";
import { Link } from "wouter";
import BokehEffect from "@/components/BokehEffect";

const MOBILIER_SUPPORT = "https://www.hallucinecran.com/Tentes/meubles/fauteuils%20tabouret.jpg";
const MOBILIER_FAUTEUIL = "https://www.hallucinecran.com/Tentes/meubles/fauteuil.jpg";
const MOBILIER_CANAPE = "https://www.hallucinecran.com/Tentes/meubles/canape%20fauteuil%20noir%20rouge.jpg";
const MOBILIER_BAR = "https://www.hallucinecran.com/Tentes/meubles/Bar.jpg";
const MOBILIER_MANGE_DEBOUT = "https://www.hallucinecran.com/Tentes/meubles/mange%20debout.jpg";
const MOBILIER_CANAPE_BLEU = "https://www.hallucinecran.com/Tentes/meubles/canape%20bleu.jpg";
const ACCESSOIRE_CHARIOT = "https://www.hallucinecran.com/Tentes/meubles/fauteuils%20tabouret.jpg";
const ACCESSOIRE_FLYCASE = "https://www.hallucinecran.com/Tentes/meubles/canape%20fauteuil%20noir%20rouge.jpg";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const mobilierProducts = [
  {
    title: "Canapé gonflable",
    img: MOBILIER_CANAPE,
    desc: "Le canapé gonflable Hallucine accueille confortablement 2 à 3 personnes. Sa structure en chambre à air scellée offre un maintien ferme et un confort surprenant. Idéal pour les espaces lounge, les zones VIP et les espaces de détente lors de festivals ou d'événements corporate.",
    specs: [
      { label: "Dimensions", value: "180 × 80 × 70 cm (L×P×H)" },
      { label: "Poids", value: "~5 kg" },
      { label: "Capacité", value: "2–3 personnes, 250 kg max" },
      { label: "Gonflage", value: "Pompe manuelle, 2 min" },
      { label: "Matériau", value: "Polyamide étanche, coutures thermo-soudées" },
    ],
  },
  {
    title: "Fauteuil gonflable",
    img: MOBILIER_FAUTEUIL,
    desc: "Le fauteuil individuel, compact et léger. Parfait pour créer des espaces de conversation ou des zones de repos. Son dossier incliné et ses accoudoirs intégrés offrent un confort optimal. Se range dans un sac de la taille d'un oreiller.",
    specs: [
      { label: "Dimensions", value: "90 × 80 × 70 cm (L×P×H)" },
      { label: "Poids", value: "~3 kg" },
      { label: "Capacité", value: "1 personne, 120 kg max" },
      { label: "Gonflage", value: "Pompe manuelle, 1 min" },
      { label: "Matériau", value: "Polyamide étanche, coutures thermo-soudées" },
    ],
  },
  {
    title: "Bar / Comptoir gonflable",
    img: MOBILIER_BAR,
    desc: "Le bar gonflable transforme n'importe quel espace en point de vente ou d'accueil. Sa surface supérieure rigide (plateau amovible inclus) permet de poser verres, bouteilles et matériel. Disponible en version droite ou courbe, personnalisable aux couleurs de votre marque.",
    specs: [
      { label: "Dimensions", value: "200 × 60 × 110 cm (L×P×H)" },
      { label: "Poids", value: "~8 kg (sans plateau)" },
      { label: "Plateau", value: "Plateau rigide amovible inclus" },
      { label: "Gonflage", value: "Pompe électrique, 3 min" },
      { label: "Matériau", value: "Polyamide étanche renforcé" },
    ],
  },
  {
    title: "Comptoir d'accueil",
    img: MOBILIER_MANGE_DEBOUT,
    desc: "Le comptoir d'accueil gonflable est la solution idéale pour les entrées de festival, les salons professionnels et les événements corporate. Sa forme en arc de cercle permet d'accueillir 1 à 2 personnes derrière le comptoir. Grande surface d'impression pour votre branding.",
    specs: [
      { label: "Dimensions", value: "250 × 70 × 100 cm (L×P×H)" },
      { label: "Poids", value: "~10 kg" },
      { label: "Plateau", value: "Plateau rigide amovible inclus" },
      { label: "Gonflage", value: "Pompe électrique, 3 min" },
      { label: "Matériau", value: "Polyamide étanche, impression sublimation" },
    ],
  },
];

const transportProducts = [
  {
    title: "Chariot de transport",
    img: ACCESSOIRE_CHARIOT,
    desc: "Chariot renforcé sur roues pneumatiques pour transporter les écrans soufflerie (8m à 24m). Structure en aluminium, pliable, avec sangles de maintien. Supporte jusqu'à 250 kg. Indispensable pour les équipes qui installent régulièrement des écrans de grande taille.",
    specs: [
      { label: "Charge max", value: "250 kg" },
      { label: "Poids", value: "~12 kg" },
      { label: "Roues", value: "Pneumatiques tout-terrain" },
      { label: "Pliable", value: "Oui — dimensions pliées : 120 × 40 × 20 cm" },
    ],
  },
  {
    title: "Flycase professionnel",
    img: ACCESSOIRE_FLYCASE,
    desc: "Flycase rigide sur roulettes pour le transport et le stockage des écrans étanches et du mobilier. Protection maximale contre les chocs, l'humidité et la poussière. Fermeture à clé. Empilable. Idéal pour les loueurs et les prestataires événementiels.",
    specs: [
      { label: "Dimensions", value: "Adaptées à chaque modèle d'écran" },
      { label: "Protection", value: "Mousse intérieure découpée sur mesure" },
      { label: "Roulettes", value: "4 roulettes pivotantes dont 2 avec frein" },
      { label: "Fermeture", value: "Serrure à clé + fermetures papillon" },
    ],
  },
];

const faqItems = [
  {
    q: "Le mobilier gonflable est-il vraiment confortable ?",
    a: "Oui. La pression d'air dans les chambres est calibrée pour offrir un maintien ferme mais souple, comparable à un coussin de qualité. Le canapé et le fauteuil ont été testés lors de centaines d'événements. Les retours sont unanimes : les gens sont surpris par le confort."
  },
  {
    q: "Le mobilier résiste-t-il à un usage intensif (festival de 3 jours) ?",
    a: "Oui. Le tissu polyamide est le même que celui de nos écrans étanches, conçu pour résister aux UV, à l'abrasion et aux intempéries. Les coutures thermo-soudées ne cèdent pas. En cas de crevaison accidentelle (cutter, mégot), l'air s'échappe lentement et un kit de réparation permet de colmater en quelques minutes."
  },
  {
    q: "Peut-on personnaliser le mobilier aux couleurs de notre marque ?",
    a: "Oui. Comme pour nos tentes, nous proposons un service de personnalisation complet : choix des couleurs de tissu, impression de logos et visuels en sublimation. Le bar et le comptoir d'accueil sont particulièrement adaptés au branding grâce à leurs grandes surfaces d'impression."
  },
  {
    q: "Comment nettoyer le mobilier ?",
    a: "Eau claire et savon doux. Le tissu polyamide ne retient pas les taches. Pour les taches tenaces (vin, herbe), un nettoyant textile doux suffit. Laissez sécher avant de ranger. Ne pas utiliser de solvant ni de javel."
  },
  {
    q: "Faut-il une pompe spéciale ?",
    a: "Non. Une pompe manuelle suffit pour le fauteuil et le canapé (1 à 2 minutes). Pour le bar et le comptoir, nous recommandons la pompe électrique 12V/220V (incluse). Toute pompe à valve standard (type matelas gonflable) est compatible."
  },
];

export default function Mobilier() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <BokehEffect />
        <div className="absolute inset-0">
          <img src={MOBILIER_FAUTEUIL} alt="Fauteuil gonflable design Hallucine pour événements et espaces lounge" className="w-full h-full object-cover" />
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
              <span className="text-gradient-gold">& accessoires de transport</span>
            </h1>
            <p className="text-white/70 mt-6 text-lg max-w-2xl leading-relaxed">
              Canapés, fauteuils, bars, comptoirs — la même technologie étanche que nos écrans, appliquée au mobilier événementiel. Plus les chariots et flycases pour transporter le tout.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro technologie */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="order-2 lg:order-1">
              <img src={MOBILIER_SUPPORT} alt="Structure étanche du mobilier gonflable Hallucine avec chambre à air scellée" className="w-full rounded-sm border border-white/10" />
              <p className="text-white/40 text-xs mt-3 text-center italic">Structure étanche — chambre à air scellée, même technologie que nos écrans</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1} className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Le confort gonflable<br />
                <span className="text-white/60 text-2xl">pour vos événements</span>
              </h2>
              <p className="text-white/60 mt-6 leading-relaxed">
                Notre mobilier gonflable utilise la technologie étanche à chambre à air scellée — la même que nos écrans de 2 à 8 mètres et nos tentes. Vous gonflez une seule fois, le mobilier reste stable et confortable toute la durée de l'événement. Pas de soufflerie, pas de bruit, pas de câble.
              </p>
              <p className="text-white/60 mt-4 leading-relaxed">
                Le tissu polyamide est résistant aux UV, à l'abrasion et aux intempéries. Les coutures sont thermo-soudées pour une étanchéité parfaite. Chaque pièce se range dans un sac compact et se transporte sans effort.
              </p>
              <p className="text-white/60 mt-4 leading-relaxed">
                Nous proposons également des accessoires de transport professionnels — chariots et flycases — pour les équipes qui installent régulièrement nos écrans et nos tentes.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Feather, label: "Ultra-léger", desc: "De 3 à 10 kg par pièce" },
                  { icon: Clock, label: "Montage express", desc: "1 à 3 minutes par pièce" },
                  { icon: Shield, label: "Résistant", desc: "UV, pluie, usage intensif" },
                  { icon: Palette, label: "Personnalisable", desc: "Couleurs et impression" },
                ].map((f, i) => (
                  <div key={i} className="p-4 border border-white/10 rounded-sm bg-white/[0.02]">
                    <f.icon className="w-6 h-6 text-gold mb-2" />
                    <div className="text-white font-semibold text-sm">{f.label}</div>
                    <div className="text-white/40 text-xs">{f.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Catalogue mobilier */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Sofa className="w-6 h-6 text-gold" />
              <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Catalogue mobilier</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Nos pièces de mobilier</h2>
            <p className="text-white/50 mt-4 max-w-2xl">Chaque pièce est disponible en standard (blanc ou noir) ou en version personnalisée aux couleurs de votre marque.</p>
          </motion.div>

          <div className="space-y-8">
            {mobilierProducts.map((product, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i}
                className="grid lg:grid-cols-5 gap-6 p-6 border border-white/[0.06] rounded-sm"
              >
                <div className="lg:col-span-2">
                  <img src={product.img} alt={product.title} className="w-full h-48 lg:h-full object-cover rounded-sm border border-white/10" loading="lazy" />
                </div>
                <div className="lg:col-span-3">
                  <h3 className="text-xl font-bold text-white mb-3">{product.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-5">{product.desc}</p>
                  <div className="space-y-2">
                    {product.specs.map((spec, j) => (
                      <div key={j} className="flex justify-between text-sm border-b border-white/5 pb-2">
                        <span className="text-white/40">{spec.label}</span>
                        <span className="text-white/70 font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/contactez-nous" className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all text-sm">
                    Demander un devis <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessoires de transport */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-6 h-6 text-gold" />
              <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Transport & stockage</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Accessoires de transport</h2>
            <p className="text-white/50 mt-4 max-w-2xl">Pour les professionnels qui installent régulièrement nos écrans et nos tentes : chariots et flycases conçus sur mesure.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {transportProducts.map((product, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i}
                className="border border-white/[0.06] rounded-sm overflow-hidden"
              >
                <img src={product.img} alt={product.title} className="w-full h-56 object-cover" loading="lazy" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{product.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-5">{product.desc}</p>
                  <div className="space-y-2">
                    {product.specs.map((spec, j) => (
                      <div key={j} className="flex justify-between text-sm border-b border-white/5 pb-2">
                        <span className="text-white/40">{spec.label}</span>
                        <span className="text-white/70 font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/contactez-nous" className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all text-sm">
                    Demander un devis <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cas d'utilisation */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Pour quels événements ?</h2>
            <p className="text-white/60 mt-4">Notre mobilier s'adapte à tous les contextes.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Festivals & concerts", desc: "Zones lounge, espaces VIP, bars et comptoirs de buvette. Le mobilier gonflable crée des espaces conviviaux sans logistique lourde. Montage en quelques minutes, démontage encore plus rapide." },
              { title: "Événements corporate", desc: "Mobilier aux couleurs de votre marque pour salons professionnels, lancements de produit, séminaires et team building. Le comptoir d'accueil personnalisé fait forte impression." },
              { title: "Mariages & réceptions", desc: "Espaces détente élégants pour vos invités. Le canapé et les fauteuils créent des coins de conversation en extérieur. Disponibles en blanc pour s'intégrer à la décoration." },
              { title: "Événements sportifs", desc: "Zones d'accueil partenaires, espaces de repos pour les athlètes, bars pour les spectateurs. Le mobilier résiste aux intempéries et à l'usage intensif d'une journée de compétition." },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={i} className="p-6 border border-white/10 rounded-sm">
                <h3 className="text-lg font-bold text-gold mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <div className="container max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="text-center mb-16">
            <HelpCircle className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Questions fréquentes — Mobilier</h2>
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
            <Link href="/contactez-nous" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
              Demander un devis mobilier <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
