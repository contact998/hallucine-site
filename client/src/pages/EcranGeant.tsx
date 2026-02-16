/*
 * Page Écran Gonflable Géant (soufflerie)
 * Contenu complet aligné sur le site de référence hallucinecran.com
 * Specs techniques, montage simplifié, avantages, applications, CTA, vidéos
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmCountdown from "@/components/FilmCountdown";
import { Link } from "wouter";
import { Wind, Clock, Shield, Feather, Users, ArrowRight, Film, Trophy, Music, Presentation, CheckCircle, Phone, Mail } from "lucide-react";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";

const specsData = [
  { taille: "8m × 6m", toile: "7m × 5m", poids: "35 kg", montage: "30 min", personnes: "1" },
  { taille: "10m × 7m", toile: "9m × 6m", poids: "50 kg", montage: "30 min", personnes: "1" },
  { taille: "13m × 8m", toile: "12m × 6,5m", poids: "80 kg", montage: "30 min", personnes: "1" },
  { taille: "15m × 10m", toile: "14m × 8m", poids: "110 kg", montage: "1h", personnes: "2" },
  { taille: "17m × 12m", toile: "15m × 10m", poids: "180 kg", montage: "1h", personnes: "3" },
  { taille: "20m × 14m", toile: "18m × 12m", poids: "220 kg", montage: "1h", personnes: "4" },
  { taille: "24m × 14m", toile: "22m × 12m", poids: "280 kg", montage: "1h", personnes: "4" },
];

const avantages = [
  { icon: Feather, title: "Légèreté inégalée", desc: "Les plus légers au monde, faciles à transporter. Nos écrans sont jusqu'à 3× plus légers que la concurrence grâce à notre technologie de tissu airbag brevetée." },
  { icon: Clock, title: "Installation rapide", desc: "Gonflage en quelques minutes avec souffleur permanent. Un seul opérateur suffit pour les modèles jusqu'à 13m." },
  { icon: Shield, title: "Résistance exceptionnelle", desc: "Conçus pour résister aux intempéries et aux terrains irréguliers. Tissu airbag haute résistance, coutures renforcées." },
  { icon: Wind, title: "Garantie 10 ans", desc: "Investissez en toute confiance dans un équipement fiable et durable. Preuve de notre confiance dans la qualité de nos matériaux." },
  { icon: Users, title: "Polyvalence", desc: "Convient à une variété d'événements extérieurs, du cinéma en plein air aux rassemblements sportifs, festivals et conférences." },
];

const galleryImages = [
  { src: "https://www.hallucinecran.com/Giant%20Inf/1.webp", alt: "Écran de cinéma géant gonflable installé en plein centre-ville de Paris" },
  { src: "https://www.hallucinecran.com/Products/21.PNG", alt: "Écran de cinéma géant gonflable de 17m sur 12m installé au Château de Vincennes" },
  { src: "https://www.hallucinecran.com/Products/ecran-geant-gonflable-24x15-metres.PNG", alt: "Écran de cinéma géant gonflable de 24m sur 15m au Stade Vélodrome de Marseille" },
  { src: "https://www.hallucinecran.com/Products/23.PNG", alt: "Écran géant gonflable publicitaire pour la compagnie aérienne Air Tahiti Nui" },
  { src: "https://www.hallucinecran.com/Products/24.PNG", alt: "Écran de cinéma géant gonflable sur la pelouse du stade Orange Vélodrome à Marseille" },
  { src: "https://www.hallucinecran.com/Gallery/46.webp", alt: "Écran géant gonflable utilisé lors d'un concert de musique classique en plein air" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/4.webp", alt: "Projection de film sur un écran géant gonflable installé sur le pont d'un bateau de croisière" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/6.webp", alt: "Spectacle nocturne avec trois écrans géants gonflables et feu d'artifice en arrière-plan" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/8.webp", alt: "Trois écrans de cinéma géants gonflables installés en plein air au coucher du soleil" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/9.webp", alt: "Démonstration du montage facile d'un écran géant gonflable par une équipe de trois personnes" },
  { src: "https://www.hallucinecran.com/Giant%20Inf/10.webp", alt: "Vue depuis les gradins de l'écran géant gonflable au stade Vélodrome Orange de Marseille" },
  { src: "https://www.hallucinecran.com/Gallery/37.webp", alt: "Écran géant gonflable lors d'un événement en plein air organisé par Canal+" },
];

export default function EcranGeant() {
  const [showCountdown, setShowCountdown] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showCountdown && <FilmCountdown onComplete={() => setShowCountdown(false)} />}
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Écrans gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Écrans Gonflables Géants<br />
            <span className="text-warm">Pour Vos Projections Extérieures</span>
          </h1>
          <h2 className="text-xl md:text-2xl text-ivory/80 font-medium mb-6">
            Des Écrans Géants Adaptés à Tous Vos Événements
          </h2>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed mb-4">
            Transformez vos événements en plein air grâce à nos écrans gonflables géants, disponibles 
            dans des tailles allant de <strong className="text-ivory">8 à 30 mètres</strong>.
          </p>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed mb-8">
            Pour des projections de films, des événements sportifs ou des festivals, nos écrans allient 
            <strong className="text-warm"> légèreté</strong>, <strong className="text-warm">durabilité</strong> et <strong className="text-warm">facilité d'installation</strong>.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/tarifs-ecran-gonflable" className="inline-flex items-center gap-2 px-6 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-all">
              Demander un devis <ArrowRight className="w-4 h-4" />
            </Link>
            <BrochureDownloadButton productSlug="ecran-soufflerie" productName="Écran Soufflerie" />
          </div>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Nos écrans géants en images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Montage simplifié — NOUVEAU */}
      <section className="py-20 bg-charcoal-light relative overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-6">
                <span className="text-warm">Découvrez le montage simplifié</span><br />
                de l'écran à soufflerie 10m
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Grâce à son système tout-en-un, cet écran innovant révolutionne l'installation 
                pour vos événements extérieurs. Livré avec un sac intégré, il se déploie 
                automatiquement une fois branché à la soufflerie, permettant à <strong className="text-ivory">une seule 
                personne</strong> de l'installer en seulement <strong className="text-warm">30 minutes</strong>.
              </p>

              <h3 className="text-warm font-semibold text-lg mb-4">Points forts :</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-warm mt-0.5 shrink-0" />
                  <div>
                    <span className="text-ivory font-medium">Praticité :</span>
                    <span className="text-white/60 ml-1">Sac et écran reliés pour un montage ultra-rapide.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-warm mt-0.5 shrink-0" />
                  <div>
                    <span className="text-ivory font-medium">Polyvalence :</span>
                    <span className="text-white/60 ml-1">Conçu pour des projections, festivals, ou événements itinérants.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-warm mt-0.5 shrink-0" />
                  <div>
                    <span className="text-ivory font-medium">Efficacité :</span>
                    <span className="text-white/60 ml-1">Parfait pour le cinéma en plein air et les grands rassemblements.</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-card border border-warm/20 rounded-lg">
                <h4 className="text-warm font-semibold mb-2">Applications idéales :</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Projections publiques, festivals, ou tout événement nécessitant un écran 
                  grand format rapide à installer.
                </p>
              </div>
            </div>

            {/* Vidéo montage 10m */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/bAxDUrxFUXw"
                  title="Montage écran soufflerie 10m"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="text-ivory font-semibold">Tutoriel vidéo : Montage écran soufflerie 10m</h3>
                <p className="text-white/60 text-sm mt-1">Tutoriel complet pour le montage d'un écran gonflable à soufflerie de 10 mètres.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 icônes — Les plus légers / Garantie / Souffleur */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <img src="https://www.hallucinecran.com/Accessories/4-removebg-preview%20-1-.png" alt="Icône écran gonflable le plus léger du monde par Hallucine" className="w-20 h-20 object-contain mx-auto mb-3" />
              <p className="text-ivory font-semibold">Les plus légers du monde</p>
            </div>
            <div>
              <img src="https://www.hallucinecran.com/Accessories/5-removebg-preview.png" alt="Icône garantie 10 ans sur les écrans gonflables Hallucine" className="w-20 h-20 object-contain mx-auto mb-3" />
              <p className="text-ivory font-semibold">Avec 10 ans de garantie</p>
            </div>
            <div>
              <img src="https://www.hallucinecran.com/Accessories/6-removebg-preview.png" alt="Icône souffleur permanent pour écrans gonflables Hallucine" className="w-20 h-20 object-contain mx-auto mb-3" />
              <p className="text-ivory font-semibold">(avec souffleur permanent)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-12">Avantages de Nos Écrans Gonflables Géants</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {avantages.map((a) => (
              <div key={a.title} className="p-6 bg-card border border-border rounded-lg card-hover">
                <a.icon className="w-8 h-8 text-warm mb-4" />
                <h3 className="text-lg font-semibold text-ivory mb-2">{a.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tableau specs */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Guide des Tailles et Spécifications Techniques</h2>
          <p className="text-white/60 mb-8">7 tailles disponibles, de 8m à 24m de large</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">Taille globale (m)</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Écran de projection (m)</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Poids (kg)</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Temps d'assemblage</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Personnes nécessaires</th>
                </tr>
              </thead>
              <tbody>
                {specsData.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-4 px-3 text-ivory font-medium">{row.taille}</td>
                    <td className="py-4 px-3 text-white/70">{row.toile}</td>
                    <td className="py-4 px-3 text-white/70">{row.poids}</td>
                    <td className="py-4 px-3 text-white/70">{row.montage}</td>
                    <td className="py-4 px-3 text-white/70">{row.personnes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Contact sous le tableau — NOUVEAU */}
          <div className="mt-8 p-6 bg-card border border-warm/20 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <p className="text-ivory font-medium">Besoin d'informations ?</p>
            <a href="mailto:contact@hallucine.fr" className="flex items-center gap-2 text-warm hover:text-warm-light transition-colors">
              <Mail className="w-4 h-4" />
              contact@hallucine.fr
            </a>
            <a href="tel:+33458212010" className="flex items-center gap-2 text-warm hover:text-warm-light transition-colors">
              <Phone className="w-4 h-4" />
              +33 4 58 21 20 10
            </a>
          </div>
        </div>
      </section>

      {/* Section vidéo installation 24m — NOUVEAU */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Vidéo démontage */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/sHeVec7oZfQ"
                  title="Démontage écran soufflerie"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="text-ivory font-semibold">Démontage écran soufflerie</h3>
                <p className="text-white/60 text-sm mt-1">Comment démonter et ranger votre écran gonflable en toute simplicité.</p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-6">
                <span className="text-warm">Découvrez l'Installation Facile</span><br />
                en Vidéo
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                Découvrez comment installer un écran gonflable géant de <strong className="text-warm">24 mètres</strong> sans effort !
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                Installation rapide, pas besoin d'engin de levage ou d'une grande équipe. 
                Nos écrans sont conçus pour être déployés facilement, même dans les conditions 
                les plus exigeantes.
              </p>
              <Link href="/mode-emploi" className="text-warm hover:underline font-medium inline-flex items-center gap-2">
                Voir le mode d'emploi complet <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Vous organisez un événement ? */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-4">Vous organisez un événement ?</h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Obtenez des solutions gonflables sur mesure pour votre événement en plein air. 
            Contactez-nous, demandez un devis rapide ou découvrez nos tarifs compétitifs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/tarifs-ecran-gonflable" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demander un Devis
            </Link>
            <Link href="/tarifs-ecran-gonflable" className="px-8 py-3 border border-white/20 text-ivory font-semibold rounded hover:bg-white/5 transition-colors">
              Voir Nos Tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* Applications et Usages */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Applications et Usages</h2>
          <p className="text-white/60 mb-10 max-w-2xl">Nos écrans gonflables géants sont idéaux pour :</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Film, title: "Ciné-parcs", desc: "Offrez une expérience cinéma unique en plein air. Créez des drive-in avec nos écrans géants, visibles depuis les véhicules." },
              { icon: Trophy, title: "Événements sportifs", desc: "Diffusez des matchs en grand format. Retransmettez compétitions et événements pour vos fans et supporters." },
              { icon: Music, title: "Festivals", desc: "Attirez les foules avec des projections géantes. Films, concerts visuels, spectacles — nos écrans s'adaptent à tous les formats." },
              { icon: Presentation, title: "Conférences et séminaires", desc: "Donnez une visibilité accrue à vos présentations. Lancements de produits, séminaires corporate en extérieur." },
            ].map((app) => (
              <div key={app.title} className="p-6 bg-card border border-border rounded-lg card-hover">
                <app.icon className="w-8 h-8 text-warm mb-4" />
                <h3 className="text-ivory font-semibold mb-2">{app.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi Choisir Hallucine */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Pourquoi Choisir Hallucine ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Expérience éprouvée</h3>
              <p className="text-white/60 text-sm leading-relaxed">Plus de 30 ans à concevoir des solutions gonflables. Plus de 1000 écrans vendus dans le monde entier.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Service clé en main</h3>
              <p className="text-white/60 text-sm leading-relaxed">De la conception à l'installation, nous vous accompagnons. Conseil technique, personnalisation, logistique internationale.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Produits personnalisables</h3>
              <p className="text-white/60 text-sm leading-relaxed">Ajoutez des logos ou des visuels spécifiques. Chaque écran peut être adapté à vos besoins : dimensions sur mesure, impression personnalisée.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
