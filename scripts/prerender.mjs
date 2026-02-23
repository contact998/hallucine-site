/**
 * Script de pré-rendu statique (SSG) pour le SEO
 * 
 * Ce script :
 * 1. Lance un serveur statique local sur les fichiers buildés (dist/public)
 * 2. Ouvre chaque page publique avec Puppeteer (Chromium headless)
 * 3. Attend que React ait fini le rendu
 * 4. Sauvegarde le HTML complet dans dist/public/ (ex: /ecran-gonflable → dist/public/ecran-gonflable.html)
 * 5. Modifie index.html pour chaque route afin que le serveur serve le bon HTML
 * 
 * Exécuté automatiquement après `vite build` via le script build de package.json
 */

import { launch } from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, '..', 'dist', 'public');
const PORT = 4173;

// Les 27 pages publiques du sitemap (pas d'admin, pas de profil)
const ROUTES = [
  '/',
  '/ecran-gonflable',
  '/ecran-gonflable-geant-soufflerie',
  '/ecran-gonflable-etanche-air',
  '/ecran-gonflable-economique',
  '/comparaison-ecran-gonflable',
  '/ecrans-led',
  '/tente-gonflable',
  '/tente-gonflable-x',
  '/tente-gonflable-n',
  '/tente-gonflable-v',
  '/tente-gonflable-araignee',
  '/arche-gonflable',
  '/mobilier-gonflable',
  '/accessoire-cinema-plein-air',
  '/galerie-evenements',
  '/galerie-video',
  '/contactez-nous',
  '/a-propos-hallucine',
  '/histoire-hallucine',
  '/blog',
  '/mode-emploi',
  '/devenir-distributeur',
  '/trouver-distributeur',
  '/mentions-legales',
  '/politique-confidentialite',
  '/politique-cookies',
];

/**
 * Lance un serveur statique minimal qui sert dist/public
 * et renvoie index.html pour toutes les routes (SPA fallback)
 */
function startStaticServer() {
  return new Promise((resolvePromise) => {
    const indexHtml = readFileSync(resolve(DIST_DIR, 'index.html'), 'utf-8');
    
    const server = createServer((req, res) => {
      const url = req.url.split('?')[0];
      
      // Essayer de servir le fichier statique
      const filePath = resolve(DIST_DIR, url.slice(1));
      try {
        if (url !== '/' && existsSync(filePath) && !filePath.endsWith('/')) {
          const content = readFileSync(filePath);
          const ext = filePath.split('.').pop();
          const mimeTypes = {
            'html': 'text/html',
            'js': 'application/javascript',
            'css': 'text/css',
            'json': 'application/json',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'svg': 'image/svg+xml',
            'ico': 'image/x-icon',
            'woff2': 'font/woff2',
            'woff': 'font/woff',
            'mp3': 'audio/mpeg',
            'mp4': 'video/mp4',
            'webp': 'image/webp',
          };
          res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
          res.end(content);
          return;
        }
      } catch (e) {
        // Fichier non trouvé, on sert index.html
      }
      
      // SPA fallback : servir index.html
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(indexHtml);
    });
    
    server.listen(PORT, () => {
      console.log(`[prerender] Serveur statique démarré sur http://localhost:${PORT}`);
      resolvePromise(server);
    });
  });
}

/**
 * Pré-rend une page et retourne le HTML complet
 */
async function prerenderPage(browser, route) {
  const page = await browser.newPage();
  
  // Bloquer les requêtes API (tRPC, analytics) pour éviter les erreurs
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const url = req.url();
    if (
      url.includes('/api/trpc') || 
      url.includes('/api/oauth') ||
      url.includes('googletagmanager') ||
      url.includes('google-analytics') ||
      url.includes('umami')
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });
  
  const url = `http://localhost:${PORT}${route}`;
  
  try {
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Attendre que le contenu React soit rendu (le div#root ne doit plus être vide)
    await page.waitForFunction(
      () => {
        const root = document.getElementById('root');
        return root && root.children.length > 0;
      },
      { timeout: 15000 }
    );
    
    // Attendre un peu plus pour les animations/lazy loading
    await new Promise(r => setTimeout(r, 1000));
    
    // Récupérer le HTML complet
    let html = await page.content();
    
    // Supprimer les scripts d'analytics/tracking du HTML pré-rendu
    // (ils seront rechargés par le client de toute façon)
    // Mais garder les scripts Vite pour l'hydratation React
    
    // Remplacer les URLs localhost par la vraie URL de production
    const PRODUCTION_URL = 'https://hallucinecran.fr';
    html = html.replaceAll(`http://localhost:${PORT}`, PRODUCTION_URL);
    
    // Ajouter un commentaire pour identifier le HTML pré-rendu
    html = html.replace(
      '<head>',
      '<head>\n<!-- Pre-rendered by Hallucine SSG -->'
    );
    
    await page.close();
    return html;
  } catch (error) {
    console.error(`[prerender] Erreur sur ${route}:`, error.message);
    await page.close();
    return null;
  }
}

async function main() {
  console.log(`[prerender] Début du pré-rendu de ${ROUTES.length} pages...`);
  console.log(`[prerender] Répertoire de build : ${DIST_DIR}`);
  
  if (!existsSync(resolve(DIST_DIR, 'index.html'))) {
    console.error('[prerender] ERREUR : dist/public/index.html introuvable. Lancez "vite build" d\'abord.');
    process.exit(1);
  }
  
  // Sauvegarder l'index.html original (SPA fallback)
  const originalIndex = readFileSync(resolve(DIST_DIR, 'index.html'), 'utf-8');
  
  // Démarrer le serveur statique
  const server = await startStaticServer();
  
  // Lancer Puppeteer avec le Chromium du système
  const browser = await launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
    ],
  });
  
  let successCount = 0;
  let failCount = 0;
  
  // Pré-rendre chaque page séquentiellement
  for (const route of ROUTES) {
    const startTime = Date.now();
    const html = await prerenderPage(browser, route);
    const duration = Date.now() - startTime;
    
    if (html) {
      // Déterminer le chemin de sortie
      if (route === '/') {
        // Page d'accueil → index.html
        writeFileSync(resolve(DIST_DIR, 'index.html'), html);
        console.log(`[prerender] ✓ / → index.html (${duration}ms)`);
      } else {
        // Autres pages → /route/index.html (pour servir via express.static)
        const routeDir = resolve(DIST_DIR, route.slice(1));
        mkdirSync(routeDir, { recursive: true });
        writeFileSync(resolve(routeDir, 'index.html'), html);
        
        // Aussi créer route.html pour le fallback direct
        writeFileSync(resolve(DIST_DIR, `${route.slice(1)}.html`), html);
        
        console.log(`[prerender] ✓ ${route} → ${route.slice(1)}/index.html (${duration}ms)`);
      }
      successCount++;
    } else {
      failCount++;
    }
  }
  
  // Sauvegarder l'index original comme fallback SPA (pour les routes non pré-rendues)
  writeFileSync(resolve(DIST_DIR, '_spa_fallback.html'), originalIndex);
  
  await browser.close();
  server.close();
  
  console.log(`\n[prerender] Terminé ! ${successCount}/${ROUTES.length} pages pré-rendues avec succès.`);
  if (failCount > 0) {
    console.warn(`[prerender] ${failCount} pages en échec.`);
  }
}

main().catch((err) => {
  console.error('[prerender] Erreur fatale:', err);
  process.exit(1);
});
