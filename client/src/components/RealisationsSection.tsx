/*
 * Section Réalisations — Galerie masonry premium
 * Photos variées de toutes les catégories
 */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";

const photos = [
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/KzXxmgVsjMoEdlML.jpg",
    alt: "Spectaculaire projection nocturne sur un écran de cinéma gonflable de 24m par Hallucine",
    caption: "Écran 24m — Soufflerie",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CzprNCGHiOGRIkTg.jpg",
    alt: "Écran de cinéma étanche de 5m par Hallucine, installé au prestigieux hôtel Ritz pour un événement privé",
    caption: "Écran étanche 5m — Ritz",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bWqLOjfHSsVoXNHz.jpg",
    alt: "Impressionnant écran de cinéma gonflable de 13m par Hallucine, installé en extérieur devant des arènes historiques",
    caption: "Écran 13m — Arènes",
    span: "col-span-2 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/VEbmfwItAbfpcPkZ.jpg",
    alt: "Écran de cinéma étanche de 8m par Hallucine, pour une projection en plein air au bord d'une piscine",
    caption: "Écran étanche 8m — Piscine",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bejqCXUcdKFhPUrA.jpg",
    alt: "Fauteuil gonflable design et confortable par Hallucine, mobilier événementiel moderne et personnalisable",
    caption: "Mobilier gonflable",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/xEbWQMioMZQLtuDK.jpg",
    alt: "Projection cinématographique en plein air sur un écran gonflable de 15m par Hallucine, ambiance nocturne magique",
    caption: "Écran 15m — Soufflerie",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UsYUSDaqdvtdYUuR.jpg",
    alt: "Petit écran de cinéma étanche de 4m par Hallucine, idéal pour des projections intimistes à Paris",
    caption: "Écran étanche 4m — Paris",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/wQxSrNHWpcNFqINL.jpg",
    alt: "Écran de cinéma gonflable de 10m par Hallucine pour un événement de cinéma drive-in",
    caption: "Écran 10m — Drive-in",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CAeHAHuCCqWzSkLI.jpg",
    alt: "Écran de cinéma gonflable noir de 17m par Hallucine, pour un contraste d'image optimal en projection",
    caption: "Écran 17m — Grand format",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CZcgjOTtIqUOapyp.jpg",
    alt: "Arche gonflable Hallucine servant d'entrée immersive pour une projection de film en plein air",
    caption: "Arche — Entrée projection",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/msjlSvvcXPPgZNDW.png",
    alt: "Arche gonflable 'Cinéma sous les étoiles' par Hallucine, pour une expérience cinématographique en plein air",
    caption: "Arche — Cinéma sous les étoiles",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/MVZvBrLDWdkcTSBF.jpg",
    alt: "Écran de cinéma gonflable Hallucine au Festival International du Film de Constantine, Algérie",
    caption: "Festival du Film — Constantine",
    span: "col-span-2 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/OnZgEKpgaTstKHyQ.jpg",
    alt: "Écran de cinéma gonflable Hallucine installé sur la plage en Nouvelle-Calédonie",
    caption: "Écran plage — Nouvelle-Calédonie",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/TigVbyzODCBMQuyj.jpg",
    alt: "Livraison d'un écran Hallucine au Tchad, aventure logistique avec des chameaux",
    caption: "Aventure logistique — Tchad",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/eJkfHkUPHYJbXHwS.jpg",
    alt: "Projection nocturne Hyundai sur écran gonflable Hallucine à Ostende, Belgique",
    caption: "Événement Hyundai — Ostende, Belgique",
    span: "col-span-2 row-span-1",
  },
];

export default function RealisationsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="realisations" className="relative py-32 overflow-hidden">
      <div ref={ref} className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.3em] uppercase">Réalisations</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
            Ils nous font confiance<br />
            <span className="text-gradient-gold text-glow-gold-intense">dans le monde entier</span>
          </h2>
          <p className="text-white/75 text-lg mt-6 max-w-xl leading-relaxed">
            Des festivals aux événements corporate, des plages aux stades, nos écrans transforment chaque lieu en expérience unique.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[140px] md:auto-rows-[200px]">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
              className={`${photo.span} group relative overflow-hidden cursor-pointer`}
              onClick={() => setLightbox(i)}
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

      {/* Lightbox */}
      {lightbox !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={photos[lightbox].src}
            alt={photos[lightbox].alt}
            className="max-w-full max-h-[85vh] object-contain"
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <p className="text-white/70 text-sm font-medium">{photos[lightbox].caption}</p>
          </div>
        </motion.div>
      )}
    </section>
  );
}
