/*
 * Design: "Nuit Étoilée" – Section Notre Histoire
 * Timeline narrative du fondateur
 * Kitesurf Hong Kong, forains, voilerie Bretagne, COVID Chine
 * Images générées IA + photos réelles
 */
import { motion } from "framer-motion";

const KITESURF_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/7Bcdpi5Y0PpsE2J1vijXRa/sandbox/CTa0TN55Kezk7Ad6MSpJ8X-img-2_1771086736000_na1fn_a2l0ZXN1cmYtaG9uZ2tvbmc.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvN0JjZHBpNVkwUHBzRTJKMXZpalhSYS9zYW5kYm94L0NUYTBUTjU1S2V6azdBZDZNU3BKOFgtaW1nLTJfMTc3MTA4NjczNjAwMF9uYTFmbl9hMmwwWlhOMWNtWXRhRzl1WjJ0dmJtYy5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ALgDAVmO3J9qVMrh00eJZHBBpIZo4zKNzsdbpbymPE9qAtaK8Ev8dRNa0VRhm3LVgys7I8VyvbSuPowoBJpmZBIrZKhZoILyCkFXW4D28YL5FWIAhzFjnhjBdC1pnJMdokABA9WqFhxDTqPFOUL5z04sCnboic5lgyWr1nw4CgLGxmDJd4qTZRWmfnBRbz1b9-tmRtqVWz5ERo-GYIebIC5OVSRfBIOlnHtuo8Kma8lcLudlwkmRpFtKEXbsKRyYqei0hHc6yuGBGedDd48eXyGPiA76VFfyup6fcEuVCmIW3bDICMgDs-0ZY8Vm~JG6jL5tU2eK7YvCEpd6omhREA__";

const VOILERIE_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/7Bcdpi5Y0PpsE2J1vijXRa/sandbox/CTa0TN55Kezk7Ad6MSpJ8X-img-4_1771086733000_na1fn_ZmFicmljYXRpb24tdm9pbGVyaWU.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvN0JjZHBpNVkwUHBzRTJKMXZpalhSYS9zYW5kYm94L0NUYTBUTjU1S2V6azdBZDZNU3BKOFgtaW1nLTRfMTc3MTA4NjczMzAwMF9uYTFmbl9abUZpY21sallYUnBiMjR0ZG05cGJHVnlhV1UuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=pS8bkzP5gYGtH2VL8XMvJgHCoSBrJ7x6sWKUCkZ6TQ9IYXiMyP-PGhCof8CBP5QDugtwETv~QDu7om4C3q0u-Z0sOac9VHiOiXo3c5r68g9kyj0baE2WZqIqdxDrhxXO-JFgbtgNBgglIV~FBfnu3w-nrz51MjsCG~WyMa00KL0Vfm6qeB9W4okPy5PmFxbx23hoEKOxORFYOsfMXuKm~H2BwyoZEzuLs-BJn8dJcAVLt8il0EMwl~LUYWFzZgS0w9caOTths32fhrw7D~mVVEYERr3Q~BbVWrk-ZFKOgEjvhYSKTaftufcbYfE~SCuNuCDX8PjSoYql2vNREQ~kFw__";

const ECRAN_NIGHT = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/IbNUEdhyhiTLcBgz.JPG";

const timeline = [
  {
    year: "1995",
    title: "L'étincelle — Hong Kong",
    text: "Sur une plage de Hong Kong, un kitesurf attire l'attention. Ses boudins gonflables, légers et résistants, font naître une idée folle : et si on pouvait projeter des films en plein air avec un écran aussi léger qu'une voile ?",
    image: KITESURF_IMG,
    side: "left" as const,
  },
  {
    year: "1996",
    title: "L'école des forains",
    text: "Pour apprendre à monter des structures, direction le village. Les forains, souvent rejetés, acceptent de partager leur savoir. Deux jours d'apprentissage intensif. À la fin : « Maintenant, t'es un vrai forain, tu peux partir en tournée. »",
    image: null,
    side: "right" as const,
  },
  {
    year: "1998",
    title: "La voilerie bretonne",
    text: "À La Trinité-sur-Mer, en Bretagne, une voilerie devient le berceau des premiers écrans. Jean-Christophe, maître voilier, maîtrise les techniques de couture. Ensemble, ils mettent au point un écran révolutionnaire qui tombe dans un sac à voile après chaque projection.",
    image: VOILERIE_IMG,
    side: "left" as const,
  },
  {
    year: "2005",
    title: "Le secret des airbags",
    text: "À Lyon, ancienne capitale du tissu, une enquête mène au secret le mieux gardé de l'automobile : le tissu des airbags. Un polyamide haute ténacité de DuPont de Nemours. Léger, indestructible, parfait.",
    image: null,
    side: "right" as const,
  },
  {
    year: "2020",
    title: "Bloqué en Chine — Le COVID",
    text: "Février 2020, Shenzhen. Le COVID frappe. Impossible de rentrer. Plutôt que de ne rien faire, inscription à l'université pour apprendre le chinois. La Chine devient une seconde maison, et une usine dans le Dongguan devient un partenaire et un ami.",
    image: null,
    side: "left" as const,
  },
  {
    year: "Aujourd'hui",
    title: "30 ans d'innovation",
    text: "Depuis la Chine, avec une usine partenaire dans le Dongguan, Hallucine continue sa mission : faire connaître ses écrans au plus large public. De la Bretagne à Shenzhen, l'aventure continue.",
    image: ECRAN_NIGHT,
    side: "right" as const,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function StorySection() {
  return (
    <section id="histoire" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

      <div className="container relative">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Notre histoire</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 leading-tight">
            D'une plage de Hong Kong<br />
            <span className="text-gradient-gold">au monde entier</span>
          </h2>
          <p className="text-white/60 mt-6 text-lg leading-relaxed font-serif italic">
            « Il faut avouer que je suis un peu feignant. » Mais cette paresse apparente cache 30 ans d'une persévérance acharnée, de Lyon à Shenzhen, en passant par la Bretagne et la Tunisie.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto space-y-16 md:space-y-24">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUp}
              className={`relative flex flex-col ${
                item.side === "right" ? "md:flex-row-reverse" : "md:flex-row"
              } gap-8 md:gap-12 items-center`}
            >
              {/* Year badge */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 z-10 hidden md:block">
                <div className="w-4 h-4 rounded-full bg-gold border-4 border-[oklch(0.14_0.03_260)] shadow-lg shadow-gold/30" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/20 rounded-sm mb-4">
                  <span className="text-gold text-sm font-bold">{item.year}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.text}</p>
              </div>

              {/* Image (if available) */}
              {item.image && (
                <div className="flex-1 w-full">
                  <div className="overflow-hidden rounded-sm border border-white/10">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 md:h-72 object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
