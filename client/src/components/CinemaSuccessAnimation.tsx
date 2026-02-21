/**
 * CinemaSuccessAnimation — Animation cinéma pour la confirmation de soumission du SmartForm
 * 
 * Séquence :
 * 1. Le clap de cinéma se ferme (0-0.6s)
 * 2. Écran noir avec texte "ACTION !" (0.6-1.4s)
 * 3. Effet projecteur qui s'allume et révèle le message de remerciement (1.4-2.2s)
 * 4. Étoiles dorées Hollywood qui apparaissent autour (2.2-3s)
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Star } from "lucide-react";

interface CinemaSuccessAnimationProps {
  prenom?: string;
}

// ─── Clap de cinéma SVG ─────────────────────────────────────────────────
function ClapperBoard({ phase }: { phase: "open" | "closing" | "closed" }) {
  return (
    <svg viewBox="0 0 200 160" className="w-48 h-auto mx-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Corps du clap */}
      <rect x="20" y="60" width="160" height="90" rx="6" fill="#1a1a2e" stroke="#D4AF37" strokeWidth="2" />
      {/* Lignes diagonales sur le corps */}
      <line x1="20" y1="80" x2="180" y2="80" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="100" x2="180" y2="100" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="120" x2="180" y2="120" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
      {/* Texte sur le clap */}
      <text x="100" y="95" textAnchor="middle" fill="#D4AF37" fontSize="11" fontWeight="bold" fontFamily="sans-serif">HALLUCINE</text>
      <text x="100" y="115" textAnchor="middle" fill="#D4AF37" fontSize="8" opacity="0.7" fontFamily="sans-serif">VOTRE DEVIS</text>
      <text x="100" y="140" textAnchor="middle" fill="#D4AF37" fontSize="7" opacity="0.5" fontFamily="sans-serif">SCENE 1 — PRISE 1</text>
      {/* Partie supérieure (barre du clap) — fixe */}
      <rect x="20" y="45" width="160" height="20" rx="3" fill="#D4AF37" />
      {/* Rayures diagonales sur la barre fixe */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={`stripe-bottom-${i}`} x={28 + i * 20} y="45" width="10" height="20" fill="#1a1a2e" opacity="0.8"
          transform={`skewX(-15) translate(${i * 0}, 0)`}
        />
      ))}
      {/* Partie mobile (barre qui claque) */}
      <motion.g
        style={{ originX: "20px", originY: "45px" }}
        animate={
          phase === "open" ? { rotate: -30 } :
          phase === "closing" ? { rotate: 0 } :
          { rotate: 0 }
        }
        transition={{ duration: 0.4, ease: "easeIn" }}
      >
        <rect x="20" y="25" width="160" height="20" rx="3" fill="#D4AF37" />
        {/* Rayures diagonales sur la barre mobile */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={`stripe-top-${i}`} x={28 + i * 20} y="25" width="10" height="20" fill="#1a1a2e" opacity="0.8"
            transform={`skewX(-15) translate(${i * 0}, 0)`}
          />
        ))}
      </motion.g>
      {/* Pivot du clap */}
      <circle cx="30" cy="45" r="5" fill="#D4AF37" stroke="#1a1a2e" strokeWidth="2" />
    </svg>
  );
}

// ─── Étoile Hollywood ───────────────────────────────────────────────────
function HollywoodStar({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 0, rotate: -30 }}
      animate={{ scale: 1, opacity: [0, 1, 0.8], rotate: 0 }}
      transition={{ delay, duration: 0.6, ease: "backOut" }}
    >
      <Star className="text-gold fill-gold" style={{ width: size, height: size }} />
    </motion.div>
  );
}

// ─── Particule lumineuse (poussière de projecteur) ──────────────────────
function LightParticle({ delay, startX, startY }: { delay: number; startX: number; startY: number }) {
  const endX = startX + (Math.random() - 0.5) * 120;
  const endY = startY + Math.random() * 60 + 20;
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-gold/60"
      style={{ left: startX, top: startY }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1.5, 0],
        x: endX - startX,
        y: endY - startY,
      }}
      transition={{ delay, duration: 1.5, ease: "easeOut" }}
    />
  );
}

