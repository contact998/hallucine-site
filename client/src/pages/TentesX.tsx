/*
 * Page Tentes X — Tentes événementielles en forme de X
 * Specs, personnalisation, accessoires, caractéristiques techniques
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import WeatherEffect from "@/components/WeatherEffect";

const tailles = ["3m × 3m", "4m × 4m", "5m × 5m", "6m × 6m", "7m × 7m", "8m × 8m"];

const accessoires = [
  "Murs de porte", "Mur courbe", "Auvent", "Mur latéral", "Mur de fenêtre",
  "Tissu de connexion", "Sac de transport", "Sacs de sable", "Lumière LED",
  "Pompe électrique", "Pompe manuelle"
];

const specs = [
  { label: "Boudins", value: "TPU 100% étanches à l'air, protégés par du Dacron résistant" },
  { label: "Embase", value: "PVC renforcé" },
  { label: "Valve", value: "Valve de surpression pour la sécurité" },
  { label: "Couture", value: "Renforcée pour une durabilité maximale" },
  { label: "Entoilage", value: "Polyester enduit 350 gr/m²" },
  { label: "Bâche latérale", value: "Ripstop résistant aux déchirures" },
  { label: "Jonction", value: "Aluminium — permet de démonter les boudins indépendamment" },
];

export default function TentesX() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <WeatherEffect intensity="moderate" />
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Tentes gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Tentes événementielles<br />
            <span className="text-warm">en forme de X</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            La tente gonflable Hallucine X est une solution innovante, pratique, simple à installer et à transporter 
            pour vos événements. Disponible de 3×3m à 8×8m, elle s'adapte à tous vos besoins.
          </p>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Tentes X en images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/tente-x.jpg", alt: "Tente gonflable X — vue de côté" },
              { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/671bade5ef4fb27a93d3034de910dc4.jpg", alt: "Tente gonflable X — vue de face" },
              { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/1078c8cca1c101dbe2d41d70cadf4a0.jpg", alt: "Tentes gonflables X personnalisables" },
              { src: "https://www.hallucinecran.com/Tentes/xtent-1.jpg", alt: "Tente gonflable X Hallucine" },
            ].map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Schéma éclaté technique */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-ivory mb-4">Schéma technique éclaté</h3>
            <img src="https://www.hallucinecran.com/Tentes/x%20tent%20Eclate%20french-1.jpg" alt="Schéma éclaté technique tente gonflable X" className="w-full max-w-3xl mx-auto rounded" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Design et résistance */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Un design pratique et résistant</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-white/70 leading-relaxed mb-4">
                La structure de la tente est composée de quatre boudins indépendants en TPU 100% étanches à l'air, 
                insérés dans des tubes en Dacron résistants. La couverture en polyester enduit est personnalisable 
                et démontable.
              </p>
              <p className="text-white/70 leading-relaxed">
                Chaque boudin est équipé d'une valve de gonflage et d'un système de surpression. La maintenance 
                est facilitée par des fermetures à glissière pour accéder aux boudins indépendamment.
              </p>
            </div>
            <div>
              <p className="text-white/70 leading-relaxed mb-4">
                Plusieurs systèmes de lestage sont disponibles, comme des sacs de sable, pour assurer la stabilité 
                dans toutes les conditions. La jonction en aluminium permet de démonter les boudins indépendamment 
                pour faciliter l'entretien.
              </p>
              <p className="text-white/70 leading-relaxed">
                La tente est entièrement personnalisable, avec des options de sérigraphie ou d'impression numérique 
                sur le toit et les rideaux en Ripstop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Caractéristiques techniques */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Caractéristiques techniques</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-2xl">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-4 px-3 text-warm font-semibold w-40">{s.label}</td>
                    <td className="py-4 px-3 text-white/70">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tailles disponibles */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Tailles disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tailles.map((t) => (
              <div key={t} className="p-4 bg-card border border-border rounded-lg text-center">
                <p className="text-warm font-semibold text-lg">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessoires */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Accessoires disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {accessoires.map((a) => (
              <div key={a} className="p-4 bg-card border border-border rounded-lg">
                <p className="text-white/80 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personnalisation */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Personnalisation complète</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl">
            La tente est entièrement personnalisable, avec des options de sérigraphie ou d'impression numérique 
            sur le toit et les rideaux en Ripstop. Ajoutez votre logo, vos couleurs, vos messages pour une 
            visibilité maximale lors de vos événements.
          </p>
        </div>
      </section>

      {/* Résumé */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">En résumé</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Praticité & solidité", desc: "Structure robuste en TPU et Dacron, montage rapide sans outils spéciaux." },
              { title: "Personnalisation", desc: "Impression numérique haute qualité sur toit et parois. Votre marque mise en avant." },
              { title: "Légèreté & résistance", desc: "Facile à transporter grâce à son poids réduit, résistante aux intempéries." },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-warm font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Fiabilité, Expertise, Qualité</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Fiabilité</h3>
              <p className="text-white/60 text-sm leading-relaxed">Matériaux de haute qualité testés dans les conditions les plus exigeantes. Nos tentes résistent au vent, à la pluie et aux UV.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Expertise</h3>
              <p className="text-white/60 text-sm leading-relaxed">Plus de 30 ans d'expérience dans la conception de structures gonflables. Notre équipe vous conseille pour trouver la solution idéale.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Qualité</h3>
              <p className="text-white/60 text-sm leading-relaxed">Contrôles de qualité rigoureux à chaque étape de la fabrication. Chaque tente est testée avant expédition.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Intéressé par nos tentes X ?</h2>
          <p className="text-white/60 mb-8">Contactez-nous pour un devis personnalisé ou consultez nos tarifs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/tarifs-ecran-gonflable" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demande de prix
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
