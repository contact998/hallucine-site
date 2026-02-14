/*
 * Page Contact — Contenu texte enrichi
 * Formulaire intelligent + infos pratiques + réassurance + FAQ
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ChevronDown, Clock, Globe, Shield, Truck, HelpCircle } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const reassuranceItems = [
  {
    icon: Clock,
    title: "Réponse sous 24h",
    desc: "Nous nous engageons à répondre à chaque demande dans les 24 heures ouvrées. Pour les demandes urgentes, précisez-le dans votre message.",
  },
  {
    icon: Globe,
    title: "Livraison mondiale",
    desc: "Nous livrons dans le monde entier depuis notre usine partenaire à Dongguan (Chine). Délai moyen : 2 à 4 semaines selon la destination.",
  },
  {
    icon: Shield,
    title: "Devis gratuit et sans engagement",
    desc: "Chaque devis est personnalisé et détaillé. Nous incluons les frais de port, les délais et les options de personnalisation.",
  },
  {
    icon: Truck,
    title: "Accompagnement complet",
    desc: "De la conception à la livraison, nous vous accompagnons à chaque étape. Conseil technique, choix des options, suivi de fabrication.",
  },
];

const faqContact = [
  {
    q: "Quels sont les délais de fabrication ?",
    a: "Pour les produits standard (blanc ou noir, sans personnalisation) : 2 semaines. Pour les produits personnalisés (couleurs, impression de logos) : 3 à 4 semaines. Les délais de livraison s'ajoutent : environ 1 semaine pour l'Europe, 2 semaines pour le reste du monde."
  },
  {
    q: "Proposez-vous de la location ?",
    a: "Nous ne proposons pas directement de la location, mais nous travaillons avec un réseau de loueurs partenaires dans plusieurs pays. Contactez-nous en précisant votre besoin et votre localisation, et nous vous orienterons vers le loueur le plus proche."
  },
  {
    q: "Peut-on visiter votre usine ?",
    a: "Oui. Notre usine partenaire est située à Dongguan, en Chine, à environ 1h30 de Shenzhen. Si vous êtes dans la région, nous serons ravis de vous accueillir pour une visite. Contactez-nous pour organiser un rendez-vous."
  },
  {
    q: "Quels sont les moyens de paiement acceptés ?",
    a: "Nous acceptons les virements bancaires (SEPA pour l'Europe, SWIFT pour l'international). Pour les commandes importantes, nous proposons un paiement en 2 fois : 50% à la commande, 50% avant expédition. Contactez-nous pour discuter des modalités."
  },
  {
    q: "Proposez-vous des tarifs pour les revendeurs ?",
    a: "Oui. Nous proposons des conditions spéciales pour les revendeurs, les loueurs et les acheteurs en volume. Contactez-nous en précisant votre activité et le volume envisagé, et nous vous ferons une proposition adaptée."
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">
        <ContactSection />
      </div>

      {/* Réassurance */}
      <section className="py-20 md:py-24 bg-white/[0.02]">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reassuranceItems.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="p-5 border border-white/[0.06] rounded-sm"
              >
                <item.icon className="w-6 h-6 text-gold mb-3" />
                <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infos pratiques */}
      <section className="py-20 md:py-24">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Informations pratiques</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-white/60 text-sm leading-relaxed">
                <h3 className="text-white font-semibold text-base mb-2">Siège et bureau commercial</h3>
                <p>
                  Hallucine est une entreprise française dont le fondateur est basé à Shenzhen (Chine) depuis 2020. Le bureau commercial gère les devis, le conseil technique et le suivi client.
                </p>
                <p>
                  <strong className="text-white/80">Fuseau horaire :</strong> UTC+8 (heure de Pékin). Nous sommes disponibles de 9h à 18h heure locale, soit de 2h à 11h heure de Paris. Pour les clients européens, les échanges se font principalement par email.
                </p>
                <p>
                  <strong className="text-white/80">Langues :</strong> Français, Anglais. Nous pouvons également communiquer en Chinois pour les clients asiatiques.
                </p>
              </div>
              <div className="space-y-4 text-white/60 text-sm leading-relaxed">
                <h3 className="text-white font-semibold text-base mb-2">Fabrication et logistique</h3>
                <p>
                  Nos produits sont fabriqués dans notre usine partenaire à Dongguan (province du Guangdong, Chine). Cette usine est spécialisée dans les structures gonflables depuis plus de 15 ans.
                </p>
                <p>
                  <strong className="text-white/80">Contrôle qualité :</strong> Chaque produit est inspecté et testé avant expédition. Le fondateur supervise personnellement la production.
                </p>
                <p>
                  <strong className="text-white/80">Expédition :</strong> Par voie maritime (délai 3–4 semaines) ou aérienne (délai 1–2 semaines, supplément). Nous gérons les formalités douanières et le transport jusqu'à votre porte.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Contact */}
      <section className="py-20 md:py-24 bg-white/[0.02]">
        <div className="container max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
            <HelpCircle className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Questions fréquentes — Commande & livraison</h2>
          </motion.div>

          <div className="space-y-3">
            {faqContact.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
