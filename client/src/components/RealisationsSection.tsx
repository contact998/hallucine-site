/*
 * Section Réalisations — Galerie masonry premium
 * Images chargées depuis media_library (category: "realisations")
 * Fallback automatique sur les URLs hardcodées si la DB ne répond pas
 */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaByPage } from "@/hooks/useMediaByCategory";
import Lightbox from "@/components/Lightbox";

// ─── Fallback hardcodé — affiché si la DB est indisponible ───────────────────
// Ne jamais supprimer ce tableau : c'est le filet de sécurité.

const FALLBACK_PHOTOS = [
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/eEXwXGCYYCdjehRy.webp",
    alt: "Spectaculaire projection nocturne sur un écran de cinéma gonflable de 24m par Hallucine",
    caption: "Écran 24m — Soufflerie",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/IzUUAouVxqDCjGMh.webp",
    alt: "Écran de cinéma étanche de 5m par Hallucine, installé au prestigieux hôtel Ritz pour un événement privé",
    caption: "Écran étanche 5m — Ritz",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ATgcmLVpJkJrnbvK.webp",
    alt: "Impressionnant écran de cinéma gonflable de 13m par Hallucine, installé en extérieur devant des arènes historiques",
    caption: "Écran 13m — Arènes",
    span: "col-span-2 row-span-1",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/oWJlmXMcJLDivNJi.webp",
    alt: "Écran de cinéma étanche de 8m par Hallucine, pour une projection en plein air au bord d'une piscine",
    caption: "Écran étanche 8m — Piscine",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/QrzDmlUFMVVVZvMK.webp",
    alt: "Fauteuil gonflable design et confortable par Hallucine, mobilier événementiel moderne et personnalisable",
    caption: "Mobilier gonflable",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/VWHPufHDlQZZyhyU.webp",
    alt: "Projection cinématographique en plein air sur un écran gonflable de 15m par Hallucine, ambiance nocturne magique",
    caption: "Écran 15m — Soufflerie",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/fJeTTYibNfXyTkKj.webp",
    alt: "Petit écran de cinéma étanche de 4m par Hallucine, idéal pour des projections intimistes à Paris",
    caption: "Écran étanche 4m — Paris",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/1779595463304-e2eb8155e2c1-ecran-cinema-drive-in-gonflable-17m-hallucine.webp",
    alt: "Écran de cinéma gonflable Hallucine 17m pour drive-in — projection plein air grand format",
    caption: "Écran 17m — Drive-in",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/rdxDXYKJQikGkftN.webp",
    alt: "Écran de cinéma gonflable noir de 17m par Hallucine, pour un contraste d'image optimal en projection",
    caption: "Écran 17m — Grand format",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/yuLqkYzSuwxDVzhu.webp",
    alt: "Arche gonflable Hallucine servant d'entrée immersive pour une projection de film en plein air",
    caption: "Arche — Entrée projection",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/JbCcWecqyORanBUN.webp",
    alt: "Écran de cinéma gonflable Hallucine au Festival International du Film de Constantine, Algérie",
    caption: "Festival du Film — Constantine",
    span: "col-span-2 row-span-1",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/CDNpIhXcFMAttrYN.webp",
    alt: "Écran de cinéma gonflable Hallucine installé sur la plage en Nouvelle-Calédonie",
    caption: "Écran plage — Nouvelle-Calédonie",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/IDOBtJWEzrtZapWQ.webp",
    alt: "Livraison d'un écran Hallucine au Tchad, aventure logistique avec des chameaux",
    caption: "Aventure logistique — Tchad",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/BCqmRBwuOdZocfQG.webp",
    alt: "Projection nocturne Hyundai sur écran gonflable Hallucine à Ostende, Belgique",
    caption: "Événement Hyundai — Ostende, Belgique",
    span: "col-span-2 row-span-1",
  },
];

// ─── Composant ────────────────────────────────────────────────────────────────

export default function RealisationsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { t } = useTranslation("home");

  // Charger les images depuis la DB avec fallback intégré
  const dbImages = useMediaByPage("accueil", "realisations", FALLBACK_PHOTOS);

  const photos = dbImages.map((img) => ({
    src:     img.src,
    alt:     img.alt,
    caption: img.title ?? "",
  }));

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
              key={photo.src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
              className="group relative overflow-hidden cursor-pointer"
              onClick={() => setLightbox(i)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                width={600}
                height={400}
                decoding="async"
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
        <Lightbox
          src={photos[lightbox].src}
          alt={photos[lightbox].alt}
          caption={photos[lightbox].caption}
          onClose={() => setLightbox(null)}
          closeLabel={t("realisations.close_photo")}
          onPrev={lightbox > 0 ? () => setLightbox(lightbox - 1) : undefined}
          onNext={lightbox < photos.length - 1 ? () => setLightbox(lightbox + 1) : undefined}
        />
      )}
    </section>
  );
}
