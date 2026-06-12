/**
 * Lexique i18n — terminologie de référence par marché (/admin/lexique).
 * Style tableau blanc lisible, même esprit que les calculateurs.
 * Données : client/src/data/lexique.ts (source unique).
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { LEXIQUE, type LexiqueLangue } from "@/data/lexique";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useNoIndex } from "@/hooks/useNoIndex";

export default function AdminLexique() {
  useDocumentMeta("Lexique i18n Admin", "Terminologie de référence par marché.");
  useNoIndex();

  const [active, setActive] = useState<LexiqueLangue["code"]>("en");
  const langue = LEXIQUE.find(l => l.code === active)!;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-4 border-b-2 border-gray-300 pb-2">
          <Link href="/admin">
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Lexique i18n — terminologie par marché</h1>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Le terme que chaque marché emploie et cherche réellement, et les contresens DeepL à ne jamais
          laisser passer. Les patchs manuels dans les JSON de langue sont définitifs
          (<code className="bg-gray-100 px-1 rounded">pnpm translate</code> ne retouche jamais une clé existante).
        </p>

        <div className="flex border-b border-gray-300">
          {LEXIQUE.map(l => (
            <button
              key={l.code}
              onClick={() => setActive(l.code)}
              className={`px-5 py-2 text-sm font-medium border border-b-0 rounded-t transition-colors ${
                active === l.code
                  ? "bg-white border-gray-300 text-gray-900 font-bold"
                  : "bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="border border-t-0 border-gray-300 rounded-b p-4">
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded p-3 text-sm text-gray-800">
            <span className="font-semibold">{langue.domaine}</span> — {langue.culture}
          </div>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-300 px-3 py-2 font-semibold">Concept (FR)</th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">Terme à employer</th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">Variantes / SEO</th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">Piège à bannir</th>
              </tr>
            </thead>
            <tbody>
              {langue.entrees.map(e => (
                <tr key={e.concept} className="align-top">
                  <td className="border border-gray-300 px-3 py-2 text-gray-700">{e.concept}</td>
                  <td className="border border-gray-300 px-3 py-2 font-semibold text-gray-900">{e.terme}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-600">{e.variantes ?? "—"}</td>
                  <td className="border border-gray-300 px-3 py-2 text-red-700">{e.piege ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <p>Règles transverses : « Fabricant français depuis 1992 » se garde partout (argument de marque à l'export).</p>
            <p>Tenue au vent = « jusqu'à 38 km/h (6 Beaufort) » sur toutes les gammes, dégonflage au-delà.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
