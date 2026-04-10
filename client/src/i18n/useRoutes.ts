/**
 * Hook useRoutes — retourne une fonction route(key) qui donne l'URL localisée
 * selon la langue active dans i18next.
 *
 * Usage :
 *   const route = useRoutes()
 *   <Link href={route('tente-araignee')}>...</Link>
 */
import { useTranslation } from "react-i18next";
import { getRoute, type RouteKey } from "./routes";

export function useRoutes() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  return (key: RouteKey) => getRoute(key, lang);
}
