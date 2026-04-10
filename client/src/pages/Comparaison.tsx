/*
 * Page Comparaison Écrans Gonflables — Hallucine vs Concurrent
 * Design: cartes côte à côte "VS" — fonds CLAIRS, icônes colorées, contraste fort
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmCountdown from "@/components/FilmCountdown";
import { Link } from "wouter";
import { useState } from "react";
import { Check, X, Trophy, Feather, Clock, Shield, Wind, Truck, Wrench, Leaf, Users, Mountain, Package, Ruler, Star } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

const comparisonData = [
  { carac: "Légèreté", hallucine: "3 fois plus léger (ex : 13m = 80 kg)", concurrent: "Jusqu'à 260 kg", icon: Feather },
  { carac: "Matériau Structure", hallucine: "Polyamide noir haute ténacité (DuPont de Nemours)", concurrent: "Matériaux traditionnels plus lourds (bâche PVC)", icon: Shield },
  { carac: "Logistique", hallucine: "Voiture break — 80 kg emballé dans un sac de 1,4 m", concurrent: "Camion avec hayon — Flycase 260 kg + 50 kg = 310 kg", icon: Truck },
  { carac: "Toile de Projection", hallucine: "Pas besoin de la retirer, lavable en machine (8 kg)", concurrent: "Doit être retirée après chaque séance, entretien complexe", icon: Wrench },
  { carac: "Stockage", hallucine: "Sac de transport compact, rétractation ultra-rapide", concurrent: "Stockage volumineux et encombrant (flycase)", icon: Package },
  { carac: "Résistance au Vent", hallucine: "Flexible, résiste à des vents jusqu'à 38 km/h (6 Beaufort)", concurrent: "Plus vulnérable aux rafales, structure rigide", icon: Wind },
  { carac: "Temps d'Installation", hallucine: "1 personne / 45 min — structure légère et toile pré-positionnée", concurrent: "4 personnes / 60 min — poids et montage complexe", icon: Clock },
  { carac: "Démontage", hallucine: "30 min — 1 personne — pas besoin de retirer la toile", concurrent: "120 min — 4 personnes — retrait de la toile avec 200 élastiques", icon: Clock },
  { carac: "Polyvalence", hallucine: "Installable sur toits, bateaux, zones inaccessibles — sans engins de levage", concurrent: "Nécessite transpalette, chariot élévateur, grue, etc.", icon: Mountain },
  { carac: "Garantie", hallucine: "10 ans sans frais supplémentaires", concurrent: "Limitée à 2 ans, extensions coûteuses", icon: Star },
  { carac: "Expérience", hallucine: "30 ans d'expertise, événements mondiaux", concurrent: "Expérience variable selon l'entreprise", icon: Trophy },
  { carac: "Sécurité du Personnel", hallucine: "Réduit les risques de blessures et d'arrêts (TMS)", concurrent: "Effort physique important et risques accrus", icon: Users },
  { carac: "Flexibilité Structurelle", hallucine: "Conception flexible, plie sous le vent", concurrent: "Conception rigide, moins adaptée aux conditions venteuses", icon: Wind },
  { carac: "Impact sur les sites", hallucine: "Impact minimal : monuments historiques, pelouses de stades...", concurrent: "Impact maximal sur les sites de projection", icon: Mountain },
  { carac: "Empreinte Carbone", hallucine: "500 kg CO₂", concurrent: "1 200 kg CO₂", icon: Leaf },
  { carac: "Confort de Manipulation", hallucine: "Toile souple de 210 g", concurrent: "Toile rigide de 600 g", icon: Ruler },
];

const arguments7 = [
  {
    num: "1",
    title: "Légèreté et Mobilité",
    text: "Les écrans gonflables Hallucine sont 3 fois plus légers que les produits concurrents, ce qui facilite leur transport et leur installation. Vous pouvez transporter un écran de 13 mètres avec une voiture break, sans nécessiter un camion lourd. Cela réduit les coûts logistiques et le besoin d'équipements encombrants."
  },
  {
    num: "2",
    title: "Installation et Démontage Rapides",
    text: "Grâce à la structure légère et à la toile de projection facile à manipuler, le montage d'un écran Hallucine ne prend que 45 minutes avec une seule personne. Le démontage est tout aussi simple et rapide. À l'inverse, les concurrents demandent jusqu'à 4 personnes et 2 heures pour installer et retirer l'écran."
  },
  {
    num: "3",
    title: "Confort et Sécurité",
    text: "La légèreté des écrans Hallucine réduit les efforts physiques et diminue les risques de blessures (notamment les TMS), contribuant ainsi au bien-être des équipes. Les écrans concurrents, plus lourds et plus complexes à manipuler, augmentent le stress physique et les risques d'accidents."
  },
  {
    num: "4",
    title: "Polyvalence et Accessibilité",
    text: "Les écrans Hallucine sont adaptés à des installations dans des lieux atypiques comme sur des toits ou des bateaux, sans nécessiter d'engins de manutention lourds (comme des chariots élévateurs ou des grues). Ce qui les rend idéals pour les événements dans des endroits difficiles d'accès."
  },
  {
    num: "5",
    title: "Entretien Simplifié",
    text: "Notre toile de projection ne nécessite pas d'être retirée après chaque projection et est lavable en machine (8 kg), ce qui simplifie grandement l'entretien. Contrairement à la concurrence, où la toile doit être retirée manuellement, avec de nombreux élastiques et un entretien plus complexe."
  },
  {
    num: "6",
    title: "Résistance au Vent et Durabilité",
    text: "L'écran Hallucine est conçu pour résister aux vents allant jusqu'à 38 km/h grâce à sa structure flexible. Les écrans concurrents, plus rigides, sont moins résistants aux rafales et peuvent être vulnérables en conditions venteuses."
  },
  {
    num: "7",
    title: "Garantie et Service",
    text: "Nous offrons une garantie de 10 ans sur tous nos écrans, sans frais supplémentaires. Les écrans concurrents ont une garantie limitée à 2 ans, avec des extensions souvent coûteuses."
  },
];

export default function Comparaison() {
  useDocumentMeta("Comparaison des Écrans Gonflables | Guide d'Achat", "Comparez nos écrans de cinéma gonflables : géant vs étanche vs économique. Tableau comparatif de 16 critères pour choisir le bon écran.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vajzfoYsbBMsDfIq.webp");

  const [showCountdown, setShowCountdown] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="comparaison-page"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: "Comparaison", url: "https://hallucinecran.fr/comparaison" },
        ]}
        page={{
          name: "Comparaison des Écrans Gonflables | Guide d'Achat",
          description: "Comparez nos écrans de cinéma gonflables : géant vs étanche vs économique. Tableau comparatif de 16 critères pour choisir le bon écran.",
          url: "https://hallucinecran.fr/comparaison",
        }}
        faqs={arguments7.map((arg) => ({
          question: arg.title,
          answer: arg.text,
        }))}
      />
      {showCountdown && <FilmCountdown onComplete={() => setShowCountdown(false)} />}
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Écrans gonflables</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Comparaison des<br />
            <span className="text-warm">Écrans Géants Gonflables</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Découvrez pourquoi les écrans Hallucine surpassent la concurrence sur tous les critères : 
            légèreté, installation, garantie, empreinte carbone et bien plus encore.
          </p>
        </div>
      </section>

      {/* Tableau comparatif visuel */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Tableau Comparatif Détaillé</h2>
          <p className="text-white/60 mb-10 max-w-3xl">
            16 critères passés au crible pour vous aider à faire le bon choix.
          </p>

          {/* En-tête du tableau */}
          <div className="hidden md:grid md:grid-cols-[2fr_3fr_3fr] gap-0 mb-1">
            <div className="p-4 bg-warm/20 rounded-tl-lg">
              <span className="text-warm font-bold text-sm uppercase tracking-wider">Critère</span>
            </div>
            <div className="p-4 bg-warm/20 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warm" />
              <span className="text-warm font-bold text-sm uppercase tracking-wider">Hallucine</span>
            </div>
            <div className="p-4 bg-white/5 rounded-tr-lg">
              <span className="text-white/40 font-bold text-sm uppercase tracking-wider">Concurrent</span>
            </div>
          </div>

          {/* Lignes du tableau */}
          <div className="space-y-px">
            {comparisonData.map((row, i) => {
              const Icon = row.icon;
              return (
                <div
                  key={i}
                  className={`grid grid-cols-1 md:grid-cols-[2fr_3fr_3fr] gap-0 ${
                    i % 2 === 0 ? "bg-card" : "bg-card/60"
                  } ${i === comparisonData.length - 1 ? "rounded-b-lg" : ""}`}
                >
                  {/* Critère */}
                  <div className="p-4 flex items-center gap-3 border-b border-white/5 md:border-b-0 md:border-r md:border-r-white/5">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-warm/15 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-warm" />
                    </div>
                    <span className="font-semibold text-ivory text-sm">{row.carac}</span>
                  </div>

                  {/* Hallucine */}
                  <div className="p-4 flex items-start gap-3 border-b border-white/5 md:border-b-0 md:border-r md:border-r-white/5 bg-green-950/10">
                    <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm leading-relaxed">{row.hallucine}</span>
                  </div>

                  {/* Concurrent */}
                  <div className="p-4 flex items-start gap-3 bg-red-950/10">
                    <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-white/50 text-sm leading-relaxed">{row.concurrent}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7 arguments détaillés */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">Pourquoi Choisir un Écran Gonflable Hallucine ?</h2>
          <p className="text-white/60 mb-12 max-w-3xl">
            Voici les 7 raisons principales qui font des écrans Hallucine le choix numéro un 
            des professionnels de l'événementiel dans le monde entier.
          </p>
          <div className="space-y-8 max-w-4xl">
            {arguments7.map((arg) => (
              <div key={arg.num} className="flex gap-6 p-6 bg-card border border-border rounded-lg">
                <div className="shrink-0 w-12 h-12 rounded-full bg-warm/20 flex items-center justify-center">
                  <span className="text-warm font-bold text-lg">{arg.num}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ivory mb-3">{arg.title}</h3>
                  <p className="text-white/65 leading-relaxed">{arg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bénéfices */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Bénéfices pour vos événements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Ambiance unique</h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Créez une ambiance unique pour vos projections ou présentations. 
                L'écran gonflable géant transforme n'importe quel lieu en salle de cinéma.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Intérieur et extérieur</h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Convient aux événements en plein air comme en intérieur. 
                Festivals, drive-in, mariages, conférences, lancements de produits.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">Image professionnelle</h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Impressionnez vos invités avec un matériel professionnel et esthétique. 
                30 ans d'expertise au service de vos événements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Convaincu ?</h2>
          <p className="text-white/65 mb-8 max-w-xl mx-auto">
            Découvrez notre gamme complète d'écrans ou demandez un devis personnalisé.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/ecran-gonflable" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Voir les écrans
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demander un Devis
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-white/20 text-white/70 font-semibold rounded hover:bg-white/5 transition-colors">
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
