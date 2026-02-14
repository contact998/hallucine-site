/*
 * Design: "Nuit Étoilée" – Section Réalisations
 * Galerie de photos réelles du client
 * Grille asymétrique avec hover effects
 */
import { motion } from "framer-motion";

const photos = [
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/PGaRdZUncWXjznrw.JPG",
    alt: "Écran gonflable Hallucine - Vue aérienne d'un événement en plein air",
    caption: "Événement en plein air",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UjFqdXoLutZxgPuy.JPG",
    alt: "Écran gonflable Hallucine - Vue rapprochée de l'écran",
    caption: "Écran gonflable en action",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/LPVfubaILVbKKVMa.jpg",
    alt: "Équipe technique Hallucine avec projecteur",
    caption: "Notre équipe technique",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/IbNUEdhyhiTLcBgz.JPG",
    alt: "Projection nocturne avec écran Hallucine",
    caption: "Projection nocturne",
    span: "col-span-2 row-span-1",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1 },
  }),
};

export default function RealisationsSection() {
  return (
    <section id="realisations" className="py-24 md:py-32 relative">
      <div className="container">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          custom={0}
          className="max-w-2xl mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Nos réalisations</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 leading-tight">
            Ils nous font confiance<br />
            <span className="text-gradient-gold">dans le monde entier</span>
          </h2>
          <p className="text-white/60 mt-4 text-lg leading-relaxed">
            Des festivals aux événements corporate, des plages aux stades, nos écrans transforment chaque lieu en salle de cinéma.
          </p>
        </motion.div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              custom={i + 1}
              className={`${photo.span} group relative overflow-hidden rounded-sm border border-white/10`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-white text-sm font-medium">{photo.caption}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
