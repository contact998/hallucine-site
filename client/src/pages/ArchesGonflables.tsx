/*
 * Page Arches Gonflables
 * Tarifs complets, specs, FAQ, accessoires
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

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
  useDocumentMeta("Arches Gonflables | Arches Publicitaires", "Arches gonflables personnalisables pour événements sportifs, salons et promotions. Impression haute définition, montage rapide.");

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="arches-gonflables"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: "Structures gonflables", url: "https://hallucinecran.fr/" },
          { name: "Arches Gonflables", url: "https://hallucinecran.fr/arches-gonflables" },
        ]}
        product={{
          name: "Arches Gonflables Personnalisées pour Événements",
          description: "Les arches gonflables sont des éléments incontournables pour vos événements sportifs, expositions, et campagnes promotionnelles. Faciles à personnaliser, elles offrent une visibilité accrue grâce à leur grande taille et leur design adaptable. De 4m à 12m de large.",
          image: [
            "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/msjlSvvcXPPgZNDW.png",
            "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/qaWexEDLrhQudeax.png",
            "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CZcgjOTtIqUOapyp.jpg",
            "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/zbkdmCgoFZLzrsJh.jpg",
          ],
          url: "https://hallucinecran.fr/arches-gonflables",
          category: "Structures gonflables",
          minPrice: 790,
        }}
        faqs={faqItems.map(item => ({ question: item.q, answer: item.a }))}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
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
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/zbkdmCgoFZLzrsJh.jpg", alt: "Arche gonflable blanche décorée motifs floraux" },
            ].map((img, i) => (
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

      {/* Gamme d'arches (2 col) + FAQ (1 col) — 3 colonnes */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-10 items-center">
            {/* Colonnes 1-2 : Gamme d'arches */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-ivory mb-4">
                Gamme d'arches <span className="text-warm">gonflables</span>
              </h2>
              <p className="text-white/60 mb-2 text-sm">Tissu blanc + vessie TPU. Les arches sont étanches — un seul gonflage suffit.</p>
              <p className="text-white/60 mb-6 text-sm">11 références disponibles, de 4m à 12m de large. Diamètre maximal : 90 cm.</p>
              <div className="grid grid-cols-2 gap-4">
                {/* Moitié gauche du tableau */}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-warm/30">
                      <th className="text-left py-3 px-3 text-warm font-semibold">Référence</th>
                      <th className="text-left py-3 px-3 text-warm font-semibold">Taille</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archesData.slice(0, 6).map((row, i) => (
                      <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 text-ivory font-medium text-xs">{row.ref}</td>
                        <td className="py-2 px-3 text-white/70 text-xs">{row.taille}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Moitié droite du tableau */}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-warm/30">
                      <th className="text-left py-3 px-3 text-warm font-semibold">Référence</th>
                      <th className="text-left py-3 px-3 text-warm font-semibold">Taille</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archesData.slice(6).map((row, i) => (
                      <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 text-ivory font-medium text-xs">{row.ref}</td>
                        <td className="py-2 px-3 text-white/70 text-xs">{row.taille}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Colonne 3 : FAQ */}
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-6">
                Questions <span className="text-warm">Fréquentes</span>
              </h2>
              <div className="space-y-3">
                {faqItems.map((item, i) => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-ivory font-medium text-sm pr-3">{item.q}</span>
                      <ChevronDown className={`w-4 h-4 text-warm shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4">
                        <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
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

      {/* Caractéristiques techniques — 2 colonnes texte + image */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Colonne texte */}
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-6">
                Caractéristiques <span className="text-warm">Techniques</span>
              </h2>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-warm/10 text-warm flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M8 9l-1 1m8 8l1-1M9 16l-1-1M15 9l1 1" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ivory">Matériaux</h4>
                    <p className="text-sm">Tissu Oxford 600D et PVC renforcé pour une durabilité maximale.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-warm/10 text-warm flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ivory">Impression</h4>
                    <p className="text-sm">Impression numérique haute définition pour des couleurs vives et un rendu professionnel.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-warm/10 text-warm flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ivory">Installation</h4>
                    <p className="text-sm">Montage rapide en moins de 10 minutes avec une pompe électrique.</p>
                  </div>
                </li>
              </ul>
            </div>
            {/* Colonne image */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/YJjWvVqVqZqJzZqJ.jpg" alt="Détails techniques d'une arche gonflable" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Prêt à créer votre arche ?</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Contactez-nous dès aujourd'hui pour un devis personnalisé et donnez vie à votre projet.
          </p>
          <Link href="/contact" className="inline-block bg-warm text-charcoal-dark font-semibold py-3 px-8 rounded-lg hover:bg-warm/90 transition-colors">
            Demander un devis
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
