/**
 * BokehEffect — Lumières tamisées / bokeh pour les pages Mobilier
 * Ambiance lounge, soirée élégante
 */
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export default function BokehEffect() {
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
      number: { value: 20, density: { enable: false } },
      color: {
        value: ["#D4AF37", "#FFD700", "#E8C84A", "#F5DEB3", "#FFF8DC"],
      },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.05, max: 0.2 },
        animation: { enable: true, speed: 0.3, startValue: "random", sync: false },
      },
      size: {
        value: { min: 20, max: 80 },
        animation: { enable: true, speed: 2, startValue: "random", sync: false },
      },
      shadow: {
        enable: true,
        color: "#D4AF37",
        blur: 30,
        offset: { x: 0, y: 0 },
      },
      move: {
        enable: true,
        speed: { min: 0.1, max: 0.4 },
        direction: "none" as const,
        outModes: { default: "bounce" as const },
        straight: false,
        random: true,
      },
    },
    detectRetina: true,
  }), []);

  if (!init) return null;

  return (
    <Particles
      id="bokeh-particles"
      options={options}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1, filter: "blur(8px)" }}
    />
  );
}
