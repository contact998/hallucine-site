/*
 * FilmCountdown — Compteur de pellicule de film vintage (3, 2, 1)
 * Utilise une vidéo YouTube Creative Commons en plein écran.
 * S'affiche au chargement des pages Écrans, puis disparaît.
 */
import { useState, useEffect, useRef } from "react";

// YouTube video ID: Film Reel 5,4,3,2,1 Countdown - Creative Commons
const VIDEO_ID = "KCISG0phmbw";
// Démarrer à 2s pour avoir 3-2-1 (la vidéo fait 5-4-3-2-1 en 6s)
const START_TIME = 2;
// Durée visible du countdown (3 secondes + petite marge)
const DISPLAY_DURATION = 4200;

export default function FilmCountdown({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Commencer le fade-out un peu avant la fin
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, DISPLAY_DURATION - 800);

    // Retirer du DOM
    const removeTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, DISPLAY_DURATION);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9998] bg-black flex items-center justify-center"
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 0.8s ease-out",
      }}
      aria-hidden="true"
    >
      {/* Vidéo YouTube en plein écran, autoplay, sans contrôles */}
      <div className="relative w-full h-full overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&start=${START_TIME}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&mute=0&enablejsapi=1`}
          className="absolute top-1/2 left-1/2 border-0"
          style={{
            width: "180vw",
            height: "180vh",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          title="Film countdown"
        />
      </div>

      {/* Grain de film overlay pour renforcer l'effet vintage */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, transparent 1px, transparent 2px)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Vignette sombre sur les bords */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}
