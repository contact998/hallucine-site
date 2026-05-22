import { useState } from "react";
import { Link } from "wouter";
import { MessageSquare, ThumbsUp, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { detectLanguage } from "@/i18n/domains";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";

interface Commentaire {
  auteur: string;
  avatar: string;
  date: string;
  texte: string;
  likes: number;
}

interface Article {
  id: string;
  titre: string;
  extrait: string;
  categorie: string;
  date: string;
  slug: string;
  imageUrl?: string;
  commentaires: Commentaire[];
}

export default function Blog() {
  const route = useRoutes();
  const { t } = useTranslation("blog");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/vajzfoYsbBMsDfIq.webp");

  const [categorieActive, setCategorieActive] = useState("Toutes");
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  // Charger les articles depuis la DB
  const lang = detectLanguage();
  const { data: dbData } = trpc.blog.list.useQuery({ lang, limit: 50 });
  const dbArticles = dbData?.posts ?? [];

  const toggleComments = (id: string) => {
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (dateStr: string | Date | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  // Articles DB uniquement — les articles statiques de fallback ont été supprimés
  // car leurs slugs pointaient vers des pages inexistantes (404 Semrush)
  const staticArticles: Article[] = [];

  // Combiner articles DB + statiques
  const allArticles = [
    ...dbArticles.map(p => ({
      id: String(p.id),
      titre: p.title,
      extrait: p.excerpt ?? "",
      categorie: p.category ?? "Blog",
      date: p.publishedAt ? new Date(p.publishedAt).toISOString().split("T")[0] : "",
      slug: p.slug,
      imageUrl: p.imageUrl ?? "",
      commentaires: [],
      fromDb: true,
    })),
    ...staticArticles.map(a => ({ ...a, fromDb: false })),
  ];

  const categories = ["Toutes", ...Array.from(new Set(allArticles.map(a => a.categorie)))];

  const articlesFiltres = categorieActive === "Toutes"
    ? allArticles
    : allArticles.filter(a => a.categorie === categorieActive);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        breadcrumbs={[{ name: "Accueil", routeKey: "home" }, { name: "Blog", routeKey: "blog" }]}
        page={{
          name: "Blog | Actualités Cinéma en Plein Air",
          description: "Actualités, conseils et tendances du cinéma en plein air. Articles sur les écrans gonflables, événements et innovations.",
        }}
        article={{
          headline: "Blog Hallucine",
          description: "Actualités, conseils et tendances du cinéma en plein air. Articles sur les écrans gonflables, événements et innovations.",
          image: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/vajzfoYsbBMsDfIq.webp"
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#1a1a2e] text-white py-20 md:py-28">
        <div className="container max-w-5xl text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t("hero_title")}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            {t("hero_desc")}
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Articles */}
            <div className="flex-1">
              <div className="space-y-8">
                {dbData === undefined ? (
                  // Skeletons pendant le chargement tRPC — réserve la hauteur
                  // pour éviter le layout shift (CLS) qui poussait l'aside.
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={`skeleton-${i}`} className="bg-card rounded-lg border border-border overflow-hidden">
                      <div className="aspect-[16/9] w-full bg-muted animate-pulse" />
                      <div className="p-6 md:p-8 space-y-4">
                        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                        <div className="h-7 w-3/4 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))
                ) : articlesFiltres.map((article) => (
                  <article key={article.id} className="bg-card rounded-lg border border-border overflow-hidden">
                    {article.imageUrl ? (
                      <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                        <img
                          src={article.imageUrl}
                          alt={article.titre}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          width={800} height={450}
                          decoding="async"
                        />
                      </div>
                    ) : null}
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-block text-xs font-medium bg-[#DAA520]/10 text-[#DAA520] px-3 py-1 rounded-full">
                          {article.categorie}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(article.date)}
                        </span>
                      </div>
                      <h2 className="font-display text-xl md:text-2xl font-bold mb-3 leading-tight">
                        {article.titre}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {article.extrait}
                      </p>
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/blog/${article.slug}`}
                          className="inline-flex items-center gap-2 text-[#DAA520] font-medium hover:underline"
                        >
                          {t("read_more")}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                        <button
                          onClick={() => toggleComments(article.id)}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {article.commentaires.length} commentaire{article.commentaires.length > 1 ? "s" : ""}
                        </button>
                      </div>
                    </div>

                    {/* Section commentaires */}
                    {expandedComments[article.id] && (
                      <div className="border-t border-border bg-muted/30">
                        <div className="p-6 md:p-8">
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
                            {article.commentaires.length} commentaire{article.commentaires.length > 1 ? "s" : ""}
                          </h3>
                          <div className="space-y-6">
                            {article.commentaires.map((commentaire, idx) => (
                              <div key={idx} className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                  commentaire.auteur === "Hallucine" 
                                    ? "bg-[#DAA520] text-white" 
                                    : "bg-white/10 text-white/70"
                                }`}>
                                  {commentaire.auteur === "Hallucine" ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  ) : (
                                    commentaire.avatar
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-sm font-semibold ${
                                      commentaire.auteur === "Hallucine" ? "text-[#DAA520]" : ""
                                    }`}>
                                      {commentaire.auteur}
                                    </span>
                                    {commentaire.auteur === "Hallucine" && (
                                      <span className="text-[10px] bg-[#DAA520]/20 text-[#DAA520] px-1.5 py-0.5 rounded font-medium">
                                        {t("team_label")}
                                      </span>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(commentaire.date)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {commentaire.texte}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#DAA520] transition-colors">
                                      <ThumbsUp className="w-3.5 h-3.5" />
                                      {commentaire.likes}
                                    </button>
                                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                      Répondre
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Formulaire de commentaire */}
                          <div className="mt-8 pt-6 border-t border-border">
                            <h4 className="text-sm font-semibold mb-4">{t("leave_comment")}</h4>
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-white/40" />
                              </div>
                              <div className="flex-1 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <input
                                    type="text"
                                    placeholder={t("your_name")}
                                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:border-[#DAA520] focus:outline-none transition-colors"
                                  />
                                  <input
                                    type="email"
                                    placeholder={t("your_email")}
                                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:border-[#DAA520] focus:outline-none transition-colors"
                                  />
                                </div>
                                <textarea
                                  rows={3}
                                  placeholder={t("your_comment")}
                                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:border-[#DAA520] focus:outline-none transition-colors resize-none"
                                />
                                <button className="px-5 py-2 bg-[#DAA520] text-white text-sm font-semibold rounded-lg hover:bg-[#B8860B] transition-colors">
                                  {t("publish")}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0">
              {/* Catégories */}
              <div className="bg-card rounded-lg border border-border p-6 mb-6">
                <h3 className="font-display text-lg font-bold mb-4">{t("categories_title")}</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategorieActive(cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        categorieActive === cat
                          ? "bg-[#DAA520] text-white font-medium"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-card rounded-lg border border-border p-6 mb-6">
                <h3 className="font-display text-lg font-bold mb-4">{t("tags_title")}</h3>
                <div className="flex flex-wrap gap-2">
                  {["Écrans Gonflables", "Cinéma en Plein Air", "Planification d'Événements", "Événements d'Entreprise", "Solutions pour Festivals", "Guides de Produits", "Tentes Gonflables", "Mobilier pour Événements"].map((tag) => (
                    <span key={tag} className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#1a1a2e] text-white rounded-lg p-6">
                <h3 className="font-display text-lg font-bold mb-3">
                  {t("cta_title")}
                </h3>
                <p className="text-sm opacity-80 mb-4">
                  {t("cta_desc")}
                </p>
                <Link href={route('contact')} className="inline-block w-full text-center bg-[#DAA520] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#B8860B] transition-colors">
                  {t("cta_btn")}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
