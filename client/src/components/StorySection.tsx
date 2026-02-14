/*
 * Design: "Nuit Étoilée" – Section Notre Histoire
 * Photos réelles variées pour illustrer chaque étape
 * Timeline narrative du fondateur
 */
import { motion } from "framer-motion";

// Photos réelles variées pour chaque étape
const ECRAN_ETANCHE_3M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/XkmcCQJvGfnRZRxz.jpg";
const ECRAN_SOUFFLERIE_15 = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/sXHwwugjLCgZdqTA.jpg";
const ECRAN_24M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/FdcsGRVCOGXGHcKi.jpg";
const ECRAN_ETANCHE_6M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/lnVfJDBlokHJPkwN.jpg";

const timeline = [
  {
    year: "1995",
    title: "L'étincelle — Hong Kong",
    text: "Sur une plage de Hong Kong, un kitesurf attire l'attention. Ses boudins gonflables, légers et résistants, font naître une idée folle : et si on pouvait projeter des films en plein air avec un écran aussi léger qu'une voile ?",
    image: null,
    side: "left" as const,
  },
  {
    year: "1996",
    title: "L'école des forains",
    text: "Pour apprendre à monter des structures, direction le village. Les forains, souvent rejetés, acceptent de partager leur savoir. Deux jours d'apprentissage intensif. À la fin : « Maintenant, t'es un vrai forain, tu peux partir en tournée. »",
    image: null,
    side: "right" as const,
  },
  {
    year: "1998",
    title: "La voilerie bretonne",
    text: "À La Trinité-sur-Mer, en Bretagne, une voilerie devient le berceau des premiers écrans. Jean-Christophe, maître voilier, maîtrise les techniques de couture. Ensemble, ils mettent au point un écran révolutionnaire qui tombe dans un sac à voile après chaque projection.",
    image: ECRAN_SOUFFLERIE_15,
    side: "left" as const,
  },
  {
    year: "2005",
    title: "Le secret des airbags",
    text: "À Lyon, ancienne capitale du tissu, une enquête mène au secret le mieux gardé de l'automobile : le tissu des airbags. Un polyamide haute ténacité de DuPont de Nemours. Léger, indestructible, parfait. Les constructeurs disaient « secret défense ». Nous avons trouvé quand même.",
    image: ECRAN_ETANCHE_6M,
    side: "right" as const,
  },
  {
    year: "2010",
    title: "La gamme étanche est née",
    text: "Inspirés du kitesurf, les premiers écrans étanches voient le jour. Chambre à air scellée, pas de soufflerie, ultra-légers. De 2m à 8m, ils révolutionnent le marché des petits et moyens écrans.",
    image: ECRAN_ETANCHE_3M,
    side: "left" as const,
  },
  {
    year: "2020",
    title: "Bloqué en Chine — Le COVID",
    text: "Février 2020, Shenzhen. Le COVID frappe. Impossible de rentrer. Plutôt que de ne rien faire, inscription à l'université pour apprendre le chinois. La Chine devient une seconde maison, et une usine dans le Dongguan devient un partenaire et un ami.",
    image: ECRAN_24M,
    side: "right" as const,
  },
  {
    year: "Aujourd'hui",
    title: "30 ans d'innovation",
    text: "Depuis la Chine, avec une usine partenaire dans le Dongguan, Hallucine continue sa mission : faire connaître ses écrans au plus large public. De la Bretagne à Shenzhen, l'aventure continue.",
    image: null,
    side: "left" as const,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function StorySection() {
  return (
    <section id="histoire" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

      <div className="container relative">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Notre histoire</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 leading-tight">
            D'une plage de Hong Kong<br />
            <span className="text-gradient-gold">au monde entier</span>
          </h2>
          <p className="text-white/60 mt-6 text-lg leading-relaxed font-serif italic">
            « Il faut avouer que je suis un peu feignant. » Mais cette paresse apparente cache 30 ans d'une persévérance acharnée, de Lyon à Shenzhen, en passant par la Bretagne et la Tunisie.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto space-y-16 md:space-y-24">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUp}
              className={`relative flex flex-col ${
                item.side === "right" ? "md:flex-row-reverse" : "md:flex-row"
              } gap-8 md:gap-12 items-center`}
            >
              {/* Year badge */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 z-10 hidden md:block">
                <div className="w-4 h-4 rounded-full bg-gold border-4 border-[oklch(0.14_0.03_260)] shadow-lg shadow-gold/30" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/20 rounded-sm mb-4">
                  <span className="text-gold text-sm font-bold">{item.year}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.text}</p>
              </div>

              {/* Image (if available) - PHOTOS RÉELLES VARIÉES */}
              {item.image && (
                <div className="flex-1 w-full">
                  <div className="overflow-hidden rounded-sm border border-white/10">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 md:h-72 object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
