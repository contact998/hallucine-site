/**
 * AdminMediaV2 — Médiathèque refondue (« fond + emplacements »).
 *
 * 100 % tRPC, PAS de Refine ici : @refinedev/core v4 tire react-query v4 alors que
 * l'app (tRPC v11) est en react-query v5 → `defaultMutationOptions is not a function`
 * au montage de <Refine>. La médiathèque n'a pas besoin de Refine.
 * Blog : géré via /admin/blog. (SEO overrides : à recâbler hors Refine si besoin.)
 */
import { useState, type ReactNode } from "react";
import { BibliothequePanel } from "../admin-v2/BibliothequePanel";
import { EmplacementsPanel } from "../admin-v2/EmplacementsPanel";

type Tab = "bibliotheque" | "emplacements";

export default function AdminMediaV2() {
  const [tab, setTab] = useState<Tab>("bibliotheque");
  return (
    <div className="min-h-screen bg-background text-white">
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-7xl">
        <div className="flex items-center gap-1 mb-6 border-b border-white/10">
          <TabBtn active={tab === "bibliotheque"} onClick={() => setTab("bibliotheque")}>Bibliothèque</TabBtn>
          <TabBtn active={tab === "emplacements"} onClick={() => setTab("emplacements")}>Emplacements</TabBtn>
          <span className="ml-auto text-xs text-white/30 pb-2">médiathèque</span>
        </div>
        {tab === "bibliotheque" ? <BibliothequePanel /> : <EmplacementsPanel />}
      </div>
    </div>
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
