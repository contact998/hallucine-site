import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// =============================================================================
// Manus Debug Collector - Vite Plugin
// Writes browser logs directly to files, trimmed when exceeding size limit
// =============================================================================

const PROJECT_ROOT = import.meta.dirname;
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024; // 1MB per log file
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6); // Trim to 60% to avoid constant re-trimming

type LogSource = "browserConsole" | "networkRequests" | "sessionReplay";

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function trimLogFile(logPath: string, maxSize: number) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }

    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines: string[] = [];
    let keptBytes = 0;

    // Keep newest lines (from end) that fit within 60% of maxSize
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}\n`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }

    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
    /* ignore trim errors */
  }
}

function writeToLogFile(source: LogSource, entries: unknown[]) {
  if (entries.length === 0) return;

  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);

  // Format entries with timestamps
  const lines = entries.map((entry) => {
    const ts = new Date().toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });

  // Append to log file
  fs.appendFileSync(logPath, `${lines.join("\n")}\n`, "utf-8");

  // Trim if exceeds max size
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}

/**
 * Vite plugin to collect browser debug logs
 * - POST /__manus__/logs: Browser sends logs, written directly to files
 * - Files: browserConsole.log, networkRequests.log, sessionReplay.log
 * - Auto-trimmed when exceeding 1MB (keeps newest entries)
 */
function vitePluginManusDebugCollector(): Plugin {
  return {
    name: "manus-debug-collector",

    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true,
            },
            injectTo: "head",
          },
        ],
      };
    },

    configureServer(server: ViteDevServer) {
      // POST /__manus__/logs: Browser sends logs (written directly to files)
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        const handlePayload = (payload: any) => {
          // Write logs directly to files
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };

        const reqBody = (req as { body?: unknown }).body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    },
  };
}


/**
 * Plugin qui restaure les placeholders SSR dans index.html après le build.
 * vitePluginManusRuntime() les remplace par les valeurs par défaut via transformIndexHtml —
 * ce plugin tourne après lui (enforce: "post") et les remet en place pour que
 * prerender.mjs puisse les substituer page par page.
 */
function vitePluginRestoreSsrPlaceholders(): Plugin {
  return {
    name: "restore-ssr-placeholders",
    enforce: "post",
    transformIndexHtml(html) {
      // Uniquement au build — le dev n'utilise pas prerender.mjs
      if (process.env.NODE_ENV !== "production") {
        return html;
      }
      return html
        .replace(/<title>[^<]*<\/title>/, "<title>__PAGE_TITLE__<\/title>")
        .replace(/(<meta name="description" content=")[^"]*(")/,        '$1__PAGE_DESCRIPTION__$2')
        .replace(/(<meta property="og:title" content=")[^"]*(")/,       '$1__PAGE_TITLE__$2')
        .replace(/(<meta property="og:description" content=")[^"]*(")/,  '$1__PAGE_DESCRIPTION__$2')
        .replace(/(<meta property="og:image" content=")[^"]*(")/,       '$1__PAGE_IMAGE__$2')
        .replace(/(<meta property="og:url" content=")[^"]*(")/,         '$1__PAGE_URL__$2')
        .replace(/(<meta name="twitter:title" content=")[^"]*(")/,      '$1__PAGE_TITLE__$2')
        .replace(/(<meta name="twitter:description" content=")[^"]*(")/,'$1__PAGE_DESCRIPTION__$2')
        .replace(/(<meta name="twitter:image" content=")[^"]*(")/,      '$1__PAGE_IMAGE__$2');
    },
  };
}

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector(), vitePluginRestoreSsrPlaceholders()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Chunking manuel pour séparer les grosses librairies
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Chunk séparé pour tsparticles (lourd, non-critique)
          if (id.includes('@tsparticles') || id.includes('tsparticles')) {
            return 'particles';
          }
          // Chunk séparé pour i18next
          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'i18n';
          }
          // Chunk séparé pour les librairies de charts
          if (id.includes('recharts') || id.includes('d3-')) {
            return 'charts';
          }
          // Chunk séparé pour radix-ui (composants UI)
          if (id.includes('@radix-ui')) {
            return 'radix';
          }
          // Chunk vendor pour les autres dépendances node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // Augmenter le seuil d'avertissement pour les chunks
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
    hmr: {
      // Fix WebSocket connection through proxy
      clientPort: 443,
      protocol: "wss",
    },
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
