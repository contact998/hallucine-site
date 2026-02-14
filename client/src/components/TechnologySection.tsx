/*
 * Design: "Nuit Étoilée" – Section Technologie
 * Comparatif poids Hallucine vs concurrence
 * Histoire du tissu d'airbag automobile
 * Image macro du tissu technique
 */
import { motion } from "framer-motion";
import { Scale, Zap, ShieldCheck, Award } from "lucide-react";

const TISSU_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/7Bcdpi5Y0PpsE2J1vijXRa/sandbox/CTa0TN55Kezk7Ad6MSpJ8X-img-3_1771086728000_na1fn_dGlzc3UtdGVjaG5pcXVl.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvN0JjZHBpNVkwUHBzRTJKMXZpalhSYS9zYW5kYm94L0NUYTBUTjU1S2V6azdBZDZNU3BKOFgtaW1nLTNfMTc3MTA4NjcyODAwMF9uYTFmbl9kR2x6YzNVdGRHVmphRzVwY1hWbC5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=fi2sON3If1oXGLhHd452Ch~0hbcVAlF-3nFij~FliqyBVMK0NIao4uhOXPONSrd7p6PEE8nWHX~ZdzuKdQyuEh3k3hl5dGsKCGJWro3UjL~x-EBZwwmi29uZ7~K0sjJFkcvO5y9jq0UGVfR3PE8Wu8xnXWeyNdv-3HX6BgGK4YGqwHHNNQozLWMVmz7IinHax8a-lpHnYSinhy3jNLGBPr6OnRODnMgi6zuPUo1dQOEB-8oCCE6uiFC1S--4mmDbaCEQAOdzaKsiBYICXEY-gLoQTIAdKs6-CgbUHEDIV9hCW64lc~7~nDo0zJ~zZbOPoa8b1qfcfNddaAefap31ow__";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15 },
  }),
};

export default function TechnologySection() {
  return (
    <section id="technologie" className="py-24 md:py-32 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.12_0.04_260_/_0.5)] to-transparent" />

      <div className="container relative">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          custom={0}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Notre technologie</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 leading-tight">
            Le secret des airbags automobiles,<br />
            <span className="text-gradient-gold">au service du cinéma</span>
          </h2>
          <p className="text-white/60 mt-6 text-lg leading-relaxed">
            Quand les constructeurs automobiles nous ont dit que leur tissu était "secret défense", nous ne nous sommes pas découragés. Nous avons trouvé la réponse à Lyon : un polyamide haute ténacité de DuPont de Nemours.
          </p>
        </motion.div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={1}
            className="relative"
          >
            <div className="overflow-hidden rounded-sm">
              <img
                src={TISSU_IMG}
                alt="Tissu technique polyamide haute ténacité utilisé pour les écrans Hallucine"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 md:bottom-6 md:right-6 bg-gold text-navy-deep p-4 md:p-6 rounded-sm shadow-xl">
              <div className="text-3xl md:text-4xl font-bold">3×</div>
              <div className="text-xs md:text-sm font-medium">plus léger</div>
            </div>
          </motion.div>

          {/* Comparison & features */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={2}
          >
            {/* Weight comparison */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-white mb-6">Comparatif de poids — Écran 15m</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Concurrence (bâche camion)</span>
                    <span className="text-white font-semibold">600 kg</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                      className="h-full bg-white/30 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gold font-medium">Hallucine (polyamide)</span>
                    <span className="text-gold font-bold">200 kg</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "33%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature list */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Scale, title: "Ultra-léger", desc: "Polyamide haute ténacité DuPont de Nemours" },
                { icon: Zap, title: "Résistant", desc: "Le même tissu que les airbags automobiles" },
                { icon: ShieldCheck, title: "Garanti 10 ans", desc: "Durabilité éprouvée sur le terrain" },
                { icon: Award, title: "Savoir-faire", desc: "Né dans une voilerie bretonne" },
              ].map((feat, i) => (
                <div key={i} className="flex gap-3">
                  <feat.icon className="w-5 h-5 text-gold mt-1 shrink-0" />
                  <div>
                    <div className="text-white text-sm font-semibold">{feat.title}</div>
                    <div className="text-white/40 text-xs mt-0.5 leading-relaxed">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
