/*
 * Section Témoignages clients — Avis et retours d'expérience
 * Carrousel de témoignages avec photos, noms, rôles et citations
 */
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  location: string;
  text: string;
  rating: number;
  product: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Marie-Claire Dupont",
    role: "Directrice événementiel",
    location: "Festival de Cannes, France",
    text: "L'écran Hallucine de 13 mètres a transformé notre soirée de clôture. Le montage en 10 minutes par 2 personnes nous a fait gagner un temps précieux. La qualité d'image est exceptionnelle, même avec l'éclairage ambiant du festival.",
    rating: 5,
    product: "Écran soufflerie 13m",
  },
  {
    name: "Thomas Bergmann",
    role: "Directeur d'hôtel",
    location: "Ritz-Carlton, Genève",
    text: "Nous utilisons l'écran étanche Hallucine au bord de notre piscine depuis 3 saisons. Aucune fuite, aucune dégradation. Nos clients adorent les soirées cinéma en plein air. Le plus léger du marché, c'est un fait.",
    rating: 5,
    product: "Écran étanche 5m",
  },
  {
    name: "Jean-Pierre Moreau",
    role: "Maire adjoint à la culture",
    location: "Ville de Montpellier",
    text: "Pour nos cinémas de plein air estivaux, nous avons testé plusieurs marques. Hallucine est de loin le meilleur rapport qualité-poids. Un seul agent municipal peut transporter et installer l'écran de 8m. Impressionnant.",
    rating: 5,
    product: "Écran soufflerie 8m",
  },
  {
    name: "Sophie Laurent",
    role: "Organisatrice de mariages",
    location: "Provence, France",
    text: "J'ai recommandé Hallucine à plus de 20 couples. L'écran économique est parfait pour les mariages en plein air : élégant, facile à monter, et le rendu est magnifique. Le service client est réactif et professionnel.",
    rating: 5,
    product: "Écran économique 4m",
  },
  {
    name: "Carlos Mendez",
    role: "Directeur de camping",
    location: "Costa Brava, Espagne",
    text: "Nous avons acheté un écran Hallucine de 6m pour nos soirées cinéma au camping. Les vacanciers adorent ! L'écran résiste parfaitement au vent marin et le gonflage est ultra-rapide. Meilleur investissement de la saison.",
    rating: 5,
    product: "Écran étanche 6m",
  },
  {
    name: "Nathalie Petit",
    role: "Responsable communication",
    location: "Groupe Accor, Paris",
    text: "Pour le lancement de notre nouvelle marque, nous avions besoin d'un écran géant de 20m. L'équipe Hallucine a été formidable : livraison rapide, support technique impeccable, et un résultat visuel époustouflant.",
    rating: 5,
    product: "Écran soufflerie 20m",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-warm fill-warm" : "text-white/20"}`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Show 1 on mobile, 2 on md, 3 on lg
  const visibleCount = typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : typeof window !== "undefined" && window.innerWidth >= 768 ? 2 : 1;
  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay, maxIndex]);

  const goTo = (index: number) => {
    setAutoplay(false);
    setCurrent(Math.max(0, Math.min(index, maxIndex)));
  };

  return (
    <section id="temoignages" className="relative py-28 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.14_0.02_260)] to-transparent" />

      <div ref={ref} className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.3em] uppercase">Témoignages</span>
            <div className="w-12 h-[1px] bg-gold" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ce que disent <span className="text-gradient-gold text-glow-gold-intense">nos clients</span>
          </h2>
          <p className="text-white/75 text-lg mt-4 max-w-2xl mx-auto">
            Des professionnels de l'événementiel, de l'hôtellerie et des collectivités nous font confiance depuis plus de 25 ans.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            aria-label="Témoignage précédent"
            className="absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-warm hover:border-warm/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            disabled={current >= maxIndex}
            aria-label="Témoignage suivant"
            className="absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-warm hover:border-warm/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${current * (100 / visibleCount + (6 * 4) / visibleCount)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ width: `${(testimonials.length / visibleCount) * 100}%` }}
            >
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                  className="flex-shrink-0"
                  style={{ width: `${100 / testimonials.length * visibleCount - 2}%` }}
                >
                  <div className="h-full bg-[oklch(0.16_0.015_260)] border border-white/8 rounded-xl p-8 hover:border-warm/20 transition-all duration-500 group">
                    {/* Quote icon */}
                    <Quote className="w-8 h-8 text-warm/30 mb-4 group-hover:text-warm/50 transition-colors" />

                    {/* Rating */}
                    <StarRating rating={t.rating} />

                    {/* Text */}
                    <p className="text-white/80 text-base leading-relaxed mt-4 mb-6 italic">
                      "{t.text}"
                    </p>

                    {/* Author */}
                    <div className="border-t border-white/8 pt-4 mt-auto">
                      {/* Avatar initials */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-warm/30 to-warm/10 flex items-center justify-center text-warm font-bold text-sm">
                          {t.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{t.name}</p>
                          <p className="text-white/65 text-sm">{t.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-white/65 text-sm">{t.location}</span>
                        <span className="text-warm/70 text-sm font-medium">{t.product}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Aller au témoignage ${i + 1}`}
                className="relative flex items-center justify-center min-w-[44px] min-h-[44px]"
              >
                <span className={`block rounded-full transition-all duration-300 ${
                  i === current ? "bg-warm w-6 h-2" : "bg-white/20 hover:bg-white/40 w-2 h-2"
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "500+", label: "Clients satisfaits" },
            { value: "30+", label: "Pays livrés" },
            { value: "25 ans", label: "D'expérience" },
            { value: "98%", label: "Taux de satisfaction" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-lg bg-white/3 border border-white/5">
              <p className="text-2xl lg:text-3xl font-bold text-warm">{stat.value}</p>
              <p className="text-white/70 text-base mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
