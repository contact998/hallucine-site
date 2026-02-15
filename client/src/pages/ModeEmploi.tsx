import { Link } from "wouter";

export default function ModeEmploi() {
  const videos = [
    {
      id: "bAxDUrxFUXw",
      title: "Montage écran soufflerie 10m",
      description: "Tutoriel complet pour le montage d'un écran gonflable à soufflerie de 10 mètres."
    },
    {
      id: "sHeVec7oZfQ",
      title: "Démontage écran soufflerie",
      description: "Comment démonter et ranger votre écran gonflable à soufflerie en toute simplicité."
    },
    {
      id: "_lLdMYZhz7s",
      title: "Installation écran gonflable",
      description: "Démonstration d'installation rapide d'un écran gonflable Hallucine."
    },
    {
      id: "lnZ_fbEXH44",
      title: "Écran gonflable en action",
      description: "Découvrez nos écrans gonflables lors d'événements en plein air."
    },
    {
      id: "UQmA8fZRDYg",
      title: "Tutoriel montage complet",
      description: "Guide vidéo pas à pas pour installer votre écran gonflable."
    },
    {
      id: "hmSlBIWP_jI",
      title: "Présentation produit",
      description: "Présentation détaillée de nos écrans gonflables et de leurs caractéristiques."
    }
  ];

  const etapes = [
    {
      numero: 1,
      titre: "Préparation",
      instructions: [
        "Déroulez la bâche verte sur le sol pour protéger la zone où l'écran sera installé.",
        "Dépliez le sac en longueur sur la bâche, en veillant à identifier le devant du sac (indiqué par un sticker blanc).",
        "Ne pas ouvrir le sac à ce stade."
      ]
    },
    {
      numero: 2,
      titre: "Sécurisation de la Base de l'Écran",
      instructions: [
        "Sortez les 4 cordes qui se trouvent dans les 4 pochettes du sac et déployez-les à angle droit (ouvrez les fermetures éclair des pochettes).",
        "Plantez 4 piquets d'ancrage, un à l'extrémité de chaque corde.",
        "Fixez les 4 cordes du bas aux piquets pour sécuriser la base de l'écran. Assurez-vous que ces 4 cordes soient bien tendues.",
        "Pour chaque piquet, faites un tour mort, puis un nœud d'arrêt simple.",
        "Le sac, toujours fermé, sera immobilisé au centre des 4 piquets."
      ]
    },
    {
      numero: 3,
      titre: "Déploiement de l'Écran",
      instructions: [
        "Ouvrez le sac et dépliez l'écran à plat sur le sol, avec la toile de contreventement face au sol."
      ]
    },
    {
      numero: 4,
      titre: "Fixation des Cordes du Haut",
      instructions: [
        "Repliez l'écran en deux sur lui-même.",
        "Fixez les 4 cordes en haut de l'écran en utilisant les boucles prévues à cet effet. Attachez deux cordes à droite et deux à gauche, en les fixant aux mêmes points d'ancrage sur l'écran.",
        "Déroulez les 4 cordes, en dirigeant 2 cordes vers les piquets à l'avant de l'écran, et les 2 autres vers les piquets à l'arrière de l'écran.",
        "Attachez les 4 cordes du haut aux piquets, sans les tendre. La longueur de chaque corde dépend de la distance entre le piquet et la base de l'écran (référez-vous à l'abaque fourni)."
      ]
    },
    {
      numero: 5,
      titre: "Activation du Souffleur",
      instructions: [
        "Connectez le souffleur au manchon situé sur le côté de l'écran.",
        "Assurez-vous que les fermetures éclair de l'écran (possibles à 3 emplacements : en haut, en bas, et sur les côtés de l'écran) et le manchon secondaire derrière le bas de l'écran sont bien fermés.",
        "Mettez le souffleur en marche : l'écran se redressera de lui-même."
      ]
    }
  ];

  const contenuLivraison = [
    { nom: "Abaque", description: "Document de référence pour les longueurs de cordes" },
    { nom: "Souffleur", description: "Souffleur électrique pour gonfler l'écran" },
    { nom: "Écran complet", description: "Structure + Écran de projection + Toile de contreventement + Sac de rangement (même longueur que l'écran)" },
    { nom: "10 Cordes", description: "4 cordes du haut (les plus longues), 4 cordes du bas (les plus courtes), 2 cordes du milieu (longueur intermédiaire)" }
  ];

  const materielNonInclus = [
    "4 piquets d'ancrage",
    "Double décamètre",
    "Masse de 3 kg",
    "Bâche verte"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative bg-[#8B7500] text-white py-20 md:py-28">
        <div className="container max-w-5xl text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Montage et Démontage des Écrans Gonflables
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            Bienvenue sur notre page dédiée aux instructions détaillées pour le montage et le démontage 
            des écrans gonflables. Ici, vous trouverez des vidéos explicatives pour chaque étape du processus, 
            afin de vous garantir une installation rapide, sûre et efficace de vos écrans gonflables.
          </p>
          <p className="text-base md:text-lg mt-4 opacity-80">
            Ainsi qu'un tutoriel étape par étape.
          </p>
        </div>
      </section>

      {/* Vidéos tutorielles */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-6xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            Vidéos Tutorielles
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Regardez nos vidéos explicatives pour apprendre à monter et démonter vos écrans gonflables Hallucine.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="bg-card rounded-lg overflow-hidden border border-border shadow-sm">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://www.youtube.com/channel/UCqIaNSl1_6_I3ABfzFIJ2Ow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#DAA520] hover:underline font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              Voir toutes nos vidéos sur YouTube
            </a>
          </div>
        </div>
      </section>

      {/* Mode d'emploi texte */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            Mode d'Emploi pour l'Installation d'un Écran Gonflable
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Suivez ces instructions étape par étape pour installer votre écran gonflable en toute sécurité.
          </p>

          {/* Contenu de la livraison */}
          <div className="bg-card rounded-lg border border-border p-6 md:p-8 mb-8">
            <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#DAA520] text-white flex items-center justify-center text-lg font-bold shrink-0">📦</span>
              Contenu de la Livraison
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {contenuLivraison.map((item) => (
                <div key={item.nom} className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-base mb-1">{item.nom}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Matériel non inclus */}
          <div className="bg-card rounded-lg border border-border p-6 md:p-8 mb-8">
            <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg font-bold shrink-0">⚠</span>
              Matériel Nécessaire Mais Non Inclus
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {materielNonInclus.map((item) => (
                <div key={item} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Étapes d'installation */}
          <div className="bg-card rounded-lg border border-border p-6 md:p-8">
            <h3 className="font-display text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold shrink-0">🔧</span>
              Étapes d'Installation
            </h3>
            <div className="space-y-8">
              {etapes.map((etape) => (
                <div key={etape.numero} className="relative pl-16">
                  <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-[#DAA520] text-white flex items-center justify-center text-xl font-bold">
                    {etape.numero}
                  </div>
                  {etape.numero < etapes.length && (
                    <div className="absolute left-[23px] top-14 w-0.5 h-[calc(100%-2rem)] bg-[#DAA520]/20" />
                  )}
                  <h4 className="font-display text-xl font-bold mb-3 pt-2">{etape.titre}</h4>
                  <ul className="space-y-2">
                    {etape.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520] mt-2 shrink-0" />
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200 font-medium text-center">
                En suivant ces étapes, votre écran de projection sera correctement installé et prêt à l'emploi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1a1a2e] text-white text-center">
        <div className="container max-w-3xl">
          <h2 className="font-display text-3xl font-bold mb-4">
            Besoin d'aide supplémentaire ?
          </h2>
          <p className="text-lg opacity-80 mb-8">
            Notre équipe est disponible pour vous accompagner dans l'installation de vos produits Hallucine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contactez-nous" className="inline-block bg-[#DAA520] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B8860B] transition-colors">
              Contactez-nous
            </Link>
            <a
              href="https://www.youtube.com/channel/UCqIaNSl1_6_I3ABfzFIJ2Ow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Notre chaîne YouTube
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
