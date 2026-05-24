/*
 * ZoomImage — image autonome avec comportement unifié sur tout le site :
 *   • Hover     → scale-105 (transition 500ms)
 *   • Click     → ouvre la Lightbox plein écran sur cette image
 *   • Galerie   → si `gallery` fourni, flèches prev/next (clic + clavier ←/→)
 *
 * Drop-in pour les images de galerie / cartes produit isolées. Pour les
 * galeries multi-images avec navigation, passer le tableau complet via
 * `gallery` + l'index courant via `index`. Sans ces props, la lightbox
 * affiche juste l'image cliquée sans nav.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import Lightbox from "./Lightbox";

type GalleryItem = { src: string; alt: string };

type ZoomImageProps = {
  src: string;
  alt: string;
  /** Classes appliquées à l'<img> (taille, ratio, object-fit, etc.). Le hover + transition sont ajoutés automatiquement. */
  className?: string;
  /** Wrapper supplémentaire (rare — utile pour group-hover ou aspect parent). */
  wrapperClassName?: string;
  width?: number;
  height?: number;
  /** `lazy` par défaut. */
  loading?: "lazy" | "eager";
  /** `async` par défaut. */
  decoding?: "async" | "sync" | "auto";
  /** Légende optionnelle affichée en bas de la lightbox. */
  caption?: string;
  /** Tableau complet des images de la galerie pour activer prev/next dans la lightbox. */
  gallery?: GalleryItem[];
  /** Index de cette image dans `gallery`. Requis si `gallery` est fourni. */
  index?: number;
};

export default function ZoomImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  width,
  height,
  loading = "lazy",
  decoding = "async",
  caption,
  gallery,
  index = 0,
}: ZoomImageProps) {
  const { t } = useTranslation("common");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const hasGallery = Array.isArray(gallery) && gallery.length > 1;
  const items: GalleryItem[] = hasGallery ? gallery! : [{ src, alt }];
  const current = openIdx !== null ? items[openIdx] : null;

  return (
    <>
      <div
        className={`overflow-hidden cursor-pointer ${wrapperClassName}`}
        onClick={() => setOpenIdx(hasGallery ? index : 0)}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding={decoding}
          className={`${className} transition-transform duration-500 hover:scale-105`}
        />
      </div>
      <AnimatePresence>
        {current && (
          <Lightbox
            src={current.src}
            alt={current.alt}
            caption={caption}
            onClose={() => setOpenIdx(null)}
            closeLabel={t("close", { defaultValue: "Fermer" })}
            onPrev={hasGallery && openIdx! > 0 ? () => setOpenIdx(openIdx! - 1) : undefined}
            onNext={hasGallery && openIdx! < items.length - 1 ? () => setOpenIdx(openIdx! + 1) : undefined}
          />
        )}
      </AnimatePresence>
    </>
  );
}
