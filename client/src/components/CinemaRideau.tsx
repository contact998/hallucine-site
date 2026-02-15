/*
 * CinemaRideau — Effet de rideau de cinéma rouge qui s'ouvre au chargement
 * Deux pans de rideau rouge avec plis réalistes qui s'écartent vers les côtés,
 * accompagnés d'un son d'ouverture de rideau de théâtre.
 * Le composant disparaît complètement du DOM après l'animation.
 */
import { useState, useEffect, useRef } from "react";

const CURTAIN_SOUND_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/iwEWTRdKZwhOWzcW.mp3";

export default function CinemaRideau() {
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Précharger le son
    const audio = new Audio(CURTAIN_SOUND_URL);
    audio.volume = 0.5;
    audio.preload = "auto";
    audioRef.current = audio;

    // Petit délai pour que le rideau fermé soit visible avant de s'ouvrir
    const t1 = setTimeout(() => {
      setPhase("opening");
      // Jouer le son au moment de l'ouverture
      audio.play().catch(() => {
        // Autoplay bloqué par le navigateur — on ignore silencieusement
      });
    }, 400);

    // Retirer le rideau du DOM après l'animation
    const t2 = setTimeout(() => setPhase("done"), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      {/* Fond noir derrière le rideau */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-700"
        style={{ opacity: phase === "opening" ? 0 : 1, transitionDelay: phase === "opening" ? "0.8s" : "0s" }}
      />

      {/* Rideau gauche */}
      <div
        className="absolute top-0 left-0 h-full w-1/2 overflow-hidden"
        style={{
          transform: phase === "opening" ? "translateX(-105%)" : "translateX(0)",
          transition: "transform 1.4s cubic-bezier(0.65, 0, 0.35, 1)",
          transitionDelay: "0.1s",
        }}
      >
        <div className="relative w-full h-full" style={{ background: "linear-gradient(90deg, #5a0a0a 0%, #8b1a1a 15%, #6b0f0f 25%, #a02020 40%, #7a1212 55%, #8b1a1a 70%, #6b0f0f 85%, #4a0808 100%)" }}>
          {/* Plis du rideau */}
          <div className="absolute inset-0" style={{
            background: "repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,0.15) 8px, transparent 16px, rgba(255,255,255,0.05) 24px, transparent 32px)",
          }} />
          {/* Ombre profonde sur le bord */}
          <div className="absolute top-0 right-0 w-16 h-full" style={{
            background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.5))",
          }} />
          {/* Reflet soyeux */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 30% 30%, rgba(255,200,200,0.08) 0%, transparent 60%)",
          }} />
          {/* Frange dorée en bas */}
          <div className="absolute bottom-0 left-0 right-0 h-3" style={{
            background: "linear-gradient(180deg, #c5942a, #e8b84a, #c5942a)",
          }} />
          {/* Embrasse dorée */}
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
          transition: "transform 1.4s cubic-bezier(0.65, 0, 0.35, 1)",
          transitionDelay: "0.1s",
        }}
      >
        <div className="relative w-full h-full" style={{ background: "linear-gradient(270deg, #5a0a0a 0%, #8b1a1a 15%, #6b0f0f 25%, #a02020 40%, #7a1212 55%, #8b1a1a 70%, #6b0f0f 85%, #4a0808 100%)" }}>
          {/* Plis du rideau */}
          <div className="absolute inset-0" style={{
            background: "repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,0.15) 8px, transparent 16px, rgba(255,255,255,0.05) 24px, transparent 32px)",
          }} />
          {/* Ombre profonde sur le bord */}
          <div className="absolute top-0 left-0 w-16 h-full" style={{
            background: "linear-gradient(270deg, transparent, rgba(0,0,0,0.5))",
          }} />
          {/* Reflet soyeux */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 70% 30%, rgba(255,200,200,0.08) 0%, transparent 60%)",
          }} />
          {/* Frange dorée en bas */}
          <div className="absolute bottom-0 left-0 right-0 h-3" style={{
            background: "linear-gradient(180deg, #c5942a, #e8b84a, #c5942a)",
          }} />
          {/* Embrasse dorée */}
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
          transition: "opacity 0.6s ease",
          transitionDelay: phase === "opening" ? "1s" : "0s",
        }}
      >
        {/* Ondulations du lambrequin */}
        <div className="absolute bottom-0 left-0 right-0 h-6">
          <svg viewBox="0 0 1200 24" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,0 Q50,24 100,0 Q150,24 200,0 Q250,24 300,0 Q350,24 400,0 Q450,24 500,0 Q550,24 600,0 Q650,24 700,0 Q750,24 800,0 Q850,24 900,0 Q950,24 1000,0 Q1050,24 1100,0 Q1150,24 1200,0 L1200,24 L0,24 Z" fill="#4a0808" />
          </svg>
        </div>
        {/* Frange dorée du lambrequin */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{
          background: "linear-gradient(90deg, #c5942a, #e8b84a, #c5942a, #e8b84a, #c5942a)",
        }} />
      </div>

      {/* Logo Hallucine au centre pendant le rideau fermé */}
      <div
        className="absolute inset-0 flex items-center justify-center z-20"
        style={{
          opacity: phase === "closed" ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-[#e8b84a] tracking-wider" style={{
            fontFamily: "'Playfair Display', serif",
            textShadow: "0 2px 20px rgba(232,184,74,0.3)",
          }}>
            HALLUCINE
          </h2>
          <p className="text-white/60 text-sm tracking-[0.3em] mt-2 uppercase">Écrans de cinéma gonflables</p>
        </div>
      </div>
    </div>
  );
}
