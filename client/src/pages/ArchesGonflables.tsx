/*
 * Page Arches Gonflables
 * Tarifs complets, specs, FAQ, accessoires
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ConfettiEffect from "@/components/ConfettiEffect";

const archesData = [
  { ref: "CA-4/2.6/0.45", taille: "400×260(H)×45cm" },
  { ref: "CA-5/3.2/0.6", taille: "500×320(H)×60cm" },
  { ref: "CA-6/3.8/0.6", taille: "600×380(H)×60cm" },
  { ref: "CA-6/3.8/0.8", taille: "600×380(H)×80cm" },
  { ref: "CA-8/4.6/0.8", taille: "800×460(H)×80cm" },
  { ref: "CA-8/4.8/0.9", taille: "800×480(H)×90cm" },
  { ref: "CA-10/4.8/0.8", taille: "1000×480(H)×80cm" },
  { ref: "CA-10/4.8/0.9", taille: "1000×480(H)×90cm" },
  { ref: "CA-10/5.8/0.9", taille: "1000×580(H)×90cm" },
  { ref: "CA-12/4.8/0.9", taille: "1200×480(H)×90cm" },
  { ref: "CA-12/5.8/0.9", taille: "1200×580(H)×90cm" },
];

const accessoires = [
  { ref: "CA-EP", nom: "Pompe électrique", desc: "Prises en fonction de votre pays" },
  { ref: "CA-HP", nom: "Pompe manuelle", desc: "Utilisation extérieur" },
  { ref: "CA-ACC-1", nom: "Cordes/Piquets", desc: "Pour la sécurité et la stabilité" },
  { ref: "CA-ACC-2", nom: "Valve de rechange", desc: "Standby application" },
];

const faqItems = [
  {
    q: "Quelle est la durée de vie d'une arche gonflable ?",
    a: "Avec un entretien approprié, nos arches peuvent durer plusieurs années grâce à leur conception robuste en PVC renforcé et tissu Oxford."
  },
  {
    q: "Est-ce que les arches sont personnalisables ?",
    a: "Oui, toutes nos arches peuvent être personnalisées avec votre logo, vos couleurs et vos messages. Impression numérique haute définition disponible."
  },
  {
    q: "Que faire en cas de vent fort ?",
    a: "Nos arches sont fournies avec des sacs de sable et des chevilles pour assurer leur stabilité. En cas de conditions climatiques extrêmes, il est recommandé de les dégonfler temporairement."
  },
];

export default function ArchesGonflables() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <ConfettiEffect />
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Structures gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Arches Gonflables<br />
            <span className="text-warm">Personnalisées pour Événements</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Les arches gonflables sont des éléments incontournables pour vos événements sportifs, expositions, 
            et campagnes promotionnelles. Faciles à personnaliser, elles offrent une visibilité accrue grâce à 
            leur grande taille et leur design adaptable. De 4m à 12m de large.
          </p>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Nos arches en images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/msjlSvvcXPPgZNDW.png", alt: "Arche gonflable cinéma en plein air avec écran de projection" },
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/qaWexEDLrhQudeax.png", alt: "Arche gonflable colorée pour arrivée de course sportive" },
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CZcgjOTtIqUOapyp.jpg", alt: "Arche gonflable bleue et rouge pour entrée de projection" },
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/dRuvKidcdjNXhYOn.jpg", alt: "Arche gonflable personnalisée Bienvenue pour événement" },
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/zbkdmCgoFZLzrsJh.jpg", alt: "Arche gonflable blanche décorée motifs floraux" },
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/PccZsJjRQKmTphXx.jpg", alt: "Arche gonflable bleue SKYGO pour événement corporate" },
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/eWinssACUrKSNlmM.jpg", alt: "Arche gonflable bleue SKYGO en cours d'installation" },
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/QBUmTczXjVzScxWG.jpg", alt: "Arche gonflable Hallucine modèle standard gris" },
            ].map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modèles */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Modèles disponibles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Arche standard</h3>
              <p className="text-white/60 text-sm leading-relaxed">Design simple et épuré. Disponible en différentes tailles de 4m à 12m. Idéale pour des événements sportifs ou comme point d'entrée.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Arche personnalisée</h3>
              <p className="text-white/60 text-sm leading-relaxed">Formes et designs sur mesure. Impression de logos ou slogans pour vos campagnes marketing. Compatible avec des systèmes d'éclairage intégrés.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Arche à plusieurs pieds</h3>
              <p className="text-white/60 text-sm leading-relaxed">Offre une meilleure stabilité. Parfaite pour les conditions météorologiques difficiles. Conçue pour des utilisations prolongées.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs arches */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Gamme d'arches gonflables</h2>
          <p className="text-white/60 mb-2 text-sm">Tissu blanc + vessie TPU. Les arches sont étanches — un seul gonflage suffit.</p>
          <p className="text-white/60 mb-8 text-sm">11 références disponibles, de 4m à 12m de large. Diamètre maximal : 90 cm.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">Référence</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Taille</th>
                </tr>
              </thead>
              <tbody>
                {archesData.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-ivory font-medium">{row.ref}</td>
                    <td className="py-3 px-3 text-white/70">{row.taille}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Accessoires */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Accessoires</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-3xl">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">Référence</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Nom</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {accessoires.map((a, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-ivory font-medium">{a.ref}</td>
                    <td className="py-3 px-3 text-white/70">{a.nom}</td>
                    <td className="py-3 px-3 text-white/60 text-xs">{a.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Caractéristiques */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Caractéristiques techniques</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Matériaux", desc: "PVC renforcé ou tissu Oxford, résistant aux intempéries." },
              { title: "Personnalisation", desc: "Impression numérique haute définition sur toute la surface." },
              { title: "Installation", desc: "Système de gonflage rapide (moins de 5 minutes)." },
              { title: "Accessoires inclus", desc: "Ventilateur électrique, sacs de sable, cordes et chevilles." },
              { title: "Durabilité", desc: "Résistantes aux UV et aux déchirures." },
              { title: "Étanchéité", desc: "Un seul gonflage suffit — pas de souffleur permanent nécessaire." },
            ].map((item) => (
              <div key={item.title} className="p-5 bg-card border border-border rounded-lg">
                <h3 className="text-warm font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Applications possibles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Événements sportifs</h3>
              <p className="text-white/60 text-sm">Portique pour les départs et arrivées de courses. Points d'entrée pour les compétitions en plein air.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Expositions et foires</h3>
              <p className="text-white/60 text-sm">Signalétique pour guider les visiteurs. Décorations promotionnelles pour stands.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Publicité mobile</h3>
              <p className="text-white/60 text-sm">Supports pour campagnes publicitaires locales ou itinérantes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Questions fréquentes</h2>
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
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Besoin d'une arche gonflable ?</h2>
          <p className="text-white/60 mb-8">Contactez-nous pour un devis personnalisé ou consultez nos tarifs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/tarifs-ecran-gonflable" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demande de prix
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
