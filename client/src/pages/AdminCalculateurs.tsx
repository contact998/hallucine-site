/**
 * Page admin des calculateurs de prix des tentes gonflables
 * Accessible uniquement aux administrateurs
 */
import { useState } from "react";
import CalculateurTenteX from "@/components/calculateurs/CalculateurTenteX";
import CalculateurTenteV from "@/components/calculateurs/CalculateurTenteV";
import CalculateurTenteN from "@/components/calculateurs/CalculateurTenteN";
import CalculateurTenteAraignee from "@/components/calculateurs/CalculateurTenteAraignee";

type TabId = "x" | "v" | "n" | "araignee";

const TABS: { id: TabId; label: string; description: string }[] = [
  { id: "x", label: "Tente X", description: "3x3 à 8x8 — 4 côtés configurables, auvents, connexions" },
  { id: "v", label: "Tente V", description: "4x4 à 6x6 — Toit, pieds, impressions" },
  { id: "n", label: "Tente N", description: "3x3 à 5x5 — Murs A/B/C/D+C, couleurs" },
  { id: "araignee", label: "Tente Araignée", description: "4x4 à 10x10 — Murs, auvents" },
];

export default function AdminCalculateurs() {
  const [activeTab, setActiveTab] = useState<TabId>("x");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Calculateurs de prix</h1>
        <p className="text-muted-foreground">Calculez le prix d'achat HT des tentes gonflables avec conversion de devises en temps réel.</p>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description de l'onglet actif */}
      <div className="text-sm text-muted-foreground mb-6">
        {TABS.find(t => t.id === activeTab)?.description}
      </div>

      {/* Contenu */}
      {activeTab === "x" && <CalculateurTenteX />}
      {activeTab === "v" && <CalculateurTenteV />}
      {activeTab === "n" && <CalculateurTenteN />}
      {activeTab === "araignee" && <CalculateurTenteAraignee />}
    </div>
  );
}
