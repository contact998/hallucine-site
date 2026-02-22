/*
 * Page Tentes Gonflables N
 * Reproduit fidèlement la page hallucinecran.com/fr/tentes-gonflables-n
 * Mêmes images, même contenu, même structure
 * Design cinéma vintage — fond sombre, accents dorés
 */
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { X as XIcon } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

/* ─── Images hero (grille identique à l'ancien site) ─── */
const heroImages = [
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/eZVHaksoPSdOKbyX.jpg", alt: "Tente gonflable N Hallucine blanche dans la neige" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vvfgDxjiqpyUexFX.jpg", alt: "Tente gonflable N Volvo Discover dans la neige" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/EqoWvWzoAbpjQAoZ.jpg", alt: "Tente gonflable N blanche grande vue latérale" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/qzswpRtwfebgxLHb.jpg", alt: "Tente gonflable N Croix-Rouge verte" },
];

/* ─── Image contenu ─── */
const contentImages = {
  tenteVolvo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vvfgDxjiqpyUexFX.jpg",
  schemaEclate: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UJADgFBXuANKFjRn.jpg",
};

export default function TentesN() {
  useDocumentMeta("Tente Gonflable N | Tente Humanitaire et Événementielle", "Tente gonflable N polyvalente. Utilisée par la Croix-Rouge et pour événements. Grande surface couverte, montage rapide, résistante.");

  /* ─── Lightbox ─── */
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const openLightbox = useCallback((src: string, alt: string) => setLightbox({ src, alt }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ═══ HERO — titre + grille 4 photos ═══ */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Tentes gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-10">
            Tentes en forme de N
          </h1>

          {/* Grille photos : 4 côte à côte */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {heroImages.map((img, i) => (
              <div key={i} className="cursor-pointer rounded-lg overflow-hidden aspect-[4/3]" onClick={() => openLightbox(img.src, img.alt)}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTRO TEXTE CENTRÉ ═══ */}
      <section className="py-16 bg-background">
        <div className="container text-center max-w-4xl mx-auto">
          <p className="text-white/70 text-lg leading-relaxed mb-6">
            Découvrez la <strong className="text-ivory">tente gonflable Hallucine N</strong>, un modèle unique qui allie <strong className="text-ivory">design original</strong>, <strong className="text-ivory">résistance maximale</strong> et <strong className="text-ivory">personnalisation complète</strong>. Idéale pour tous types d'événements extérieurs, cette tente vous permet de vous démarquer tout en offrant une solution pratique et fiable.
          </p>
          <h2 className="text-2xl font-bold text-warm mb-4">Fiabilité, Expertise, Qualité : Les Fondements de Nos Structures Gonflables</h2>
          <p className="text-white/60 leading-relaxed">
            Chez Hallucine, nous nous engageons à fournir des structures gonflables qui incarnent les valeurs de <strong className="text-ivory">fiabilité</strong>, d'<strong className="text-ivory">expertise</strong>, et de <strong className="text-ivory">qualité</strong>. Conçus pour répondre aux attentes les plus élevées, nos produits vous offrent la tranquillité d'esprit lors de chaque utilisation.
          </p>
        </div>
      </section>

      {/* ═══ DAMIER 1 — image gauche, texte droite : Ultra-Résistante ═══ */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[0].src, heroImages[0].alt)}>
              <img src={heroImages[0].src} alt={heroImages[0].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-4">
                Une Tente Gonflable<br />
                <span className="text-warm">Ultra-Résistante</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                La <strong className="text-ivory">tente gonflable N</strong> est conçue pour résister aux conditions les plus extrêmes. Fabriquée avec des matériaux de haute qualité, elle offre une <strong className="text-ivory">étanchéité parfaite</strong> et une <strong className="text-ivory">longévité exceptionnelle</strong>, même lors de vos événements en extérieur.
              </p>
              <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
                <li>
                  <strong className="text-warm">Chambre étanche en polyuréthane</strong> : La structure interne de la tente est fabriquée en polyuréthane (TPU), assurant une <strong className="text-ivory">autonomie de 60 jours</strong> une fois gonflée. Cette chambre garantit une performance stable sur une période prolongée, idéale pour les événements à long terme.
                </li>
                <li>
                  <strong className="text-warm">Fermetures zippées double face</strong> : Permettent une installation rapide et sécurisée des murs ou de l'auvent de la tente, facilitant ainsi son montage.
                </li>
                <li>
                  <strong className="text-warm">Toit en polyester hydrofuge</strong> : Le toit est conçu avec un tissu hydrofuge de haute qualité, offrant une excellente résistance aux intempéries tout en maintenant une <strong className="text-ivory">étanchéité parfaite</strong>.
                </li>
                <li>
                  <strong className="text-warm">Toile de parachute renforcée</strong> : La toile de parachute utilisée pour le toit renforce la résistance à l'eau et aux déchirures.
                </li>
                <li>
                  <strong className="text-warm">Double peau en polyuréthane Oxford</strong> : Ce matériau ignifugé assure non seulement la sécurité en cas de feu, mais également une protection supplémentaire contre l'humidité et les conditions climatiques difficiles.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DAMIER 2 — texte gauche, image droite : Qualité ═══ */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-4">
                <span className="text-warm">Qualité</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                La qualité est non négociable pour nous. Nos produits sont soumis à des contrôles rigoureux afin de s'assurer qu'ils répondent aux normes les plus strictes. Du <strong className="text-ivory">tissu pour auvent</strong> ultra-résistant aux <strong className="text-ivory">lumières LED intégrées</strong> pour une visibilité accrue, chaque détail est pensé pour offrir une expérience utilisateur optimale. Nos <strong className="text-ivory">accessoires personnalisables</strong>, comme les <strong className="text-ivory">parois latérales courbes</strong> et les <strong className="text-ivory">murs de porte ou de fenêtre</strong>, vous permettent d'adapter votre structure à vos besoins spécifiques tout en conservant une esthétique professionnelle.
              </p>
            </div>
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[1].src, heroImages[1].alt)}>
              <img src={heroImages[1].src} alt={heroImages[1].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DAMIER 3 — image gauche, texte droite : Personnalisation ═══ */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[2].src, heroImages[2].alt)}>
              <img src={heroImages[2].src} alt={heroImages[2].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-4">
                Personnalisation Totale pour<br />
                <span className="text-warm">Une Visibilité Maximale</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                La <strong className="text-ivory">tente gonflable Hallucine N</strong> est 100% personnalisable pour refléter parfaitement l'image de votre marque ou l'ambiance de votre événement.
              </p>
              <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
                <li>
                  <strong className="text-warm">Toit, murs et entrée personnalisables</strong> : Choisissez les couleurs et le design que vous souhaitez pour chaque partie de la tente.
                </li>
                <li>
                  <strong className="text-warm">Couleur de la structure</strong> : Personnalisez également la couleur de la structure gonflable pour l'adapter à votre thème.
                </li>
                <li>
                  <strong className="text-warm">Impression numérique</strong> : Vous pouvez imprimer des logos, des visuels ou des messages publicitaires sur toutes les surfaces de la tente, maximisant ainsi sa visibilité pendant votre événement.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DAMIER 4 — texte gauche, image droite : Transport ═══ */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-4">
                Une Tente Facile à<br />
                <span className="text-warm">Transporter et À Installer</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                La <strong className="text-ivory">tente gonflable Hallucine N</strong> est non seulement robuste, mais aussi très <strong className="text-ivory">pratique à transporter</strong> et à installer. Sa légèreté et ses accessoires inclus font d'elle une solution idéale pour vos événements extérieurs.
              </p>
              <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
                <li>
                  <strong className="text-warm">Légère et facile à transporter</strong> : Malgré sa grande taille, la tente reste relativement légère et se plie facilement pour un transport simplifié. Elle est livrée dans un <strong className="text-ivory">sac de transport</strong> adapté.
                </li>
                <li>
                  <strong className="text-warm">Sac de lestage en sable</strong> : Pour assurer la stabilité de la tente, un <strong className="text-ivory">système de lestage en sable</strong> est inclus. Il se place sous la tente et se fixe solidement grâce à des sangles.
                </li>
                <li>
                  <strong className="text-warm">Pompe à main ou électrique</strong> : Pour un gonflage rapide, la tente est équipée d'une pompe manuelle ou électrique, ce qui facilite grandement l'installation.
                </li>
              </ul>
            </div>
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[3].src, heroImages[3].alt)}>
              <img src={heroImages[3].src} alt={heroImages[3].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DAMIER 5 — Caractéristiques techniques + schéma éclaté ═══ */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="cursor-pointer" onClick={() => openLightbox(contentImages.schemaEclate, "Schéma éclaté des éléments techniques de la tente N")}>
              <img src={contentImages.schemaEclate} alt="Schéma éclaté des éléments techniques de la tente gonflable N" className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-6">
                Caractéristiques Techniques<br />
                <span className="text-warm">de la Tente Gonflable N</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                La fiabilité est au cœur de notre démarche. Nos structures sont fabriquées avec des <strong className="text-ivory">matériaux de haute qualité</strong>, tels que le <strong className="text-ivory">Dacron 420</strong> pour les cadres et le <strong className="text-ivory">tissu Dacron 220 résistant aux intempéries</strong> pour les auvents, garantissant ainsi une utilisation prolongée dans diverses conditions climatiques. Chaque élément, du <strong className="text-ivory">système de gonflage</strong> aux <strong className="text-ivory">sacs de sable</strong> assurant la stabilité, est conçu pour offrir une sécurité maximale à chaque installation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONCLUSION + CTA ═══ */}
      <section className="py-16 bg-charcoal-light">
        <div className="container text-center max-w-4xl mx-auto">
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            La <strong className="text-ivory">tente gonflable Hallucine N</strong> est l'option parfaite pour vos événements en extérieur. Son <strong className="text-ivory">design innovant</strong>, sa <strong className="text-ivory">résistance exceptionnelle</strong>, et ses multiples options de <strong className="text-ivory">personnalisation</strong> en font un choix incontournable pour les entreprises et les organisateurs d'événements. Facile à installer et à transporter, elle assure une <strong className="text-ivory">protection optimale</strong> contre les intempéries tout en offrant une <strong className="text-ivory">visibilité maximale</strong> pour vos messages et logos.
          </p>
          <p className="text-white/60 leading-relaxed mb-10">
            Forte de nombreuses années d'expérience, notre équipe possède une expertise reconnue dans le domaine des structures gonflables. Nous comprenons les défis auxquels nos clients peuvent être confrontés, et c'est pourquoi nous offrons des solutions adaptées et innovantes. De la conception à la livraison, en passant par l'installation, nous sommes à vos côtés pour vous garantir un produit qui répond parfaitement à vos besoins.
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
          <img src={lightbox.src} alt={lightbox.alt} className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
