/*
 * Page Mentions Légales — Contenu texte structuré
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-12">Mentions légales</h1>

          <div className="space-y-10 text-white/60 text-sm leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Éditeur du site</h2>
              <p>
                Le site hallucine.fr est édité par Hallucine, entreprise spécialisée dans la conception et la fabrication d'écrans de cinéma gonflables, de tentes gonflables et de mobilier gonflable.
              </p>
              <p className="mt-3">
                <strong className="text-white/80">Responsable de la publication :</strong> Le fondateur d'Hallucine<br />
                <strong className="text-white/80">Email :</strong> contact@hallucine.fr<br />
                <strong className="text-white/80">Téléphone :</strong> +33 (0)6 XX XX XX XX
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Hébergement</h2>
              <p>
                Ce site est hébergé par Manus.<br />
                Les données sont stockées sur des serveurs sécurisés.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, marques) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable d'Hallucine.
              </p>
              <p className="mt-3">
                Les photographies de produits présentes sur ce site sont la propriété d'Hallucine. Elles ne peuvent être utilisées à des fins commerciales sans autorisation.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Limitation de responsabilité</h2>
              <p>
                Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement mis à jour. Toutefois, des erreurs ou omissions peuvent survenir. Hallucine ne saurait être tenu responsable des erreurs, d'une absence de disponibilité des informations ou de la présence de virus sur ce site.
              </p>
              <p className="mt-3">
                Les prix, caractéristiques techniques et disponibilités des produits présentés sur ce site sont donnés à titre indicatif et peuvent être modifiés sans préavis. Seul le devis personnalisé envoyé par email fait foi.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Liens hypertextes</h2>
              <p>
                Ce site peut contenir des liens vers d'autres sites internet. Hallucine ne dispose d'aucun moyen de contrôle sur le contenu de ces sites tiers et n'assume aucune responsabilité quant à leur contenu.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Droit applicable</h2>
              <p>
                Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
