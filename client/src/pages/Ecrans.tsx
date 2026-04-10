/*
 * Page Hub Écrans Gonflables
 * Redirige vers les 3 sous-pages : Géant (soufflerie), Étanche, Économique
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmCountdown from "@/components/FilmCountdown";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { detectLanguage } from "@/i18n/config";
import { getRoute } from "@/i18n/routes";

const gammes = [
  {
    title: "Écran Gonflable Géant (Soufflerie)",
    desc: "De 8m à 24m de large. Utilise un souffleur permanent pour maintenir la structure. Tissu polyamide d'airbag automobile — jusqu'à 3× plus léger que la concurrence. Idéal pour les grands événements, festivals, drive-in.",
    href: "/ecran-gonflable-geant-soufflerie",
    highlight: "8m à 24m — Le plus grand écran gonflable au monde",
  },
  {
    title: "Écran Gonflable Étanche (sans soufflerie)",
    desc: "De 3m à 10m de large. Technologie à chambre à air scellée — un seul gonflage suffit, pas de bruit, pas d'électricité permanente. Tissu polyamide de kitesurf. Parfait pour les soirées privées, hôtels, camping.",
    href: "/ecran-gonflable-etanche-air",
    highlight: "3m à 10m — Silencieux, sans électricité",
  },
  {
    title: "Écran Économique",
    desc: "Solution abordable pour les budgets serrés. Disponible avec ou sans souffleur. Qualité professionnelle à prix accessible. Idéal pour les associations, les collectivités et les premiers équipements.",
    href: "/ecran-gonflable-economique",
    highlight: "Solution accessible — Qualité professionnelle",
  },
  {
    title: "Comparaison Hallucine vs Concurrent",
    desc: "Tableau comparatif détaillé : légèreté, installation, garantie, empreinte carbone. Découvrez pourquoi Hallucine surpasse la concurrence sur tous les critères.",
    href: "/comparaison-ecran-gonflable",
    highlight: "3× plus léger — 10 ans de garantie — 500 kg CO₂",
  },
  {
    title: "Écrans LED (Nouveau)",
    desc: "Notre nouvelle gamme d'écrans LED pour des projections visibles même en plein jour. Haute luminosité, installation rapide, qualité d'image exceptionnelle.",
    href: "/ecrans-led",
    highlight: "Projections de jour et de nuit",
  },
];

const faqItems = [
  {
    q: "Quelle est la différence entre un écran étanche et un écran soufflerie ?",
    a: "L'écran étanche utilise une chambre à air scellée : vous le gonflez une fois, il reste en forme toute la soirée sans électricité ni bruit. L'écran soufflerie utilise un souffleur permanent qui maintient l'air en continu — nécessaire pour les très grands formats (au-delà de 8m) où la pression d'air doit être constante."
  },
  {
    q: "Pourquoi vos écrans sont-ils 3× plus légers que la concurrence ?",
    a: "La concurrence utilise principalement de la bâche PVC. Nous utilisons deux tissus techniques : un polyamide étanche inspiré du kitesurf pour la gamme étanche, et un polyamide haute ténacité de DuPont de Nemours (le tissu des airbags automobiles) pour la gamme soufflerie."
  },
  {
    q: "Quelle taille d'écran choisir pour mon événement ?",
    a: "La distance maximale de visionnage confortable est d'environ 6 à 8 fois la largeur de l'écran. Pour 100 personnes, un écran de 3 à 5m suffit. Pour 500 personnes, visez 8 à 12m. Pour 1000+ personnes, il faut 15m ou plus."
  },
  {
    q: "Les écrans résistent-ils au vent ?",
    a: "Oui. Les écrans étanches résistent à des vents de 40 à 50 km/h. Les écrans soufflerie résistent à des vents de 50 à 60 km/h. Au-delà, nous recommandons de dégonfler l'écran par précaution."
  },
  {
    q: "Peut-on projeter en rétroprojection ?",
    a: "Oui. Tous nos écrans sont conçus pour la projection frontale et la rétroprojection. La toile de projection est amovible et réversible."
  },
  {
    q: "Quelle est la garantie ?",
    a: "Tous nos écrans sont garantis 10 ans sur la structure gonflable. La toile de projection est garantie 5 ans."
  },
];

export default function Ecrans() {
  const lang = detectLanguage();
  useDocumentMeta("Écrans de Cinéma Gonflables", "Découvrez notre gamme complète d'écrans de cinéma gonflables. Écrans géants, étanches, économiques — de 3m à 24m. Fabricant depuis 1995.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vajzfoYsbBMsDfIq.webp");

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(true);

  const ecransFaqs = faqItems.map(f => ({ question: f.q, answer: f.a }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="ecrans"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Écrans Gonflables", url: "/ecran-gonflable" },
        ]}
        product={{
          name: "Écrans de Cinéma Gonflables Hallucine",
          description: "Gamme complète d'écrans de cinéma gonflables de 3m à 24m. Technologie étanche et soufflerie. 3× plus légers que la concurrence. Garantie 10 ans.",
          image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vajzfoYsbBMsDfIq.webp",
          url: "/ecran-gonflable",
          category: "Écrans de cinéma gonflables",
          minPrice: 990,
        }}
        faqs={ecransFaqs}
      />
      {showCountdown && <FilmCountdown onComplete={() => setShowCountdown(false)} />}
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Écrans de cinéma gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            L'écran de cinéma<br />
            <span className="text-warm">le plus léger au monde</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            De 3 mètres à 24 mètres de large. Nos écrans utilisent des tissus techniques issus du kitesurf 
            et de l'industrie automobile pour être jusqu'à 3 fois plus légers que la concurrence. 
            Garantis 10 ans. Fabriqués depuis 1995.
          </p>
        </div>
      </section>

      {/* Les 3 gammes */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Nos gammes d'écrans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {gammes.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group p-8 bg-card border border-border rounded-lg card-hover block"
              >
                <h3 className="text-xl font-bold text-ivory mb-3 group-hover:text-warm transition-colors">
                  {g.title}
                </h3>
                <p className="text-warm text-sm font-medium mb-3">{g.highlight}</p>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{g.desc}</p>
                <span className="inline-flex items-center gap-2 text-warm text-sm font-medium">
                  Voir les détails <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Pourquoi choisir Hallucine ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "3× plus léger", desc: "Tissus techniques de kitesurf et d'airbag automobile au lieu de bâche PVC." },
              { title: "Garantie 10 ans", desc: "Structure gonflable garantie 10 ans, toile de projection garantie 5 ans." },
              { title: "Montage rapide", desc: "5 à 45 minutes selon la taille. Pas d'engin de levage, même pour le 24m." },
              { title: "Livraison mondiale", desc: "Plus de 60 pays livrés. Délai 2 à 4 semaines. Formalités douanières gérées." },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-warm font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
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
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Prêt à équiper votre événement ?</h2>
          <p className="text-white/60 mb-8">Contactez-nous pour un devis personnalisé ou consultez nos tarifs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={getRoute("contact", lang)} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href={getRoute("contact", lang)} className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demande de prix
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
