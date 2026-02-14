/*
 * Design: "Nuit Étoilée" – Élégance Nocturne Contemporaine
 * Page d'accueil complète du site Hallucine
 * Objectif : faire connaître Hallucine et générer des demandes de devis
 * Priorité : écrans de cinéma gonflables (produit phare)
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import TechnologySection from "@/components/TechnologySection";
import StorySection from "@/components/StorySection";
import RealisationsSection from "@/components/RealisationsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <TechnologySection />
      <StorySection />
      <RealisationsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
