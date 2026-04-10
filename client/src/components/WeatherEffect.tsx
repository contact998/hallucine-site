/**
 * WeatherEffect — Pluie et vent animés pour les pages Tentes
 * Illustre visuellement la résistance aux intempéries
 * tsParticles pour la pluie + CSS pour vent, éclairs, condensation
 */
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

interface WeatherEffectProps {
  intensity?: "light" | "moderate" | "heavy";
  showMessage?: boolean;
}

export default function WeatherEffect({ intensity = "moderate", showMessage = true }: WeatherEffectProps) {
  if (typeof window === "undefined") return null;
  const [init, setInit] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  const particleCount = intensity === "light" ? 80 : intensity === "moderate" ? 150 : 250;

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMessageVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const rainConfig: ISourceOptions = useMemo(() => ({
    fullScreen: false,
    fpsLimit: 60,
    particles: {
      number: { value: particleCount, density: { enable: false } },
      color: { value: ["#a0b4c8", "#8899aa", "#b0c4d8", "#7090b0"] },
      shape: { type: "line" },
      opacity: {
        value: { min: 0.15, max: 0.5 },
      },
      size: {
        value: { min: 1, max: 3 },
      },
      move: {
        enable: true,
        speed: { min: 18, max: 40 },
        direction: "bottom-right" as const,
        straight: true,
        outModes: { default: "out" as const },
      },
      rotate: {
        value: 15,
        direction: "clockwise" as const,
      },
    },
    detectRetina: true,
  }), [particleCount]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      {/* Pluie via tsParticles */}
      {init && (
        <Particles
          id="rain-particles"
          options={rainConfig}
          className="absolute inset-0 w-full h-full"
        />
      )}

      {/* Overlay sombre pour ambiance orage */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/20" />

      {/* Éclairs subtils — flash aléatoire */}
      <div className="absolute inset-0 animate-lightning opacity-0" />

      {/* Vent — lignes horizontales animées */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-wind"
            style={{
              top: `${10 + i * 12}%`,
              left: "-100%",
              width: `${30 + Math.random() * 40}%`,
              animationDelay: `${i * 0.4 + Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gouttes sur la "vitre" — effet condensation */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`drop-${i}`}
            className="absolute rounded-full bg-white/5 backdrop-blur-[1px] animate-droplet"
            style={{
              width: `${3 + Math.random() * 6}px`,
              height: `${8 + Math.random() * 15}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 80}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Message "Résiste aux intempéries" */}
      {showMessage && (
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
            messageVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ zIndex: 10 }}
        >
          <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-white text-sm font-semibold tracking-wide">
              Résiste aux intempéries — Étanche à l'air
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wind {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(250vw); opacity: 0; }
        }
        .animate-wind {
          animation: wind 3s linear infinite;
        }
        @keyframes lightning {
          0%, 95%, 100% { opacity: 0; }
          96% { opacity: 0.3; background: rgba(200, 220, 255, 0.15); }
          97% { opacity: 0; }
          98% { opacity: 0.15; background: rgba(200, 220, 255, 0.1); }
        }
        .animate-lightning {
          animation: lightning 8s ease-in-out infinite;
          animation-delay: 3s;
        }
        @keyframes droplet {
          0% { transform: translateY(0) scaleY(1); opacity: 0.3; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100px) scaleY(1.5); opacity: 0; }
        }
        .animate-droplet {
          animation: droplet 4s ease-in infinite;
        }
      `}</style>
    </div>
  );
}
