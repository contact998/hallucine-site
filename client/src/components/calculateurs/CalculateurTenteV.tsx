/**
 * Calculateur de prix HT des Tentes en V
 * Style Excel : fond blanc, tableaux avec bordures
 */
import { useState, useCallback } from "react";

type Size = "4x4" | "5x5" | "6x6";
type Currency = "USD" | "EUR" | "GBP" | "CHF";

interface BreakdownItem { name: string; price: number; }

const PRICES: Record<Size, Record<string, number>> = {
  "4x4": { "Toit seul": 516, "Pied avec TPU": 1830, "Impression toit": 399, "Impression pieds": 375, "Sac de transport": 180, "Transport": 300 },
  "5x5": { "Toit seul": 651, "Pied avec TPU": 2139, "Impression toit": 564, "Impression pieds": 504, "Sac de transport": 180, "Transport": 400 },
  "6x6": { "Toit seul": 825, "Pied avec TPU": 2823, "Impression toit": 783, "Impression pieds": 684, "Sac de transport": 180, "Transport": 500 },
};

const CURRENCY_SYMBOLS: Record<Currency, string> = { USD: "$", EUR: "€", GBP: "£", CHF: "CHF" };
const cell = "border border-gray-300 px-3 py-2 text-sm";
const hdr = "border border-gray-300 px-3 py-2 text-sm font-semibold bg-gray-100 text-gray-800";
const sel = "border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900";
const chk = "flex items-center gap-2 text-sm text-gray-700";
const section = "text-base font-bold text-gray-800 mb-2 bg-blue-50 border border-blue-200 px-3 py-2";

