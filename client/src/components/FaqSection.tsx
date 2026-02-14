/*
 * Section FAQ — Questions fréquentes pour la page d'accueil
 * Bon pour le SEO (Schema.org FAQPage)
 */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, HelpCircle, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const faqItems = [
  {
    q: "Qu'est-ce qu'un écran de cinéma gonflable ?",
    a: "Un écran de cinéma gonflable est une structure légère et portable qui se gonfle à l'air pour créer une surface de projection en plein air. Contrairement aux écrans rigides ou aux structures métalliques, il se transporte dans un sac, se monte en quelques minutes, et ne nécessite aucun outil ni engin de levage. Hallucine fabrique des écrans gonflables de 2 à 24 mètres de large."
  },
  {
    q: "Pourquoi choisir Hallucine plutôt qu'un autre fabricant ?",
    a: "Trois raisons principales. Premièrement, nos écrans sont 3 fois plus légers que ceux de la concurrence grâce à nos tissus techniques (polyamide de kitesurf et tissu d'airbag automobile). Deuxièmement, nous avons 30 ans d'expérience terrain — nous avons nous-mêmes utilisé nos écrans sur des centaines d'événements. Troisièmement, nous offrons une garantie de 10 ans sur la structure, ce qui est unique dans l'industrie."
  },
  {
    q: "Quelle est la différence entre vos deux gammes d'écrans ?",
    a: "La gamme étanche (2 à 8m) utilise une chambre à air scellée : vous gonflez une fois, l'écran reste en forme toute la soirée sans électricité. La gamme soufflerie (5 à 24m) utilise une soufflerie permanente pour les grands formats. Les deux gammes utilisent des tissus techniques de pointe et sont garanties 10 ans."
  },
  {
    q: "Combien coûte un écran gonflable Hallucine ?",
    a: "Le prix dépend de la taille et de la technologie choisie. Contactez-nous pour un devis personnalisé gratuit. Nous vous conseillerons la solution la plus adaptée à votre budget et à votre usage. Nous proposons également des options de location pour les événements ponctuels."
  },
  {
    q: "Livrez-vous à l'international ?",
    a: "Oui. Nous livrons dans le monde entier depuis notre usine partenaire à Dongguan (Chine). Les délais sont de 2 à 4 semaines selon la destination. Pour l'Europe, comptez environ 2 semaines. Nous gérons les formalités douanières et le transport."
  },
  {
    q: "Proposez-vous aussi des tentes et du mobilier gonflable ?",
    a: "Oui. Nous utilisons la même technologie étanche (chambre à air scellée) pour fabriquer des tentes gonflables et du mobilier événementiel (canapés, fauteuils, bars, comptoirs). Tout se gonfle en quelques minutes, sans soufflerie, et se transporte facilement."
  },
];

export default function FaqSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-32 overflow-hidden">
      <div ref={ref} className="container relative max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <HelpCircle className="w-8 h-8 text-gold mx-auto mb-4" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Questions fréquentes
          </h2>
          <p className="text-white/45 text-lg mt-4 leading-relaxed">
            Les réponses aux questions que l'on nous pose le plus souvent.
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
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

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/40 text-sm mb-4">Vous avez d'autres questions ?</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-sm hover:bg-gold-light transition-all glow-gold">
            Contactez-nous <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
