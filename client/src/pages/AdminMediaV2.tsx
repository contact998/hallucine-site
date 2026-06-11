/**
 * AdminMediaV2 — Médiathèque refondue (Refine shell + onglets).
 *
 * Refonte « fond + emplacements » :
 *   - Bibliothèque : le fond d'images unique (upload, recherche, métadonnées).
 *   - Emplacements : chaque endroit du site pioche dans le fond (single / galerie).
 *   - Blog / SEO   : panneaux existants.
 *
 * L'ancien écran page/section a été supprimé.
 */
import { useState, type ReactNode } from "react";
import { Refine } from "@refinedev/core";
import { dataProvider, authProvider, notificationProvider } from "../admin-v2/providers";
import { BibliothequePanel } from "../admin-v2/BibliothequePanel";
import { EmplacementsPanel } from "../admin-v2/EmplacementsPanel";
import { BlogPanel } from "../admin-v2/BlogPanel";
import { SeoPanel } from "../admin-v2/SeoPanel";

type Tab = "bibliotheque" | "emplacements" | "blog" | "seo";

export default function AdminMediaV2() {
  const [tab, setTab] = useState<Tab>("bibliotheque");
  return (
    <Refine
      dataProvider={dataProvider}
      authProvider={authProvider}
      notificationProvider={notificationProvider}
      resources={[
        { name: "mediaResource", meta: { label: "Bibliothèque" } },
        { name: "blogResource", meta: { label: "Blog" } },
        { name: "seoResource", meta: { label: "SEO" } },
      ]}
      options={{ disableTelemetry: true, warnWhenUnsavedChanges: false }}
    >
      <div className="min-h-screen bg-background text-white">
        <div className="container mx-auto px-4 pt-28 pb-16 max-w-7xl">
          <div className="flex items-center gap-1 mb-6 border-b border-white/10">
            <TabBtn active={tab === "bibliotheque"} onClick={() => setTab("bibliotheque")}>Bibliothèque</TabBtn>
            <TabBtn active={tab === "emplacements"} onClick={() => setTab("emplacements")}>Emplacements</TabBtn>
            <TabBtn active={tab === "blog"} onClick={() => setTab("blog")}>Blog</TabBtn>
            <TabBtn active={tab === "seo"} onClick={() => setTab("seo")}>SEO</TabBtn>
            <span className="ml-auto text-xs text-white/30 pb-2">admin v2</span>
          </div>
          {tab === "bibliotheque" ? <BibliothequePanel />
            : tab === "emplacements" ? <EmplacementsPanel />
            : tab === "blog" ? <BlogPanel />
            : <SeoPanel />}
        </div>
      </div>
    </Refine>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active ? "border-amber-400 text-white" : "border-transparent text-white/50 hover:text-white/80"
      }`}
    >
      {children}
    </button>
  );
}
