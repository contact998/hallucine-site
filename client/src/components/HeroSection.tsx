/*
 * Design: "Nuit Étoilée" – Hero plein écran immersif
 * Image de cinéma en plein air nocturne en fond
 * Titre dramatique, sous-titre, CTA doré
 * Chiffres clés animés
 */
import { motion } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";

const HERO_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/7Bcdpi5Y0PpsE2J1vijXRa/sandbox/CTa0TN55Kezk7Ad6MSpJ8X-img-1_1771086728000_na1fn_aGVyby1jaW5lbWEtcGxlaW4tYWly.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvN0JjZHBpNVkwUHBzRTJKMXZpalhSYS9zYW5kYm94L0NUYTBUTjU1S2V6azdBZDZNU3BKOFgtaW1nLTFfMTc3MTA4NjcyODAwMF9uYTFmbl9hR1Z5YnkxamFXNWxiV0V0Y0d4bGFXNHRZV2x5LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=BeRMorQXTBnoM8UDxB0jnnhEXJXwFMvNzeW-vTqK9dLfBUK9cfo2I7Y3KAcUug8tnOovgOBerK1DAf5qPg~3cAjWM6NjoNrYAyt~1W6bqra9HEgYrw8KTeobQW5xFYyYOBP03xrxE1ul5DG11bu0jIFKBQ5Dc1x0nprmExCJRJ5~mA4JBjMuUQQ~ivBZGX-BgCLESdxwa5CTU-nohhWXWUFxPCDbvt~mWwG0ET52My1LJLvSSUb79gvQv2q7-IEK2oOUXPDeu4zjVFfb-ft3UpHOUwwD2IpJ3zj2fAVNaGjQlHL8jBxpddcXvpoZAjSsyCG0gkuueJDcPCfIsEF33w__";

const stats = [
  { value: "30", suffix: " ans", label: "d'expertise" },
  { value: "3×", suffix: "", label: "plus léger" },
  { value: "10", suffix: " ans", label: "de garantie" },
  { value: "24", suffix: "m", label: "écran max" },
];

export default function HeroSection() {
  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToProducts = () => {
    const el = document.querySelector("#produits");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Cinéma en plein air avec écran gonflable Hallucine"
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
            <button
              onClick={scrollToContact}
              className="px-8 py-4 bg-gold text-navy-deep font-semibold text-base rounded-sm hover:bg-gold-light transition-all duration-300 glow-gold"
            >
              Demander un devis gratuit
            </button>
            <button
              onClick={scrollToProducts}
              className="flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-medium text-base rounded-sm hover:border-gold/50 hover:text-gold transition-all duration-300"
            >
              <Play className="w-4 h-4" />
              Découvrir nos écrans
            </button>
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
