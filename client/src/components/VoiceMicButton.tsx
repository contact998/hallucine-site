/**
 * VoiceMicButton — Bouton micro réutilisable pour la saisie vocale
 * Utilise la Web Speech API native (Chrome, Edge, Safari)
 * Affiche une animation pulsante pendant l'écoute
 * Fallback gracieux si non supporté (le bouton ne s'affiche pas)
 */
import { useCallback, useRef, useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isSpeechRecognitionSupported } from "@/hooks/useSpeechToText";

interface VoiceMicButtonProps {
  /** Callback quand un résultat final est obtenu */
  onResult: (transcript: string) => void;
  /** Callback pour les résultats intermédiaires (optionnel) */
  onInterimResult?: (transcript: string) => void;
  /** Langue de reconnaissance (défaut: "fr-FR") */
  lang?: string;
  /** Classes CSS additionnelles */
  className?: string;
  /** Taille du bouton (défaut: "sm") */
  size?: "sm" | "md";
  /** Tooltip personnalisé */
  tooltip?: string;
}

export default function VoiceMicButton({
  onResult,
  onInterimResult,
  lang = "fr-FR",
  className = "",
  size = "sm",
  tooltip = "Dicter",
}: VoiceMicButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  // Détecté après montage : `window.SpeechRecognition` n'existe pas en SSR —
  // le lire pendant le rendu casserait l'hydratation. Démarre à false
  // (= rendu serveur), puis passe à true côté client si supporté.
  const [isSupported, setIsSupported] = useState(false);

  // Détection du support + cleanup
  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
      }
    };
  }, []);

  // Auto-clear de l'erreur après 4s — sinon le message rouge persiste et donne
  // l'impression que le micro est définitivement cassé alors qu'un retry suffit.
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 4000);
    return () => clearTimeout(t);
  }, [error]);

  const startListening = useCallback(async () => {
    if (!isSupported) return;

    // Arrêter l'instance précédente
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }

    setError(null);
    setInterimText("");

    // Demander explicitement la permission micro AVANT de démarrer la
    // reconnaissance — certains navigateurs (notamment Chrome iOS) échouent
    // silencieusement si on appelle directement recognition.start() sans avoir
    // déclenché getUserMedia. On ferme aussitôt le stream, on n'en avait besoin
    // que pour le prompt de permission.
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch (permErr: any) {
        const msg = permErr?.name === "NotAllowedError" ? "Micro refuse" : "Pas de micro";
        setError(msg);
        return;
      }
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (interim) {
        setInterimText(interim);
        onInterimResult?.(interim);
      }

      if (final) {
        setInterimText("");
        onResult(final);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "aborted") return;
      let msg = "Erreur micro";
      if (event.error === "not-allowed") msg = "Micro refuse";
      else if (event.error === "no-speech") msg = "Aucune voix";
      else if (event.error === "audio-capture") msg = "Pas de micro";
      setError(msg);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  }, [isSupported, lang, onResult, onInterimResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  // Ne pas afficher si non supporté
  if (!isSupported) return null;

  const sizeClasses = size === "sm"
    ? "w-8 h-8"
    : "w-10 h-10";

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5";

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggle}
        title={isListening ? "Arreter" : tooltip}
        className={`${sizeClasses} flex items-center justify-center rounded-full transition-all duration-300 ${
          isListening
            ? "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
            : "bg-white/5 border border-white/10 text-white/40 hover:text-gold hover:border-gold/30 hover:bg-gold/5"
        }`}
      >
        {/* Animation pulsante pendant l'écoute */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-red-500/20"
            />
          )}
        </AnimatePresence>

        {isListening ? (
          <MicOff className={`${iconSize} relative z-10`} />
        ) : (
          <Mic className={`${iconSize} relative z-10`} />
        )}
      </button>

      {/* Texte intermédiaire pendant la dictée */}
      <AnimatePresence>
        {isListening && interimText && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute left-full ml-2 px-2 py-1 bg-gold/10 border border-gold/20 rounded text-gold text-xs whitespace-nowrap max-w-[200px] truncate z-30"
          >
            {interimText}...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicateur d'écoute */}
      <AnimatePresence>
        {isListening && !interimText && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute left-full ml-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs whitespace-nowrap z-30"
          >
            Parlez...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Erreur */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full mt-1 left-0 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-[10px] whitespace-nowrap z-30"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
