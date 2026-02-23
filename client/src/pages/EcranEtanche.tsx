/*
 * Page Écran Gonflable Étanche à l'Air
 * Design: cinéma vintage — fond sombre, accents dorés, typographie serif
 * Contenu complet du site d'origine hallucinecran.com
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmCountdown from "@/components/FilmCountdown";
import { Link } from "wouter";
import { VolumeX, Droplets, Clock, Feather, ChevronDown, Shield, Wind, Zap } from "lucide-react";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

const specsData = [
  { taille: "245 × 200 cm", toile: "218 × 122 cm", poids: "7 kg", hauteur: "50 cm", personnes: "1" },
  { taille: "314 × 234 cm", toile: "300 × 170 cm", poids: "8 kg", hauteur: "50 cm", personnes: "1" },
  { taille: "426 × 352 cm", toile: "400 × 225 cm", poids: "15 kg", hauteur: "100 cm", personnes: "1" },
  { taille: "530 × 430 cm", toile: "500 × 280 cm", poids: "20 kg", hauteur: "120 cm", personnes: "1" },
  { taille: "620 × 505 cm", toile: "600 × 338 cm", poids: "32 kg", hauteur: "150 cm", personnes: "1" },
  { taille: "724 × 580 cm", toile: "700 × 395 cm", poids: "45 kg", hauteur: "160 cm", personnes: "2" },
  { taille: "820 × 630 cm", toile: "800 × 450 cm", poids: "50 kg", hauteur: "160 cm", personnes: "2" },
  { taille: "920 × 685 cm", toile: "900 × 506 cm", poids: "62 kg", hauteur: "160 cm", personnes: "2 ou 3" },
  { taille: "1024 × 753 cm", toile: "1000 × 570 cm", poids: "73 kg", hauteur: "160 cm", personnes: "2 ou 3" },
];

const avantages = [
  { icon: VolumeX, title: "100% Silencieux", desc: "Pas de bruit de souffleur pendant la projection. Idéal pour les cinémas en plein air, les concerts acoustiques et les projections urbaines où le silence est essentiel." },
  { icon: Droplets, title: "Étanche à l'air", desc: "Technologie de chambre à air scellée en TPU. Un seul gonflage suffit — l'écran reste en place pendant toute la durée de l'événement sans alimentation électrique." },
  { icon: Clock, title: "Installation rapide", desc: "Prêt à l'emploi en quelques minutes. Gonflez une seule fois avec une pompe ou un souffleur, puis débranchez. L'écran reste gonflé pendant des jours." },
  { icon: Feather, title: "Ultra-léger", desc: "Fabriqué en tissu polyamide de kitesurf — le plus mince et le plus léger de sa catégorie. Facile à transporter dans une voiture et à stocker." },
  { icon: Shield, title: "Garantie 3 ans", desc: "Structure gonflable garantie 3 ans. Toile de projection lavable en machine. Matériaux résistants aux UV et aux intempéries." },
  { icon: Wind, title: "Résistant au vent", desc: "Conception flexible qui résiste aux vents jusqu'à 40-50 km/h. La structure plie sous le vent au lieu de casser, protégeant l'écran et les spectateurs." },
  { icon: Zap, title: "Autonome", desc: "Pas besoin d'électricité permanente. Idéal pour les lieux sans accès au courant : plages, parcs, toits, bateaux, zones isolées." },
];

const faqItems = [
  {
    q: "Combien de temps l'écran reste-t-il gonflé ?",
    a: "Grâce à la chambre à air en TPU, l'écran reste gonflé pendant plusieurs jours sans avoir besoin de regonfler. La technologie étanche à l'air garantit une tenue parfaite pendant toute la durée de votre événement."
  },
  {
    q: "Peut-on utiliser l'écran étanche sous la pluie ?",
    a: "Oui, l'écran étanche est conçu pour résister aux intempéries. Le tissu polyamide de kitesurf est hydrofuge et résistant aux UV. Cependant, nous recommandons de protéger le vidéoprojecteur."
  },
  {
    q: "Quelle est la différence avec l'écran à soufflerie ?",
    a: "L'écran étanche utilise une chambre à air scellée : vous le gonflez une fois, il reste en forme sans électricité ni bruit. L'écran à soufflerie utilise un souffleur permanent — nécessaire pour les très grands formats (au-delà de 8m)."
  },
  {
    q: "Comment se fait l'installation ?",
    a: "Dépliez l'écran, branchez une pompe ou un souffleur pour le gonflage initial (5-10 minutes), débranchez, et c'est prêt. L'écran tient seul grâce à sa base lestable. Une seule personne suffit pour les modèles jusqu'à 6m."
  },
  {
    q: "La toile de projection est-elle amovible ?",
    a: "Oui, la toile de projection est amovible et réversible (projection frontale et rétroprojection). Elle est lavable en machine, ce qui simplifie grandement l'entretien."
  },
];

const galleryImages = [
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/YMJYpUnslhOmIiPC.webp", alt: "Grand écran de cinéma gonflable étanche à l'air installé en extérieur" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/TXuxOQPMMNpkSJyD.webp", alt: "Comparaison de la taille d'un écran gonflable étanche avec une personne" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/XDRRcwbNXnMRbTnK.webp", alt: "Vue arrière d'un écran gonflable étanche de 7.5m montrant sa structure" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bgGbQjCtvAcizIlL.webp", alt: "Écran de cinéma gonflable étanche installé dans un jardin pour un événement" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ncYxRulsuwTbmqyt.webp", alt: "Projection de film en plein air sur un grand écran gonflable étanche la nuit" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/wfNnGSUZpZLANRrm.webp", alt: "Image de haute qualité projetée sur un écran gonflable étanche lors d'un cinéma en plein air nocturne" },
];

export default function EcranEtanche() {
  useDocumentMeta("Écran Gonflable Étanche à l'Air | Technologie TPU", "Écran de cinéma gonflable étanche à l'air avec technologie TPU. Silencieux, sans soufflerie, résistant au vent. De 3m à 12m.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/XoVIsDKghhCzbhqj.webp");

  const [showCountdown, setShowCountdown] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="ecran-etanche"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: "Écrans gonflables", url: "https://hallucinecran.fr/ecrans-gonflables" },
          { name: "Écran gonflable étanche à l'air", url: "https://hallucinecran.fr/ecran-gonflable-etanche" },
        ]}
        product={{
          name: "Écran gonflable étanche à l'air",
          description: "Les écrans gonflables étanches à l'air offrent une solution pratique et esthétique pour vos événements en intérieur et en extérieur. Disponibles en tailles allant de 2 à 10 mètres, ils s'adaptent parfaitement aux projections de films, soirées sportives ou tout autre événement nécessitant une toile grand format.",
          image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/YMJYpUnslhOmIiPC.webp",
          url: "https://hallucinecran.fr/ecran-gonflable-etanche",
          category: "Écrans gonflables",
          minPrice: 990,
        }}
        faqs={faqItems.map(item => ({ question: item.q, answer: item.a }))}
      />
      {showCountdown && <FilmCountdown onComplete={() => setShowCountdown(false)} />}
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Écrans gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Écran gonflable<br />
            <span className="text-warm">étanche à l'air</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed mb-6">
            Les écrans gonflables étanches à l'air offrent une solution pratique et esthétique pour vos événements 
            en intérieur et en extérieur. Disponibles en tailles allant de <strong className="text-ivory">2 à 10 mètres</strong>, 
            ils s'adaptent parfaitement aux projections de films, soirées sportives ou tout autre événement nécessitant 
            une toile grand format.
          </p>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed mb-8">
            Leur conception légère en <strong className="text-ivory">tissu polyamide de kitesurf</strong> et sans souffleur permanent 
            garantit une expérience <strong className="text-ivory">100% silencieuse</strong> et facile à transporter, 
            avec une <strong className="text-warm">garantie de 3 ans</strong> pour une durabilité exceptionnelle.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Demander un Devis
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Nous Contacter
            </Link>
            <BrochureDownloadButton productSlug="ecran-etanche" productName="Écran Étanche" variant="compact" />
          </div>
        </div>
      </section>

      {/* Technologie */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Technologie étanche à l'air</h2>
          <p className="text-white/60 mb-8 max-w-3xl text-lg leading-relaxed">
            Contrairement aux écrans à soufflerie qui nécessitent une alimentation électrique permanente, 
            nos écrans étanches utilisent une <strong className="text-ivory">chambre à air scellée en TPU</strong> (thermoplastique polyuréthane). 
            Un seul gonflage suffit pour maintenir l'écran en forme pendant plusieurs jours.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Chambre à air TPU</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                La chambre intérieure en thermoplastique polyuréthane assure une étanchéité parfaite. 
                L'air reste emprisonné, maintenant la structure rigide sans aucune alimentation externe.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Tissu polyamide de kitesurf</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Le même tissu utilisé dans les voiles de kitesurf : ultra-léger, résistant aux UV, 
                hydrofuge et extrêmement durable. Résultat : un écran 3× plus léger que la concurrence.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Toile de projection amovible</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                La toile est amovible et réversible pour la projection frontale et la rétroprojection. 
                Elle est lavable en machine, simplifiant grandement l'entretien entre les événements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Nos écrans étanches en images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Pourquoi choisir l'écran étanche ?</h2>
          <p className="text-white/60 mb-12 max-w-3xl">
            L'écran étanche à l'air est la solution idéale pour les événements où le silence, 
            l'autonomie et la facilité de transport sont essentiels.
          </p>
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

      {/* Applications idéales */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Applications idéales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Cinéma en plein air", desc: "Soirées cinéma dans les parcs, jardins, places publiques. Le silence de l'écran étanche permet une immersion totale." },
              { title: "Cinéma piscine", desc: "Projections au bord de la piscine ou sur l'eau. L'étanchéité protège l'écran de l'humidité ambiante." },
              { title: "Hôtels & Resorts", desc: "Animations pour les clients en soirée. Installation discrète et silencieuse, parfaite pour l'ambiance hôtelière." },
              { title: "Événements privés", desc: "Mariages, anniversaires, soirées entre amis. Compact et facile à installer dans n'importe quel jardin." },
              { title: "Campings", desc: "Soirées cinéma pour les campeurs. Pas besoin d'électricité permanente — idéal pour les emplacements isolés." },
              { title: "Projections urbaines", desc: "Festivals de quartier, projections sur les toits. Le silence est un atout majeur en milieu urbain." },
              { title: "Événements sportifs", desc: "Retransmissions de matchs en extérieur. L'écran résiste au vent et s'installe rapidement." },
              { title: "Entreprises", desc: "Présentations en extérieur, team building, lancements de produits. Image professionnelle garantie." },
            ].map((app) => (
              <div key={app.title} className="p-5 bg-card border border-border rounded-lg">
                <h3 className="text-warm font-semibold mb-2">{app.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tableau specs */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Guide des tailles et spécifications techniques</h2>
          <p className="text-white/60 mb-8">Écran Gonflable Étanche à l'Air — Format 16/9</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">Taille globale (cm)</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Toile 16/9 (cm)</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Poids</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Hauteur base image</th>
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
                    <td className="py-4 px-3 text-white/70">{row.personnes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/40 text-xs mt-4">
            Contact : contact@hallucine.fr · Tél : +33 6 80 14 76 94 · WhatsApp : +33 6 80 14 76 94
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Questions fréquentes</h2>
          <div className="max-w-3xl space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-ivory font-medium pr-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-warm shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-white/60 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Vous organisez un événement ?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Obtenez un devis personnalisé pour votre écran gonflable étanche à l'air. 
            Notre équipe vous accompagne dans le choix de la taille idéale.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demander un Devis
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-white/20 text-white/70 font-semibold rounded hover:bg-white/5 transition-colors">
              Voir Nos Tarifs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
