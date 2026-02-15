/*
 * Page Tentes N — Tentes en forme de N
 * Design original, ultra-résistante, personnalisable
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const specs = [
  { label: "Chambre étanche", value: "Polyuréthane (TPU), autonomie 60 jours sans regonflage" },
  { label: "Fermetures", value: "Zippées double face pour un accès facile" },
  { label: "Toit", value: "Polyester hydrofuge résistant aux intempéries" },
  { label: "Toile", value: "Parachute renforcée pour une durabilité maximale" },
  { label: "Double peau", value: "Polyuréthane Oxford ignifugée — sécurité incendie" },
  { label: "Personnalisation", value: "Toit, murs, entrée, couleur de structure, impression numérique" },
  { label: "Transport", value: "Légère, livrée avec sac de transport" },
  { label: "Lestage", value: "Sac de lestage en sable inclus" },
  { label: "Gonflage", value: "Pompe à main ou électrique" },
];

export default function TentesN() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Tentes gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Tentes en forme de N
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            La solution innovante et personnalisable pour vos événements. Un design original, 
            une résistance maximale et une personnalisation complète pour répondre à tous vos besoins.
          </p>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Tentes N en images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/ntent.jpg", alt: "Tente N Hallucine — vue de côté" },
              { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/761c537e749de68e706a65456057742.jpg", alt: "Tente N Volvo" },
              { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/Weixin%20Image_20240530160054.jpg", alt: "Tente N Hallucine — vue de face" },
              { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/Weixin%20Image_20240530160133.jpg", alt: "Tente N Hallucine — vue latérale" },
              { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/tentes-gonflables-n-croix-rouge.jpg", alt: "Tente N premiers secours Croix-Rouge" },
            ].map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-ivory mb-4">Schéma technique éclaté</h3>
            <img src="https://www.hallucinecran.com/Tentes/Tentes%20N/ntent%20eclate%20french.jpg" alt="Schéma éclaté technique tente gonflable N" className="w-full max-w-3xl mx-auto rounded" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Ultra-résistante */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Une tente ultra-résistante</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-white/70 leading-relaxed mb-4">
                La chambre étanche en polyuréthane (TPU) offre une autonomie exceptionnelle de 60 jours 
                sans regonflage. Les fermetures zippées double face permettent un accès facile et une 
                ventilation optimale.
              </p>
              <p className="text-white/70 leading-relaxed">
                Le toit en polyester hydrofuge protège contre les intempéries, tandis que la toile de 
                parachute renforcée assure une durabilité maximale. La double peau en polyuréthane Oxford 
                ignifugée garantit la sécurité incendie.
              </p>
            </div>
            <div>
              <p className="text-white/70 leading-relaxed mb-4">
                Avec leur design élégant et leurs pieds inclinés, les tentes N offrent un style unique 
                qui se démarque lors de vos événements. La structure est conçue pour résister aux conditions 
                les plus exigeantes.
              </p>
              <p className="text-white/70 leading-relaxed">
                Dimensions et personnalisations possibles selon vos besoins spécifiques. Contactez-nous 
                pour discuter de votre projet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personnalisation */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Personnalisation totale</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Toit personnalisable</h3>
              <p className="text-white/60 text-sm">Impression numérique haute qualité sur le toit pour une visibilité maximale de votre marque.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Murs et entrée</h3>
              <p className="text-white/60 text-sm">Personnalisez les murs et l'entrée avec vos couleurs, logos et messages publicitaires.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Couleur de structure</h3>
              <p className="text-white/60 text-sm">Choisissez la couleur de la structure gonflable pour s'harmoniser avec votre identité visuelle.</p>
            </div>
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
                    <td className="py-4 px-3 text-warm font-semibold w-48">{s.label}</td>
                    <td className="py-4 px-3 text-white/70">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Transport */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Transport et installation</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl">
            Légère et compacte, la tente N est livrée avec un sac de transport pour faciliter vos déplacements. 
            Le sac de lestage en sable est inclus pour assurer la stabilité. Le gonflage se fait avec une pompe 
            à main ou électrique en quelques minutes.
          </p>
        </div>
      </section>

      {/* Résumé */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">L'option idéale pour tous vos événements</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl">
            Que ce soit pour un salon professionnel, un festival, un événement sportif ou une campagne promotionnelle, 
            la tente N d'Hallucine offre le parfait équilibre entre design, résistance et personnalisation.
          </p>
          <div className="flex flex-wrap gap-4">
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
