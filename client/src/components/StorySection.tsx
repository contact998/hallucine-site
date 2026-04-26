/*
 * Section Notre Histoire — Layout damier (texte/image alternés)
 * Refactorisé avec i18n
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const CDN = "";
const ECRAN_TUBULAIRE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/JlNlzGmvIyCrQHIY.webp";
const VOILERIE_BRETAGNE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HuaJYMAXkcNubwBZ.webp";
const KYTEA_HK = `${CDN}/manus-storage/ihAHJqPuCbLEmeIQ_400w_8db8699a.webp`;
const KYTEA_HK_SRCSET = `${CDN}/manus-storage/ihAHJqPuCbLEmeIQ_400w_8db8699a.webp 400w, ${CDN}/manus-storage/ihAHJqPuCbLEmeIQ_800w_819aca17.webp 800w, ${CDN}/manus-storage/ihAHJqPuCbLEmeIQ_1000w_bf3022c8.webp 1000w`;
const ECLATE_ETANCHE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ORYwRnlcyusmCmpC.webp";
const ECRANS_ETANCHE_5_6 = `${CDN}/manus-storage/VDWrGjsVLLnZNbTR_800w_7f27513b.webp`;
const ECRANS_ETANCHE_5_6_SRCSET = `${CDN}/manus-storage/VDWrGjsVLLnZNbTR_400w_ed051747.webp 400w, ${CDN}/manus-storage/VDWrGjsVLLnZNbTR_800w_7f27513b.webp 800w, ${CDN}/manus-storage/VDWrGjsVLLnZNbTR_1200w_ca1cd8cc.webp 1200w`;
const REPAS_CHINOIS = `${CDN}/manus-storage/VGMyogZBklEVINLW_800w_8ae3a132.webp`;
const REPAS_CHINOIS_SRCSET = `${CDN}/manus-storage/VGMyogZBklEVINLW_400w_a5c52340.webp 400w, ${CDN}/manus-storage/VGMyogZBklEVINLW_800w_8ae3a132.webp 800w, ${CDN}/manus-storage/VGMyogZBklEVINLW_1200w_9e2abf8e.webp 1200w`;
const TROIS_ECRANS = `${CDN}/manus-storage/fGEhAORVzMgloRQI_800w_8cfea62c.webp`;
const TROIS_ECRANS_SRCSET = `${CDN}/manus-storage/fGEhAORVzMgloRQI_400w_56c6b06c.webp 400w, ${CDN}/manus-storage/fGEhAORVzMgloRQI_800w_8cfea62c.webp 800w, ${CDN}/manus-storage/fGEhAORVzMgloRQI_1000w_57173fd0.webp 1000w`;

const CHAPTER_IMAGES: { image: string | null; srcSet?: string; smallImage?: boolean; extraSmall?: boolean }[] = [
  { image: ECRAN_TUBULAIRE, smallImage: true },
  { image: VOILERIE_BRETAGNE },
  { image: KYTEA_HK, srcSet: KYTEA_HK_SRCSET, smallImage: true, extraSmall: true },
  { image: ECLATE_ETANCHE, smallImage: true },
  { image: ECRANS_ETANCHE_5_6, srcSet: ECRANS_ETANCHE_5_6_SRCSET },
  { image: REPAS_CHINOIS, srcSet: REPAS_CHINOIS_SRCSET },
  { image: TROIS_ECRANS, srcSet: TROIS_ECRANS_SRCSET },
];

const CHAPTER_KEYS = ["ch1996", "ch1998", "ch2004", "ch2005", "ch2010", "ch2020", "chToday"];

export default function StorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation("home");

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
                <div className={`${imageLeft ? "order-1" : "order-1 lg:order-2"} relative ${imgData.smallImage ? "min-h-[200px] lg:min-h-[280px]" : "min-h-[300px] lg:min-h-[400px]"} overflow-hidden flex items-center justify-center bg-black/20`}>
                  {imgData.image ? (
                    imgData.smallImage ? (
                      <img loading="lazy"
                        src={imgData.image}
                        srcSet={imgData.srcSet}
                        sizes="(max-width: 640px) 65vw, 300px"
                        alt={t(`story.${key}_title`)}
                        className={`${imgData.extraSmall ? "w-[65%] max-h-[200px]" : "w-[85%] max-h-[260px]"} h-auto object-contain hover:scale-105 transition-transform duration-700 rounded`}
                        width={400} height={300}
                        decoding="async" />
                    ) : (
                      <img loading="lazy"
                        src={imgData.image}
                        srcSet={imgData.srcSet}
                        sizes="(max-width: 640px) 100vw, 600px"
                        alt={t(`story.${key}_title`)}
                        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
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
    </section>
  );
}
