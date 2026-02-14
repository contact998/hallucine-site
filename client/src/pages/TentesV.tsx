/*
 * Page Tentes V — Tentes en forme de V
 * Élégance et praticité, specs techniques, personnalisation
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const tailles = [
  { dim: "4m × 4m", poids: "~25 kg" },
  { dim: "5m × 5m", poids: "~30 kg" },
  { dim: "6m × 6m", poids: "~34 kg" },
];

const specs = [
  { label: "Boudins", value: "Dacron (disponible en 4 couleurs) ou polyester (plus de choix de couleurs)" },
  { label: "Entoilage", value: "Polyester enduit 350 gr/m² (disponible en 8 couleurs)" },
  { label: "Valve", value: "Valve de surpression pour la sécurité" },
  { label: "Fermeture", value: "Fermeture éclair YKK pour la solidité" },
  { label: "Poids (6×6m)", value: "Environ 34 kg — facile à manipuler" },
];

export default function TentesV() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Tentes gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Tentes Gonflables en V<br />
            <span className="text-warm">Élégance et Praticité</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Nos tentes gonflables en forme de V combinent style et fonctionnalité pour répondre aux besoins 
            des professionnels de l'événementiel. Ces structures uniques sont idéales pour créer des espaces 
            couverts attrayants lors de vos événements en plein air, tels que des festivals, des foires 
            commerciales, ou des stands publicitaires.
          </p>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Avantages de la gamme</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Design en V unique", desc: "Un look distinctif qui attire l'attention et se démarque des tentes traditionnelles." },
              { title: "Installation rapide et facile", desc: "Montage en quelques minutes grâce au système de gonflage intégré." },
              { title: "Résistance aux intempéries", desc: "Matériaux hydrofuges et résistants aux UV pour une utilisation en toutes conditions." },
              { title: "Polyvalence", desc: "Adaptée aux festivals, foires, stands commerciaux, événements sportifs et bien plus." },
              { title: "Personnalisation possible", desc: "Impression de logos, choix de couleurs, configuration des parois selon vos besoins." },
              { title: "Légèreté", desc: "Seulement 34 kg pour un modèle 6×6m — facile à transporter et à stocker." },
            ].map((a) => (
              <div key={a.title} className="p-6 bg-card border border-border rounded-lg card-hover">
                <h3 className="text-warm font-semibold mb-2">{a.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tailles */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Tailles disponibles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tailles.map((t) => (
              <div key={t.dim} className="p-6 bg-card border border-border rounded-lg text-center">
                <p className="text-warm font-bold text-2xl mb-2">{t.dim}</p>
                <p className="text-white/60 text-sm">Poids : {t.poids}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Caractéristiques techniques */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Caractéristiques techniques</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-3xl">
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

      {/* Personnalisation */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Options de personnalisation</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl">
            Les tentes sont entièrement personnalisables pour correspondre à l'identité de marque de votre événement. 
            Choisissez parmi nos options d'impression, de couleurs et de configuration pour créer un espace unique.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Impression toit</h3>
              <p className="text-white/60 text-sm">Impression numérique haute définition sur le toit pour une visibilité maximale.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Impression pieds</h3>
              <p className="text-white/60 text-sm">Personnalisez les pieds de la structure avec vos couleurs et logos.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Choix de couleurs</h3>
              <p className="text-white/60 text-sm">Boudins en Dacron (4 couleurs) ou polyester (large choix). Entoilage en 8 couleurs.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Accessoires</h3>
              <p className="text-white/60 text-sm">Sac de transport, pompes, éclairage LED, sacs de lestage et plus encore.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Intéressé par nos tentes V ?</h2>
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
