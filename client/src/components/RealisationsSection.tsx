/*
 * Section Réalisations — Galerie masonry premium
 * Photos variées de toutes les catégories
 */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net";
const photos = [
  {
    src: `${CDN}/manus-storage/eEXwXGCYYCdjehRy_750w_2fcfdd0a.webp`,
    srcSet: `${CDN}/manus-storage/eEXwXGCYYCdjehRy_400w_f66b51b5.webp 400w, ${CDN}/manus-storage/eEXwXGCYYCdjehRy_750w_2fcfdd0a.webp 750w`,
    alt: "Spectaculaire projection nocturne sur un écran de cinéma gonflable de 24m par Hallucine",
    caption: "Écran 24m — Soufflerie",
    span: "col-span-2 row-span-2",
  },
  {
    src: `${CDN}/manus-storage/IzUUAouVxqDCjGMh_400w_fdd9abd9.webp`,
    srcSet: `${CDN}/manus-storage/IzUUAouVxqDCjGMh_400w_fdd9abd9.webp 400w, ${CDN}/manus-storage/IzUUAouVxqDCjGMh_583w_9b482064.webp 583w`,
    alt: "Écran de cinéma étanche de 5m par Hallucine, installé au prestigieux hôtel Ritz pour un événement privé",
    caption: "Écran étanche 5m — Ritz",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ATgcmLVpJkJrnbvK.webp",
    alt: "Impressionnant écran de cinéma gonflable de 13m par Hallucine, installé en extérieur devant des arènes historiques",
    caption: "Écran 13m — Arènes",
    span: "col-span-2 row-span-1",
  },
  {
    src: `${CDN}/manus-storage/oWJlmXMcJLDivNJi_400w_ba111ac1.webp`,
    srcSet: `${CDN}/manus-storage/oWJlmXMcJLDivNJi_400w_ba111ac1.webp 400w, ${CDN}/manus-storage/oWJlmXMcJLDivNJi_800w_b9dd28d8.webp 800w, ${CDN}/manus-storage/oWJlmXMcJLDivNJi_1200w_1063eff1.webp 1200w`,
    alt: "Écran de cinéma étanche de 8m par Hallucine, pour une projection en plein air au bord d'une piscine",
    caption: "Écran étanche 8m — Piscine",
    span: "col-span-1 row-span-1",
  },
  {
    src: `${CDN}/manus-storage/QrzDmlUFMVVVZvMK_400w_a2cb21df.webp`,
    srcSet: `${CDN}/manus-storage/QrzDmlUFMVVVZvMK_400w_a2cb21df.webp 400w, ${CDN}/manus-storage/QrzDmlUFMVVVZvMK_800w_7669ed4f.webp 800w, ${CDN}/manus-storage/QrzDmlUFMVVVZvMK_1000w_12114450.webp 1000w`,
    alt: "Fauteuil gonflable design et confortable par Hallucine, mobilier événementiel moderne et personnalisable",
    caption: "Mobilier gonflable",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/VWHPufHDlQZZyhyU.webp",
    alt: "Projection cinématographique en plein air sur un écran gonflable de 15m par Hallucine, ambiance nocturne magique",
    caption: "Écran 15m — Soufflerie",
    span: "col-span-2 row-span-2",
  },
  {
    src: `${CDN}/manus-storage/fJeTTYibNfXyTkKj_400w_d5eaf2df.webp`,
    srcSet: `${CDN}/manus-storage/fJeTTYibNfXyTkKj_400w_d5eaf2df.webp 400w, ${CDN}/manus-storage/fJeTTYibNfXyTkKj_800w_85b58189.webp 800w, ${CDN}/manus-storage/fJeTTYibNfXyTkKj_1000w_4c479221.webp 1000w`,
    alt: "Petit écran de cinéma étanche de 4m par Hallucine, idéal pour des projections intimistes à Paris",
    caption: "Écran étanche 4m — Paris",
    span: "col-span-1 row-span-1",
  },
  {
    src: `${CDN}/manus-storage/WQZRfvSatJJIbSob_400w_4e9e4863.webp`,
    srcSet: `${CDN}/manus-storage/WQZRfvSatJJIbSob_400w_4e9e4863.webp 400w, ${CDN}/manus-storage/WQZRfvSatJJIbSob_800w_9d995c83.webp 800w, ${CDN}/manus-storage/WQZRfvSatJJIbSob_1000w_16f69fd3.webp 1000w`,
    alt: "Écran de cinéma gonflable de 10m par Hallucine pour un événement de cinéma drive-in",
    caption: "Écran 10m — Drive-in",
    span: "col-span-1 row-span-1",
  },
  {
    src: `${CDN}/manus-storage/rdxDXYKJQikGkftN_400w_96c235cf.webp`,
    srcSet: `${CDN}/manus-storage/rdxDXYKJQikGkftN_400w_96c235cf.webp 400w, ${CDN}/manus-storage/rdxDXYKJQikGkftN_800w_5db01a16.webp 800w, ${CDN}/manus-storage/rdxDXYKJQikGkftN_1200w_8fe1946e.webp 1200w`,
    alt: "Écran de cinéma gonflable noir de 17m par Hallucine, pour un contraste d'image optimal en projection",
    caption: "Écran 17m — Grand format",
    span: "col-span-1 row-span-1",
  },
  {
    src: `${CDN}/manus-storage/yuLqkYzSuwxDVzhu_400w_e737519c.webp`,
    srcSet: `${CDN}/manus-storage/yuLqkYzSuwxDVzhu_400w_e737519c.webp 400w, ${CDN}/manus-storage/yuLqkYzSuwxDVzhu_800w_26b5ffc2.webp 800w, ${CDN}/manus-storage/yuLqkYzSuwxDVzhu_1000w_19c0670b.webp 1000w`,
    alt: "Arche gonflable Hallucine servant d'entrée immersive pour une projection de film en plein air",
    caption: "Arche — Entrée projection",
    span: "col-span-1 row-span-1",
  },
  {
    src: `${CDN}/manus-storage/vbfbnQBVCUGrWUOw_400w_ef8de5f2.webp`,
    srcSet: `${CDN}/manus-storage/vbfbnQBVCUGrWUOw_400w_ef8de5f2.webp 400w, ${CDN}/manus-storage/vbfbnQBVCUGrWUOw_800w_9dc64352.webp 800w, ${CDN}/manus-storage/vbfbnQBVCUGrWUOw_1000w_58888e85.webp 1000w`,
    alt: "Arche gonflable 'Cinéma sous les étoiles' par Hallucine, pour une expérience cinématographique en plein air",
    caption: "Arche — Cinéma sous les étoiles",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/JbCcWecqyORanBUN.webp",
    alt: "Écran de cinéma gonflable Hallucine au Festival International du Film de Constantine, Algérie",
    caption: "Festival du Film — Constantine",
    span: "col-span-2 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CDNpIhXcFMAttrYN.webp",
    alt: "Écran de cinéma gonflable Hallucine installé sur la plage en Nouvelle-Calédonie",
    caption: "Écran plage — Nouvelle-Calédonie",
    span: "col-span-1 row-span-1",
  },
  {
    src: `${CDN}/manus-storage/IDOBtJWEzrtZapWQ_400w_fa5d6b5a.webp`,
    srcSet: `${CDN}/manus-storage/IDOBtJWEzrtZapWQ_400w_fa5d6b5a.webp 400w, ${CDN}/manus-storage/IDOBtJWEzrtZapWQ_800w_37e2bce7.webp 800w, ${CDN}/manus-storage/IDOBtJWEzrtZapWQ_1000w_0cd95b8a.webp 1000w`,
    alt: "Livraison d'un écran Hallucine au Tchad, aventure logistique avec des chameaux",
    caption: "Aventure logistique — Tchad",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/BCqmRBwuOdZocfQG.webp",
    alt: "Projection nocturne Hyundai sur écran gonflable Hallucine à Ostende, Belgique",
    caption: "Événement Hyundai — Ostende, Belgique",
    span: "col-span-2 row-span-1",
  },
];

export default function RealisationsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { t } = useTranslation("home");

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
            <span className="text-gold text-sm font-semibold tracking-[0.3em] uppercase">{t("realisations.section_label")}</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
            {t("realisations.title_before")}<br />
            <span className="text-gradient-gold text-glow-gold-intense">{t("realisations.title_highlight")}</span>
          </h2>
          <p className="text-white/75 text-lg mt-6 max-w-xl leading-relaxed">
            {t("realisations.section_desc")}
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
                srcSet={photo.srcSet}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                width={600} height={400}
                decoding="async" />
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
            aria-label={t("realisations.close_photo")}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={photos[lightbox].src}
            alt={photos[lightbox].alt}
            className="max-w-full max-h-[85vh] object-contain"
            width={1200} height={800}
          decoding="async" loading="lazy" />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <p className="text-white/70 text-sm font-medium">{photos[lightbox].caption}</p>
          </div>
        </motion.div>
      )}
    </section>
  );
}
