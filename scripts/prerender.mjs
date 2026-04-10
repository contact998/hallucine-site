#!/usr/bin/env node
/**
 * SSG Pre-render Script — Hallucinecran
 *
 * Renders public SPA routes to static HTML using Puppeteer + Chromium.
 * Extracts div#root inner content and saves as .content.html fragments.
 * These fragments are injected into the fresh index.html at server startup.
 *
 * Usage: node scripts/prerender.mjs
 * Requires: puppeteer (devDependency), pnpm build run first
 */

import { launch } from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, '..', 'dist', 'public');
const OUTPUT_DIR = resolve(__dirname, '..', 'client', 'public', 'prerendered');
const PORT = 4173;

// === Routes publiques FR à pré-rendre (27 pages) ===
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

function startStaticServer() {
  return new Promise((resolvePromise) => {
    const indexHtml = readFileSync(resolve(DIST_DIR, 'index.html'), 'utf-8');
    const server = createServer((req, res) => {
      const url = req.url.split('?')[0];
      const filePath = resolve(DIST_DIR, url.slice(1));
      try {
        if (url !== '/' && existsSync(filePath) && !filePath.endsWith('/')) {
          const content = readFileSync(filePath);
          const ext = filePath.split('.').pop();
          const mimeTypes = {
            'html': 'text/html', 'js': 'application/javascript',
            'css': 'text/css', 'json': 'application/json',
            'png': 'image/png', 'jpg': 'image/jpeg', 'svg': 'image/svg+xml',
            'ico': 'image/x-icon', 'woff2': 'font/woff2', 'webp': 'image/webp',
          };
          res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
          res.end(content);
          return;
        }
      } catch (e) { /* fallback to SPA */ }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(indexHtml);
    });
    server.listen(PORT, () => {
      console.log(`[prerender] Static server on http://localhost:${PORT}`);
      resolvePromise(server);
    });
  });
}

async function prerenderPage(browser, route) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const url = req.url();
    if (
      url.includes('/api/trpc') ||
      url.includes('/api/oauth') ||
      url.includes('googletagmanager') ||
      url.includes('google-analytics') ||
      url.includes('umami') ||
      url.includes('analytics')
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  try {
    await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: 'networkidle0', timeout: 30000,
    });
    await page.waitForFunction(
      () => document.getElementById('root')?.children.length > 0,
      { timeout: 15000 }
    );
    await new Promise(r => setTimeout(r, 1500));
    const html = await page.content();
    await page.close();
    return html;
  } catch (error) {
    console.error(`[prerender] Error on ${route}:`, error.message);
    await page.close();
    return null;
  }
}

function extractRootContent(html) {
  const marker = '<div id="root">';
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const contentStart = start + marker.length;
  let depth = 1, pos = contentStart;
  while (depth > 0 && pos < html.length) {
    const nextOpen = html.indexOf('<div', pos);
    const nextClose = html.indexOf('</div>', pos);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++; pos = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) return html.substring(contentStart, nextClose);
      pos = nextClose + 6;
    }
  }
  return null;
}

async function main() {
  console.log(`[prerender] Pre-rendering ${ROUTES.length} pages...`);
  if (!existsSync(resolve(DIST_DIR, 'index.html'))) {
    console.error('[prerender] ERROR: dist/public/index.html not found. Run "pnpm build" first.');
    process.exit(1);
  }

  const server = await startStaticServer();
  const browser = await launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  mkdirSync(OUTPUT_DIR, { recursive: true });
  let success = 0;

  for (const route of ROUTES) {
    const t = Date.now();
    const html = await prerenderPage(browser, route);
    if (html) {
      const content = extractRootContent(html);
      if (content) {
        const name = route === '/' ? 'home' : route.slice(1);
        writeFileSync(resolve(OUTPUT_DIR, `${name}.content.html`), content);
        console.log(`[prerender] ✓ ${route} → ${name}.content.html (${Date.now() - t}ms, ${content.length} chars)`);
        success++;
      } else {
        console.warn(`[prerender] ✗ ${route} — could not extract div#root content`);
      }
    } else {
      console.warn(`[prerender] ✗ ${route} — page render failed`);
    }
  }

  await browser.close();
  server.close();
  console.log(`\n[prerender] Done! ${success}/${ROUTES.length} pages pre-rendered to ${OUTPUT_DIR}`);
}

main().catch((err) => { console.error('[prerender] Fatal:', err); process.exit(1); });
