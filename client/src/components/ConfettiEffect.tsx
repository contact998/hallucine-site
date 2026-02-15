/**
 * ConfettiEffect — Confettis colorés pour les pages Arches
 * Ambiance événementielle festive
 */
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export default function ConfettiEffect() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options: ISourceOptions = useMemo(() => ({
    fullScreen: false,
    fpsLimit: 60,
    particles: {
      number: { value: 40, density: { enable: false } },
      color: {
        value: ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6C5CE7", "#FF85A2", "#00B894", "#D4AF37", "#E17055"],
      },
      shape: {
        type: ["circle", "square", "triangle"],
      },
      opacity: {
        value: { min: 0.3, max: 0.7 },
        animation: { enable: true, speed: 0.5, startValue: "random", sync: false },
      },
      size: {
        value: { min: 3, max: 8 },
      },
      move: {
        enable: true,
        direction: "bottom" as const,
        speed: { min: 1, max: 4 },
        outModes: { default: "out" as const },
        straight: false,
        random: true,
        drift: 2,
      },
      rotate: {
        value: { min: 0, max: 360 },
        direction: "random" as const,
        animation: { enable: true, speed: 10 },
      },
      wobble: {
        enable: true,
        distance: 15,
        speed: 8,
      },
      tilt: {
        enable: true,
        direction: "random" as const,
        value: { min: 0, max: 360 },
        animation: { enable: true, speed: 12 },
      },
    },
    detectRetina: true,
  }), []);

  if (!init) return null;

  return (
    <Particles
      id="confetti-particles"
      options={options}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}
