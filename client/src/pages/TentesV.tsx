/*
 * Page Tentes V — Tentes Gonflables en Forme de V
 * Reproduit fidèlement la page hallucinecran.com/inflatable-tents-v
 * Mêmes images, même contenu, même structure
 * Design cinéma vintage — fond sombre, accents dorés
 */
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoLightbox from "@/components/VideoLightbox";
import { Link } from "wouter";
import { Play, X as XIcon } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

/* ─── Images hero (grille identique à l'ancien site) ─── */
const heroImages = [
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HiOAOTLZaOhqpcQk.webp", alt: "Tente gonflable V blanche vue de face" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/nvpNhKQWdZSYGIgR.webp", alt: "Tente gonflable V blanche vue d'ensemble" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/EpaIyWYtXIFowiQT.webp", alt: "Tente gonflable V personnalisée avec logo" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/deVDPczivrfxEEVT.webp", alt: "Tente gonflable V stand événement extérieur" },
];

/* ─── Image schéma éclaté ─── */
const schemaEclate = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/qSTOOwNPJJIAFgwe.webp";

export default function TentesV() {
  useDocumentMeta("Tente Gonflable V | Design Élégant", "Tente gonflable V au design élégant et moderne. Idéale pour événements haut de gamme, mariages et réceptions. Personnalisation complète.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/TVmrusoKmXcTvkKP.webp");

  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const openLightbox = useCallback((src: string, alt: string) => setLightbox({ src, alt }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
        <PageStructuredData
          id="tentes-v"
          breadcrumbs={[
            { name: "Accueil", url: "https://hallucinecran.fr/" },
            { name: "Tentes Gonflables", url: "https://hallucinecran.fr/tente-gonflable" },
            { name: "Tentes en Forme de V", url: "https://hallucinecran.fr/tentes-gonflables-v" },
          ]}
          product={{
            name: "Tente Gonflable en Forme de V",
            description: "Tente gonflable V au design élégant et moderne. Idéale pour événements haut de gamme, mariages et réceptions. Personnalisation complète.",
            image: heroImages.map(img => img.src),
            url: "https://hallucinecran.fr/tentes-gonflables-v",
            category: "Tentes gonflables",
          minPrice: 1490,
          }}
        />
      <Navbar />

      {/* ═══ HERO — titre + grille 4 photos ═══ */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Tentes gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-10">
            Tentes en forme de V<br />
            <span className="text-warm">Élégance et Praticité</span>
          </h1>

          {/* Grille photos : 4 côte à côte */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {heroImages.map((img, i) => (
              <div key={i} className="cursor-pointer rounded-lg overflow-hidden aspect-[4/3]" onClick={() => openLightbox(img.src, img.alt)}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTRO TEXTE CENTRÉ ═══ */}
      <section className="py-16 bg-background">
        <div className="container text-center max-w-4xl mx-auto">
          <p className="text-white/70 text-lg leading-relaxed mb-6">
            Nos <strong className="text-ivory">tentes gonflables en forme de V</strong> allient <strong className="text-ivory">style</strong> et <strong className="text-ivory">fonctionnalité</strong> pour répondre aux besoins des professionnels de l'événementiel. Ces structures uniques sont idéales pour créer des espaces couverts attrayants lors d'événements en extérieur, tels que des <strong className="text-ivory">festivals</strong>, des <strong className="text-ivory">salons professionnels</strong> ou des <strong className="text-ivory">stands publicitaires</strong>.
          </p>
        </div>
      </section>

      {/* ═══ SECTION FOND SOMBRE — Pourquoi Choisir + 2 cards ═══ */}
      <section className="py-20 bg-charcoal-light relative overflow-hidden">
        {/* Image de fond subtile */}
        <div className="absolute inset-0 opacity-10">
          <img loading="lazy" src={heroImages[0].src} alt="" className="w-full h-full object-cover" decoding="async" />
        </div>
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Texte gauche */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-6">
                Pourquoi Choisir<br />
                <span className="text-warm">nos Tentes Hallucine ?</span>
              </h2>
              <p className="text-white/70 leading-relaxed">
                Chez Hallucine, nous vous proposons des tentes gonflables <strong className="text-ivory">légères</strong>, <strong className="text-ivory">robustes</strong> et <strong className="text-ivory">faciles à utiliser</strong>. Avec plus de <strong className="text-ivory">30 ans d'expérience</strong> dans le matériel événementiel, nous nous engageons à fournir des produits de qualité supérieure adaptés à vos besoins spécifiques.
              </p>
            </div>

            {/* Card Caractéristiques principales */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
              <h3 className="text-warm font-bold text-xl mb-4">Caractéristiques Principales</h3>
              <ul className="space-y-3 text-white/70 text-sm leading-relaxed">
                <li>
                  <strong className="text-ivory">Design en V unique :</strong> Une forme moderne qui attire l'œil et donne une touche originale à vos événements.
                </li>
                <li>
                  <strong className="text-ivory">Installation rapide et facile :</strong> Gonflage en quelques minutes grâce à un souffleur intégré.
                </li>
                <li>
                  <strong className="text-ivory">Résistance aux intempéries :</strong> Matériaux imperméables et durables, adaptés à toutes les conditions météorologiques.
                </li>
                <li>
                  <strong className="text-ivory">Polyvalence :</strong> Parfaite pour les zones d'accueil, les espaces VIP ou les stands de marque.
                </li>
                <li>
                  <strong className="text-ivory">Personnalisation possible :</strong> Ajoutez des logos ou des couleurs spécifiques pour refléter votre identité visuelle.
                </li>
              </ul>
            </div>

            {/* Card Applications courantes */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
              <h3 className="text-warm font-bold text-xl mb-4">Applications Courantes</h3>
              <ul className="space-y-3 text-white/70 text-sm leading-relaxed">
                <li>
                  <strong className="text-ivory">Stands publicitaires :</strong> Mettez en avant votre marque lors d'expositions et d'événements professionnels.
                </li>
                <li>
                  <strong className="text-ivory">Zones de repos ou d'accueil :</strong> Offrez un abri confortable pour vos invités.
                </li>
                <li>
                  <strong className="text-ivory">Événements sportifs :</strong> Installez des zones VIP ou des points de ravitaillement.
                </li>
                <li>
                  <strong className="text-ivory">Festivals et concerts :</strong> Protégez vos équipements ou créez des espaces couverts pour vos activités.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PERFORMANCE OPTIMISÉE + VIDÉO ═══ */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Texte gauche */}
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-4">
                Tentes Gonflables V :<br />
                <span className="text-warm">Performance Optimisée et Personnalisation</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Les <strong className="text-ivory">Tentes Gonflables V</strong> Hallucine sont des structures innovantes conçues pour offrir une performance exceptionnelle lors de vos événements. Avec des matériaux de haute qualité et des caractéristiques techniques avancées, ces tentes sont idéales pour les salons, foires, expositions, événements extérieurs et plus encore.
              </p>
              <h3 className="text-warm font-semibold text-lg mb-3">Dimensions Disponibles</h3>
              <p className="text-white/60 leading-relaxed mb-4">
                Nos <strong className="text-ivory">Tentes Gonflables V</strong> sont disponibles en trois tailles adaptées à vos besoins :
              </p>
              <ul className="space-y-2 text-white/70 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-warm rounded-full shrink-0" />
                  <strong className="text-ivory">Tente Gonflable 4×4m</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-warm rounded-full shrink-0" />
                  <strong className="text-ivory">Tente Gonflable 5×5m</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-warm rounded-full shrink-0" />
                  <strong className="text-ivory">Tente Gonflable 6×6m</strong>
                </li>
              </ul>
              <p className="text-white/60 text-sm leading-relaxed">
                Chaque modèle est conçu pour offrir un montage rapide, une grande stabilité et une durabilité supérieure, quel que soit l'environnement.
              </p>
            </div>

            {/* Vidéo YouTube droite */}
            <div className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer group" onClick={() => setActiveVideo({ id: '-cga1EVZQtg', title: 'Tente gonflable V — Montage' })}>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <img src="https://img.youtube.com/vi/-cga1EVZQtg/hqdefault.jpg" alt="Tutoriel montage tente gonflable en V Hallucine" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-ivory font-semibold">Tente gonflable V — Montage</h3>
                <p className="text-white/60 text-sm">Tutoriel de montage de la tente gonflable en V Hallucine.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ AVANTAGES DE LA GAMME ═══ */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-10">
            Avantages de la <span className="text-warm">Gamme</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-xl">
              <div className="shrink-0 w-10 h-10 rounded-full bg-warm/20 flex items-center justify-center">
                <span className="text-warm font-bold">1</span>
              </div>
              <div>
                <h3 className="text-ivory font-semibold mb-2">Facilité de Montage et Transport</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Chaque <strong className="text-ivory">Tente Gonflable V</strong> est légère, facile à transporter et rapide à installer grâce à un système de gonflage optimisé.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-xl">
              <div className="shrink-0 w-10 h-10 rounded-full bg-warm/20 flex items-center justify-center">
                <span className="text-warm font-bold">2</span>
              </div>
              <div>
                <h3 className="text-ivory font-semibold mb-2">Structure Renforcée</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Le boudin en <strong className="text-ivory">TPU</strong> recouvert de <strong className="text-ivory">Dacron</strong> assure une robustesse maximale tout en étant facilement remplaçable grâce à une fermeture à glissière. Vous pouvez ainsi réparer rapidement les boudins sans avoir à remplacer l'ensemble de la structure.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-xl">
              <div className="shrink-0 w-10 h-10 rounded-full bg-warm/20 flex items-center justify-center">
                <span className="text-warm font-bold">3</span>
              </div>
              <div>
                <h3 className="text-ivory font-semibold mb-2">Personnalisation Haute Qualité</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Profitez de l'impression numérique sur le toit de votre tente. Que ce soit pour des logos d'entreprise ou des visuels d'événements, vos créations sont fidèlement reproduites pour une visibilité maximale.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-xl">
              <div className="shrink-0 w-10 h-10 rounded-full bg-warm/20 flex items-center justify-center">
                <span className="text-warm font-bold">4</span>
              </div>
              <div>
                <h3 className="text-ivory font-semibold mb-2">Adaptabilité à Tous Types d'Événements</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  La <strong className="text-ivory">Tente Gonflable V</strong> peut être utilisée pour des événements professionnels, publicitaires ou festifs grâce à sa grande capacité et sa stabilité en extérieur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SCHÉMA ÉCLATÉ DES COMPOSANTS ═══ */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8 text-center">
            Schéma des <span className="text-warm">Composants</span>
          </h2>
          <div className="cursor-pointer max-w-4xl mx-auto" onClick={() => openLightbox(schemaEclate, "Schéma éclaté des composants de la Tente Gonflable V")}>
            <img
              src={schemaEclate}
              alt="Schéma éclaté des composants de la Tente Gonflable V — pompe, valve, sardines, sac de transport, tissu, structure Dacron, sacs de lestage"
              className="w-full rounded-lg shadow-lg hover:scale-[1.01] transition-transform"
              loading="lazy"
            decoding="async" />
          </div>
          <p className="text-white/50 text-sm text-center mt-4">Cliquez sur l'image pour agrandir</p>
        </div>
      </section>

      {/* ═══ CARACTÉRISTIQUES TECHNIQUES ═══ */}
      <section className="py-20 bg-charcoal-light">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-ivory mb-8">
            Caractéristiques <span className="text-warm">Techniques</span>
          </h2>
          <ul className="space-y-6 text-white/70 leading-relaxed">
            <li className="flex gap-4">
              <span className="shrink-0 w-2 h-2 bg-warm rounded-full mt-2" />
              <div>
                <strong className="text-ivory">Boudins en Dacron :</strong> Les boudins qui protègent la structure gonflable sont réalisés en <strong className="text-ivory">Dacron</strong>, un tissu extrêmement résistant. Disponibles en quatre couleurs (Rouge, Blanc, Bleu et Noir), les boudins peuvent aussi être confectionnés en polyester pour offrir encore plus de choix de couleurs.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="shrink-0 w-2 h-2 bg-warm rounded-full mt-2" />
              <div>
                <strong className="text-ivory">Entoilage en Polyester :</strong> L'entoilage de la tente est en <strong className="text-ivory">polyester</strong> enduit de <strong className="text-ivory">350gr/m²</strong>, offrant une robustesse accrue face aux intempéries.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="shrink-0 w-2 h-2 bg-warm rounded-full mt-2" />
              <div>
                <strong className="text-ivory">Huit coloris</strong> sont disponibles, allant de l'orange au noir, avec des options d'impression sérigraphiée ou par sublimation.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="shrink-0 w-2 h-2 bg-warm rounded-full mt-2" />
              <div>
                <strong className="text-ivory">Valve de surpression :</strong> Chaque boudin dispose d'une <strong className="text-ivory">valve de surpression</strong> pour assurer une sécurité optimale lors de l'utilisation.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="shrink-0 w-2 h-2 bg-warm rounded-full mt-2" />
              <div>
                <strong className="text-ivory">Fermeture éclair YKK :</strong> Nous utilisons exclusivement des fermetures <strong className="text-ivory">YKK</strong>, reconnues pour leur solidité et leur longévité.
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* ═══ POIDS ET MOBILITÉ + PERSONNALISATION ═══ */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Poids et Mobilité */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold text-ivory mb-4">Poids et <span className="text-warm">Mobilité</span></h3>
              <p className="text-white/70 leading-relaxed">
                Poids d'une <strong className="text-ivory">Tente Gonflable 6×6m</strong> : environ <strong className="text-warm text-xl">34 kg</strong>, permettant une manipulation facile sans compromettre la robustesse. Grâce à une structure bien conçue, cette tente est parfaitement adaptée aux installations temporaires en extérieur.
              </p>
            </div>

            {/* Options de Personnalisation */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold text-ivory mb-4">Options de <span className="text-warm">Personnalisation</span></h3>
              <p className="text-white/70 leading-relaxed">
                Les <strong className="text-ivory">Tentes Gonflables V</strong> sont entièrement personnalisables pour répondre aux exigences uniques de votre événement. Que vous ayez besoin d'une couleur spécifique pour correspondre à l'identité de votre marque ou d'un design personnalisé pour une visibilité accrue, nous offrons des solutions sur mesure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONCLUSION + CTA ═══ */}
      <section className="py-16 bg-charcoal-light">
        <div className="container text-center max-w-4xl mx-auto">
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            La <strong className="text-ivory">tente gonflable Hallucine V</strong> est l'option idéale pour vos événements en extérieur. Son <strong className="text-ivory">design en V unique</strong>, sa <strong className="text-ivory">résistance exceptionnelle</strong>, et ses multiples options de <strong className="text-ivory">personnalisation</strong> en font un choix incontournable pour les entreprises et les organisateurs d'événements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demande de prix
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* ═══ LIGHTBOX ═══ */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors" aria-label="Fermer">
            <XIcon className="w-6 h-6" />
          </button>
          <img src={lightbox.src} alt={lightbox.alt} className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} decoding="async" loading="lazy" />
        </div>
      )}

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
