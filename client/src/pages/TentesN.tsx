/*
 * Page Tentes N — Tentes en forme de N
 * Contenu complet du site d'origine hallucinecran.com
 * Design: cinéma vintage — fond sombre, accents dorés
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import WeatherEffect from "@/components/WeatherEffect";

const specs = [
  { label: "Chambre étanche", value: "Polyuréthane (TPU), autonomie de 60 jours une fois gonflée. Totalement étanche." },
  { label: "Fermetures", value: "Zippées double face — installation rapide des murs et de l'auvent" },
  { label: "Toit", value: "Polyester hydrofuge de haute qualité, résistant aux intempéries et à l'humidité" },
  { label: "Toile de parachute", value: "Renforcée pour une étanchéité optimale et une résistance accrue aux déchirures" },
  { label: "Double peau", value: "Polyuréthane Oxford ignifugée — sécurité incendie et protection contre l'humidité" },
  { label: "Personnalisation", value: "Toit, murs, entrée, et structure entièrement personnalisables" },
  { label: "Gonflage", value: "Pompe à main ou électrique pour un gonflage rapide et efficace" },
  { label: "Lestage", value: "Sac de lestage en sable inclus — assure une stabilité maximale" },
];

const features = [
  {
    title: "Chambre étanche en polyuréthane",
    desc: "La structure interne de la tente est fabriquée en polyuréthane (TPU), assurant une autonomie de 60 jours une fois gonflée. Cette chambre garantit une performance stable sur une période prolongée, idéale pour les événements à long terme."
  },
  {
    title: "Fermetures zippées double face",
    desc: "Permettent une installation rapide et sécurisée des murs ou de l'auvent de la tente, facilitant ainsi son montage."
  },
  {
    title: "Toit en polyester hydrofuge",
    desc: "Le toit est conçu avec un tissu hydrofuge de haute qualité, offrant une excellente résistance aux intempéries tout en maintenant une étanchéité parfaite."
  },
  {
    title: "Toile de parachute renforcée",
    desc: "La toile de parachute utilisée pour le toit renforce la résistance à l'eau et aux déchirures."
  },
  {
    title: "Double peau en polyuréthane Oxford",
    desc: "Ce matériau ignifugé assure non seulement la sécurité en cas de feu, mais également une protection supplémentaire contre l'humidité et les conditions climatiques difficiles."
  },
];

const images = [
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/ntent.jpg", alt: "Tente gonflable Hallucine modèle N vue de côté, de couleur blanche et bleue" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/761c537e749de68e706a65456057742.jpg", alt: "Tente gonflable Hallucine N personnalisée pour Volvo, installée en extérieur" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/Weixin%20Image_20240530160054.jpg", alt: "Vue de face d'une tente gonflable Hallucine modèle N, avec son entrée visible" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/Weixin%20Image_20240530160133.jpg", alt: "Vue latérale d'une tente gonflable Hallucine N, montrant sa forme distinctive en N" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20N/tentes-gonflables-n-croix-rouge.jpg", alt: "Tente gonflable Hallucine N utilisée comme poste de premiers secours par la Croix-Rouge" },
];

export default function TentesN() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <WeatherEffect intensity="moderate" />
        <div className="container relative z-10">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Tentes gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Tentes en forme de N<br />
            <span className="text-warm">La Solution Innovante et Personnalisable</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed mb-4">
            Découvrez la tente gonflable Hallucine N, un modèle unique qui allie design original, 
            résistance maximale et personnalisation complète. Idéale pour tous types d'événements extérieurs, 
            cette tente vous permet de vous démarquer tout en offrant une solution pratique et fiable.
          </p>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Tentes N en images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {images.map((img, i) => (
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
            <img src="https://www.hallucinecran.com/Tentes/Tentes%20N/ntent%20eclate%20french.jpg" alt="Schéma technique détaillé de la structure d'une tente gonflable Hallucine modèle N" className="w-full max-w-3xl mx-auto rounded" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Ultra-résistante — contenu détaillé du site d'origine */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Une Tente Gonflable Ultra-Résistante</h2>
          <p className="text-white/70 leading-relaxed mb-8 max-w-3xl">
            La tente gonflable N est conçue pour résister aux conditions les plus extrêmes. 
            Fabriquée avec des matériaux de haute qualité, elle offre une étanchéité parfaite 
            et une longévité exceptionnelle, même lors de vos événements en extérieur.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-warm font-semibold mb-3">{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personnalisation Totale */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Personnalisation Totale pour une Visibilité Maximale</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl leading-relaxed">
            La tente gonflable Hallucine N est 100% personnalisable pour refléter parfaitement l'image 
            de votre marque ou l'ambiance de votre événement.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Toit, murs et entrée personnalisables</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Choisissez les couleurs et le design que vous souhaitez pour chaque partie de la tente.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Couleur de la structure</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Personnalisez également la couleur de la structure gonflable pour l'adapter à votre thème.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Impression numérique</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Vous pouvez imprimer des logos, des visuels ou des messages publicitaires sur toutes les surfaces 
                de la tente, maximisant ainsi sa visibilité pendant votre événement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transport et installation */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Une Tente Facile à Transporter et à Installer</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl leading-relaxed">
            La tente gonflable Hallucine N est non seulement robuste, mais aussi très pratique à transporter 
            et à installer. Sa légèreté et ses accessoires inclus font d'elle une solution idéale pour vos événements extérieurs.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Légère et facile à transporter</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Malgré sa grande taille, la tente reste relativement légère et se plie facilement pour un transport simplifié. 
                Elle est livrée dans un sac de transport adapté.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Sac de lestage en sable</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Pour assurer la stabilité de la tente, un système de lestage en sable est inclus. 
                Il se place sous la tente et se fixe solidement grâce à des sangles.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Pompe à main ou électrique</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Pour un gonflage rapide, la tente est équipée d'une pompe manuelle ou électrique, 
                ce qui facilite grandement l'installation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Caractéristiques techniques */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Caractéristiques Techniques de la Tente Gonflable N</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-3xl">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-warm font-semibold w-48">{s.label}</td>
                    <td className="py-4 px-4 text-white/70">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Fiabilité, Expertise, Qualité */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Fiabilité, Expertise, Qualité</h2>
          <p className="text-white/60 mb-8 max-w-3xl leading-relaxed">
            Chez Hallucine, nous nous engageons à fournir des structures gonflables qui incarnent les valeurs de fiabilité, 
            d'expertise, et de qualité. Conçus pour répondre aux attentes les plus élevées, nos produits vous offrent 
            la tranquillité d'esprit lors de chaque utilisation.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Fiabilité</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                La fiabilité est au cœur de notre démarche. Nos structures sont fabriquées avec des matériaux de haute qualité, 
                tels que le Dacron 420 pour les cadres et le tissu Dacron 220 résistant aux intempéries.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Expertise</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Plus de 30 ans d'expérience dans la conception de structures gonflables. 
                Notre équipe vous accompagne de la conception à l'installation.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Qualité</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                La qualité est non négociable pour nous. Du tissu pour auvent ultra-résistant aux lumières LED intégrées 
                pour une visibilité accrue, chaque détail est pensé pour offrir une expérience utilisateur optimale. 
                Nos accessoires personnalisables vous permettent d'adapter votre structure à vos besoins spécifiques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Intéressé par nos tentes N ?</h2>
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
