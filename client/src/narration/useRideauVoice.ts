import { useRef, useCallback } from 'react';
import { NARRATION_ENABLED } from './config';

/**
 * useRideauVoice — Hook utilisé par CinemaRideau existant.
 *
 * Séquence au clic :
 * 1. La voix `rideau.mp3` joue (Daniel, Jonathan, "Entrez ! Nous vous avons préparé plein de surprises !")
 * 2. Quand la voix se termine → callback onVoiceEnd() déclenche l'ouverture
 *    du rideau avec son bruit d'ouverture existant (inchangé)
 *
 * Fallback : si la voix échoue (autoplay refusé, fichier manquant, etc.),
 * onVoiceEnd est appelé immédiatement pour ne pas bloquer l'UX.
 *
 * Si VITE_NARRATION_ENABLED != true, le hook est neutralisé :
 * il renvoie un handler qui appelle directement onVoiceEnd (comportement d'origine).
 */
export function useRideauVoice(onVoiceEnd: () => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);

  const playVoiceThenOpen = useCallback(() => {
    if (!NARRATION_ENABLED) {
      // Narration désactivée : ouverture immédiate (comportement d'origine)
      onVoiceEnd();
      return;
    }

    if (hasPlayedRef.current) return; // anti-double-clic
    hasPlayedRef.current = true;

    const audio = new Audio('/audio/rideau.mp3');
    audio.volume = 1.0;
    audioRef.current = audio;

    audio.addEventListener('ended', () => {
      onVoiceEnd();
    });

    audio.addEventListener('error', () => {
      // Fichier introuvable ou problème de lecture : on ouvre quand même
      onVoiceEnd();
    });

    audio.play().catch(() => {
      // Autoplay refusé malgré le clic utilisateur (très rare)
      onVoiceEnd();
    });
  }, [onVoiceEnd]);

  return playVoiceThenOpen;
}
