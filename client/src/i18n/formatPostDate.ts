import { LANGUAGE_LOCALES, type SupportedLanguage } from "./domains";

/**
 * Date d'un article blog dans la langue du visiteur (« 30 avril 2026 »,
 * « 30 de abril de 2026 », « 30. April 2026 »…). Partagé Blog/BlogPost —
 * remplace les toLocaleDateString("fr-FR") codés en dur sur les TLD étrangers.
 */
export function formatPostDate(dateStr: string | Date | null | undefined, lang: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  const locale = LANGUAGE_LOCALES[lang as SupportedLanguage] ?? LANGUAGE_LOCALES.fr;
  return date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}
