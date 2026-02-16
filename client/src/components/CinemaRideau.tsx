/*
 * CinemaRideau — Effet de rideau de cinéma rouge qui s'ouvre au clic
 * Pas de fond noir : le rideau s'ouvre directement sur la page d'accueil.
 * Le logo s'efface progressivement (fade-out) pendant l'ouverture.
 * Le clic initial contourne la politique autoplay des navigateurs.
 */
import { useState, useEffect, useRef, useCallback } from "react";

const CURTAIN_SOUND_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/iwEWTRdKZwhOWzcW.mp3";
const LOGO_TRANSPARENT_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/tWSEvNLkFkmjxAXj.png";

// Timings (en ms)
const OPEN_DURATION = 3000;       // Durée de l'animation d'ouverture (lente)
const LOGO_FADE_DURATION = 1500;  // Durée du fade-out du logo
const FADE_OUT_START = 2600;      // Début du fade-out du son
const REMOVE_DELAY = 3800;        // Retrait du DOM

type Phase = "waiting" | "opening" | "done";

export default function CinemaRideau() {
  const [phase, setPhase] = useState<Phase>("waiting");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Précharger le son dès le montage (sans le jouer)
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = 0.6;
    audio.src = CURTAIN_SOUND_URL;
    audio.load();
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Clic utilisateur → ouvrir le rideau directement avec le son
  const handleClick = useCallback(() => {
    if (phase !== "waiting") return;
    setPhase("opening");

    // Jouer le son du rideau (le clic autorise l'autoplay)
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [phase]);

  // Ouverture du rideau : fade-out du son + retrait du DOM
  useEffect(() => {
    if (phase !== "opening") return;

    // Fade-out du son vers la fin de l'ouverture
    const t1 = setTimeout(() => {
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
  const openTransition = `transform ${OPEN_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto"
      style={{ cursor: phase === "waiting" ? "pointer" : "default" }}
      onClick={handleClick}
      aria-hidden="true"
    >
      {/* PAS de fond noir — la page d'accueil est visible derrière les rideaux */}

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
          transition: `opacity 0.8s ease`,
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

      {/* Logo + invitation à cliquer — s'efface progressivement pendant l'ouverture */}
      <div
        className="absolute inset-0 flex items-center justify-center z-20"
        style={{
          opacity: isOpening ? 0 : 1,
          transition: `opacity ${LOGO_FADE_DURATION}ms ease-out`,
          pointerEvents: isOpening ? "none" : "auto",
        }}
      >
        <div className="text-center">
          <img
            src={LOGO_TRANSPARENT_URL}
            alt="Hallucine"
            className="w-40 sm:w-52 md:w-64 lg:w-80 xl:w-96 h-auto mx-auto drop-shadow-[0_4px_30px_rgba(232,184,74,0.4)]"
          />
          <p className="text-white/60 text-sm tracking-[0.3em] mt-4 uppercase">Écrans de cinéma gonflables</p>
          <p className="text-amber-400/80 text-xs tracking-[0.2em] mt-6 uppercase animate-pulse">
            Cliquez pour entrer
          </p>
        </div>
      </div>
    </div>
  );
}
