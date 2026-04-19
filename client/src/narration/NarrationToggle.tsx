import { useMuteToggle } from './useNarration';
import { NARRATION_ENABLED } from './config';

/**
 * NarrationToggle — bouton mute persistant en bas à droite.
 * N'apparaît que si la narration est activée ET si le rideau a été vu.
 * Le mute est persistant via localStorage.
 */
export default function NarrationToggle() {
  if (!NARRATION_ENABLED) return null;

  return <NarrationToggleInner />;
}

function NarrationToggleInner() {
  const { muted, toggle } = useMuteToggle();

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'Activer les commentaires audio' : 'Couper les commentaires audio'}
      title={muted ? 'Activer les commentaires audio' : 'Couper les commentaires audio'}
      className="fixed bottom-5 right-5 z-[9998] w-12 h-12 rounded-full bg-black/75 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center cursor-pointer backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95"
    >
      {muted ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
