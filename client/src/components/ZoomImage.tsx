/*
 * ZoomImage — image autonome avec comportement unifié sur tout le site :
 *   • Hover     → scale-105 (transition 500ms)
 *   • Click     → ouvre la Lightbox plein écran sur cette image
 *
 * Drop-in pour les images de galerie / cartes produit isolées. Pour les
 * galeries multi-images avec navigation prev/next, conserver une lightbox
 * dédiée (cf. Galerie.tsx) — ce composant ne gère pas la nav inter-images.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import Lightbox from "./Lightbox";

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
}: ZoomImageProps) {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`overflow-hidden cursor-pointer ${wrapperClassName}`}
        onClick={() => setOpen(true)}
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
        {open && (
          <Lightbox
            src={src}
            alt={alt}
            caption={caption}
            onClose={() => setOpen(false)}
            closeLabel={t("close", { defaultValue: "Fermer" })}
          />
        )}
      </AnimatePresence>
    </>
  );
}
