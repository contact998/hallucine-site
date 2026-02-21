/**
 * CinemaSuccessAnimation — Luxury Brand Reveal
 *
 * Animation ultra luxe minimaliste style pub parfum haut de gamme.
 * Fond velvet noir, anneaux dorés concentriques, logo Halluciné,
 * rugissement de lion au moment du reveal.
 *
 * Timeline (~7s) :
 *  0:00 — Noir pur velvet
 *  0:01 — Glow or champagne au centre
 *  0:02 — Anneaux concentriques dorés émergent un par un
 *  0:03 — Léger zoom cinématique (push-in)
 *  0:04 — Logo Halluciné + rugissement de lion
 *  0:05 — Stabilisation, particules dorées
 *  0:06 — Texte de confirmation
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

// CDN assets
const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/KqTihVENIErkZLZP.png";
const LION_ROAR_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/yuhDGjetZRdDdWwT.mp3";

interface CinemaSuccessAnimationProps {
  prenom?: string;
}

// ─── Anneau concentrique doré ──────────────────────────────────────────
function GoldRing({ size, delay, thickness = 1 }: { size: number; delay: number; thickness?: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        marginTop: -size / 2,
        marginLeft: -size / 2,
        border: `${thickness}px solid rgba(201, 169, 110, 0)`,
      }}
      initial={{
        borderColor: "rgba(201, 169, 110, 0)",
        scale: 0.8,
      }}
      animate={{
        borderColor: ["rgba(201, 169, 110, 0)", "rgba(201, 169, 110, 0.5)", "rgba(201, 169, 110, 0.25)"],
        scale: 1,
      }}
      transition={{
        delay,
        duration: 1.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    />
  );
}

// ─── Particule dorée subtile ───────────────────────────────────────────
function GoldParticle({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-[2px] h-[2px] rounded-full"
      style={{
        left: x,
        top: y,
        background: "rgba(201, 169, 110, 0.3)",
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.6, 0.4, 0.2, 0],
        y: [0, -20],
        scale: [1, 1.5, 1],
      }}
      transition={{
        delay,
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    />
  );
}

// ─── Composant principal ────────────────────────────────────────────────
export default function CinemaSuccessAnimation({ prenom }: CinemaSuccessAnimationProps) {
  const [phase, setPhase] = useState<"black" | "glow" | "rings" | "logo" | "text">("black");
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pré-charger le son
  useEffect(() => {
    audioRef.current = new Audio(LION_ROAR_URL);
    audioRef.current.volume = 0.7;
    audioRef.current.preload = "auto";
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Gérer le mute
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const playLionRoar = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  // Séquence d'animation
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("glow"), 1000),
      setTimeout(() => setPhase("rings"), 1800),
      setTimeout(() => {
        setPhase("logo");
        playLionRoar();
      }, 3500),
      setTimeout(() => setPhase("text"), 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [playLionRoar]);

  // Particules stables
  const particles = useMemo(() => [
    { x: "45%", y: "35%", delay: 4.0 },
    { x: "55%", y: "40%", delay: 4.3 },
    { x: "42%", y: "55%", delay: 4.6 },
    { x: "58%", y: "50%", delay: 4.9 },
    { x: "48%", y: "45%", delay: 5.2 },
    { x: "52%", y: "58%", delay: 5.5 },
  ], []);

  // Anneaux stables
  const rings = useMemo(() => [
    { size: 60, delay: 1.8, thickness: 1.5 },
    { size: 100, delay: 2.0, thickness: 1 },
    { size: 145, delay: 2.2, thickness: 1 },
    { size: 190, delay: 2.4, thickness: 1.5 },
    { size: 240, delay: 2.6, thickness: 1 },
    { size: 290, delay: 2.8, thickness: 1 },
    { size: 340, delay: 3.0, thickness: 1.5 },
  ], []);

  const phaseIndex = ["black", "glow", "rings", "logo", "text"].indexOf(phase);

  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        minHeight: "70vh",
        background: "radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)",
      }}
    >
      {/* Vignettage cinématique */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Barres cinémascope */}
      <div className="absolute top-0 left-0 right-0 h-[12%] bg-black z-30" />
      <div className="absolute bottom-0 left-0 right-0 h-[12%] bg-black z-30" />

      {/* Bouton mute */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute top-[14%] right-3 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        title={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? (
          <VolumeX className="w-4 h-4" style={{ color: "rgba(201, 169, 110, 0.3)" }} />
        ) : (
          <Volume2 className="w-4 h-4" style={{ color: "rgba(201, 169, 110, 0.5)" }} />
        )}
      </button>

      {/* Glow or champagne central */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, rgba(201,169,110,0.05) 40%, transparent 70%)",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={phaseIndex >= 1 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* Conteneur zoom cinématique */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.97 }}
        animate={phaseIndex >= 2 ? { scale: 1.03 } : {}}
        transition={{ duration: 6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Anneaux concentriques dorés */}
        <div className="absolute" style={{ width: 340, height: 340 }}>
          {phaseIndex >= 2 && rings.map((ring, i) => (
            <GoldRing key={i} size={ring.size} delay={ring.delay} thickness={ring.thickness} />
          ))}
          {/* Pulsation douce des anneaux après reveal */}
          {phaseIndex >= 4 && (
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.015, 1] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            />
          )}
        </div>

        {/* Logo Halluciné */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, filter: "brightness(0.3)", scale: 0.95 }}
          animate={
            phaseIndex >= 3
              ? { opacity: 1, filter: "brightness(1)", scale: 1 }
              : {}
          }
          transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Rim light or */}
          <motion.div
            className="absolute -inset-2 rounded-lg"
            initial={{ opacity: 0 }}
            animate={phaseIndex >= 3 ? { opacity: 1 } : {}}
            transition={{ delay: 0.7, duration: 2, ease: "easeOut" }}
            style={{
              boxShadow:
                "0 0 30px rgba(201, 169, 110, 0.15), 0 0 60px rgba(201, 169, 110, 0.08), inset 0 0 30px rgba(201, 169, 110, 0.05)",
            }}
          />
          {/* Inner glow bleu subtil */}
          <motion.div
            className="absolute inset-0 rounded"
            initial={{ opacity: 0 }}
            animate={phaseIndex >= 3 ? { opacity: 1 } : {}}
            transition={{ delay: 1.0, duration: 2, ease: "easeOut" }}
            style={{
              boxShadow: "inset 0 0 40px rgba(42, 74, 127, 0.2)",
            }}
          />
          <img
            src={LOGO_URL}
            alt="Halluciné"
            className="block"
            style={{ width: 280, height: "auto" }}
          />
        </motion.div>
      </motion.div>

      {/* Particules dorées subtiles */}
      {phaseIndex >= 3 && particles.map((p, i) => (
        <GoldParticle key={i} x={p.x} y={p.y} delay={p.delay} />
      ))}

      {/* Ligne dorée fine */}
      <motion.div
        className="absolute"
        style={{
          bottom: "22%",
          left: "50%",
          transform: "translateX(-50%)",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.4), transparent)",
        }}
        initial={{ width: 0 }}
        animate={phaseIndex >= 4 ? { width: 120 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Texte de confirmation */}
      <motion.div
        className="absolute text-center z-10"
        style={{
          bottom: "24%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: 600,
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={phaseIndex >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h2
          style={{
            color: "rgba(201, 169, 110, 1)",
            fontSize: 26,
            fontWeight: 400,
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
            marginBottom: 18,
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {prenom ? `Merci ${prenom}` : "Nous avons bien reçu votre demande"}
        </h2>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.65)",
            fontSize: 15,
            fontWeight: 300,
            letterSpacing: "0.15em",
            lineHeight: 1.8,
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Notre équipe vous répondra dans les 24 heures.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.65)",
            fontSize: 15,
            fontWeight: 300,
            letterSpacing: "0.15em",
            lineHeight: 1.8,
            marginTop: 8,
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Vos données sont en sécurité et ne seront jamais partagées.
        </p>
      </motion.div>

      {/* Reflets métalliques sur les anneaux (shimmer) */}
      {phaseIndex >= 3 && rings.map((ring, i) => (
        <motion.div
          key={`shimmer-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: ring.size - 2,
            height: ring.size - 2,
            top: "50%",
            left: "50%",
            marginTop: -(ring.size - 2) / 2,
            marginLeft: -(ring.size - 2) / 2,
            background: `conic-gradient(
              from 0deg,
              transparent 0%,
              rgba(201, 169, 110, 0.1) 15%,
              transparent 30%,
              rgba(201, 169, 110, 0.08) 60%,
              transparent 75%,
              rgba(201, 169, 110, 0.06) 90%,
              transparent 100%
            )`,
          }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], rotate: 180 }}
          transition={{
            delay: 3.5,
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
