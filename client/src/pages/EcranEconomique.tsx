/*
 * Page Écran Gonflable Économique
 * Design: cinéma vintage — fond sombre, accents dorés
 * Contenu complet du site d'origine hallucinecran.com
 * Deux gammes : avec souffleur et sans souffleur
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmCountdown from "@/components/FilmCountdown";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";

const avecSouffleur = [
  { taille: "4.50 × 4.00 × 2.00 m", toile: "400 × 250 cm", poids: "15 kg", hauteur: "50 cm", personnes: "1" },
  { taille: "5.40 × 4.20 × 2.80 m", toile: "480 × 270 cm", poids: "17 kg", hauteur: "70 cm", personnes: "1" },
  { taille: "7.00 × 5.20 × 3.50 m", toile: "600 × 350 cm", poids: "20 kg", hauteur: "100 cm", personnes: "1" },
];

const sansSouffleur = [
  { taille: "2.5 × 1.8 m", toile: "218 × 122 cm", poids: "7 kg", hauteur: "50 cm", personnes: "1" },
  { taille: "4 × 3.5 m", toile: "300 × 170 cm", poids: "17 kg", hauteur: "50 cm", personnes: "1" },
  { taille: "5 × 4 m", toile: "400 × 222 cm", poids: "35 kg", hauteur: "70 cm", personnes: "1" },
  { taille: "6 × 4 m", toile: "500 × 280 cm", poids: "55 kg", hauteur: "100 cm", personnes: "2" },
  { taille: "7.5 × 5.5 m", toile: "600 × 340 cm", poids: "85 kg", hauteur: "100 cm", personnes: "2" },
];

const galleryImages = [
  { src: "https://www.hallucinecran.com/Gallery/42.webp", alt: "Écran de cinéma gonflable économique installé en extérieur pour une projection de film" },
  { src: "https://www.hallucinecran.com/Gallery/43.webp", alt: "Projection d'un film en plein air sur un grand écran gonflable économique, spectateurs visibles" },
  { src: "https://www.hallucinecran.com/Gallery/44.webp", alt: "Démonstration de l'installation rapide d'un écran gonflable économique sur l'herbe" },
  { src: "https://www.hallucinecran.com/Gallery/45.webp", alt: "Vue de face d'un écran de projection gonflable économique, montrant la toile blanche et le cadre noir" },
  { src: "https://www.hallucinecran.com/Gallery/46.webp", alt: "Ambiance d'un événement en plein air avec un écran gonflable économique en arrière-plan" },
  { src: "https://www.hallucinecran.com/Gallery/47.webp", alt: "Soirée cinéma en plein air avec un écran gonflable économique illuminé par le projecteur" },
];

const faqItems = [
  {
    q: "Quelle est la différence entre les modèles avec et sans souffleur ?",
    a: "Les modèles avec souffleur utilisent un ventilateur permanent qui maintient l'écran gonflé en continu — ils sont autoportants et très stables. Les modèles sans souffleur sont gonflés une fois et restent en forme grâce à leur structure étanche — ils ne nécessitent pas d'électricité permanente."
  },
  {
    q: "Les écrans économiques sont-ils adaptés à un usage professionnel ?",
    a: "Oui, nos écrans économiques offrent une qualité de projection professionnelle à un prix accessible. Ils sont utilisés par des associations, des collectivités, des campings et des organisateurs d'événements dans le monde entier."
  },
  {
    q: "Quelle est la garantie sur les écrans économiques ?",
    a: "Tous nos écrans économiques sont couverts par une garantie de 1 an. Cette garantie couvre les défauts de fabrication sur la structure gonflable et la toile de projection."
  },
  {
    q: "Combien de temps faut-il pour installer un écran économique ?",
    a: "L'installation est très rapide : quelques minutes suffisent pour les modèles avec souffleur (branchez et c'est prêt). Pour les modèles sans souffleur, comptez 5 à 10 minutes de gonflage avec une pompe."
  },
  {
    q: "Peut-on utiliser les écrans économiques en intérieur ?",
    a: "Absolument ! Nos écrans économiques sont conçus pour une utilisation en intérieur comme en extérieur. Ils sont parfaits pour les salles de classe, les gymnases, les halls d'exposition et les espaces événementiels."
  },
];

export default function EcranEconomique() {
  const [showCountdown, setShowCountdown] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showCountdown && <FilmCountdown onComplete={() => setShowCountdown(false)} />}
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Écrans gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Écrans Gonflables<br />
            <span className="text-warm">Économiques</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed mb-6">
            Nos écrans gonflables économiques sont les <strong className="text-ivory">moins chers au monde</strong> alliant 
            robustesse et qualité de projection. Disponibles <strong className="text-ivory">avec ou sans souffleur</strong>, 
            ils offrent une solution accessible pour tous les budgets.
          </p>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed mb-8">
            Que ce soit pour un événement en plein air, une projection de film, ou un événement sportif, 
            nos écrans gonflables économiques sont conçus pour être simples à utiliser, solides, et abordables. 
            Profitez de vos événements en toute simplicité avec un écran de qualité professionnelle.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Demander un Devis
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Nous Contacter
            </Link>
            <BrochureDownloadButton productSlug="ecran-economique" productName="Écran Économique" variant="compact" />
          </div>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Nos écrans économiques en images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

      {/* Avec souffleur */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Écrans économiques avec souffleur</h2>
          <p className="text-white/70 mb-6 max-w-3xl leading-relaxed">
            Nos écrans économiques avec souffleur offrent une solution pratique et stable pour vos projections. 
            Autoportants de <strong className="text-ivory">4m à 6m</strong>, ils conviennent aussi bien en intérieur qu'en extérieur. 
            Garantie 1 an.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-5 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Installation rapide et facile</h3>
              <p className="text-white/60 text-sm leading-relaxed">Grâce au souffleur, l'écran est prêt en quelques minutes. Branchez et c'est parti.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Stabilité assurée</h3>
              <p className="text-white/60 text-sm leading-relaxed">Même dans des conditions extérieures variables, nos écrans restent solides grâce au souffleur permanent.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Intérieur et extérieur</h3>
              <p className="text-white/60 text-sm leading-relaxed">Idéal pour tous types d'événements, qu'ils soient en plein air ou en intérieur.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">Taille globale (m)</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Toile 4:3 (cm)</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Poids</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Hauteur base</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Nb. personnes</th>
                </tr>
              </thead>
              <tbody>
                {avecSouffleur.map((row, i) => (
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
        </div>
      </section>

      {/* Sans souffleur */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Écrans économiques sans souffleur</h2>
          <p className="text-white/70 mb-6 max-w-3xl leading-relaxed">
            Pour encore plus d'économie et de mobilité, nos écrans sans souffleur sont disponibles de 
            <strong className="text-ivory"> 2m à 6m</strong>. Pas besoin d'électricité — parfaits pour les lieux sans accès au courant. 
            Garantie 1 an.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-5 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Solution économique</h3>
              <p className="text-white/60 text-sm leading-relaxed">Idéal pour ceux qui recherchent une option abordable sans équipement supplémentaire.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Mobilité</h3>
              <p className="text-white/60 text-sm leading-relaxed">Ces écrans sont faciles à transporter et à stocker, parfaits pour des événements temporaires ou des locations.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Utilisation flexible</h3>
              <p className="text-white/60 text-sm leading-relaxed">Avec des tailles de toiles allant de 2m à 6m, il y a un écran adapté à chaque événement.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">Taille globale (m)</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Toile 4:3 (cm)</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Poids</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Hauteur base</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Nb. personnes</th>
                </tr>
              </thead>
              <tbody>
                {sansSouffleur.map((row, i) => (
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
        </div>
      </section>

      {/* Pourquoi choisir */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Pourquoi choisir nos écrans économiques ?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-card border border-border rounded-lg">
              <h4 className="text-warm font-semibold mb-2">Économiques mais performants</h4>
              <p className="text-white/60 text-sm leading-relaxed">Offrant une qualité de projection exceptionnelle à un prix compétitif. Les écrans les moins chers au monde alliant robustesse.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h4 className="text-warm font-semibold mb-2">Garantie de 1 an</h4>
              <p className="text-white/60 text-sm leading-relaxed">Tous nos écrans gonflables sont couverts par une garantie de 1 an pour votre tranquillité d'esprit.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h4 className="text-warm font-semibold mb-2">Polyvalence</h4>
              <p className="text-white/60 text-sm leading-relaxed">Que vous organisiez un événement en intérieur ou en extérieur, nos écrans sont adaptés à tous les types de configurations.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h4 className="text-warm font-semibold mb-2">Facilité d'installation</h4>
              <p className="text-white/60 text-sm leading-relaxed">Aucun besoin d'expertise, une personne suffit pour installer les modèles les plus petits, et deux pour les modèles plus grands.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
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
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Vous organisez un événement ?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Obtenez un devis personnalisé pour votre écran gonflable économique. 
            Notre équipe vous accompagne dans le choix du modèle idéal.
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
