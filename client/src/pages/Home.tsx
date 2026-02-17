/*
 * Page d'accueil complète du site Hallucine
 * Contenu texte enrichi, sections complètes
 * Focus sur le contenu, pas sur les images
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import UseCasesSection from "@/components/UseCasesSection";
import StorySection from "@/components/StorySection";
import RealisationsSection from "@/components/RealisationsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
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
