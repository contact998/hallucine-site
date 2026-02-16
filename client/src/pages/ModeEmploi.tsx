import { Link } from "wouter";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GearsEffect from "@/components/GearsEffect";
import VideoLightbox from "@/components/VideoLightbox";
import { Play } from "lucide-react";

export default function ModeEmploi() {
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);
  const videos = [
    { id: "bAxDUrxFUXw", title: "Montage écran soufflerie 10m", description: "Tutoriel complet pour le montage d'un écran gonflable à soufflerie de 10 mètres." },
    { id: "sHeVec7oZfQ", title: "Démontage écran soufflerie", description: "Comment démonter et ranger votre écran gonflable à soufflerie en toute simplicité." },
    { id: "_lLdMYZhz7s", title: "Installation écran gonflable", description: "Démonstration d'installation rapide d'un écran gonflable Hallucine." },
    { id: "lnZ_fbEXH44", title: "Écran gonflable en action", description: "Découvrez nos écrans gonflables lors d'événements en plein air." },
    { id: "UQmA8fZRDYg", title: "Tutoriel montage complet", description: "Guide vidéo pas à pas pour installer votre écran gonflable." },
    { id: "hmSlBIWP_jI", title: "Présentation produit", description: "Présentation détaillée de nos écrans gonflables et de leurs caractéristiques." },
  ];

  const etapes = [
    {
      numero: 1, titre: "Préparation",
      img: "https://www.hallucinecran.com/Giant%20Inf/9.webp",
      instructions: [
        "Déroulez la bâche verte sur le sol pour protéger la zone où l'écran sera installé.",
        "Dépliez le sac en longueur sur la bâche, en veillant à identifier le devant du sac (indiqué par un sticker blanc).",
        "Ne pas ouvrir le sac à ce stade."
      ]
    },
    {
      numero: 2, titre: "Sécurisation de la Base de l'Écran",
      instructions: [
        "Sortez les 4 cordes qui se trouvent dans les 4 pochettes du sac et déployez-les à angle droit.",
        "Plantez 4 piquets d'ancrage, un à l'extrémité de chaque corde.",
        "Fixez les 4 cordes du bas aux piquets pour sécuriser la base de l'écran. Assurez-vous que ces 4 cordes soient bien tendues.",
        "Pour chaque piquet, faites un tour mort, puis un nœud d'arrêt simple.",
        "Le sac, toujours fermé, sera immobilisé au centre des 4 piquets."
      ]
    },
    {
      numero: 3, titre: "Déploiement de l'Écran",
      instructions: [
        "Ouvrez le sac et dépliez l'écran à plat sur le sol, avec la toile de contreventement face au sol."
      ]
    },
    {
      numero: 4, titre: "Fixation des Cordes du Haut",
      instructions: [
        "Repliez l'écran en deux sur lui-même.",
        "Fixez les 4 cordes en haut de l'écran en utilisant les boucles prévues à cet effet.",
        "Déroulez les 4 cordes, en dirigeant 2 cordes vers les piquets à l'avant et les 2 autres vers l'arrière.",
        "Attachez les 4 cordes du haut aux piquets, sans les tendre (référez-vous à l'abaque fourni)."
      ]
    },
    {
      numero: 5, titre: "Activation du Souffleur",
      img: "https://www.hallucinecran.com/Giant%20Inf/1.webp",
      instructions: [
        "Connectez le souffleur au manchon situé sur le côté de l'écran.",
        "Assurez-vous que les fermetures éclair de l'écran et le manchon secondaire sont bien fermés.",
        "Mettez le souffleur en marche : l'écran se redressera de lui-même."
      ]
    }
  ];

  const contenuLivraison = [
    { nom: "Abaque", description: "Document de référence pour les longueurs de cordes" },
    { nom: "Souffleur", description: "Souffleur électrique pour gonfler l'écran" },
    { nom: "Écran complet", description: "Structure + Écran de projection + Toile de contreventement + Sac de rangement" },
    { nom: "10 Cordes", description: "4 cordes du haut, 4 cordes du bas, 2 cordes du milieu" },
  ];

  const materielNonInclus = ["4 piquets d'ancrage", "Double décamètre", "Masse de 3 kg", "Bâche verte"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <GearsEffect />
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Guide d'installation</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Montage et Démontage<br />
            <span className="text-warm">des Écrans Gonflables</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Bienvenue sur notre page dédiée aux instructions détaillées pour le montage et le démontage 
            des écrans gonflables. Vidéos explicatives et tutoriel étape par étape.
          </p>
        </div>
      </section>

      {/* Vidéos tutorielles */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Vidéos Tutorielles</h2>
          <p className="text-white/60 mb-12 max-w-2xl">
            Regardez nos vidéos explicatives pour apprendre à monter et démonter vos écrans gonflables Hallucine.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer group" onClick={() => setActiveVideo({ id: video.id, title: video.title })}>
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <img src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-7 h-7 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-ivory font-semibold">{video.title}</h3>
                  <p className="text-white/60 text-sm">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="https://www.youtube.com/channel/UCqIaNSl1_6_I3ABfzFIJ2Ow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm hover:underline font-medium inline-flex items-center gap-2"
            >
              Voir toutes nos vidéos sur YouTube →
            </a>
          </div>
        </div>
      </section>

      {/* Mode d'emploi texte */}
      <section className="py-20 bg-charcoal-light">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-ivory mb-4">Mode d'Emploi — Installation</h2>
          <p className="text-white/60 mb-12">
            Suivez ces instructions étape par étape pour installer votre écran gonflable en toute sécurité.
          </p>

          {/* Contenu de la livraison */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-ivory mb-6">📦 Contenu de la Livraison</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {contenuLivraison.map((item) => (
                <div key={item.nom} className="bg-background rounded-lg p-4">
                  <h4 className="text-ivory font-semibold text-sm mb-1">{item.nom}</h4>
                  <p className="text-white/60 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Matériel non inclus */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-ivory mb-6">⚠ Matériel Nécessaire Mais Non Inclus</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {materielNonInclus.map((item) => (
                <div key={item} className="flex items-center gap-3 bg-background rounded-lg p-3">
                  <span className="w-2 h-2 rounded-full bg-warm shrink-0" />
                  <span className="text-white/70 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Étapes d'installation */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-ivory mb-8">Étapes d'Installation</h3>
            <div className="space-y-8">
              {etapes.map((etape) => (
                <div key={etape.numero} className="relative pl-16">
                  <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-warm text-charcoal flex items-center justify-center text-xl font-bold">
                    {etape.numero}
                  </div>
                  {etape.numero < etapes.length && (
                    <div className="absolute left-[23px] top-14 w-0.5 h-[calc(100%-2rem)] bg-warm/20" />
                  )}
                  <h4 className="text-lg font-bold text-ivory mb-3 pt-2">{etape.titre}</h4>
                  {etape.img && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img src={etape.img} alt={etape.titre} className="w-full max-w-lg rounded" loading="lazy" />
                    </div>
                  )}
                  <ul className="space-y-2">
                    {etape.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-warm mt-2 shrink-0" />
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-warm/10 rounded-lg border border-warm/20">
              <p className="text-warm font-medium text-center text-sm">
                En suivant ces étapes, votre écran de projection sera correctement installé et prêt à l'emploi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Besoin d'aide supplémentaire ?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Notre équipe est disponible pour vous accompagner dans l'installation de vos produits Hallucine.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Contactez-nous
            </Link>
            <a
              href="https://www.youtube.com/channel/UCqIaNSl1_6_I3ABfzFIJ2Ow"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors"
            >
              Notre chaîne YouTube
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox vidéo */}
      {activeVideo && (
        <VideoLightbox
          videoId={activeVideo.id}
          title={activeVideo.title}
          isOpen={true}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
}
