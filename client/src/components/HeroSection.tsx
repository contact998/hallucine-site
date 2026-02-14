/*
 * Design: "Nuit Étoilée" – Hero plein écran immersif
 * UNIQUEMENT des photos réelles du client
 * Photo principale : projection nocturne avec foule (IMG20251017191800)
 * Titre dramatique, sous-titre, CTA doré
 * Chiffres clés animés
 */
import { motion } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";
import { Link } from "wouter";

// Photo réelle : projection nocturne avec foule dense devant écran gonflable
const HERO_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/jPYZoxFIkhGeMpkL.jpg";

const stats = [
  { value: "30", suffix: " ans", label: "d'expertise" },
  { value: "3×", suffix: "", label: "plus léger" },
  { value: "10", suffix: " ans", label: "de garantie" },
  { value: "24", suffix: "m", label: "écran max" },
];

export default function HeroSection() {


  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image - VRAIE PHOTO */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Projection cinéma en plein air avec écran gonflable Hallucine - foule nombreuse"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.03_260_/_0.92)] via-[oklch(0.12_0.03_260_/_0.75)] to-[oklch(0.10_0.03_260_/_0.5)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260)] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-sm font-medium tracking-wide">Fabricant français depuis 1995</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
          >
            <span className="text-white">L'écran de cinéma</span>
            <br />
            <span className="text-gradient-gold">le plus léger</span>
            <br />
            <span className="text-white">au monde</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/70 max-w-xl mb-10 font-serif italic leading-relaxed"
          >
            Nos concurrents n'ont jamais eu, à 3h du matin, à devoir replier un écran pour aller se coucher. Nous, si. C'est pour cela que nous avons tout repensé.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/contact"
              className="px-8 py-4 bg-gold text-navy-deep font-semibold text-base rounded-sm hover:bg-gold-light transition-all duration-300 glow-gold inline-block"
            >
              Demander un devis gratuit
            </Link>
            <Link
              href="/ecrans"
              className="flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-medium text-base rounded-sm hover:border-gold/50 hover:text-gold transition-all duration-300"
            >
              <Play className="w-4 h-4" />
              Découvrir nos écrans
            </Link>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/10 p-6 md:p-8 bg-white/5 backdrop-blur-sm rounded-sm border border-white/10"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-gold">
                {stat.value}
                <span className="text-gold/70">{stat.suffix}</span>
              </div>
              <div className="text-sm text-white/50 mt-1 tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-white/40" />
      </motion.div>
    </section>
  );
}
