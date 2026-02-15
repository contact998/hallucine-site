/**
 * Indicateur de Disponibilité IA
 * 
 * Croise les fuseaux horaires de DC, JB et du visiteur.
 * Affiche un widget fixe en bas à droite, un badge dans le header,
 * et une version étendue sur la page contact.
 * 
 * Rafraîchissement automatique toutes les 5 minutes.
 */

import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Phone, Mail, MessageCircle, X, Clock, ChevronDown, ChevronUp } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface CommercialData {
  initials: string;
  name: string;
  timezone: string;
  localTime: string;
  hour: number;
  minute: number;
  available: boolean;
  dayOfWeek: number;
}

interface AvailabilityData {
  available: boolean;
  commercials: CommercialData[];
  aiMessage: string;
  nextAvailability: string | null;
  visitorTimezone: string;
  visitorLocalTime: string;
}

// ─── Hook partagé ──────────────────────────────────────────────────

function useAvailability() {
  const visitorTz = typeof window !== "undefined"
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "Europe/Paris";

  const { data, isLoading, error, refetch } = trpc.availability.check.useQuery(
    { visitorTimezone: visitorTz },
    {
      refetchInterval: 5 * 60 * 1000, // Rafraîchir toutes les 5 minutes
      staleTime: 2 * 60 * 1000,
      retry: 2,
    }
  );

  return { data: data as AvailabilityData | undefined, isLoading, error, refetch };
}

// ─── Widget Fixe (bas à droite) ────────────────────────────────────

export function AvailabilityWidget() {
  const { data, isLoading } = useAvailability();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Ne pas afficher pendant le chargement ou si fermé
  if (isLoading || !data || isDismissed) return null;

  return (
    <div
      className="fixed z-40 transition-all duration-300"
      style={{ bottom: "6rem", left: "1rem" }}
    >
      {isExpanded ? (
        /* ─── Version étendue ─── */
        <div
          className={`
            rounded-2xl shadow-2xl border-2 p-4 backdrop-blur-sm max-w-xs
            transition-all duration-300
            ${data.available
              ? "bg-green-950/95 border-green-500/50"
              : "bg-orange-950/95 border-orange-500/50"}
          `}
        >
          {/* Header avec bouton fermer */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div
                  className={`w-3 h-3 rounded-full ${
                    data.available ? "bg-green-500" : "bg-orange-500"
                  }`}
                />
                {data.available && (
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75" />
                )}
              </div>
              <span
                className={`font-bold text-sm ${
                  data.available ? "text-green-300" : "text-orange-300"
                }`}
              >
                {data.available ? "Disponible maintenant" : "Actuellement absent"}
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Réduire"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Avatars des commerciaux */}
          <div className="flex gap-2 mb-3">
            {data.commercials.map((c) => (
              <div key={c.initials} className="flex flex-col items-center gap-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold
                    transition-all duration-300
                    ${c.available
                      ? "bg-green-500 text-white ring-2 ring-green-300/50 shadow-lg shadow-green-500/30"
                      : "bg-gray-700 text-gray-400 opacity-60"}
                  `}
                >
                  {c.initials}
                </div>
                <span className="text-[10px] text-gray-400">
                  {c.localTime}
                </span>
              </div>
            ))}
          </div>

          {/* Message IA */}
          <p className="text-sm text-gray-200 leading-relaxed mb-3">
            {data.aiMessage}
          </p>

          {/* Boutons d'action */}
          <div className="flex gap-2">
            {data.available ? (
              <>
                <a
                  href="tel:+33680147694"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl
                    bg-green-600 hover:bg-green-700 text-white font-semibold text-xs
                    transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Appeler
                </a>
                <a
                  href="#contact"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl
                    bg-green-600/30 hover:bg-green-600/50 text-green-300 font-semibold text-xs
                    border border-green-500/30 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Formulaire
                </a>
              </>
            ) : (
              <a
                href="#contact"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl
                  bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs
                  transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Laisser mon email
              </a>
            )}
          </div>

          {/* Bouton de fermeture définitive */}
          <button
            onClick={() => setIsDismissed(true)}
            className="mt-2 w-full text-center text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
          >
            Masquer pour cette session
          </button>
        </div>
      ) : (
        /* ─── Version compacte (bulle) ─── */
        <button
          onClick={() => setIsExpanded(true)}
          className={`
            group flex items-center gap-2 py-2.5 px-4 rounded-full shadow-xl
            border-2 backdrop-blur-sm transition-all duration-300
            hover:scale-105 cursor-pointer
            ${data.available
              ? "bg-green-950/90 border-green-500/50 hover:border-green-400"
              : "bg-orange-950/90 border-orange-500/50 hover:border-orange-400"}
          `}
        >
          <div className="relative">
            <div
              className={`w-3 h-3 rounded-full ${
                data.available ? "bg-green-500" : "bg-orange-500"
              }`}
            />
            {data.available && (
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75" />
            )}
          </div>
          <span
            className={`text-xs font-semibold ${
              data.available ? "text-green-300" : "text-orange-300"
            }`}
          >
            {data.available ? "En ligne" : "Absent"}
          </span>
          {/* Avatars mini */}
          <div className="flex -space-x-1.5">
            {data.commercials.map((c) => (
              <div
                key={c.initials}
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold
                  border border-gray-800
                  ${c.available
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-400 opacity-50"}
                `}
              >
                {c.initials}
              </div>
            ))}
          </div>
          <ChevronUp className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
        </button>
      )}
    </div>
  );
}

