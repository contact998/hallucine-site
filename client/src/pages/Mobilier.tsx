
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
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

const MOBILIER_SUPPORT = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/MoRIdWaeeTcOqCpJ.jpg";
const MOBILIER_FAUTEUIL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/WwkJlfLpECCcYGmU.jpg";
const MOBILIER_CANAPE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/KCilunXaTvaFDvKR.jpg";
const MOBILIER_BAR = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/pgGljsUzRdyrOHDq.jpg";
const MOBILIER_MANGE_DEBOUT = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/FwQqfrsOzrFnxmtI.jpg";
const MOBILIER_CANAPE_BLEU = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bWcQbEFfeNczmMmc.jpg";
const ACCESSOIRE_CHARIOT = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/MoRIdWaeeTcOqCpJ.jpg";
const ACCESSOIRE_FLYCASE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/KCilunXaTvaFDvKR.jpg";

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
  useDocumentMeta("Mobilier Gonflable Événementiel", "Mobilier gonflable pour événements : canapés, fauteuils, bars, mange-debout. Design moderne, confortable, personnalisable aux couleurs de votre marque.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HWQTHYrijbwFXBld.jpg");

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="mobilier"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: "Mobilier", url: "https://hallucinecran.fr/mobilier" },
        ]}
        product={{
          name: "Mobilier Gonflable Événementiel",
          description: "Notre gamme complète de mobilier gonflable pour tous vos événements. Canapés, fauteuils, bars, et comptoirs utilisant une technologie étanche à chambre à air scellée pour un confort et une stabilité exceptionnels.",
          image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/yIjIIOgOUQsaauXF.jpg",
          url: "https://hallucinecran.fr/mobilier",
          category: "Mobilier Gonflable",
          minPrice: 490,
        }}
        faqs={faqItems.map(item => ({ question: item.q, answer: item.a }))}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img loading="lazy" src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/yIjIIOgOUQsaauXF.jpg" alt="Mobilier gonflable Hallucine en plein air : tente araignée, canapés et table" className="w-full h-full object-cover" style={{ objectPosition: 'center 20%' }} decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.03_260_/_0.5)] via-[oklch(0.12_0.03_260_/_0.3)] to-[oklch(0.10_0.03_260_/_0.05)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260_/_0.6)] via-transparent to-transparent" />
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
              <img loading="lazy" src={MOBILIER_SUPPORT} alt="Structure étanche du mobilier gonflable Hallucine avec chambre à air scellée" className="w-full rounded-lg border border-white/10" decoding="async" />
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
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 text-white/80">
                  <Feather className="w-5 h-5 text-gold" />
                  <span>Léger & Compact</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Clock className="w-5 h-5 text-gold" />
                  <span>Installation rapide</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Shield className="w-5 h-5 text-gold" />
                  <span>Robuste & Durable</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Palette className="w-5 h-5 text-gold" />
                  <span>Personnalisable</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Mobilier */}
      <section className="py-24 md:py-32 bg-background-darker">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Notre gamme de mobilier</h2>
            <p className="text-white/60 mt-4 text-lg leading-relaxed">
              Du canapé au bar, chaque pièce est conçue pour être à la fois esthétique, confortable et incroyablement pratique. Gonflez, placez, profitez.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-8 lg:gap-12">
            {mobilierProducts.map((product, i) => (
              <motion.div key={product.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={i} className="bg-background rounded-lg overflow-hidden border border-white/10 flex flex-col">
                <img loading="lazy" src={product.img} alt={product.title} className="w-full h-64 object-cover" decoding="async" />
                <div className="p-6 lg:p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-white">{product.title}</h3>
                  <p className="text-white/60 mt-3 leading-relaxed flex-grow">{product.desc}</p>
                  <div className="mt-6 pt-6 border-t border-white/10 text-sm space-y-3 text-white/60">
                    {product.specs.map(spec => (
                      <div key={spec.label} className="flex justify-between">
                        <span className="font-semibold text-white/80">{spec.label}</span>
                        <span>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Accessoires */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Accessoires de transport<br />
                <span className="text-white/60 text-2xl">pour les pros</span>
              </h2>
              <p className="text-white/60 mt-6 leading-relaxed">
                Pour les prestataires, les loueurs et les équipes techniques, nous avons développé des solutions de transport robustes et pratiques. Fini le matériel qui s'abîme pendant le transport ou le stockage.
              </p>
              <div className="mt-8 space-y-6">
                {transportProducts.map(product => (
                  <div key={product.title} className="bg-background-darker p-6 rounded-lg border border-white/10 flex gap-6 items-start">
                    <img loading="lazy" src={product.img} alt={product.title} className="w-24 h-24 object-cover rounded-md flex-shrink-0" decoding="async" />
                    <div>
                      <h4 className="font-bold text-white">{product.title}</h4>
                      <p className="text-white/60 text-sm mt-1">{product.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1} className="relative h-[500px] hidden lg:block">
              <img loading="lazy" src={ACCESSOIRE_CHARIOT} alt="Chariot de transport pour écran gonflable" className="absolute top-0 left-0 w-3/4 rounded-lg border border-white/10 transform -rotate-6" decoding="async" />
              <img loading="lazy" src={ACCESSOIRE_FLYCASE} alt="Flycase professionnel pour matériel événementiel" className="absolute bottom-0 right-0 w-3/4 rounded-lg border border-white/10 transform rotate-3" decoding="async" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 bg-background-darker">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Questions fréquentes</h2>
            <p className="text-white/60 mt-4 text-lg">Les réponses à vos interrogations sur notre mobilier gonflable.</p>
          </div>
          <div className="mt-12 space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-white/10 rounded-lg overflow-hidden">
                <button
                  className="w-full text-left p-5 flex justify-between items-center hover:bg-white/5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-white">{item.q}</span>
                  {openFaq === index ? <ChevronDown className="w-5 h-5 text-gold" /> : <ChevronRight className="w-5 h-5 text-white/50" />}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="px-5 pb-5 border-t border-white/10"
                  >
                    <p className="text-white/70 pt-4">{item.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Prêt à meubler votre prochain événement ?</h2>
            <p className="text-white/60 mt-4 text-lg max-w-2xl mx-auto">
              Contactez-nous pour un devis personnalisé, des conseils sur le choix du mobilier ou pour discuter de vos options de branding.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/contact" className="px-6 py-3 bg-gold text-background font-semibold rounded-md hover:bg-gold/90 transition-colors">Demander un devis</Link>
              <Link href="/realisations" className="px-6 py-3 bg-white/10 text-white font-semibold rounded-md hover:bg-white/20 transition-colors">Voir nos réalisations</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
