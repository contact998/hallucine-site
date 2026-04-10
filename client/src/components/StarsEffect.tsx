/**
 * StarsEffect — Étoiles scintillantes pour les pages Accessoires
 * Ambiance cinéma en plein air sous les étoiles
 */
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export default function StarsEffect() {
  if (typeof window === 'undefined') return null;
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options: ISourceOptions = useMemo(() => ({
    fullScreen: false,
    fpsLimit: 30,
    particles: {
      number: { value: 60, density: { enable: false } },
      color: { value: ["#FFFFFF", "#FFD700", "#E8E8FF", "#FFF5CC"] },
      shape: { type: "star" },
      opacity: {
        value: { min: 0.1, max: 0.8 },
        animation: { enable: true, speed: 0.5, startValue: "random", sync: false },
      },
      size: {
        value: { min: 1, max: 4 },
      },
      move: {
        enable: true,
        speed: { min: 0.05, max: 0.2 },
        direction: "none" as const,
        outModes: { default: "bounce" as const },
        straight: false,
        random: true,
      },
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.15,
          color: "#FFFFFF",
          opacity: 1,
        },
      },
      shadow: {
        enable: true,
        color: "#FFFFFF",
        blur: 8,
        offset: { x: 0, y: 0 },
      },
    },
    detectRetina: true,
  }), []);

  if (!init) return null;

  return (
    <Particles
      id="stars-particles"
      options={options}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
