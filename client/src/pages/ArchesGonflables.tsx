/*
 * Page Arches Gonflables
 * Tarifs complets, specs, FAQ, accessoires
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const archesData = [
  { ref: "CA-4/2.6/0.45", taille: "400×260(H)×45cm", prixBlanc: "756 €", prixImprime: "978 €" },
  { ref: "CA-5/3.2/0.6", taille: "500×320(H)×60cm", prixBlanc: "1 044 €", prixImprime: "1 395 €" },
  { ref: "CA-6/3.8/0.6", taille: "600×380(H)×60cm", prixBlanc: "1 203 €", prixImprime: "1 608 €" },
  { ref: "CA-6/3.8/0.8", taille: "600×380(H)×80cm", prixBlanc: "1 614 €", prixImprime: "2 058 €" },
  { ref: "CA-8/4.6/0.8", taille: "800×460(H)×80cm", prixBlanc: "2 007 €", prixImprime: "2 571 €" },
  { ref: "CA-8/4.8/0.9", taille: "800×480(H)×90cm", prixBlanc: "2 199 €", prixImprime: "2 793 €" },
  { ref: "CA-10/4.8/0.8", taille: "1000×480(H)×80cm", prixBlanc: "2 313 €", prixImprime: "2 952 €" },
  { ref: "CA-10/4.8/0.9", taille: "1000×480(H)×90cm", prixBlanc: "2 457 €", prixImprime: "3 126 €" },
  { ref: "CA-10/5.8/0.9", taille: "1000×580(H)×90cm", prixBlanc: "2 610 €", prixImprime: "3 327 €" },
  { ref: "CA-12/4.8/0.9", taille: "1200×480(H)×90cm", prixBlanc: "2 691 €", prixImprime: "3 408 €" },
  { ref: "CA-12/5.8/0.9", taille: "1200×580(H)×90cm", prixBlanc: "2 919 €", prixImprime: "3 717 €" },
];

const accessoires = [
  { ref: "CA-EP", nom: "Pompe électrique", desc: "Prises en fonction de votre pays", prix: "35 €" },
  { ref: "CA-HP", nom: "Pompe manuelle", desc: "Utilisation extérieur", prix: "10 €" },
  { ref: "CA-ACC-1", nom: "Cordes/Piquets", desc: "Pour la sécurité et la stabilité", prix: "10 €" },
  { ref: "CA-ACC-2", nom: "Valve de rechange", desc: "Standby application", prix: "5 €" },
];

const faqItems = [
  {
    q: "Quelle est la durée de vie d'une arche gonflable ?",
    a: "Avec un entretien approprié, nos arches peuvent durer plusieurs années grâce à leur conception robuste en PVC renforcé et tissu Oxford."
  },
  {
    q: "Est-ce que les arches sont personnalisables ?",
    a: "Oui, toutes nos arches peuvent être personnalisées avec votre logo, vos couleurs et vos messages. Impression numérique haute définition disponible."
  },
  {
    q: "Que faire en cas de vent fort ?",
    a: "Nos arches sont fournies avec des sacs de sable et des chevilles pour assurer leur stabilité. En cas de conditions climatiques extrêmes, il est recommandé de les dégonfler temporairement."
  },
];

export default function ArchesGonflables() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Structures gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Arches Gonflables<br />
            <span className="text-warm">Personnalisées pour Événements</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Les arches gonflables sont des éléments incontournables pour vos événements sportifs, expositions, 
            et campagnes promotionnelles. Faciles à personnaliser, elles offrent une visibilité accrue grâce à 
            leur grande taille et leur design adaptable. De 4m à 12m de large.
          </p>
        </div>
      </section>

      {/* Modèles */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Modèles disponibles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Arche standard</h3>
              <p className="text-white/60 text-sm leading-relaxed">Design simple et épuré. Disponible en différentes tailles de 4m à 12m. Idéale pour des événements sportifs ou comme point d'entrée.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Arche personnalisée</h3>
              <p className="text-white/60 text-sm leading-relaxed">Formes et designs sur mesure. Impression de logos ou slogans pour vos campagnes marketing. Compatible avec des systèmes d'éclairage intégrés.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Arche à plusieurs pieds</h3>
              <p className="text-white/60 text-sm leading-relaxed">Offre une meilleure stabilité. Parfaite pour les conditions météorologiques difficiles. Conçue pour des utilisations prolongées.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs arches */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Tarifs des arches gonflables</h2>
          <p className="text-white/60 mb-2 text-sm">Tissu blanc + vessie TPU. Les arches sont étanches — un seul gonflage suffit.</p>
          <p className="text-white/60 mb-8 text-sm">Le diamètre maximal est de 90 cm.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">Référence</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Taille</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Prix blanc (EUR)</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Prix avec impression (EUR)</th>
                </tr>
              </thead>
              <tbody>
                {archesData.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-ivory font-medium">{row.ref}</td>
                    <td className="py-3 px-3 text-white/70">{row.taille}</td>
                    <td className="py-3 px-3 text-white/70">{row.prixBlanc}</td>
                    <td className="py-3 px-3 text-warm font-semibold">{row.prixImprime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Accessoires */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Accessoires</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-3xl">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">Référence</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Nom</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Description</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Prix</th>
                </tr>
              </thead>
              <tbody>
                {accessoires.map((a, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-ivory font-medium">{a.ref}</td>
                    <td className="py-3 px-3 text-white/70">{a.nom}</td>
                    <td className="py-3 px-3 text-white/60 text-xs">{a.desc}</td>
                    <td className="py-3 px-3 text-warm font-semibold">{a.prix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Caractéristiques */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Caractéristiques techniques</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Matériaux", desc: "PVC renforcé ou tissu Oxford, résistant aux intempéries." },
              { title: "Personnalisation", desc: "Impression numérique haute définition sur toute la surface." },
              { title: "Installation", desc: "Système de gonflage rapide (moins de 5 minutes)." },
              { title: "Accessoires inclus", desc: "Ventilateur électrique, sacs de sable, cordes et chevilles." },
              { title: "Durabilité", desc: "Résistantes aux UV et aux déchirures." },
              { title: "Étanchéité", desc: "Un seul gonflage suffit — pas de souffleur permanent nécessaire." },
            ].map((item) => (
              <div key={item.title} className="p-5 bg-card border border-border rounded-lg">
                <h3 className="text-warm font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Applications possibles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Événements sportifs</h3>
              <p className="text-white/60 text-sm">Portique pour les départs et arrivées de courses. Points d'entrée pour les compétitions en plein air.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Expositions et foires</h3>
              <p className="text-white/60 text-sm">Signalétique pour guider les visiteurs. Décorations promotionnelles pour stands.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Publicité mobile</h3>
              <p className="text-white/60 text-sm">Supports pour campagnes publicitaires locales ou itinérantes.</p>
            </div>
          </div>
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
          <h2 className="text-3xl font-bold text-ivory mb-4">Besoin d'une arche gonflable ?</h2>
          <p className="text-white/60 mb-8">Contactez-nous pour un devis personnalisé ou consultez nos tarifs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/demande-de-prix" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demande de prix
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
