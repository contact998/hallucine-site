/*
 * Bouton WhatsApp flottant — affiché en bas à gauche de chaque page
 * Affiche les heures de présence avec conversion automatique au fuseau du visiteur
 * Indicateur "En ligne" / "Hors ligne" en temps réel
 */
import { useState, useEffect, useMemo } from "react";
import { X, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";

const WHATSAPP_NUMBER = "33680147694";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Détecter le fuseau horaire du visiteur
  const visitorTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "Europe/Paris";
    }
  }, []);

  // Récupérer le statut de disponibilité et les heures converties
  const { data: businessStatus } = trpc.businessHours.getSmartMessage.useQuery(
    { visitorTimezone },
    { staleTime: 60_000, refetchInterval: 60_000 }
  );

  const isAvailable = businessStatus?.isAvailable ?? false;

  // Message WhatsApp adapté selon la disponibilité
  const whatsappMessage = isAvailable
    ? "Bonjour, je suis intéressé(e) par vos produits Hallucine. Pouvez-vous me renseigner ?"
    : "Bonjour, je vous contacte depuis votre site web. Merci de me rappeler quand vous serez disponible.";

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  // Show tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setShowTooltip(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex items-end gap-3">
      {/* Tooltip bubble with availability info */}
      {showTooltip && !dismissed && (
        <div className="relative bg-white text-gray-800 rounded-xl shadow-xl px-4 py-3 max-w-[260px] text-sm animate-in fade-in slide-in-from-left-4 duration-300">
          <button
            onClick={() => { setDismissed(true); setShowTooltip(false); }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <X className="w-3 h-3 text-gray-600" />
          </button>

          {isAvailable ? (
            <>
              <p className="font-medium text-green-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Nous sommes en ligne !
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Réponse immédiate sur WhatsApp
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                Hors ligne
              </p>
              {businessStatus?.hoursInVisitorTz && (
                <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Disponibles {businessStatus.hoursInVisitorTz.start} – {businessStatus.hoursInVisitorTz.end} (votre heure)
                </p>
              )}
              <p className="text-gray-400 text-[10px] mt-1">
                Laissez un message, nous répondrons dès notre retour
              </p>
            </>
          )}

          {/* Arrow pointing to button */}
          <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white rotate-45 shadow-sm" />
        </div>
      )}

      {/* WhatsApp button with availability indicator */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => { setDismissed(true); setShowTooltip(false); }}
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-[#25D366]/30 hover:scale-110 transition-all duration-300"
        aria-label="Contacter via WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>

        {/* Availability indicator dot */}
        <span className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
          isAvailable ? "bg-green-500" : "bg-orange-400"
        }`}>
          {isAvailable && <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40" />}
        </span>

        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </a>
    </div>
  );
}
