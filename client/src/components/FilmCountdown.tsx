/*
 * FilmCountdown — Compteur de pellicule de film vintage (3, 2, 1)
 * 100% CSS pur — pas de vidéo YouTube, chargement instantané.
 * Affiche 3 → 2 → 1 rapidement puis disparaît.
 */
import { useState, useEffect, useCallback } from "react";

// Durée de chaque chiffre en ms
const STEP_DURATION = 600;
// Fade-out final
const FADE_DURATION = 400;

export default function FilmCountdown({ onComplete }: { onComplete?: () => void }) {
  const [count, setCount] = useState(3);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  const finish = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, FADE_DURATION);
  }, [onComplete]);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount((c) => c - 1), STEP_DURATION);
      return () => clearTimeout(timer);
    } else {
      finish();
    }
  }, [count, finish]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] bg-black flex items-center justify-center"
      style={{
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease-out`,
      }}
      aria-hidden="true"
    >
      {/* Cercle de visée style pellicule */}
      <svg
        viewBox="0 0 200 200"
        className="w-64 h-64 sm:w-80 sm:h-80"
        style={{ filter: "drop-shadow(0 0 30px rgba(255,200,100,0.3))" }}
      >
        {/* Fond sépia léger */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="#c8a96e" strokeWidth="3" opacity="0.6" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#c8a96e" strokeWidth="1.5" opacity="0.4" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#c8a96e" strokeWidth="1" opacity="0.3" />

        {/* Croix de visée */}
        <line x1="100" y1="10" x2="100" y2="45" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />
        <line x1="100" y1="155" x2="100" y2="190" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />
        <line x1="10" y1="100" x2="45" y2="100" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />
        <line x1="155" y1="100" x2="190" y2="100" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />

        {/* Arc animé qui se remplit (progress) */}
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="#e8c547"
          strokeWidth="4"
          strokeDasharray="553"
          strokeDashoffset="553"
          strokeLinecap="round"
          style={{
            animation: `countdown-arc ${STEP_DURATION}ms linear`,
            transformOrigin: "center",
            transform: "rotate(-90deg)",
          }}
          key={count}
        />

        {/* Chiffre central */}
        {count > 0 && (
          <text
            x="100"
            y="115"
            textAnchor="middle"
            fill="#f0d878"
            fontSize="72"
            fontFamily="'Georgia', serif"
            fontWeight="bold"
            style={{
              animation: `countdown-pop ${STEP_DURATION}ms ease-out`,
            }}
            key={`num-${count}`}
          >
            {count}
          </text>
        )}
      </svg>

      {/* Perforations de pellicule — bande gauche */}
      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-around items-center opacity-30">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-4 h-6 rounded-sm border border-amber-600/60" />
        ))}
      </div>

      {/* Perforations de pellicule — bande droite */}
      <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col justify-around items-center opacity-30">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-4 h-6 rounded-sm border border-amber-600/60" />
        ))}
      </div>

      {/* Grain de film overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, transparent 1px, transparent 3px)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Vignette sombre sur les bords */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Animations CSS */}
      <style>{`
        @keyframes countdown-pop {
          0% { opacity: 0; transform: scale(1.8); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.3; transform: scale(0.9); }
        }
        @keyframes countdown-arc {
          0% { stroke-dashoffset: 553; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
