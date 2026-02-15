import { useState } from "react";
import { Link } from "wouter";
import { MessageSquare, ThumbsUp, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  commentaires: Commentaire[];
}

export default function Blog() {
  const [categorieActive, setCategorieActive] = useState("Toutes");
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const toggleComments = (id: string) => {
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const articles: Article[] = [
    {
      id: "1",
      titre: "Des projections grandioses avec nos écrans géants à soufflerie permanente !",
      extrait: "Découvrez comment nos écrans géants à soufflerie permanente transforment vos événements en plein air en expériences cinématographiques inoubliables. De la technologie de pointe à l'installation simplifiée, explorez les avantages de nos solutions d'écrans gonflables pour des projections spectaculaires.",
      categorie: "Écrans Gonflables",
      date: "2024-12-15",
      slug: "projections-grandioses-ecrans-geants-soufflerie-permanente",
      commentaires: [
        {
          auteur: "Marie Dupont",
          avatar: "MD",
          date: "2025-01-03",
          texte: "Nous avons utilisé l'écran 12m pour notre festival de cinéma en plein air à Bordeaux cet été. La qualité de projection était incroyable, même avec la lumière résiduelle du crépuscule. Le montage a pris moins de 20 minutes avec 2 personnes. Je recommande vivement !",
          likes: 14
        },
        {
          auteur: "Thomas Lefèvre",
          avatar: "TL",
          date: "2025-01-10",
          texte: "Article très complet. J'organise des événements corporate et la soufflerie permanente est un vrai plus — pas de risque de dégonflement pendant la projection. Est-ce que vous proposez aussi la location pour des événements ponctuels ?",
          likes: 8
        },
        {
          auteur: "Sophie Martin",
          avatar: "SM",
          date: "2025-01-18",
          texte: "Merci pour ces explications détaillées. La comparaison entre soufflerie et étanche à l'air m'a aidée à faire mon choix. Pour un usage régulier en camping, l'étanche semble plus adapté.",
          likes: 6
        }
      ]
    },
    {
      id: "2",
      titre: "Écrans géants gonflables installés en un temps record : La solution idéale pour vos événements en plein air",
      extrait: "L'installation d'un écran géant gonflable n'a jamais été aussi rapide. Grâce à notre technologie de soufflerie intégrée, votre écran est opérationnel en quelques minutes. Découvrez pourquoi de plus en plus d'organisateurs d'événements choisissent nos solutions gonflables pour leurs projections extérieures.",
      categorie: "Guides de Produits",
      date: "2024-11-20",
      slug: "ecrans-geants-gonflables-installes-temps-record-solution-ideale-evenements-plein-air",
      commentaires: [
        {
          auteur: "Jean-Pierre Moreau",
          avatar: "JM",
          date: "2024-12-05",
          texte: "En tant que responsable technique d'une mairie, j'ai testé l'installation de l'écran 8m lors de notre fête du village. Chrono en main : 12 minutes du déballage à l'écran gonflé. C'est bluffant de simplicité.",
          likes: 22
        },
        {
          auteur: "Claire Beaumont",
          avatar: "CB",
          date: "2024-12-12",
          texte: "Super article ! Petite question : est-ce que le vent pose problème ? Nous organisons des projections en bord de mer et j'ai peur que l'écran ne tienne pas avec les rafales.",
          likes: 5
        },
        {
          auteur: "Hallucine",
          avatar: "H",
          date: "2024-12-13",
          texte: "Bonjour Claire, nos écrans sont conçus pour résister à des vents modérés (jusqu'à 30 km/h). Pour les zones très ventées, nous recommandons le modèle étanche à l'air avec des haubans renforcés. N'hésitez pas à nous contacter pour un conseil personnalisé !",
          likes: 11
        }
      ]
    },
    {
      id: "3",
      titre: "Écrans Gonflables pour Festivals : Pourquoi Sont-Ils Indispensables ? Un Guide Complet pour les Organisateurs d'Événements",
      extrait: "Les festivals en plein air nécessitent des solutions visuelles à la hauteur de l'événement. Les écrans gonflables offrent une visibilité exceptionnelle, une installation rapide et une portabilité inégalée. Ce guide complet vous explique pourquoi ils sont devenus indispensables pour les organisateurs de festivals.",
      categorie: "Festivals et Événements",
      date: "2024-10-08",
      slug: "ecrans-gonflables-festivals-guide-complet-organisateurs-evenements",
      commentaires: [
        {
          auteur: "Lucas Fernandez",
          avatar: "LF",
          date: "2024-10-22",
          texte: "Nous utilisons les écrans Hallucine depuis 3 ans pour notre festival de musique dans le sud de la France. L'écran 16m est parfait pour retransmettre les concerts en direct. Le public adore, et le montage/démontage est rapide entre les sets.",
          likes: 31
        },
        {
          auteur: "Nathalie Girard",
          avatar: "NG",
          date: "2024-11-01",
          texte: "Guide très utile pour les organisateurs. J'ajouterais qu'il faut aussi penser à l'alimentation électrique — un groupe électrogène silencieux est indispensable pour ne pas gêner la projection. Quel est le besoin en watts pour un écran 10m ?",
          likes: 9
        },
        {
          auteur: "Marc Dubois",
          avatar: "MDu",
          date: "2024-11-15",
          texte: "Excellent retour d'expérience. Nous avons comparé plusieurs fournisseurs et Hallucine offre le meilleur rapport qualité/poids. Le fait que l'écran 10m ne pèse que 25 kg est un argument décisif pour nos équipes itinérantes.",
          likes: 17
        },
        {
          auteur: "Émilie Rousseau",
          avatar: "ER",
          date: "2024-11-28",
          texte: "Merci pour ce guide complet ! Nous organisons un festival de cinéma documentaire en plein air et nous hésitons entre le 12m et le 16m. Pour un public de 500 personnes, quelle taille recommandez-vous ?",
          likes: 4
        }
      ]
    },
    {
      id: "4",
      titre: "Guide Ultime : Organiser un Cinéma en Plein Air Inoubliable - Équipement, Astuces & Études de Cas",
      extrait: "Organiser un cinéma en plein air est une aventure passionnante qui demande une préparation minutieuse. De la sélection de l'écran gonflable idéal au choix du projecteur, en passant par la gestion du son et de l'éclairage, ce guide ultime vous accompagne à chaque étape pour créer une soirée cinéma mémorable.",
      categorie: "Cinéma en Plein Air",
      date: "2024-09-12",
      slug: "guide-ultime-organiser-cinema-plein-air-equipement-astuces-etudes-cas",
      commentaires: [
        {
          auteur: "Antoine Perrin",
          avatar: "AP",
          date: "2024-09-28",
          texte: "Ce guide m'a été très utile pour organiser notre première soirée cinéma en plein air dans notre copropriété. On a loué un écran 6m et un vidéoprojecteur 5000 lumens. Résultat : 80 voisins ravis et une demande unanime pour recommencer l'été prochain !",
          likes: 26
        },
        {
          auteur: "Isabelle Chevalier",
          avatar: "IC",
          date: "2024-10-05",
          texte: "Très bon article. Un conseil que j'ajouterais : prévoyez toujours un plan B en cas de pluie. Nous avons combiné l'écran gonflable avec une tente Hallucine et c'était parfait — projection maintenue malgré l'averse !",
          likes: 19
        },
        {
          auteur: "David Laurent",
          avatar: "DL",
          date: "2024-10-20",
          texte: "Pour le son, nous avons testé les casques sans fil mentionnés dans la section accessoires. C'est génial pour les projections en zone résidentielle — aucune nuisance sonore pour les voisins et une immersion totale pour les spectateurs.",
          likes: 12
        }
      ]
    },
    {
      id: "5",
      titre: "Guide Complet pour Choisir et Installer un Écran Gonflable pour un Cinéma en Plein Air : L'Expérience Ultime Sous les Étoiles",
      extrait: "Choisir le bon écran gonflable pour votre cinéma en plein air est essentiel pour garantir une expérience visuelle de qualité. Ce guide complet vous aide à comparer les différentes options disponibles, à comprendre les spécifications techniques et à réaliser une installation parfaite pour vos projections sous les étoiles.",
      categorie: "Cinéma en Plein Air",
      date: "2024-08-25",
      slug: "guide-complet-installer-ecran-gonflable-cinema-plein-air",
      commentaires: [
        {
          auteur: "François Blanc",
          avatar: "FB",
          date: "2024-09-08",
          texte: "Après avoir lu cet article, j'ai opté pour l'écran étanche 5m pour notre gîte rural. Les clients adorent les soirées cinéma sous les étoiles. C'est devenu notre argument de vente numéro un sur Booking !",
          likes: 33
        },
        {
          auteur: "Camille Roux",
          avatar: "CR",
          date: "2024-09-15",
          texte: "Comparaison très claire entre les différents modèles. Pour les campings, je confirme que l'étanche à l'air est le meilleur choix — pas de bruit de soufflerie et une installation ultra rapide. On l'utilise 4 soirs par semaine en haute saison.",
          likes: 15
        },
        {
          auteur: "Patrick Mercier",
          avatar: "PM",
          date: "2024-09-22",
          texte: "Excellent guide technique. J'apprécie particulièrement la section sur le ratio de projection et la distance optimale. Ça m'a évité de faire une erreur de dimensionnement pour notre salle des fêtes en extérieur.",
          likes: 8
        }
      ]
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
      <Navbar />

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
                  <article key={article.id} className="bg-card rounded-lg border border-border overflow-hidden">
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
                        <a
                          href={`https://www.hallucinecran.com/fr/blogs/post/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#DAA520] font-medium hover:underline"
                        >
                          Lire l'article complet
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
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
                                        ÉQUIPE
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
                            <h4 className="text-sm font-semibold mb-4">Laisser un commentaire</h4>
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-white/40" />
                              </div>
                              <div className="flex-1 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <input
                                    type="text"
                                    placeholder="Votre nom"
                                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:border-[#DAA520] focus:outline-none transition-colors"
                                  />
                                  <input
                                    type="email"
                                    placeholder="Votre email"
                                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:border-[#DAA520] focus:outline-none transition-colors"
                                  />
                                </div>
                                <textarea
                                  rows={3}
                                  placeholder="Votre commentaire..."
                                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:border-[#DAA520] focus:outline-none transition-colors resize-none"
                                />
                                <button className="px-5 py-2 bg-[#DAA520] text-white text-sm font-semibold rounded-lg hover:bg-[#B8860B] transition-colors">
                                  Publier le commentaire
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

      <Footer />
    </div>
  );
}
