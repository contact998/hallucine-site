import type { ReactNode } from 'react';
import { useNarration } from './useNarration';
import { NARRATION_ENABLED } from './config';

/**
 * NarrationAnchor — Wrapper invisible autour d'une section pour déclencher
 * un commentaire audio quand elle entre dans le viewport.
 *
 * Avantage : ne modifie PAS le composant section, juste le wrap. Si on retire
 * le NarrationAnchor, la section reste identique.
 *
 * Usage dans Home.tsx :
 *   <NarrationAnchor id="accueil-hero">
 *     <HeroSection />
 *   </NarrationAnchor>
 *
 * Le wrapper est un <div> qui occupe la même place visuelle que la section
 * (display: contents aurait été idéal mais IntersectionObserver ne l'aime pas,
 * on garde donc un div standard sans style).
 *
 * Si VITE_NARRATION_ENABLED != true : retourne directement {children}, aucun div ajouté.
 */
export default function NarrationAnchor({
  id,
  children,
  threshold = 0.5,
}: {
  id: string;
  children: ReactNode;
  threshold?: number;
}) {
  if (!NARRATION_ENABLED) {
    return <>{children}</>;
  }

  return <NarrationAnchorInner id={id} threshold={threshold}>{children}</NarrationAnchorInner>;
}

function NarrationAnchorInner({
  id,
  children,
  threshold,
}: {
  id: string;
  children: ReactNode;
  threshold: number;
}) {
  const ref = useNarration<HTMLDivElement>(id, { threshold });
  return <div ref={ref}>{children}</div>;
}
