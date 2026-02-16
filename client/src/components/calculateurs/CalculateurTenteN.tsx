/**
 * Calculateur de prix HT des Tentes en N
 * Style Excel : fond blanc, tableaux avec bordures
 */
import { useState, useCallback } from "react";

type Size = "3x3" | "4x4" | "5x5";
type Currency = "USD" | "EUR" | "GBP" | "CHF";
type WallType = "none" | "A-curve" | "A-straight" | "B-straight" | "C-curve" | "D+C-curve" | "D+C-straight";

interface BreakdownItem { name: string; price: number; }

const SIDE_LABELS: Record<string, string> = { side1: "Côté 1", side2: "Côté 2", side3: "Côté 3", side4: "Côté 4" };
const SIDES = ["side1", "side2", "side3", "side4"] as const;

const PRICES: Record<string, Record<Size, number>> = {
  "canopy": { "3x3": 255, "4x4": 345, "5x5": 465 },
  "legframe": { "3x3": 1173, "4x4": 1590, "5x5": 2148 },
  "sidewallA-curve": { "3x3": 120, "4x4": 159, "5x5": 213 },
  "sidewallA-straight": { "3x3": 120, "4x4": 159, "5x5": 213 },
  "sidewallB-straight": { "3x3": 120, "4x4": 159, "5x5": 213 },
  "sidewallC-curve": { "3x3": 63, "4x4": 81, "5x5": 108 },
  "sidewallDC-curve": { "3x3": 183, "4x4": 240, "5x5": 321 },
  "sidewallDC-straight": { "3x3": 183, "4x4": 240, "5x5": 321 },
  "print-canopy": { "3x3": 195, "4x4": 261, "5x5": 363 },
  "print-legframe": { "3x3": 333, "4x4": 444, "5x5": 618 },
  "print-zipcover": { "3x3": 72, "4x4": 96, "5x5": 132 },
  "print-sidewallA": { "3x3": 111, "4x4": 183, "5x5": 222 },
  "print-sidewallB": { "3x3": 150, "4x4": 252, "5x5": 327 },
  "print-sidewallC": { "3x3": 78, "4x4": 87, "5x5": 120 },
  "print-sidewallD": { "3x3": 132, "4x4": 180, "5x5": 213 },
  "print-Cwallzippercover": { "3x3": 18, "4x4": 21, "5x5": 24 },
  "print-connectpart": { "3x3": 51, "4x4": 60, "5x5": 69 },
  "acc-bag": { "3x3": 180, "4x4": 180, "5x5": 180 },
  "acc-sandbag-unit": { "3x3": 30, "4x4": 30, "5x5": 30 },
  "acc-waterbag-unit": { "3x3": 60, "4x4": 60, "5x5": 60 },
  "acc-led": { "3x3": 195, "4x4": 195, "5x5": 195 },
  "acc-pump-elec": { "3x3": 105, "4x4": 105, "5x5": 105 },
  "acc-pump-hand": { "3x3": 45, "4x4": 45, "5x5": 45 },
  "acc-valves": { "3x3": 0, "4x4": 0, "5x5": 0 },
  "connectpart": { "3x3": 99, "4x4": 132, "5x5": 177 },
  "transport": { "3x3": 300, "4x4": 400, "5x5": 500 },
};

const CURRENCY_SYMBOLS: Record<Currency, string> = { USD: "$", EUR: "€", GBP: "£", CHF: "CHF" };
const cell = "border border-gray-300 px-3 py-2 text-sm";
const hdr = "border border-gray-300 px-3 py-2 text-sm font-semibold bg-gray-100 text-gray-800";
const sel = "border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900 w-full";
const chk = "flex items-center gap-2 text-sm text-gray-700";
const section = "text-base font-bold text-gray-800 mb-2 bg-blue-50 border border-blue-200 px-3 py-2";

// Labels lisibles pour le tableau des prix
const priceLabels: Record<string, string> = {
  canopy: "Toile de toit", legframe: "Structure pieds",
  "sidewallA-curve": "Mur A courbe", "sidewallA-straight": "Mur A droit",
  "sidewallB-straight": "Mur B droit", "sidewallC-curve": "Mur C courbe",
  "sidewallDC-curve": "Mur D+C courbe", "sidewallDC-straight": "Mur D+C droit",
  "print-canopy": "Impression toit", "print-legframe": "Impression pieds",
  "print-zipcover": "Impression couvertures ZIP",
  "print-sidewallA": "Impression mur A", "print-sidewallB": "Impression mur B",
  "print-sidewallC": "Impression mur C", "print-sidewallD": "Impression mur D",
  "print-Cwallzippercover": "Impression zip mur C", "print-connectpart": "Impression connecteur",
  "acc-bag": "Sac de transport", "acc-sandbag-unit": "Sac de sable (unité)",
  "acc-waterbag-unit": "Sac d'eau (unité)", "acc-led": "Lumière LED",
  "acc-pump-elec": "Pompe électrique", "acc-pump-hand": "Pompe manuelle",
  "acc-valves": "Valve", connectpart: "Connecteur tentes", transport: "Transport",
};

