/*
 * Page Tentes V — Tentes Gonflables en Forme de V
 * Contenu complet du site d'origine hallucinecran.com
 * Design: cinéma vintage — fond sombre, accents dorés
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoLightbox from "@/components/VideoLightbox";
import { Link } from "wouter";
import { Play } from "lucide-react";
import WeatherEffect from "@/components/WeatherEffect";

const tailles = [
  { dim: "4m × 4m", poids: "~25 kg" },
  { dim: "5m × 5m", poids: "~30 kg" },
  { dim: "6m × 6m", poids: "~34 kg" },
];

const specs = [
  { label: "Boudins", value: "TPU recouvert de Dacron, disponible en 4 couleurs (Rouge, Blanc, Bleu, Noir) ou polyester pour plus de choix" },
  { label: "Entoilage", value: "Polyester enduit 350 gr/m², 8 coloris disponibles (orange au noir), impression sérigraphiée ou par sublimation" },
  { label: "Valve", value: "Valve de surpression sur chaque boudin pour une sécurité optimale" },
  { label: "Fermeture", value: "Fermeture éclair YKK, reconnues pour leur solidité et leur longévité" },
  { label: "Poids (6×6m)", value: "Environ 34 kg — manipulation facile sans compromettre la robustesse" },
  { label: "Personnalisation toit", value: "Impression numérique haute qualité pour logos et visuels d'événements" },
  { label: "Personnalisation pieds", value: "Impression sur les pieds de la structure avec couleurs et logos" },
];

const avantages = [
  { title: "Facilité de Montage et Transport", desc: "Chaque tente gonflable V est légère, facile à transporter et rapide à installer grâce à un système de gonflage optimisé." },
  { title: "Structure Renforcée", desc: "Le boudin en TPU recouvert de Dacron assure une robustesse maximale tout en étant facilement remplaçable grâce à une fermeture à glissière. Vous pouvez ainsi réparer rapidement les boudins sans avoir à remplacer l'ensemble de la structure." },
  { title: "Personnalisation Haute Qualité", desc: "Profitez de la personnalisation du toit de votre tente par impression numérique. Que ce soit pour des logos d'entreprise ou des visuels d'événements, vos créations sont fidèlement reproduites pour une visibilité maximale." },
  { title: "Adaptabilité à Tous Types d'Événements", desc: "La tente gonflable V peut être utilisée pour des événements professionnels, publicitaires ou festifs grâce à sa grande capacité et sa stabilité en extérieur." },
];

const applications = [
  { title: "Stands publicitaires", desc: "Mettez en avant votre marque lors d'expositions et d'événements professionnels." },
  { title: "Zones de repos ou d'accueil", desc: "Offrez un abri confortable pour vos invités." },
  { title: "Événements sportifs", desc: "Installez des zones VIP ou des points de ravitaillement." },
  { title: "Festivals et concerts", desc: "Protégez vos équipements ou créez des espaces couverts pour vos activités." },
];

const images = [
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%201.jpg", alt: "Tente gonflable blanche en forme de V, vue de face" },
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%202.jpg", alt: "Tente gonflable blanche en forme de V, vue de côté" },
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%203.jpg", alt: "Tente gonflable blanche en forme de V, vue de trois-quarts" },
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/blanc%204.jpg", alt: "Tente gonflable blanche en forme de V, vue d'ensemble" },
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/15b4c24de8e92b7b9047951a3057fe0.jpg", alt: "Tente gonflable en V personnalisée avec un logo pour un stand d'exposition" },
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/d871ba2388a592607d77921d311069a.jpg", alt: "Tente gonflable en V utilisée comme stand lors d'un événement en extérieur" },
  { src: "https://www.hallucinecran.com/photoset/Tentes%20V/Weixin%20Image_20240530130153.png", alt: "Gros plan sur la structure et les matériaux d'une tente gonflable en V" },
];

export default function TentesV() {
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <WeatherEffect intensity="moderate" />
        <div className="container relative z-10">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Tentes gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Tentes Gonflables en V<br />
            <span className="text-warm">Élégance et Praticité</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed mb-4">
            Les Tentes Gonflables V Hallucine sont des structures innovantes, conçues pour offrir une performance 
            exceptionnelle lors de vos événements. Avec des matériaux de haute qualité et des caractéristiques 
            techniques avancées, ces tentes sont idéales pour les salons, foires, expositions, événements extérieurs et plus encore.
          </p>
          <p className="text-white/50 text-base max-w-3xl leading-relaxed">
            Chez Hallucine, nous vous proposons des tentes gonflables légères, robustes et faciles à utiliser. 
            Avec plus de 30 ans d'expérience dans le matériel événementiel, nous nous engageons à fournir des 
            produits de qualité supérieure adaptés à vos besoins spécifiques.
          </p>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Tentes V en images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-ivory mb-4">Schéma technique éclaté</h3>
            <img src="https://www.hallucinecran.com/photoset/Tentes%20V/eclate%20en%20francais.jpg" alt="Schéma technique détaillé montrant les composants d'une tente gonflable en V" className="w-full max-w-3xl mx-auto rounded" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Pourquoi choisir */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Pourquoi Choisir nos Tentes V ?</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {avantages.map((a, i) => (
              <div key={i} className="flex gap-4 p-6 bg-card border border-border rounded-lg">
                <div className="shrink-0 w-10 h-10 rounded-full bg-warm/20 flex items-center justify-center">
                  <span className="text-warm font-bold">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-ivory font-semibold mb-2">{a.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Points forts du site d'origine */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Design en V unique</h3>
              <p className="text-white/60 text-sm">Une forme moderne qui attire l'œil et donne une touche originale à vos événements.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Installation rapide</h3>
              <p className="text-white/60 text-sm">Gonflage en quelques minutes grâce à un souffleur intégré.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Résistance aux intempéries</h3>
              <p className="text-white/60 text-sm">Matériaux imperméables et durables, adaptés à toutes les conditions météorologiques.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Dimensions Disponibles</h2>
          <p className="text-white/70 mb-8 max-w-3xl leading-relaxed">
            Nos tentes gonflables V sont disponibles en trois tailles adaptées à vos besoins. 
            Chaque modèle est conçu pour offrir un montage rapide, une grande stabilité et une durabilité supérieure, 
            quel que soit l'environnement.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {tailles.map((t) => (
              <div key={t.dim} className="p-6 bg-card border border-border rounded-lg text-center hover:border-warm/40 transition-colors">
                <p className="text-warm font-bold text-2xl mb-2">{t.dim}</p>
                <p className="text-white/60 text-sm">Poids : {t.poids}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Caractéristiques techniques détaillées */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Caractéristiques Techniques</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm max-w-3xl">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-warm font-semibold w-48">{s.label}</td>
                    <td className="py-4 px-4 text-white/70">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Boudins en Dacron</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Les boudins qui protègent la structure gonflable en TPU sont réalisés en Dacron, un tissu extrêmement résistant. 
                Disponibles en quatre couleurs (Rouge, Blanc, Bleu et Noir), les boudins peuvent aussi être confectionnés 
                en polyester pour offrir encore plus de choix de couleurs.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Entoilage en Polyester</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                L'entoilage de la tente gonflable est en polyester enduit de 350gr/m², offrant une robustesse accrue 
                face aux intempéries. Huit coloris sont disponibles, allant de l'orange au noir, 
                avec des options d'impression sérigraphiée ou par sublimation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications idéales */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Applications Idéales</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((app, i) => (
              <div key={i} className="p-6 bg-card border border-border rounded-lg hover:border-warm/40 transition-colors">
                <h3 className="text-warm font-semibold mb-2">{app.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personnalisation */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Options de Personnalisation</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl leading-relaxed">
            Les tentes gonflables V sont entièrement personnalisables pour répondre aux exigences uniques de votre événement. 
            Que vous ayez besoin d'une couleur spécifique pour correspondre à l'identité de votre marque ou d'un design 
            personnalisé pour une visibilité accrue, nous offrons des solutions sur mesure.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Impression toit</h3>
              <p className="text-white/60 text-sm">Impression numérique haute définition sur le toit pour une visibilité maximale.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Impression pieds</h3>
              <p className="text-white/60 text-sm">Personnalisez les pieds de la structure avec vos couleurs et logos.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Choix de couleurs</h3>
              <p className="text-white/60 text-sm">Boudins en Dacron (4 couleurs) ou polyester (large choix). Entoilage en 8 couleurs.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Accessoires</h3>
              <p className="text-white/60 text-sm">Sac de transport, pompes électrique et manuelle, éclairage LED, sacs de lestage et plus encore.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vidéo */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">La tente V en vidéo</h2>
          <p className="text-white/60 mb-8 max-w-2xl">Découvrez le montage et l'utilisation de notre tente gonflable en V.</p>
          <div className="max-w-2xl">
            <div className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer group" onClick={() => setActiveVideo({ id: '-cga1EVZQtg', title: 'Tente gonflable V — Montage' })}>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <img src="https://img.youtube.com/vi/-cga1EVZQtg/hqdefault.jpg" alt="Tutoriel montage tente gonflable en V Hallucine" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
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

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Intéressé par nos tentes V ?</h2>
          <p className="text-white/60 mb-8">Contactez-nous pour un devis personnalisé ou consultez nos tarifs.</p>
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
