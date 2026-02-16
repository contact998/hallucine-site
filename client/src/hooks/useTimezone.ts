/**
 * Hook useTimezone — Gère le fuseau horaire de l'utilisateur connecté
 * Fournit des fonctions pour formater les dates selon le fuseau configuré
 * Ne détecte PAS automatiquement le fuseau du navigateur
 */
import { trpc } from "@/lib/trpc";
import { useCallback, useMemo } from "react";

const DEFAULT_TIMEZONE = "Europe/Paris";

export function useTimezone() {
  const { data, isLoading } = trpc.profile.getTimezone.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    // Silently fail if not authenticated
    meta: { skipAuthRedirect: true },
  });

  const utils = trpc.useUtils();

  const updateMutation = trpc.profile.updateTimezone.useMutation({
    onSuccess: () => {
      utils.profile.getTimezone.invalidate();
    },
  });

  const timezone = data?.timezone || DEFAULT_TIMEZONE;
  const timezones = data?.timezones || [];

  /** Formater une date selon le fuseau horaire configuré */
  const formatDate = useCallback(
    (
      date: Date | string | number,
      options?: {
        showTime?: boolean;
        showSeconds?: boolean;
        dateStyle?: "short" | "medium" | "long";
      }
    ) => {
      const d = date instanceof Date ? date : new Date(date);
      const { showTime = true, showSeconds = false, dateStyle = "medium" } = options || {};

      try {
        if (dateStyle === "short" && showTime) {
          return d.toLocaleString("fr-FR", {
            timeZone: timezone,
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            ...(showSeconds ? { second: "2-digit" } : {}),
          });
        }

        if (dateStyle === "long") {
          const datePart = d.toLocaleDateString("fr-FR", {
            timeZone: timezone,
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          if (!showTime) return datePart;
          const timePart = d.toLocaleTimeString("fr-FR", {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit",
            ...(showSeconds ? { second: "2-digit" } : {}),
          });
          return `${datePart} à ${timePart}`;
        }

        // medium (default)
        const datePart = d.toLocaleDateString("fr-FR", {
          timeZone: timezone,
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        if (!showTime) return datePart;
        const timePart = d.toLocaleTimeString("fr-FR", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          ...(showSeconds ? { second: "2-digit" } : {}),
        });
        return `${datePart} ${timePart}`;
      } catch {
        // Fallback si le fuseau horaire est invalide
        return d.toLocaleString("fr-FR");
      }
    },
    [timezone]
  );

  /** Formater uniquement la date (sans heure) */
  const formatDateOnly = useCallback(
    (date: Date | string | number, style?: "short" | "medium" | "long") => {
      return formatDate(date, { showTime: false, dateStyle: style || "medium" });
    },
    [formatDate]
  );

  /** Formater uniquement l'heure */
  const formatTime = useCallback(
    (date: Date | string | number, showSeconds?: boolean) => {
      const d = date instanceof Date ? date : new Date(date);
      try {
        return d.toLocaleTimeString("fr-FR", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          ...(showSeconds ? { second: "2-digit" } : {}),
        });
      } catch {
        return d.toLocaleTimeString("fr-FR");
      }
    },
    [timezone]
  );

  /** Obtenir le label lisible du fuseau horaire actuel */
  const timezoneLabel = useMemo(() => {
    const found = timezones.find((tz: { value: string }) => tz.value === timezone);
    return found ? `${found.city} (${found.label})` : timezone;
  }, [timezone, timezones]);

  /** Obtenir l'abréviation du fuseau horaire */
  const timezoneAbbr = useMemo(() => {
    try {
      const parts = new Intl.DateTimeFormat("fr-FR", {
        timeZone: timezone,
        timeZoneName: "short",
      }).formatToParts(new Date());
      return parts.find((p) => p.type === "timeZoneName")?.value || timezone;
    } catch {
      return timezone;
    }
  }, [timezone]);

  return {
    timezone,
    timezoneLabel,
    timezoneAbbr,
    timezones,
    isLoading,
    formatDate,
    formatDateOnly,
    formatTime,
    updateTimezone: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
