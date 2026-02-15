/*
 * Page Trouver un Distributeur
 * Contenu du site d'origine — réseau en construction
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { MapPin, Phone, Mail } from "lucide-react";

export default function TrouverDistributeur() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Réseau</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Trouvez un Distributeur<br />
            <span className="text-warm">Hallucine</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            À la recherche de notre réseau de distributeurs pour vos événements extérieurs ?
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <div className="p-8 bg-card border border-border rounded-lg mb-12">
            <MapPin className="w-10 h-10 text-warm mb-4" />
            <h2 className="text-2xl font-bold text-ivory mb-4">Réseau en construction</h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                Actuellement, Hallucine est en pleine expansion et recherche activement des partenaires pour développer 
                un réseau de distributeurs pour nos écrans gonflables et solutions événementielles.
              </p>
              <p>
                Nous nous engageons à offrir des produits de qualité professionnelle pour des événements extérieurs, 
                et nous souhaitons collaborer avec des distributeurs passionnés et motivés pour représenter notre marque.
              </p>
              <p>
                Bien que nous n'ayons pas encore de distributeurs officiels à ce jour, nous vous encourageons à nous 
                contacter pour en savoir plus et manifester votre intérêt à rejoindre notre réseau.
              </p>
            </div>
          </div>

          {/* Contact direct */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-card border border-border rounded-lg">
              <Phone className="w-8 h-8 text-warm mb-4" />
              <h3 className="text-ivory font-bold text-lg mb-3">Contactez-nous directement</h3>
              <div className="space-y-2 text-white/60 text-sm">
                <p><strong className="text-white/80">Tél :</strong> +33 4 58 21 20 10</p>
                <p><strong className="text-white/80">Mobile :</strong> +33 6 80 14 76 94</p>
                <p><strong className="text-white/80">WhatsApp :</strong> +33 6 80 14 76 94</p>
                <p><strong className="text-white/80">WeChat :</strong> (+86) 13172020714</p>
              </div>
            </div>
            <div className="p-8 bg-card border border-border rounded-lg">
              <Mail className="w-8 h-8 text-warm mb-4" />
              <h3 className="text-ivory font-bold text-lg mb-3">Par email</h3>
              <p className="text-white/60 text-sm mb-4">
                Envoyez-nous un email pour toute demande d'information sur notre réseau de distribution.
              </p>
              <a href="mailto:contact@hallucine.fr" className="text-gold hover:underline text-sm">
                contact@hallucine.fr
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-white/60 mb-6">Vous souhaitez devenir distributeur Hallucine ?</p>
            <Link href="/devenir-distributeur" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Devenir Distributeur
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
