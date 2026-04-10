/**
 * Helper localStorage SSR-safe
 *
 * localStorage n'existe pas en Node.js (SSR/SSG).
 * Ce helper retourne null/undefined côté serveur au lieu de planter.
 *
 * Usage : remplacer tous les `localStorage.*` par `safeLocalStorage.*`
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null =>
    typeof window === "undefined" ? null : localStorage.getItem(key),

  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") localStorage.setItem(key, value);
  },

  removeItem: (key: string): void => {
    if (typeof window !== "undefined") localStorage.removeItem(key);
  },
};
