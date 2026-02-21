/*
 * Page Tentes X — Refonte complète
 * Design: sections aérées, alternance fond sombre / cartes claires
 * Contenu complet du site hallucinecran.com + améliorations UX
 */
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import {
  Shield,
  Award,
  Gem,
  Wind,
  Paintbrush,
  Ruler,
  ChevronRight,
  X as XIcon,
  ZoomIn,
  Package,
  Wrench,
  Lightbulb,
  DoorOpen,
  Maximize2,
  Grid3X3,
  ArrowRight,
} from "lucide-react";

/* ─── Données ─── */

const images = [
  {
    src: "https://www.hallucinecran.com/Tentes/Tentes%20X/tente-x.jpg",
    alt: "Tente événementielle gonflable en forme de X, vue de profil, installée en extérieur pour un événement",
    caption: "Vue de profil",
  },
  {
    src: "https://www.hallucinecran.com/Tentes/Tentes%20X/671bade5ef4fb27a93d3034de910dc4.jpg",
    alt: "Vue de face d'une tente gonflable en forme de X avec logo personnalisable sur le toit",
    caption: "Vue de face",
  },
  {
    src: "https://www.hallucinecran.com/Tentes/Tentes%20X/1078c8cca1c101dbe2d41d70cadf4a0.jpg",
    alt: "Plusieurs tentes gonflables en forme de X avec différentes personnalisations de couleur et de logo",
    caption: "Personnalisations multiples",
  },
  {
    src: "https://www.hallucinecran.com/Tentes/xtent-1.jpg",
    alt: "Tente gonflable Hallucine en forme de X noire avec le logo Hallucine en blanc, vue d'ensemble",
    caption: "Modèle Hallucine noir",
  },
];

const tailles = [
  { dim: "3m × 3m", surface: "9 m²", usage: "Stand compact" },
  { dim: "4m × 4m", surface: "16 m²", usage: "Accueil événement" },
  { dim: "5m × 5m", surface: "25 m²", usage: "Espace polyvalent" },
  { dim: "6m × 6m", surface: "36 m²", usage: "Zone VIP" },
  { dim: "7m × 7m", surface: "49 m²", usage: "Grand stand" },
  { dim: "8m × 8m", surface: "64 m²", usage: "Espace majeur" },
];

const specs = [
  {
    icon: Shield,
    label: "Boudins",
    value: "TPU 100% étanches à l'air, protégés par une couche de Dacron haute résistance",
  },
  {
    icon: Package,
    label: "Embase",
    value: "PVC renforcé avec revêtement antidérapant pour une meilleure stabilité",
  },
  {
    icon: Wind,
    label: "Valve",
    value: "Valve de surpression sur chaque boudin pour éviter toute surpression",
  },
  {
    icon: Wrench,
    label: "Couture",
    value: "Double couture avec point zigzag pour garantir la solidité de l'assemblage",
  },
  {
    icon: Ruler,
    label: "Entoilage",
    value: "Polyester enduit 350 gr/m² pour une couverture robuste et résistante",
  },
  {
    icon: Maximize2,
    label: "Bâche latérale",
    value: "Ripstop résistant aux déchirures, idéal pour l'impression numérique",
  },
  {
    icon: Grid3X3,
    label: "Jonction",
    value: "Aluminium — permet de démonter les quatre boudins indépendamment via des profilés en aluminium",
  },
];

const accessoires = [
  { name: "Mur de porte", icon: DoorOpen, desc: "Accès facile avec fermeture zippée" },
  { name: "Mur courbe", icon: Maximize2, desc: "Design arrondi pour une esthétique unique" },
  { name: "Auvent", icon: Package, desc: "Extension couverte pour plus d'espace" },
  { name: "Mur latéral", icon: Shield, desc: "Protection complète contre le vent" },
  { name: "Mur de fenêtre", icon: Grid3X3, desc: "Lumière naturelle avec protection" },
  { name: "Tissu de connexion", icon: ArrowRight, desc: "Reliez plusieurs tentes entre elles" },
  { name: "Sac de transport", icon: Package, desc: "Transport facile et rangement compact" },
  { name: "Sacs de sable", icon: Shield, desc: "Lestage pour stabilité maximale" },
  { name: "Lumière LED", icon: Lightbulb, desc: "Éclairage intégré pour événements nocturnes" },
  { name: "Pompe électrique", icon: Wind, desc: "Gonflage rapide et sans effort" },
  { name: "Pompe manuelle", icon: Wrench, desc: "Solution de secours toujours disponible" },
  { name: "Kit de réparation", icon: Wrench, desc: "Interventions rapides sur le terrain" },
];

