/*
 * chunkReload — récupération automatique des « chunks » périmés.
 *
 * Après un déploiement, les fichiers JS/CSS changent de hash. Un onglet ouvert
 * avant le déploiement a encore les anciens noms en mémoire : en naviguant vers
 * une page chargée à la demande (lazy), l'ancien chunk renvoie 404 → la page
 * casse (« plus d'accès », écran blanc, erreur). Le SITE n'avait aucun garde-fou.
 *
 * Ici : on écoute l'événement Vite `vite:preloadError` (émis quand un import()
 * de chunk échoue) + les erreurs/rejections de module dynamique, et on recharge
 * UNE fois la page pour récupérer le build à jour. Anti-boucle via sessionStorage.
 */

const RELOAD_KEY = "stale-chunk-reload-at";
const COOLDOWN_MS = 10_000;

const CHUNK_ERROR_RE =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|dynamically imported module|Loading chunk [\w-]+ failed|ChunkLoadError|Loading CSS chunk/i;

export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  if (typeof error === "string") return CHUNK_ERROR_RE.test(error);
  const e = error as { name?: string; message?: string };
  if (e.name === "ChunkLoadError") return true;
  return CHUNK_ERROR_RE.test(e.message ?? String(error));
}

/**
 * Recharge la page une seule fois pour récupérer le build à jour.
 * Anti-boucle : si un rechargement a eu lieu il y a moins de 10 s, on ne
 * recharge PAS (on laisse l'erreur s'afficher plutôt que boucler à l'infini).
 * @returns true si un rechargement a été déclenché.
 */
export function reloadOnceForStaleChunk(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? "0");
    if (Number.isFinite(last) && Date.now() - last < COOLDOWN_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    /* sessionStorage indisponible (mode privé strict) → on recharge quand même */
  }
  window.location.reload();
  return true;
}

let installed = false;

export function installChunkReloadGuard(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;

  // Vite émet cet event quand un import() de chunk échoue (build périmé).
  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault(); // empêche Vite de relancer l'erreur
    reloadOnceForStaleChunk();
  });

  // Filets supplémentaires : erreurs et promesses rejetées de module dynamique.
  window.addEventListener("error", (event) => {
    if (isChunkLoadError(event.error ?? event.message)) reloadOnceForStaleChunk();
  });
  window.addEventListener("unhandledrejection", (event) => {
    if (isChunkLoadError(event.reason)) reloadOnceForStaleChunk();
  });
}
