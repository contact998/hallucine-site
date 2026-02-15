/**
 * Hook React pour la reconnaissance vocale via Web Speech API
 * Fonctionne nativement dans Chrome, Edge, Safari (pas Firefox)
 * Fallback gracieux si non supporté
 */
import { useState, useCallback, useRef, useEffect } from "react";

// Types pour la Web Speech API (non inclus dans les types TS standard)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  onspeechend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export interface UseSpeechToTextOptions {
  /** Langue de reconnaissance (défaut: "fr-FR") */
  lang?: string;
  /** Reconnaissance continue ou one-shot (défaut: false) */
  continuous?: boolean;
  /** Résultats intermédiaires pendant la dictée (défaut: true) */
  interimResults?: boolean;
  /** Callback quand un résultat final est obtenu */
  onResult?: (transcript: string) => void;
  /** Callback pour les résultats intermédiaires */
  onInterimResult?: (transcript: string) => void;
  /** Callback en cas d'erreur */
  onError?: (error: string) => void;
}

export interface UseSpeechToTextReturn {
  /** true si la reconnaissance vocale est supportée par le navigateur */
  isSupported: boolean;
  /** true si le micro écoute actuellement */
  isListening: boolean;
  /** Texte reconnu en cours (intermédiaire) */
  interimTranscript: string;
  /** Dernier texte final reconnu */
  finalTranscript: string;
  /** Message d'erreur éventuel */
  error: string | null;
  /** Démarre l'écoute */
  startListening: () => void;
  /** Arrête l'écoute */
  stopListening: () => void;
  /** Bascule écoute on/off */
  toggleListening: () => void;
}

/**
 * Vérifie si la Web Speech API est disponible
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function useSpeechToText(
  options: UseSpeechToTextOptions = {}
): UseSpeechToTextReturn {
  const {
    lang = "fr-FR",
    continuous = false,
    interimResults = true,
    onResult,
    onInterimResult,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isSupported = isSpeechRecognitionSupported();

  // Cleanup à la destruction du composant
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignorer les erreurs de cleanup
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      const msg = "La reconnaissance vocale n'est pas supportée par votre navigateur. Utilisez Chrome, Edge ou Safari.";
      setError(msg);
      onError?.(msg);
      return;
    }

    // Arrêter l'instance précédente si elle existe
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignorer
      }
    }

    setError(null);
    setInterimTranscript("");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
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
        setInterimTranscript(interim);
        onInterimResult?.(interim);
      }

      if (final) {
        setFinalTranscript(final);
        setInterimTranscript("");
        onResult?.(final);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMsg: string;
      switch (event.error) {
        case "no-speech":
          errorMsg = "Aucune voix détectée. Réessayez.";
          break;
        case "audio-capture":
          errorMsg = "Microphone non disponible. Vérifiez les permissions.";
          break;
        case "not-allowed":
          errorMsg = "Accès au microphone refusé. Autorisez l'accès dans les paramètres du navigateur.";
          break;
        case "network":
          errorMsg = "Erreur réseau. La reconnaissance vocale nécessite une connexion internet.";
          break;
        case "aborted":
          // Pas une vraie erreur, juste un arrêt volontaire
          return;
        default:
          errorMsg = `Erreur de reconnaissance vocale: ${event.error}`;
      }
      setError(errorMsg);
      setIsListening(false);
      onError?.(errorMsg);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      const msg = "Impossible de démarrer la reconnaissance vocale.";
      setError(msg);
      setIsListening(false);
      onError?.(msg);
    }
  }, [isSupported, lang, continuous, interimResults, onResult, onInterimResult, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignorer
      }
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isSupported,
    isListening,
    interimTranscript,
    finalTranscript,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}
