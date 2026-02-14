/*
 * Section Notre Histoire — Timeline narrative premium
 * Chaque étape avec photo réelle variée
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
  },
  {
    year: "1996",
    title: "L'école des forains",
    text: "Pour apprendre à monter des structures, direction le village. Les forains, souvent rejetés, acceptent de partager leur savoir. Deux jours d'apprentissage intensif. À la fin : « Maintenant, t'es un vrai forain, tu peux partir en tournée. »",
    image: null,
  },
  {
    year: "1998",
    title: "La voilerie bretonne",
    text: "À La Trinité-sur-Mer, en Bretagne, une voilerie devient le berceau des premiers écrans. Jean-Christophe, maître voilier, maîtrise les techniques de couture. Ensemble, ils mettent au point un écran révolutionnaire qui tombe dans un sac à voile après chaque projection.",
    image: ECRAN_SOUFFLERIE_15,
  },
  {
    year: "2005",
    title: "Le secret des airbags",
    text: "À Lyon, ancienne capitale du tissu, une enquête mène au secret le mieux gardé de l'automobile : le tissu des airbags. Un polyamide haute ténacité de DuPont de Nemours. Léger, indestructible, parfait.",
    image: ECRAN_ETANCHE_6M,
  },
  {
    year: "2010",
    title: "La gamme étanche est née",
    text: "Inspirés du kitesurf, les premiers écrans étanches voient le jour. Chambre à air scellée, pas de soufflerie, ultra-légers. De 2m à 8m, ils révolutionnent le marché.",
    image: ECRAN_ETANCHE_3M,
  },
  {
    year: "2020",
    title: "Bloqué en Chine — Le COVID",
    text: "Février 2020, Shenzhen. Le COVID frappe. Impossible de rentrer. Plutôt que de ne rien faire, inscription à l'université pour apprendre le chinois. La Chine devient une seconde maison.",
    image: ECRAN_24M,
  },
  {
    year: "Aujourd'hui",
    title: "30 ans d'innovation",
    text: "Depuis la Chine, avec une usine partenaire dans le Dongguan, Hallucine continue sa mission : faire connaître ses écrans au plus large public. De la Bretagne à Shenzhen, l'aventure continue.",
    image: null,
  },
];

export default function StorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="histoire" className="relative py-32 overflow-hidden">
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
            <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Notre histoire</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
            D'une plage de Hong Kong<br />
            <span className="text-gradient-gold">au monde entier</span>
          </h2>
          <p className="text-white/45 text-lg mt-6 max-w-xl leading-relaxed font-serif italic">
            «&nbsp;Il faut avouer que je suis un peu feignant.&nbsp;» Mais cette paresse apparente cache 30 ans d'une persévérance acharnée.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

          <div className="space-y-20">
            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                  className="relative"
                >
                  {/* Dot on timeline */}
                  <div className="absolute left-8 lg:left-1/2 top-2 -translate-x-1/2 z-10">
                    <div className="w-3 h-3 bg-gold shadow-lg shadow-gold/30" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                  </div>

                  {/* Content */}
                  <div className={`pl-20 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-16 ${isLeft ? "" : "lg:direction-rtl"}`}>
                    <div className={`${isLeft ? "lg:text-right lg:pr-16" : "lg:col-start-2 lg:pl-16"}`} style={{ direction: "ltr" }}>
                      {/* Year */}
                      <div className={`inline-flex items-center gap-2 mb-4 ${isLeft ? "lg:float-right lg:clear-right" : ""}`}>
                        <span className="text-gold font-bold text-lg tracking-wide">{item.year}</span>
                        <div className="w-8 h-px bg-gold/30" />
                      </div>
                      <div className="clear-both" />

                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-white/50 text-[15px] leading-relaxed mb-6">{item.text}</p>

                      {/* Image */}
                      {item.image && (
                        <div className="relative overflow-hidden border border-white/[0.06] group">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260_/_0.6)] via-transparent to-transparent" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
