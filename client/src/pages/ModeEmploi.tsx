import { Link } from "wouter";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GearsEffect from "@/components/GearsEffect";
import VideoLightbox from "@/components/VideoLightbox";
import { Play, Package, AlertTriangle, Wrench } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

/* ── CDN URLs des images ── */
const IMG = {
  schema1: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/whKrSXMXRQLlaxYD.jpg",
  schema2: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/GvocDovsKTBPpHTW.jpg",
  schema3: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/fOhocnnIzeNSYCnb.jpg",
  schema4: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/jGAvIORRLFaBGOwH.jpg",
  schema5: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/gxELcgzbYzxUKpHb.jpg",
  schema6: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/DlnrjGoFUVTwrESw.jpg",
  schema7: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/OnVSRLghTtMGMqBo.jpg",
  masse: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/cumCntiEjCLJiWXQ.webp",
  piquet: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/iXwtJPsqGsxhogzF.jpg",
  bache: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bRosVlxfuQBUAGFo.jpg",
  metre: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ZLzKkCMaGeLLXhAp.jpg",
  souffleur: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ULtikgICfEVZCJBk.jpg",
};

export default function ModeEmploi() {
  useDocumentMeta("Mode d'Emploi | Installation Écran Gonflable", "Guide d'installation de votre écran de cinéma gonflable. Instructions étape par étape, conseils et astuces pour une projection réussie.");

  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);

  const videos = [
    { id: "bAxDUrxFUXw", title: "Montage écran soufflerie 10m", description: "Tutoriel complet pour le montage d'un écran gonflable à soufflerie de 10 mètres." },
    { id: "v1Hb0GYLf8w", title: "Comment mettre les cordes aux piquets", description: "Démonstration de la technique de fixation des cordes aux piquets d'ancrage." },
    { id: "sHeVec7oZfQ", title: "Démontage écran soufflerie", description: "Comment démonter et ranger votre écran gonflable à soufflerie en toute simplicité." },
    { id: "lnZ_fbEXH44", title: "Écran gonflable en action", description: "Découvrez nos écrans gonflables lors d'événements en plein air." },
    { id: "UQmA8fZRDYg", title: "Tutoriel montage complet", description: "Guide vidéo pas à pas pour installer votre écran gonflable." },
    { id: "hmSlBIWP_jI", title: "Présentation produit", description: "Présentation détaillée de nos écrans gonflables et de leurs caractéristiques." },
  ];

  const contenuLivraison = [
    { nom: "Abaque", description: "Document de référence pour les longueurs de cordes", img: IMG.metre },
    { nom: "Souffleur", description: "Souffleur électrique pour gonfler l'écran", img: IMG.souffleur },
    { nom: "Écran complet", description: "Structure + Écran de projection + Toile de contreventement + Sac de rangement" },
    { nom: "10 Cordes", description: "4 cordes du haut (les plus longues), 4 cordes du bas (les plus courtes), 2 cordes du milieu (longueur intermédiaire)" },
  ];

  const materielNonInclus = [
    { nom: "4 piquets d'ancrage", img: IMG.piquet },
    { nom: "Double décamètre", img: IMG.metre },
    { nom: "Masse de 3 kg", img: IMG.masse },
    { nom: "Bâche verte", img: IMG.bache },
  ];

  const etapes = [
    {
      numero: 1,
      titre: "Préparation",
      schema: IMG.schema1,
      schemaCaption: "Dépliage du sac en longueur sur la bâche",
      instructions: [
        "Déroulez la bâche verte sur le sol pour protéger la zone où l'écran sera installé.",
        "Dépliez le sac en longueur sur la bâche, en veillant à identifier le devant du sac (indiqué par un sticker blanc). Ne pas ouvrir le sac à ce stade.",
      ],
    },
    {
      numero: 2,
      titre: "Sécurisation de la Base de l'Écran",
      schema: IMG.schema2,
      schemaCaption: "Sécurisation de la base de l'écran",
      instructions: [
        "Sortez les 4 cordes qui se trouvent dans les 4 pochettes du sac et déployez-les à angle droit (ouvrez les fermetures éclair des pochettes).",
        "Plantez 4 piquets d'ancrage, un à l'extrémité de chaque corde.",
        "Fixez les 4 cordes du bas aux piquets pour sécuriser la base de l'écran. Assurez-vous que ces 4 cordes soient bien tendues. Pour chaque piquet, faites un tour mort, puis un nœud d'arrêt simple.",
        "Le sac, toujours fermé, sera immobilisé au centre des 4 piquets.",
      ],
    },
    {
      numero: 3,
      titre: "Déploiement de l'Écran",
      schema: IMG.schema3,
      schemaCaption: "Déploiement de l'écran sur le sol",
      instructions: [
        "Ouvrez le sac et dépliez l'écran à plat sur le sol, avec la toile de contreventement face au sol.",
      ],
    },
    {
      numero: 4,
      titre: "Écran à plat sur le sol",
      schema: IMG.schema4,
      schemaCaption: "Écran à plat sur le sol",
      instructions: [
        "L'écran est maintenant entièrement déplié sur le sol, prêt pour la fixation des cordes du haut.",
      ],
    },
    {
      numero: 5,
      titre: "Fixation des Cordes du Haut",
      schema: IMG.schema5,
      schemaCaption: "Repli de l'écran en deux sur lui-même",
      instructions: [
        "Repliez l'écran en deux sur lui-même.",
        "Fixez les 4 cordes en haut de l'écran en utilisant les boucles prévues à cet effet. Attachez deux cordes à droite et deux à gauche, en les fixant aux mêmes points d'ancrage sur l'écran.",
        "Déroulez les 4 cordes, en dirigeant 2 cordes vers les piquets à l'avant de l'écran, et les 2 autres vers les piquets à l'arrière de l'écran.",
        "Attachez les 4 cordes du haut aux piquets, sans les tendre. La longueur de chaque corde dépend de la distance entre le piquet et la base de l'écran (référez-vous à l'abaque fourni).",
      ],
    },
    {
      numero: 6,
      titre: "Déroulez les 4 cordes",
      schema: IMG.schema6,
      schemaCaption: "Déroulez les 4 cordes vers les piquets",
      instructions: [
        "Dirigez 2 cordes vers les piquets à l'avant de l'écran et les 2 autres vers les piquets à l'arrière.",
      ],
    },
    {
      numero: 7,
      titre: "Activation du Souffleur",
      schema: IMG.schema7,
      schemaCaption: "Activation du souffleur — l'écran se redresse",
      instructions: [
        "Connectez le souffleur au manchon situé sur le côté de l'écran.",
        "Assurez-vous que les fermetures éclair de l'écran (possibles à 3 emplacements : en haut, en bas, et sur les côtés de l'écran) et le manchon secondaire derrière le bas de l'écran sont bien fermés.",
        "Mettez le souffleur en marche : l'écran se redressera de lui-même.",
      ],
    },
  ];

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer group" onClick={() => setActiveVideo({ id: video.id, title: video.title })}>
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <img src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} alt={`Vidéo tutorielle Hallucine — ${video.title}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-ivory font-semibold text-sm">{video.title}</h3>
                  <p className="text-white/60 text-xs mt-1">{video.description}</p>
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

      {/* Mode d'emploi — 2 colonnes comme l'original */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4 text-center">Mode d'Emploi pour l'Installation d'un Écran Gonflable</h2>
          <p className="text-white/60 mb-12 text-center max-w-3xl mx-auto">
            Suivez ces instructions étape par étape pour installer votre écran gonflable en toute sécurité.
          </p>

          {/* Contenu de la livraison + Matériel */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-ivory mb-6 flex items-center gap-3">
                <Package className="w-6 h-6 text-warm" />
                Contenu de la Livraison
              </h3>
              <div className="space-y-4">
                {contenuLivraison.map((item) => (
                  <div key={item.nom} className="flex items-start gap-4 bg-background rounded-lg p-4">
                    {item.img && (
                      <img
                        src={item.img}
                        alt={`Matériel Hallucine — ${item.nom}`}
                        className="w-16 h-16 object-contain rounded cursor-pointer hover:scale-110 transition-transform"
                        loading="lazy"
                        onClick={() => setLightboxImg({ src: item.img!, alt: item.nom })}
                      />
                    )}
                    <div>
                      <h4 className="text-ivory font-semibold text-sm">{item.nom}</h4>
                      <p className="text-white/60 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-ivory mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-warm" />
                Matériel Nécessaire Mais Non Inclus
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {materielNonInclus.map((item) => (
                  <div key={item.nom} className="flex flex-col items-center gap-3 bg-background rounded-lg p-4">
                    <img
                      src={item.img}
                      alt={`Matériel nécessaire — ${item.nom}`}
                      className="w-16 h-16 object-contain rounded cursor-pointer hover:scale-110 transition-transform"
                      loading="lazy"
                      onClick={() => setLightboxImg({ src: item.img, alt: item.nom })}
                    />
                    <span className="text-white/70 text-sm font-medium text-center">{item.nom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Étapes d'installation — chaque étape avec schéma en face */}
          <h3 className="text-2xl font-bold text-ivory mb-10 flex items-center justify-center gap-3">
            <Wrench className="w-7 h-7 text-warm" />
            Étapes d'Installation
          </h3>

          <div className="space-y-12">
            {etapes.map((etape) => (
              <div key={etape.numero} className="grid md:grid-cols-2 gap-8 items-center">
                {/* Colonne gauche : texte de l'étape avec timeline */}
                <div className="relative pl-14">
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-warm text-charcoal flex items-center justify-center text-lg font-bold shadow-lg">
                    {etape.numero}
                  </div>
                  {etape.numero < etapes.length && (
                    <div className="absolute left-[19px] top-12 w-0.5 h-[calc(100%+2rem)] bg-warm/20" />
                  )}
                  <h4 className="text-lg font-bold text-ivory mb-4 pt-1">{etape.titre}</h4>
                  <ul className="space-y-3">
                    {etape.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-warm mt-2 shrink-0" />
                        <span className="text-sm leading-relaxed">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Colonne droite : schéma en face */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <img
                    src={etape.schema}
                    alt={`Schéma étape ${etape.numero} — ${etape.schemaCaption}`}
                    className="w-full max-h-64 object-contain p-2 cursor-pointer hover:scale-[1.02] transition-transform"
                    loading="lazy"
                    onClick={() => setLightboxImg({ src: etape.schema, alt: etape.schemaCaption })}
                  />
                  <div className="p-2 text-center border-t border-border">
                    <p className="text-white/50 text-xs">{etape.schemaCaption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-4 bg-warm/10 rounded-lg border border-warm/20">
            <p className="text-warm font-medium text-center text-sm">
              En suivant ces étapes, votre écran de projection sera correctement installé et prêt à l'emploi.
            </p>
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

      {/* Lightbox image */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-4xl font-light z-10"
            onClick={() => setLightboxImg(null)}
          >
            ×
          </button>
          <img
            src={lightboxImg.src}
            alt={lightboxImg.alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 text-white/70 text-sm">{lightboxImg.alt}</p>
        </div>
      )}
    </div>
  );
}
