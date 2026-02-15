/*
 * Page Écran Gonflable Géant (soufflerie)
 * Specs techniques complètes, tarifs, avantages, CTA
 * Données exactes du site de référence
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmCountdown from "@/components/FilmCountdown";
import { Link } from "wouter";
import { Wind, Clock, Shield, Feather, Users, ArrowRight } from "lucide-react";

const specsData = [
  { taille: "8m × 6m", toile: "7m × 5m", poids: "35 kg", hauteur: "—", montage: "30 min", personnes: "1" },
  { taille: "10m × 7m", toile: "9m × 6m", poids: "50 kg", hauteur: "160 cm", montage: "30 min", personnes: "1" },
  { taille: "10,32m × 7,90m", toile: "9m × 5m", poids: "60 kg", hauteur: "220 cm", montage: "30 min", personnes: "1" },
  { taille: "13m × 8m", toile: "12m × 6,5m", poids: "80 kg", hauteur: "—", montage: "30 min", personnes: "2" },
  { taille: "14m × 9m", toile: "13m × 7m", poids: "90 kg", hauteur: "—", montage: "45 min", personnes: "2" },
  { taille: "15m × 10m", toile: "14m × 8m", poids: "110 kg", hauteur: "—", montage: "45 min", personnes: "2" },
  { taille: "17m × 12m", toile: "15m × 10m", poids: "180 kg", hauteur: "—", montage: "1h", personnes: "3" },
  { taille: "20m × 14m", toile: "18m × 12m", poids: "220 kg", hauteur: "—", montage: "1h15", personnes: "3" },
  { taille: "24m × 14m", toile: "22m × 12m", poids: "280 kg", hauteur: "—", montage: "1h30", personnes: "4" },
];

const avantages = [
  { icon: Feather, title: "Les plus légers du monde", desc: "Nos écrans sont jusqu'à 3× plus légers que la concurrence grâce à notre technologie de tissu airbag brevetée." },
  { icon: Clock, title: "Installation rapide", desc: "Montage en moins de 30 minutes pour les modèles jusqu'à 13m. Un seul opérateur suffit pour les petites tailles." },
  { icon: Shield, title: "Garantie 10 ans", desc: "Nous garantissons nos écrans pendant 10 ans, preuve de notre confiance dans la qualité de nos matériaux." },
  { icon: Wind, title: "Souffleur permanent", desc: "Le souffleur maintient l'écran gonflé en permanence, assurant une toile parfaitement tendue pour une image optimale." },
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
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Des écrans géants adaptés à tous vos événements. Disponibles en tailles allant de 8 à 24 mètres, 
            nos écrans à soufflerie sont conçus pour des projections de films, événements sportifs, festivals 
            et toute occasion nécessitant un écran grand format en extérieur.
          </p>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Nos écrans géants en images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { src: "https://www.hallucinecran.com/Giant%20Inf/1.webp", alt: "Écran géant gonflable centre-ville de Paris" },
              { src: "https://www.hallucinecran.com/Products/21.PNG", alt: "Écran géant gonflable au château de Vincennes" },
              { src: "https://www.hallucinecran.com/Products/ecran-geant-gonflable-24x15-metres.PNG", alt: "Écran géant gonflable 24×15m au stade Vélodrome" },
              { src: "https://www.hallucinecran.com/Products/23.PNG", alt: "Écran géant gonflable Air Tahiti Nui" },
              { src: "https://www.hallucinecran.com/Products/24.PNG", alt: "Écran géant gonflable Orange Vélodrome Marseille" },
              { src: "https://www.hallucinecran.com/Gallery/46.webp", alt: "Écran géant pour concert de musique classique" },
              { src: "https://www.hallucinecran.com/Giant%20Inf/4.webp", alt: "Écran géant gonflable sur bateau de croisière" },
              { src: "https://www.hallucinecran.com/Giant%20Inf/6.webp", alt: "Trois écrans géants gonflables avec feu d'artifice" },
              { src: "https://www.hallucinecran.com/Giant%20Inf/8.webp", alt: "Trois écrans géants au coucher du soleil" },
              { src: "https://www.hallucinecran.com/Giant%20Inf/9.webp", alt: "Montage écran géant — 3 personnes suffisent" },
              { src: "https://www.hallucinecran.com/Giant%20Inf/10.webp", alt: "Écran géant au stade Vélodrome Orange Marseille" },
              { src: "https://www.hallucinecran.com/Gallery/37.webp", alt: "Écran géant gonflable événement Canal+" },
            ].map((img, i) => (
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

      {/* Accessoires inclus */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Accessoires inclus</h2>
          <div className="grid grid-cols-3 gap-8 max-w-2xl">
            <div className="text-center">
              <img src="https://www.hallucinecran.com/Accessories/4-removebg-preview%20-1-.png" alt="Ancre marine" className="w-24 h-24 object-contain mx-auto mb-3" />
              <p className="text-ivory text-sm font-medium">Ancre marine</p>
            </div>
            <div className="text-center">
              <img src="https://www.hallucinecran.com/Accessories/5-removebg-preview.png" alt="Garantie 10 ans" className="w-24 h-24 object-contain mx-auto mb-3" />
              <p className="text-ivory text-sm font-medium">Garantie 10 ans</p>
            </div>
            <div className="text-center">
              <img src="https://www.hallucinecran.com/Accessories/6-removebg-preview.png" alt="Souffleur permanent" className="w-24 h-24 object-contain mx-auto mb-3" />
              <p className="text-ivory text-sm font-medium">Souffleur permanent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-12">Pourquoi choisir nos écrans à soufflerie ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Caractéristiques */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Caractéristiques clés</h2>
          <p className="text-white/60 mb-12 max-w-2xl">
            Léger et facile à transporter. Installation rapide (moins de 10 minutes pour le gonflage). 
            Nécessite une connexion électrique continue pour le souffleur.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Praticité</h3>
              <p className="text-white/60 text-sm">Le sac et l'écran sont reliés — pas de pièces à assembler séparément. Dépliez, branchez le souffleur, c'est prêt.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Polyvalence</h3>
              <p className="text-white/60 text-sm">De 8m pour les événements intimes à 24m pour les grands festivals. Projection avant ou arrière possible.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Résistance</h3>
              <p className="text-white/60 text-sm">Tissu airbag haute résistance, coutures renforcées, résistant aux intempéries. Conçu pour durer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tableau specs + tarifs */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Spécifications techniques</h2>
          <p className="text-white/60 mb-8">9 tailles disponibles, de 8m à 24m de large</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">Taille hors tout</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Toile de projection</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Poids</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Hauteur base image</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Temps de montage</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Nb. personnes</th>
                </tr>
              </thead>
              <tbody>
                {specsData.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-4 px-3 text-ivory font-medium">{row.taille}</td>
                    <td className="py-4 px-3 text-white/70">{row.toile}</td>
                    <td className="py-4 px-3 text-white/70">{row.poids}</td>
                    <td className="py-4 px-3 text-white/70">{row.hauteur}</td>
                    <td className="py-4 px-3 text-white/70">{row.montage}</td>
                    <td className="py-4 px-3 text-white/70">{row.personnes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Applications et usages</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Ciné-parcs", desc: "Créez des drive-in et cinémas en plein air avec nos écrans géants, visibles depuis les véhicules." },
              { title: "Événements sportifs", desc: "Retransmettez matchs et compétitions sur grand écran pour vos fans et supporters." },
              { title: "Festivals", desc: "Projections de films, concerts visuels, spectacles — nos écrans s'adaptent à tous les formats." },
              { title: "Conférences", desc: "Présentations corporate, séminaires, lancements de produits en extérieur avec une image nette." },
            ].map((app) => (
              <div key={app.title} className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-ivory font-semibold mb-2">{app.title}</h3>
                <p className="text-white/60 text-sm">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vidéos tutorielles */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Nos écrans en vidéo</h2>
          <p className="text-white/60 mb-8 max-w-2xl">Découvrez le montage et le démontage de nos écrans gonflables géants en vidéo.</p>
          <div className="grid md:grid-cols-2 gap-8">
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
                <h3 className="text-ivory font-semibold">Montage écran soufflerie 10m</h3>
                <p className="text-white/60 text-sm">Tutoriel complet pour le montage d'un écran gonflable à soufflerie.</p>
              </div>
            </div>
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
                <p className="text-white/60 text-sm">Comment démonter et ranger votre écran gonflable en toute simplicité.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/mode-emploi" className="text-warm hover:underline font-medium inline-flex items-center gap-2">
              Voir le mode d'emploi complet <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Vous organisez un événement ?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Obtenez des solutions gonflables sur mesure pour votre événement en plein air.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/tarifs-ecran-gonflable" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Voir Nos Tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi Hallucine */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Pourquoi Choisir Hallucine</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Expérience éprouvée</h3>
              <p className="text-white/60 text-sm leading-relaxed">Plus de 30 ans d'expérience dans la conception et la fabrication d'écrans gonflables. Plus de 1000 écrans vendus dans le monde entier.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Service clé en main</h3>
              <p className="text-white/60 text-sm leading-relaxed">De la conception à la livraison, nous vous accompagnons à chaque étape. Conseil technique, personnalisation, logistique internationale.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Produits personnalisables</h3>
              <p className="text-white/60 text-sm leading-relaxed">Chaque écran peut être adapté à vos besoins : dimensions sur mesure, impression personnalisée, accessoires spécifiques.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
