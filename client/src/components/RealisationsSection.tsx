/*
 * Design: "Nuit Étoilée" – Section Réalisations / Galerie
 * Photos variées de TOUTES les catégories : étanches, soufflerie, tentes, accessoires
 * Aucune répétition, chaque photo est unique
 */
import { motion } from "framer-motion";

const photos = [
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/KzXxmgVsjMoEdlML.jpg",
    alt: "Écran soufflerie 24m - projection nocturne spectaculaire",
    caption: "Écran 24m — Soufflerie",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CzprNCGHiOGRIkTg.jpg",
    alt: "Écran étanche 5m installé au Ritz - événement privé",
    caption: "Écran étanche 5m — Ritz",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/YqpLPgGtuwNJbHEB.png",
    alt: "Tente gonflable Hallucine - technologie étanche",
    caption: "Tente gonflable",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bWqLOjfHSsVoXNHz.jpg",
    alt: "Écran soufflerie 13m devant les arènes - événement culturel",
    caption: "Écran 13m — Arènes",
    span: "col-span-2 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/VEbmfwItAbfpcPkZ.jpg",
    alt: "Écran étanche 8m au bord d'une piscine - soirée privée",
    caption: "Écran étanche 8m — Piscine",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bejqCXUcdKFhPUrA.jpg",
    alt: "Fauteuil gonflable Hallucine - mobilier événementiel",
    caption: "Mobilier gonflable",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/xEbWQMioMZQLtuDK.jpg",
    alt: "Écran soufflerie 15m - projection nocturne en plein air",
    caption: "Écran 15m — Soufflerie",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UsYUSDaqdvtdYUuR.jpg",
    alt: "Écran étanche 4m à Paris - événement urbain",
    caption: "Écran étanche 4m — Paris",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/wQxSrNHWpcNFqINL.jpg",
    alt: "Écran soufflerie 10m - cinéma en plein air drive-in",
    caption: "Écran 10m — Drive-in",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ozhVXCxOcuYoBREY.png",
    alt: "Tente gonflable Hallucine - modèle événementiel",
    caption: "Tente événementielle",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CAeHAHuCCqWzSkLI.jpg",
    alt: "Écran soufflerie 17m noir - grand format",
    caption: "Écran 17m — Grand format",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HGkkpfyaxsgmapYw.jpg",
    alt: "Écran étanche 5m vue éclatée - détail technique",
    caption: "Écran étanche — Vue éclatée",
    span: "col-span-2 row-span-1",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08 },
  }),
};

export default function RealisationsSection() {
  return (
    <section id="realisations" className="py-24 md:py-32 relative">
      <div className="container">
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
            Des festivals aux événements corporate, des plages aux stades, nos écrans, tentes et mobilier transforment chaque lieu en espace unique.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[200px]">
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
                loading="lazy"
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
