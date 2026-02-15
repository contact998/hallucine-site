/*
 * CinemaRideau — Effet de rideau de cinéma rouge qui s'ouvre au chargement
 * Ouverture lente et majestueuse (~3s) avec son synchronisé.
 * Le son joue UNIQUEMENT pendant l'ouverture, puis fade-out à la fin.
 */
import { useState, useEffect, useRef } from "react";

const CURTAIN_SOUND_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/iwEWTRdKZwhOWzcW.mp3";

// Timings (en ms)
const PAUSE_BEFORE_OPEN = 600;   // Temps rideau fermé visible avec logo
const OPEN_DURATION = 3000;       // Durée de l'animation d'ouverture (lente)
const FADE_OUT_START = 2600;      // Début du fade-out du son (avant la fin de l'ouverture)
const REMOVE_DELAY = 3800;        // Retrait du DOM (après ouverture + fondu noir)

export default function CinemaRideau() {
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Précharger le son
    const audio = new Audio(CURTAIN_SOUND_URL);
    audio.volume = 0.6;
    audio.preload = "auto";
    audioRef.current = audio;

    // Phase 1 : ouvrir le rideau + jouer le son
    const t1 = setTimeout(() => {
      setPhase("opening");
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }, PAUSE_BEFORE_OPEN);

    // Phase 2 : fade-out du son vers la fin de l'ouverture
    const t3 = setTimeout(() => {
      if (audioRef.current) {
        fadeRef.current = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.05) {
            audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.08);
          } else {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.volume = 0;
            }
            if (fadeRef.current) clearInterval(fadeRef.current);
          }
        }, 40);
      }
    }, PAUSE_BEFORE_OPEN + FADE_OUT_START);

    // Phase 3 : retirer le rideau du DOM
    const t2 = setTimeout(() => setPhase("done"), PAUSE_BEFORE_OPEN + REMOVE_DELAY);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (fadeRef.current) clearInterval(fadeRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (phase === "done") return null;

  const openTransition = `transform ${OPEN_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      {/* Fond noir derrière le rideau */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          opacity: phase === "opening" ? 0 : 1,
          transition: "opacity 1s ease",
          transitionDelay: phase === "opening" ? `${OPEN_DURATION * 0.7}ms` : "0ms",
        }}
      />

      {/* Rideau gauche */}
      <div
        className="absolute top-0 left-0 h-full w-1/2 overflow-hidden"
        style={{
          transform: phase === "opening" ? "translateX(-105%)" : "translateX(0)",
          transition: openTransition,
        }}
      >
        <div className="relative w-full h-full" style={{ background: "linear-gradient(90deg, #5a0a0a 0%, #8b1a1a 15%, #6b0f0f 25%, #a02020 40%, #7a1212 55%, #8b1a1a 70%, #6b0f0f 85%, #4a0808 100%)" }}>
          <div className="absolute inset-0" style={{
            background: "repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,0.15) 8px, transparent 16px, rgba(255,255,255,0.05) 24px, transparent 32px)",
          }} />
          <div className="absolute top-0 right-0 w-16 h-full" style={{
            background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.5))",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 30% 30%, rgba(255,200,200,0.08) 0%, transparent 60%)",
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-3" style={{
            background: "linear-gradient(180deg, #c5942a, #e8b84a, #c5942a)",
          }} />
          <div className="absolute top-[15%] right-4 w-6 h-20" style={{
            background: "linear-gradient(180deg, #c5942a, #e8b84a 50%, #c5942a)",
            borderRadius: "3px",
            boxShadow: "2px 2px 8px rgba(0,0,0,0.4)",
          }} />
        </div>
      </div>

      {/* Rideau droit */}
      <div
        className="absolute top-0 right-0 h-full w-1/2 overflow-hidden"
        style={{
          transform: phase === "opening" ? "translateX(105%)" : "translateX(0)",
          transition: openTransition,
        }}
      >
        <div className="relative w-full h-full" style={{ background: "linear-gradient(270deg, #5a0a0a 0%, #8b1a1a 15%, #6b0f0f 25%, #a02020 40%, #7a1212 55%, #8b1a1a 70%, #6b0f0f 85%, #4a0808 100%)" }}>
          <div className="absolute inset-0" style={{
            background: "repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,0.15) 8px, transparent 16px, rgba(255,255,255,0.05) 24px, transparent 32px)",
          }} />
          <div className="absolute top-0 left-0 w-16 h-full" style={{
            background: "linear-gradient(270deg, transparent, rgba(0,0,0,0.5))",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 70% 30%, rgba(255,200,200,0.08) 0%, transparent 60%)",
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-3" style={{
            background: "linear-gradient(180deg, #c5942a, #e8b84a, #c5942a)",
          }} />
          <div className="absolute top-[15%] left-4 w-6 h-20" style={{
            background: "linear-gradient(180deg, #c5942a, #e8b84a 50%, #c5942a)",
            borderRadius: "3px",
            boxShadow: "-2px 2px 8px rgba(0,0,0,0.4)",
          }} />
        </div>
      </div>

      {/* Lambrequin (cantonnière) en haut */}
      <div
        className="absolute top-0 left-0 right-0 h-16 z-10"
        style={{
          background: "linear-gradient(180deg, #6b0f0f 0%, #8b1a1a 40%, #5a0a0a 100%)",
          opacity: phase === "opening" ? 0 : 1,
          transition: "opacity 0.8s ease",
          transitionDelay: phase === "opening" ? `${OPEN_DURATION * 0.6}ms` : "0ms",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-6">
          <svg viewBox="0 0 1200 24" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,0 Q50,24 100,0 Q150,24 200,0 Q250,24 300,0 Q350,24 400,0 Q450,24 500,0 Q550,24 600,0 Q650,24 700,0 Q750,24 800,0 Q850,24 900,0 Q950,24 1000,0 Q1050,24 1100,0 Q1150,24 1200,0 L1200,24 L0,24 Z" fill="#4a0808" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{
          background: "linear-gradient(90deg, #c5942a, #e8b84a, #c5942a, #e8b84a, #c5942a)",
        }} />
      </div>

      {/* Logo Hallucine au centre pendant le rideau fermé */}
      <div
        className="absolute inset-0 flex items-center justify-center z-20"
        style={{
          opacity: phase === "closed" ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div className="text-center">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/fCazlcDpANMEbcFp.png"
            alt="Hallucine"
            className="w-48 md:w-72 h-auto mx-auto drop-shadow-[0_2px_20px_rgba(232,184,74,0.3)]"
          />
          <p className="text-white/60 text-sm tracking-[0.3em] mt-4 uppercase">Écrans de cinéma gonflables</p>
        </div>
      </div>
    </div>
  );
}
