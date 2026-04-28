export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Cache de la config OAuth récupérée depuis le serveur
let _configCache: { appId: string; oauthPortalUrl: string } | null = null;

async function fetchOAuthConfig() {
  if (_configCache) return _configCache;
  try {
    const res = await fetch("/api/config");
    const data = await res.json();
    _configCache = { appId: data.appId ?? "", oauthPortalUrl: data.oauthPortalUrl ?? "" };
  } catch {
    _configCache = { appId: "", oauthPortalUrl: "" };
  }
  return _configCache;
}

// Version synchrone — utilise le cache si disponible, sinon retourne "#"
// Appeler initLoginUrl() au démarrage de l'app pour pré-charger la config
export const getLoginUrl = (returnPath?: string): string => {
  if (!_configCache) return "#";
  const { appId, oauthPortalUrl } = _configCache;
  if (!appId || !oauthPortalUrl) return "#";
  if (typeof window === "undefined") return "#";

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(
    JSON.stringify({ redirectUri, returnPath: returnPath ?? window.location.pathname })
  );

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

// À appeler une seule fois au démarrage (dans main.tsx) pour pré-charger la config
export const initLoginUrl = () => fetchOAuthConfig();
