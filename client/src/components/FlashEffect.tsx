/**
 * FlashEffect — Flash photo pour la page Galerie
 * Simule des flashs de photographe aléatoires
 */
import { useEffect, useState } from "react";

export default function FlashEffect() {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const triggerFlash = () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 150);
    };

    // Flash initial après 2s
    const initial = setTimeout(triggerFlash, 2000);

    // Flash aléatoire toutes les 5-12 secondes
    const interval = setInterval(() => {
      triggerFlash();
    }, 5000 + Math.random() * 7000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Flash overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity ${
          flash ? "opacity-100" : "opacity-0"
        }`}
        style={{
          zIndex: 10,
          background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 30%, transparent 60%)",
          transitionDuration: flash ? "50ms" : "300ms",
        }}
      />

      {/* Icône appareil photo subtile */}
      <div
        className={`absolute top-6 right-6 pointer-events-none transition-all duration-300 ${
          flash ? "opacity-80 scale-110" : "opacity-20 scale-100"
        }`}
        style={{ zIndex: 11 }}
      >
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>

      {/* Son de shutter subtil via CSS animation */}
      <style>{`
        @keyframes shutter-line {
          0% { transform: scaleX(0); opacity: 0; }
          50% { transform: scaleX(1); opacity: 0.3; }
          100% { transform: scaleX(0); opacity: 0; }
        }
      `}</style>
    </>
  );
}
