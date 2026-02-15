/*
 * Page Tentes X — Tentes événementielles en forme de X
 * Contenu complet du site d'origine hallucinecran.com
 * Design: cinéma vintage — fond sombre, accents dorés
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import WeatherEffect from "@/components/WeatherEffect";

const tailles = ["3m × 3m", "4m × 4m", "5m × 5m", "6m × 6m", "7m × 7m", "8m × 8m"];

const specs = [
  { label: "Boudins", value: "TPU 100% étanches à l'air, protégés par une couche de Dacron haute résistance" },
  { label: "Embase", value: "PVC renforcé avec revêtement antidérapant pour une meilleure stabilité" },
  { label: "Valve", value: "Valve de surpression sur chaque boudin pour éviter toute surpression" },
  { label: "Couture", value: "Double couture avec point zigzag pour garantir la solidité de l'assemblage" },
  { label: "Entoilage", value: "Polyester enduit 350 gr/m² pour une couverture robuste et résistante" },
  { label: "Bâche latérale", value: "Ripstop résistant aux déchirures, idéal pour l'impression numérique" },
  { label: "Jonction", value: "Aluminium — permet de démonter les quatre boudins indépendamment et de les maintenir solidement grâce à des profilés en aluminium" },
];

const accessoires = [
  { name: "Mur de porte", desc: "Accès facile avec fermeture zippée" },
  { name: "Mur courbe", desc: "Design arrondi pour une esthétique unique" },
  { name: "Auvent", desc: "Extension couverte pour plus d'espace" },
  { name: "Mur latéral", desc: "Protection complète contre le vent" },
  { name: "Mur de fenêtre", desc: "Lumière naturelle avec protection" },
  { name: "Tissu de connexion", desc: "Reliez plusieurs tentes entre elles" },
  { name: "Sac de transport", desc: "Transport facile et rangement compact" },
  { name: "Sacs de sable", desc: "Lestage pour stabilité maximale" },
  { name: "Lumière LED", desc: "Éclairage intégré pour vos événements nocturnes" },
  { name: "Pompe électrique", desc: "Gonflage rapide et sans effort" },
  { name: "Pompe manuelle", desc: "Solution de secours toujours disponible" },
  { name: "Valves supplémentaires", desc: "Pièces de rechange pour la maintenance" },
  { name: "Kit de réparation", desc: "Pour les interventions rapides sur le terrain" },
  { name: "Système d'ancrage", desc: "Fixation au sol renforcée" },
];

const images = [
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/tente-x.jpg", alt: "Tente gonflable X — vue de côté" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/671bade5ef4fb27a93d3034de910dc4.jpg", alt: "Tente gonflable X — vue de face" },
  { src: "https://www.hallucinecran.com/Tentes/Tentes%20X/1078c8cca1c101dbe2d41d70cadf4a0.jpg", alt: "Tentes gonflables X personnalisables" },
  { src: "https://www.hallucinecran.com/Tentes/xtent-1.jpg", alt: "Tente gonflable X Hallucine" },
];

export default function TentesX() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <WeatherEffect intensity="moderate" />
        <div className="container relative z-10">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Tentes gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Tentes événementielles<br />
            <span className="text-warm">en forme de X</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed mb-4">
            La tente gonflable Hallucine X est une solution innovante, pratique, simple à installer et à transporter 
            pour vos événements. Disponible de 3×3m à 8×8m, elle s'adapte à tous vos besoins.
          </p>
          <p className="text-white/50 text-base max-w-3xl leading-relaxed">
            Conçue pour résister aux conditions les plus exigeantes, la tente X combine robustesse, légèreté 
            et personnalisation complète pour offrir une expérience unique à vos clients.
          </p>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Tentes X en images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {images.map((img, i) => (
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

      {/* Design et résistance — contenu détaillé du site d'origine */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Un design pratique et résistant</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <p className="text-white/70 leading-relaxed">
                La structure de la tente est composée de <strong className="text-ivory">quatre boudins indépendants en TPU 100% étanches à l'air</strong>, 
                insérés dans des tubes en Dacron résistants. Le Dacron est un tissu hautement résistant utilisé pour les voiles de bateau, 
                assurant ainsi une solidité exceptionnelle et une résistance aux déchirures.
              </p>
              <p className="text-white/70 leading-relaxed">
                La couverture en <strong className="text-ivory">polyester enduit</strong> est personnalisable selon vos besoins, 
                elle est facilement démontable, vous permettant de changer rapidement l'apparence de votre tente.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-warm font-semibold text-lg">Système fiable et facile à entretenir</h3>
              <p className="text-white/70 leading-relaxed">
                La tente gonflable X offre une <strong className="text-ivory">valve de gonflage et un système de surpression</strong> sur chaque boudin 
                pour assurer une sécurité maximale et un gonflage rapide.
              </p>
              <ul className="space-y-3 text-white/70 text-sm">
                <li className="flex gap-2">
                  <span className="text-warm shrink-0">•</span>
                  <span><strong className="text-ivory">Facilité de maintenance :</strong> Grâce à des fermetures à glissière sur les tubes en Dacron, vous pouvez facilement accéder aux boudins pour toute opération de réparation ou remplacement.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-warm shrink-0">•</span>
                  <span><strong className="text-ivory">Personnalisation rapide :</strong> Le revêtement extérieur est indépendant de la structure gonflable, vous permettant de modifier facilement le visuel de la tente à tout moment.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Stabilité */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-ivory mb-4">Accessoires et Stabilité Optimisés</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              Pour garantir la stabilité de votre structure, plusieurs systèmes de lestage sont disponibles, 
              notamment des <strong className="text-ivory">sacs de lestage en sable</strong> qui se fixent sous les boudins grâce à des sangles solides. 
              Ce système permet de maintenir votre tente en place, même par vent fort.
            </p>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex gap-2">
                <span className="text-warm shrink-0">•</span>
                <span><strong className="text-ivory">Fixation pratique :</strong> Des attaches sont intégrées sur les boudins pour faciliter l'ajout de poids de lestage ou d'accessoires.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-warm shrink-0">•</span>
                <span><strong className="text-ivory">Jonction en aluminium :</strong> Le nouveau système de jonction en partie haute permet de démonter les quatre boudins indépendamment et de les maintenir solidement grâce à des profilés en aluminium.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Personnalisation complète */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Personnalisation Complète</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl leading-relaxed">
            La tente gonflable Hallucine X se distingue par sa capacité de personnalisation complète. 
            Que vous souhaitiez afficher votre logo ou un visuel impactant, cette tente vous offre de nombreuses possibilités.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Toit personnalisé</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                La sérigraphie ou l'impression numérique vous permettent de créer des visuels uniques sur le toit de votre tente.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Rideaux en Ripstop</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Imprimez vos visuels en quadrichromie sur les rideaux en Ripstop pour une visibilité maximale.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Structure colorée</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Personnalisez la couleur de la structure gonflable elle-même pour l'adapter à votre thème ou votre marque.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Caractéristiques techniques */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Caractéristiques Techniques</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-3xl">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-warm font-semibold w-44">{s.label}</td>
                    <td className="py-4 px-4 text-white/70">{s.value}</td>
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
              <div key={t} className="p-4 bg-card border border-border rounded-lg text-center hover:border-warm/40 transition-colors">
                <p className="text-warm font-semibold text-lg">{t}</p>
              </div>
            ))}
          </div>
          <p className="text-white/50 text-sm mt-4">
            Choisissez la taille idéale pour votre événement. Chaque taille est disponible avec l'ensemble des options de personnalisation.
          </p>
        </div>
      </section>

      {/* Accessoires */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Accessoires disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {accessoires.map((a) => (
              <div key={a.name} className="p-4 bg-card border border-border rounded-lg hover:border-warm/40 transition-colors">
                <p className="text-ivory font-medium text-sm mb-1">{a.name}</p>
                <p className="text-white/50 text-xs">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Configuration des côtés */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Configuration des côtés</h2>
          <p className="text-white/70 mb-8 max-w-3xl leading-relaxed">
            Vous pouvez configurer chaque côté de la tente avec différents éléments. Maximum 4 éléments au total 
            (hors tissus de connexion). Si un côté a un tissu de connexion, ce côté ne peut pas avoir de porte ou 
            d'auvent (et vice-versa).
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Côté avant</h3>
              <p className="text-white/60 text-sm">Options : Mur de porte, Mur courbe, Auvent</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Côté droit</h3>
              <p className="text-white/60 text-sm">Options : Mur latéral, Mur de porte, Mur de fenêtre, Mur courbe, Auvent, Tissu de connexion</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Côté arrière</h3>
              <p className="text-white/60 text-sm">Options : Mur latéral, Mur de porte, Mur de fenêtre, Mur courbe, Auvent, Tissu de connexion</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Côté gauche</h3>
              <p className="text-white/60 text-sm">Options : Mur latéral, Mur de porte, Mur de fenêtre, Mur courbe, Auvent, Tissu de connexion</p>
            </div>
          </div>
          <p className="text-white/50 text-xs mt-4">
            Note : Les tailles 3×3 et 4×4 sont limitées à 1 mur de porte maximum. Les autres tailles peuvent avoir jusqu'à 2 murs de porte.
          </p>
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
                Chaque tente est testée avant expédition pour garantir une performance optimale.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Expertise</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Plus de 30 ans d'expérience dans la conception de structures gonflables. Notre équipe vous conseille 
                pour trouver la solution idéale adaptée à vos besoins spécifiques.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Qualité</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                La qualité est non négociable pour nous. Du tissu pour auvent ultra-résistant aux lumières LED intégrées 
                pour une visibilité accrue, chaque détail est pensé pour offrir une expérience utilisateur optimale. 
                Nos accessoires personnalisables vous permettent d'adapter votre structure à vos besoins spécifiques 
                tout en conservant une esthétique professionnelle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* En résumé */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">En résumé</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl leading-relaxed">
            La tente gonflable Hallucine X est la solution parfaite pour vos événements extérieurs. 
            Elle combine praticité, solidité, et personnalisation pour offrir une expérience unique à vos clients. 
            Légère, résistante et rapide à installer, elle est le choix idéal pour les professionnels de l'événementiel.
          </p>
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