// ─── Badge Header (compact) ────────────────────────────────────────

export function AvailabilityBadge() {
  const { data, isLoading } = useAvailability();

  if (isLoading || !data) return null;

  const availableCount = data.commercials.filter(c => c.available).length;

  return (
    <div className="flex items-center gap-1.5" title={data.aiMessage}>
      <div className="relative">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            data.available ? "bg-green-500" : "bg-orange-500"
          }`}
        />
        {data.available && (
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
        )}
      </div>
      <span
        className={`text-xs font-medium hidden sm:inline ${
          data.available ? "text-green-400" : "text-orange-400"
        }`}
      >
        {data.available
          ? `${availableCount}/${data.commercials.length} en ligne`
          : "Absent"}
      </span>
    </div>
  );
}

// ─── Version Étendue (page contact) ────────────────────────────────

export function AvailabilityExtended() {
  const { data, isLoading } = useAvailability();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-700 bg-gray-900/50 p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-48 mb-4" />
        <div className="h-3 bg-gray-700 rounded w-full mb-2" />
        <div className="h-3 bg-gray-700 rounded w-3/4" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      className={`
        rounded-2xl border-2 p-6 transition-all duration-300
        ${data.available
          ? "bg-green-950/30 border-green-500/30"
          : "bg-orange-950/30 border-orange-500/30"}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div
            className={`w-5 h-5 rounded-full ${
              data.available ? "bg-green-500" : "bg-orange-500"
            }`}
          />
          {data.available && (
            <div className="absolute inset-0 w-5 h-5 rounded-full bg-green-500 animate-ping opacity-75" />
          )}
        </div>
        <h3
          className={`text-lg font-bold ${
            data.available ? "text-green-300" : "text-orange-300"
          }`}
        >
          {data.available ? "Nous sommes disponibles !" : "Nous sommes actuellement absents"}
        </h3>
      </div>

      {/* Message IA */}
      <p className="text-gray-300 leading-relaxed mb-5">
        {data.aiMessage}
      </p>

      {/* Détail des commerciaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {data.commercials.map((c) => (
          <div
            key={c.initials}
            className={`
              rounded-xl p-4 border transition-all
              ${c.available
                ? "bg-green-900/30 border-green-500/30"
                : "bg-gray-800/30 border-gray-700/30"}
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold
                  ${c.available
                    ? "bg-green-500 text-white ring-2 ring-green-300/50"
                    : "bg-gray-700 text-gray-400"}
                `}
              >
                {c.initials}
              </div>
              <div>
                <p className={`font-semibold ${c.available ? "text-green-300" : "text-gray-400"}`}>
                  {c.name}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{c.localTime} (heure locale)</span>
                </div>
                <span
                  className={`text-xs font-medium ${
                    c.available ? "text-green-400" : "text-orange-400"
                  }`}
                >
                  {c.available ? "En ligne" : "Hors ligne"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Heures d'ouverture */}
      <div className="rounded-xl bg-gray-800/30 border border-gray-700/30 p-4 mb-5">
        <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Heures d'ouverture
        </h4>
        <p className="text-xs text-gray-400">
          Du lundi au vendredi, de 8h00 à 16h00 (heure locale de chaque commercial).
          Les fuseaux horaires sont automatiquement convertis pour vous.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Il est actuellement <strong className="text-gray-300">{data.visitorLocalTime}</strong> chez vous ({data.visitorTimezone}).
        </p>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-3">
        {data.available ? (
          <>
            <a
              href="tel:+33680147694"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                bg-green-600 hover:bg-green-700 text-white font-semibold text-sm
                transition-colors"
            >
              <Phone className="w-4 h-4" />
              Appeler maintenant
            </a>
            <a
              href="https://wa.me/33680147694"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                bg-green-600/30 hover:bg-green-600/50 text-green-300 font-semibold text-sm
                border border-green-500/30 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </>
        ) : (
          <>
            <a
              href="#contact"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm
                transition-colors"
            >
              <Mail className="w-4 h-4" />
              Laisser mon email
            </a>
            {data.nextAvailability && (
              <div className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                bg-gray-800/50 text-gray-400 text-sm border border-gray-700/30">
                <Clock className="w-4 h-4" />
                Prochaine dispo :{" "}
                {new Date(data.nextAvailability).toLocaleTimeString("fr-FR", {
                  timeZone: data.visitorTimezone,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Export par défaut : Widget ─────────────────────────────────────

export default AvailabilityWidget;
