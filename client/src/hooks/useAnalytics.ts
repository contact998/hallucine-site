/**
 * Hook de tracking analytics — collecte automatique des page views et événements
 * Génère un sessionId anonyme, envoie les données au backend via tRPC
 */
import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

// Générer un sessionId anonyme unique par session navigateur
function getSessionId(): string {
  const key = "hallucine_session_id";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = crypto.randomUUID?.() ?? Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

// Extraire les paramètres UTM de l'URL
function getUtmParams(): { utmSource?: string; utmMedium?: string; utmCampaign?: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
  };
}

/**
 * Hook principal — à utiliser une fois dans App.tsx
 * Traque automatiquement les changements de page
 */
export function usePageTracking() {
  const [location] = useLocation();
  const trackPageView = trpc.analytics.trackPageView.useMutation();
  const pageEntryTime = useRef<number>(Date.now());
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    // Éviter le double tracking de la même page
    if (location === lastTrackedPath.current) return;

    // Envoyer la durée de la page précédente si disponible
    const duration = lastTrackedPath.current
      ? Math.round((Date.now() - pageEntryTime.current) / 1000)
      : undefined;

    lastTrackedPath.current = location;
    pageEntryTime.current = Date.now();

    const sessionId = getSessionId();
    const utm = getUtmParams();

    trackPageView.mutate({
      path: location,
      pageTitle: document.title,
      referrer: document.referrer || undefined,
      sessionId,
      duration,
      ...utm,
    });
  }, [location]);
}

/**
 * Hook pour tracker des événements personnalisés
 * Retourne une fonction trackEvent(type, data?)
 */
export function useTrackEvent() {
  const trackEventMutation = trpc.analytics.trackEvent.useMutation();
  const [location] = useLocation();

  const trackEvent = useCallback(
    (eventType: string, eventData?: string) => {
      const sessionId = getSessionId();
      trackEventMutation.mutate({
        eventType,
        eventData,
        path: location,
        sessionId,
      });
    },
    [location]
  );

  return trackEvent;
}
