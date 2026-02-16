/**
 * Calculateur de prix HT des Tentes en V
 * Converti depuis le fichier HTML original
 */
import { useState, useCallback } from "react";

type Size = "4x4" | "5x5" | "6x6";
type Currency = "USD" | "EUR" | "GBP" | "CHF";

interface BreakdownItem { name: string; price: number; }

// Prix USD
const PRICES: Record<Size, Record<string, number>> = {
  "4x4": { "Toit seul": 516, "Pied avec TPU": 1830, "Impression toit": 399, "Impression pieds": 375, "Sac de transport": 180, "Transport": 300 },
  "5x5": { "Toit seul": 651, "Pied avec TPU": 2139, "Impression toit": 564, "Impression pieds": 504, "Sac de transport": 180, "Transport": 400 },
  "6x6": { "Toit seul": 825, "Pied avec TPU": 2823, "Impression toit": 783, "Impression pieds": 684, "Sac de transport": 180, "Transport": 500 },
};

const CURRENCY_SYMBOLS: Record<Currency, string> = { USD: "$", EUR: "€", GBP: "£", CHF: "CHF" };

export default function CalculateurTenteV() {
  const [size, setSize] = useState<Size>("4x4");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [rates, setRates] = useState<Record<Currency, number>>({ USD: 1, EUR: 0.9298, GBP: 0.7823, CHF: 0.8767 });
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesDate, setRatesDate] = useState<string | null>(null);

  // Options
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
        setRatesDate(new Date().toLocaleString("fr-FR"));
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
        breakdown.push({ name: opt.name, price: (p * rate) });
      }
    });

    setResult({ total: totalUSD * rate, breakdown });
  }, [size, currency, rates, toit, pieds, impToit, impPieds, sac, transport]);

  return (
    <div className="space-y-6">
      {/* Devise & Taux */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Devise</label>
            <select value={currency} onChange={e => setCurrency(e.target.value as Currency)} className="bg-background border border-border rounded px-3 py-2 text-sm">
              <option value="USD">$ - USD</option>
              <option value="EUR">€ - EUR</option>
              <option value="GBP">£ - GBP</option>
              <option value="CHF">CHF</option>
            </select>
          </div>
          <button onClick={updateRates} disabled={ratesLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50">
            {ratesLoading ? "Chargement..." : "Actualiser les taux"}
          </button>
          {ratesDate && <span className="text-xs text-muted-foreground">Dernière MAJ : {ratesDate}</span>}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
          {Object.entries(rates).map(([cur, rate]) => (
            <div key={cur} className="bg-background/50 rounded p-2 text-center">
              <div className="font-medium">{cur}</div>
              <div className="text-muted-foreground">{rate.toFixed(4)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Taille */}
      <div className="bg-card border border-border rounded-lg p-4">
        <label className="block text-sm font-medium mb-2">Taille de la tente</label>
        <select value={size} onChange={e => setSize(e.target.value as Size)} className="bg-background border border-border rounded px-3 py-2 text-sm w-full max-w-xs">
          <option value="4x4">4m × 4m</option>
          <option value="5x5">5m × 5m</option>
          <option value="6x6">6m × 6m</option>
        </select>
      </div>

      {/* Options */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={toit} onChange={e => setToit(e.target.checked)} className="rounded" /> Toit seul</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={pieds} onChange={e => setPieds(e.target.checked)} className="rounded" /> Pied avec TPU</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={impToit} onChange={e => setImpToit(e.target.checked)} className="rounded" /> Impression toit</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={impPieds} onChange={e => setImpPieds(e.target.checked)} className="rounded" /> Impression pieds</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sac} onChange={e => setSac(e.target.checked)} className="rounded" /> Sac de transport</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={transport} onChange={e => setTransport(e.target.checked)} className="rounded" /> Transport</label>
        </div>
      </div>

      {/* Bouton calcul */}
      <button onClick={calculate} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-base w-full">
        Calculer le prix
      </button>

      {/* Résultat */}
      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
          <div className="text-3xl font-bold text-green-400 mb-4">
            Prix total HT : {result.total.toFixed(2)} {CURRENCY_SYMBOLS[currency]}
          </div>
          <h4 className="font-medium mb-2">Détail :</h4>
          <div className="space-y-1">
            {result.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.name} ({size.replace("x", "m × ")}m)</span>
                <span className="font-mono">{item.price.toFixed(2)} {CURRENCY_SYMBOLS[currency]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Taux utilisé : 1 USD = {rates[currency].toFixed(4)} {currency} | Calculé le {new Date().toLocaleString("fr-FR")}
          </div>
        </div>
      )}
    </div>
  );
}
