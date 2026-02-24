
/*
 * Page Tentes Gonflables X
 * Reproduit fidèlement la page hallucinecran.com/fr/tentes-gonflables-x
 * Mêmes images, même contenu, même structure
 * Design cinéma vintage — fond sombre, accents dorés
 */
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import {
  ChevronLeft,
  ChevronRight,
  X as XIcon,
} from "lucide-react";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

/* ─── Images (identiques à l'ancien site) ─── */

const heroImages = [
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/fHOHtmjSEZCdfvZR.webp", alt: "Tentes gonflables X Meguiar's noires et jaunes de nuit" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/upTjWnEqwNFkSAuN.webp", alt: "Tente gonflable X Hallucine noire avec logo" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/snASjOxpYmvdMRXE.webp", alt: "Tentes gonflables X personnalisées multiples" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ZgESYNaQchclOBaW.webp", alt: "Tente gonflable X Ealing Eagles personnalisée" },
];

const contentImages = {
  tenteCote: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/LyytgyImxlrBebLu.webp",
  tenteFace: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/SUFOlyWxjMBsVhPG.webp",
  tentePerso: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/YDVeZvrXTWvHTZKL.webp",
  tenteNoire: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/BgPeudXkmXMRYjNN.webp",
  schemaEclate: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UvouqdZLPLTjeuhf.webp",
};

/* ─── Mini carousel ─── */
function ImageCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-black/20">
      <img src={images[idx].src} alt={images[idx].alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors" aria-label="Image précédente">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors" aria-label="Image suivante">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === idx ? "bg-warm" : "bg-white/40"}`} aria-label={`Image ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Lightbox ─── */
function ImageLightbox({ src, alt, isOpen, onClose }: { src: string; alt: string; isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Fermer">
        <XIcon className="w-6 h-6" />
      </button>
      <img loading="lazy" src={src} alt={alt} className="max-w-[92vw] max-h-[88vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} decoding="async" />
    </div>
  );
}