export default function CalculateurTenteV() {
  const [activeSubTab, setActiveSubTab] = useState<"calc" | "prices">("calc");
  const [size, setSize] = useState<Size>("4x4");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [rates, setRates] = useState<Record<Currency, number>>({ USD: 1, EUR: 0.9298, GBP: 0.7823, CHF: 0.8767 });
  const [ratesLoading, setRatesLoading] = useState(false);

  const [toit, setToit] = useState(true);
  const [pieds, setPieds] = useState(true);
  const [impToit, setImpToit] = useState(false);
  const [impPieds, setImpPieds] = useState(false);
  const [sac, setSac] = useState(false);
  const [transport, setTransport] = useState(false);

  const [result, setResult] = useState<{ total: number; breakdown: BreakdownItem[] } | null>(null);

  const updateRates = useCallback(async () => {
    setRatesLoading(true);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      if (data?.rates) {
        setRates({ USD: 1, EUR: data.rates.EUR || 0.9298, GBP: data.rates.GBP || 0.7823, CHF: data.rates.CHF || 0.8767 });
      }
    } catch { /* fallback */ }
    setRatesLoading(false);
  }, []);

  const calculate = useCallback(() => {
    const sizeData = PRICES[size];
    const rate = rates[currency] || 1;
    const breakdown: BreakdownItem[] = [];
    let totalUSD = 0;

    const options = [
      { checked: toit, key: "Toit seul", name: "Toit seul" },
      { checked: pieds, key: "Pied avec TPU", name: "Pied avec TPU" },
      { checked: impToit, key: "Impression toit", name: "Impression toit" },
      { checked: impPieds, key: "Impression pieds", name: "Impression pieds" },
      { checked: sac, key: "Sac de transport", name: "Sac de transport" },
      { checked: transport, key: "Transport", name: "Transport" },
    ];

    options.forEach(opt => {
      if (opt.checked) {
        const p = sizeData[opt.key] || 0;
        totalUSD += p;
        breakdown.push({ name: opt.name, price: p * rate });
      }
    });

    setResult({ total: totalUSD * rate, breakdown });
  }, [size, currency, rates, toit, pieds, impToit, impPieds, sac, transport]);

  return (
    <div>
      {/* Sous-onglets */}
      <div className="flex gap-1 mb-4">
        <button onClick={() => setActiveSubTab("calc")} className={`px-4 py-1.5 text-sm font-medium border rounded-t ${activeSubTab === "calc" ? "bg-white border-gray-300 border-b-white text-gray-900" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>
          Calculateur
        </button>
        <button onClick={() => setActiveSubTab("prices")} className={`px-4 py-1.5 text-sm font-medium border rounded-t ${activeSubTab === "prices" ? "bg-white border-gray-300 border-b-white text-gray-900" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>
          Prix de base (USD)
        </button>
      </div>

      {activeSubTab === "prices" ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={hdr}>Élément</th>
                {(["4x4", "5x5", "6x6"] as Size[]).map(s => (
                  <th key={s} className={hdr + " text-center"}>{s.replace("x", "m × ")}m</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(PRICES["4x4"]).map(key => (
                <tr key={key} className="hover:bg-blue-50">
                  <td className={cell + " font-medium bg-gray-50"}>{key}</td>
                  {(["4x4", "5x5", "6x6"] as Size[]).map(s => (
                    <td key={s} className={cell + " text-right font-mono"}>{PRICES[s][key]} $</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">Prix en USD. Taux de change appliqué au calcul final.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Taille et devise */}
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className={hdr + " w-40"}>Taille</td>
                <td className={cell}>
                  <select value={size} onChange={e => setSize(e.target.value as Size)} className={sel + " max-w-xs"}>
                    <option value="4x4">4m × 4m</option>
                    <option value="5x5">5m × 5m</option>
                    <option value="6x6">6m × 6m</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className={hdr}>Devise</td>
                <td className={cell}>
                  <div className="flex items-center gap-3">
                    <select value={currency} onChange={e => setCurrency(e.target.value as Currency)} className={sel + " max-w-[150px]"}>
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                      <option value="GBP">£ GBP</option>
                      <option value="CHF">CHF</option>
                    </select>
                    <button onClick={updateRates} disabled={ratesLoading} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50">
                      {ratesLoading ? "..." : "Actualiser taux"}
                    </button>
                    <span className="text-xs text-gray-500">1 USD = {rates[currency].toFixed(4)} {currency}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Configuration */}
          <div className={section}>Configuration</div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={hdr}>Élément</th>
                <th className={hdr + " text-center w-24"}>Inclus</th>
                <th className={hdr + " text-right w-32"}>Prix USD</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Toit seul", checked: toit, set: setToit, key: "Toit seul" },
                { label: "Pied avec TPU", checked: pieds, set: setPieds, key: "Pied avec TPU" },
                { label: "Impression toit", checked: impToit, set: setImpToit, key: "Impression toit" },
                { label: "Impression pieds", checked: impPieds, set: setImpPieds, key: "Impression pieds" },
                { label: "Sac de transport", checked: sac, set: setSac, key: "Sac de transport" },
                { label: "Transport", checked: transport, set: setTransport, key: "Transport" },
              ].map(opt => (
                <tr key={opt.key} className="hover:bg-blue-50">
                  <td className={cell}><label className={chk}>{opt.label}</label></td>
                  <td className={cell + " text-center"}><input type="checkbox" checked={opt.checked} onChange={e => opt.set(e.target.checked)} /></td>
                  <td className={cell + " text-right font-mono"}>{PRICES[size][opt.key]} $</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bouton calcul */}
          <button onClick={calculate} className="bg-green-600 text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-green-700 w-full">
            Calculer le prix
          </button>

          {/* Résultat */}
          {result && (
            <div className="border-2 border-green-600 bg-green-50">
              <div className="bg-green-600 text-white px-4 py-2 text-lg font-bold">
                Prix total HT : {result.total.toFixed(2)} {CURRENCY_SYMBOLS[currency]}
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-3 py-1.5 text-sm font-semibold bg-green-100 text-left">Élément</th>
                    <th className="border border-gray-300 px-3 py-1.5 text-sm font-semibold bg-green-100 text-right w-32">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((item, i) => (
                    <tr key={i} className="hover:bg-green-50">
                      <td className="border border-gray-300 px-3 py-1 text-sm">{item.name} ({size.replace("x", "m × ")}m)</td>
                      <td className="border border-gray-300 px-3 py-1 text-sm text-right font-mono">{item.price.toFixed(2)} {CURRENCY_SYMBOLS[currency]}</td>
                    </tr>
                  ))}
                  <tr className="bg-green-100 font-bold">
                    <td className="border border-gray-300 px-3 py-2 text-sm">TOTAL HT</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm text-right font-mono">{result.total.toFixed(2)} {CURRENCY_SYMBOLS[currency]}</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-gray-500 px-3 py-1">Taux : 1 USD = {rates[currency].toFixed(4)} {currency}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
