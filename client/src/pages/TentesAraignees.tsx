/*
 * Page Tentes Araignées Gonflables
 * Specs, FAQ, applications, calculateur mentionné
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const tailles = [
  { dim: "4m × 4m", poids: "~50 kg", montage: "10-15 min" },
  { dim: "6m × 6m", poids: "~60 kg", montage: "10-15 min" },
  { dim: "8m × 8m", poids: "~70 kg", montage: "10-15 min" },
  { dim: "10m × 10m", poids: "~80 kg", montage: "15 min" },
];

const faqItems = [
  {
    q: "Qu'est-ce qu'une tente araignée gonflable ?",
    a: "C'est une structure gonflable pour événements extérieurs, stable et en forme de toile d'araignée. Elle se distingue par ses pieds gonflables qui assurent une excellente stabilité et un look unique."
  },
  {
    q: "Quels sont les avantages d'une tente araignée gonflable ?",
    a: "Installation rapide (environ 15 minutes par une seule personne), stabilité exceptionnelle grâce aux pieds gonflables, adaptabilité à tous types d'événements, et grande mobilité grâce à son poids réduit."
  },
  {
    q: "Combien de temps faut-il pour installer une tente araignée gonflable ?",
    a: "Environ 15 minutes par une seule personne. Le gonflage est rapide grâce au souffleur intégré, et la structure se met en place automatiquement."
  },
];

export default function TentesAraignees() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Tentes gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Tente Araignée Gonflable<br />
            <span className="text-warm">Installation Simple et Design</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Nos tentes araignées gonflables combinent un design unique avec une facilité d'installation 
            remarquable. Disponibles de 4m à 10m de diamètre, elles s'adaptent à tous vos événements.
          </p>
        </div>
      </section>

      {/* Pourquoi choisir */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Pourquoi choisir nos tentes araignées ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg card-hover">
              <h3 className="text-warm font-semibold mb-3">Facilité d'installation</h3>
              <p className="text-white/60 text-sm leading-relaxed">Installation rapide en moins de 15 minutes avec un souffleur intégré. Une seule personne suffit.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg card-hover">
              <h3 className="text-warm font-semibold mb-3">Matériaux de qualité</h3>
              <p className="text-white/60 text-sm leading-relaxed">Matériaux résistants aux UV et à l'eau. Conçus pour durer et résister aux conditions extérieures.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg card-hover">
              <h3 className="text-warm font-semibold mb-3">Polyvalence des tailles</h3>
              <p className="text-white/60 text-sm leading-relaxed">Tailles de 4m à 10m de diamètre pour s'adapter à tous les types d'événements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tailles et specs */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Tailles et spécifications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-2xl">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">Dimensions</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Poids</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Temps de montage</th>
                </tr>
              </thead>
              <tbody>
                {tailles.map((t, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-4 px-3 text-ivory font-medium">{t.dim}</td>
                    <td className="py-4 px-3 text-white/70">{t.poids}</td>
                    <td className="py-4 px-3 text-white/70">{t.montage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Caractéristiques techniques */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Caractéristiques techniques</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Pieds gonflables</h3>
              <p className="text-white/60 text-sm">Pieds gonflables pour une bonne stabilité, même sur terrain irrégulier.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Personnalisation</h3>
              <p className="text-white/60 text-sm">Impression de logos et visuels sur le toit, les pieds, le PVC des pieds et les couvertures des zips.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Murs et auvents</h3>
              <p className="text-white/60 text-sm">Options pour les murs (standard, porte, fenêtre) et auvents pour chaque côté.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Accessoires</h3>
              <p className="text-white/60 text-sm">Sac de transport, pompes, sacs de sable/eau, lumière LED, kit de réparation, système d'ancrage, tapis de sol.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Applications idéales</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Événements en plein air</h3>
              <p className="text-white/60 text-sm">Projections de films, concerts, festivals — la tente araignée crée un espace couvert unique.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Tentes d'accueil ou VIP</h3>
              <p className="text-white/60 text-sm">Espace de réception élégant pour accueillir vos invités de marque.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Stands commerciaux</h3>
              <p className="text-white/60 text-sm">Structure originale et robuste pour vos salons et foires commerciales.</p>
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
          <h2 className="text-3xl font-bold text-ivory mb-4">Intéressé par nos tentes araignées ?</h2>
          <p className="text-white/60 mb-8">Contactez-nous pour un devis personnalisé.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Demande de devis
            </Link>
            <Link href="/demande-de-prix" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Voir Nos Tarifs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
