/** Formateurs partagés pour l'affichage des écrans (configurateur, pages produit). */

/** Sépare les milliers par une espace fine — déterministe SSR/client. */
export function formatNombre(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Minutes → « 30 min » ou « 1 h 15 ». */
export function formatMontage(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const reste = minutes % 60;
  return reste ? `${h} h ${reste}` : `${h} h`;
}

/** Plage de personnes : « 2 » ou « 2–3 ». */
export function formatPersonnes(m: { personnesMin: number; personnesMax?: number }): string {
  return m.personnesMax ? `${m.personnesMin}–${m.personnesMax}` : `${m.personnesMin}`;
}
