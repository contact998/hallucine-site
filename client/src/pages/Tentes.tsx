/*
 * Page Tentes Gonflables — Contenu texte complet et enrichi
 * Modèles, personnalisation, cas d'usage, FAQ
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, ChevronRight, ChevronDown, Wind, Shield, Feather, Clock, ArrowLeft, Palette, Ruler, Package, HelpCircle, Users, Store, PartyPopper } from "lucide-react";
import { Link } from "wouter";

const TENTE_1 = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/YqpLPgGtuwNJbHEB.png";
const TENTE_2 = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ozhVXCxOcuYoBREY.png";
const TENTE_3 = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/JfqHqNzmClwigWcR.png";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const tenteModels = [
  {
    name: "Tente Étoile",
    desc: "La forme signature d'Hallucine. Ses pointes en étoile lui donnent une silhouette unique et reconnaissable. Disponible en plusieurs tailles, elle s'adapte aussi bien aux marchés qu'aux festivals.",
    sizes: "3m, 4m, 5m, 6m de diamètre",
    capacity: "4 à 20 personnes selon la taille",
    weight: "8 à 30 kg",
    setup: "1 personne, 3 à 8 minutes",
    img: TENTE_1,
  },
  {
    name: "Tente Dôme",
    desc: "La forme classique, optimisée pour la résistance au vent. Le dôme offre un volume intérieur maximal et une excellente tenue aux intempéries. Idéale pour les stands d'accueil et les espaces de réception.",
    sizes: "3m, 4m, 5m, 6m, 8m de diamètre",
    capacity: "4 à 30 personnes selon la taille",
    weight: "10 à 40 kg",
    setup: "1–2 personnes, 5 à 10 minutes",
    img: TENTE_2,
  },
  {
    name: "Tente Tunnel",
    desc: "La forme allongée, parfaite pour les espaces de passage et les files d'attente couvertes. Le tunnel crée un couloir protégé qui peut être modulé en longueur en connectant plusieurs modules.",
    sizes: "3m × 6m, 3m × 9m, 4m × 8m, 4m × 12m",
    capacity: "10 à 50 personnes selon la longueur",
    weight: "15 à 50 kg",
    setup: "2 personnes, 10 à 15 minutes",
    img: TENTE_3,
  },
];

const useCases = [
  { icon: Store, title: "Marchés & salons", desc: "Stand de vente, stand d'exposition, marché de Noël, salon professionnel. La tente se monte en quelques minutes et attire l'attention par sa forme unique." },
  { icon: PartyPopper, title: "Festivals & événements", desc: "Espace VIP, billetterie, buvette, espace de repos. Les tentes gonflables créent des espaces définis sans structure métallique lourde." },
  { icon: Users, title: "Corporate & team building", desc: "Espace de réception, salle de réunion éphémère, stand de marque. Personnalisable aux couleurs de votre entreprise." },
  { icon: Shield, title: "Secours & logistique", desc: "Poste de secours, PC sécurité, espace de stockage temporaire. Montage ultra-rapide en situation d'urgence." },
];

const faqItems = [
  {
    q: "Les tentes résistent-elles à la pluie ?",
    a: "Oui. Nos tentes utilisent la même technologie étanche que nos écrans. Le tissu polyamide est imperméable et les coutures sont thermo-soudées. Elles résistent à des pluies modérées à fortes. Pour les événements de longue durée sous pluie continue, nous recommandons d'ajouter des gouttières optionnelles."
  },
  {
    q: "Peut-on personnaliser les couleurs et ajouter un logo ?",
    a: "Oui. Nous proposons un service de personnalisation complet : choix des couleurs du tissu (parmi notre nuancier), impression de logos et de visuels en sublimation (impression dans la masse, résistante aux UV et au lavage), et formes sur mesure pour les projets spéciaux. Comptez 3 à 4 semaines pour une tente personnalisée."
  },
  {
    q: "Peut-on connecter plusieurs tentes ensemble ?",
    a: "Oui, notamment avec le modèle Tunnel. Les modules se connectent par des fermetures éclair étanches pour créer des espaces plus grands. Il est aussi possible de connecter une tente Étoile ou Dôme à un tunnel pour créer un espace d'accueil avec un couloir d'accès couvert."
  },
  {
    q: "Quelle est la résistance au vent ?",
    a: "Nos tentes résistent à des vents de 50 à 60 km/h lorsqu'elles sont correctement haubanées avec le kit fourni. La forme arrondie (dôme ou étoile) offre une excellente prise au vent. Au-delà de 60 km/h, nous recommandons de dégonfler la tente par précaution."
  },
  {
    q: "Comment se fait l'entretien ?",
    a: "Le tissu polyamide se nettoie simplement à l'eau claire et au savon doux. Laissez sécher la tente avant de la ranger pour éviter les moisissures. En cas de petite perforation, un kit de réparation (inclus) permet de colmater la fuite en quelques minutes, comme pour un boudin de kitesurf."
  },
];

export default function Tentes() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={TENTE_1} alt="Tente gonflable Hallucine lors d'un événement" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.03_260_/_0.92)] via-[oklch(0.12_0.03_260_/_0.75)] to-[oklch(0.10_0.03_260_/_0.4)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-transparent to-transparent" />
        </div>
        <div className="relative container pt-32 pb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">Tentes gonflables</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 leading-tight max-w-3xl">
              Tentes gonflables<br />
              <span className="text-gradient-gold">technologie étanche</span>
            </h1>
            <p className="text-white/70 mt-6 text-lg max-w-2xl leading-relaxed">
              La même technologie que nos écrans étanches, appliquée aux structures événementielles. Chambre à air scellée, montage en quelques minutes, sans soufflerie. Personnalisables aux couleurs de votre marque.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Technologie */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                L'expertise du kitesurf<br />
                <span className="text-white/60 text-2xl">au service de l'événementiel</span>
              </h2>
              <p className="text-white/60 mt-6 leading-relaxed">
                Nos tentes gonflables utilisent exactement la même technologie étanche que nos écrans de 2 à 8 mètres. Inspirée des boudins de kitesurf, cette technologie à chambre à air scellée permet un gonflage unique : une fois en place, la tente est autonome, sans soufflerie, sans bruit, sans câble électrique.
              </p>
              <p className="text-white/60 mt-4 leading-relaxed">
                Le tissu polyamide étanche est imperméable, résistant aux UV et aux déchirures. Les coutures sont thermo-soudées (pas cousues) pour garantir une étanchéité parfaite. La structure gonflable absorbe les chocs et les rafales de vent sans se déformer.
              </p>
              <p className="text-white/60 mt-4 leading-relaxed">
                En cas de crevaison accidentelle, la tente ne s'effondre pas brutalement : l'air s'échappe lentement (comme un pneu), ce qui laisse le temps de réparer ou d'évacuer. Un kit de réparation est inclus avec chaque tente.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Feather, label: "Ultra-légères", desc: "De 8 à 50 kg selon le modèle" },
                  { icon: Clock, label: "Montage rapide", desc: "3 à 15 minutes" },
                  { icon: Shield, label: "Étanches", desc: "Coutures thermo-soudées" },
                  { icon: Wind, label: "Sans soufflerie", desc: "Chambre à air scellée" },
                ].map((f, i) => (
                  <div key={i} className="p-4 border border-white/10 rounded-sm bg-white/[0.02]">
                    <f.icon className="w-6 h-6 text-gold mb-2" />
                    <div className="text-white font-semibold text-sm">{f.label}</div>
                    <div className="text-white/40 text-xs">{f.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1}>
              <img src={TENTE_2} alt="Tente gonflable Hallucine — structure étanche en situation" className="w-full rounded-sm border border-white/10" />
              <p className="text-white/40 text-xs mt-3 text-center italic">Structure étanche — chambre à air scellée en polyamide</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modèles */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[1px] bg-gold" />
              <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Nos modèles</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Trois formes, un même savoir-faire</h2>
            <p className="text-white/50 mt-4 max-w-2xl">Chaque forme répond à un besoin spécifique. Toutes partagent la même technologie étanche et la même qualité de fabrication.</p>
          </motion.div>

          <div className="space-y-12">
            {tenteModels.map((model, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i}
                className="grid lg:grid-cols-2 gap-8 items-center p-6 md:p-8 border border-white/[0.06] rounded-sm"
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <img src={model.img} alt={`${model.name} Hallucine`} className="w-full h-64 md:h-80 object-cover rounded-sm border border-white/10" loading="lazy" />
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h3 className="text-2xl font-bold text-white mb-3">{model.name}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">{model.desc}</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Ruler className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                      <div>
                        <span className="text-white/70 font-medium">Tailles disponibles : </span>
                        <span className="text-white/50">{model.sizes}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                      <div>
                        <span className="text-white/70 font-medium">Capacité : </span>
                        <span className="text-white/50">{model.capacity}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Feather className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                      <div>
                        <span className="text-white/70 font-medium">Poids : </span>
                        <span className="text-white/50">{model.weight}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                      <div>
                        <span className="text-white/70 font-medium">Montage : </span>
                        <span className="text-white/50">{model.setup}</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/contact" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all text-sm">
                    Demander un devis <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Personnalisation */}
      <section className="py-24 md:py-32">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="text-center mb-16">
            <Palette className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Personnalisation complète</h2>
            <p className="text-white/50 mt-4">Chaque tente peut être personnalisée aux couleurs de votre marque, de votre événement ou de votre ville.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Couleurs sur mesure",
                desc: "Choisissez parmi notre nuancier de plus de 40 couleurs de tissu. Possibilité de combiner plusieurs couleurs sur une même tente (panneaux bicolores, dégradés).",
              },
              {
                title: "Impression de logos",
                desc: "Impression en sublimation directement dans le tissu. Résistante aux UV, au lavage et à l'abrasion. Logos, visuels, textes — tout est possible, sur toutes les faces.",
              },
              {
                title: "Formes sur mesure",
                desc: "Pour les projets spéciaux, nous pouvons concevoir des formes personnalisées. Arches, tunnels courbes, structures asymétriques — notre bureau d'études vous accompagne.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i}
                className="p-6 border border-white/[0.06] bg-white/[0.02] rounded-sm"
              >
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={3} className="mt-8 p-6 border border-gold/20 rounded-sm bg-gold/5">
            <p className="text-white/60 text-sm leading-relaxed">
              <strong className="text-gold">Délai de personnalisation :</strong> comptez 3 à 4 semaines pour une tente personnalisée (couleurs et/ou impression). Les tentes standard (blanc ou noir) sont disponibles en 2 semaines.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cas d'usage */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Pour quels usages ?</h2>
            <p className="text-white/50 mt-4">Nos tentes s'adaptent à tous les contextes événementiels.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i}
                className="flex gap-4 p-6 border border-white/[0.06] rounded-sm"
              >
                <uc.icon className="w-8 h-8 text-gold shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{uc.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{uc.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessoires inclus */}
      <section className="py-24 md:py-32">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="p-6 md:p-8 border border-white/10 rounded-sm bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-gold" />
              <h3 className="text-xl font-bold text-white">Accessoires inclus avec chaque tente</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Sac de transport", desc: "Sac renforcé avec roulettes pour les modèles 5m+" },
                { name: "Pompe électrique", desc: "Pompe 12V/220V avec manomètre de pression" },
                { name: "Kit de haubanage", desc: "Sangles, piquets et tendeurs en acier inoxydable" },
                { name: "Kit de réparation", desc: "Rustines, colle et valve de rechange" },
                { name: "Lestage (option)", desc: "Sacs de lestage remplissables pour sols durs" },
                { name: "Gouttières (option)", desc: "Gouttières amovibles pour évacuation de l'eau de pluie" },
              ].map((acc, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border border-white/5 rounded-sm">
                  <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white font-medium text-sm">{acc.name}</div>
                    <div className="text-white/40 text-xs">{acc.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="text-center mb-16">
            <HelpCircle className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Questions fréquentes — Tentes</h2>
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
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
              Demander un devis tente <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
