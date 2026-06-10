/*
 * Lightbox — modal plein écran pour visualiser une image en grand.
 * Layout flex : flèches collées contre les bords gauche/droite de l'image
 * (pas aux bords du viewport — toujours proches de l'image quelle que soit
 * sa taille). Croix flottante en haut à droite de l'image.
 *
 * Fermeture : clic sur le fond, sur la croix, ou touche Escape.
 * Navigation (optionnelle) : flèches ‹ › à l'écran + clavier ←/→.
 */
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type LightboxProps = {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
  closeLabel: string;
  /** Si fourni, affiche une flèche gauche et appelle ce handler au clic ou sur ←. */
  onPrev?: () => void;
  /** Si fourni, affiche une flèche droite et appelle ce handler au clic ou sur →. */
  onNext?: () => void;
};

export default function Lightbox({
  src,
  alt,
  caption,
  onClose,
  closeLabel,
  onPrev,
  onNext,
}: LightboxProps) {
  const { t } = useTranslation("common");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && onPrev) onPrev();
      else if (e.key === "ArrowRight" && onNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center gap-3 md:gap-5 p-3 md:p-6"
      onClick={onClose}
    >
      {onPrev ? (
        <button
          onClick={(e) => { stop(e); onPrev(); }}
          className="shrink-0 w-11 h-11 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-3xl leading-none transition-colors"
          aria-label={t("lightbox_prev")}
        >‹</button>
      ) : (
        <div className="shrink-0 w-11 md:w-12" aria-hidden="true" />
      )}

      <div className="relative inline-flex max-h-full" onClick={stop}>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[88vh] object-contain rounded-lg"
          width={1200}
          height={800}
          decoding="async"
          loading="lazy"
        />
        {caption && (
          <p className="absolute -bottom-7 left-0 right-0 text-center text-white/70 text-sm font-medium">
            {caption}
          </p>
        )}
      </div>

      {onNext ? (
        <button
          onClick={(e) => { stop(e); onNext(); }}
          className="shrink-0 w-11 h-11 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-3xl leading-none transition-colors"
          aria-label={t("lightbox_next")}
        >›</button>
      ) : (
        <div className="shrink-0 w-11 md:w-12" aria-hidden="true" />
      )}
    </motion.div>
  );
}