/* ─── Page principale ─── */
export default function TentesX() {
  useDocumentMeta("Tente Gonflable X | Tente Événementielle", "Tente gonflable X pour événements. Structure robuste, montage en 10 minutes, personnalisation complète. Idéale pour salons, festivals et promotions.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/TVmrusoKmXcTvkKP.webp");

  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightboxImg({ src, alt });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="tentes-x"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: "Tentes gonflables", url: "https://hallucinecran.fr/tentes-gonflables" },
          { name: "Tentes X", url: "https://hallucinecran.fr/tentes-gonflables-x" },
        ]}
        product={{
          name: "Tente Gonflable X",
          description: "La tente gonflable Hallucine X est la solution parfaite pour vos événements extérieurs. Elle combine praticité, solidité, et personnalisation pour offrir une expérience unique à vos clients.",
          image: heroImages.map(img => img.src),
          url: "https://hallucinecran.fr/tentes-gonflables-x",
          category: "Tentes gonflables",
          minPrice: 1490,
        }}
      />
      <Navbar />

      {/* ═══ HERO : Titre + 4 photos en grille ═══ */}
      <section className="pt-32 pb-12 bg-charcoal-light">
        <div className="container">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory text-center mb-10">
            Tentes événementielles <span className="text-warm">en forme de X</span>
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {heroImages.map((img, i) => (
              <div key={i} className="cursor-pointer overflow-hidden rounded-lg" onClick={() => openLightbox(img.src, img.alt)}>
                <img src={img.src} alt={img.alt} className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTRO — damier : image gauche, texte droite ═══ */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[0].src, heroImages[0].alt)}>
              <img src={heroImages[0].src} alt={heroImages[0].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-4">
                Tente Gonflable Hallucine X:<br />
                <span className="text-warm">L'Allié Parfait de Vos Événements</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Vous cherchez une solution innovante et pratique pour vos événements ? Optez pour la <strong className="text-ivory">tente gonflable Hallucine X</strong>, la solution idéale pour garantir visibilité et confort tout en restant simple à installer et à transporter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ UN DESIGN PRATIQUE ET RÉSISTANT ═══ */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-6">Un Design Pratique et Résistant</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                La <strong className="text-ivory">tente gonflable Hallucine X</strong> est conçue pour être rapide à monter et à démonter, tout en offrant une structure robuste. Elle se compose de <strong className="text-ivory">quatre boudins indépendants en TPU</strong>, une matière étanche et résistante qui garantit une durabilité optimale.
              </p>
              <ul className="space-y-4">
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-warm">Boudins en TPU</strong> : Fabriqués à partir de polyuréthane (TPU), ces boudins sont 100% étanches à l'air, assurant ainsi une performance constante.
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-warm">Structure en Dacron</strong> : Chaque boudin est inséré dans des tubes en Dacron, un matériau hautement résistant utilisé pour les voiles de bateau, assurant ainsi une solidité exceptionnelle et une résistance aux déchirures.
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-warm">Couverture en polyester enduit</strong> : Personnalisable selon vos besoins, elle est facilement démontable, vous permettant de changer rapidement l'apparence de votre tente.
                </li>
              </ul>
            </div>
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[1].src, heroImages[1].alt)}>
              <img src={heroImages[1].src} alt={heroImages[1].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ UN SYSTÈME FIABLE ET FACILE À ENTRETENIR ═══ */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="cursor-pointer order-2 md:order-1" onClick={() => openLightbox(heroImages[2].src, heroImages[2].alt)}>
              <img src={heroImages[2].src} alt={heroImages[2].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-ivory mb-6">Un Système Fiable et Facile à Entretenir</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                La <strong className="text-ivory">tente gonflable X</strong> offre une <strong className="text-ivory">valve de gonflage</strong> et un <strong className="text-ivory">système de surpression</strong> sur chaque boudin pour assurer une sécurité maximale et un gonflage rapide.
              </p>
              <ul className="space-y-4">
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-warm">Facilité de maintenance</strong> : Grâce à des fermetures à glissière sur les tubes en Dacron, vous pouvez facilement accéder aux boudins pour toute opération de réparation ou remplacement.
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-warm">Personnalisation rapide</strong> : Le revêtement extérieur est indépendant de la structure gonflable, vous permettant de modifier facilement le visuel de la tente à tout moment.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ACCESSOIRES ET STABILITÉ ═══ */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-6">Accessoires et Stabilité Optimisés</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Pour garantir la stabilité de votre structure, plusieurs systèmes de lestage sont disponibles, notamment des <strong className="text-ivory">sacs de lestage en sable</strong> qui se fixent sous les boudins grâce à des sangles solides. Ce système permet de maintenir votre tente en place, même par vent fort.
              </p>
              <ul className="space-y-4">
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-warm">Sacs de lestage</strong> : Conçus pour être remplis de sable, ils assurent une stabilité optimale.
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-warm">Jonction en aluminium</strong> : Le nouveau système de jonction en partie haute permet de démonter les quatre boudins indépendamment et de les maintenir solidement grâce à des profilés en aluminium.
                </li>
              </ul>
            </div>
            <div className="cursor-pointer" onClick={() => openLightbox(heroImages[3].src, heroImages[3].alt)}>
              <img src={heroImages[3].src} alt={heroImages[3].alt} className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PERSONNALISATION COMPLÈTE ═══ */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="cursor-pointer order-2 md:order-1" onClick={() => openLightbox(contentImages.tentePerso, "Tentes gonflables X personnalisées")}>
              <img src={contentImages.tentePerso} alt="Tentes gonflables X personnalisées avec différentes couleurs et logos" className="w-full rounded-lg shadow-lg hover:scale-[1.02] transition-transform" loading="lazy" decoding="async" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-ivory mb-6">Personnalisation Complète</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                La <strong className="text-ivory">tente gonflable Hallucine X</strong> se distingue par sa capacité de personnalisation complète. Que vous souhaitiez afficher votre logo ou un visuel impactant, cette tente vous offre de nombreuses possibilités.
              </p>
              <ul className="space-y-4">
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-warm">Toit personnalisé</strong> : La sérigraphie ou l'impression numérique vous permettent de créer des visuels uniques.
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-warm">Rideaux en Ripstop</strong> : Imprimez vos visuels en quadrichromie sur les rideaux en Ripstop pour une visibilité maximale.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CARACTÉRISTIQUES TECHNIQUES ═══ */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8 text-center">Caractéristiques Techniques</h2>
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4">
              <li className="flex gap-3 items-start p-4 bg-card border border-border rounded-lg">
                <span className="text-warm font-bold shrink-0">•</span>
                <p className="text-white/70"><strong className="text-ivory">Boudins en TPU</strong> : Protégés par une couche de Dacron pour plus de résistance.</p>
              </li>
              <li className="flex gap-3 items-start p-4 bg-card border border-border rounded-lg">
                <span className="text-warm font-bold shrink-0">•</span>
                <p className="text-white/70"><strong className="text-ivory">Embase en PVC renforcé</strong> : Avec un revêtement antidérapant pour une meilleure stabilité.</p>
              </li>
              <li className="flex gap-3 items-start p-4 bg-card border border-border rounded-lg">
                <span className="text-warm font-bold shrink-0">•</span>
                <p className="text-white/70"><strong className="text-ivory">Valve de surpression</strong> : Sur chaque boudin pour éviter toute surpression.</p>
              </li>
              <li className="flex gap-3 items-start p-4 bg-card border border-border rounded-lg">
                <span className="text-warm font-bold shrink-0">•</span>
                <p className="text-white/70"><strong className="text-ivory">Couture renforcée</strong> : Double couture avec point zigzag pour garantir la solidité de l'assemblage.</p>
              </li>
              <li className="flex gap-3 items-start p-4 bg-card border border-border rounded-lg">
                <span className="text-warm font-bold shrink-0">•</span>
                <p className="text-white/70"><strong className="text-ivory">Entoilage en polyester enduit</strong> : 350gr/m² pour une couverture robuste et résistante.</p>
              </li>
              <li className="flex gap-3 items-start p-4 bg-card border border-border rounded-lg">
                <span className="text-warm font-bold shrink-0">•</span>
                <p className="text-white/70"><strong className="text-ivory">Bâche latérale en Ripstop</strong> : Idéale pour l'impression numérique.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ FIABILITÉ, EXPERTISE, QUALITÉ ═══ */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4 text-center">
            Fiabilité, Expertise, Qualité
          </h2>
          <p className="text-white/60 text-center mb-10 max-w-2xl mx-auto">
            Les Fondements de Nos Structures Gonflables
          </p>
          <p className="text-white/70 leading-relaxed max-w-4xl mx-auto mb-10 text-center">
            Chez Hallucine, nous nous engageons à fournir des structures gonflables qui incarnent les valeurs de <strong className="text-ivory">fiabilité</strong>, d'<strong className="text-ivory">expertise</strong>, et de <strong className="text-ivory">qualité</strong>. Conçus pour répondre aux attentes les plus élevées, nos produits vous offrent la tranquillité d'esprit lors de chaque utilisation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-warm font-bold text-xl mb-3">Fiabilité</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                La fiabilité est au cœur de notre démarche. Nos structures sont fabriquées avec des matériaux de haute qualité, tels que le Dacron 420 pour les cadres et le tissu Dacron 220 résistant aux intempéries pour les auvents, garantissant ainsi une utilisation prolongée dans diverses conditions climatiques.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-warm font-bold text-xl mb-3">Expertise</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Forte de nombreuses années d'expérience, notre équipe possède une expertise reconnue dans le domaine des structures gonflables. Nous comprenons les défis auxquels nos clients peuvent être confrontés, et c'est pourquoi nous offrons des solutions adaptées et innovantes.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-warm font-bold text-xl mb-3">Qualité</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                La qualité est non négociable pour nous. Nos produits sont soumis à des contrôles rigoureux afin de s'assurer qu'ils répondent aux normes les plus strictes. Du tissu pour auvent ultra-résistant aux lumières LED intégrées, chaque détail est pensé pour offrir une expérience utilisateur optimale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EN RÉSUMÉ ═══ */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-ivory mb-6">En Résumé</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              La <strong className="text-ivory">tente gonflable Hallucine X</strong> est la solution parfaite pour vos événements extérieurs. Elle combine <strong className="text-ivory">praticité</strong>, <strong className="text-ivory">solidité</strong>, et <strong className="text-ivory">personnalisation</strong> pour offrir une expérience unique à vos clients. Légère, résistante et rapide à installer, elle devient un véritable outil de communication pour vos manifestations.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ INFOS CONTACT ═══ */}
      <section className="py-8 bg-background">
        <div className="container text-center">
          <p className="text-white/60 text-sm">
            Mail : <a href="mailto:contact@hallucine.fr" className="text-warm hover:underline">contact@hallucine.fr</a>
            {" / "}Mobile : <a href="tel:+33680147694" className="text-warm hover:underline">+33 6 80 14 76 94</a>
            {" / "}Tel : <a href="tel:+33458212010" className="text-warm hover:underline">+33 4 58 21 20 10</a>
            {" / "}WhatsApp : <a href="https://wa.me/33680147694" className="text-warm hover:underline">+33 6 80 14 76 94</a>
          </p>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Intéressé par nos tentes X ?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Contactez-nous pour un devis personnalisé. Notre équipe est à votre disposition pour répondre à toutes vos questions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demande de prix
            </Link>
            <BrochureDownloadButton productSlug="tente-x" productName="Tente X" variant="compact" />
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
