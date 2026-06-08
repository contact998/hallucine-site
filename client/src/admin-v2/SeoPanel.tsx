/**
 * SeoPanel — module 3 du back-office Refine (option « overrides runtime »).
 * CRUD sur seo_overrides (convention seoResource). Le serveur applique l'override
 * à la volée sur le HTML prérendu → publication instantanée, sans rebuild.
 */
import { useState, useMemo } from "react";
import { useList, useCreate, useUpdate, useDelete, useInvalidate } from "@refinedev/core";
import { Loader2, Pencil, Trash2, X, Plus, ImageOff } from "lucide-react";
import type { SeoOverride } from "../../../drizzle/schema";
import { ROUTES, type RouteKey } from "../i18n/routes";

const PER_PAGE = 50;

// Pages publiques : libellé lisible → chemin FR réel (résolu via le registre de routes).
const PAGE_LABELS: Record<RouteKey, string> = {
  home: "Accueil", ecrans: "Écrans (hub)", "ecran-geant": "Écran Géant",
  "ecran-etanche": "Écran Étanche", "ecran-economique": "Écran Économique",
  comparaison: "Comparaison", configurateur: "Configurateur", "drive-in": "Drive-in",
  packs: "Packs", "cinema-plein-air": "Cinéma plein air", location: "Location", "etudes-cas": "Études de cas",
  "cas-velodrome": "Cas — Vélodrome", "cas-oran": "Cas — Oran", "ecrans-led": "Écrans LED",
  tentes: "Tentes (hub)", "tente-x": "Tente X", "tente-n": "Tente N", "tente-v": "Tente V",
  "tente-araignee": "Tente Araignée", arches: "Arches", mobilier: "Mobilier",
  accessoires: "Accessoires", galerie: "Galerie", "galerie-video": "Galerie vidéo",
  contact: "Contact", "a-propos": "À propos", histoire: "Histoire", blog: "Blog",
  "mode-emploi": "Mode d'emploi", "devenir-distributeur": "Devenir distributeur",
  "trouver-distributeur": "Trouver un distributeur", "mentions-legales": "Mentions légales",
  confidentialite: "Confidentialité", cookies: "Cookies",
};
const SEO_PAGES = (Object.keys(PAGE_LABELS) as RouteKey[])
  .map((k) => ({ path: ROUTES.fr[k], label: PAGE_LABELS[k] }))
  .filter((p) => p.path);

