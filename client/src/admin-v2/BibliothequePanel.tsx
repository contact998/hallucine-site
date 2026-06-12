/**
 * BibliothequePanel — Le « fond » d'images (refonte média).
 *
 * Dans le nouveau modèle, une image est JUSTE un fichier + ses métadonnées.
 * OÙ elle est utilisée vit ailleurs (table media_placements → panneau « Emplacements »).
 * Ce panneau ne connaît donc AUCUNE notion de page/section : on uploade ici, on place ensuite.
 *
 * Calqué sur AdminMediaV2 (MediaAdmin + EditModal) pour le style, le thème sombre
 * (accent ambre), `inputCls`, `Field` et la structure de modale — mais dépouillé de
 * tout filtre/sélecteur/champ page-section-ordre.
 */
import { useState, useRef } from "react";
import { Loader2, Upload, X, Pencil, Trash2, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import type { MediaItem } from "../../../drizzle/schema";
import { slotFullLabel } from "../../../shared/slots";

type UsageFilter = "all" | "used" | "unused";

const PER_PAGE = 24;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/** tags est stocké en JSON ('["a","b"]'). On le rend en texte "a, b" pour le champ. */
function tagsToText(raw: MediaItem["tags"]): string {
  if (!raw) return "";
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((t) => typeof t === "string").join(", ") : "";
  } catch {
    return "";
  }
}

