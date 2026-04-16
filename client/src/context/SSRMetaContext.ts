import { createContext } from "react";

export interface SSRMeta {
  title: string;
  description: string;
  image: string;
  url: string;
  setMeta(data: { title?: string; description?: string; image?: string; url?: string }): void;
}

export const SSRMetaContext = createContext<SSRMeta | null>(null);
