/*
 * Hero Section — Design cinématographique premium
 * + Faisceau de projecteur animé (ProjectorBeam)
 * + Particules dorées flottantes (GoldenParticles via tsParticles)
 * + Text glow renforcé sur les titres
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight, Play } from "lucide-react";
import { Link } from "wouter";
import { useRef } from "react";


const HERO_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HWQTHYrijbwFXBld.jpg";

const stats = [
  { value: "30", suffix: " ans", label: "d'expertise" },
  { value: "3×", suffix: "", label: "plus léger" },
  { value: "10", suffix: " ans", label: "de garantie" },
  { value: "24", suffix: "m", label: "écran max" },
];

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex items-end overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 -top-[10%] -bottom-[10%]">
        <img
          src={HERO_IMG}
          alt="Écran de cinéma gonflable géant Hallucine en projection nocturne"
          className="w-full h-full object-cover scale-110"
        />
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.02_260)] via-[oklch(0.10_0.03_260_/_0.5)] to-[oklch(0.12_0.03_260_/_0.3)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.02_260_/_0.85)] via-transparent to-transparent" />
      
      {/* Film grain texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      }} />


      {/* Content */}
      <motion.div style={{ opacity, zIndex: 5 }} className="relative container pb-32 pt-48">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-12 h-[1px] bg-gold" />
            <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Fabricant français depuis 1995</span>
          </motion.div>

          {/* 💫 Citation principale — slogan accrocheur */}
          <motion.blockquote
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-10 max-w-4xl"
          >
            <p className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white font-serif italic">
              «&nbsp;Nos concurrents n'ont jamais eu, à 3h du matin, à devoir replier un écran pour aller se coucher. <span className="text-gradient-gold text-glow-gold-intense">Nous, si.</span> C'est pour cela que nous avons tout repensé.&nbsp;»
            </p>
          </motion.blockquote>

          {/* Sous-titre — L'écran de cinéma le plus léger au monde */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide uppercase text-white/70 mb-12"
          >
            L'écran de cinéma <span className="text-gradient-gold">le plus léger</span> au monde
          </motion.h1>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-5"
          >
            <Link
              href="/contactez-nous"
              className="group flex items-center gap-3 px-8 py-4 bg-gold text-navy-deep font-semibold text-base hover:bg-gold-light transition-all duration-500 glow-gold"
            >
              Demander un devis gratuit
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/ecran-gonflable"
              className="group flex items-center gap-3 px-8 py-4 border border-white/15 text-white/90 font-medium text-base hover:border-gold/40 hover:text-gold transition-all duration-500"
            >
              <Play className="w-4 h-4" />
              Découvrir nos écrans
            </Link>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/[0.06]"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center py-6 px-4">
              <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {stat.value}
                <span className="text-gold">{stat.suffix}</span>
              </div>
              <div className="text-[11px] text-white/35 mt-2 tracking-[0.2em] uppercase font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/25 tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 text-white/25" />
      </motion.div>
    </section>
  );
}
