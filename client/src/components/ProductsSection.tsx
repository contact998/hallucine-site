/*
 * Design: "Nuit Étoilée" – Section Produits
 * Deux gammes technologiques : Airtight (2-8m) et Soufflerie permanente (10-24m)
 * Écrans = produit phare, tentes et mobilier en secondaire
 * Photos réelles du client
 */
import { motion } from "framer-motion";
import { Wind, Shield, Feather, Ruler, ChevronRight } from "lucide-react";

const ECRAN_REAL_1 = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UjFqdXoLutZxgPuy.JPG";
const ECRAN_REAL_2 = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/PGaRdZUncWXjznrw.JPG";
const ECRAN_DAY = "https://private-us-east-1.manuscdn.com/sessionFile/7Bcdpi5Y0PpsE2J1vijXRa/sandbox/CTa0TN55Kezk7Ad6MSpJ8X-img-5_1771086732000_na1fn_ZWNyYW4tZ29uZmxhYmxlLWpvdXI.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvN0JjZHBpNVkwUHBzRTJKMXZpalhSYS9zYW5kYm94L0NUYTBUTjU1S2V6azdBZDZNU3BKOFgtaW1nLTVfMTc3MTA4NjczMjAwMF9uYTFmbl9aV055WVc0dFoyOXVabXhoWW14bExXcHZkWEkuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=fjvjMiwdUjXgUqKoY0XWuvXzvlQWCbN0wHltlYHpsZWf4CzzoJjHLnpf0SeJRFhNbdiG7ZO~53-TPqVFiq9kZYdAnaRnhDdIdpCGnWRdSvvZLhCkihLNJleMavFBNKQC440yl5jQBywdXgi6b4vlFZCpBbdbd3qrwDxQZMPteIPeCoDVmA7aaKo3xjzSt0QX0niSxlP1P3GaV6Cp26YUcmVw6jvWoRa32xjgrerq~NG2VD6TL7kSaFJZfJu89yx39rXgs4DVUdlllSvkRDePXBz7AiYsC~x3PBjkjGGm4Wv6aNy8lPSfQOi0tNKWXpTlad6c2n16Jtb~Rmf~9t3rIA__";

const scrollToContact = () => {
  const el = document.querySelector("#contact");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15 },
  }),
};

export default function ProductsSection() {
  return (
    <section id="produits" className="py-24 md:py-32 relative">
      {/* Section header */}
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          custom={0}
          className="max-w-2xl mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Nos produits</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 leading-tight">
            Des écrans conçus par ceux qui les utilisent
          </h2>
          <p className="text-white/60 mt-4 text-lg leading-relaxed">
            Deux technologies, une même obsession : la légèreté et la fiabilité. Chaque écran Hallucine est le fruit de 30 ans d'expérience terrain.
          </p>
        </motion.div>

        {/* Two product families */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gamme Airtight */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={1}
            className="group relative overflow-hidden rounded-sm border border-white/10 bg-white/[0.03]"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={ECRAN_DAY}
                alt="Écran gonflable Airtight Hallucine - 2 à 8 mètres"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-gold text-navy-deep text-xs font-bold tracking-wider uppercase rounded-sm">
                Technologie Airtight
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Gamme Airtight — 2m à 8m</h3>
              <p className="text-white/50 text-sm mb-6 font-serif italic">
                Inspirée du kitesurf. Étanche, autonome, sans soufflerie.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">100% étanche</div>
                    <div className="text-white/40 text-xs">Chambre à air scellée</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Feather className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">Ultra-léger</div>
                    <div className="text-white/40 text-xs">3× plus léger que la concurrence</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wind className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">Sans soufflerie</div>
                    <div className="text-white/40 text-xs">Silencieux, autonome</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ruler className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">2m à 8m</div>
                    <div className="text-white/40 text-xs">Toutes tailles disponibles</div>
                  </div>
                </div>
              </div>
              <button
                onClick={scrollToContact}
                className="flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all duration-300"
              >
                Demander un devis <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Gamme Soufflerie */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={2}
            className="group relative overflow-hidden rounded-sm border border-white/10 bg-white/[0.03]"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={ECRAN_REAL_2}
                alt="Écran gonflable géant Hallucine - 10 à 24 mètres"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-white text-navy-deep text-xs font-bold tracking-wider uppercase rounded-sm">
                Soufflerie permanente
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Gamme Pro — 10m à 24m</h3>
              <p className="text-white/50 text-sm mb-6 font-serif italic">
                Tissu d'airbag automobile. Né dans une voilerie bretonne.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">Garanti 10 ans</div>
                    <div className="text-white/40 text-xs">Polyamide haute ténacité</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Feather className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">200 kg max</div>
                    <div className="text-white/40 text-xs">vs 600 kg chez la concurrence</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wind className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">Sac à voile</div>
                    <div className="text-white/40 text-xs">Rangement sans pliage</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ruler className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">10m à 24m</div>
                    <div className="text-white/40 text-xs">Événements majeurs</div>
                  </div>
                </div>
              </div>
              <button
                onClick={scrollToContact}
                className="flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all duration-300"
              >
                Demander un devis <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Secondary products */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          custom={3}
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          <div className="p-6 border border-white/10 rounded-sm bg-white/[0.02] hover:border-gold/30 transition-colors duration-300">
            <h4 className="text-lg font-semibold text-white mb-2">Tentes gonflables Airtight</h4>
            <p className="text-white/50 text-sm mb-4">
              Même technologie que nos écrans Airtight. Montage en quelques minutes, sans soufflerie permanente. Idéales pour l'événementiel.
            </p>
            <button onClick={scrollToContact} className="text-gold text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              En savoir plus <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 border border-white/10 rounded-sm bg-white/[0.02] hover:border-gold/30 transition-colors duration-300">
            <h4 className="text-lg font-semibold text-white mb-2">Mobilier gonflable Airtight</h4>
            <p className="text-white/50 text-sm mb-4">
              Canapés, fauteuils, comptoirs. Technologie Airtight pour un mobilier événementiel léger, élégant et facile à transporter.
            </p>
            <button onClick={scrollToContact} className="text-gold text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              En savoir plus <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