const valeurs = [
  {
    icon: Shield,
    title: "Fiabilité",
    text: "La fiabilité est au cœur de notre démarche. Nos structures sont fabriquées avec des matériaux de haute qualité, tels que le Dacron 420 pour les cadres et le tissu Dacron 220 résistant aux intempéries pour les auvents, garantissant ainsi une utilisation prolongée dans diverses conditions climatiques. Chaque élément, du système de gonflage aux sacs de sable assurant la stabilité, est conçu pour offrir une sécurité maximale à chaque installation.",
  },
  {
    icon: Award,
    title: "Expertise",
    text: "Forte de nombreuses années d'expérience, notre équipe possède une expertise reconnue dans le domaine des structures gonflables. Nous comprenons les défis auxquels nos clients peuvent être confrontés, et c'est pourquoi nous offrons des solutions adaptées et innovantes. De la conception à la livraison, en passant par l'installation, nous sommes à vos côtés pour vous garantir un produit qui répond parfaitement à vos besoins.",
  },
  {
    icon: Gem,
    title: "Qualité",
    text: "La qualité est non négociable pour nous. Nos produits sont soumis à des contrôles rigoureux afin de s'assurer qu'ils répondent aux normes les plus strictes. Du tissu pour auvent ultra-résistant aux lumières LED intégrées pour une visibilité accrue, chaque détail est pensé pour offrir une expérience utilisateur optimale. Nos accessoires personnalisables, comme les parois latérales courbes et les murs de porte ou de fenêtre, vous permettent d'adapter votre structure à vos besoins spécifiques tout en conservant une esthétique professionnelle.",
  },
];

/* ─── Composant Lightbox Image ─── */

function ImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Fermer l'image"
      >
        <XIcon className="w-6 h-6" />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-[92vw] max-h-[88vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

/* ─── Page principale ─── */

export default function TentesX() {
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightboxImg({ src, alt });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <img
            src="https://www.hallucinecran.com/Tentes/Tentes%20X/tente-x.jpg"
            alt="Tente gonflable Hallucine X installée en extérieur"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
        </div>

        <div className="container relative z-10 pt-36 pb-24 md:pt-44 md:pb-32">
          <div className="max-w-2xl">
            <p className="text-warm text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Structures gonflables
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Tente Gonflable
              <br />
              <span className="text-warm">en Forme de X</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 font-serif">
              La solution parfaite pour vos événements extérieurs. Pratique, solide et entièrement
              personnalisable, de 3×3m à 8×8m.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contactez-nous"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-warm text-charcoal font-semibold rounded-lg hover:bg-warm-light transition-colors shadow-lg"
              >
                Demander un devis
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href="#galerie"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Voir les photos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INTRODUCTION ═══ */}
      <section className="py-16 md:py-20 bg-charcoal-light">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-6">
              Un design pratique et résistant
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed font-serif">
              La structure de la tente est composée de <strong className="text-ivory">quatre boudins
              indépendants en TPU 100% étanches à l'air</strong>, insérés dans des tubes en Dacron
              résistants. Le Dacron est un tissu hautement résistant utilisé pour les voiles de
              bateau, assurant ainsi une solidité exceptionnelle et une résistance aux déchirures.
              La couverture en <strong className="text-ivory">polyester enduit</strong> est
              personnalisable et facilement démontable, vous permettant de changer rapidement
              l'apparence de votre tente.
            </p>
          </div>

          {/* Points forts en 3 colonnes */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-warm/15 flex items-center justify-center">
                <Wind className="w-5 h-5 text-warm" />
              </div>
              <div>
                <h3 className="text-ivory font-semibold mb-1">Gonflage rapide</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Valve de gonflage et système de surpression sur chaque boudin pour une sécurité
                  maximale et un gonflage en quelques minutes.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-warm/15 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-warm" />
              </div>
              <div>
                <h3 className="text-ivory font-semibold mb-1">Maintenance facile</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Fermetures à glissière sur les tubes en Dacron pour accéder facilement aux boudins
                  et les remplacer si nécessaire.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-warm/15 flex items-center justify-center">
                <Paintbrush className="w-5 h-5 text-warm" />
              </div>
              <div>
                <h3 className="text-ivory font-semibold mb-1">Personnalisation rapide</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Le revêtement extérieur est indépendant de la structure gonflable, vous permettant
                  de modifier le visuel à tout moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GALERIE PHOTOS ═══ */}
      <section id="galerie" className="py-16 md:py-20 bg-background">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-2">Galerie photos</h2>
          <p className="text-white/50 text-sm mb-8">Cliquez sur une image pour l'agrandir</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => openLightbox(img.src, img.alt)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-warm"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-medium">{img.caption}</p>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              </button>
            ))}
          </div>

          {/* Schéma technique éclaté */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-warm/15 flex items-center justify-center">
                <Ruler className="w-4 h-4 text-warm" />
              </div>
              <h3 className="text-xl font-bold text-ivory">Schéma technique éclaté</h3>
            </div>
            <p className="text-white/60 text-sm mb-6">
              Vue détaillée de tous les composants et matériaux de la tente X.
            </p>
            <button
              onClick={() =>
                openLightbox(
                  "https://www.hallucinecran.com/Tentes/x%20tent%20Eclate%20french-1.jpg",
                  "Schéma technique détaillé d'une tente gonflable en forme de X"
                )
              }
              className="group relative w-full max-w-3xl mx-auto block cursor-pointer"
            >
              <img
                src="https://www.hallucinecran.com/Tentes/x%20tent%20Eclate%20french-1.jpg"
                alt="Schéma technique détaillé d'une tente gonflable en forme de X, montrant les différents composants et matériaux"
                className="w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ═══ TAILLES DISPONIBLES ═══ */}
      <section className="py-16 md:py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-2">
            6 tailles disponibles
          </h2>
          <p className="text-white/50 text-sm mb-10">
            De 9 m² à 64 m², chaque taille est disponible avec l'ensemble des options de personnalisation.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tailles.map((t) => (
              <div
                key={t.dim}
                className="group p-5 bg-card border border-border rounded-xl text-center hover:border-warm/50 transition-all duration-300 hover:shadow-lg hover:shadow-warm/5"
              >
                <p className="text-warm font-bold text-xl mb-1">{t.dim}</p>
                <p className="text-ivory/80 text-sm font-medium">{t.surface}</p>
                <div className="w-8 h-px bg-warm/30 mx-auto my-3" />
                <p className="text-white/50 text-xs">{t.usage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CARACTÉRISTIQUES TECHNIQUES ═══ */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-2">
            Caractéristiques techniques
          </h2>
          <p className="text-white/50 text-sm mb-10">
            Matériaux de qualité professionnelle pour une durabilité maximale.
          </p>

          <div className="max-w-4xl space-y-3">
            {specs.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-border transition-colors"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-warm/10 flex items-center justify-center mt-0.5">
                    <Icon className="w-5 h-5 text-warm" />
                  </div>
                  <div>
                    <p className="text-ivory font-semibold text-sm mb-0.5">{s.label}</p>
                    <p className="text-white/60 text-sm leading-relaxed">{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ PERSONNALISATION ═══ */}
      <section className="py-16 md:py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-2">
            Personnalisation complète
          </h2>
          <p className="text-white/60 text-base md:text-lg mb-10 max-w-3xl font-serif leading-relaxed">
            La tente gonflable Hallucine X se distingue par sa capacité de personnalisation
            complète. Que vous souhaitiez afficher votre logo ou un visuel impactant, cette tente
            vous offre de nombreuses possibilités.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
            {[
              {
                icon: Paintbrush,
                title: "Toit personnalisé",
                desc: "La sérigraphie ou l'impression numérique vous permettent de créer des visuels uniques sur le toit de votre tente. Votre marque visible à 360°.",
              },
              {
                icon: Maximize2,
                title: "Rideaux en Ripstop",
                desc: "Imprimez vos visuels en quadrichromie sur les rideaux en Ripstop pour une visibilité maximale et une résistance aux déchirures.",
              },
              {
                icon: Gem,
                title: "Structure colorée",
                desc: "Personnalisez la couleur de la structure gonflable elle-même pour l'adapter à votre thème ou votre marque.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 bg-card border border-border rounded-xl hover:border-warm/30 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-warm/15 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-warm" />
                  </div>
                  <h3 className="text-ivory font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ ACCESSOIRES ═══ */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-2">
            Accessoires et stabilité
          </h2>
          <p className="text-white/60 text-base mb-10 max-w-3xl leading-relaxed">
            Pour garantir la stabilité de votre structure, plusieurs systèmes de lestage sont
            disponibles, notamment des sacs de lestage en sable qui se fixent sous les boudins
            grâce à des sangles solides.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {accessoires.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.name}
                  className="p-4 bg-card/50 border border-border/50 rounded-xl hover:border-warm/30 transition-colors group"
                >
                  <Icon className="w-5 h-5 text-warm/70 group-hover:text-warm transition-colors mb-3" />
                  <p className="text-ivory font-medium text-sm mb-1">{a.name}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CONFIGURATION DES CÔTÉS ═══ */}
      <section className="py-16 md:py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-2">
            Configuration des côtés
          </h2>
          <p className="text-white/60 text-base mb-10 max-w-3xl leading-relaxed">
            Vous pouvez configurer chaque côté de la tente avec différents éléments. Maximum 4
            éléments au total (hors tissus de connexion).
          </p>

          {/* Grille visuelle 2×2 */}
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
              {[
                { side: "Avant", options: "Mur de porte, Mur courbe, Auvent" },
                { side: "Droit", options: "Mur latéral, Porte, Fenêtre, Courbe, Auvent, Connexion" },
                { side: "Gauche", options: "Mur latéral, Porte, Fenêtre, Courbe, Auvent, Connexion" },
                { side: "Arrière", options: "Mur latéral, Porte, Fenêtre, Courbe, Auvent, Connexion" },
              ].map((c) => (
                <div
                  key={c.side}
                  className="p-5 bg-card border border-border rounded-xl"
                >
                  <h3 className="text-warm font-semibold mb-2">Côté {c.side}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">{c.options}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-warm/10 border border-warm/20 rounded-xl">
              <p className="text-white/70 text-xs leading-relaxed">
                <strong className="text-warm">Règles :</strong> Les tailles 3×3 et 4×4 sont
                limitées à 1 mur de porte maximum. Les autres tailles peuvent avoir jusqu'à 2
                murs de porte. Si un côté a un tissu de connexion, ce côté ne peut pas avoir de
                porte ou d'auvent (et vice-versa).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FIABILITÉ · EXPERTISE · QUALITÉ ═══ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-4">
              Fiabilité, Expertise, Qualité
            </h2>
            <p className="text-white/60 text-base max-w-2xl mx-auto leading-relaxed font-serif">
              Chez Hallucine, nous nous engageons à fournir des structures gonflables qui incarnent
              ces trois valeurs fondamentales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {valeurs.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="p-6 md:p-8 bg-card border border-border rounded-xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-warm/15 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-warm" />
                  </div>
                  <h3 className="text-ivory font-bold text-xl mb-3">{v.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ EN RÉSUMÉ ═══ */}
      <section className="py-16 md:py-20 bg-charcoal-light">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-6">En résumé</h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed font-serif mb-8">
              La <strong className="text-ivory">tente gonflable Hallucine X</strong> est la solution
              parfaite pour vos événements extérieurs. Elle combine{" "}
              <strong className="text-ivory">praticité</strong>,{" "}
              <strong className="text-ivory">solidité</strong>, et{" "}
              <strong className="text-ivory">personnalisation</strong> pour offrir une expérience
              unique à vos clients. Légère, résistante et rapide à installer, elle devient un
              véritable outil de communication pour vos manifestations.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-4">
              Intéressé par nos tentes X ?
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Contactez-nous pour un devis personnalisé ou consultez nos tarifs. Notre équipe est
              à votre disposition pour répondre à toutes vos questions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contactez-nous"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-warm text-charcoal font-semibold rounded-lg hover:bg-warm-light transition-colors shadow-lg"
              >
                Nous Contacter
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contactez-nous"
                className="px-8 py-3.5 border border-warm text-warm font-semibold rounded-lg hover:bg-warm/10 transition-colors"
              >
                Demande de prix
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      <ImageLightbox
        src={lightboxImg?.src ?? ""}
        alt={lightboxImg?.alt ?? ""}
        isOpen={lightboxImg !== null}
        onClose={() => setLightboxImg(null)}
      />
    </div>
  );
}
