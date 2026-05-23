/**
 * CinemaSuccessAnimation — Luxury Brand Reveal
 *
 * Animation ultra luxe minimaliste style pub parfum haut de gamme.
 * Fond velvet noir plein écran, anneaux dorés concentriques, logo Halluciné,
 * rugissement de lion au moment du reveal.
 *
 * Timeline rapide (~4s) :
 *  0:00 — Glow or champagne immédiat
 *  0:30 — Anneaux concentriques dorés émergent
 *  1:50 — Logo Halluciné + rugissement de lion
 *  3:00 — Texte de confirmation
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "react-i18next";

// CDN assets
const LOGO_URL = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ySiqVkOsMSzWfHfu.webp";
const LION_ROAR_URL = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/yuhDGjetZRdDdWwT.mp3";

interface CinemaSuccessAnimationProps {
  prenom?: string;
  onClose?: () => void;
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
        duration: 1.4,
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
export default function CinemaSuccessAnimation({ prenom, onClose }: CinemaSuccessAnimationProps) {
  const { t } = useTranslation("common");
  const [phase, setPhase] = useState<"glow" | "rings" | "logo" | "text" | "done">("glow");
  const [showButton, setShowButton] = useState(false);
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

  // Séquence d'animation rapide (~4s total) + bouton retour à 6s + redirection auto à 12s
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("rings"), 300),
      setTimeout(() => {
        setPhase("logo");
        playLionRoar();
      }, 1500),
      setTimeout(() => setPhase("text"), 3000),
      setTimeout(() => setShowButton(true), 6000),
      setTimeout(() => {
        if (onClose) onClose();
        else window.location.href = "/";
      }, 12000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [playLionRoar, onClose]);

  // Particules stables
  const particles = useMemo(() => [
    { x: "45%", y: "35%", delay: 2.5 },
    { x: "55%", y: "40%", delay: 2.8 },
    { x: "42%", y: "55%", delay: 3.1 },
    { x: "58%", y: "50%", delay: 3.4 },
    { x: "48%", y: "45%", delay: 3.7 },
    { x: "52%", y: "58%", delay: 4.0 },
  ], []);

  // Anneaux — délais réduits pour démarrage rapide
  const rings = useMemo(() => [
    { size: 60, delay: 0.3, thickness: 1.5 },
    { size: 100, delay: 0.45, thickness: 1 },
    { size: 145, delay: 0.6, thickness: 1 },
    { size: 190, delay: 0.75, thickness: 1.5 },
    { size: 240, delay: 0.9, thickness: 1 },
    { size: 290, delay: 1.05, thickness: 1 },
    { size: 340, delay: 1.2, thickness: 1.5 },
  ], []);

  const phaseIndex = ["glow", "rings", "logo", "text"].indexOf(phase);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
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
      <div className="absolute top-0 left-0 right-0 h-[8%] bg-black z-30" />
      <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-black z-30" />

      {/* Bouton mute */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute top-[10%] right-4 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        title={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? (
          <VolumeX className="w-4 h-4" style={{ color: "rgba(201, 169, 110, 0.3)" }} />
        ) : (
          <Volume2 className="w-4 h-4" style={{ color: "rgba(201, 169, 110, 0.5)" }} />
        )}
      </button>

      {/* Glow or champagne central — immédiat */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, rgba(201,169,110,0.05) 40%, transparent 70%)",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Zone centrale : anneaux + logo */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: 340, height: 340 }}
        initial={{ scale: 0.97 }}
        animate={phaseIndex >= 1 ? { scale: 1.03 } : {}}
        transition={{ duration: 5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Anneaux concentriques dorés */}
        {phaseIndex >= 1 && rings.map((ring, i) => (
          <GoldRing key={i} size={ring.size} delay={ring.delay} thickness={ring.thickness} />
        ))}

        {/* Logo Halluciné */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, filter: "brightness(0.3)", scale: 0.95 }}
          animate={
            phaseIndex >= 2
              ? { opacity: 1, filter: "brightness(1)", scale: 1 }
              : {}
          }
          transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Rim light or */}
          <motion.div
            className="absolute -inset-2 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={phaseIndex >= 2 ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
            style={{
              boxShadow:
                "0 0 30px rgba(201, 169, 110, 0.15), 0 0 60px rgba(201, 169, 110, 0.08), inset 0 0 30px rgba(201, 169, 110, 0.05)",
            }}
          />
          {/* Inner glow bleu subtil */}
          <motion.div
            className="absolute inset-0 rounded pointer-events-none"
            initial={{ opacity: 0 }}
            animate={phaseIndex >= 2 ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
            style={{
              boxShadow: "inset 0 0 40px rgba(42, 74, 127, 0.2)",
            }}
          />
          <img
            loading="lazy"
            src={LOGO_URL}
            alt="Halluciné"
            className="block"
            style={{ width: 280, height: "auto" }}
          decoding="async" />
        </motion.div>
      </motion.div>

      {/* Particules dorées subtiles */}
      {phaseIndex >= 2 && particles.map((p, i) => (
        <GoldParticle key={i} x={p.x} y={p.y} delay={p.delay} />
      ))}

      {/* Ligne dorée fine — juste au-dessus du texte */}
      <motion.div
        style={{
          height: 1,
          marginTop: 20,
          marginBottom: 16,
          background: "linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.4), transparent)",
        }}
        initial={{ width: 0 }}
        animate={phaseIndex >= 3 ? { width: 120 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Texte de confirmation — directement sous le logo */}
      <motion.div
        className="text-center z-10 px-6"
        style={{ maxWidth: 600 }}
        initial={{ opacity: 0, y: 10 }}
        animate={phaseIndex >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h2
          style={{
            color: "rgba(201, 169, 110, 1)",
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "0.25em",
            textTransform: "uppercase" as const,
            marginBottom: 16,
            fontFamily: "'Cormorant Garamond', serif",
            textShadow: "0 0 30px rgba(201, 169, 110, 0.3)",
          }}
        >
          {prenom ? t("success_thanks_named", { name: prenom }) : t("success_thanks_default")}
        </h2>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.85)",
            fontSize: 17,
            fontWeight: 400,
            letterSpacing: "0.08em",
            lineHeight: 1.8,
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {t("success_reply_24h")}
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 15,
            fontWeight: 300,
            letterSpacing: "0.08em",
            lineHeight: 1.8,
            marginTop: 8,
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {t("success_privacy")}
        </p>
      </motion.div>

      {/* Bouton retour à l'accueil */}
      {showButton && (
        <motion.button
          onClick={() => {
            if (onClose) onClose();
            else window.location.href = "/";
          }}
          className="z-50 mt-8 px-8 py-3 rounded-full border transition-all cursor-pointer"
          style={{
            borderColor: "rgba(201, 169, 110, 0.3)",
            color: "rgba(201, 169, 110, 0.8)",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 15,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            background: "rgba(201, 169, 110, 0.05)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.6)";
            e.currentTarget.style.background = "rgba(201, 169, 110, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.3)";
            e.currentTarget.style.background = "rgba(201, 169, 110, 0.05)";
          }}
        >
          {t("success_back_home")}
        </motion.button>
      )}

      {/* Reflets métalliques sur les anneaux (shimmer) */}
      {phaseIndex >= 2 && rings.map((ring, i) => (
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
            delay: 2.0,
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
