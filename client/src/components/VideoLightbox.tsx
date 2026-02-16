import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface VideoLightboxProps {
  videoId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoLightbox({ videoId, title, isOpen, onClose }: VideoLightboxProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Fermer la vidéo"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Titre */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-white text-lg font-semibold drop-shadow-lg">{title}</h3>
      </div>

      {/* Conteneur vidéo — grand format */}
      <div
        className="relative w-[95vw] max-w-6xl"
        style={{ aspectRatio: "16/9" }}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg shadow-2xl"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
