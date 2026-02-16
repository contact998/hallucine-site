/**
 * Page admin des calculateurs de prix des tentes gonflables
 * Style Excel : fond blanc, tableaux avec bordures, simple et lisible
 */
import { useState } from "react";
import CalculateurTenteX from "@/components/calculateurs/CalculateurTenteX";
import CalculateurTenteV from "@/components/calculateurs/CalculateurTenteV";
import CalculateurTenteN from "@/components/calculateurs/CalculateurTenteN";
import CalculateurTenteAraignee from "@/components/calculateurs/CalculateurTenteAraignee";

type TabId = "x" | "v" | "n" | "araignee";

const TABS: { id: TabId; label: string }[] = [
  { id: "x", label: "Tente X" },
  { id: "v", label: "Tente V" },
  { id: "n", label: "Tente N" },
  { id: "araignee", label: "Tente Araignée" },
];

export default function AdminCalculateurs() {
  const [activeTab, setActiveTab] = useState<TabId>("x");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
          Calculateurs de prix — Tentes gonflables
        </h1>

        {/* Onglets style Excel */}
        <div className="flex border-b border-gray-300">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 text-sm font-medium border border-b-0 rounded-t transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 border-gray-300 -mb-px"
                  : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="border border-t-0 border-gray-300 bg-white p-6">
          {activeTab === "x" && <CalculateurTenteX />}
          {activeTab === "v" && <CalculateurTenteV />}
          {activeTab === "n" && <CalculateurTenteN />}
          {activeTab === "araignee" && <CalculateurTenteAraignee />}
        </div>
      </div>
    </div>
  );
}
