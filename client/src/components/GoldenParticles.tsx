/*
 * GoldenParticles — Particules dorées flottantes avec tsParticles
 * Monte depuis le bas, glow, tailles variées, scintillement
 */
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

interface GoldenParticlesProps {
  count?: number;
  id?: string;
}

export default function GoldenParticles({ count = 35, id = "golden-particles" }: GoldenParticlesProps) {
  if (typeof window === "undefined") return null;
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
      number: {
        value: count,
        density: { enable: false },
      },
      color: {
        value: ["#FFD700", "#D4AF37", "#FFE680", "#FFC107", "#F0C040"],
      },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.2, max: 0.7 },
        animation: {
          enable: true,
          speed: 0.8,
          startValue: "random",
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 4 },
        animation: {
          enable: true,
          speed: 1.5,
          startValue: "random",
          sync: false,
        },
      },
      shadow: {
        enable: true,
        color: "#FFD700",
        blur: 12,
        offset: { x: 0, y: 0 },
      },
      move: {
        enable: true,
        direction: "top" as const,
        speed: { min: 0.3, max: 1.2 },
        outModes: { default: "out" as const },
        straight: false,
        random: true,
        drift: 0.5,
      },
      wobble: {
        enable: true,
        distance: 8,
        speed: 5,
      },
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.08,
          color: "#FFFFFF",
          opacity: 0.9,
        },
      },
    },
    detectRetina: true,
  }), [count]);

  if (!init) return null;

  return (
    <Particles
      id={id}
      options={options}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 3 }}
    />
  );
}
