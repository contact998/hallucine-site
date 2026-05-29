/**
 * client/src/pages/AdminMedia.tsx
 * Médiathèque admin — galerie, upload, recherche, tri, sélection multi,
 * lightbox navigable, slide-over détail, drag&drop tri, rename R2 SEO.
 */
import { useState, useRef, useCallback, useEffect, useMemo, forwardRef, type ComponentProps } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useNoIndex } from "@/hooks/useNoIndex";
import { toast } from "sonner";
import {
  Upload, Trash2, Edit2, Copy, Loader2,
  AlertTriangle, ChevronLeft, ChevronRight, ChevronDown, X, Check,
  EyeOff, Eye, Search, Download, Info, Tag,
  MousePointer2, LogOut, Plus,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MEDIA_PAGES } from "@shared/mediaPages";
import type { MediaPage } from "@shared/mediaPages";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "blog" | "realisations" | "galerie" | "produits" | "ui" | "og" | "autre";

type MediaItem = {
  id: number;
  url: string;
  filename: string;
  mimeType: string | null;
  filesize: number | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  title: string | null;
  tags: string | null;
  category: string;
  subcategory: string | null;
  sortOrder: number;
  active: boolean;
  source: string;
  uploadedBy: number | null;
  usageCount: number;
  createdAt: string | Date;
  updatedAt: string | Date | null;
  page: string | null;
  section: string | null;
};

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

const SUBCATEGORIES_PRODUITS = [
  "ecran-geant", "ecran-etanche", "ecran-economique",
  "tente-x", "tente-n", "tente-v", "tente-araignee",
  "arches-gonflables", "mobilier", "accessoires", "drive-in",
];

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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

