/**
 * client/src/admin-v2/MediaPicker.tsx
 * Fenêtre de sélection partagée : pioche UNE image dans le fond (Bibliothèque).
 * Réutilisée partout où on place une image — Emplacements, couverture blog.
 * Renvoie l'asset choisi via onPick (on garde l'id ET l'url).
 */
import { useState } from "react";
import { Loader2, X, Search, ImageOff } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { MediaItem } from "../../../drizzle/schema";

export function MediaPicker({
  onPick,
  onClose,
  title = "Choisir une image dans la Bibliothèque",
}: {
  onPick: (asset: MediaItem) => void;
  onClose: () => void;
  title?: string;
}) {
  const [search, setSearch] = useState("");

  const { data, isLoading } = trpc.media.list.useQuery({
    activeOnly: true,
    search: search.trim() || undefined,
    limit: 300,
    offset: 0,
  });
  const items = data?.items ?? [];

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête + recherche */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="flex-1">
            <h2 className="font-semibold text-white">{title}</h2>
            <p className="text-xs text-white/40 mt-0.5">Cliquez une image pour la placer.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (titre, alt, fichier…)"
              className="bg-black/40 border border-white/15 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 w-64"
            />
          </div>
          <button onClick={onClose} aria-label="Fermer" className="p-2 text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grille */}
        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-white/50">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/40 gap-2">
              <ImageOff className="w-8 h-8" />
              {search ? "Aucune image pour cette recherche." : "La Bibliothèque est vide — uploadez des images."}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {items.map((m) => (
                <button
                  key={m.id}
                  title={m.title ?? m.filename}
                  onClick={() => onPick(m)}
                  className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-amber-500 transition-all focus:outline-none focus:border-amber-500"
                >
                  <img
                    src={m.url}
                    alt={m.alt ?? m.filename}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
