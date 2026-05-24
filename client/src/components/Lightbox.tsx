/*
 * Lightbox — modal plein écran pour visualiser une image en grand.
 * Fermeture au clic sur le fond, sur la croix, ou sur l'image.
 */
import { motion } from "framer-motion";
import { X } from "lucide-react";

type LightboxProps = {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
  closeLabel: string;
};

export default function Lightbox({ src, alt, caption, onClose, closeLabel }: LightboxProps) {
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
      <img
        src={src}
        alt={alt}
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
