/*
 * FilmCountdown — Compteur de pellicule de film vintage (3, 2, 1)
 * 100% CSS pur + son de projecteur 35mm — chargement instantané.
 * Le son est PRÉCHARGÉ avant de lancer l'animation pour éviter tout décalage.
 * Affiche 3 → 2 → 1 avec son de projecteur qui tourne.
 * FONDU ENCHAÎNÉ : le fond noir devient progressivement transparent,
 * laissant la page apparaître derrière le compteur pendant le décompte.
 */
import { useState, useEffect, useCallback, useRef } from "react";

// Son de projecteur vintage authentique (Mixkit "Vintage film projector working", libre de droits)
const PROJECTOR_SOUND_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/NSvXTGcyBANIYpcE.mp3";

// Durée de chaque chiffre en ms (~1 seconde par chiffre)
const STEP_DURATION = 900;
// Fade-out final
const FADE_DURATION = 500;
// Timeout max pour le préchargement (2s)
const MAX_PRELOAD_WAIT = 2000;
// Durée totale du countdown (3 chiffres)
const TOTAL_COUNTDOWN = STEP_DURATION * 3;

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
  // Skip si déjà vu dans cette session
  const alreadySeen = hasSeenCountdown();
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(3);
  const [visible, setVisible] = useState(!alreadySeen);
  const [fading, setFading] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgAnimRef = useRef<number | null>(null);

  // Si déjà vu, appeler onComplete immédiatement
  useEffect(() => {
    if (alreadySeen) {
      onComplete?.();
    }
  }, [alreadySeen, onComplete]);

  // Étape 1 : précharger le son, puis marquer "ready"
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = 0.5;
    audio.loop = true;
    audioRef.current = audio;

    let resolved = false;
    const markReady = () => {
      if (resolved) return;
      resolved = true;
      setReady(true);
    };

    audio.addEventListener("canplaythrough", markReady, { once: true });

    // Timeout de sécurité
    const safetyTimer = setTimeout(markReady, MAX_PRELOAD_WAIT);

    // Lancer le chargement
    audio.src = PROJECTOR_SOUND_URL;
    audio.load();

    return () => {
      clearTimeout(safetyTimer);
      audio.removeEventListener("canplaythrough", markReady);
    };
  }, []);

  // Étape 2 : une fois prêt, jouer le son + lancer le fondu enchaîné du fond
  useEffect(() => {
    if (!ready || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      /* autoplay bloqué — pas grave */
    });

    // Fondu enchaîné : réduire progressivement l'opacité du fond noir
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      // Le fond passe de 1 à 0 sur la durée totale du countdown
      const progress = Math.min(elapsed / TOTAL_COUNTDOWN, 1);
      // Courbe ease-in : le fondu s'accélère vers la fin
      const eased = progress * progress;
      setBgOpacity(1 - eased);
      if (progress < 1) {
        bgAnimRef.current = requestAnimationFrame(animate);
      }
    };
    bgAnimRef.current = requestAnimationFrame(animate);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (bgAnimRef.current) {
        cancelAnimationFrame(bgAnimRef.current);
      }
    };
  }, [ready]);

  const finish = useCallback(() => {
    setFading(true);
    // Fade-out du son
    if (audioRef.current) {
      const a = audioRef.current;
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

  // Étape 3 : compte à rebours (seulement quand ready)
  useEffect(() => {
    if (!ready) return;
    if (count > 0) {
      const timer = setTimeout(() => setCount((c) => c - 1), STEP_DURATION);
      return () => clearTimeout(timer);
    } else {
      finish();
    }
  }, [count, finish, ready]);

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
      {/* Fond noir avec fondu enchaîné */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`,
        }}
      />

      {/* Contenu du countdown (par-dessus le fond) */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {/* Cercle de visée style pellicule — visible seulement quand ready */}
        {ready && (
          <svg
            viewBox="0 0 200 200"
            className="w-56 h-56 sm:w-72 sm:h-72"
            style={{ filter: "drop-shadow(0 0 30px rgba(255,200,100,0.3))" }}
          >
            {/* Cercles concentriques sépia */}
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke="#c8a96e"
              strokeWidth="3"
              opacity="0.6"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#c8a96e"
              strokeWidth="1.5"
              opacity="0.4"
            />
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="#c8a96e"
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Croix de visée */}
            <line
              x1="100"
              y1="10"
              x2="100"
              y2="45"
              stroke="#c8a96e"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <line
              x1="100"
              y1="155"
              x2="100"
              y2="190"
              stroke="#c8a96e"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <line
              x1="10"
              y1="100"
              x2="45"
              y2="100"
              stroke="#c8a96e"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <line
              x1="155"
              y1="100"
              x2="190"
              y2="100"
              stroke="#c8a96e"
              strokeWidth="1.5"
              opacity="0.5"
            />

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
                style={{
                  animation: `countdown-pop ${STEP_DURATION}ms ease-out`,
                }}
                key={`num-${count}`}
              >
                {count}
              </text>
            )}
          </svg>
        )}

        {/* Perforations de pellicule — bande gauche */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-around items-center opacity-25">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-6 rounded-sm border border-amber-600/60"
            />
          ))}
        </div>

        {/* Perforations de pellicule — bande droite */}
        <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col justify-around items-center opacity-25">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-6 rounded-sm border border-amber-600/60"
            />
          ))}
        </div>

        {/* Grain de film overlay — lignes horizontales */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, transparent 1px, transparent 3px)",
            mixBlendMode: "multiply",
          }}
        />

        {/* Scintillement / flicker vintage */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            animation: "film-flicker 0.15s infinite alternate",
          }}
        />

        {/* Vignette sombre sur les bords */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
            opacity: bgOpacity,
          }}
        />
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
        @keyframes film-flicker {
          0% { background: rgba(255,245,220,0.01); }
          50% { background: rgba(0,0,0,0.03); }
          100% { background: rgba(255,245,220,0.02); }
        }
      `}</style>
    </div>
  );
}
