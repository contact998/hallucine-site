/*
 * Page Devenir Distributeur — Contenu du site d'origine
 * Design: cinéma vintage — fond sombre, accents dorés
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Users, TrendingUp, Award, MessageCircle } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const avantages = [
  {
    icon: Award,
    title: "Des produits de haute qualité",
    desc: "Nos écrans et structures sont conçus pour offrir une expérience visuelle optimale, même dans des conditions extérieures difficiles.",
  },
  {
    icon: TrendingUp,
    title: "Un marché en pleine croissance",
    desc: "Le secteur des événements extérieurs et du cinéma en plein air est en constante évolution. Représenter Hallucine vous permet de capitaliser sur cette tendance.",
  },
  {
    icon: Users,
    title: "Un partenariat avec une marque innovante",
    desc: "Nous vous offrons un soutien marketing, des formations produit et un service après-vente dédié pour vous aider à réussir.",
  },
];

export default function DevenirDistributeur() {
  useDocumentMeta("Devenez Distributeur Hallucine", "Rejoignez le réseau de distributeurs Hallucine. Devenez revendeur d'écrans de cinéma gonflables et de produits événementiels.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HWQTHYrijbwFXBld.jpg");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Partenariat</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Devenez Distributeur<br />
            <span className="text-warm">Hallucine</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Devenir distributeur Hallucine, c'est rejoindre une marque dynamique et innovante, reconnue pour 
            la qualité de ses produits et son service client exceptionnel.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container max-w-4xl">
          <div className="space-y-6 text-white/70 leading-relaxed">
            <p>
              Nos écrans gonflables sont utilisés dans des projections de films en plein air, des événements sportifs, 
              des festivals, des événements d'entreprise et bien plus encore. En tant que distributeur Hallucine, 
              vous bénéficierez de nombreux avantages.
            </p>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-10">Pourquoi Devenir Distributeur Hallucine ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {avantages.map((a, i) => (
              <div key={i} className="p-8 bg-card border border-border rounded-lg">
                <a.icon className="w-10 h-10 text-warm mb-4" />
                <h3 className="text-ivory font-bold text-xl mb-4">{a.title}</h3>
                <p className="text-white/60 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment devenir distributeur */}
      <section className="py-16 bg-background">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-ivory mb-8">Comment Devenir Distributeur Hallucine ?</h2>
          <div className="space-y-6 text-white/70 leading-relaxed">
            <p>
              Si vous êtes intéressé par l'idée de devenir distributeur Hallucine, nous serions ravis de discuter avec vous. 
              Bien que notre réseau de distributeurs soit encore en construction, nous nous engageons à créer des partenariats 
              solides et durables.
            </p>
            <p>
              Actuellement, Hallucine est en pleine expansion et recherche activement des partenaires pour développer un réseau 
              de distributeurs pour nos écrans gonflables et solutions événementielles.
            </p>
            <p>
              Nous nous engageons à offrir des produits de qualité professionnelle pour des événements extérieurs, et nous 
              souhaitons collaborer avec des distributeurs passionnés et motivés pour représenter notre marque.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <MessageCircle className="w-12 h-12 text-warm mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-ivory mb-4">Intéressé ?</h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour en savoir plus et manifester votre intérêt à rejoindre notre réseau. 
            Hallucine propose des produits uniques et innovants pour des projections de films, des événements sportifs, 
            des festivals, et bien plus encore.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <a href="mailto:contact@hallucine.fr" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              contact@hallucine.fr
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
