/**
 * IndexNow — Soumission automatique des URLs à Bing, Yandex, DuckDuckGo, etc.
 * 
 * Le protocole IndexNow permet de notifier instantanément les moteurs de recherche
 * quand du contenu est ajouté, modifié ou supprimé.
 * 
 * Documentation : https://www.indexnow.org/documentation
 */
import axios from "axios";

const INDEXNOW_KEY = "f31bcd06809042bfb75256a01133a84c";
const HOST = "hallucinecran.fr";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

// Toutes les pages publiques du site
const ALL_PUBLIC_URLS = [
  "/",
  "/ecran-gonflable",
  "/ecran-gonflable-geant-soufflerie",
  "/ecran-gonflable-etanche-air",
  "/ecran-gonflable-economique",
  "/comparaison-ecran-gonflable",
  "/ecrans-led",
  "/tente-gonflable",
  "/tente-gonflable-x",
  "/tente-gonflable-n",
  "/tente-gonflable-v",
  "/tente-gonflable-araignee",
  "/arche-gonflable",
  "/mobilier-gonflable",
  "/accessoire-cinema-plein-air",
  "/galerie-evenements",
  "/galerie-video",
  "/contactez-nous",
  "/a-propos-hallucine",
  "/histoire-hallucine",
  "/blog",
  "/mode-emploi",
  "/devenir-distributeur",
  "/trouver-distributeur",
  "/mentions-legales",
  "/politique-confidentialite",
  "/politique-cookies",
];

/**
 * Soumet une liste d'URLs à IndexNow (Bing endpoint, partagé avec Yandex/DuckDuckGo/etc.)
 */
export async function submitToIndexNow(urls?: string[]): Promise<{
  success: boolean;
  submitted: number;
  error?: string;
}> {
  const urlList = urls || ALL_PUBLIC_URLS.map((path) => `https://${HOST}${path}`);

  try {
    const response = await axios.post(
      "https://api.indexnow.org/indexnow",
      {
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList,
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        timeout: 15000,
      }
    );

    // IndexNow retourne 200 (OK) ou 202 (Accepted)
    if (response.status === 200 || response.status === 202) {
      console.log(`[IndexNow] ${urlList.length} URLs soumises avec succès (status: ${response.status})`);
      return { success: true, submitted: urlList.length };
    }

    console.warn(`[IndexNow] Réponse inattendue: ${response.status}`);
    return { success: false, submitted: 0, error: `Status ${response.status}` };
  } catch (error: any) {
    const msg = error.response?.data || error.message || "Erreur inconnue";
    console.error(`[IndexNow] Erreur:`, msg);
    return { success: false, submitted: 0, error: String(msg) };
  }
}

/**
 * Soumet une seule URL (utile après publication d'un article de blog, etc.)
 */
export async function submitSingleUrl(url: string): Promise<boolean> {
  const result = await submitToIndexNow([url]);
  return result.success;
}
