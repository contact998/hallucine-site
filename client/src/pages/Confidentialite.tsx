/*
 * Page Politique de Confidentialité — RGPD
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function Confidentialite() {
  useDocumentMeta("Politique de Confidentialité", "Politique de confidentialité d'Hallucine. Protection de vos données personnelles, cookies et droits RGPD.");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-12">Politique de confidentialité</h1>

          <div className="space-y-10 text-white/60 text-sm leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Collecte des données personnelles</h2>
              <p>
                Lorsque vous utilisez le formulaire de contact ou de demande de devis sur notre site, nous collectons les informations suivantes : nom, adresse email, numéro de téléphone (optionnel), nom de société (optionnel), pays et le contenu de votre message.
              </p>
              <p className="mt-3">
                Ces données sont collectées uniquement dans le but de répondre à votre demande et de vous fournir un devis personnalisé. Elles ne sont jamais vendues, louées ou partagées avec des tiers à des fins commerciales.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Finalité du traitement</h2>
              <p>Les données collectées sont utilisées exclusivement pour :</p>
              <ul className="mt-3 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span>Répondre à vos demandes de devis et de renseignements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span>Vous fournir un conseil technique adapté à votre projet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span>Assurer le suivi de votre commande le cas échéant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span>Améliorer notre service client</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Durée de conservation</h2>
              <p>
                Vos données personnelles sont conservées pendant une durée maximale de 3 ans à compter de votre dernière interaction avec nous (dernier email, dernière commande). Au-delà de cette période, vos données sont supprimées de nos systèmes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Vos droits (RGPD)</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants concernant vos données personnelles :
              </p>
              <ul className="mt-3 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span><strong className="text-white/80">Droit d'accès :</strong> vous pouvez demander à consulter les données que nous détenons sur vous</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span><strong className="text-white/80">Droit de rectification :</strong> vous pouvez demander la correction de données inexactes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span><strong className="text-white/80">Droit à l'effacement :</strong> vous pouvez demander la suppression de vos données</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span><strong className="text-white/80">Droit à la portabilité :</strong> vous pouvez demander à recevoir vos données dans un format structuré</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span><strong className="text-white/80">Droit d'opposition :</strong> vous pouvez vous opposer au traitement de vos données</span>
                </li>
              </ul>
              <p className="mt-3">
                Pour toute demande relative à vos données personnelles, vous pouvez nous contacter à l'adresse suivante :
              </p>
              <p className="mt-3">
                <strong className="text-white/80">Hallucine EURL</strong><br />
                350 Chemin du Pré Neuf<br />
                La Mure d'Isère 38350, France<br />
                Email : <a href="mailto:contact@hallucine.fr" className="text-gold hover:underline">contact@hallucine.fr</a>
              </p>
              <p className="mt-3">
                Nous nous engageons à répondre dans un délai de 30 jours.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Cookies</h2>
              <p>
                Ce site n'utilise pas de cookies de tracking ni de cookies publicitaires. Seuls des cookies techniques strictement nécessaires au fonctionnement du site peuvent être utilisés (préférences d'affichage, session de navigation).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Sécurité</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, toute modification, divulgation ou destruction. Les communications avec notre site sont chiffrées via le protocole HTTPS.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
              <p>
                Pour toute question relative à cette politique de confidentialité ou au traitement de vos données personnelles, contactez-nous :
              </p>
              <p className="mt-3">
                <strong className="text-white/80">Email :</strong> contact@hallucine.fr<br />
                <strong className="text-white/80">Objet :</strong> Données personnelles — [votre demande]
              </p>
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-white/30 text-xs">
                Dernière mise à jour : février 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
