/**
 * AdminMediaV2 — Médiathèque sur Refine (Milestone 1).
 *
 * Refine fournit la couche CRUD standard (liste paginée serveur, édition,
 * suppression, cache, erreurs) via la convention `mediaResource`. Les actions
 * spéciales (upload R2, remplacement de fichier) passent par les endpoints
 * `media.*` existants. L'ancien /admin/media reste intact à côté.
 */
import { useState, useMemo, useRef } from "react";
import { Refine, useList, useUpdate, useDelete, useInvalidate } from "@refinedev/core";
import { Loader2, Upload, X, Pencil, Trash2, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { MEDIA_PAGES, pageLabel } from "@shared/mediaPages";
import type { MediaItem } from "../../../drizzle/schema";
import { dataProvider, authProvider, notificationProvider } from "../admin-v2/providers";
import { BlogPanel } from "../admin-v2/BlogPanel";

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

function sectionsFor(pageKey: string) {
  return MEDIA_PAGES.find((p) => p.key === pageKey)?.sections ?? [];
}

// ─── Page (wrapper Refine) ──────────────────────────────────────────────────────
export default function AdminMediaV2() {
  const [tab, setTab] = useState<"media" | "blog">("media");
  return (
    <Refine
      dataProvider={dataProvider}
      authProvider={authProvider}
      notificationProvider={notificationProvider}
      resources={[
        { name: "mediaResource", meta: { label: "Médiathèque" } },
        { name: "blogResource", meta: { label: "Blog" } },
      ]}
      options={{ disableTelemetry: true, warnWhenUnsavedChanges: false }}
    >
      <div className="min-h-screen bg-background text-white">
        <div className="container mx-auto px-4 pt-28 pb-16 max-w-7xl">
          <div className="flex items-center gap-1 mb-6 border-b border-white/10">
            <TabBtn active={tab === "media"} onClick={() => setTab("media")}>Médiathèque</TabBtn>
            <TabBtn active={tab === "blog"} onClick={() => setTab("blog")}>Blog</TabBtn>
            <span className="ml-auto text-xs text-white/30 pb-2">admin v2</span>
          </div>
          {tab === "media" ? <MediaAdmin /> : <BlogPanel />}
        </div>
      </div>
    </Refine>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active ? "border-amber-400 text-white" : "border-transparent text-white/50 hover:text-white/80"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Écran médiathèque ──────────────────────────────────────────────────────────
function MediaAdmin() {
  const [pageFilter, setPageFilter] = useState<string>("");     // "" = toutes · "__none__" = à ranger
  const [sectionFilter, setSectionFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(1);
  const [editing, setEditing] = useState<MediaItem | null>(null);

  const invalidate = useInvalidate();
  const refresh = () => invalidate({ resource: "mediaResource", invalidates: ["list"] });

  const filters = useMemo(() => {
    const f: { field: string; operator: any; value: unknown }[] = [];
    if (pageFilter === "__none__") f.push({ field: "page", operator: "eq", value: null });
    else if (pageFilter) f.push({ field: "page", operator: "eq", value: pageFilter });
    if (sectionFilter) f.push({ field: "section", operator: "eq", value: sectionFilter });
    if (search.trim()) f.push({ field: "q", operator: "contains", value: search.trim() });
    return f;
  }, [pageFilter, sectionFilter, search]);

  const { data, isLoading, isError, error } = useList<MediaItem>({
    resource: "mediaResource",
    pagination: { current, pageSize: PER_PAGE },
    filters,
    sorters: [{ field: "sortOrder", order: "asc" }],
  });

  const items = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));

  function changeFilter(fn: () => void) { fn(); setCurrent(1); }

  // Upload d'une nouvelle image vers la page/section sélectionnée
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const upload = trpc.media.upload.useMutation({
    onSuccess: () => { toast.success("Image ajoutée"); refresh(); },
    onError: (e) => toast.error(e.message),
  });
  async function handleUpload(file: File) {
    if (!ALLOWED_MIME.includes(file.type)) { toast.error("Format non supporté"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Trop volumineux (max 10 Mo)"); return; }
    const fileData = await fileToBase64(file);
    const targetPage = pageFilter && pageFilter !== "__none__" ? pageFilter : undefined;
    upload.mutate({
      filename: file.name,
      fileData,
      mimeType: file.type,
      page: targetPage,
      section: targetPage ? (sectionFilter || undefined) : undefined,
    });
  }

  const canUploadHere = pageFilter && pageFilter !== "__none__";

  return (
    <>
        {/* En-tête */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Médiathèque</h1>
          <span className="text-xs text-white/40">{total} image{total > 1 ? "s" : ""}</span>
        </div>
        <p className="text-sm text-white/50 mb-6">
          Nouvelle version (Refine). L'ancienne reste disponible sur <code className="text-white/70">/admin/media</code>.
        </p>

        {/* Barre de filtres */}
        <div className="flex flex-wrap items-end gap-3 mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="flex flex-col gap-1 text-xs text-white/60">
            Page
            <select
              value={pageFilter}
              onChange={(e) => changeFilter(() => { setPageFilter(e.target.value); setSectionFilter(""); })}
              className="bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white min-w-[200px]"
            >
              <option value="">Toutes les pages</option>
              <option value="__none__">À ranger (non rangées)</option>
              {MEDIA_PAGES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </label>

          {pageFilter && pageFilter !== "__none__" && (
            <label className="flex flex-col gap-1 text-xs text-white/60">
              Section
              <select
                value={sectionFilter}
                onChange={(e) => changeFilter(() => setSectionFilter(e.target.value))}
                className="bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white min-w-[180px]"
              >
                <option value="">Toutes les sections</option>
                {sectionsFor(pageFilter).map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-1 text-xs text-white/60 flex-1 min-w-[180px]">
            Recherche
            <input
              value={search}
              onChange={(e) => changeFilter(() => setSearch(e.target.value))}
              placeholder="titre, alt, fichier…"
              className="bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </label>

          <div className="flex flex-col gap-1">
            <input ref={uploadInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }} />
            <button
              onClick={() => uploadInputRef.current?.click()}
              disabled={upload.isPending}
              title={canUploadHere ? `Ajouter dans ${pageLabel(pageFilter)}${sectionFilter ? " / " + sectionFilter : ""}` : "Ajoute dans « À ranger » (choisis une page pour cibler)"}
              className="flex items-center gap-2 text-sm bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg px-4 py-2 disabled:opacity-50"
            >
              {upload.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Ajouter une image
            </button>
            <span className="text-[11px] text-white/40">
              {canUploadHere ? `→ ${pageLabel(pageFilter)}${sectionFilter ? " / " + sectionFilter : ""}` : "→ À ranger"}
            </span>
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
            Aucune image pour ce filtre.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {items.map((m) => (
              <div key={m.id} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/30">
                <img src={m.url} alt={m.alt ?? ""} className="w-full h-full object-cover" loading="lazy" />
                {!m.active && (
                  <span className="absolute top-1.5 left-1.5 text-[10px] bg-black/70 text-white/80 px-1.5 py-0.5 rounded">masquée</span>
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
            >Précédent</button>
            <span className="text-sm text-white/60">Page {current} / {pageCount}</span>
            <button
              onClick={() => setCurrent((c) => Math.min(pageCount, c + 1))}
              disabled={current >= pageCount}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm disabled:opacity-40"
            >Suivant</button>
          </div>
        )}

      {editing && (
        <EditModal item={editing} onClose={() => setEditing(null)} onChanged={refresh} />
      )}
    </>
  );
}

// ─── Modal d'édition ────────────────────────────────────────────────────────────
function EditModal({ item, onClose, onChanged }: { item: MediaItem; onClose: () => void; onChanged: () => void }) {
  const [title, setTitle]     = useState(item.title ?? "");
  const [alt, setAlt]         = useState(item.alt ?? "");
  const [page, setPage]       = useState(item.page ?? "");
  const [section, setSection] = useState(item.section ?? "");
  const [active, setActive]   = useState(item.active);
  const [sortOrder, setSortOrder] = useState(item.sortOrder);
  const [showReplace, setShowReplace] = useState(false);

  const { mutate: update, isPending: saving } = useUpdate();
  const { mutate: remove } = useDelete();

  function save() {
    update(
      {
        resource: "mediaResource",
        id: item.id,
        values: {
          title: title || null,
          alt: alt || null,
          page: page || null,
          section: page ? (section || null) : null,
          active,
          sortOrder,
        },
        successNotification: () => ({ type: "success", message: "Enregistré" }),
      },
      { onSuccess: () => { onChanged(); onClose(); } }
    );
  }

  function softDelete() {
    if (!confirm("Retirer cette image ? Elle disparaît du site et de la médiathèque (le fichier R2 est conservé).")) return;
    remove(
      {
        resource: "mediaResource",
        id: item.id,
        successNotification: () => ({ type: "success", message: "Image retirée" }),
      },
      { onSuccess: () => { onChanged(); onClose(); } }
    );
  }

  // Remplacement de fichier (endpoints existants)
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceImage = trpc.media.replaceImage.useMutation({
    onSuccess: () => { toast.success("Image remplacée"); onChanged(); onClose(); },
    onError: (e) => toast.error(e.message),
  });
  async function importReplacement(file: File) {
    if (!ALLOWED_MIME.includes(file.type)) { toast.error("Format non supporté"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Trop volumineux (max 10 Mo)"); return; }
    const fileData = await fileToBase64(file);
    replaceImage.mutate({ id: item.id, filename: file.name, fileData, mimeType: file.type });
  }
  const updateUrl = trpc.media.update.useMutation({
    onSuccess: () => { toast.success("Image remplacée"); onChanged(); onClose(); },
    onError: (e) => toast.error(e.message),
  });
  // Pool « à ranger » pour le picker de remplacement
  const pool = trpc.mediaResource.list.useQuery(
    { pagination: { page: 1, perPage: 100 }, filters: [{ field: "page", operator: "eq", value: null }] },
    { enabled: showReplace }
  );

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 bg-neutral-900">
          <h2 className="font-semibold">Modifier l'image</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Aperçu */}
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30 max-h-56 flex items-center justify-center">
            <img src={item.url} alt={alt} className="max-h-56 object-contain" />
          </div>

          {/* Remplacer */}
          <div>
            <button
              onClick={() => setShowReplace((v) => !v)}
              className="text-sm text-amber-400 hover:text-amber-300"
            >
              {showReplace ? "Annuler le remplacement" : "Remplacer l'image…"}
            </button>
            {showReplace && (
              <div className="mt-2 space-y-2">
                <input ref={replaceInputRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) importReplacement(f); e.target.value = ""; }} />
                <button
                  onClick={() => replaceInputRef.current?.click()}
                  disabled={replaceImage.isPending}
                  className="w-full flex items-center justify-center gap-2 text-sm bg-emerald-500/80 hover:bg-emerald-500 text-black font-semibold rounded-lg py-2 disabled:opacity-50"
                >
                  {replaceImage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Importer un fichier de mon ordinateur
                </button>
                <p className="text-xs text-white/50 pt-1">ou choisis une image déjà dans « À ranger » :</p>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto bg-black/30 p-2 rounded-xl">
                  {(pool.data?.data ?? []).map((m: MediaItem) => (
                    <button
                      key={m.id}
                      title={m.title ?? m.filename}
                      onClick={() => updateUrl.mutate({ id: item.id, url: m.url, filename: m.filename, mimeType: m.mimeType ?? undefined })}
                      className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-amber-400 transition-colors"
                    >
                      <img src={m.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                  {pool.isLoading && <p className="col-span-4 text-xs text-white/40 py-4 text-center">Chargement…</p>}
                  {!pool.isLoading && (pool.data?.data ?? []).length === 0 && (
                    <p className="col-span-4 text-xs text-white/40 py-4 text-center">Aucune image dans « À ranger » — importe un fichier ci-dessus.</p>
                  )}
                </div>
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

          <div className="grid grid-cols-2 gap-3">
            <Field label="Page du site">
              <select value={page} onChange={(e) => { setPage(e.target.value); setSection(""); }} className={inputCls}>
                <option value="">— À ranger —</option>
                {MEDIA_PAGES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </Field>
            <Field label="Section">
              <select value={section} onChange={(e) => setSection(e.target.value)} disabled={!page} className={inputCls}>
                <option value="">{page ? "— Aucune —" : "—"}</option>
                {sectionsFor(page).map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <Field label="Ordre d'affichage">
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputCls} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-white/80 pb-2 cursor-pointer">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4 accent-amber-500" />
              Visible sur le site
            </label>
          </div>
        </div>

        {/* Pied modal */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/10 sticky bottom-0 bg-neutral-900">
          <button
            onClick={softDelete}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" /> Retirer
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Fermer</button>
            <button onClick={save} disabled={saving}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm disabled:opacity-50 flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Enregistrer
            </button>
          </div>
        </div>
      </div>
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
