/*
 * Page À propos
 * Histoire, valeurs, équipe, chiffres clés
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const chiffres = [
  { value: "30+", label: "Années d'expérience" },
  { value: "1000+", label: "Écrans vendus" },
  { value: "60+", label: "Pays livrés" },
  { value: "10 ans", label: "Garantie" },
];

export default function APropos() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Notre histoire</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            À propos<br />
            <span className="text-warm">d'Hallucine</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Depuis 1995, Hallucine conçoit et fabrique des écrans de cinéma gonflables, des tentes événementielles 
            et du mobilier gonflable. Nous sommes le fabricant des écrans gonflables les plus légers au monde.
          </p>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {chiffres.map((c) => (
              <div key={c.label} className="text-center p-6 bg-card border border-border rounded-lg">
                <p className="text-warm text-3xl md:text-4xl font-bold mb-2">{c.value}</p>
                <p className="text-white/60 text-sm">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Notre histoire</h2>
          <div className="max-w-3xl space-y-6">
            <p className="text-white/70 leading-relaxed">
              Fondée en 1995, Hallucine est née de la passion pour le cinéma en plein air et de l'innovation 
              dans les structures gonflables. Notre fondateur a eu la vision de créer des écrans de projection 
              qui soient à la fois légers, faciles à transporter et résistants aux conditions extérieures.
            </p>
            <p className="text-white/70 leading-relaxed">
              Au fil des années, nous avons développé une technologie unique utilisant du tissu airbag automobile, 
              ce qui nous permet de proposer des écrans jusqu'à 3 fois plus légers que ceux de nos concurrents. 
              Cette innovation a fait notre réputation dans le monde entier.
            </p>
            <p className="text-white/70 leading-relaxed">
              Aujourd'hui, Hallucine est présent dans plus de 60 pays et a vendu plus de 1000 écrans à travers 
              le monde. Notre gamme s'est élargie pour inclure des tentes événementielles, des arches gonflables 
              et du mobilier gonflable, toujours avec la même exigence de qualité et d'innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Nos valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-bold text-xl mb-4">Fiabilité</h3>
              <p className="text-white/60 leading-relaxed">
                Nous utilisons des matériaux de haute qualité testés dans les conditions les plus exigeantes. 
                Chaque produit est contrôlé individuellement avant expédition. Notre garantie de 10 ans sur 
                les écrans témoigne de notre confiance dans nos produits.
              </p>
            </div>
            <div className="p-8 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-bold text-xl mb-4">Expertise</h3>
              <p className="text-white/60 leading-relaxed">
                Plus de 30 ans d'expérience dans la conception de structures gonflables. Notre équipe d'ingénieurs 
                et de techniciens vous accompagne de la conception à l'installation. Nous connaissons les défis 
                de chaque type d'événement.
              </p>
            </div>
            <div className="p-8 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-bold text-xl mb-4">Qualité</h3>
              <p className="text-white/60 leading-relaxed">
                Contrôles de qualité rigoureux à chaque étape de la fabrication. Nos matériaux sont sélectionnés 
                pour leur durabilité et leur résistance. Nous ne faisons aucun compromis sur la qualité, même 
                pour notre gamme économique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Innovation continue</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-warm font-semibold text-lg mb-3">Technologie tissu airbag</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Notre innovation majeure : l'utilisation de tissu airbag automobile pour nos écrans gonflables. 
                Ce matériau offre un rapport résistance/poids imbattable, ce qui rend nos écrans jusqu'à 3 fois 
                plus légers que la concurrence.
              </p>
              <h3 className="text-warm font-semibold text-lg mb-3">Écrans étanches</h3>
              <p className="text-white/70 leading-relaxed">
                Notre technologie d'écran étanche à l'air permet un fonctionnement silencieux sans souffleur 
                permanent. Un seul gonflage suffit pour toute la durée de l'événement.
              </p>
            </div>
            <div>
              <h3 className="text-warm font-semibold text-lg mb-3">Personnalisation avancée</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Impression numérique haute définition sur tous nos produits. Nous pouvons personnaliser 
                dimensions, couleurs, logos et visuels pour répondre exactement à vos besoins.
              </p>
              <h3 className="text-warm font-semibold text-lg mb-3">Engagement environnemental</h3>
              <p className="text-white/70 leading-relaxed">
                Nos produits sont conçus pour durer. La légèreté de nos écrans réduit l'empreinte carbone 
                du transport. Nous travaillons continuellement à réduire notre impact environnemental.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Travaillons ensemble</h2>
          <p className="text-white/60 mb-8">Contactez-nous pour discuter de votre projet.</p>
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
