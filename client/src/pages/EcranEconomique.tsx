/*
 * Page Écran Gonflable Économique
 * Deux gammes : avec souffleur et sans souffleur
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmCountdown from "@/components/FilmCountdown";
import { Link } from "wouter";

const avecSouffleur = [
  { taille: "4,50 × 4,00 × 2,00 m", poids: "15 kg" },
  { taille: "5,40 × 4,20 × 2,80 m", poids: "17 kg" },
  { taille: "7,00 × 5,20 × 3,50 m", poids: "20 kg" },
];

const sansSouffleur = [
  { taille: "2,5 × 1,8 m", poids: "7 kg" },
  { taille: "4 × 3,5 m", poids: "17 kg" },
  { taille: "5 × 4 m", poids: "35 kg" },
  { taille: "6 × 4 m", poids: "55 kg" },
  { taille: "7,5 × 5,5 m", poids: "85 kg" },
];

export default function EcranEconomique() {
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
            Écrans Gonflables<br />
            <span className="text-warm">Économiques</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Des écrans gonflables abordables pour vos événements extérieurs et intérieurs. 
            Solution idéale pour des événements à petit budget, disponibles avec ou sans souffleur permanent.
          </p>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Nos écrans économiques en images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: "https://www.hallucinecran.com/1/20160902_183937.jpg", alt: "Écran économique dans la cour d'un bâtiment" },
              { src: "https://www.hallucinecran.com/Gallery/48.webp", alt: "Écran économique pour un petit public" },
              { src: "https://www.hallucinecran.com/Giant%20Inf/2.PNG", alt: "Écran économique installé dans un parc" },
              { src: "https://www.hallucinecran.com/ecran%20etanches.jpg", alt: "Écran économique sur la plage" },
              { src: "https://www.hallucinecran.com/Le%20cin%C3%A9ma%20%C3%A0%20la%20maison%20037.jpg", alt: "Écran économique — comparaison taille humaine" },
              { src: "https://www.hallucinecran.com/ECRAN%207-5.jpg", alt: "Écran économique vue arrière" },
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

      {/* Avec souffleur */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Écrans économiques avec souffleur</h2>
          <p className="text-white/70 mb-8 max-w-3xl">
            Nos écrans économiques avec souffleur offrent une solution pratique et stable pour vos projections. 
            Autoportants de 4m à 6m, ils conviennent aussi bien en intérieur qu'en extérieur.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-5 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Installation rapide</h3>
              <p className="text-white/60 text-sm">Branchez le souffleur et l'écran se gonfle en quelques minutes. Pas d'assemblage complexe.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Stabilité</h3>
              <p className="text-white/60 text-sm">Le souffleur permanent maintient l'écran parfaitement tendu pour une image de qualité.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Intérieur / Extérieur</h3>
              <p className="text-white/60 text-sm">Utilisable dans tous les environnements. Idéal pour les événements ponctuels.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-xl">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">Taille globale</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Poids</th>
                </tr>
              </thead>
              <tbody>
                {avecSouffleur.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-4 px-3 text-ivory font-medium">{row.taille}</td>
                    <td className="py-4 px-3 text-white/70">{row.poids}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sans souffleur */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Écrans économiques sans souffleur</h2>
          <p className="text-white/70 mb-8 max-w-3xl">
            Pour encore plus d'économie et de mobilité, nos écrans sans souffleur sont autoportants de 2m à 6m. 
            Pas besoin d'électricité — parfaits pour les lieux sans accès au courant.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-5 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Économique</h3>
              <p className="text-white/60 text-sm">Le prix le plus accessible de notre gamme. Idéal pour débuter dans le cinéma en plein air.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Mobilité</h3>
              <p className="text-white/60 text-sm">Pas de souffleur à transporter. L'écran se gonfle une fois et reste en place.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Flexibilité</h3>
              <p className="text-white/60 text-sm">Utilisable partout, même sans accès à l'électricité. Gonflez à la main ou avec une pompe.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-xl">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">Taille</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Poids</th>
                </tr>
              </thead>
              <tbody>
                {sansSouffleur.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-4 px-3 text-ivory font-medium">{row.taille}</td>
                    <td className="py-4 px-3 text-white/70">{row.poids}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Résumé */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Idéal pour tous vos événements</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl">
            Nos écrans économiques sont la solution parfaite pour les organisateurs qui souhaitent offrir 
            une expérience de projection de qualité sans se ruiner. Que ce soit pour une soirée entre amis, 
            un événement communautaire ou une projection scolaire, nos écrans s'adaptent à tous les budgets.
          </p>
          <h3 className="text-2xl font-bold text-ivory mb-6">Pourquoi choisir nos écrans économiques ?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-card border border-border rounded-lg">
              <h4 className="text-warm font-semibold mb-2">Prix accessible</h4>
              <p className="text-white/60 text-sm">L'entrée de gamme la plus compétitive du marché pour des écrans de projection gonflables.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h4 className="text-warm font-semibold mb-2">Qualité Hallucine</h4>
              <p className="text-white/60 text-sm">Même si le prix est réduit, la qualité de fabrication reste celle d'Hallucine : matériaux durables et finitions soignées.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h4 className="text-warm font-semibold mb-2">Facilité d'utilisation</h4>
              <p className="text-white/60 text-sm">Aucune compétence technique requise. Déballez, gonflez, projetez.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-lg">
              <h4 className="text-warm font-semibold mb-2">Polyvalence</h4>
              <p className="text-white/60 text-sm">Intérieur, extérieur, jardin, terrasse, parking — nos écrans s'adaptent à tous les environnements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Vous organisez un événement ?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Obtenez des solutions gonflables sur mesure pour votre événement.
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

      <Footer />
    </div>
  );
}