/** Texte "a, b ,c" → tableau ["a","b","c"] nettoyé (pour trpc.media.update qui attend string[]). */
function textToTags(text: string): string[] {
  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// ─── Panneau Bibliothèque ───────────────────────────────────────────────────────
export function BibliothequePanel() {
  const [search, setSearch] = useState("");
  const [usage, setUsage] = useState<UsageFilter>("all");
  const [current, setCurrent] = useState(1);
  const [editing, setEditing] = useState<MediaItem | null>(null);

  const utils = trpc.useUtils();
  const refresh = () => utils.media.list.invalidate();

  const offset = (current - 1) * PER_PAGE;
  const { data, isLoading, isError, error } = trpc.media.list.useQuery({
    activeOnly: false,
    search: search.trim() || undefined,
    usage,
    limit: PER_PAGE,
    offset,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));

  // La recherche revient à la page 1
  function onSearch(value: string) {
    setSearch(value);
    setCurrent(1);
  }
  // Changer de filtre utilisé/non utilisé revient aussi à la page 1
  function onUsage(value: UsageFilter) {
    setUsage(value);
    setCurrent(1);
  }

  // Upload d'une nouvelle image — DANS LE FOND uniquement (pas de page/section).
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const upload = trpc.media.upload.useMutation({
    onSuccess: () => {
      toast.success("Image ajoutée au fond");
      refresh();
    },
    onError: (e) => toast.error(e.message),
  });
  async function handleUpload(file: File) {
    if (!ALLOWED_MIME.includes(file.type)) {
      toast.error("Format non supporté (JPEG, PNG, WebP, GIF)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Trop volumineux (max 10 Mo)");
      return;
    }
    const fileData = await fileToBase64(file);
    // On n'envoie QUE le fichier : pas de page, pas de section. C'est le fond.
    upload.mutate({ filename: file.name, fileData, mimeType: file.type });
  }

  return (
    <>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Bibliothèque</h1>
        <span className="text-xs text-white/40">
          {total} image{total > 1 ? "s" : ""}
        </span>
      </div>
      <p className="text-sm text-white/50 mb-6">
        Le fond d'images. Uploadez ici ; placez-les ensuite via Emplacements.
      </p>

      {/* Barre d'outils : recherche + upload */}
      <div className="flex flex-wrap items-end gap-3 mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
        <label className="flex flex-col gap-1 text-xs text-white/60 flex-1 min-w-[180px]">
          Recherche
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="titre, alt, fichier…"
            className="bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
          />
        </label>

        {/* Filtre général : toutes / utilisées sur le site / non utilisées */}
        <div className="flex flex-col gap-1 text-xs text-white/60">
          Affichage
          <div className="flex rounded-lg overflow-hidden border border-white/15">
            {([
              ["all", "Toutes"],
              ["used", "Utilisées"],
              ["unused", "Non utilisées"],
            ] as const).map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => onUsage(val)}
                className={`px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                  usage === val
                    ? "bg-amber-500 text-black font-semibold"
                    : "bg-black/40 text-white/70 hover:text-white"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => uploadInputRef.current?.click()}
            disabled={upload.isPending}
            className="flex items-center gap-2 text-sm bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg px-4 py-2 disabled:opacity-50"
          >
            {upload.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Ajouter une image
          </button>
          <span className="text-[11px] text-white/40">→ ajoutée au fond</span>
        </div>
      </div>

      {/* Contenu */}
      {isError && (
        <div className="bg-red-500/15 border border-red-500/30 text-red-200 rounded-xl p-4 text-sm">
          Erreur de chargement : {(error as any)?.message ?? "inconnue"}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-white/50">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/40 gap-2">
          <ImageOff className="w-8 h-8" />
          {search.trim() ? "Aucune image pour cette recherche." : "Le fond est vide — ajoutez une image."}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((m) => (
            <div
              key={m.id}
              className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/30"
            >
              <img src={m.url} alt={m.alt ?? ""} className="w-full h-full object-cover" loading="lazy" />
              {!m.active && (
                <span className="absolute top-1.5 left-1.5 text-[10px] bg-black/70 text-white/80 px-1.5 py-0.5 rounded">
                  masquée
                </span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setEditing(m)}
                  className="flex items-center gap-1.5 text-sm bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg px-3 py-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" /> Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setCurrent((c) => Math.max(1, c - 1))}
            disabled={current <= 1}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm disabled:opacity-40"
          >
            Précédent
          </button>
          <span className="text-sm text-white/60">
            Page {current} / {pageCount}
          </span>
          <button
            onClick={() => setCurrent((c) => Math.min(pageCount, c + 1))}
            disabled={current >= pageCount}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      )}

      {editing && <EditModal item={editing} onClose={() => setEditing(null)} onChanged={refresh} />}
    </>
  );
}

// ─── Modale d'édition ───────────────────────────────────────────────────────────
// UNIQUEMENT : aperçu, Titre, Alt, Tags, visibilité, remplacer le fichier, retirer.
// PAS de page, PAS de section, PAS d'ordre.
function EditModal({
  item,
  onClose,
  onChanged,
}: {
  item: MediaItem;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [title, setTitle] = useState(item.title ?? "");
  const [alt, setAlt] = useState(item.alt ?? "");
  const [tagsText, setTagsText] = useState(tagsToText(item.tags));
  const [active, setActive] = useState(item.active);
  const [showReplace, setShowReplace] = useState(false);

  // Enregistrement des métadonnées via trpc.media.update (tags attendu en string[]).
  const update = trpc.media.update.useMutation({
    onSuccess: () => {
      toast.success("Enregistré");
      onChanged();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  function save() {
    update.mutate({
      id: item.id,
      title: title || undefined,
      alt: alt || undefined,
      tags: textToTags(tagsText),
      active,
    });
  }

  // Retrait = soft delete. On conserve le fichier R2 (deleteOnR2: false) : c'est le fond.
  const remove = trpc.mediaResource.deleteOne.useMutation({
    onSuccess: () => {
      toast.success("Image retirée");
      onChanged();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  function softDelete() {
    if (!confirm("Retirer cette image du fond ? Le fichier R2 est conservé.")) return;
    remove.mutate({ id: item.id });
  }

  // Remplacement du fichier (mêmes endpoints qu'AdminMediaV2).
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceImage = trpc.media.replaceImage.useMutation({
    onSuccess: () => {
      toast.success("Image remplacée");
      onChanged();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  async function importReplacement(file: File) {
    if (!ALLOWED_MIME.includes(file.type)) {
      toast.error("Format non supporté (JPEG, PNG, WebP, GIF)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Trop volumineux (max 10 Mo)");
      return;
    }
    const fileData = await fileToBase64(file);
    replaceImage.mutate({ id: item.id, filename: file.name, fileData, mimeType: file.type });
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête modale */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 bg-neutral-900">
          <h2 className="font-semibold">Modifier l'image</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Aperçu */}
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30 max-h-56 flex items-center justify-center">
            <img src={item.url} alt={alt} className="max-h-56 object-contain" />
          </div>

          {/* Où cette image apparaît réellement sur le site (emplacements) */}
          <PlacementsInfo assetId={item.id} />

          {/* Remplacer le fichier */}
          <div>
            <button
              onClick={() => setShowReplace((v) => !v)}
              className="text-sm text-amber-400 hover:text-amber-300"
            >
              {showReplace ? "Annuler le remplacement" : "Remplacer le fichier…"}
            </button>
            {showReplace && (
              <div className="mt-2 space-y-2">
                <input
                  ref={replaceInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) importReplacement(f);
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={() => replaceInputRef.current?.click()}
                  disabled={replaceImage.isPending}
                  className="w-full flex items-center justify-center gap-2 text-sm bg-emerald-500/80 hover:bg-emerald-500 text-black font-semibold rounded-lg py-2 disabled:opacity-50"
                >
                  {replaceImage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Importer un fichier de mon ordinateur
                </button>
              </div>
            )}
          </div>

          {/* Champs */}
          <Field label="Titre">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Texte alternatif (SEO / accessibilité)">
            <input value={alt} onChange={(e) => setAlt(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Tags (séparés par des virgules)">
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="cinema, exterieur, nuit"
              className={inputCls}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            Visible sur le site
          </label>
        </div>

        {/* Pied de modale */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/10 sticky bottom-0 bg-neutral-900">
          <button
            onClick={softDelete}
            disabled={remove.isPending}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" /> Retirer
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">
              Fermer
            </button>
            <button
              onClick={save}
              disabled={update.isPending}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {update.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Détail « où cette image est utilisée » (emplacements) ───────────────────────
// Lit media_placements via trpc.placements.forAsset et traduit chaque slot_key en
// libellé lisible (Groupe › Emplacement) grâce au registre shared/slots.
function PlacementsInfo({ assetId }: { assetId: number }) {
  const { data, isLoading } = trpc.placements.forAsset.useQuery({ assetId });
  const placements = data?.placements ?? [];
  const blogCovers = data?.blogCovers ?? [];
  const empty = placements.length === 0 && blogCovers.length === 0;
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="text-xs text-white/50 mb-1.5">Utilisée dans</div>
      {isLoading ? (
        <div className="text-sm text-white/40 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Recherche des emplacements…
        </div>
      ) : empty ? (
        <div className="text-sm text-white/40">
          Nulle part — cette image n'est utilisée sur aucune page.
        </div>
      ) : (
        <ul className="space-y-1">
          {placements.map((p) => (
            <li key={`p-${p.placementId}`} className="text-sm text-white/85 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>{slotFullLabel(p.slotKey)}</span>
              {p.entityId != null && <span className="text-white/40 text-xs">· #{p.entityId}</span>}
            </li>
          ))}
          {blogCovers.map((b, i) => (
            <li key={`bc-${i}`} className="text-sm text-white/85 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>Blog › Couverture&nbsp;: {b.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const inputCls = "w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-white/60">
      {label}
      {children}
    </label>
  );
}
