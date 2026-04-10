
/*
 * Page Tentes Araignées Gonflables
 * Contenu complet du site d'origine hallucinecran.com
 * Design: cinéma vintage — fond sombre, accents dorés
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

const tailles = [
  { dim: "4m × 4m", poids: "~50 kg", montage: "10-15 min" },
  { dim: "6m × 6m", poids: "~60 kg", montage: "10-15 min" },
  { dim: "8m × 8m", poids: "~70 kg", montage: "10-15 min" },
  { dim: "10m × 10m", poids: "~80 kg", montage: "15 min" },
];


const faqItems = [
  {
    q: "Qu'est-ce qu'une tente araignée gonflable ?",
    a: "Une tente araignée gonflable est une structure gonflable unique, idéale pour des événements extérieurs tels que des projections de films, des festivals, ou des événements sportifs. Ces tentes sont dotées de pieds gonflables qui assurent leur stabilité, même par temps venteux, et leur forme distinctive ressemble à celle d'une toile d'araignée."
  },
  {
    q: "Quels sont les avantages d'une tente araignée gonflable ?",
    a: "Les tentes araignées gonflables offrent de nombreux avantages pour les événements en plein air : installation rapide (moins de 15 minutes), stabilité exceptionnelle grâce aux pieds gonflables, résistance aux UV et à l'eau, grande mobilité grâce à un poids réduit, et personnalisation complète."
  },
  {
    q: "Combien de temps faut-il pour installer une tente araignée gonflable ?",
    a: "Nos tentes araignées gonflables sont conçues pour une installation rapide en moins de 30 minutes. Vous n'avez besoin d'aucun équipement lourd, tout se fait simplement avec un souffleur intégré. Le processus peut être réalisé par une seule personne."
  },
];

const images = [
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/KGkXbQCcXEGqyaSz.webp", alt: "Tente araignée gonflable bleue installée sur l'herbe pour un événement en plein air" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/zlXEEbFQipJgezJx.webp", alt: "Tente araignée gonflable avec des parois latérales jaunes, créant un espace abrité" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/NNxCkFqPVeqmFjFC.webp", alt: "Tente araignée gonflable de couleur verte, se fondant dans un décor naturel" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/uOKkoMGgvsDEguJm.webp", alt: "Tente araignée gonflable noire personnalisée avec le logo 'Ealing Eagles', utilisée pour un événement sportif" },
];

export default function TentesAraignees() {
  useDocumentMeta("Tente Gonflable Araignée | Tente Spider", "Tente gonflable araignée (spider) pour événements. Design unique, montage ultra-rapide, résistante au vent. Disponible en plusieurs tailles et couleurs.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/TVmrusoKmXcTvkKP.webp");

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="tentes-araignees"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: "Tentes gonflables", url: "https://hallucinecran.fr/tentes-gonflables" },
          { name: "Tente Araignée Gonflable", url: "https://hallucinecran.fr/tentes-araignees" },
        ]}
        product={{
          name: "Tente Araignée Gonflable",
          description: "Tente gonflable araignée (spider) pour événements. Design unique, montage ultra-rapide, résistante au vent. Disponible en plusieurs tailles et couleurs.",
          image: images.map(img => img.src),
          url: "https://hallucinecran.fr/tentes-araignees",
          category: "Tentes gonflables",
          minPrice: 990,
        }}
        faqs={faqItems.map(item => ({ question: item.q, answer: item.a }))}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <div className="container relative z-10">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Tentes gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Tente Araignée Gonflable<br />
            <span className="text-warm">Solution Idéale pour vos Événements</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed mb-4">
            Nos tentes araignées gonflables combinent un design unique avec une facilité d'installation 
            remarquable. Disponibles de 4m à 10m de diamètre, elles s'adaptent à tous vos événements extérieurs.
          </p>
          <p className="text-white/50 text-base max-w-3xl leading-relaxed">
            Fabriquées avec des matériaux résistants aux UV et à l'eau, nos tentes assurent une protection 
            fiable contre les intempéries pendant vos événements.
          </p>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Tentes Araignées en images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi choisir */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Pourquoi Choisir nos Tentes Araignées Gonflables ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Installation rapide</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Installation rapide en moins de 30 minutes. Vous n'avez besoin d'aucun équipement lourd, 
                tout se fait simplement avec un souffleur intégré.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Protection fiable</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Fabriquées avec des matériaux résistants aux UV et à l'eau, nos tentes assurent une protection 
                fiable contre les intempéries pendant vos événements.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Tailles adaptées</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Choisissez la taille idéale pour votre événement : de 4m à 10m de diamètre. 
                Nos tentes sont adaptées pour des festivals, projections de films en plein air, ou des salons professionnels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tailles et specs */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Tailles et Spécifications</h2>
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
          <h2 className="text-3xl font-bold text-ivory mb-8">Caractéristiques Techniques</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Pieds gonflables</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Pieds gonflables pour une stabilité exceptionnelle, même sur terrain irrégulier et par temps venteux.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Personnalisation complète</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Impression de logos et visuels sur le toit, les pieds, le PVC des pieds, les couvertures des zips et les murs.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Murs et auvents</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Options pour les murs (standard, porte, fenêtre) et auvents avec bannière, pieds, PVC et tissu personnalisables.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Accessoires complets</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Sac de transport, pompes (électrique et manuelle), sacs de sable/eau, lumière LED, kit de réparation, 
                système d'ancrage, tapis de sol, système de connexion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Applications Idéales</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Projections de films</h3>
              <p className="text-white/60 text-sm">Créez un espace couvert unique pour vos projections en plein air.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Festivals</h3>
              <p className="text-white/60 text-sm">Structure originale et robuste pour vos festivals et concerts.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Salons professionnels</h3>
              <p className="text-white/60 text-sm">Stand d'exposition élégant pour vos salons et foires commerciales.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Événements sportifs</h3>
              <p className="text-white/60 text-sm">Zones VIP, points de ravitaillement, espaces d'accueil.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Questions Fréquentes (FAQ)</h2>
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
          <h2 className="text-3xl font-bold text-ivory mb-4">Demandez un Devis pour votre Tente Araignée</h2>
          <p className="text-white/60 mb-8">Contactez-nous pour un devis personnalisé adapté à vos besoins.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Demande de devis
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Voir Nos Tarifs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
