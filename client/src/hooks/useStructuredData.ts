import { useEffect } from "react";

/**
 * Hook qui injecte un ou plusieurs blocs JSON-LD dans le <head> du document.
 * Nettoie automatiquement les scripts précédents au démontage du composant.
 * 
 * @param data - Un objet Schema.org ou un tableau d'objets Schema.org
 * @param id - Identifiant unique pour le script (évite les doublons)
 */
export function useStructuredData(data: Record<string, unknown> | Record<string, unknown>[], id: string) {
  useEffect(() => {
    const existingScript = document.getElementById(`structured-data-${id}`);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = `structured-data-${id}`;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(Array.isArray(data) ? data : data);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(`structured-data-${id}`);
      if (el) el.remove();
    };
  }, [data, id]);
}
