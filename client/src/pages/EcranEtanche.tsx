/*
 * Page Écran Gonflable Étanche à l'Air
 * Specs techniques complètes, tarifs, avantages, CTA
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { VolumeX, Droplets, Clock, Feather } from "lucide-react";

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
  { icon: VolumeX, title: "Silencieux", desc: "Pas de bruit de souffleur. Idéal pour les projections cinématographiques, les concerts et les projections urbaines où le silence est essentiel." },
  { icon: Droplets, title: "Étanche à l'air", desc: "Résistant aux conditions extérieures (vent, pluie). Un seul gonflage suffit — pas besoin de souffleur permanent." },
  { icon: Clock, title: "Installation rapide", desc: "Prêt à l'emploi en quelques minutes seulement. Gonflez une fois, l'écran reste en place pendant toute la durée de l'événement." },
  { icon: Feather, title: "Ultra-léger", desc: "Le plus mince et le plus léger de sa catégorie. Facile à transporter et à stocker. Convient pour des installations de longue durée." },
];

export default function EcranEtanche() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Écrans gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Écran gonflable<br />
            <span className="text-warm">étanche à l'air</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Les écrans gonflables étanches à l'air offrent une solution pratique et esthétique pour vos événements 
            en intérieur et en extérieur. Disponibles en tailles allant de 2 à 10 mètres, ils s'adaptent parfaitement 
            aux projections de films, soirées sportives ou tout autre événement nécessitant une toile grand format. 
            Leur conception légère et sans souffleur permanent garantit une expérience silencieuse et facile à transporter, 
            avec une garantie de 3 ans pour une durabilité exceptionnelle.
          </p>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-12">Avantages clés</h2>
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

      {/* Tableau specs + tarifs */}
      <section className="py-20 bg-charcoal-light">
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
        </div>
      </section>

      {/* Installation */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Installation</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl">
            Découvrez la simplicité d'installation de nos écrans étanches, conçus pour des projections en extérieur. 
            Grâce à un design robuste et compact, ils offrent des performances exceptionnelles, même par mauvais temps.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Étanche à l'air</h3>
              <p className="text-white/60 text-sm">Idéal pour les cinés plein air, cinés piscine et toutes projections en intérieur. Un seul gonflage suffit.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Taille compacte</h3>
              <p className="text-white/60 text-sm">Convient aux espaces réduits tout en offrant une image grand format. Idéal pour les projections en ville.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Installation rapide</h3>
              <p className="text-white/60 text-sm">Souffleur unique pour une mise en place efficace. Gonflez, installez, projetez.</p>
            </div>
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

      <Footer />
    </div>
  );
}
