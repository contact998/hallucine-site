/*
 * Bouton de téléchargement de brochure PDF
 * Génère un PDF côté serveur via tRPC avec les specs du produit
 */
import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface BrochureDownloadButtonProps {
  productSlug: string;
  productName: string;
  className?: string;
  variant?: "default" | "compact";
}

export default function BrochureDownloadButton({
  productSlug,
  productName,
  className = "",
  variant = "default",
}: BrochureDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const brochureMutation = trpc.brochure.generate.useMutation({
    onSuccess: (data) => {
      // Create a download link from the HTML content
      const blob = new Blob([data.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Hallucine-${productName.replace(/\s+/g, "-")}-Brochure.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      const isServiceError = error.message?.includes('503') || error.message?.includes('ServiceUnavailable') || error.message?.includes('Storage');
      const msg = isServiceError
        ? "Le service de stockage est temporairement indisponible. Veuillez r\u00e9essayer dans quelques instants."
        : "Erreur lors de la g\u00e9n\u00e9ration de la brochure. Veuillez r\u00e9essayer.";
      alert(msg);
    },
  });

  const handleDownload = () => {
    setLoading(true);
    brochureMutation.mutate({ productSlug });
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-warm border border-warm/30 rounded-lg hover:bg-warm/10 transition-all disabled:opacity-50 ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileDown className="w-4 h-4" />
        )}
        Brochure PDF
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`group inline-flex items-center gap-3 px-6 py-3 bg-[oklch(0.16_0.015_260)] border border-white/10 rounded-xl hover:border-warm/30 hover:bg-warm/5 transition-all duration-300 disabled:opacity-50 ${className}`}
    >
      <div className="w-10 h-10 rounded-lg bg-warm/10 flex items-center justify-center group-hover:bg-warm/20 transition-colors">
        {loading ? (
          <Loader2 className="w-5 h-5 text-warm animate-spin" />
        ) : (
          <FileDown className="w-5 h-5 text-warm" />
        )}
      </div>
      <div className="text-left">
        <p className="text-white font-medium text-sm">Télécharger la brochure</p>
        <p className="text-white/40 text-xs">{productName} — Fiche technique PDF</p>
      </div>
    </button>
  );
}
