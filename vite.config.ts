import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

function vitePluginRestoreSsrPlaceholders(): Plugin {
  return {
    name: "restore-ssr-placeholders",
    enforce: "post",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV !== "production") {
        return html;
      }
      return html
        .replace(/<title>[^<]*<\/title>/, "<title>__PAGE_TITLE__<\/title>")
        .replace(/(<meta name="description" content=")[^"]*(")/,        "$1__PAGE_DESCRIPTION__$2")
        .replace(/(<meta property="og:title" content=")[^"]*(")/,       "$1__PAGE_TITLE__$2")
        .replace(/(<meta property="og:description" content=")[^"]*(")/,  "$1__PAGE_DESCRIPTION__$2")
        .replace(/(<meta property="og:image" content=")[^"]*(")/,       "$1__PAGE_IMAGE__$2")
        .replace(/(<meta property="og:url" content=")[^"]*(")/,         "$1__PAGE_URL__$2")
        .replace(/(<meta name="twitter:title" content=")[^"]*(")/,      "$1__PAGE_TITLE__$2")
        .replace(/(<meta name="twitter:description" content=")[^"]*(")/,"$1__PAGE_DESCRIPTION__$2")
        .replace(/(<meta name="twitter:image" content=")[^"]*(")/,      "$1__PAGE_IMAGE__$2");
    },
  };
}

const isDev = process.env.NODE_ENV !== "production";
const plugins = [
  react(),
  tailwindcss(),
  isDev && jsxLocPlugin(),
  vitePluginRestoreSsrPlaceholders(),
].filter(Boolean);

export default defineConfig({
  plugins,
  // Année du build, injectée comme littéral dans le bundle client → le Footer
  // affiche la même année qu'au prerender (hydratation déterministe).
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@tsparticles") || id.includes("tsparticles")) return "particles";
          if (id.includes("i18next") || id.includes("react-i18next")) return "i18n";
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
    hmr: { clientPort: 443, protocol: "wss" },
    allowedHosts: ["localhost", "127.0.0.1", ".railway.app", "hallucinecran.fr", "hallucinecran.com"],
    fs: { strict: true, deny: ["**/.*"] },
  },
});
