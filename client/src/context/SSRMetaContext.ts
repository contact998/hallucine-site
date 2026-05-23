import { createContext } from "react";

export interface SSRMeta {
  title: string;
  description: string;
  image: string;
  url: string;
  locked: boolean; // true après le premier setMeta — empêche les composants enfants d'écraser
  /** Scripts/balises supplémentaires à insérer dans le <head> par le template
   *  (ex: window.__SSR_INITIAL_DATA__ pour les routes dynamiques type blog). */
  headExtra?: string;
  setMeta(data: { title?: string; description?: string; image?: string; url?: string }): void;
}

export const SSRMetaContext = createContext<SSRMeta | null>(null);
