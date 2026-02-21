/**
 * CinemaSuccessAnimation — Animation cinéma pour la confirmation de soumission du SmartForm
 * 
 * Séquence ralentie (durée totale ~6s) :
 * 1. Le clap de cinéma s'affiche ouvert (0-0.8s)
 * 2. Le clap se ferme avec son de clap (0.8-2s)
 * 3. Écran noir avec texte "ACTION !" (2-3.5s)
 * 4. Effet projecteur + fanfare qui révèle le message (3.5-5s)
 * 5. Étoiles dorées Hollywood qui apparaissent (5-6s)
 * 
 * Sons : clap de cinéma + fanfare de succès (avec bouton mute)
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Star, Volume2, VolumeX } from "lucide-react";

// URLs CDN des sons (Pixabay, libre de droits)
const SOUND_CLAP = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ZWlmlCvluSCXAtEP.mp3";
const SOUND_FANFARE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/VgpAvzNCDfZWUQoZ.mp3";

interface CinemaSuccessAnimationProps {
  prenom?: string;
}

// ─── Clap de cinéma SVG ─────────────────────────────────────────────────
function ClapperBoard({ phase }: { phase: "open" | "closing" | "closed" }) {
  return (
    <svg viewBox="0 0 200 160" className="w-56 h-auto mx-auto" xmlns="http://www.w3.org/2000/svg">
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
        transition={{ duration: 0.6, ease: "easeIn" }}
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
      transition={{ delay, duration: 0.8, ease: "backOut" }}
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
      transition={{ delay, duration: 2, ease: "easeOut" }}
    />
  );
}

// ─── Composant principal ────────────────────────────────────────────────
export default function CinemaSuccessAnimation({ prenom }: CinemaSuccessAnimationProps) {
  const [phase, setPhase] = useState<"clap-open" | "clap-closing" | "blackout" | "spotlight" | "reveal">("clap-open");
  const [muted, setMuted] = useState(false);
  const clapAudioRef = useRef<HTMLAudioElement | null>(null);
  const fanfareAudioRef = useRef<HTMLAudioElement | null>(null);

  // Pré-charger les sons
  useEffect(() => {
    clapAudioRef.current = new Audio(SOUND_CLAP);
    clapAudioRef.current.volume = 0.6;
    clapAudioRef.current.preload = "auto";

    fanfareAudioRef.current = new Audio(SOUND_FANFARE);
    fanfareAudioRef.current.volume = 0.5;
    fanfareAudioRef.current.preload = "auto";

    return () => {
      clapAudioRef.current?.pause();
      fanfareAudioRef.current?.pause();
    };
  }, []);

  // Gérer le mute
  useEffect(() => {
    if (clapAudioRef.current) clapAudioRef.current.muted = muted;
    if (fanfareAudioRef.current) fanfareAudioRef.current.muted = muted;
  }, [muted]);

  const playClap = useCallback(() => {
    if (clapAudioRef.current) {
      clapAudioRef.current.currentTime = 0;
      clapAudioRef.current.play().catch(() => {});
    }
  }, []);

  const playFanfare = useCallback(() => {
    if (fanfareAudioRef.current) {
      fanfareAudioRef.current.currentTime = 0;
      fanfareAudioRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    // Séquence d'animation ralentie (~6s total)
    const timers = [
      // Phase 1 : clap ouvert visible pendant 0.8s
      setTimeout(() => {
        setPhase("clap-closing");
        playClap(); // Son du clap quand il se ferme
      }, 800),
      // Phase 2 : blackout après fermeture du clap (1.4s pour voir la fermeture)
      setTimeout(() => setPhase("blackout"), 2000),
      // Phase 3 : projecteur s'allume avec fanfare
      setTimeout(() => {
        setPhase("spotlight");
        playFanfare();
      }, 3500),
      // Phase 4 : révélation complète avec étoiles
      setTimeout(() => setPhase("reveal"), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [playClap, playFanfare]);

  // Générer les particules de lumière (stable avec useMemo)
  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: 2.0 + Math.random() * 1.2,
    startX: 120 + (Math.random() - 0.5) * 80,
    startY: 20 + Math.random() * 30,
  })), []);

  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center min-h-[70vh]">
      {/* Bouton mute discret en haut à droite */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute top-2 right-2 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white/70"
        title={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      <AnimatePresence mode="wait">
        {/* Phase 1 & 2 : Clap de cinéma */}
        {(phase === "clap-open" || phase === "clap-closing") && (
          <motion.div
            key="clap"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center pt-4"
          >
            <ClapperBoard phase={phase === "clap-open" ? "open" : "closing"} />
            {/* Texte sous le clap */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white/50 text-sm mt-4 tracking-wider uppercase"
            >
              Preparation de votre devis...
            </motion.p>
          </motion.div>
        )}

        {/* Phase 3 : Écran noir "ACTION !" */}
        {phase === "blackout" && (
          <motion.div
            key="blackout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <motion.span
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: [0.3, 1.15, 1], opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-gold text-4xl font-black tracking-[0.3em] uppercase"
              style={{ textShadow: "0 0 40px rgba(212, 175, 55, 0.6), 0 0 80px rgba(212, 175, 55, 0.2)" }}
            >
              ACTION !
            </motion.span>
            {/* Ligne dorée décorative */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              className="w-32 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent mt-4"
            />
          </motion.div>
        )}

        {/* Phase 4 & 5 : Projecteur + Révélation */}
        {(phase === "spotlight" || phase === "reveal") && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col items-center pt-4"
          >
            {/* Effet projecteur (cône de lumière) */}
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-72 pointer-events-none"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.18, scaleY: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                background: "linear-gradient(180deg, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0) 100%)",
                clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)",
                transformOrigin: "top center",
              }}
            />

            {/* Étoile Hollywood centrale */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1.2, bounce: 0.35 }}
              className="relative z-10 mb-6"
            >
              <div className="relative">
                {/* Halo lumineux derrière l'étoile */}
                <motion.div
                  className="absolute inset-0 -m-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)",
                    borderRadius: "50%",
                    width: "90px",
                    height: "90px",
                  }}
                />
                <Star className="w-16 h-16 text-gold fill-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]" />
              </div>
            </motion.div>

            {/* Texte de remerciement */}
            <motion.h3
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-2xl font-bold text-white mb-3 relative z-10"
            >
              Merci{prenom ? ` ${prenom}` : ""} !
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="text-white/75 relative z-10 text-center px-4"
            >
              Nous avons bien recu votre demande. Notre equipe vous repondra dans les 24 heures.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-6 flex items-center justify-center gap-2 text-gold/80 text-sm relative z-10"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Vos donnees sont en securite et ne seront jamais partagees.</span>
            </motion.div>

            {/* Étoiles Hollywood décoratives autour */}
            {phase === "reveal" && (
              <>
                <HollywoodStar delay={0} x="8%" y="10%" size={18} />
                <HollywoodStar delay={0.2} x="88%" y="8%" size={14} />
                <HollywoodStar delay={0.4} x="3%" y="65%" size={12} />
                <HollywoodStar delay={0.5} x="92%" y="60%" size={16} />
                <HollywoodStar delay={0.3} x="12%" y="38%" size={10} />
                <HollywoodStar delay={0.45} x="82%" y="35%" size={11} />
                <HollywoodStar delay={0.6} x="50%" y="2%" size={9} />
                <HollywoodStar delay={0.55} x="28%" y="78%" size={13} />
                <HollywoodStar delay={0.65} x="72%" y="78%" size={10} />
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
