/**
 * Helper localStorage SSR-safe
 *
 * localStorage n'existe pas en Node.js (SSR/SSG).
 * Ce helper retourne null/undefined côté serveur au lieu de planter.
 *
 * Pattern : vérifier typeof window avant tout accès à localStorage.
 * Ne jamais appeler localStorage directement ailleurs dans le code.
 *
 * Usage : remplacer tous les `localStorage.*` par `safeLocalStorage.*`
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  },

  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },
};
