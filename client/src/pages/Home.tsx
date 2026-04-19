/*
 * Page d'accueil complète du site Hallucine
 * Contenu texte enrichi, sections complètes
 * Focus sur le contenu, pas sur les images
 *
 * Narration vocale :
 * - Contrôlée par VITE_NARRATION_ENABLED (voir client/src/narration/config.ts)
 * - Chaque section est wrappée dans un <NarrationAnchor> qui déclenche un MP3
 * - Le bouton mute apparaît en bas à droite quand la narration est active
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
import { useTranslation } from "react-i18next";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
// --- Narration vocale (tout retirable en 3 lignes) ---
import NarrationAnchor from "@/narration/NarrationAnchor";
import NarrationToggle from "@/narration/NarrationToggle";
// -----------------------------------------------------

export default function Home() {
  const { t } = useTranslation("home");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/og-accueil-KjTW2K29SHyinVRpsNcnQC.png");

  const HOME_FAQS = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
  ];

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
      <NarrationAnchor id="accueil-hero">
        <HeroSection />
      </NarrationAnchor>
      <NarrationAnchor id="gamme-etanche">
        <ProductsSection />
      </NarrationAnchor>
      <NarrationAnchor id="technologie-leger">
        <TechnologySection />
      </NarrationAnchor>
      <UseCasesSection />
      <NarrationAnchor id="histoire-forains">
        <StorySection />
      </NarrationAnchor>
      <NarrationAnchor id="realisations">
        <RealisationsSection />
      </NarrationAnchor>
      <NarrationAnchor id="temoignages">
        <TestimonialsSection />
      </NarrationAnchor>
      <FaqSection />
      <NarrationAnchor id="contact">
        <ContactSection />
      </NarrationAnchor>
      <Footer />
      <NarrationToggle />
    </div>
  );
}