// ─── Composant principal ────────────────────────────────────────────────
export default function CinemaSuccessAnimation({ prenom }: CinemaSuccessAnimationProps) {
  const [phase, setPhase] = useState<"clap-open" | "clap-closing" | "blackout" | "spotlight" | "reveal">("clap-open");

  useEffect(() => {
    // Séquence d'animation
    const timers = [
      setTimeout(() => setPhase("clap-closing"), 300),
      setTimeout(() => setPhase("blackout"), 700),
      setTimeout(() => setPhase("spotlight"), 1500),
      setTimeout(() => setPhase("reveal"), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Générer les particules de lumière
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    delay: 1.6 + Math.random() * 0.8,
    startX: 120 + (Math.random() - 0.5) * 60,
    startY: 30 + Math.random() * 20,
  }));

  return (
    <div className="relative py-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Phase 1 & 2 : Clap de cinéma */}
        {(phase === "clap-open" || phase === "clap-closing") && (
          <motion.div
            key="clap"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <ClapperBoard phase={phase === "clap-open" ? "open" : "closing"} />
          </motion.div>
        )}

        {/* Phase 3 : Écran noir "ACTION !" */}
        {phase === "blackout" && (
          <motion.div
            key="blackout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3, type: "spring" }}
              className="text-gold text-3xl font-black tracking-[0.3em] uppercase"
              style={{ textShadow: "0 0 30px rgba(212, 175, 55, 0.5)" }}
            >
              ACTION !
            </motion.span>
          </motion.div>
        )}

        {/* Phase 4 : Projecteur + Révélation */}
        {(phase === "spotlight" || phase === "reveal") && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col items-center"
          >
            {/* Effet projecteur (cône de lumière) */}
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-64 pointer-events-none"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.15, scaleY: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                background: "linear-gradient(180deg, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0) 100%)",
                clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)",
                transformOrigin: "top center",
              }}
            />

            {/* Étoile Hollywood centrale (remplace le checkmark) */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
              className="relative z-10 mb-5"
            >
              <div className="relative">
                {/* Halo lumineux derrière l'étoile */}
                <motion.div
                  className="absolute inset-0 -m-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)",
                    borderRadius: "50%",
                    width: "80px",
                    height: "80px",
                  }}
                />
                <Star className="w-16 h-16 text-gold fill-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
              </div>
            </motion.div>

            {/* Texte de remerciement */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-bold text-white mb-3 relative z-10"
            >
              Merci{prenom ? ` ${prenom}` : ""} !
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-white/75 relative z-10"
            >
              Nous avons bien recu votre demande. Notre equipe vous repondra dans les 24 heures.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6 flex items-center justify-center gap-2 text-gold/80 text-sm relative z-10"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Vos donnees sont en securite et ne seront jamais partagees.</span>
            </motion.div>

            {/* Étoiles Hollywood décoratives autour */}
            {phase === "reveal" && (
              <>
                <HollywoodStar delay={0} x="8%" y="15%" size={18} />
                <HollywoodStar delay={0.15} x="85%" y="10%" size={14} />
                <HollywoodStar delay={0.3} x="5%" y="70%" size={12} />
                <HollywoodStar delay={0.4} x="90%" y="65%" size={16} />
                <HollywoodStar delay={0.2} x="15%" y="40%" size={10} />
                <HollywoodStar delay={0.35} x="80%" y="40%" size={11} />
                <HollywoodStar delay={0.5} x="50%" y="5%" size={9} />
                <HollywoodStar delay={0.45} x="30%" y="80%" size={13} />
                <HollywoodStar delay={0.55} x="70%" y="80%" size={10} />
              </>
            )}

            {/* Particules lumineuses (poussière de projecteur) */}
            {particles.map((p) => (
              <LightParticle key={p.id} delay={p.delay} startX={p.startX} startY={p.startY} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
