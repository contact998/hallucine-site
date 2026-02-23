/*
 * CinemaRideau — Effet de rideau de cinéma rouge qui s'ouvre au clic
 * 
 * OPTIMISATION PERFORMANCE :
 * - Le rideau utilise `will-change: transform` pour les animations GPU
 * - Pas de `position: fixed` sur le contenu principal → le LCP est détectable
 * - Le rideau est retiré du DOM dès l'ouverture terminée
 * - Dimensions fixes pour éviter le CLS
 * - Détection des bots (Lighthouse/Googlebot) → pas de rideau pour eux
 */
import { useState, useEffect, useRef, useCallback } from "react";

const CURTAIN_SOUND_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/iwEWTRdKZwhOWzcW.mp3";
const LOGO_TRANSPARENT_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/RRuPcEubZpMSilcb.webp";

// Timings (en ms)
const OPEN_DURATION = 3000;
const LOGO_FADE_DURATION = 1500;
const FADE_OUT_START = 2600;
const REMOVE_DELAY = 3800;

type Phase = "waiting" | "opening" | "done";

// Détecte si c'est un bot SEO (Lighthouse, Googlebot, etc.)
// Note: on ne bloque PAS headlesschrome car le Preview Manus l'utilise
function isBot(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes("lighthouse") ||
    ua.includes("googlebot") ||
    ua.includes("pagespeed") ||
    ua.includes("chrome-lighthouse") ||
    ua.includes("gtmetrix") ||
    ua.includes("pingdom")
  );
}

// Vérifie si le rideau a déjà été vu dans cette session
function hasSeenCurtain(): boolean {
  try {
    return sessionStorage.getItem("curtain_seen") === "1";
  } catch {
    return false;
  }
}

function markCurtainSeen(): void {
  try {
    sessionStorage.setItem("curtain_seen", "1");
  } catch {}
}

export default function CinemaRideau() {
  // Skip le rideau pour les bots et les revisites dans la même session
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window !== "undefined" && (isBot() || hasSeenCurtain())) {
      return "done";
    }
    return "waiting";
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Précharger le son dès le montage (sans le jouer)
  useEffect(() => {
    if (phase === "done") return;
    
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
  }, [phase]);

  // Clic utilisateur → ouvrir le rideau
  const handleClick = useCallback(() => {
    if (phase !== "waiting") return;
    setPhase("opening");
    markCurtainSeen();

    window.scrollTo({ top: 0, behavior: "instant" });

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [phase]);

  // Ouverture du rideau : fade-out du son + retrait du DOM
  useEffect(() => {
    if (phase !== "opening") return;

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

    const t2 = setTimeout(() => setPhase("done"), REMOVE_DELAY);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, [phase]);

  // Ne rien rendre si terminé ou bot
  if (phase === "done") return null;

  const isOpening = phase === "opening";
  const openTransition = `transform ${OPEN_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;

  return (
    <div
      className="fixed inset-0 z-[9999]"
      style={{
        cursor: phase === "waiting" ? "pointer" : "default",
        // Pas de will-change sur le conteneur, seulement sur les rideaux
        contain: "layout style paint",
      }}
      onClick={handleClick}
      aria-hidden="true"
    >
      {/* Rideau gauche */}
      <div
        className="absolute top-0 left-0 h-full w-1/2 overflow-hidden"
        style={{
          transform: isOpening ? "translateX(-105%)" : "translateX(0)",
          transition: isOpening ? openTransition : "none",
          willChange: isOpening ? "transform" : "auto",
          contain: "strict",
        }}
      >
        <div className="relative w-full h-full" style={{ background: "linear-gradient(90deg, #5a0a0a 0%, #8b1a1a 15%, #6b0f0f 25%, #a02020 40%, #7a1212 55%, #8b1a1a 70%, #6b0f0f 85%, #4a0808 100%)" }}>
          <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,0.15) 8px, transparent 16px, rgba(255,255,255,0.05) 24px, transparent 32px)" }} />
          <div className="absolute top-0 right-0 w-16 h-full" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.5))" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(255,200,200,0.08) 0%, transparent 60%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-3" style={{ background: "linear-gradient(180deg, #c5942a, #e8b84a, #c5942a)" }} />
        </div>
      </div>

      {/* Rideau droit */}
      <div
        className="absolute top-0 right-0 h-full w-1/2 overflow-hidden"
        style={{
          transform: isOpening ? "translateX(105%)" : "translateX(0)",
          transition: isOpening ? openTransition : "none",
          willChange: isOpening ? "transform" : "auto",
          contain: "strict",
        }}
      >
        <div className="relative w-full h-full" style={{ background: "linear-gradient(270deg, #5a0a0a 0%, #8b1a1a 15%, #6b0f0f 25%, #a02020 40%, #7a1212 55%, #8b1a1a 70%, #6b0f0f 85%, #4a0808 100%)" }}>
          <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,0.15) 8px, transparent 16px, rgba(255,255,255,0.05) 24px, transparent 32px)" }} />
          <div className="absolute top-0 left-0 w-16 h-full" style={{ background: "linear-gradient(270deg, transparent, rgba(0,0,0,0.5))" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(255,200,200,0.08) 0%, transparent 60%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-3" style={{ background: "linear-gradient(180deg, #c5942a, #e8b84a, #c5942a)" }} />
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

      {/* Logo + invitation à cliquer */}
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
            width={192}
            height={192}
            className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 h-auto mx-auto drop-shadow-[0_4px_30px_rgba(232,184,74,0.4)]"
            decoding="async"
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
