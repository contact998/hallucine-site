/*
 * Section Notre Histoire — Layout damier (texte/image alternés)
 * Hong Kong déplacé en 2004
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ECRAN_ETANCHE_3M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/BJEGXwtAVTOdazRK.webp";
const ECRAN_SOUFFLERIE_15 = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/IBSGwnJIfTkJVDcS.webp";
const ECRAN_24M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/RaaYulZPgnqKROFE.webp";
const ECRAN_ETANCHE_6M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ftYcQWrxVqvHlMPR.webp";
const KYTEA_HK = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/SCBCurALKnXkcsMM.webp";
const ECRAN_TUBULAIRE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UQTOhAHRbAFprQCw.webp";
const VOILERIE_BRETAGNE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ktazmzoptZJiIRJB.webp";
const TROIS_ECRANS = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/QIDYATXVloCJSMRa.webp";
const REPAS_CHINOIS = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/GnSyiaJDcREwalDT.webp";
const ECLATE_ETANCHE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/MOVeGAmUzTeZFEhA.webp";
const ECRANS_ETANCHE_5_6 = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/WqGIHYUxSWGjVUmW.webp";

const chapters: { year: string; title: string; text: string; image: string | null; smallImage?: boolean; extraSmall?: boolean }[] = [
  {
    year: "1996",
    title: "L'école des forains",
    text: "Pour apprendre à monter des structures, direction le village. Les forains, souvent rejetés, acceptent de partager leur savoir. Deux jours d'apprentissage intensif. À la fin : « Maintenant, t'es un vrai forain, tu peux partir en tournée. »",
    image: ECRAN_TUBULAIRE,
    smallImage: true,
  },
  {
    year: "1998",
    title: "La voilerie bretonne",
    text: "À La Trinité-sur-Mer, en Bretagne, une voilerie devient le berceau des premiers écrans. Jean-Christophe, maître voilier, maîtrise les techniques de couture. Ensemble, ils mettent au point un écran révolutionnaire qui tombe dans un sac à voile après chaque projection.",
    image: VOILERIE_BRETAGNE,
  },
  {
    year: "2004",
    title: "L'étincelle — Hong Kong",
    text: "Sur une plage de Hong Kong, un kitesurf attire l'attention. Ses boudins gonflables, légers et résistants, font naître une idée folle : et si on pouvait projeter des films en plein air avec un écran aussi léger qu'une voile ?",
    image: KYTEA_HK,
    smallImage: true,
    extraSmall: true,
  },
  {
    year: "2005",
    title: "Le secret des airbags",
    text: "À Lyon, ancienne capitale du tissu, une enquête mène au secret le mieux gardé de l'automobile : le tissu des airbags. Un polyamide haute ténacité de DuPont de Nemours. Léger, indestructible, parfait.",
    image: ECLATE_ETANCHE,
    smallImage: true,
  },
  {
    year: "2010",
    title: "La gamme étanche est née",
    text: "Inspirés du kitesurf, les premiers écrans étanches voient le jour. Chambre à air scellée, pas de soufflerie, ultra-légers. De 2m à 8m, ils révolutionnent le marché.",
    image: ECRANS_ETANCHE_5_6,
  },
  {
    year: "2020",
    title: "Bloqué en Chine — Le COVID",
    text: "Février 2020, Shenzhen. Le COVID frappe. Impossible de rentrer. Plutôt que de ne rien faire, inscription à l'université pour apprendre le chinois. La Chine devient une seconde maison.",
    image: REPAS_CHINOIS,
  },
  {
    year: "Aujourd'hui",
    title: "30 ans d'innovation",
    text: "Depuis la Chine, avec une usine partenaire dans le Dongguan, Hallucine continue sa mission : faire connaître ses écrans au plus large public. De la Bretagne à Shenzhen, l'aventure continue.",
    image: TROIS_ECRANS,
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
          className="mb-20 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.3em] uppercase">Notre histoire</span>
            <div className="w-12 h-[1px] bg-gold" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            D'une plage de Hong Kong<br />
            <span className="text-gradient-gold text-glow-gold-intense">au monde entier</span>
          </h2>
          <p className="text-white/75 text-xl mt-6 max-w-xl mx-auto leading-relaxed font-serif italic">
            «&nbsp;Il faut avouer que je suis un peu feignant.&nbsp;» Mais cette paresse apparente cache 30 ans d'une persévérance acharnée.
          </p>
        </motion.div>

        {/* Damier */}
        <div className="space-y-0">
          {chapters.map((item, i) => {
            const imageLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-2"
              >
                {/* Image (ou placeholder) */}
                <div className={`${imageLeft ? "order-1" : "order-1 lg:order-2"} relative ${item.smallImage ? "min-h-[200px] lg:min-h-[280px]" : "min-h-[300px] lg:min-h-[400px]"} overflow-hidden flex items-center justify-center bg-black/20`}>
                  {item.image ? (
                    item.smallImage ? (
                      <img loading="lazy"
                        src={item.image}
                        alt={item.title}
                        className={`${item.extraSmall ? "w-[65%] max-h-[200px]" : "w-[85%] max-h-[260px]"} h-auto object-contain hover:scale-105 transition-transform duration-700 rounded`}
                      decoding="async" />
                    ) : (
                      <img loading="lazy"
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      decoding="async" />
                    )
                  ) : (
                    <div className="absolute inset-0 bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                      <span className="text-white/20 text-lg italic">Photo à venir</span>
                    </div>
                  )}
                </div>

                {/* Texte */}
                <div className={`${imageLeft ? "order-2" : "order-2 lg:order-1"} flex flex-col justify-center p-10 lg:p-16 bg-white/[0.02]`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold font-bold text-2xl tracking-wide">{item.year}</span>
                    <div className="w-10 h-px bg-gold/40" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-white/75 text-base lg:text-lg leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
