export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  // SSR-safe : import.meta.env peut être undefined en Node.js
  const env = (import.meta as any).env ?? {};
  const oauthPortalUrl = env.VITE_OAUTH_PORTAL_URL;
  const appId = env.VITE_APP_ID;

  // Si les variables OAuth ne sont pas configurées, retourner '#' pour éviter TypeError
  if (!oauthPortalUrl || !appId) {
    return "#";
  }

  // SSR-safe : window peut être undefined en Node.js
  if (typeof window === "undefined") return "#";

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
