/*
 * Page Histoire — Contenu texte complet et enrichi
 * Timeline narrative + chiffres clés + fondateur + valeurs développées
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, Award, Feather, Users, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { detectLanguage } from "@/i18n/config";
import { getRoute } from "@/i18n/routes";

const ETANCHE_3M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/hIDMieDLnUJYNHGY.webp";
const ETANCHE_5M_RITZ = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/IzUUAouVxqDCjGMh.webp";
const SOUFFLERIE_13M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ATgcmLVpJkJrnbvK.webp";
const SOUFFLERIE_24M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/eEXwXGCYYCdjehRy.webp";
const SOUFFLERIE_15M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/VWHPufHDlQZZyhyU.webp";
const SOUFFLERIE_12M = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ZsaxtYrqVuqTZtAv.webp";
const TENTE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/sEPwifSRENrYAMaz.webp";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const chapters = [
  {
    year: "1995",
    title: "L'étincelle sur une plage de Hong Kong",
    text: "Tout commence sur une plage de Hong Kong. Un kitesurf attire l'attention. Ses boudins gonflables, légers et résistants au vent, font naître une idée qui changera tout : et si on pouvait projeter des films en plein air avec un écran aussi léger qu'une voile de kite ? L'idée paraît folle, mais elle ne quittera plus jamais l'esprit du fondateur.",
    image: null,
    quote: null,
  },
  {
    year: "1996",
    title: "Le premier écran — et la première leçon",
    text: "Le premier écran est tubulaire, commandé en Angleterre. À la livraison : de gros tuyaux lourds et aucune idée de comment les monter. C'est un échec cuisant, mais c'est aussi le début d'une quête obstinée : trouver la bonne technologie, le bon tissu, la bonne méthode de fabrication. La leçon est claire : il ne suffit pas d'avoir une idée, il faut la réaliser soi-même.",
    image: ETANCHE_3M,
    quote: null,
  },
  {
    year: "1996",
    title: "L'école des forains",
    text: "Dans le village, des forains sont un peu rejetés par tout le monde. Mais au lieu de les ignorer, c'est vers eux que le fondateur se tourne pour apprendre à monter des structures. Deux jours d'apprentissage intensif sur le terrain, à monter des tentes avec des poteaux et des bancs. C'est brutal, physique, et incroyablement formateur. Les forains transmettent un savoir-faire ancestral que personne d'autre ne possède.",
    image: null,
    quote: "« Maintenant, t'es un vrai forain. Tu peux partir en tournée. »",
  },
  {
    year: "1998",
    title: "La voilerie bretonne — La Trinité-sur-Mer",
    text: "En Bretagne, à La Trinité-sur-Mer, une voilerie devient le berceau des premiers vrais écrans Hallucine. Jean-Christophe, maître voilier, maîtrise toutes les techniques de couture et de thermo-soudure. Ensemble, ils mettent au point un écran révolutionnaire : après la projection, il tombe dans un grand sac à voile. Pas besoin de le replier. C'est une innovation majeure qui deviendra la signature de la gamme soufflerie.",
    image: SOUFFLERIE_12M,
    quote: null,
  },
  {
    year: "2000",
    title: "Hallucine, la boîte de prestation",
    text: "Hallucine devient une entreprise de prestation événementielle. L'équipe tourne dans le monde entier pour faire des projections en plein air : festivals, événements corporate, mariages, retransmissions sportives. C'est cette expérience terrain, accumulée sur des centaines d'événements dans des dizaines de pays, qui forge la philosophie de l'entreprise : chaque produit doit être pensé par ceux qui l'utilisent, pas par des ingénieurs qui n'ont jamais monté un écran à 3h du matin.",
    image: SOUFFLERIE_24M,
    quote: "« Nos concurrents n'ont jamais eu, à 3h du matin, à devoir replier un écran pour aller se coucher. Nous, si. C'est pour cela que tout ce que nous fabriquons est plus léger, plus rapide, plus simple. »",
  },
  {
    year: "2005",
    title: "Le secret des airbags — Lyon",
    text: "À Lyon, ancienne capitale du tissu, une enquête commence. Les airbags de voiture utilisent un tissu incroyablement léger et résistant — capable de supporter l'explosion d'un airbag sans se déchirer. Quand les constructeurs automobiles disent que c'est « secret défense », le fondateur ne se décourage pas. Il finit par trouver la réponse dans une usine lyonnaise : un polyamide haute ténacité fabriqué par DuPont de Nemours. Le même tissu pour tous les constructeurs. Ce tissu deviendra le cœur de la gamme soufflerie.",
    image: ETANCHE_5M_RITZ,
    quote: null,
  },
  {
    year: "2008",
    title: "L'exil en Tunisie",
    text: "La voilerie bretonne connaît des difficultés économiques et décide de s'exiler en Tunisie pour réduire ses coûts de production. Fidèle à ses partenaires et à la relation de confiance construite depuis 10 ans, le fondateur les suit. La fabrication continue sous le soleil tunisien, avec la même exigence de qualité.",
    image: null,
    quote: null,
  },
  {
    year: "2012",
    title: "La Chine — Répondre au marché",
    text: "Des clients demandent des écrans moins chers pour des usages ponctuels. Direction la Chine pour fabriquer des écrans économiques de 5 à 6 mètres avec un tissu enduit plus lourd. Ce n'est pas la qualité habituelle d'Hallucine, mais c'est la loi du marché. Les voyages en Chine deviennent réguliers — tous les 15 jours — et permettent de tisser des liens durables avec les fabricants locaux.",
    image: SOUFFLERIE_13M,
    quote: null,
  },
  {
    year: "Février 2020",
    title: "Bloqué en Chine — Le COVID",
    text: "Dernier voyage en Chine, février 2020. Le COVID frappe. Impossible de rentrer en France. Plutôt que de subir la situation, inscription à l'université de Shenzhen pour apprendre le chinois. La ville, proche de Hong Kong — là où tout avait commencé 25 ans plus tôt — offre une nouvelle perspective. Ce qui devait être un contretemps devient une opportunité.",
    image: null,
    quote: "« Il faut avouer que je suis un peu feignant et que je n'ai pas beaucoup appris le chinois. Mais j'étais pris par le charme de cette ville incroyable. »",
  },
  {
    year: "Aujourd'hui",
    title: "Shenzhen — L'aventure continue",
    text: "Installé en Chine, le fondateur travaille au quotidien avec une usine partenaire dans le Dongguan — on peut dire qu'ils sont devenus amis. La partie prestation événementielle a été revendue pour se recentrer sur ce qui compte : la conception, la fabrication et la vente d'écrans, de tentes et de mobilier gonflable. L'esprit reste le même depuis 30 ans : des produits conçus par des gens qui les utilisent. L'objectif est clair : faire connaître Hallucine au plus large public possible.",
    image: SOUFFLERIE_15M,
    quote: null,
  },
];

const keyFigures = [
  { number: "30", label: "ans d'expérience", suffix: "" },
  { number: "50", label: "pays livrés", suffix: "+" },
  { number: "3", label: "fois plus léger", suffix: "×" },
  { number: "10", label: "ans de garantie", suffix: "" },
];

export default function Histoire() {
  const lang = detectLanguage();
  useDocumentMeta("Notre Histoire | Depuis 1995", "L'histoire d'Hallucine depuis 1995 : de la première projection en plein air à aujourd'hui. 30 ans d'innovation dans le cinéma gonflable.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vajzfoYsbBMsDfIq.webp");

  return (
    <div className="min-h-screen bg-background text-foreground">
        <PageStructuredData
          id="histoire"
          breadcrumbs={[{ name: "Accueil", url: "/" }, { name: "Histoire", url: "/histoire-hallucine" }]}
          article={{
            headline: "Notre Histoire | Depuis 1995",
            description: "L'histoire d'Hallucine depuis 1995 : de la première projection en plein air à aujourd'hui. 30 ans d'innovation dans le cinéma gonflable.",
            image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vajzfoYsbBMsDfIq.webp",
            url: "https://hallucine.ai/histoire-hallucine",
            datePublished: "2023-01-15T09:00:00+00:00",
            dateModified: "2024-05-20T14:30:00+00:00",
          }}
          page={{
            name: "Notre Histoire | Depuis 1995",
            description: "L'histoire d'Hallucine depuis 1995 : de la première projection en plein air à aujourd'hui. 30 ans d'innovation dans le cinéma gonflable.",
            url: "https://hallucine.ai/histoire-hallucine",
          }}
        />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img loading="lazy" src={TENTE} alt="Tente gonflable Hallucine lors d'un événement en plein air" className="w-full h-full object-cover" decoding="async" />
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
              30 ans d'innovation, de persévérance et de passion. L'histoire d'un homme qui a transformé une idée folle — projeter des films avec un écran aussi léger qu'une voile de kitesurf — en une entreprise qui exporte dans plus de 50 pays.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 md:py-20 border-b border-white/5">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {keyFigures.map((fig, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gold">
                  {fig.number}<span className="text-gold/60">{fig.suffix}</span>
                </div>
                <div className="text-white/50 text-sm mt-2">{fig.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32 relative">
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
              <div className="absolute left-1/2 -translate-x-1/2 top-2 z-10 hidden lg:block">
                <div className="w-4 h-4 rounded-full bg-gold border-4 border-[oklch(0.14_0.03_260)] shadow-lg shadow-gold/30" />
              </div>

              <div className="flex-1 lg:max-w-[45%]">
                <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/20 rounded-lg mb-4">
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

              {chapter.image && (
                <div className="flex-1 lg:max-w-[45%] w-full">
                  <div className="overflow-hidden rounded-lg border border-white/10">
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    decoding="async" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Le fondateur */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-[1px] bg-gold" />
              <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Le fondateur</span>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Un parcours atypique</h2>
                <div className="space-y-4 text-white/60 leading-relaxed">
                  <p>
                    Le fondateur d'Hallucine n'est ni ingénieur, ni designer, ni homme d'affaires de formation. C'est un passionné de cinéma et de plein air qui a appris sur le terrain — littéralement. Des plages de Hong Kong aux voileries bretonnes, des usines lyonnaises aux ateliers de Shenzhen, chaque étape de son parcours a forgé un savoir-faire unique.
                  </p>
                  <p>
                    Sa force : une curiosité insatiable et un refus obstiné du statu quo. Quand les fabricants d'écrans utilisaient de la bâche PVC lourde et rigide, il a cherché ailleurs. Quand les constructeurs automobiles lui ont dit que le tissu des airbags était « secret défense », il a continué à chercher. Quand le COVID l'a bloqué en Chine, il s'est inscrit à l'université.
                  </p>
                  <p>
                    Aujourd'hui basé à Shenzhen, il continue de développer Hallucine avec la même énergie qu'au premier jour. Son objectif : que chaque organisateur d'événement dans le monde puisse accéder à un écran de cinéma gonflable léger, fiable et abordable.
                  </p>
                </div>
              </div>
              <div className="p-6 border border-gold/20 rounded-lg bg-gold/5">
                <h3 className="text-lg font-bold text-gold mb-4">En bref</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span className="text-white/60">Basé à Shenzhen, Chine</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span className="text-white/60">30 ans d'expérience terrain</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span className="text-white/60">Centaines d'événements organisés</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Feather className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span className="text-white/60">Inventeur de la technologie étanche</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valeurs développées */}
      <section className="py-24 md:py-32">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nos valeurs</h2>
              <p className="text-white/50 max-w-xl mx-auto">Trois principes qui guident chaque décision, chaque produit, chaque interaction depuis 30 ans.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Légèreté",
                  desc: "Chaque gramme compte. Nous avons replié des écrans à 3h du matin, porté du matériel sur des plages, monté des structures sous la pluie. Nous savons ce que « trop lourd » veut dire. C'est pourquoi nous avons passé des années à chercher les tissus les plus légers et les plus résistants au monde — du kitesurf aux airbags automobiles.",
                  stat: "3× plus léger que la concurrence",
                },
                {
                  title: "Fiabilité",
                  desc: "Nos écrans sont garantis 10 ans. Pas 2, pas 5 — dix. Parce que quand vous êtes sur le terrain, à la veille d'un événement pour 5 000 personnes, vous n'avez pas droit à l'erreur. Chaque couture, chaque valve, chaque sangle est testée et retestée. Nos produits sont conçus pour durer.",
                  stat: "Garantie 10 ans",
                },
                {
                  title: "Innovation",
                  desc: "Du kitesurf aux airbags automobiles, des voileries bretonnes aux usines chinoises, nous cherchons l'inspiration partout. La meilleure solution n'est jamais la plus évidente. C'est en regardant ailleurs — dans d'autres industries, d'autres pays, d'autres cultures — que nous trouvons les idées qui font la différence.",
                  stat: "30 ans d'innovation continue",
                },
              ].map((v, i) => (
                <div key={i} className="p-6 border border-white/10 rounded-lg">
                  <h3 className="text-xl font-bold text-gold mb-4">{v.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{v.desc}</p>
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-gold/60 text-xs font-semibold">{v.stat}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white/[0.02]">
        <div className="container text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Envie d'écrire la suite avec nous ?</h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">Que vous soyez organisateur d'événements, loueur de matériel ou simplement curieux, nous serions ravis de discuter avec vous.</p>
            <Link href={getRoute("contact", lang)} className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-semibold rounded-lg hover:bg-gold-light transition-all glow-gold">
              Contactez-nous <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
