/*
 * Section Cas d'Usage — détails des applications concrètes
 * Festivals, corporate, mariages, sport, drive-in, hôtellerie
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Film, Building2, Heart, Trophy, Car, Hotel, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const useCases = [
  {
    icon: Film,
    title: "Festivals & cinéma en plein air",
    desc: "Des petits festivals de quartier aux grands événements culturels, nos écrans transforment n'importe quel espace en salle de cinéma. Le montage rapide et le poids réduit permettent aux équipes de travailler sans engin de levage, même pour les formats de 15m et plus.",
    sizes: "De 5m à 24m",
    examples: "Festival de Cannes (hors compétition), Fête de la Musique, cinémas itinérants, festivals de courts-métrages",
  },
  {
    icon: Building2,
    title: "Événements corporate",
    desc: "Lancements de produit, séminaires en plein air, soirées d'entreprise, team building. Nos écrans apportent un impact visuel considérable tout en restant simples à installer. La rétroprojection permet de placer le projecteur derrière l'écran pour un rendu professionnel sans ombre.",
    sizes: "De 5m à 17m",
    examples: "Lancements de produit, conventions, galas, soirées partenaires, assemblées générales en plein air",
  },
  {
    icon: Heart,
    title: "Mariages & événements privés",
    desc: "Un écran de cinéma gonflable transforme un mariage en soirée inoubliable. La gamme étanche est parfaite : silencieuse (pas de soufflerie), légère, et montée en 5 minutes par une seule personne. Projetez un diaporama, un film, ou retransmettez la cérémonie en direct.",
    sizes: "De 3m à 8m (gamme étanche)",
    examples: "Mariages, anniversaires, garden-parties, soirées privées, fêtes de famille",
  },
  {
    icon: Trophy,
    title: "Retransmissions sportives",
    desc: "Coupe du Monde, Jeux Olympiques, matchs de championnat — nos écrans géants permettent de rassembler des milliers de personnes autour d'un événement sportif. Le format 24m offre une visibilité à plus de 200 mètres.",
    sizes: "De 10m à 24m",
    examples: "Fan zones, stades, bars et restaurants, places publiques, événements sportifs municipaux",
  },
  {
    icon: Car,
    title: "Drive-in & cinéma itinérant",
    desc: "Le format drive-in a connu un renouveau spectaculaire. Nos écrans soufflerie de 10 à 15m sont parfaits pour transformer un parking en cinéma. Le montage en 30 minutes et le démontage rapide permettent des rotations quotidiennes.",
    sizes: "De 10m à 15m",
    examples: "Cinémas drive-in, tournées estivales, événements municipaux, centres commerciaux",
  },
  {
    icon: Hotel,
    title: "Hôtellerie & resorts",
    desc: "Les hôtels de luxe et les resorts utilisent nos écrans étanches pour proposer des soirées cinéma à leurs clients. Le silence total (pas de soufflerie) et l'élégance de la structure en font un atout pour l'expérience client. Plusieurs hôtels 5 étoiles nous font confiance.",
    sizes: "De 3m à 8m (gamme étanche)",
    examples: "Ritz Carlton, resorts balnéaires, hôtels de charme, clubs de vacances, spas",
  },
];

export default function UseCasesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="usages" className="relative py-32 overflow-hidden bg-white/[0.02]">
      <div ref={ref} className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.3em] uppercase">Cas d'usage</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
            Un écran pour chaque occasion
          </h2>
          <p className="text-white/70 text-lg mt-6 max-w-xl leading-relaxed">
            Nos écrans s'adaptent à tous les contextes : du jardin privé au stade de 50 000 places. Voici les usages les plus courants.
          </p>
        </motion.div>

        {/* Use cases grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className="p-6 border border-white/[0.06] bg-white/[0.02] hover:border-gold/20 transition-all duration-500 group"
            >
              <uc.icon className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-bold text-white mb-3">{uc.title}</h3>
              <p className="text-white/75 text-base leading-relaxed mb-4">{uc.desc}</p>
              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex items-start gap-2">
                  <span className="text-gold text-sm font-semibold shrink-0 mt-0.5">Tailles :</span>
                  <span className="text-white/70 text-sm">{uc.sizes}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold text-sm font-semibold shrink-0 mt-0.5">Exemples :</span>
                  <span className="text-white/70 text-sm">{uc.examples}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-white/75 text-base mb-4">Vous avez un projet différent ? Nous nous adaptons.</p>
          <Link href="/contactez-nous" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-lg hover:bg-gold-light transition-all glow-gold">
            Parlez-nous de votre projet <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