function formatDate(d: string | Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Télécharge une image via le proxy serveur (Content-Disposition: attachment).
 * Passe par /api/admin/media-download/:id pour bypasser CORS R2 et garantir
 * que le navigateur sauvegarde dans ~/Downloads avec le nom propre.
 */
function downloadImageById(id: number, _filename?: string): void {
  // Lien direct : le serveur renvoie un Content-Disposition: attachment qui
  // déclenche le download natif du navigateur (vers ~/Downloads sur macOS).
  const a = document.createElement("a");
  a.href = `/api/admin/media-download/${id}`;
  // Hint au navigateur — ignoré si le serveur fournit déjà filename, mais utile en backup
  if (_filename) a.download = _filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function AdminMedia() {
  useDocumentMeta("Médiathèque", "Gestion des images du site Hallucine.");
  useNoIndex();

  const { user, loading: authLoading, isAuthenticated } = useAuth();

  // ⚠️ Tous les hooks AVANT les return conditionnels (règle des hooks React).
  const [uploadPage,    setUploadPage]    = useState<string>("");
  const [uploadSection, setUploadSection] = useState<string>("");
  const uploadPanelRef = useRef<HTMLDivElement>(null);

  const handleUploadTarget = useCallback((page: string, section: string) => {
    setUploadPage(page);
    setUploadSection(section);
    setTimeout(() => {
      uploadPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

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
            Recherche, sélection multi, drag&drop, rename SEO. Les modifications sont visibles immédiatement sans redéploiement.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <GaleriePanel onUploadTarget={handleUploadTarget} />
          <UploadPanel
            ref={uploadPanelRef}
            initialPage={uploadPage}
            initialSection={uploadSection}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ─── Panneau Galerie ──────────────────────────────────────────────────────────

function GaleriePanel({ onUploadTarget }: { onUploadTarget: (page: string, section: string) => void }) {
  const [search, setSearch]               = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editItem, setEditItem]           = useState<number | null>(null);
  const [detailItemId, setDetailItemId]   = useState<number | null>(null);
  const [lightboxItems, setLightboxItems] = useState<MediaItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectMode, setSelectMode]       = useState(false);
  const [selected, setSelected]           = useState<Set<number>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reset sélection quand on change la recherche
  useEffect(() => {
    setSelected(new Set());
  }, [debouncedSearch]);

  // Vue pages : charge tout (sans pagination) pour regrouper
  const { data: pageData, isLoading, refetch } = trpc.media.list.useQuery({
    activeOnly: false,
    search:     debouncedSearch || undefined,
    sortBy:     "sortOrder",
    sortDir:    "asc",
    limit:      1000,
    offset:     0,
  });

  const deactivate = trpc.media.deactivate.useMutation({
    onSuccess: () => { toast.success("Image masquée"); refetch(); },
    onError:   (e) => toast.error(e.message),
  });
  const update = trpc.media.update.useMutation({
    onSuccess: () => { refetch(); },
    onError:   (e) => toast.error(e.message),
  });
  const deleteMedia = trpc.media.delete.useMutation({
    onSuccess: () => { toast.success("Image supprimée"); refetch(); },
    onError:   (e) => toast.error(e.message),
  });
  const utils = trpc.useUtils();
  const bulkDeactivate = trpc.media.bulkDeactivate.useMutation({
    onSuccess: (r) => { toast.success(`${r.count} masquée(s)`); setSelected(new Set()); refetch(); },
    onError:   (e) => toast.error(e.message),
  });
  const bulkDelete = trpc.media.bulkDelete.useMutation({
    onSuccess: (r) => { toast.success(`${r.count} supprimée(s)`); setSelected(new Set()); refetch(); },
    onError:   (e) => toast.error(e.message),
  });

  const allPageItems: MediaItem[] = pageData?.items ?? [];

  // ─── Sélection ─────────────────────────────────────────────────────────────
  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectAll = () => setSelected(new Set(allPageItems.map(i => i.id)));
  const clearSelection = () => setSelected(new Set());

  // ─── Lightbox keyboard ──────────────────────────────────────────────────────
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     setLightboxIndex(null);
      else if (e.key === "ArrowLeft")  setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i));
      else if (e.key === "ArrowRight") setLightboxIndex(i => (i !== null && i < lightboxItems.length - 1 ? i + 1 : i));
      else if (e.key === "d" || e.key === "D") {
        if (lightboxIndex !== null) {
          const it = lightboxItems[lightboxIndex];
          if (it) downloadImageById(it.id, it.filename);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, lightboxItems]);

  // Helper pour ouvrir la lightbox dans un contexte de liste
  const openLightbox = (items: MediaItem[], id: number) => {
    const idx = items.findIndex(i => i.id === id);
    if (idx >= 0) { setLightboxItems(items); setLightboxIndex(idx); }
  };

  // Props communes pour MediaCard
  const commonCardProps = (item: MediaItem, contextItems: MediaItem[]) => ({
    item,
    selectMode,
    selected: selected.has(item.id),
    onToggleSelect: () => toggleSelect(item.id),
    onOpenLightbox: () => openLightbox(contextItems, item.id),
    onOpenDetail:   () => setDetailItemId(item.id),
    onEdit:         () => setEditItem(item.id === editItem ? null : item.id),
    editing:        editItem === item.id,
    onSavedEdit:    () => { setEditItem(null); refetch(); },
    onCloseEdit:    () => setEditItem(null),
    onDeactivate:   () => deactivate.mutate({ id: item.id }),
    onReactivate:   () => update.mutate({ id: item.id, active: true }),
    onRemoveFromPage: item.page ? () => {
      update.mutate({ id: item.id, page: null, section: null });
    } : undefined,
    onDelete: async () => {
      try {
        const others = await utils.media.otherUsages.fetch({ id: item.id });
        if (others.length > 0) {
          if (!confirm(`Cette image est aussi utilisée sur d'autres pages. Elle sera retirée seulement d'ici ; le fichier est conservé. Continuer ?`)) return;
        } else {
          if (!confirm(`Dernière occurrence de cette image. Supprimer définitivement le fichier ? (irréversible)`)) return;
        }
        deleteMedia.mutate({ id: item.id, deleteOnR2: true });
      } catch {
        if (confirm(`Supprimer "${item.title ?? item.filename}" ? Cette action est irréversible.`)) {
          deleteMedia.mutate({ id: item.id, deleteOnR2: true });
        }
      }
    },
    dndEnabled: false,
  });

  return (
    <div className="space-y-4">
      {/* Recherche + mode sélection */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Recherche (titre, alt, nom de fichier, tag…)"
            className="w-full bg-white/5 border border-white/15 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => { setSelectMode(m => !m); setSelected(new Set()); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
            selectMode
              ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
              : "bg-white/5 border-white/15 text-white/60 hover:text-white"
          }`}
          title="Activer la sélection multiple"
        >
          <MousePointer2 className="w-4 h-4" />
          {selectMode ? "Sélection ON" : "Sélectionner"}
        </button>
      </div>

      {/* Stats */}
      <div className="text-xs text-white/40">
        <span>
          {allPageItems.length} image{allPageItems.length !== 1 ? "s" : ""} au total
          {debouncedSearch && ` — filtre « ${debouncedSearch} »`}
        </span>
      </div>

      {/* Vue Par Page (unique) */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <PagedMediaView
          items={allPageItems}
          onCardProps={commonCardProps}
          onUploadTarget={onUploadTarget}
        />
      )}

      {/* Barre actions multi-sélection */}
      {selectMode && selected.size > 0 && (
        <BulkActionBar
          count={selected.size}
          totalShown={allPageItems.length}
          onSelectAll={selectAll}
          onClear={clearSelection}
          onDeactivate={() => bulkDeactivate.mutate({ ids: Array.from(selected) })}
          onDelete={() => {
            if (confirm(`Supprimer définitivement ${selected.size} image(s) ? Action irréversible.`)) {
              bulkDelete.mutate({ ids: Array.from(selected), deleteOnR2: true });
            }
          }}
          onDownload={async () => {
            const sel = allPageItems.filter(i => selected.has(i.id));
            for (const it of sel) {
              await downloadImageById(it.id, it.filename);
              await new Promise(r => setTimeout(r, 150));
            }
            toast.success(`${sel.length} téléchargement(s) lancé(s)`);
          }}
          pending={bulkDeactivate.isPending || bulkDelete.isPending}
        />
      )}

      {/* Slide-over détail */}
      {detailItemId !== null && (
        <DetailDrawer
          itemId={detailItemId}
          onClose={() => setDetailItemId(null)}
        />
      )}

      {/* Lightbox plein écran avec nav */}
      {lightboxIndex !== null && lightboxItems[lightboxIndex] && (
        <AdminLightbox
          items={lightboxItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setLightboxIndex(i => (i !== null && i < lightboxItems.length - 1 ? i + 1 : i))}
        />
      )}
    </div>
  );
}

// ─── Vue regroupée par page/section ──────────────────────────────────────────

type CardPropsFactory = (item: MediaItem, contextItems: MediaItem[]) => ComponentProps<typeof SortableMediaCard>;

function PagedMediaView({ items, onCardProps, onUploadTarget }: {
  items: MediaItem[];
  selectMode?: boolean;
  selected?: Set<number>;
  editItem?: number | null;
  onCardProps: CardPropsFactory;
  onUploadTarget: (page: string, section: string) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

  const knownPageKeys = new Set(MEDIA_PAGES.map(p => p.key));

  // Groupe « À ranger » : page null, vide, ou clé inconnue
  const unassigned = items.filter(it => !it.page || !knownPageKeys.has(it.page));

  return (
    <div className="space-y-3">
      {MEDIA_PAGES.map((page: MediaPage) => {
        const pageItems = items.filter(it => it.page === page.key);
        const isCollapsed = collapsed[page.key] ?? false;

        return (
          <div key={page.key} className="border border-white/10 rounded-xl overflow-hidden">
            {/* En-tête page */}
            <div className="flex items-center bg-white/5 hover:bg-white/8 transition-colors">
              <button
                onClick={() => toggle(page.key)}
                className="flex-1 flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-white/80 text-sm font-semibold">
                  {page.label}
                  <span className="ml-2 text-white/30 text-xs font-normal">
                    ({pageItems.length} photo{pageItems.length !== 1 ? "s" : ""})
                  </span>
                </span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onUploadTarget(page.key, ""); }}
                className="px-3 py-3 text-white/40 hover:text-amber-400 transition-colors flex items-center gap-1 text-xs"
                title={`Uploader dans ${page.label}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {!isCollapsed && (
              <div className="p-3 space-y-4">
                {page.sections.map(section => {
                  const sectionItems = pageItems.filter(it => it.section === section.key);
                  return (
                    <div key={section.key}>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-white/40 text-[10px] uppercase tracking-wider flex-1">
                          {section.label}
                          {sectionItems.length > 0 && (
                            <span className="ml-1 text-white/20">({sectionItems.length})</span>
                          )}
                        </p>
                        <button
                          onClick={() => onUploadTarget(page.key, section.key)}
                          className="flex items-center gap-0.5 text-[10px] text-white/30 hover:text-amber-400 transition-colors px-1.5 py-0.5 rounded hover:bg-amber-500/10"
                          title={`Uploader dans ${section.label}`}
                        >
                          <Plus className="w-3 h-3" />
                          Ajouter
                        </button>
                      </div>
                      {sectionItems.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                          {sectionItems.map(item => (
                            <SortableMediaCard
                              key={item.id}
                              {...onCardProps(item, sectionItems)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Photos de la page sans section connue */}
                {(() => {
                  const knownSectionKeys = new Set(page.sections.map(s => s.key));
                  const noSection = pageItems.filter(it => !it.section || !knownSectionKeys.has(it.section));
                  if (noSection.length === 0) return null;
                  return (
                    <div>
                      <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">
                        Sans section
                        <span className="ml-1 text-white/20">({noSection.length})</span>
                      </p>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {noSection.map(item => (
                          <SortableMediaCard key={item.id} {...onCardProps(item, noSection)} />
                        ))}
                      </div>
                    </div>
                  );
                })()}
                {pageItems.length === 0 && (
                  <p className="text-white/20 text-xs italic py-2">Aucune image pour cette page.</p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Bloc « À ranger » */}
      {(() => {
        const key = "__unassigned__";
        const isCollapsed = collapsed[key] ?? false;
        return (
          <div className="border border-amber-500/20 rounded-xl overflow-hidden">
            <div className="flex items-center bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
              <button
                onClick={() => toggle(key)}
                className="flex-1 flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-amber-300/80 text-sm font-semibold">
                  À ranger
                  <span className="ml-2 text-amber-300/40 text-xs font-normal">
                    ({unassigned.length} photo{unassigned.length !== 1 ? "s" : ""} sans page)
                  </span>
                </span>
                <ChevronDown className={`w-4 h-4 text-amber-400/40 transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onUploadTarget("", ""); }}
                className="px-3 py-3 text-amber-400/40 hover:text-amber-400 transition-colors flex items-center gap-1 text-xs"
                title="Uploader sans page assignée"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {!isCollapsed && (
              <div className="p-3">
                {unassigned.length === 0 ? (
                  <p className="text-white/20 text-xs italic py-2">Toutes les images sont rangées.</p>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {unassigned.map(item => (
                      <SortableMediaCard key={item.id} {...onCardProps(item, unassigned)} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

// ─── Carte média (sortable) ──────────────────────────────────────────────────

function SortableMediaCard(props: {
  item: MediaItem;
  selectMode: boolean;
  selected: boolean;
  onToggleSelect: () => void;
  onOpenLightbox: () => void;
  onOpenDetail: () => void;
  onEdit: () => void;
  editing: boolean;
  onSavedEdit: () => void;
  onCloseEdit: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
  onDelete: () => void;
  onRemoveFromPage?: () => void;
  dndEnabled: boolean;
}) {
  const { item, selectMode, selected, onToggleSelect, onOpenLightbox, onOpenDetail,
          onEdit, editing, onSavedEdit, onCloseEdit, onDeactivate, onReactivate, onDelete,
          onRemoveFromPage, dndEnabled } = props;
  const sortable = useSortable({ id: item.id, disabled: !dndEnabled });
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      {...(dndEnabled ? attributes : {})}
      {...(dndEnabled ? listeners : {})}
      className={`group relative aspect-square rounded-lg overflow-hidden border transition-all ${
        selected ? "border-amber-400 ring-2 ring-amber-400/50" :
        item.active ? "border-white/10 hover:border-white/30" : "border-red-500/30 opacity-50"
      } ${dndEnabled ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      <img
        src={item.url}
        alt={item.alt ?? item.title ?? ""}
        className="w-full h-full object-cover"
        loading="lazy"
        onClick={(e) => {
          e.stopPropagation();
          if (selectMode) onToggleSelect();
          else onOpenLightbox();
        }}
      />

      {/* Checkbox sélection */}
      {selectMode && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`absolute top-1.5 left-1.5 w-5 h-5 rounded flex items-center justify-center transition-all ${
            selected ? "bg-amber-400 text-black" : "bg-black/60 text-white/0 hover:bg-black/80"
          }`}
          aria-label={selected ? "Désélectionner" : "Sélectionner"}
        >
          {selected && <Check className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* Badge catégorie + sous-cat */}
      {!selectMode && (
        <div className="absolute top-1 left-1 pointer-events-none">
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
            CATEGORIES.find(c => c.key === item.category)?.color ?? "bg-gray-500/20 text-gray-300"
          }`}>
            {item.subcategory ?? item.category}
          </span>
        </div>
      )}

      {/* Badge masqué */}
      {!item.active && (
        <div className="absolute top-1 right-1 pointer-events-none">
          <EyeOff className="w-3.5 h-3.5 text-red-400" />
        </div>
      )}

      {/* Overlay actions (hidden in select mode) */}
      {!selectMode && (
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 pointer-events-none">
          <p className="text-white text-[10px] font-medium line-clamp-2 pointer-events-none">{item.title}</p>
          <div className="flex gap-1 justify-end pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
            <ActionBtn title="Télécharger" onClick={(e) => { e.stopPropagation(); downloadImageById(item.id, item.filename); }} color="bg-emerald-500/30 hover:bg-emerald-500/50">
              <Download className="w-3 h-3 text-emerald-300" />
            </ActionBtn>
            <ActionBtn title="Détails et utilisation" onClick={(e) => { e.stopPropagation(); onOpenDetail(); }} color="bg-cyan-500/30 hover:bg-cyan-500/50">
              <Info className="w-3 h-3 text-cyan-300" />
            </ActionBtn>
            <ActionBtn title="Copier l'URL" onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(item.url);
              toast.success("URL copiée");
            }} color="bg-white/10 hover:bg-white/20">
              <Copy className="w-3 h-3 text-white" />
            </ActionBtn>
            <ActionBtn title="Modifier" onClick={(e) => { e.stopPropagation(); onEdit(); }} color="bg-blue-500/30 hover:bg-blue-500/50">
              <Edit2 className="w-3 h-3 text-blue-300" />
            </ActionBtn>
            {onRemoveFromPage && item.page && (
              <ActionBtn title="Retirer de la page" onClick={(e) => { e.stopPropagation(); onRemoveFromPage(); }} color="bg-orange-500/30 hover:bg-orange-500/50">
                <LogOut className="w-3 h-3 text-orange-300" />
              </ActionBtn>
            )}
            {item.active ? (
              <ActionBtn title="Masquer" onClick={(e) => { e.stopPropagation(); onDeactivate(); }} color="bg-yellow-500/30 hover:bg-yellow-500/50">
                <EyeOff className="w-3 h-3 text-yellow-300" />
              </ActionBtn>
            ) : (
              <ActionBtn title="Réactiver" onClick={(e) => { e.stopPropagation(); onReactivate(); }} color="bg-green-500/30 hover:bg-green-500/50">
                <Eye className="w-3 h-3 text-green-300" />
              </ActionBtn>
            )}
            <ActionBtn
              title="Supprimer"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              color="bg-red-500/30 hover:bg-red-500/50"
            >
              <Trash2 className="w-3 h-3 text-red-300" />
            </ActionBtn>
          </div>
        </div>
      )}

      {/* Panneau d'édition inline */}
      {editing && (
        <EditInline item={item} onClose={onCloseEdit} onSaved={onSavedEdit} />
      )}
    </div>
  );
}

function ActionBtn(props: {
  title: string;
  onClick: (e: React.MouseEvent) => void;
  color: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`p-1.5 rounded transition-colors ${props.color} disabled:opacity-30 disabled:cursor-not-allowed`}
      title={props.title}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

// ─── Barre actions en masse ──────────────────────────────────────────────────

function BulkActionBar(props: {
  count: number;
  totalShown: number;
  onSelectAll: () => void;
  onClear: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onDownload: () => void;
  pending: boolean;
}) {
  return (
    <div className="sticky bottom-4 z-40 mt-4">
      <div className="bg-amber-500/10 backdrop-blur-md border border-amber-400/40 rounded-xl p-3 flex flex-wrap items-center gap-3 shadow-lg">
        <span className="text-amber-300 text-sm font-semibold">
          {props.count} sélectionnée{props.count > 1 ? "s" : ""}
        </span>
        {props.count < props.totalShown && (
          <button onClick={props.onSelectAll} className="text-xs text-white/60 hover:text-white underline">
            Tout sélectionner ({props.totalShown})
          </button>
        )}
        <div className="flex-1" />
        <button
          onClick={props.onDownload}
          disabled={props.pending}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 rounded text-xs font-semibold text-emerald-300 transition-colors disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" /> Télécharger
        </button>
        <button
          onClick={props.onDeactivate}
          disabled={props.pending}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 rounded text-xs font-semibold text-yellow-300 transition-colors disabled:opacity-50"
        >
          <EyeOff className="w-3.5 h-3.5" /> Masquer
        </button>
        <button
          onClick={props.onDelete}
          disabled={props.pending}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-xs font-semibold text-red-300 transition-colors disabled:opacity-50"
        >
          {props.pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Supprimer
        </button>
        <button
          onClick={props.onClear}
          className="p-1.5 text-white/40 hover:text-white"
          title="Annuler la sélection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Slide-over détail ───────────────────────────────────────────────────────

function DetailDrawer(props: { itemId: number; onClose: () => void }) {
  const { data: item } = trpc.media.get.useQuery({ id: props.itemId });
  const { data: usage, isLoading: usageLoading } = trpc.media.findUsage.useQuery(
    { url: item?.url ?? "" },
    { enabled: !!item?.url },
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") props.onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props]);

  return (
    <div className="fixed inset-0 z-50 flex" onClick={props.onClose}>
      <div className="flex-1 bg-black/60" />
      <div
        className="w-full max-w-md bg-charcoal-light border-l border-white/10 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-charcoal-light border-b border-white/10 px-5 py-3 flex items-center justify-between z-10">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" /> Détails
          </h2>
          <button onClick={props.onClose} className="p-1 text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        {!item ? (
          <div className="p-8 text-center text-white/40">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="p-5 space-y-5">
            <div className="aspect-video bg-black/40 rounded-lg overflow-hidden flex items-center justify-center">
              <img src={item.url} alt={item.alt ?? ""} className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2">
              <button
                onClick={() => downloadImageById(item.id, item.filename)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded text-sm font-semibold text-emerald-300"
              >
                <Download className="w-4 h-4" /> Télécharger
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(item.url); toast.success("URL copiée"); }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded text-sm text-white/70"
              >
                <Copy className="w-4 h-4" /> Copier l'URL
              </button>
            </div>

            <DetailRow label="Titre"       value={item.title || "—"} />
            <DetailRow label="Alt"         value={item.alt || "—"} mono={false} multiline />
            <DetailRow label="Catégorie"   value={`${item.category}${item.subcategory ? " / " + item.subcategory : ""}`} />
            <DetailRow label="Tags"        value={item.tags ? JSON.parse(item.tags).join(", ") : "—"} />
            <DetailRow label="Dimensions"  value={item.width && item.height ? `${item.width} × ${item.height} px` : "—"} />
            <DetailRow label="Poids"       value={formatBytes(item.filesize)} />
            <DetailRow label="Format"      value={item.mimeType || "—"} />
            <DetailRow label="Nom fichier" value={item.filename} mono />
            <DetailRow label="Date upload" value={formatDate(item.createdAt)} />
            <DetailRow label="Source"      value={item.source} />
            <DetailRow label="Visible"     value={item.active ? "Oui" : "Non (masquée)"} />
            <DetailRow label="Usage compteur" value={String(item.usageCount)} />

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                Où elle est utilisée
              </h3>
              {usageLoading ? (
                <div className="text-white/40 text-xs">
                  <Loader2 className="w-3 h-3 animate-spin inline mr-1" /> scan du code en cours…
                </div>
              ) : !usage || usage.matches.length === 0 ? (
                <p className="text-white/30 text-xs italic">Aucune référence trouvée dans le code source.</p>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
                  {usage.matches.map((m, i) => (
                    <div key={i} className="bg-white/5 rounded p-2 text-[10px]">
                      <div className="text-amber-300 font-mono">{m.file}<span className="text-white/30">:{m.line}</span></div>
                      <div className="text-white/50 font-mono mt-0.5 break-all line-clamp-2">{m.snippet}</div>
                    </div>
                  ))}
                  {usage.truncated && <p className="text-white/30 text-[10px] italic">(résultats tronqués à 50)</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono = false, multiline = false }: {
  label: string; value: string; mono?: boolean; multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-white/80 text-sm ${mono ? "font-mono text-xs" : ""} ${multiline ? "" : "truncate"}`}>
        {value}
      </p>
    </div>
  );
}

// ─── Lightbox admin avec navigation ──────────────────────────────────────────

function AdminLightbox(props: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = props.items[props.index];
  if (!item) return null;
  const hasPrev = props.index > 0;
  const hasNext = props.index < props.items.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={props.onClose}
    >
      {/* Croix */}
      <button
        onClick={(e) => { e.stopPropagation(); props.onClose(); }}
        className="absolute top-4 right-4 text-white/60 hover:text-white"
        aria-label="Fermer"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Download */}
      <button
        onClick={(e) => { e.stopPropagation(); downloadImageById(item.id, item.filename); }}
        className="absolute top-4 right-16 text-white/60 hover:text-emerald-300 flex items-center gap-1.5"
        title="Télécharger (raccourci : D)"
      >
        <Download className="w-6 h-6" />
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); props.onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
          aria-label="Précédent"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <img
        src={item.url}
        alt={item.alt ?? ""}
        className="max-w-full max-h-[85vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Caption + counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-white/80 text-sm font-medium">{item.title || item.filename}</p>
        <p className="text-white/40 text-xs">
          {props.index + 1} / {props.items.length} · ← → pour naviguer · D pour télécharger · Échap pour fermer
        </p>
      </div>

      {/* Next */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); props.onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
          aria-label="Suivant"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

// ─── Édition inline (avec rename R2 SEO) ─────────────────────────────────────

function EditInline({
  item,
  onClose,
  onSaved,
}: {
  item: MediaItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title,       setTitle]       = useState(item.title ?? "");
  const [alt,         setAlt]         = useState(item.alt ?? "");
  const [category,    setCategory]    = useState(item.category as Category);
  const [subcategory, setSubcategory] = useState(item.subcategory ?? "");
  const [active,      setActive]      = useState(item.active);
  const [page,        setPage]        = useState<string>(item.page ?? "");
  const [section,     setSection]     = useState<string>(item.section ?? "");
  const [newSlug,     setNewSlug]     = useState("");

  // Sections disponibles selon la page sélectionnée
  const availableSections = useMemo(
    () => MEDIA_PAGES.find(p => p.key === page)?.sections ?? [],
    [page]
  );

  const update = trpc.media.update.useMutation({
    onSuccess: () => { toast.success("Modifié"); onSaved(); },
    onError:   (e) => toast.error(e.message),
  });
  const renameR2 = trpc.media.renameR2.useMutation({
    onSuccess: () => { toast.success("Renommé sur R2"); setNewSlug(""); onSaved(); },
    onError:   (e) => toast.error(e.message),
  });

  return (
    <div
      className="absolute inset-0 bg-black/95 p-3 flex flex-col gap-2 z-10 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
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
        placeholder="Alt text (SEO)"
        className="w-full text-xs bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value as Category)}
        className="w-full text-xs bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white focus:outline-none focus:border-amber-500/50"
      >
        <option value="blog">Blog</option>
        <option value="produits">Produits</option>
        <option value="galerie">Galerie</option>
        <option value="realisations">Réalisations</option>
        <option value="ui">UI</option>
        <option value="og">OG</option>
        <option value="autre">Autre</option>
      </select>
      <input
        list={`subcat-${item.id}`}
        value={subcategory}
        onChange={e => setSubcategory(e.target.value)}
        placeholder="Sous-catégorie"
        className="w-full text-xs bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
      />
      <datalist id={`subcat-${item.id}`}>
        {SUBCATEGORIES_PRODUITS.map(s => <option key={s} value={s} />)}
      </datalist>

      {/* Page du site */}
      <select
        value={page}
        onChange={e => { setPage(e.target.value); setSection(""); }}
        className="w-full text-xs bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white focus:outline-none focus:border-amber-500/50"
      >
        <option value="">(à ranger)</option>
        {MEDIA_PAGES.map(p => (
          <option key={p.key} value={p.key}>{p.label}</option>
        ))}
      </select>

      {/* Section */}
      {availableSections.length > 0 && (
        <select
          value={section}
          onChange={e => setSection(e.target.value)}
          className="w-full text-xs bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white focus:outline-none focus:border-amber-500/50"
        >
          <option value="">(sans section)</option>
          {availableSections.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      )}

      <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
        <input
          type="checkbox"
          checked={active}
          onChange={e => setActive(e.target.checked)}
          className="rounded"
        />
        Visible
      </label>

      {/* Rename R2 slug */}
      <div className="border-t border-white/10 pt-2 mt-1">
        <p className="text-[9px] text-white/40 mb-1 uppercase tracking-wider">Renommer le fichier (SEO)</p>
        <div className="flex gap-1">
          <input
            value={newSlug}
            onChange={e => setNewSlug(e.target.value)}
            placeholder="ex: ecran-cinema-jardin"
            className="flex-1 text-[10px] bg-white/10 border border-white/20 rounded px-2 py-1 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
          />
          <button
            disabled={!newSlug.trim() || renameR2.isPending}
            onClick={() => {
              if (item.usageCount > 0) {
                if (!confirm(`Cette image est utilisée ${item.usageCount}x — renommer va casser les références. Continuer ?`)) return;
              }
              renameR2.mutate({ id: item.id, slug: newSlug.trim() });
            }}
            className="px-2 py-1 bg-purple-500/30 hover:bg-purple-500/50 rounded text-[10px] font-semibold text-purple-200 disabled:opacity-40"
          >
            {renameR2.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Renommer"}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => update.mutate({
            id: item.id,
            title,
            alt,
            category,
            subcategory: subcategory || undefined,
            active,
            page: page || null,
            section: section || null,
          })}
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

const UploadPanel = forwardRef<HTMLDivElement, {
  initialPage?: string;
  initialSection?: string;
}>(function UploadPanel({ initialPage = "", initialSection = "" }, ref) {
  const [files,    setFiles]    = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadPage,    setUploadPage]    = useState<string>(initialPage);
  const [uploadSection, setUploadSection] = useState<string>(initialSection);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [results,  setResults]  = useState<{ name: string; ok: boolean; msg?: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync when parent changes initial values (from + button click)
  useEffect(() => { setUploadPage(initialPage); }, [initialPage]);
  useEffect(() => { setUploadSection(initialSection); }, [initialSection]);

  const availableSections = useMemo(
    () => MEDIA_PAGES.find(p => p.key === uploadPage)?.sections ?? [],
    [uploadPage]
  );

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
          filename: file.name,
          fileData,
          mimeType: file.type,
          title:    file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
          category: "autre",
          ...(uploadPage    ? { page: uploadPage }       : {}),
          ...(uploadSection ? { section: uploadSection } : {}),
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

  const selectedPageLabel = MEDIA_PAGES.find(p => p.key === uploadPage)?.label;
  const selectedSectionLabel = availableSections.find(s => s.key === uploadSection)?.label;

  return (
    <div className="space-y-4" ref={ref}>
      <div className="bg-white/3 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-amber-400" />
          Uploader des images
        </h2>

        {/* Destination page/section pré-remplie */}
        {uploadPage && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300">
            <Tag className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              Destination : <strong>{selectedPageLabel}</strong>
              {selectedSectionLabel && <> — {selectedSectionLabel}</>}
            </span>
            <button
              onClick={() => { setUploadPage(""); setUploadSection(""); }}
              className="ml-auto text-amber-300/50 hover:text-amber-300"
              title="Effacer la destination"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Zone drag & drop */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragging ? "border-amber-500/60 bg-amber-500/5" : "border-white/20 hover:border-white/40"
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
            <span className="text-xs">JPEG, PNG, WebP, GIF — max 10 Mo</span>
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
                <img loading="lazy" src={url} alt="" className="w-full h-full object-cover" />
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

        {/* Sélecteur Page */}
        <div>
          <label className="text-xs font-medium text-white/60 mb-1.5 block">Page</label>
          <select
            value={uploadPage}
            onChange={e => { setUploadPage(e.target.value); setUploadSection(""); }}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
          >
            <option value="">(À ranger)</option>
            {MEDIA_PAGES.map(p => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Sélecteur Section */}
        <div>
          <label className="text-xs font-medium text-white/60 mb-1.5 block">
            Section <span className="text-white/30">(optionnel)</span>
          </label>
          <select
            value={uploadSection}
            onChange={e => setUploadSection(e.target.value)}
            disabled={availableSections.length === 0}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">(sans section)</option>
            {availableSections.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
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
    </div>
  );
});
