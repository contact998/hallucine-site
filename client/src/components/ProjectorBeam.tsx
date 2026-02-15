/*
 * ProjectorBeam — Faisceau de projecteur de cinéma animé
 * Halo blanc intense qui balaye de gauche à droite + cône de lumière statique coin supérieur droit
 */
import { useEffect, useRef } from "react";

export default function ProjectorBeam() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.003;

      // === Faisceau balayant de gauche à droite ===
      const sweepX = (Math.sin(time) * 0.5 + 0.5) * canvas.width;
      const beamWidth = canvas.width * 0.3;

      // Gradient vertical pour le faisceau — BLANC INTENSE
      const beamGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      beamGrad.addColorStop(0, "rgba(255, 255, 255, 0.30)");
      beamGrad.addColorStop(0.2, "rgba(255, 255, 255, 0.18)");
      beamGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.08)");
      beamGrad.addColorStop(0.8, "rgba(255, 255, 255, 0.03)");
      beamGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.save();
      ctx.beginPath();
      // Forme trapézoïdale du faisceau (étroit en haut, large en bas)
      const topWidth = beamWidth * 0.1;
      ctx.moveTo(sweepX - topWidth, 0);
      ctx.lineTo(sweepX + topWidth, 0);
      ctx.lineTo(sweepX + beamWidth, canvas.height);
      ctx.lineTo(sweepX - beamWidth, canvas.height);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();

      // Halo central du faisceau — BLANC INTENSE
      const haloGrad = ctx.createRadialGradient(
        sweepX, canvas.height * 0.1, 0,
        sweepX, canvas.height * 0.1, beamWidth * 0.8
      );
      haloGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
      haloGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.15)");
      haloGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.05)");
      haloGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = haloGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // === Cône de lumière statique depuis le coin supérieur droit — BLANC INTENSE ===
      ctx.save();
      const coneX = canvas.width * 0.92;
      const coneY = 0;
      const coneSpread = canvas.width * 0.45;

      const coneGrad = ctx.createRadialGradient(
        coneX, coneY, 0,
        coneX, coneY, coneSpread
      );
      coneGrad.addColorStop(0, "rgba(255, 255, 255, 0.22)");
      coneGrad.addColorStop(0.2, "rgba(255, 255, 255, 0.12)");
      coneGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
      coneGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.beginPath();
      ctx.moveTo(coneX, coneY);
      ctx.lineTo(coneX - coneSpread * 0.8, canvas.height * 0.7);
      ctx.lineTo(coneX + coneSpread * 0.3, canvas.height * 0.9);
      ctx.closePath();
      ctx.fillStyle = coneGrad;
      ctx.fill();

      // Point lumineux source (projecteur) — BLANC VIF
      const dotGrad = ctx.createRadialGradient(coneX, coneY + 5, 0, coneX, coneY + 5, 45);
      dotGrad.addColorStop(0, "rgba(255, 255, 255, 0.60)");
      dotGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.25)");
      dotGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.08)");
      dotGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = dotGrad;
      ctx.fillRect(coneX - 50, coneY - 10, 100, 60);
      ctx.restore();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  );
}
