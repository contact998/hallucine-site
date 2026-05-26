import { type ReactNode, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmCountdown from "@/components/FilmCountdown";
import VideoLightbox from "@/components/VideoLightbox";
import { RelatedProducts } from "@/components/RelatedProducts";
import { cn } from "@/lib/utils";
import type { RouteKey } from "@/i18n/routes";

type ActiveVideo = { id: string; title: string } | null;

type Props = {
  children: ReactNode;
  /** Classes additionnelles sur le wrapper racine (ex: "flex flex-col" pour NotFound) */
  className?: string;
  /** Affiche le compte à rebours cinéma à l'arrivée sur la page */
  withCountdown?: boolean;
  /** Ajoute la section "produits liés" avant le footer si renseigné */
  relatedProductsKey?: RouteKey;
  /** Vidéo Lightbox contrôlée par la page si présente */
  activeVideo?: ActiveVideo;
  onCloseVideo?: () => void;
};

/**
 * Wrapper standard de page : background, Navbar, Footer, et slots optionnels
 * pour le compte à rebours, les produits liés et le lightbox vidéo.
 */
export default function PageShell({
  children,
  className,
  withCountdown = false,
  relatedProductsKey,
  activeVideo,
  onCloseVideo,
}: Props) {
  const [showCountdown, setShowCountdown] = useState(withCountdown);

  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
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
