import { useState } from "react";
import { Link } from "wouter";

interface Article {
  id: string;
  titre: string;
  extrait: string;
  categorie: string;
  date: string;
  slug: string;
}

export default function Blog() {
  const [categorieActive, setCategorieActive] = useState("Toutes");

  const articles: Article[] = [
    {
      id: "1",
      titre: "Des projections grandioses avec nos écrans géants à soufflerie permanente !",
      extrait: "Découvrez comment nos écrans géants à soufflerie permanente transforment vos événements en plein air en expériences cinématographiques inoubliables. De la technologie de pointe à l'installation simplifiée, explorez les avantages de nos solutions d'écrans gonflables pour des projections spectaculaires.",
      categorie: "Écrans Gonflables",
      date: "2024-12-15",
      slug: "projections-grandioses-ecrans-geants-soufflerie-permanente"
    },
    {
      id: "2",
      titre: "Écrans géants gonflables installés en un temps record : La solution idéale pour vos événements en plein air",
      extrait: "L'installation d'un écran géant gonflable n'a jamais été aussi rapide. Grâce à notre technologie de soufflerie intégrée, votre écran est opérationnel en quelques minutes. Découvrez pourquoi de plus en plus d'organisateurs d'événements choisissent nos solutions gonflables pour leurs projections extérieures.",
      categorie: "Guides de Produits",
      date: "2024-11-20",
      slug: "ecrans-geants-gonflables-installes-temps-record-solution-ideale-evenements-plein-air"
    },
    {
      id: "3",
      titre: "Écrans Gonflables pour Festivals : Pourquoi Sont-Ils Indispensables ? Un Guide Complet pour les Organisateurs d'Événements",
      extrait: "Les festivals en plein air nécessitent des solutions visuelles à la hauteur de l'événement. Les écrans gonflables offrent une visibilité exceptionnelle, une installation rapide et une portabilité inégalée. Ce guide complet vous explique pourquoi ils sont devenus indispensables pour les organisateurs de festivals.",
      categorie: "Festivals et Événements",
      date: "2024-10-08",
      slug: "ecrans-gonflables-festivals-guide-complet-organisateurs-evenements"
    },
    {
      id: "4",
      titre: "Guide Ultime : Organiser un Cinéma en Plein Air Inoubliable - Équipement, Astuces & Études de Cas",
      extrait: "Organiser un cinéma en plein air est une aventure passionnante qui demande une préparation minutieuse. De la sélection de l'écran gonflable idéal au choix du projecteur, en passant par la gestion du son et de l'éclairage, ce guide ultime vous accompagne à chaque étape pour créer une soirée cinéma mémorable.",
      categorie: "Cinéma en Plein Air",
      date: "2024-09-12",
      slug: "guide-ultime-organiser-cinema-plein-air-equipement-astuces-etudes-cas"
    },
    {
      id: "5",
      titre: "Guide Complet pour Choisir et Installer un Écran Gonflable pour un Cinéma en Plein Air : L'Expérience Ultime Sous les Étoiles",
      extrait: "Choisir le bon écran gonflable pour votre cinéma en plein air est essentiel pour garantir une expérience visuelle de qualité. Ce guide complet vous aide à comparer les différentes options disponibles, à comprendre les spécifications techniques et à réaliser une installation parfaite pour vos projections sous les étoiles.",
      categorie: "Cinéma en Plein Air",
      date: "2024-08-25",
      slug: "guide-complet-installer-ecran-gonflable-cinema-plein-air"
    }
  ];

  const categories = ["Toutes", ...Array.from(new Set(articles.map(a => a.categorie)))];

  const articlesFiltres = categorieActive === "Toutes"
    ? articles
    : articles.filter(a => a.categorie === categorieActive);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative bg-[#1a1a2e] text-white py-20 md:py-28">
        <div className="container max-w-5xl text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Blog Hallucine
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            Actualités, guides pratiques et conseils d'experts pour vos événements en plein air 
            avec des écrans gonflables, tentes et mobilier.
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
                {articlesFiltres.map((article) => (
                  <article key={article.id} className="bg-card rounded-lg border border-border p-6 md:p-8 hover:shadow-md transition-shadow">
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
                    <a
                      href={`https://www.hallucinecran.com/fr/blogs/post/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#DAA520] font-medium hover:underline"
                    >
                      Lire l'article complet
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0">
              {/* Catégories */}
              <div className="bg-card rounded-lg border border-border p-6 mb-6">
                <h3 className="font-display text-lg font-bold mb-4">Catégories</h3>
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
                <h3 className="font-display text-lg font-bold mb-4">Tags</h3>
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
                  Besoin d'un devis ?
                </h3>
                <p className="text-sm opacity-80 mb-4">
                  Contactez notre équipe pour un devis personnalisé adapté à votre événement.
                </p>
                <Link href="/contactez-nous" className="inline-block w-full text-center bg-[#DAA520] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#B8860B] transition-colors">
                  Demander un devis
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
