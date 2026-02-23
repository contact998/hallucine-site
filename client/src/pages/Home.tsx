/*
 * Page d'accueil complète du site Hallucine
 * Contenu texte enrichi, sections complètes
 * Focus sur le contenu, pas sur les images
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import TechnologySection from "@/components/TechnologySection";
import UseCasesSection from "@/components/UseCasesSection";
import StorySection from "@/components/StorySection";
import RealisationsSection from "@/components/RealisationsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CinemaRideau from "@/components/CinemaRideau";
import PageStructuredData from "@/components/PageStructuredData";

const HOME_FAQS = [
  { question: "Qu'est-ce qu'un écran de cinéma gonflable ?", answer: "Un écran de cinéma gonflable est une structure légère et portable qui se gonfle à l'air pour créer une surface de projection en plein air. Hallucine fabrique des écrans gonflables de 2 à 24 mètres de large." },
  { question: "Pourquoi choisir Hallucine plutôt qu'un autre fabricant ?", answer: "Nos écrans sont 3 fois plus légers que la concurrence grâce à nos tissus techniques. 30 ans d'expérience terrain et garantie 10 ans sur la structure." },
  { question: "Quelle est la différence entre vos deux gammes d'écrans ?", answer: "La gamme étanche (2 à 8m) utilise une chambre à air scellée. La gamme soufflerie (5 à 24m) utilise une soufflerie permanente pour les grands formats. Les deux sont garanties 10 ans." },
  { question: "Combien coûte un écran gonflable Hallucine ?", answer: "Le prix dépend de la taille et de la technologie choisie. Contactez-nous pour un devis personnalisé gratuit." },
  { question: "Livrez-vous à l'international ?", answer: "Oui. Nous livrons dans le monde entier. Les délais sont de 2 à 4 semaines selon la destination." },
  { question: "Proposez-vous aussi des tentes et du mobilier gonflable ?", answer: "Oui. Nous fabriquons des tentes gonflables et du mobilier événementiel avec la même technologie étanche." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="home"
        breadcrumbs={[{ name: "Accueil", url: "/" }]}
        faqs={HOME_FAQS}
        page={{
          name: "Hallucine — Écrans de Cinéma Gonflables",
          description: "Fabricant français d'écrans de cinéma gonflables ultra-légers. De 2m à 24m, technologie étanche et soufflerie. Garantie 10 ans.",
          url: "/",
        }}
      />
      <CinemaRideau />
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <TechnologySection />
      <UseCasesSection />
      <StorySection />
      <RealisationsSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
