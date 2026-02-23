/*
 * Page Politique de Cookies — Contenu du site d'origine
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

export default function PolitiqueCookies() {
  useDocumentMeta("Politique de Cookies", "Politique de cookies du site Hallucine. Informations sur les cookies utilisés et gestion de vos préférences.");

  return (
    <div className="min-h-screen bg-background text-foreground">
        <PageStructuredData
          id="politique-cookies"
          page={{
            name: "Politique de Cookies",
            description: "Politique de cookies du site Hallucine. Informations sur les cookies utilisés et gestion de vos préférences.",
            url: "/politique-cookies",
          }}
          breadcrumbs={[
            { name: "Accueil", url: "/" },
            { name: "Politique Cookies", url: "/politique-cookies" },
          ]}
        />
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-12">Politique de Cookies — Hallucine</h1>

          <div className="space-y-10 text-white/60 text-sm leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Introduction</h2>
              <p>
                Nous utilisons des cookies sur notre site web pour améliorer l'expérience de nos utilisateurs, 
                analyser notre trafic et personnaliser le contenu et les publicités. En naviguant sur notre site, 
                vous acceptez l'utilisation de cookies conformément à cette politique. Découvrez comment nous utilisons 
                les cookies et comment vous pouvez les gérer.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">1. Qu'est-ce qu'un cookie ?</h2>
              <p>
                Un cookie est un petit fichier texte qui est stocké sur votre appareil lorsque vous visitez un site web. 
                Ils servent à mémoriser certaines informations concernant vos préférences et à vous offrir une expérience 
                utilisateur plus fluide.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">2. Types de cookies utilisés</h2>
              <div className="space-y-4">
                <p>
                  <strong className="text-white/80">Cookies nécessaires :</strong> Ces cookies sont essentiels au fonctionnement 
                  de notre site et ne peuvent pas être désactivés dans nos systèmes.
                </p>
                <p>
                  <strong className="text-white/80">Cookies de performance :</strong> Ces cookies collectent des informations 
                  sur la manière dont vous utilisez notre site, par exemple, les pages les plus visitées. Ils aident à améliorer 
                  la performance du site.
                </p>
                <p>
                  <strong className="text-white/80">Cookies fonctionnels :</strong> Ces cookies permettent de mémoriser vos 
                  préférences pour personnaliser votre expérience sur notre site.
                </p>
                <p>
                  <strong className="text-white/80">Cookies publicitaires :</strong> Ces cookies sont utilisés pour afficher 
                  des publicités pertinentes en fonction de vos intérêts.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">3. Gestion des cookies</h2>
              <p>
                Vous pouvez gérer vos préférences de cookies en utilisant notre gestionnaire de cookies ou en modifiant 
                les paramètres de votre navigateur. Vous pouvez refuser l'utilisation des cookies, mais certaines 
                fonctionnalités du site peuvent ne pas être disponibles si vous choisissez de désactiver certains cookies.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">4. Consentement</h2>
              <p>
                Lorsque vous naviguez sur notre site, un bandeau de cookies s'affiche pour vous demander votre consentement 
                avant d'activer certains cookies. Vous pouvez modifier vos préférences à tout moment.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">5. Mise à jour de cette politique</h2>
              <p>
                Cette politique de cookies peut être mise à jour périodiquement pour refléter des modifications dans la 
                législation ou nos pratiques. Nous vous informerons de tout changement en mettant à jour la date de la 
                dernière révision en bas de cette page.
              </p>
              <p className="mt-4 text-white/40 italic">
                Dernière mise à jour : 7 décembre 2024.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
