import { type ReactNode, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmCountdown from "@/components/FilmCountdown";
import VideoLightbox from "@/components/VideoLightbox";
import { RelatedProducts } from "@/components/RelatedProducts";
import type { RouteKey } from "@/i18n/routes";

type ActiveVideo = { id: string; title: string } | null;

type Props = {
  children: ReactNode;
  /** Affiche le compte à rebours cinéma à l'arrivée sur la page */
  withCountdown?: boolean;
  /** Ajoute la section "produits liés" avant le footer si renseigné */
  relatedProductsKey?: RouteKey;
  /** Vidéo Lightbox contrôlée par la page si présente */
  activeVideo?: ActiveVideo;
  onCloseVideo?: () => void;
};

/**
 * Wrapper standard d'une page produit : background, Navbar, Footer, et slots optionnels
 * pour le compte à rebours, les produits liés et le lightbox vidéo.
 */
export default function ProductPageShell({
  children,
  withCountdown = false,
  relatedProductsKey,
  activeVideo,
  onCloseVideo,
}: Props) {
  const [showCountdown, setShowCountdown] = useState(withCountdown);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showCountdown && <FilmCountdown onComplete={() => setShowCountdown(false)} />}
      <Navbar />
      {children}
      {relatedProductsKey && <RelatedProducts currentPage={relatedProductsKey} />}
      <Footer />
      {activeVideo && onCloseVideo && (
        <VideoLightbox
          videoId={activeVideo.id}
          title={activeVideo.title}
          isOpen={true}
          onClose={onCloseVideo}
        />
      )}
    </div>
  );
}
