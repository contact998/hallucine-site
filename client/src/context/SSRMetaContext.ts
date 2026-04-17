import { createContext } from "react";

export interface SSRMeta {
  title: string;
  description: string;
  image: string;
  url: string;
  locked: boolean; // true après le premier setMeta — empêche les composants enfants d'écraser
  setMeta(data: { title?: string; description?: string; image?: string; url?: string }): void;
}

export const SSRMetaContext = createContext<SSRMeta | null>(null);
