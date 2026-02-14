/*
 * Page dédiée : Contact / Demande de devis
 * Formulaire intelligent en 3 étapes
 * Réutilise le composant ContactSection
 */
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
}
