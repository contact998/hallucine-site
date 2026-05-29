/**
 * client/src/pages/AdminBlog.tsx
 * Interface admin : liste articles, créer/éditer, publier, supprimer.
 * Sélecteur d'image depuis la médiathèque (catégorie blog).
 */
import { useState, useCallback } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useNoIndex } from "@/hooks/useNoIndex";
import { toast } from "sonner";
import {
  Loader2, AlertTriangle, Plus, Edit2, Trash2,
  Globe, FileText, Eye, X, Check, Image, ChevronLeft,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "draft" | "published" | "scheduled";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  lang: string;
  status: Status;
  author: string | null;
  category: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  content: string;
  publishedAt: Date | string | null;
  createdAt: Date | string | null;
}

interface FormState {
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  lang: string;
  status: Status;
  author: string;
  category: string;
  metaDescription: string;
  metaKeywords: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  content: "",
  excerpt: "",
  imageUrl: "",
  lang: "fr",
  status: "draft",
  author: "Hallucine",
  category: "",
  metaDescription: "",
  metaKeywords: "",
};

const STATUS_LABELS: Record<Status, { label: string; color: string }> = {
  draft:     { label: "Brouillon",  color: "bg-gray-500/20 text-gray-400" },
  published: { label: "Publié",     color: "bg-green-500/20 text-green-400" },
  scheduled: { label: "Planifié",   color: "bg-blue-500/20 text-blue-400" },
};

// ─── Composant principal ──────────────────────────────────────────────────────

