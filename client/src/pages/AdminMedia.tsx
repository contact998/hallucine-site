/**
 * client/src/pages/AdminMedia.tsx
 * Interface admin pour la médiathèque centrale.
 * Upload, galerie, filtres par catégorie, modification, suppression.
 */
import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useNoIndex } from "@/hooks/useNoIndex";
import { toast } from "sonner";
import {
  Upload, Image, Trash2, Edit2, Copy, Loader2,
  AlertTriangle, ChevronLeft, ChevronRight, X, Check,
  EyeOff, Eye, Filter
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "blog" | "realisations" | "galerie" | "produits" | "ui" | "og" | "autre";

const CATEGORIES: { key: Category | "all"; label: string; color: string }[] = [
  { key: "all",          label: "Tout",         color: "bg-gray-500/20 text-gray-300" },
  { key: "realisations", label: "Réalisations",  color: "bg-amber-500/20 text-amber-400" },
  { key: "galerie",      label: "Galerie",       color: "bg-blue-500/20 text-blue-400" },
  { key: "produits",     label: "Produits",      color: "bg-green-500/20 text-green-400" },
  { key: "blog",         label: "Blog",          color: "bg-purple-500/20 text-purple-400" },
  { key: "ui",           label: "UI",            color: "bg-pink-500/20 text-pink-400" },
  { key: "og",           label: "OG / SEO",      color: "bg-cyan-500/20 text-cyan-400" },
  { key: "autre",        label: "Autre",         color: "bg-gray-500/20 text-gray-400" },
];

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const PAGE_SIZE = 24;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(new Error("Lecture échouée"));
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function AdminMedia() {
  useDocumentMeta("Médiathèque", "Gestion des images du site Hallucine.");
  useNoIndex();

  const { user, loading: authLoading, isAuthenticated } = useAuth();

  // Auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }
  if (!isAuthenticated || !user) {
    window.location.href = getLoginUrl();
    return null;
  }
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-20 text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
          <p className="text-muted-foreground">Cette page est réservée aux administrateurs.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Médiathèque</h1>
          <p className="text-white/50 mt-1 text-sm">
            Gérez toutes les images du site. Les modifications sont visibles immédiatement sans redéploiement.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Galerie */}
          <GaleriePanel />

          {/* Upload */}
          <UploadPanel />
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ─── Panneau Galerie ──────────────────────────────────────────────────────────

function GaleriePanel() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [offset, setOffset]     = useState(0);
  const [editItem, setEditItem] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { data, isLoading, refetch } = trpc.media.list.useQuery({
    category:  category === "all" ? undefined : category,
    activeOnly: false,
    limit:     PAGE_SIZE,
    offset,
  });

  const deactivate = trpc.media.deactivate.useMutation({
    onSuccess: () => { toast.success("Image masquée"); refetch(); },
    onError:   (e) => toast.error(e.message),
  });

  const deleteMedia = trpc.media.delete.useMutation({
    onSuccess: () => { toast.success("Image supprimée"); refetch(); },
    onError:   (e) => toast.error(e.message),
  });

  const total     = data?.total ?? 0;
  const items     = data?.items ?? [];
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  // Reset offset quand on change de catégorie
  const handleCategory = (cat: Category | "all") => {
    setCategory(cat);
    setOffset(0);
  };

  return (
    <div className="space-y-4">
      {/* Filtres catégories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategory(cat.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              category === cat.key
                ? cat.color + " ring-2 ring-white/20"
                : "bg-white/5 text-white/40 hover:bg-white/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-white/40">
        <span>{total} image{total !== 1 ? "s" : ""}</span>
        {totalPages > 1 && (
          <span>Page {currentPage} / {totalPages}</span>
        )}
      </div>

      {/* Grille */}
      {isLoading ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center text-white/30">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucune image dans cette catégorie</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group relative aspect-square rounded-lg overflow-hidden border transition-all ${
                item.active
                  ? "border-white/10 hover:border-white/30"
                  : "border-red-500/30 opacity-50"
              }`}
            >
              {/* Image */}
              <img
                src={item.url}
                alt={item.alt ?? item.title ?? ""}
                className="w-full h-full object-cover cursor-zoom-in"
                loading="lazy"
                onClick={() => setLightbox(item.url)}
              />

              {/* Badge catégorie */}
              <div className="absolute top-1 left-1">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                  CATEGORIES.find(c => c.key === item.category)?.color ?? "bg-gray-500/20 text-gray-300"
                }`}>
                  {item.subcategory ?? item.category}
                </span>
              </div>

              {/* Badge masqué */}
              {!item.active && (
                <div className="absolute top-1 right-1">
                  <EyeOff className="w-3.5 h-3.5 text-red-400" />
                </div>
              )}

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <p className="text-white text-[10px] font-medium line-clamp-2">{item.title}</p>
                <div className="flex gap-1 justify-end">
                  {/* Copier URL */}
                  <button
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded transition-colors"
                    title="Copier l'URL"
                    onClick={() => {
                      navigator.clipboard.writeText(item.url);
                      toast.success("URL copiée");
                    }}
                  >
                    <Copy className="w-3 h-3 text-white" />
                  </button>

                  {/* Modifier */}
                  <button
                    className="p-1.5 bg-blue-500/30 hover:bg-blue-500/50 rounded transition-colors"
                    title="Modifier"
                    onClick={() => setEditItem(editItem === item.id ? null : item.id)}
                  >
                    <Edit2 className="w-3 h-3 text-blue-300" />
                  </button>

                  {/* Masquer/Afficher */}
                  <button
                    className="p-1.5 bg-yellow-500/30 hover:bg-yellow-500/50 rounded transition-colors"
                    title={item.active ? "Masquer" : "Afficher"}
                    onClick={() => {
                      if (item.active) {
                        deactivate.mutate({ id: item.id });
                      } else {
                        // Réactiver
                        toast.info("Pour réactiver, modifiez l'image");
                      }
                    }}
                  >
                    {item.active
                      ? <EyeOff className="w-3 h-3 text-yellow-300" />
                      : <Eye className="w-3 h-3 text-yellow-300" />
                    }
                  </button>

                  {/* Supprimer */}
                  <button
                    className="p-1.5 bg-red-500/30 hover:bg-red-500/50 rounded transition-colors"
                    title={item.usageCount > 0 ? `Utilisée ${item.usageCount}x — masquer d'abord` : "Supprimer"}
                    disabled={item.usageCount > 0}
                    onClick={() => {
                      if (confirm(`Supprimer "${item.title}" ? Cette action est irréversible.`)) {
                        deleteMedia.mutate({ id: item.id, deleteOnR2: true });
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3 text-red-300" />
                  </button>
                </div>
              </div>

              {/* Panneau d'édition inline */}
              {editItem === item.id && (
                <EditInline
                  item={item}
                  onClose={() => setEditItem(null)}
                  onSaved={() => { setEditItem(null); refetch(); }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            className="p-2 bg-white/5 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
            disabled={currentPage === 1}
            onClick={() => setOffset(o => Math.max(0, o - PAGE_SIZE))}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-white/50">{currentPage} / {totalPages}</span>
          <button
            className="p-2 bg-white/5 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
            disabled={currentPage >= totalPages}
            onClick={() => setOffset(o => o + PAGE_SIZE)}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

// ─── Édition inline ───────────────────────────────────────────────────────────

function EditInline({
  item,
  onClose,
  onSaved,
}: {
  item: { id: number; title: string | null; alt: string | null; category: string; subcategory: string | null; active: boolean };
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title,       setTitle]       = useState(item.title ?? "");
  const [alt,         setAlt]         = useState(item.alt ?? "");
  const [subcategory, setSubcategory] = useState(item.subcategory ?? "");
  const [active,      setActive]      = useState(item.active);

  const update = trpc.media.update.useMutation({
    onSuccess: () => { toast.success("Modifié"); onSaved(); },
    onError:   (e) => toast.error(e.message),
  });

  return (
    <div
      className="absolute inset-0 bg-black/95 p-3 flex flex-col gap-2 z-10 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Titre"
        className="w-full text-xs bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
      />
      <input
        value={alt}
        onChange={e => setAlt(e.target.value)}
        placeholder="Alt text"
        className="w-full text-xs bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
      />
      <input
        value={subcategory}
        onChange={e => setSubcategory(e.target.value)}
        placeholder="Sous-catégorie"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="w-full text-xs bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
      />
      <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
        <input
          type="checkbox"
          checked={active}
          onChange={e => setActive(e.target.checked)}
          className="rounded"
        />
        Visible
      </label>
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => update.mutate({ id: item.id, title, alt, subcategory: subcategory || undefined, active })}
          disabled={update.isPending}
          className="flex-1 flex items-center justify-center gap-1 bg-amber-500/80 hover:bg-amber-500 rounded py-1.5 text-xs font-semibold text-black transition-colors disabled:opacity-50"
        >
          {update.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
          Sauver
        </button>
        <button
          onClick={onClose}
          className="px-3 bg-white/10 hover:bg-white/20 rounded py-1.5 text-xs text-white/70 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Panneau Upload ───────────────────────────────────────────────────────────

function UploadPanel() {
  const [files,       setFiles]       = useState<File[]>([]);
  const [previews,    setPreviews]    = useState<string[]>([]);
  const [category,    setCategory]    = useState<Category>("autre");
  const [subcategory, setSubcategory] = useState("");
  const [dragging,    setDragging]    = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [results,     setResults]     = useState<{ name: string; ok: boolean; msg?: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = trpc.media.upload.useMutation();

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const valid = Array.from(newFiles).filter(f => {
      if (!ALLOWED_MIME.includes(f.type)) {
        toast.error(`${f.name} : format non supporté`);
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} : trop volumineux (max 10 Mo)`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...valid]);
    valid.forEach(f => {
      const url = URL.createObjectURL(f);
      setPreviews(prev => [...prev, url]);
    });
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setResults([]);
    const newResults: { name: string; ok: boolean; msg?: string }[] = [];

    for (const file of files) {
      try {
        const fileData = await fileToBase64(file);
        await upload.mutateAsync({
          filename:    file.name,
          fileData,
          mimeType:    file.type,
          title:       file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
          category,
          subcategory: subcategory.trim() || undefined,
        });
        newResults.push({ name: file.name, ok: true });
      } catch (err: any) {
        newResults.push({ name: file.name, ok: false, msg: err.message });
      }
    }

    setResults(newResults);
    setUploading(false);

    const ok = newResults.filter(r => r.ok).length;
    if (ok > 0) {
      toast.success(`${ok} image${ok > 1 ? "s" : ""} uploadée${ok > 1 ? "s" : ""}`);
      setFiles([]);
      setPreviews([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/3 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-amber-400" />
          Uploader des images
        </h2>

        {/* Zone drag & drop */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragging
              ? "border-amber-500/60 bg-amber-500/5"
              : "border-white/20 hover:border-white/40"
          }`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-white/30" />
          <p className="text-white/50 text-sm">
            Glissez vos images ici<br />
            <span className="text-xs">JPEG, PNG, WebP, GIF, SVG — max 10 Mo</span>
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={e => { if (e.target.files) handleFiles(e.target.files); }}
          />
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previews.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500/80 rounded transition-colors"
                  onClick={() => removeFile(i)}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Catégorie */}
        <div>
          <label className="text-xs font-medium text-white/60 mb-1.5 block">Catégorie</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
          >
            {CATEGORIES.filter(c => c.key !== "all").map(cat => (
              <option key={cat.key} value={cat.key}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Sous-catégorie */}
        <div className="relative z-50 pointer-events-auto">
          <label className="text-xs font-medium text-white/60 mb-1.5 block">
            Sous-catégorie <span className="text-white/30">(optionnel)</span>
          </label>
          <input
            type="text"
            value={subcategory}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onChange={e => setSubcategory(e.target.value)}
            placeholder="ex: ecran-geant, tente-x, home..."
            className="relative z-50 pointer-events-auto w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
          />
          <p className="text-xs text-white/30 mt-1">
            La sous-catégorie détermine quelle page du site utilisera ces images.
          </p>
        </div>

        {/* Bouton upload */}
        <button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-semibold text-black transition-colors"
        >
          {uploading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Upload en cours…</>
            : <><Upload className="w-4 h-4" /> Uploader {files.length > 0 ? `${files.length} fichier${files.length > 1 ? "s" : ""}` : ""}</>
          }
        </button>

        {/* Résultats */}
        {results.length > 0 && (
          <div className="space-y-1.5">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                r.ok ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              }`}>
                {r.ok
                  ? <Check className="w-3.5 h-3.5 flex-shrink-0" />
                  : <X className="w-3.5 h-3.5 flex-shrink-0" />
                }
                <span className="truncate">{r.name}</span>
                {r.msg && <span className="ml-auto text-white/40 truncate">{r.msg}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guide sous-catégories */}
      <div className="bg-white/3 border border-white/10 rounded-xl p-4">
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
          Sous-catégories des pages produits
        </h3>
        <div className="space-y-1 text-xs text-white/40">
          {[
            ["ecran-geant",      "Page Écran Géant"],
            ["ecran-etanche",    "Page Écran Étanche"],
            ["ecran-economique", "Page Écran Économique"],
            ["tente-x",          "Page Tente X"],
            ["tente-n",          "Page Tente N"],
            ["tente-v",          "Page Tente V"],
            ["tente-araignee",   "Page Tente Araignée"],
            ["arches-gonflables","Page Arches"],
            ["mobilier",         "Page Mobilier"],
            ["accessoires",      "Page Accessoires"],
          ].map(([sub, label]) => (
            <div key={sub} className="flex justify-between">
              <code className="text-amber-400/60">{sub}</code>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
