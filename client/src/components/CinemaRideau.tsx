/*
 * CinemaRideau — Effet de rideau de cinéma rouge qui s'ouvre au chargement
 * L'utilisateur clique pour "entrer" → le son du rideau + le compte à rebours
 * se déclenchent ensemble, puis le rideau s'ouvre.
 * Le clic initial contourne la politique autoplay des navigateurs modernes.
 */
import { useState, useEffect, useRef, useCallback } from "react";

const CURTAIN_SOUND_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/iwEWTRdKZwhOWzcW.mp3";
const PROJECTOR_SOUND_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/NSvXTGcyBANIYpcE.mp3";

// Timings (en ms)
const COUNTDOWN_STEP = 900;       // Durée de chaque chiffre du compte à rebours
const COUNTDOWN_TOTAL = COUNTDOWN_STEP * 3; // 3 chiffres (3, 2, 1)
const OPEN_DURATION = 3000;       // Durée de l'animation d'ouverture du rideau
const FADE_OUT_START = 2600;      // Début du fade-out du son rideau
const REMOVE_DELAY = 3800;        // Retrait du DOM

type Phase = "waiting" | "countdown" | "opening" | "done";

export default function CinemaRideau() {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [count, setCount] = useState(3);
  const [fading, setFading] = useState(false);
  const curtainAudioRef = useRef<HTMLAudioElement | null>(null);
  const projectorAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Précharger les deux sons dès le montage (sans les jouer)
  useEffect(() => {
    const curtainAudio = new Audio();
    curtainAudio.preload = "auto";
    curtainAudio.volume = 0.6;
    curtainAudio.src = CURTAIN_SOUND_URL;
    curtainAudio.load();
    curtainAudioRef.current = curtainAudio;

    const projectorAudio = new Audio();
    projectorAudio.preload = "auto";
    projectorAudio.volume = 0.5;
    projectorAudio.loop = true;
    projectorAudio.src = PROJECTOR_SOUND_URL;
    projectorAudio.load();
    projectorAudioRef.current = projectorAudio;

    return () => {
      curtainAudio.pause();
      curtainAudio.src = "";
      projectorAudio.pause();
      projectorAudio.src = "";
    };
  }, []);

  // Clic utilisateur → lance le compte à rebours + son projecteur
  const handleClick = useCallback(() => {
    if (phase !== "waiting") return;
    setPhase("countdown");

    // Jouer le son du projecteur (le clic autorise l'autoplay)
    if (projectorAudioRef.current) {
      projectorAudioRef.current.currentTime = 0;
      projectorAudioRef.current.play().catch(() => {});
    }
  }, [phase]);

  // Compte à rebours 3 → 2 → 1
  useEffect(() => {
    if (phase !== "countdown") return;
    if (count > 0) {
      const timer = setTimeout(() => setCount((c) => c - 1), COUNTDOWN_STEP);
      return () => clearTimeout(timer);
    } else {
      // Compte à rebours terminé → fade-out du projecteur + ouvrir le rideau
      setFading(true);

      // Fade-out du son projecteur
      if (projectorAudioRef.current) {
        const a = projectorAudioRef.current;
        const fadeStep = 50;
        const steps = 500 / fadeStep;
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

      // Après le fade du countdown, ouvrir le rideau
      setTimeout(() => {
        setPhase("opening");
        setFading(false);

        // Jouer le son du rideau
        if (curtainAudioRef.current) {
          curtainAudioRef.current.currentTime = 0;
          curtainAudioRef.current.play().catch(() => {});
        }
      }, 500);
    }
  }, [phase, count]);

  // Ouverture du rideau : fade-out du son rideau + retrait du DOM
  useEffect(() => {
    if (phase !== "opening") return;

    // Fade-out du son du rideau vers la fin de l'ouverture
    const t1 = setTimeout(() => {
      if (curtainAudioRef.current) {
        fadeRef.current = setInterval(() => {
          if (curtainAudioRef.current && curtainAudioRef.current.volume > 0.05) {
            curtainAudioRef.current.volume = Math.max(0, curtainAudioRef.current.volume - 0.08);
          } else {
            if (curtainAudioRef.current) {
              curtainAudioRef.current.pause();
              curtainAudioRef.current.volume = 0;
            }
            if (fadeRef.current) clearInterval(fadeRef.current);
          }
        }, 40);
      }
    }, FADE_OUT_START);

    // Retirer du DOM
    const t2 = setTimeout(() => setPhase("done"), REMOVE_DELAY);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, [phase]);

  if (phase === "done") return null;

  const isOpening = phase === "opening";
  const isCountdown = phase === "countdown";
  const openTransition = `transform ${OPEN_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;

  return (
    <div
      className="fixed inset-0 z-[9999]"
      style={{ cursor: phase === "waiting" ? "pointer" : "default" }}
      onClick={handleClick}
      aria-hidden="true"
    >
      {/* Fond noir */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          opacity: isOpening ? 0 : 1,
          transition: "opacity 1s ease",
          transitionDelay: isOpening ? `${OPEN_DURATION * 0.7}ms` : "0ms",
        }}
      />

      {/* Rideau gauche */}
      <div
        className="absolute top-0 left-0 h-full w-1/2 overflow-hidden"
        style={{
          transform: isOpening ? "translateX(-105%)" : "translateX(0)",
          transition: isOpening ? openTransition : "none",
        }}
      >
        <div className="relative w-full h-full" style={{ background: "linear-gradient(90deg, #5a0a0a 0%, #8b1a1a 15%, #6b0f0f 25%, #a02020 40%, #7a1212 55%, #8b1a1a 70%, #6b0f0f 85%, #4a0808 100%)" }}>
          <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,0.15) 8px, transparent 16px, rgba(255,255,255,0.05) 24px, transparent 32px)" }} />
          <div className="absolute top-0 right-0 w-16 h-full" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.5))" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(255,200,200,0.08) 0%, transparent 60%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-3" style={{ background: "linear-gradient(180deg, #c5942a, #e8b84a, #c5942a)" }} />
          <div className="absolute top-[15%] right-4 w-6 h-20" style={{ background: "linear-gradient(180deg, #c5942a, #e8b84a 50%, #c5942a)", borderRadius: "3px", boxShadow: "2px 2px 8px rgba(0,0,0,0.4)" }} />
        </div>
      </div>

      {/* Rideau droit */}
      <div
        className="absolute top-0 right-0 h-full w-1/2 overflow-hidden"
        style={{
          transform: isOpening ? "translateX(105%)" : "translateX(0)",
          transition: isOpening ? openTransition : "none",
        }}
      >
        <div className="relative w-full h-full" style={{ background: "linear-gradient(270deg, #5a0a0a 0%, #8b1a1a 15%, #6b0f0f 25%, #a02020 40%, #7a1212 55%, #8b1a1a 70%, #6b0f0f 85%, #4a0808 100%)" }}>
          <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,0.15) 8px, transparent 16px, rgba(255,255,255,0.05) 24px, transparent 32px)" }} />
          <div className="absolute top-0 left-0 w-16 h-full" style={{ background: "linear-gradient(270deg, transparent, rgba(0,0,0,0.5))" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(255,200,200,0.08) 0%, transparent 60%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-3" style={{ background: "linear-gradient(180deg, #c5942a, #e8b84a, #c5942a)" }} />
          <div className="absolute top-[15%] left-4 w-6 h-20" style={{ background: "linear-gradient(180deg, #c5942a, #e8b84a 50%, #c5942a)", borderRadius: "3px", boxShadow: "-2px 2px 8px rgba(0,0,0,0.4)" }} />
        </div>
      </div>

      {/* Lambrequin (cantonnière) en haut */}
      <div
        className="absolute top-0 left-0 right-0 h-16 z-10"
        style={{
          background: "linear-gradient(180deg, #6b0f0f 0%, #8b1a1a 40%, #5a0a0a 100%)",
          opacity: isOpening ? 0 : 1,
          transition: "opacity 0.8s ease",
          transitionDelay: isOpening ? `${OPEN_DURATION * 0.6}ms` : "0ms",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-6">
          <svg viewBox="0 0 1200 24" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,0 Q50,24 100,0 Q150,24 200,0 Q250,24 300,0 Q350,24 400,0 Q450,24 500,0 Q550,24 600,0 Q650,24 700,0 Q750,24 800,0 Q850,24 900,0 Q950,24 1000,0 Q1050,24 1100,0 Q1150,24 1200,0 L1200,24 L0,24 Z" fill="#4a0808" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #c5942a, #e8b84a, #c5942a, #e8b84a, #c5942a)" }} />
      </div>

      {/* Contenu central */}
      <div
        className="absolute inset-0 flex items-center justify-center z-20"
        style={{
          opacity: (isCountdown && fading) ? 0 : (isOpening ? 0 : 1),
          transition: "opacity 0.5s ease",
        }}
      >
        {/* Phase "waiting" : logo + invitation à cliquer */}
        {phase === "waiting" && (
          <div className="text-center">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/fCazlcDpANMEbcFp.png"
              alt="Hallucine"
              className="w-48 md:w-72 h-auto mx-auto drop-shadow-[0_2px_20px_rgba(232,184,74,0.3)]"
            />
            <p className="text-white/60 text-sm tracking-[0.3em] mt-4 uppercase">Écrans de cinéma gonflables</p>
            <p className="text-amber-400/80 text-xs tracking-[0.2em] mt-6 uppercase animate-pulse">
              Cliquez pour entrer
            </p>
          </div>
        )}

        {/* Phase "countdown" : 3, 2, 1 avec viseur pellicule */}
        {isCountdown && count > 0 && (
          <svg
            viewBox="0 0 200 200"
            className="w-56 h-56 sm:w-72 sm:h-72"
            style={{ filter: "drop-shadow(0 0 30px rgba(255,200,100,0.3))" }}
          >
            <circle cx="100" cy="100" r="95" fill="none" stroke="#c8a96e" strokeWidth="3" opacity="0.6" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#c8a96e" strokeWidth="1.5" opacity="0.4" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="#c8a96e" strokeWidth="1" opacity="0.3" />
            <line x1="100" y1="10" x2="100" y2="45" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />
            <line x1="100" y1="155" x2="100" y2="190" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />
            <line x1="10" y1="100" x2="45" y2="100" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />
            <line x1="155" y1="100" x2="190" y2="100" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />
            <circle
              cx="100" cy="100" r="88" fill="none" stroke="#e8c547" strokeWidth="4"
              strokeDasharray="553" strokeDashoffset="553" strokeLinecap="round"
              style={{ animation: `countdown-arc ${COUNTDOWN_STEP}ms linear`, transformOrigin: "center", transform: "rotate(-90deg)" }}
              key={count}
            />
            <text
              x="100" y="118" textAnchor="middle" fill="#f0d878" fontSize="80"
              fontFamily="'Georgia', serif" fontWeight="bold"
              style={{ animation: `countdown-pop ${COUNTDOWN_STEP}ms ease-out` }}
              key={`num-${count}`}
            >
              {count}
            </text>
          </svg>
        )}
      </div>

      {/* Perforations de pellicule (visibles pendant le countdown) */}
      {isCountdown && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-around items-center opacity-25 z-20">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-4 h-6 rounded-sm border border-amber-600/60" />
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col justify-around items-center opacity-25 z-20">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-4 h-6 rounded-sm border border-amber-600/60" />
            ))}
          </div>
        </>
      )}

      {/* Grain de film + flicker (pendant countdown) */}
      {isCountdown && (
        <>
          <div className="absolute inset-0 pointer-events-none z-20" style={{
            background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, transparent 1px, transparent 3px)",
            mixBlendMode: "multiply",
          }} />
          <div className="absolute inset-0 pointer-events-none z-20" style={{ animation: "film-flicker 0.15s infinite alternate" }} />
          <div className="absolute inset-0 pointer-events-none z-20" style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
          }} />
        </>
      )}

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