export default function CalculateurTenteN() {
  const [activeSubTab, setActiveSubTab] = useState<"calc" | "prices">("calc");
  const [size, setSize] = useState<Size>("4x4");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [rates, setRates] = useState<Record<Currency, number>>({ USD: 1, EUR: 0.9298, GBP: 0.7823, CHF: 0.8767 });
  const [ratesLoading, setRatesLoading] = useState(false);

  const [walls, setWalls] = useState<Record<string, WallType>>({ side1: "none", side2: "none", side3: "none", side4: "none" });
  const [wallPrint, setWallPrint] = useState<Record<string, { single: boolean; dPart: boolean; cPart: boolean }>>({
    side1: { single: false, dPart: false, cPart: false },
    side2: { single: false, dPart: false, cPart: false },
    side3: { single: false, dPart: false, cPart: false },
    side4: { single: false, dPart: false, cPart: false },
  });

  const [printCanopy, setPrintCanopy] = useState(false);
  const [printLegframe, setPrintLegframe] = useState(false);
  const [printZipcover, setPrintZipcover] = useState(false);

  const [bag, setBag] = useState(false);
  const [pumpElec, setPumpElec] = useState(false);
  const [pumpHand, setPumpHand] = useState(false);
  const [sandbags, setSandbags] = useState(0);
  const [waterbags, setWaterbags] = useState(0);
  const [led, setLed] = useState(false);
  const [connect, setConnect] = useState(false);
  const [printConnect, setPrintConnect] = useState(false);
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

  const getPrice = (key: string): number => PRICES[key]?.[size] || 0;

  const handleWallChange = (side: string, value: WallType) => {
    setWalls(prev => ({ ...prev, [side]: value }));
    setWallPrint(prev => ({ ...prev, [side]: { single: false, dPart: false, cPart: false } }));
  };

  const calculate = useCallback(() => {
    const rate = rates[currency] || 1;
    const breakdown: BreakdownItem[] = [];
    let totalUSD = 0;
    const add = (name: string, usd: number) => { if (usd > 0) { totalUSD += usd; breakdown.push({ name, price: usd * rate }); } };

    add("Toile de toit", getPrice("canopy"));
    add("Structure des pieds", getPrice("legframe"));

    SIDES.forEach(side => {
      const wt = walls[side];
      const sn = SIDE_LABELS[side];
      if (wt === "none") return;
      if (wt.startsWith("D+C")) {
        const s = wt.includes("curve") ? "curve" : "straight";
        add(`Mur D+C ${s} (${sn})`, getPrice(`sidewallDC-${s}`));
      } else if (wt === "C-curve") add(`Mur C courbe (${sn})`, getPrice("sidewallC-curve"));
      else if (wt.startsWith("A-")) add(`Mur A ${wt.includes("curve") ? "courbe" : "droit"} (${sn})`, getPrice(`sidewallA-${wt.includes("curve") ? "curve" : "straight"}`));
      else if (wt.startsWith("B-")) add(`Mur B droit (${sn})`, getPrice("sidewallB-straight"));

      const wp = wallPrint[side];
      if (wt.startsWith("D+C")) {
        if (wp.dPart) add(`Impression Mur D (${sn})`, getPrice("print-sidewallD"));
        if (wp.cPart) { add(`Impression Mur C (${sn})`, getPrice("print-sidewallC")); add(`Impression Zip C (${sn})`, getPrice("print-Cwallzippercover")); }
      } else if (wt === "C-curve" && wp.single) add(`Impression Mur C (${sn})`, getPrice("print-sidewallC"));
      else if (wt.startsWith("A-") && wp.single) add(`Impression Mur A (${sn})`, getPrice("print-sidewallA"));
      else if (wt.startsWith("B-") && wp.single) add(`Impression Mur B (${sn})`, getPrice("print-sidewallB"));
    });

    if (printCanopy) add("Impression toile toit", getPrice("print-canopy"));
    if (printLegframe) add("Impression structure pieds", getPrice("print-legframe"));
    if (printZipcover) add("Impression couvertures ZIP", getPrice("print-zipcover"));
    if (bag) add("Sac de transport", getPrice("acc-bag"));
    if (pumpElec) add("Pompe électrique", getPrice("acc-pump-elec"));
    if (pumpHand) add("Pompe manuelle", getPrice("acc-pump-hand"));
    if (sandbags > 0) add(`Sacs de sable (${sandbags}x)`, getPrice("acc-sandbag-unit") * sandbags);
    if (waterbags > 0) add(`Sacs d'eau (${waterbags}x)`, getPrice("acc-waterbag-unit") * waterbags);
    if (led) add("Lumière LED", getPrice("acc-led"));
    if (connect) { add("Connecteur tentes", getPrice("connectpart")); if (printConnect) add("Impression connecteur", getPrice("print-connectpart")); }
    if (transport) add("Transport", getPrice("transport"));

    setResult({ total: totalUSD * rate, breakdown });
  }, [size, currency, rates, walls, wallPrint, printCanopy, printLegframe, printZipcover, bag, pumpElec, pumpHand, sandbags, waterbags, led, connect, printConnect, transport]);

  return (
    <div>
      {/* Sous-onglets */}
      <div className="flex gap-1 mb-4">
        <button onClick={() => setActiveSubTab("calc")} className={`px-4 py-1.5 text-sm font-medium border rounded-t ${activeSubTab === "calc" ? "bg-white border-gray-300 border-b-white text-gray-900" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>Calculateur</button>
        <button onClick={() => setActiveSubTab("prices")} className={`px-4 py-1.5 text-sm font-medium border rounded-t ${activeSubTab === "prices" ? "bg-white border-gray-300 border-b-white text-gray-900" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>Prix de base (USD)</button>
      </div>

      {activeSubTab === "prices" ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead><tr><th className={hdr}>Élément</th>{(["3x3", "4x4", "5x5"] as Size[]).map(s => <th key={s} className={hdr + " text-center"}>{s.replace("x", "m × ")}m</th>)}</tr></thead>
            <tbody>
              {Object.keys(PRICES).map(key => (
                <tr key={key} className="hover:bg-blue-50">
                  <td className={cell + " font-medium bg-gray-50"}>{priceLabels[key] || key}</td>
                  {(["3x3", "4x4", "5x5"] as Size[]).map(s => <td key={s} className={cell + " text-right font-mono"}>{PRICES[key][s]} $</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">Prix en USD.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Taille et devise */}
          <table className="w-full border-collapse">
            <tbody>
              <tr><td className={hdr + " w-40"}>Taille</td><td className={cell}>
                <select value={size} onChange={e => setSize(e.target.value as Size)} className={sel + " max-w-xs"}>
                  <option value="3x3">3m × 3m</option><option value="4x4">4m × 4m</option><option value="5x5">5m × 5m</option>
                </select>
              </td></tr>
              <tr><td className={hdr}>Devise</td><td className={cell}>
                <div className="flex items-center gap-3">
                  <select value={currency} onChange={e => setCurrency(e.target.value as Currency)} className={sel + " max-w-[150px]"}>
                    <option value="USD">$ USD</option><option value="EUR">€ EUR</option><option value="GBP">£ GBP</option><option value="CHF">CHF</option>
                  </select>
                  <button onClick={updateRates} disabled={ratesLoading} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50">{ratesLoading ? "..." : "Actualiser taux"}</button>
                  <span className="text-xs text-gray-500">1 USD = {rates[currency].toFixed(4)} {currency}</span>
                </div>
              </td></tr>
            </tbody>
          </table>

          {/* Configuration des murs */}
          <div className={section}>Configuration des 4 côtés</div>
          <table className="w-full border-collapse">
            <thead><tr><th className={hdr}>Côté</th><th className={hdr}>Type de mur</th><th className={hdr}>Impression</th></tr></thead>
            <tbody>
              {SIDES.map(side => {
                const wt = walls[side];
                const isDC = wt.startsWith("D+C");
                const isSimple = wt !== "none" && !isDC;
                return (
                  <tr key={side} className="hover:bg-blue-50">
                    <td className={cell + " font-medium bg-gray-50 w-24"}>{SIDE_LABELS[side]}</td>
                    <td className={cell}>
                      <select value={wt} onChange={e => handleWallChange(side, e.target.value as WallType)} className={sel}>
                        <option value="none">— Aucun —</option>
                        <option value="A-curve">Type A - Courbe</option>
                        <option value="A-straight">Type A - Droit</option>
                        <option value="B-straight">Type B - Droit</option>
                        <option value="C-curve">Type C - Courbe</option>
                        <option value="D+C-curve">Type D+C - Courbe</option>
                        <option value="D+C-straight">Type D+C - Droit</option>
                      </select>
                    </td>
                    <td className={cell + " w-44"}>
                      {isSimple && <label className={chk}><input type="checkbox" checked={wallPrint[side].single} onChange={e => setWallPrint(prev => ({ ...prev, [side]: { ...prev[side], single: e.target.checked } }))} /> Impression</label>}
                      {isDC && (
                        <div className="space-y-1">
                          <label className={chk}><input type="checkbox" checked={wallPrint[side].dPart} onChange={e => setWallPrint(prev => ({ ...prev, [side]: { ...prev[side], dPart: e.target.checked } }))} /> Partie D</label>
                          <label className={chk}><input type="checkbox" checked={wallPrint[side].cPart} onChange={e => setWallPrint(prev => ({ ...prev, [side]: { ...prev[side], cPart: e.target.checked } }))} /> Partie C</label>
                        </div>
                      )}
                      {wt === "none" && <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Impressions générales */}
          <div className={section}>Impressions générales</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="hover:bg-blue-50">
                <td className={cell}><label className={chk}><input type="checkbox" checked={printCanopy} onChange={e => setPrintCanopy(e.target.checked)} /> Impression toile toit</label></td>
                <td className={cell}><label className={chk}><input type="checkbox" checked={printLegframe} onChange={e => setPrintLegframe(e.target.checked)} /> Impression structure pieds</label></td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className={cell} colSpan={2}><label className={chk}><input type="checkbox" checked={printZipcover} onChange={e => setPrintZipcover(e.target.checked)} /> Impression couvertures ZIP</label></td>
              </tr>
            </tbody>
          </table>

          {/* Accessoires */}
          <div className={section}>Accessoires</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="hover:bg-blue-50">
                <td className={cell}><label className={chk}><input type="checkbox" checked={bag} onChange={e => setBag(e.target.checked)} /> Sac de transport</label></td>
                <td className={cell}><label className={chk}><input type="checkbox" checked={led} onChange={e => setLed(e.target.checked)} /> Lumière LED</label></td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className={cell}><label className={chk}><input type="checkbox" checked={pumpElec} onChange={e => setPumpElec(e.target.checked)} /> Pompe électrique</label></td>
                <td className={cell}><label className={chk}><input type="checkbox" checked={pumpHand} onChange={e => setPumpHand(e.target.checked)} /> Pompe manuelle</label></td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className={cell}><div className="flex items-center gap-2 text-sm text-gray-700">Sacs de sable : <input type="number" min="0" max="99" value={sandbags} onChange={e => setSandbags(parseInt(e.target.value) || 0)} className="border border-gray-300 rounded px-2 py-1 w-16 text-sm bg-white" /></div></td>
                <td className={cell}><div className="flex items-center gap-2 text-sm text-gray-700">Sacs d'eau : <input type="number" min="0" max="99" value={waterbags} onChange={e => setWaterbags(parseInt(e.target.value) || 0)} className="border border-gray-300 rounded px-2 py-1 w-16 text-sm bg-white" /></div></td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className={cell}><label className={chk}><input type="checkbox" checked={connect} onChange={e => setConnect(e.target.checked)} /> Connecteur tentes</label></td>
                <td className={cell}>{connect && <label className={chk}><input type="checkbox" checked={printConnect} onChange={e => setPrintConnect(e.target.checked)} /> Impression connecteur</label>}</td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className={cell} colSpan={2}><label className={chk}><input type="checkbox" checked={transport} onChange={e => setTransport(e.target.checked)} /> Transport</label></td>
              </tr>
            </tbody>
          </table>

          <button onClick={calculate} className="bg-green-600 text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-green-700 w-full">Calculer le prix</button>

          {result && (
            <div className="border-2 border-green-600 bg-green-50">
              <div className="bg-green-600 text-white px-4 py-2 text-lg font-bold">Prix total HT : {result.total.toFixed(2)} {CURRENCY_SYMBOLS[currency]}</div>
              <table className="w-full border-collapse">
                <thead><tr><th className="border border-gray-300 px-3 py-1.5 text-sm font-semibold bg-green-100 text-left">Élément</th><th className="border border-gray-300 px-3 py-1.5 text-sm font-semibold bg-green-100 text-right w-32">Prix</th></tr></thead>
                <tbody>
                  {result.breakdown.map((item, i) => (
                    <tr key={i} className="hover:bg-green-50">
                      <td className="border border-gray-300 px-3 py-1 text-sm">{item.name}</td>
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