export default function AdminBlog() {
  useDocumentMeta("Admin Blog", "Gestion des articles de blog Hallucine.");
  useNoIndex();

  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [view, setView]           = useState<"list" | "form">("list");
  const [editingPost, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm]           = useState<FormState>(EMPTY_FORM);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [confirmDelete, setConfirmDelete]     = useState<number | null>(null);

  // ─── tRPC ────────────────────────────────────────────────────────────────

  const utils = trpc.useUtils();

  const { data: posts, isLoading: loadingPosts } =
    trpc.blog.adminList.useQuery(undefined, { enabled: view === "list" });

  const { data: mediaData, isLoading: loadingMedia } =
    trpc.media.list.useQuery(
      { activeOnly: true, limit: 300, offset: 0 },
      { enabled: showMediaPicker }
    );

  const createMutation  = trpc.blog.create.useMutation();
  const updateMutation  = trpc.blog.update.useMutation();
  const publishMutation = trpc.blog.publish.useMutation();
  const deleteMutation  = trpc.blog.delete.useMutation();

  // ─── Handlers ────────────────────────────────────────────────────────────

  const openCreate = useCallback(() => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setView("form");
  }, []);

  const openEdit = useCallback((post: BlogPost) => {
    setEditing(post);
    setForm({
      title:           post.title,
      content:         post.content,
      excerpt:         post.excerpt ?? "",
      imageUrl:        post.imageUrl ?? "",
      lang:            post.lang,
      status:          post.status,
      author:          post.author ?? "Hallucine",
      category:        post.category ?? "",
      metaDescription: post.metaDescription ?? "",
      metaKeywords:    post.metaKeywords ?? "",
    });
    setView("form");
  }, []);

  const handleField = useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!form.title.trim()) { toast.error("Le titre est requis"); return; }
    if (!form.content.trim()) { toast.error("Le contenu est requis"); return; }

    try {
      if (editingPost) {
        await updateMutation.mutateAsync({
          id:              editingPost.id,
          title:           form.title || undefined,
          content:         form.content || undefined,
          excerpt:         form.excerpt || undefined,
          imageUrl:        form.imageUrl || "",
          status:          form.status,
          author:          form.author || undefined,
          category:        form.category || undefined,
          metaDescription: form.metaDescription || undefined,
          metaKeywords:    form.metaKeywords || undefined,
        });
        toast.success("Article mis à jour");
      } else {
        await createMutation.mutateAsync({
          title:           form.title,
          content:         form.content,
          excerpt:         form.excerpt || undefined,
          imageUrl:        form.imageUrl || undefined,
          lang:            form.lang,
          status:          form.status,
          author:          form.author || undefined,
          category:        form.category || undefined,
          metaDescription: form.metaDescription || undefined,
          metaKeywords:    form.metaKeywords || undefined,
        });
        toast.success("Article créé");
      }
      await utils.blog.adminList.invalidate();
      setView("list");
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur lors de la sauvegarde");
    }
  }, [form, editingPost, createMutation, updateMutation, utils]);

  const handlePublish = useCallback(async (id: number) => {
    try {
      await publishMutation.mutateAsync({ id });
      toast.success("Article publié");
      await utils.blog.adminList.invalidate();
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur lors de la publication");
    }
  }, [publishMutation, utils]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Article supprimé");
      setConfirmDelete(null);
      await utils.blog.adminList.invalidate();
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur lors de la suppression");
    }
  }, [deleteMutation, utils]);

  const pickImage = useCallback((url: string) => {
    setForm((prev) => ({ ...prev, imageUrl: url }));
    setShowMediaPicker(false);
    toast.success("Image sélectionnée");
  }, []);

  // ─── Auth guard ──────────────────────────────────────────────────────────

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

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container pt-28 pb-8 max-w-6xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            {view === "form" && (
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-1 text-sm text-white/50 hover:text-white mb-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Retour à la liste
              </button>
            )}
            <h1 className="text-3xl font-bold text-white">
              {view === "list" ? "Articles Blog" : editingPost ? "Modifier l'article" : "Nouvel article"}
            </h1>
            <p className="text-white/50 mt-1 text-sm">
              {view === "list"
                ? "Créez, éditez et publiez les articles du blog."
                : "Remplissez les champs puis sauvegardez."}
            </p>
          </div>
          {view === "list" && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Nouvel article
            </button>
          )}
        </div>

        {/* ══ VUE LISTE ══════════════════════════════════════════════════════ */}
        {view === "list" && (
          <>
            {loadingPosts ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              </div>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-20 text-white/40">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>Aucun article. Créez le premier !</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="text-left px-4 py-3">Titre</th>
                      <th className="text-left px-4 py-3">Langue</th>
                      <th className="text-left px-4 py-3">Statut</th>
                      <th className="text-left px-4 py-3">Date</th>
                      <th className="text-left px-4 py-3">Image</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(posts as BlogPost[]).map((post) => {
                      const st = STATUS_LABELS[post.status] ?? STATUS_LABELS.draft;
                      return (
                        <tr key={post.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="px-4 py-3 max-w-xs">
                            <div className="font-medium text-white truncate">{post.title}</div>
                            <div className="text-white/30 text-xs truncate">/blog/{post.slug}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-1 text-white/60">
                              <Globe className="w-3 h-3" />
                              {post.lang.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${st.color}`}>
                              {st.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString("fr-FR")
                              : post.createdAt
                              ? new Date(post.createdAt).toLocaleDateString("fr-FR")
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {post.imageUrl ? (
                              <img
                                loading="lazy"
                                src={post.imageUrl}
                                alt=""
                                className="w-10 h-10 rounded object-cover border border-white/10"
                              />
                            ) : (
                              <span className="text-white/20 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {post.status !== "published" && (
                                <button
                                  onClick={() => handlePublish(post.id)}
                                  disabled={publishMutation.isPending}
                                  title="Publier"
                                  className="p-1.5 rounded hover:bg-green-500/20 text-green-400 transition-colors disabled:opacity-50"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => openEdit(post)}
                                title="Éditer"
                                className="p-1.5 rounded hover:bg-amber-500/20 text-amber-400 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {confirmDelete === post.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDelete(post.id)}
                                    className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="p-1.5 rounded hover:bg-white/10 text-white/40 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDelete(post.id)}
                                  title="Supprimer"
                                  className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ══ VUE FORMULAIRE ════════════════════════════════════════════════ */}
        {view === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-5">

              {/* Titre */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                  Titre <span className="text-red-400">*</span>
                  <span className={`ml-2 font-mono ${form.title.length > 48 ? "text-red-400" : "text-white/30"}`}>
                    {form.title.length}/48
                  </span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleField("title")}
                  maxLength={60}
                  placeholder="Titre de l'article (max 48 car.)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 text-sm"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                  Excerpt / Meta description
                  <span className={`ml-2 font-mono ${form.excerpt.length > 160 ? "text-red-400" : "text-white/30"}`}>
                    {form.excerpt.length}/160
                  </span>
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={handleField("excerpt")}
                  maxLength={160}
                  rows={3}
                  placeholder="Résumé de l'article (50-160 car., obligatoire pour publier)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 text-sm resize-none"
                />
              </div>

              {/* Contenu HTML */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                  Contenu HTML <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={handleField("content")}
                  rows={16}
                  placeholder="<h2>Introduction</h2><p>Contenu de l'article en HTML...</p>"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 text-sm resize-y font-mono text-xs leading-relaxed"
                />
              </div>

            </div>

            {/* Colonne latérale */}
            <div className="space-y-5">

              {/* Statut + Langue */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">Statut</label>
                  <select
                    value={form.status}
                    onChange={handleField("status")}
                    className="w-full bg-card border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50 text-sm"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="scheduled">Planifié</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">Langue</label>
                  <select
                    value={form.lang}
                    onChange={handleField("lang")}
                    disabled={!!editingPost}
                    className="w-full bg-card border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50 text-sm disabled:opacity-40"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="es">Español</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">Auteur</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={handleField("author")}
                    placeholder="Hallucine"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">Catégorie</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={handleField("category")}
                    placeholder="ex : écrans gonflables"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 text-sm"
                  />
                </div>
              </div>

              {/* Image */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                <label className="block text-xs font-medium text-white/60 mb-3 uppercase tracking-wider">
                  Image d'en-tête
                </label>

                {form.imageUrl ? (
                  <div className="relative mb-3 rounded-lg overflow-hidden">
                    <img
                      loading="lazy"
                      src={form.imageUrl}
                      alt="Aperçu"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => setForm((p) => ({ ...p, imageUrl: "" }))}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 rounded-full p-1 text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-32 bg-white/5 rounded-lg flex items-center justify-center mb-3 border border-dashed border-white/10">
                    <Image className="w-8 h-8 text-white/20" />
                  </div>
                )}

                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={handleField("imageUrl")}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 text-xs mb-2"
                />

                <button
                  onClick={() => setShowMediaPicker(true)}
                  className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white/70 hover:text-white text-xs transition-colors"
                >
                  <Image className="w-3.5 h-3.5" />
                  Choisir depuis la médiathèque
                </button>
              </div>

              {/* SEO */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3">
                <p className="text-xs font-medium text-white/60 uppercase tracking-wider">SEO</p>
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Meta description
                    <span className={`ml-1 font-mono ${form.metaDescription.length > 160 ? "text-red-400" : "text-white/30"}`}>
                      {form.metaDescription.length}/160
                    </span>
                  </label>
                  <textarea
                    value={form.metaDescription}
                    onChange={handleField("metaDescription")}
                    rows={2}
                    maxLength={160}
                    placeholder="Si différente de l'excerpt"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 text-xs resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Mots-clés</label>
                  <input
                    type="text"
                    value={form.metaKeywords}
                    onChange={handleField("metaKeywords")}
                    placeholder="écran gonflable, cinéma plein air..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 text-xs"
                  />
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setView("list")}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editingPost ? "Mettre à jour" : "Créer"}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ══ MODALE MÉDIATHÈQUE ═══════════════════════════════════════════════ */}
      {showMediaPicker && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowMediaPicker(false); }}
        >
          <div className="bg-card border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h2 className="text-white font-semibold">Médiathèque — Blog</h2>
                <p className="text-white/40 text-xs mt-0.5">Cliquez sur une image pour la sélectionner</p>
              </div>
              <button
                onClick={() => setShowMediaPicker(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingMedia ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </div>
              ) : !mediaData?.items || mediaData.items.length === 0 ? (
                <div className="text-center py-16 text-white/30">
                  <Image className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Aucune image dans la catégorie Blog.</p>
                  <p className="text-xs mt-1">
                    Uploadez des images dans{" "}
                    <Link href="/admin/media" className="text-amber-400 hover:underline">
                      la médiathèque
                    </Link>{" "}
                    avec la catégorie « Blog ».
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {mediaData.items.map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => pickImage(item.url)}
                      className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-amber-500 transition-all focus:outline-none focus:border-amber-500"
                    >
                      <img
                        src={item.url}
                        alt={item.altText ?? item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <Check className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
