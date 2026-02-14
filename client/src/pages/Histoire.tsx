/*
 * Page dédiée : Notre Histoire
 * Timeline narrative complète du fondateur
 * Photos RÉELLES variées de toutes les catégories
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Photos RÉELLES variées - une différente pour chaque chapitre illustré
const ETANCHE_3M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/XkmcCQJvGfnRZRxz.jpg";
const ETANCHE_5M_RITZ = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CzprNCGHiOGRIkTg.jpg";
const SOUFFLERIE_13M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bWqLOjfHSsVoXNHz.jpg";
const SOUFFLERIE_24M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/KzXxmgVsjMoEdlML.jpg";
const SOUFFLERIE_15M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/xEbWQMioMZQLtuDK.jpg";
const SOUFFLERIE_12M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/AFizhJVCNHvXVtJS.jpg";
const TENTE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/YqpLPgGtuwNJbHEB.png";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const chapters = [
  {
    year: "1995",
    title: "L'étincelle sur une plage de Hong Kong",
    text: "Tout commence sur une plage de Hong Kong. Un kitesurf attire l'attention. Ses boudins gonflables, légers et résistants au vent, font naître une idée qui changera tout : et si on pouvait projeter des films en plein air avec un écran aussi léger qu'une voile de kite ?",
    image: null,
    quote: null,
  },
  {
    year: "1996",
    title: "Le premier écran — et la première leçon",
    text: "Le premier écran est tubulaire, commandé en Angleterre. À la livraison : de gros tuyaux lourds et aucune idée de comment les monter. C'est un échec, mais c'est aussi le début d'une quête : trouver la bonne technologie.",
    image: ETANCHE_3M,
    quote: null,
  },
  {
    year: "1996",
    title: "L'école des forains",
    text: "Dans le village, des forains sont un peu rejetés par tout le monde. Mais au lieu de les ignorer, c'est vers eux que le fondateur se tourne pour apprendre à monter des structures. Deux jours d'apprentissage intensif sur le terrain, à monter des tentes avec des poteaux et des bancs.",
    image: null,
    quote: "« Maintenant, t'es un vrai forain. Tu peux partir en tournée. »",
  },
  {
    year: "1998",
    title: "La voilerie bretonne — La Trinité-sur-Mer",
    text: "En Bretagne, à La Trinité-sur-Mer, une voilerie devient le berceau des premiers vrais écrans Hallucine. Jean-Christophe, maître voilier, maîtrise toutes les techniques de couture. Ensemble, ils mettent au point un écran révolutionnaire : après la projection, il tombe dans un grand sac à voile. Pas besoin de le replier.",
    image: SOUFFLERIE_12M,
    quote: null,
  },
  {
    year: "2000",
    title: "Hallucine, la boîte de prestation",
    text: "Hallucine devient une entreprise de prestation événementielle. L'équipe tourne dans le monde entier pour faire des projections en plein air. C'est cette expérience terrain qui forge la philosophie de l'entreprise : chaque produit doit être pensé par ceux qui l'utilisent.",
    image: SOUFFLERIE_24M,
    quote: "« Nos concurrents n'ont jamais eu, à 3h du matin, à devoir replier un écran pour aller se coucher. Nous, si. »",
  },
  {
    year: "2005",
    title: "Le secret des airbags — Lyon",
    text: "À Lyon, ancienne capitale du tissu, une enquête commence. Les airbags de voiture utilisent un tissu léger et très résistant. Quand les constructeurs automobiles disent que c'est « secret défense », le fondateur ne se décourage pas. Il finit par trouver la réponse dans une usine lyonnaise : un polyamide haute ténacité de DuPont de Nemours. Le même tissu pour tous les constructeurs.",
    image: ETANCHE_5M_RITZ,
    quote: null,
  },
  {
    year: "2008",
    title: "L'exil en Tunisie",
    text: "La voilerie bretonne connaît des difficultés et décide de s'exiler en Tunisie. Fidèle à ses partenaires, le fondateur les suit. La fabrication continue sous le soleil tunisien.",
    image: null,
    quote: null,
  },
  {
    year: "2012",
    title: "La Chine — Répondre au marché",
    text: "Des clients demandent des écrans moins chers. Direction la Chine pour fabriquer des écrans économiques de 5 à 6 mètres avec un tissu enduit plus lourd. Ce n'est pas la qualité habituelle, mais c'est la loi du marché. Les voyages en Chine deviennent réguliers : tous les 15 jours.",
    image: SOUFFLERIE_13M,
    quote: null,
  },
  {
    year: "Février 2020",
    title: "Bloqué en Chine — Le COVID",
    text: "Dernier voyage en Chine, février 2020. Le COVID frappe. Impossible de rentrer. Plutôt que de ne rien faire, inscription à l'université de Shenzhen pour apprendre le chinois. La ville, proche de Hong Kong, permet de découvrir le Japon, l'Australie et toute l'Asie.",
    image: null,
    quote: "« Il faut avouer que je suis un peu feignant et que je n'ai pas beaucoup appris. Mais j'étais pris par le charme de cette ville. »",
  },
  {
    year: "Aujourd'hui",
    title: "Shenzhen — L'aventure continue",
    text: "Installé en Chine, le fondateur travaille avec une usine partenaire dans le Dongguan. On peut dire qu'ils sont devenus amis. La partie prestation a été revendue pour se recentrer sur la fabrication et la vente. Mais l'esprit reste le même : des produits conçus par des gens qui les utilisent. L'objectif est clair : faire connaître les écrans Hallucine au plus large public.",
    image: SOUFFLERIE_15M,
    quote: null,
  },
];

export default function Histoire() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={TENTE} alt="Événement Hallucine" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.03_260_/_0.95)] via-[oklch(0.12_0.03_260_/_0.80)] to-[oklch(0.10_0.03_260_/_0.6)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-transparent to-transparent" />
        </div>
        <div className="relative container pt-32 pb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">Notre histoire</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 leading-tight max-w-3xl">
              D'une plage de Hong Kong<br />
              <span className="text-gradient-gold">au monde entier</span>
            </h1>
            <p className="text-white/70 mt-6 text-xl max-w-2xl leading-relaxed font-serif italic">
              30 ans d'innovation, de persévérance et de passion. L'histoire d'un homme qui a transformé une idée folle en révolution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32 relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />

        <div className="container max-w-5xl">
          {chapters.map((chapter, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeIn}
              className={`relative mb-20 lg:mb-28 flex flex-col ${
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 lg:gap-16 items-start`}
            >
              {/* Dot on timeline */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 z-10 hidden lg:block">
                <div className="w-4 h-4 rounded-full bg-gold border-4 border-[oklch(0.14_0.03_260)] shadow-lg shadow-gold/30" />
              </div>

              {/* Content */}
              <div className="flex-1 lg:max-w-[45%]">
                <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/20 rounded-sm mb-4">
                  <span className="text-gold text-sm font-bold">{chapter.year}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{chapter.title}</h3>
                <p className="text-white/60 leading-relaxed text-base">{chapter.text}</p>
                {chapter.quote && (
                  <blockquote className="mt-6 pl-4 border-l-2 border-gold/40">
                    <p className="text-gold/80 font-serif italic text-lg leading-relaxed">{chapter.quote}</p>
                  </blockquote>
                )}
              </div>

              {/* Image */}
              {chapter.image && (
                <div className="flex-1 lg:max-w-[45%] w-full">
                  <div className="overflow-hidden rounded-sm border border-white/10">
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Nos valeurs</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Légèreté", desc: "Chaque gramme compte. Nous avons replié des écrans à 3h du matin. Nous savons ce que « trop lourd » veut dire." },
                { title: "Fiabilité", desc: "Nos écrans sont garantis 10 ans. Parce que quand vous êtes sur le terrain, vous n'avez pas droit à l'erreur." },
                { title: "Innovation", desc: "Du kitesurf aux airbags, nous cherchons l'inspiration partout. La meilleure solution n'est jamais la plus évidente." },
              ].map((v, i) => (
                <div key={i} className="p-6 border border-white/10 rounded-sm">
                  <h3 className="text-xl font-bold text-gold mb-3">{v.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
