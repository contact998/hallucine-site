/**
 * GearsEffect — Engrenages animés pour la page Mode d'emploi
 * Ambiance technique, montage, mécanique
 */
export default function GearsEffect() {
  // Arrondi à 3 décimales : Math.sin/cos ne sont pas bit-identiques entre le
  // V8 de Node (prerender SSR) et celui du navigateur — l'arrondi rend les
  // coordonnées SVG déterministes et évite un mismatch d'hydratation.
  const r = (n: number) => Math.round(n * 1000) / 1000;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Grand engrenage — coin supérieur droit */}
      <svg
        className="absolute -top-20 -right-20 w-64 h-64 text-white/[0.03] animate-spin-slow"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50 10 L53 0 L47 0 Z M50 90 L53 100 L47 100 Z M10 50 L0 53 L0 47 Z M90 50 L100 53 L100 47 Z M22 22 L15 15 L20 20 Z M78 22 L85 15 L80 20 Z M22 78 L15 85 L20 80 Z M78 78 L85 85 L80 80 Z" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="8" fill="none" />
        <circle cx="50" cy="50" r="12" />
        {/* Dents */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = r(50 + 28 * Math.cos(angle));
          const y1 = r(50 + 28 * Math.sin(angle));
          const x2 = r(50 + 38 * Math.cos(angle));
          const y2 = r(50 + 38 * Math.sin(angle));
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="6" strokeLinecap="round" />;
        })}
      </svg>

      {/* Petit engrenage — coin inférieur gauche */}
      <svg
        className="absolute -bottom-10 -left-10 w-40 h-40 text-white/[0.03] animate-spin-slow-reverse"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="6" fill="none" />
        <circle cx="50" cy="50" r="8" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = r(50 + 22 * Math.cos(angle));
          const y1 = r(50 + 22 * Math.sin(angle));
          const x2 = r(50 + 32 * Math.cos(angle));
          const y2 = r(50 + 32 * Math.sin(angle));
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="5" strokeLinecap="round" />;
        })}
      </svg>

      {/* Clé à molette flottante */}
      <svg
        className="absolute top-1/3 right-[8%] w-16 h-16 text-white/[0.04] animate-float"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow 20s linear infinite reverse;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
