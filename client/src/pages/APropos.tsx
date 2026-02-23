/*
 * Page À propos — Histoire de Daniel et Hallucine
 * Contenu fidèle au site d'origine hallucinecran.com
 * Design: cinéma vintage — fond sombre, accents dorés
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";

const chiffres = [
  { value: "25+", label: "Années d'expérience" },
  { value: "1000+", label: "Écrans vendus" },
  { value: "30+", label: "Pays visités" },
  { value: "1992", label: "Année de création" },
];

export default function APropos() {
  useDocumentMeta("À Propos | L'Histoire d'Hallucine", "Découvrez l'histoire d'Hallucine, fabricant français d'écrans de cinéma gonflables depuis 1995. Notre passion, notre savoir-faire, notre équipe.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/XoVIsDKghhCzbhqj.webp");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="a-propos-hallucine"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "À propos", url: "/a-propos-hallucine" },
        ]}
        page={{
          name: "À Propos | L'Histoire d'Hallucine",
          description: "Découvrez l'histoire d'Hallucine, fabricant français d'écrans de cinéma gonflables depuis 1995. Notre passion, notre savoir-faire, notre équipe.",
          url: "https://hallucine.com/a-propos-hallucine",
        }}
        article={{
          headline: "L'histoire de Hallucine",
          description: "Depuis plus de 25 ans, Hallucine conçoit et fabrique des écrans de cinéma gonflables, des tentes événementielles et du mobilier gonflable. Une aventure familiale née de la passion pour le cinéma et la projection en plein air.",
          image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/XoVIsDKghhCzbhqj.webp",
          url: "https://hallucine.com/a-propos-hallucine",
          datePublished: "1992-01-01T00:00:00Z",
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Notre histoire</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            L'histoire<br />
            <span className="text-warm">de Hallucine</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Depuis plus de 25 ans, Hallucine conçoit et fabrique des écrans de cinéma gonflables, 
            des tentes événementielles et du mobilier gonflable. Une aventure familiale née de la passion 
            pour le cinéma et la projection en plein air.
          </p>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {chiffres.map((c) => (
              <div key={c.label} className="text-center p-6 bg-card border border-border rounded-lg">
                <p className="text-warm text-3xl md:text-4xl font-bold mb-2">{c.value}</p>
                <p className="text-white/60 text-sm">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* L'histoire de Daniel */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">L'histoire de Hallucine</h2>
          <div className="max-w-4xl space-y-8">
            <div className="p-8 bg-card border border-border rounded-lg">
              <p className="text-warm font-semibold text-lg mb-4 italic">
                "Salut ! Je m'appelle Daniel."
              </p>
              <p className="text-white/70 leading-relaxed">
                Il y a plus de 25 ans, j'ai fondé Hallucine. Voici mon histoire...
              </p>
            </div>

            <div>
              <h3 className="text-warm font-semibold text-xl mb-4">Chapitre un : Les débuts</h3>
              <p className="text-white/70 leading-relaxed">
                Un jour, en lisant un journal, j'ai découvert une petite entreprise qui faisait des projections 16mm. 
                Ça m'a intrigué. Peu après, quelqu'un m'a demandé un projecteur pour un film 35mm. Je lui en ai vendu un.
              </p>
              <p className="text-white/70 leading-relaxed mt-4">
                C'était en <strong className="text-ivory">1992</strong>. À partir de ce moment, je me suis lancé dans l'industrie de la projection 
                et du cinéma. Et pour accompagner les projecteurs, j'avais besoin d'écrans. C'est ainsi qu'est née 
                <strong className="text-ivory"> Hallucine</strong>. J'avais 36 ans.
              </p>
            </div>

            <div>
              <h3 className="text-warm font-semibold text-xl mb-4">Chapitre deux : Une vie d'entreprise</h3>
              <p className="text-white/70 leading-relaxed">
                Pendant plus de 25 ans, j'ai voyagé dans plus de 30 pays pour vendre nos écrans : 
                <strong className="text-ivory"> Afrique, Amériques, Pacifique, Europe</strong>... partout. J'emmenais même mes enfants avec moi, 
                de village en village.
              </p>
              <p className="text-white/70 leading-relaxed mt-4">
                Ces années ont été marquées par des moments précieux passés ensemble, comme une famille. 
                Nous avons rencontré des amis, créé des liens, partagé des joies et des fous rires.
              </p>
              <p className="text-white/70 leading-relaxed mt-4">
                Hallucine n'est pas qu'une entreprise traditionnelle. Ce sont ces moments d'amitié et de complicité 
                qui l'ont façonnée. Et c'est cette ambiance unique qui m'a poussé à rester fidèle à Hallucine 
                depuis plus de 25 ans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cinéma en plein air */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Hallucine — Cinéma en plein air</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-warm font-semibold text-xl mb-4">Des moments inoubliables pour toute la famille</h3>
              <p className="text-white/70 leading-relaxed">
                Hallucine, c'est bien plus qu'un simple écran gonflable. C'est un catalyseur de souvenirs partagés 
                entre amis et en famille. Nos écrans transforment chaque projection ou événement sportif en un moment 
                chaleureux et mémorable, où rires, complicité et joie se mêlent.
              </p>
              <p className="text-white/70 leading-relaxed mt-4">
                Découvrez le bonheur de se retrouver pour partager des blagues, tisser des liens avec de nouveaux amis 
                ou renouer avec des proches autour d'une expérience immersive. Avec Hallucine, chaque événement 
                devient un moment de vie exceptionnel.
              </p>
            </div>
            <div>
              <h3 className="text-warm font-semibold text-xl mb-4">Famille et Entreprise : Une Histoire Partagée</h3>
              <p className="text-white/70 leading-relaxed">
                Hallucine est bien plus qu'une simple entreprise : c'est un livre de souvenirs qui s'écrit au fil du temps. 
                Chaque écran installé témoigne de moments où famille et amis, anciens ou nouveaux, se rassemblent.
              </p>
              <p className="text-white/70 leading-relaxed mt-4">
                C'est aussi une fenêtre sur l'évolution des générations, observant les enfants grandir et les adultes 
                s'épanouir. Hallucine incarne les valeurs familiales, où travail, rires et souvenirs s'unissent 
                pour créer des expériences uniques et authentiques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Nos valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-bold text-xl mb-4">Fiabilité</h3>
              <p className="text-white/60 leading-relaxed">
                Nous utilisons des matériaux de haute qualité testés dans les conditions les plus exigeantes. 
                Chaque produit est contrôlé individuellement avant expédition.
              </p>
            </div>
            <div className="p-8 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-bold text-xl mb-4">Expertise</h3>
              <p className="text-white/60 leading-relaxed">
                Plus de 25 ans d'expérience dans la conception de structures gonflables. Notre équipe vous accompagne 
                de la conception à l'installation.
              </p>
            </div>
            <div className="p-8 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-bold text-xl mb-4">Qualité</h3>
              <p className="text-white/60 leading-relaxed">
                Contrôles de qualité rigoureux à chaque étape de la fabrication. Nous ne faisons aucun compromis 
                sur la qualité, même pour notre gamme économique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Travaillons ensemble</h2>
          <p className="text-white/60 mb-8">Contactez-nous pour discuter de votre projet.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/devis" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demander un devis gratuit
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
