/**
 * BlogPanel — module 2 du back-office Refine.
 * Articles de blog sur la MÊME convention que la médiathèque (blogResource :
 * list/byId/create/update/deleteOne + dataProvider générique inchangé).
 * Gère les articles sources FR ; les traductions EN/DE/ES/IT restent DeepL.
 * Le PUBLISH passe par l'endpoint existant `blog.publish` (pipeline traduction/cache).
 */
import { useState, useMemo } from "react";
import { useList, useCreate, useUpdate, useDelete, useInvalidate } from "@refinedev/core";
import { Loader2, Pencil, Trash2, X, Plus, ImageOff, Send } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import type { BlogPost } from "../../../drizzle/schema";

const PER_PAGE = 20;

const STATUS_LABEL: Record<string, string> = { draft: "Brouillon", published: "Publié", scheduled: "Programmé" };
const STATUS_CLS: Record<string, string> = {
  draft: "bg-white/10 text-white/60",
  published: "bg-emerald-500/20 text-emerald-300",
  scheduled: "bg-amber-500/20 text-amber-300",
};

export function BlogPanel() {
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(1);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);

  const invalidate = useInvalidate();
  const refresh = () => invalidate({ resource: "blogResource", invalidates: ["list"] });

  const filters = useMemo(() => {
    const f: { field: string; operator: any; value: unknown }[] = [
      { field: "lang", operator: "eq", value: "fr" }, // articles sources FR (traductions = DeepL)
    ];
    if (status) f.push({ field: "status", operator: "eq", value: status });
    if (search.trim()) f.push({ field: "q", operator: "contains", value: search.trim() });
    return f;
  }, [status, search]);

  const { data, isLoading, isError, error } = useList<BlogPost>({
    resource: "blogResource",
    pagination: { current, pageSize: PER_PAGE },
    filters,
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const items = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
  const changeFilter = (fn: () => void) => { fn(); setCurrent(1); };

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Blog</h1>
        <span className="text-xs text-white/40">{total} article{total > 1 ? "s" : ""} FR</span>
      </div>
      <p className="text-sm text-white/50 mb-6">
        Articles sources FR. Les traductions EN/DE/ES/IT sont générées par DeepL. L'ancien éditeur reste sur <code className="text-white/70">/admin/blog</code>.
      </p>

      {/* Filtres */}
      <div className="flex flex-wrap items-end gap-3 mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
        <label className="flex flex-col gap-1 text-xs text-white/60">
          Statut
          <select value={status} onChange={(e) => changeFilter(() => setStatus(e.target.value))}
            className="bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white min-w-[160px]">
            <option value="">Tous</option>
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="scheduled">Programmé</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-white/60 flex-1 min-w-[180px]">
          Recherche
          <input value={search} onChange={(e) => changeFilter(() => setSearch(e.target.value))}
            placeholder="titre, extrait, slug…"
            className="bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white" />
        </label>
        <button onClick={() => setCreating(true)}
          className="flex items-center gap-2 text-sm bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg px-4 py-2">
          <Plus className="w-4 h-4" /> Nouvel article
        </button>
      </div>

      {isError && (
        <div className="bg-red-500/15 border border-red-500/30 text-red-200 rounded-xl p-4 text-sm">
          Erreur de chargement : {(error as any)?.message ?? "inconnue"}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-white/50"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/40 gap-2"><ImageOff className="w-8 h-8" /> Aucun article pour ce filtre.</div>
      ) : (
        <div className="space-y-2">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/[0.07] transition-colors">
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/30 shrink-0">
                {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{p.title}</div>
                <div className="text-xs text-white/40 truncate">/{p.slug}</div>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded shrink-0 ${STATUS_CLS[p.status] ?? ""}`}>{STATUS_LABEL[p.status] ?? p.status}</span>
              <button onClick={() => setEditing(p)}
                className="flex items-center gap-1.5 text-sm bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg px-3 py-1.5 shrink-0">
                <Pencil className="w-3.5 h-3.5" /> Modifier
              </button>
            </div>
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={() => setCurrent((c) => Math.max(1, c - 1))} disabled={current <= 1}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm disabled:opacity-40">Précédent</button>
          <span className="text-sm text-white/60">Page {current} / {pageCount}</span>
          <button onClick={() => setCurrent((c) => Math.min(pageCount, c + 1))} disabled={current >= pageCount}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm disabled:opacity-40">Suivant</button>
        </div>
      )}

      {(editing || creating) && (
        <BlogEditModal
          item={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onChanged={refresh}
        />
      )}
    </>
  );
}

// ─── Modal éditeur ──────────────────────────────────────────────────────────────
function BlogEditModal({ item, onClose, onChanged }: { item: BlogPost | null; onClose: () => void; onChanged: () => void }) {
  const isNew = !item;
  const [title, setTitle]       = useState(item?.title ?? "");
  const [excerpt, setExcerpt]   = useState(item?.excerpt ?? "");
  const [content, setContent]   = useState(item?.content ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [metaDescription, setMetaDescription] = useState(item?.metaDescription ?? "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [showCover, setShowCover] = useState(false);

  const { mutate: create, isPending: creating } = useCreate();
  const { mutate: update, isPending: saving } = useUpdate();
  const { mutate: remove } = useDelete();

  const publish = trpc.blog.publish.useMutation({
    onSuccess: () => { toast.success("Article publié (traduction DeepL lancée)"); onChanged(); onClose(); },
    onError: (e) => toast.error(e.message),
  });

  // Picker de couverture depuis la médiathèque
  const cover = trpc.mediaResource.list.useQuery(
    { pagination: { page: 1, perPage: 60 } },
    { enabled: showCover }
  );

  function save() {
    const values = { title, excerpt: excerpt || null, content, category: category || null, metaDescription: metaDescription || null, imageUrl: imageUrl || null };
    if (isNew) {
      if (!title.trim()) { toast.error("Titre requis"); return; }
      create({ resource: "blogResource", values, successNotification: () => ({ type: "success", message: "Article créé (brouillon)" }) },
        { onSuccess: () => { onChanged(); onClose(); } });
    } else {
      update({ resource: "blogResource", id: item!.id, values, successNotification: () => ({ type: "success", message: "Enregistré" }) },
        { onSuccess: () => { onChanged(); onClose(); } });
    }
  }

  function softDelete() {
    if (!item) return;
    if (!confirm("Retirer cet article ? Il disparaît du site et de l'admin (réversible en base).")) return;
    remove({ resource: "blogResource", id: item.id, successNotification: () => ({ type: "success", message: "Article retiré" }) },
      { onSuccess: () => { onChanged(); onClose(); } });
  }

  const busy = creating || saving;
  const excerptLen = (excerpt ?? "").trim().length;

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 bg-neutral-900 z-10">
          <h2 className="font-semibold">{isNew ? "Nouvel article" : "Modifier l'article"}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <Field label={`Titre (${title.length}/48 conseillé pour le SEO)`}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </Field>

          {/* Couverture */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-28 h-20 rounded-lg overflow-hidden bg-black/30 border border-white/10 shrink-0">
                {imageUrl ? <img src={imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/30"><ImageOff className="w-5 h-5" /></div>}
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => setShowCover((v) => !v)} className="text-sm text-amber-400 hover:text-amber-300 text-left">
                  {showCover ? "Fermer" : "Choisir une couverture…"}
                </button>
                {imageUrl && <button onClick={() => setImageUrl("")} className="text-xs text-white/40 hover:text-white/70 text-left">Retirer la couverture</button>}
              </div>
            </div>
            {showCover && (
              <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto bg-black/30 p-2 rounded-xl mt-2">
                {(cover.data?.data ?? []).map((m: any) => (
                  <button key={m.id} title={m.title ?? m.filename}
                    onClick={() => { setImageUrl(m.url); setShowCover(false); }}
                    className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-amber-400">
                    <img src={m.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
                {cover.isLoading && <p className="col-span-6 text-xs text-white/40 py-4 text-center">Chargement…</p>}
              </div>
            )}
          </div>

          <Field label={`Extrait / meta description (${excerptLen} car. — min 50 pour publier)`}>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={inputCls} />
          </Field>

          <Field label="Contenu (HTML / Markdown)">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} className={`${inputCls} font-mono text-xs leading-relaxed`} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Catégorie"><input value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls} /></Field>
            <Field label="Meta description (SEO, override)"><input value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className={inputCls} /></Field>
          </div>

          {!isNew && (
            <div className="text-xs text-white/40">
              Statut actuel : <span className="text-white/70">{STATUS_LABEL[item!.status] ?? item!.status}</span>
              {item!.slug && <> · slug <code className="text-white/60">/{item!.slug}</code></>}
            </div>
          )}
        </div>

        {/* Pied */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/10 sticky bottom-0 bg-neutral-900">
          {!isNew ? (
            <button onClick={softDelete} className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300">
              <Trash2 className="w-4 h-4" /> Retirer
            </button>
          ) : <span />}
          <div className="flex items-center gap-2">
            {!isNew && (
              <button onClick={() => publish.mutate({ id: item!.id })} disabled={publish.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 text-black font-semibold text-sm disabled:opacity-50">
                {publish.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Publier
              </button>
            )}
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Fermer</button>
            <button onClick={save} disabled={busy}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm disabled:opacity-50 flex items-center gap-2">
              {busy && <Loader2 className="w-4 h-4 animate-spin" />} {isNew ? "Créer" : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1 text-xs text-white/60">{label}{children}</label>;
}
