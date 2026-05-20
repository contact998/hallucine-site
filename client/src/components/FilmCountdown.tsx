/*
 * FilmCountdown — Compteur de pellicule de film vintage (3, 2, 1)
 * 100% CSS/SVG pur + son de projecteur 35mm.
 *
 * Overlay TRANSPARENT : la page reste visible derrière dès le chargement.
 * Le countdown est un calque décoratif qui ne masque plus le contenu —
 * il ne bloque donc pas le LCP (Core Web Vitals). S'affiche une fois par
 * session (sessionStorage).
 */
import { useState, useEffect, useCallback, useRef } from "react";

// Son de projecteur vintage (Mixkit "Vintage film projector working", libre de droits)
// Version allégée : 6 s mono 64 kbps (~47 Ko) — couvre largement le countdown de 3 s.
const PROJECTOR_SOUND_URL = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/media/projector-countdown-1779258515882.mp3";

// Durée de chaque chiffre en ms (~1 seconde par chiffre)
const STEP_DURATION = 900;
// Fade-out final
const FADE_DURATION = 500;

// Vérifie si le countdown a déjà été vu dans cette session
function hasSeenCountdown(): boolean {
  try {
    return sessionStorage.getItem("countdown_seen") === "1";
  } catch {
    return false;
  }
}

function markCountdownSeen(): void {
  try {
    sessionStorage.setItem("countdown_seen", "1");
  } catch {}
}

export default function FilmCountdown({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  // `visible` démarre TOUJOURS à true — identique au rendu serveur → hydratation
  // propre. La décision « déjà vu » (lecture sessionStorage) se prend dans un
  // effet, jamais pendant le rendu.
  const [count, setCount] = useState(3);
  const [visible, setVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const [fading, setFading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Au montage (client) : déjà vu cette session → on saute ; sinon → on démarre.
  useEffect(() => {
    if (hasSeenCountdown()) {
      setVisible(false);
      onCompleteRef.current?.();
    } else {
      setStarted(true);
    }
  }, []);

  // Son de projecteur — best-effort, ne bloque pas le countdown
  useEffect(() => {
    if (!started) return;
    const audio = new Audio(PROJECTOR_SOUND_URL);
    audio.volume = 0.5;
    audio.loop = true;
    audioRef.current = audio;
    audio.play().catch(() => {
      /* autoplay bloqué par le navigateur — sans gravité */
    });
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [started]);

  const finish = useCallback(() => {
    setFading(true);
    // Fade-out du son
    const a = audioRef.current;
    if (a) {
      const fadeStep = 50;
      const steps = FADE_DURATION / fadeStep;
      const volDec = a.volume / steps;
      const interval = setInterval(() => {
        if (a.volume > volDec) {
          a.volume = Math.max(0, a.volume - volDec);
        } else {
          a.volume = 0;
          a.pause();
          clearInterval(interval);
        }
      }, fadeStep);
    }
    setTimeout(() => {
      setVisible(false);
      markCountdownSeen();
      onComplete?.();
    }, FADE_DURATION);
  }, [onComplete]);

  // Compte à rebours — démarre une fois `started` vrai (jamais si déjà vu)
  useEffect(() => {
    if (!started) return;
    if (count > 0) {
      const timer = setTimeout(() => setCount((c) => c - 1), STEP_DURATION);
      return () => clearTimeout(timer);
    }
    finish();
  }, [count, finish, started]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease-out`,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {/* Contenu du countdown — fond transparent, la page reste visible derrière */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {/* Cercle de visée style pellicule */}
        <svg
          viewBox="0 0 200 200"
          className="w-56 h-56 sm:w-72 sm:h-72"
          style={{ filter: "drop-shadow(0 0 30px rgba(255,200,100,0.4))" }}
        >
          {/* Cercles concentriques sépia */}
          <circle cx="100" cy="100" r="95" fill="none" stroke="#c8a96e" strokeWidth="3" opacity="0.6" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="#c8a96e" strokeWidth="1.5" opacity="0.4" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#c8a96e" strokeWidth="1" opacity="0.3" />

          {/* Croix de visée */}
          <line x1="100" y1="10" x2="100" y2="45" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />
          <line x1="100" y1="155" x2="100" y2="190" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />
          <line x1="10" y1="100" x2="45" y2="100" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />
          <line x1="155" y1="100" x2="190" y2="100" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />

          {/* Arc animé de progression */}
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
              y="118"
              textAnchor="middle"
              fill="#f0d878"
              fontSize="80"
              fontFamily="'Georgia', serif"
              fontWeight="bold"
              style={{ animation: `countdown-pop ${STEP_DURATION}ms ease-out` }}
              key={`num-${count}`}
            >
              {count}
            </text>
          )}
        </svg>

        {/* Perforations de pellicule — bande gauche */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-around items-center opacity-25">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-4 h-6 rounded-sm border border-amber-600/60" />
          ))}
        </div>

        {/* Perforations de pellicule — bande droite */}
        <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col justify-around items-center opacity-25">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-4 h-6 rounded-sm border border-amber-600/60" />
          ))}
        </div>
      </div>

      {/* Animations CSS */}
      <style>{`
        @keyframes countdown-pop {
          0% { opacity: 0; transform: scale(2); }
          15% { opacity: 1; transform: scale(1); }
          85% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.2; transform: scale(0.85); }
        }
        @keyframes countdown-arc {
          0% { stroke-dashoffset: 553; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
