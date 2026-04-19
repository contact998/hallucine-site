import { useEffect, useRef, useState, useCallback } from 'react';
import { NARRATION_ENABLED } from './config';

/**
 * useNarration — Hook à poser sur une section pour déclencher un commentaire
 * audio quand elle devient visible à l'écran.
 *
 * Usage :
 *   const ref = useNarration('gamme-etanche');
 *   return <section ref={ref}>...</section>;
 *
 * Comportement :
 * - IntersectionObserver déclenche le MP3 quand 50% de la section est visible
 * - Un seul audio joue à la fois (les autres s'interrompent)
 * - Ne joue qu'une fois par session (sessionStorage)
 * - Respecte le mute global (localStorage)
 * - Désactivé tant que le rideau n'est pas ouvert
 * - Si VITE_NARRATION_ENABLED != true : no-op, retourne juste une ref neutre
 */

const MUTE_KEY = 'hallucine.narration.muted';
const HEARD_KEY = 'hallucine.narration.heard';
const CURTAIN_SEEN_KEY = 'curtain_seen'; // clé utilisée par CinemaRideau existant

let currentAudio: HTMLAudioElement | null = null;

function getHeardSet(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    return new Set(JSON.parse(sessionStorage.getItem(HEARD_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

function markHeard(id: string) {
  try {
    const heard = getHeardSet();
    heard.add(id);
    sessionStorage.setItem(HEARD_KEY, JSON.stringify(Array.from(heard)));
  } catch {}
}

function isMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(MUTE_KEY) === '1';
}

function isCurtainOpened(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(CURTAIN_SEEN_KEY) === '1';
}

export function useNarration<T extends HTMLElement = HTMLElement>(
  id: string,
  options: { threshold?: number } = {}
) {
  const { threshold = 0.5 } = options;
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    if (!NARRATION_ENABLED) return;

    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!isCurtainOpened()) return;
        if (isMuted()) return;
        if (getHeardSet().has(id)) return;

        // Stopper l'audio en cours
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }

        const audio = new Audio(`/audio/${id}.mp3`);
        currentAudio = audio;
        audio.volume = 1.0;
        audio
          .play()
          .then(() => markHeard(id))
          .catch(() => {
            // Autoplay refusé : on réessaiera au prochain scroll
          });

        observer.disconnect();
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, threshold]);

  return elementRef;
}

/**
 * Stoppe l'audio en cours (utilisé par le bouton mute).
 */
export function stopCurrentNarration() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Hook pour le bouton mute.
 */
export function useMuteToggle() {
  const [muted, setMuted] = useState(() => isMuted());

  const toggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(MUTE_KEY, next ? '1' : '0');
      } catch {}
      if (next) stopCurrentNarration();
      return next;
    });
  }, []);

  return { muted, toggle };
}
