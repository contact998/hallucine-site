/*
 * Page Mentions Légales — Contenu texte structuré
 * Informations officielles du site d'origine hallucinecran.com
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

export default function MentionsLegales() {
  useDocumentMeta("Mentions Légales", "Mentions légales du site Hallucine. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation.");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="mentions-legales"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Mentions Légales", url: "/mentions-legales" },
        ]}
        page={{
          name: "Mentions légales",
          description: "Mentions légales du site Hallucine. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation.",
          url: "https://hallucine.ai/mentions-legales",
        }}
      />
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-12">Mentions légales</h1>

          <div className="space-y-10 text-white/60 text-sm leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">1. Informations légales</h2>
              <p>
                <strong className="text-white/80">Raison sociale :</strong> Hallucine EURL
              </p>
              <p className="mt-2">
                <strong className="text-white/80">Adresse :</strong> 350 Chemin du Pré Neuf, La Mure d'Isère 38350, France
              </p>
              <p className="mt-2">
                <strong className="text-white/80">Numéro SIREN :</strong> 387770084
              </p>
              <p className="mt-2">
                <strong className="text-white/80">Capital social :</strong> 7 622,45 € (fixe)
              </p>
              <p className="mt-2">
                <strong className="text-white/80">Numéro de TVA intracommunautaire :</strong> FR31387770084
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">2. Directeur de la publication</h2>
              <p>
                Le directeur de la publication du site internet est <strong className="text-white/80">Daniel Chesneau</strong>, en qualité de Dirigeant.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">3. Hébergement du site</h2>
              <p>
                <strong className="text-white/80">Hébergeur :</strong> Manus
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">4. Propriété intellectuelle</h2>
              <p>
                Le contenu du site, incluant les textes, images, logos, graphismes, vidéos, ainsi que le design du site, 
                est la propriété exclusive de Hallucine EURL. Toute reproduction, distribution, ou utilisation sans 
                autorisation est strictement interdite.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">5. Données personnelles</h2>
              <p>
                Nous respectons la confidentialité de vos données personnelles. Les informations collectées via notre site 
                sont traitées dans le respect de la législation en vigueur, y compris le RGPD (Règlement Général sur la 
                Protection des Données). Pour plus d'informations, consultez notre page{" "}
                <Link href="/politique-confidentialite" className="text-gold hover:underline">
                  Politique de Confidentialité
                </Link>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">6. Conditions d'utilisation</h2>
              <p>
                L'accès au site est soumis aux présentes conditions d'utilisation. En naviguant sur notre site, 
                vous acceptez sans réserve ces conditions. Nous nous réservons le droit de modifier ces conditions à tout moment.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">7. Responsabilité</h2>
              <p>
                Hallucine EURL met tout en œuvre pour offrir des informations fiables et à jour sur son site internet. 
                Cependant, nous ne saurions être tenus responsables des erreurs, omissions, ou inexactitudes présentes 
                sur le site, ni des éventuels problèmes techniques liés à l'utilisation de celui-ci.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">8. Cookies</h2>
              <p>
                Le site utilise des cookies pour améliorer l'expérience utilisateur et analyser la fréquentation. 
                Vous pouvez gérer vos préférences en matière de cookies dans les paramètres de votre navigateur. 
                Pour plus d'informations, consultez notre{" "}
                <Link href="/politique-cookies" className="text-gold hover:underline">
                  Politique de Cookies
                </Link>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">9. Contact</h2>
              <p>
                Pour toute question relative aux mentions légales, vous pouvez nous contacter :
              </p>
              <p className="mt-2">
                <strong className="text-white/80">Email :</strong>{" "}
                <a href="mailto:contact@hallucine.fr" className="text-gold hover:underline">contact@hallucine.fr</a>
              </p>
              <p className="mt-2">
                <strong className="text-white/80">Téléphone :</strong> +33 4 58 21 20 10
              </p>
              <p className="mt-2">
                <strong className="text-white/80">Mobile :</strong> +33 6 80 14 76 94
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
