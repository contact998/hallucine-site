/*
 * Page Hub Tentes, Arches & Mobilier
 * Redirige vers les sous-pages spécifiques
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

const categories = [
  {
    title: "Tentes X",
    desc: "Tentes gonflables en forme de X. Design unique, installation rapide, personnalisation complète. Disponibles de 3m à 8m.",
    href: "/tente-gonflable-x",
  },
  {
    title: "Tentes N",
    desc: "Tentes gonflables en forme de N. Structure robuste et élégante pour événements professionnels. Plusieurs tailles disponibles.",
    href: "/tente-gonflable-n",
  },
  {
    title: "Tentes V",
    desc: "Tentes gonflables en forme de V. Élégance et praticité combinées pour vos événements en plein air.",
    href: "/tente-gonflable-v",
  },
  {
    title: "Tentes Araignées",
    desc: "Tentes araignées gonflables avec pieds gonflables pour une stabilité exceptionnelle. De 4m à 10m de diamètre.",
    href: "/tente-gonflable-araignee",
  },
  {
    title: "Arches Gonflables",
    desc: "Arches gonflables personnalisables de 4m à 12m de large. Étanches — un seul gonflage suffit. Idéales pour événements sportifs et promotionnels.",
    href: "/arche-gonflable",
  },
  {
    title: "Mobilier Gonflable",
    desc: "Canapés, fauteuils, bars et comptoirs gonflables. Technologie étanche, design élégant, personnalisation possible.",
    href: "/mobilier-gonflable",
  },
];

export default function Tentes() {
  useDocumentMeta("Tentes Gonflables Événementielles", "Tentes gonflables pour événements : tentes X, N, V et araignées. Montage rapide, personnalisables, résistantes au vent. Fabricant depuis 1995.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/eZVHaksoPSdOKbyX.jpg");

  return (
    <div className="min-h-screen bg-background text-foreground">
        <PageStructuredData
          id="tentes-hub-page"
          breadcrumbs={[
            { name: "Accueil", url: "https://hallucinecran.fr" },
            { name: "Tentes, Arches & Mobilier Gonflable", url: "https://hallucinecran.fr/tentes-gonflables" },
          ]}
          page={{
            name: "Tentes Gonflables Événementielles",
            description: "Tentes gonflables pour événements : tentes X, N, V et araignées. Montage rapide, personnalisables, résistantes au vent. Fabricant depuis 1995.",
            url: "https://hallucinecran.fr/tentes-gonflables",
          }}
        />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Structures gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Tentes, Arches &<br />
            <span className="text-warm">Mobilier Gonflable</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Découvrez notre gamme complète de structures gonflables pour événements. Tentes en X, N, V et araignées, 
            arches personnalisables et mobilier gonflable. Toutes nos structures utilisent une technologie étanche 
            à chambre à air scellée pour un montage rapide et sans soufflerie.
          </p>
        </div>
      </section>

      {/* Grille des catégories */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group p-8 bg-card border border-border rounded-lg card-hover block"
              >
                <h2 className="text-xl font-bold text-ivory mb-3 group-hover:text-warm transition-colors">
                  {cat.title}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{cat.desc}</p>
                <span className="inline-flex items-center gap-2 text-warm text-sm font-medium">
                  Voir les détails <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages communs */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Pourquoi choisir Hallucine ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Technologie étanche", desc: "Chambre à air scellée — un seul gonflage suffit, pas de soufflerie permanente." },
              { title: "Installation rapide", desc: "Montage en quelques minutes par 1 à 2 personnes, sans outils spéciaux." },
              { title: "Personnalisation", desc: "Impression de logos, choix de couleurs, dimensions sur mesure." },
              { title: "Garantie 10 ans", desc: "Matériaux de haute qualité testés pour durer. SAV et pièces détachées." },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-warm font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Besoin d'aide pour choisir ?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Contactez-nous pour un conseil personnalisé. Nous vous aiderons à choisir la structure 
            la plus adaptée à votre événement.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demande de prix
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
