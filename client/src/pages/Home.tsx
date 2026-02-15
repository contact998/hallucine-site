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
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CinemaRideau from "@/components/CinemaRideau";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CinemaRideau />
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <TechnologySection />
      <UseCasesSection />
      <StorySection />
      <RealisationsSection />
      <FaqSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
