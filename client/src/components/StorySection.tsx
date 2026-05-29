/*
 * Section Notre Histoire — Layout damier (texte/image alternés)
 * Refactorisé avec i18n
 */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Lightbox from "@/components/Lightbox";
import { useMediaByPage } from "@/hooks/useMediaByCategory";
import type { MediaImage } from "@/hooks/useMediaByCategory";

// Fallbacks — ordre identique à CHAPTER_IMAGES
const FALLBACK_HISTOIRE: MediaImage[] = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/1779578749911-c9425a005493-ecran-8-m-cadre-aluminium.jpg", alt: "Écran 8m cadre aluminium" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/1779578888369-951ff08bc2f1-ecran-structure-1-1.jpg", alt: "Écran structure école foraine" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/1779584723959-a9169ab7bfc6-histoire-ecran-anglais.jpg", alt: "Erreur fatale écran anglais" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/1779587607712-ce2b14189c08-ecran-cinema-gonflable-voilerie-bretonne.webp", alt: "Écran cinéma gonflable voilerie bretonne" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/1779587893638-07ef453d5255-kitesurf-hong-kong-inspiration-ecran-gonflable.webp", alt: "Kitesurf Hong Kong inspiration écran gonflable" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/1779587896624-615d7348493d-vue-eclatee-ecran-cinema-gonflable-etanche-tissu-airbag.webp", alt: "Vue éclatée écran gonflable étanche tissu airbag" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/1779587898704-f934a4160b12-ecran-cinema-gonflable-etanche-5m-6m-hallucine.webp", alt: "Écran cinéma gonflable étanche 5m 6m Hallucine" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/1779587900924-b22ae92f259c-hallucine-shenzhen-covid-fabrication-ecran.webp", alt: "Hallucine Shenzhen Covid fabrication écran" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/1779587902974-6a126291762f-trois-ecrans-cinema-gonflables-hallucine-innovation.webp", alt: "Trois écrans cinéma gonflables Hallucine innovation" },
];

// Métadonnées de disposition — indépendantes de l'URL de l'image
const CHAPTER_LAYOUT: { smallImage?: boolean; extraSmall?: boolean; containImage?: boolean }[] = [
  {},
  {},
  {},
  {},
  { smallImage: true, extraSmall: true },
  { smallImage: true },
  {},
  {},
  { containImage: true },
];

const CHAPTER_KEYS = ["ch1992", "ch1993", "ch1994", "ch1995", "ch2004", "ch2005", "ch2010", "ch2020", "chToday"];

export default function StorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const { t } = useTranslation("home");

  const histoireImages = useMediaByPage("accueil", "histoire", FALLBACK_HISTOIRE);

  // Reconstruire CHAPTER_IMAGES depuis la DB (fallback sur les URLs hardcodées)
  const CHAPTER_IMAGES = CHAPTER_LAYOUT.map((layout, i) => ({
    ...layout,
    image: histoireImages[i]?.src ?? FALLBACK_HISTOIRE[i]?.src ?? null,
  }));

  // Liste plate des chapitres ayant une image (pour la navigation prev/next dans la lightbox)
  const lightboxImages = CHAPTER_KEYS
    .map((key, i) => ({ key, img: CHAPTER_IMAGES[i] }))
    .filter((c) => !!c.img.image)
    .map((c) => ({
      src: c.img.image!,
      alt: t(`story.${c.key}_alt`, { defaultValue: t(`story.${c.key}_title`) }),
    }));
  const openLightboxFor = (key: string) => {
    const idx = lightboxImages.findIndex(
      (it) => it.alt === t(`story.${key}_alt`, { defaultValue: t(`story.${key}_title`) })
    );
    setLightboxIdx(idx >= 0 ? idx : 0);
  };

  return (
    <section id="histoire" className="relative py-32 overflow-hidden">
      <div ref={ref} className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.3em] uppercase">{t("story.section_label")}</span>
            <div className="w-12 h-[1px] bg-gold" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            {t("story.title_before")}<br />
            <span className="text-gradient-gold text-glow-gold-intense">{t("story.title_highlight")}</span>
          </h2>
          <p className="text-white/75 text-xl mt-6 max-w-xl mx-auto leading-relaxed font-serif italic">
            {t("story.intro_quote")}
          </p>
        </motion.div>
        {/* Damier */}
        <div className="space-y-0">
          {CHAPTER_KEYS.map((key, i) => {
            const imageLeft = i % 2 === 0;
            const imgData = CHAPTER_IMAGES[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-2"
              >
                {/* Image (ou placeholder) */}
                <div
                  className={`${imageLeft ? "order-1" : "order-1 lg:order-2"} relative ${imgData.smallImage ? "min-h-[200px] lg:min-h-[280px]" : "min-h-[300px] lg:min-h-[400px]"} overflow-hidden flex items-center justify-center bg-black/20 ${imgData.image ? "cursor-pointer" : ""}`}
                  onClick={imgData.image ? () => openLightboxFor(key) : undefined}
                >
                  {imgData.image ? (
                    imgData.smallImage ? (
                      <img loading="lazy"
                        src={imgData.image}
                        alt={t(`story.${key}_alt`, { defaultValue: t(`story.${key}_title`) })}
                        className={`${imgData.extraSmall ? "w-[65%] max-h-[200px]" : "w-[85%] max-h-[260px]"} h-auto object-contain hover:scale-105 transition-transform duration-500 rounded`}
                        width={400} height={300}
                        decoding="async" />
                    ) : (
                      <img loading="lazy"
                        src={imgData.image}
                        alt={t(`story.${key}_alt`, { defaultValue: t(`story.${key}_title`) })}
                        className={`absolute inset-0 w-full h-full ${imgData.containImage ? "object-contain" : "object-cover"} hover:scale-105 transition-transform duration-500`}
                        width={800} height={500}
                        decoding="async" />
                    )
                  ) : (
                    <div className="absolute inset-0 bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                      <span className="text-white/20 text-lg italic">{t("story.photo_coming")}</span>
                    </div>
                  )}
                </div>
                {/* Texte */}
                <div className={`${imageLeft ? "order-2" : "order-2 lg:order-1"} flex flex-col justify-center p-10 lg:p-16 bg-white/[0.02]`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold font-bold text-2xl tracking-wide">{t(`story.${key}_year`)}</span>
                    <div className="w-10 h-px bg-gold/40" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">{t(`story.${key}_title`)}</h3>
                  <p className="text-white/75 text-base lg:text-lg leading-relaxed">{t(`story.${key}_text`)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          src={lightboxImages[lightboxIdx].src}
          alt={lightboxImages[lightboxIdx].alt}
          onClose={() => setLightboxIdx(null)}
          closeLabel={t("story.close_photo")}
          onPrev={lightboxIdx > 0 ? () => setLightboxIdx(lightboxIdx - 1) : undefined}
          onNext={lightboxIdx < lightboxImages.length - 1 ? () => setLightboxIdx(lightboxIdx + 1) : undefined}
        />
      )}
    </section>
  );
}
