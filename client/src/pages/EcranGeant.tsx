/*
 * Page Écran Gonflable Géant (soufflerie)
 * Specs techniques complètes, tarifs, avantages, CTA
 * Données exactes du site de référence
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Wind, Clock, Shield, Feather, Users, ArrowRight } from "lucide-react";

const specsData = [
  { taille: "8m × 6m", toile: "7m × 5m", poids: "35 kg", hauteur: "—", montage: "30 min", personnes: "1", prix: "12 554 €" },
  { taille: "10m × 7m", toile: "9m × 6m", poids: "50 kg", hauteur: "160 cm", montage: "30 min", personnes: "1", prix: "15 024 €" },
  { taille: "10,32m × 7,90m", toile: "9m × 5m", poids: "60 kg", hauteur: "220 cm", montage: "30 min", personnes: "1", prix: "16 024 €" },
  { taille: "13m × 8m", toile: "12m × 6,5m", poids: "80 kg", hauteur: "—", montage: "30 min", personnes: "2", prix: "18 705 €" },
  { taille: "14m × 9m", toile: "13m × 7m", poids: "90 kg", hauteur: "—", montage: "45 min", personnes: "2", prix: "23 767 €" },
  { taille: "15m × 10m", toile: "14m × 8m", poids: "110 kg", hauteur: "—", montage: "45 min", personnes: "2", prix: "31 105 €" },
  { taille: "17m × 12m", toile: "15m × 10m", poids: "180 kg", hauteur: "—", montage: "1h", personnes: "3", prix: "34 105 €" },
  { taille: "20m × 14m", toile: "18m × 12m", poids: "220 kg", hauteur: "—", montage: "1h15", personnes: "3", prix: "41 233 €" },
  { taille: "24m × 14m", toile: "22m × 12m", poids: "280 kg", hauteur: "—", montage: "1h30", personnes: "4", prix: "48 258 €" },
];

const avantages = [
  { icon: Feather, title: "Les plus légers du monde", desc: "Nos écrans sont jusqu'à 3× plus légers que la concurrence grâce à notre technologie de tissu airbag brevetée." },
  { icon: Clock, title: "Installation rapide", desc: "Montage en moins de 30 minutes pour les modèles jusqu'à 13m. Un seul opérateur suffit pour les petites tailles." },
  { icon: Shield, title: "Garantie 10 ans", desc: "Nous garantissons nos écrans pendant 10 ans, preuve de notre confiance dans la qualité de nos matériaux." },
  { icon: Wind, title: "Souffleur permanent", desc: "Le souffleur maintient l'écran gonflé en permanence, assurant une toile parfaitement tendue pour une image optimale." },
];

export default function EcranGeant() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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
          <h2 className="text-3xl font-bold text-ivory mb-4">Spécifications techniques et tarifs</h2>
          <p className="text-white/60 mb-8">Tarifs H.T. des Écrans Gonflables à soufflerie — Hallucine</p>
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
                  <th className="text-left py-4 px-3 text-warm font-semibold">Prix H.T. EUR</th>
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
                    <td className="py-4 px-3 text-warm font-semibold">{row.prix}</td>
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

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Vous organisez un événement ?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Obtenez des solutions gonflables sur mesure pour votre événement en plein air.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/demande-de-prix" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
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
