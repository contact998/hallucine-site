/*
 * Page Écrans LED — En construction
 * Design: cinéma vintage — fond sombre, accents dorés
 * Contenu du site d'origine hallucinecran.com
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Construction } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

const ledImages = [
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/cNgCebtnqSvVUvmF.webp", alt: "Écran LED gonflable Hallucine de 5m pour projection de jour comme de nuit" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/dAPzbTqdeJCYzZGT.webp", alt: "Écran LED gonflable Hallucine de 4m avec haute luminosité pour événements" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/eqozEqSIUbdLwesq.webp", alt: "Démonstration du montage rapide d'un écran LED gonflable Hallucine en extérieur" },
];

export default function EcransLED() {
  useDocumentMeta("Écrans LED Événementiels", "Écrans LED pour événements en plein air et intérieur. Solutions d'affichage haute luminosité pour concerts, festivals et événements corporate.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vajzfoYsbBMsDfIq.webp");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="ecrans-led"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: "Écrans LED", url: "https://hallucinecran.fr/ecrans-led" }
        ]}
        product={{
          name: "Écrans LED Événementiels",
          description: "Découvrez notre nouvelle gamme d\'écrans LED pour des projections visibles même en plein jour. Haute luminosité, installation rapide, qualité d\'image exceptionnelle.",
          image: ledImages.map(img => img.src),
          url: "https://hallucinecran.fr/ecrans-led",
          category: "Écrans LED",
          minPrice: 4990,
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Nouvelle gamme</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Écrans LED<br />
            <span className="text-warm">Projections de jour et nuit</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Découvrez notre nouvelle gamme d'écrans LED pour des projections visibles même en plein jour. 
            Haute luminosité, installation rapide, qualité d'image exceptionnelle.
          </p>
        </div>
      </section>

      {/* Images */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            {ledImages.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="text-white text-xs p-3 opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* En construction */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <Construction className="w-16 h-16 text-warm mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-ivory mb-4">Page en construction</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto leading-relaxed">
            Cette page est en cours de développement. Contactez-nous pour plus d'informations 
            sur notre gamme d'écrans LED ou pour obtenir un devis personnalisé.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demander un Devis
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
