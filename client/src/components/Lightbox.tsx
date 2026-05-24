/*
 * Lightbox — modal plein écran pour visualiser une image en grand.
 * Fermeture : clic sur le fond, la croix, ou touche Escape.
 * Navigation (optionnelle) : flèches gauche/droite à l'écran + clavier ←/→.
 */
import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
        aria-label={closeLabel}
      >
        <X className="w-8 h-8" />
      </button>
      {onPrev && (
        <button
          onClick={(e) => { stop(e); onPrev(); }}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Image précédente"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}
      {onNext && (
        <button
          onClick={(e) => { stop(e); onNext(); }}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Image suivante"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}
      <img
        src={src}
        alt={alt}
        onClick={stop}
        className="max-w-full max-h-[85vh] object-contain"
        width={1200}
        height={800}
        decoding="async"
        loading="lazy"
      />
      {caption && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <p className="text-white/70 text-sm font-medium">{caption}</p>
        </div>
      )}
    </motion.div>
  );
}