export function SeoPanel() {
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(1);
  const [editing, setEditing] = useState<SeoOverride | null>(null);
  const [creating, setCreating] = useState(false);

  const invalidate = useInvalidate();
  const refresh = () => invalidate({ resource: "seoResource", invalidates: ["list"] });

  const filters = useMemo(() => {
    const f: { field: string; operator: any; value: unknown }[] = [];
    if (search.trim()) f.push({ field: "q", operator: "contains", value: search.trim() });
    return f;
  }, [search]);

  const { data, isLoading, isError, error } = useList<SeoOverride>({
    resource: "seoResource",
    pagination: { current, pageSize: PER_PAGE },
    filters,
    sorters: [{ field: "path", order: "asc" }],
  });

  const items = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">SEO <span className="text-amber-400 text-sm font-normal">overrides</span></h1>
        <span className="text-xs text-white/40">{total} override{total > 1 ? "s" : ""}</span>
      </div>
      <p className="text-sm text-white/50 mb-6">
        Surcharge le <code className="text-white/70">title</code>, la meta description, l'image OG ou le noindex d'une page,
        par chemin d'URL. Appliqué <strong>à la volée par le serveur</strong> (publication immédiate, sans redéploiement).
        Sans override, la page garde ses metas d'origine (i18n/DeepL).
      </p>

      <div className="flex flex-wrap items-end gap-3 mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
        <label className="flex flex-col gap-1 text-xs text-white/60 flex-1 min-w-[200px]">
          Recherche
          <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrent(1); }}
            placeholder="chemin ou titre…"
            className="bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white" />
        </label>
        <button onClick={() => setCreating(true)}
          className="flex items-center gap-2 text-sm bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg px-4 py-2">
          <Plus className="w-4 h-4" /> Nouvel override
        </button>
      </div>

      {isError && (
        <div className="bg-red-500/15 border border-red-500/30 text-red-200 rounded-xl p-4 text-sm">
          Erreur : {(error as any)?.message ?? "inconnue"}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-white/50"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/40 gap-2"><ImageOff className="w-8 h-8" /> Aucun override. Le SEO des pages reste celui d'origine.</div>
      ) : (
        <div className="space-y-2">
          {items.map((s) => (
            <div key={s.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/[0.07] transition-colors">
              <code className="text-amber-300 text-sm shrink-0">{s.path}</code>
              <div className="min-w-0 flex-1">
                <div className="text-sm truncate">{s.title || <span className="text-white/30">— titre inchangé —</span>}</div>
                <div className="text-xs text-white/40 truncate">{s.description || ""}</div>
              </div>
              {s.noindex && <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 shrink-0">noindex</span>}
              {!s.active && <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-white/50 shrink-0">inactif</span>}
              <button onClick={() => setEditing(s)}
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
        <SeoEditModal item={editing} onClose={() => { setEditing(null); setCreating(false); }} onChanged={refresh} />
      )}
    </>
  );
}

function SeoEditModal({ item, onClose, onChanged }: { item: SeoOverride | null; onClose: () => void; onChanged: () => void }) {
  const isNew = !item;
  const [path, setPath] = useState(item?.path ?? "/");
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [ogImage, setOgImage] = useState(item?.ogImage ?? "");
  const [noindex, setNoindex] = useState(item?.noindex ?? false);
  const [active, setActive] = useState(item?.active ?? true);

  const { mutate: create, isPending: creating } = useCreate();
  const { mutate: update, isPending: saving } = useUpdate();
  const { mutate: remove } = useDelete();

  function save() {
    const values = { path, title: title || null, description: description || null, ogImage: ogImage || null, noindex, active };
    if (isNew) {
      if (!path.trim() || path.trim() === "/" && !title && !description && !ogImage && !noindex) {
        // autorisé : un override sur "/" est valable
      }
      if (!path.trim()) { return; }
      create({ resource: "seoResource", values, successNotification: () => ({ type: "success", message: "Override créé" }) },
        { onSuccess: () => { onChanged(); onClose(); } });
    } else {
      update({ resource: "seoResource", id: item!.id, values, successNotification: () => ({ type: "success", message: "Enregistré" }) },
        { onSuccess: () => { onChanged(); onClose(); } });
    }
  }
  function del() {
    if (!item) return;
    if (!confirm("Supprimer cet override ? La page reprendra ses metas d'origine.")) return;
    remove({ resource: "seoResource", id: item.id, successNotification: () => ({ type: "success", message: "Override supprimé" }) },
      { onSuccess: () => { onChanged(); onClose(); } });
  }

  const busy = creating || saving;
  const titleLen = title.length, descLen = description.length;

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 bg-neutral-900">
          <h2 className="font-semibold">{isNew ? "Nouvel override SEO" : "Modifier l'override"}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <Field label="Page">
            <select
              value={SEO_PAGES.some((p) => p.path === path) ? path : ""}
              onChange={(e) => { if (e.target.value) setPath(e.target.value); }}
              className={inputCls}
            >
              <option value="">— Choisir une page (ou chemin libre ci-dessous) —</option>
              {SEO_PAGES.map((p) => <option key={p.path} value={p.path}>{p.label} — {p.path}</option>)}
            </select>
          </Field>
          <Field label="Chemin d'URL (rempli automatiquement, modifiable — « / » = accueil)">
            <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/mon-chemin" className={inputCls} />
          </Field>
          <Field label={`Title (${titleLen} car. — ~60 max conseillé · vide = inchangé)`}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </Field>
          <Field label={`Meta description (${descLen} car. — ~160 max · vide = inchangé)`}>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
          </Field>
          <Field label="Image Open Graph (URL · vide = inchangé)">
            <input value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://…" className={inputCls} />
          </Field>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
              <input type="checkbox" checked={noindex} onChange={(e) => setNoindex(e.target.checked)} className="w-4 h-4 accent-red-500" />
              noindex (désindexer de Google)
            </label>
            <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4 accent-amber-500" />
              Actif
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/10 sticky bottom-0 bg-neutral-900">
          {!isNew ? (
            <button onClick={del} className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /> Supprimer</button>
          ) : <span />}
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Fermer</button>
            <button onClick={save} disabled={busy} className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm disabled:opacity-50 flex items-center gap-2">
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
