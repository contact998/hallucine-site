/**
 * Calculateur de prix HT des Tentes en N
 * Converti depuis le fichier HTML original
 * Logique : 4 côtés configurables (A, B, C, D+C), couleurs, impressions, accessoires
 */
import { useState, useCallback } from "react";

type Size = "3x3" | "4x4" | "5x5";
type Currency = "USD" | "EUR" | "GBP" | "CHF";
type WallType = "none" | "A-curve" | "A-straight" | "B-straight" | "C-curve" | "D+C-curve" | "D+C-straight";

interface BreakdownItem { name: string; price: number; }

const SIDE_LABELS: Record<string, string> = { side1: "Côté 1", side2: "Côté 2", side3: "Côté 3", side4: "Côté 4" };
const SIDES = ["side1", "side2", "side3", "side4"] as const;

// Prix USD par taille (index 0=3x3, 1=4x4, 2=5x5)
const PRICES: Record<string, Record<Size, number>> = {
  // Structure de base
  "canopy": { "3x3": 255, "4x4": 345, "5x5": 465 },
  "legframe": { "3x3": 1173, "4x4": 1590, "5x5": 2148 },
  // Murs tissu
  "sidewallA-curve": { "3x3": 120, "4x4": 159, "5x5": 213 },
  "sidewallA-straight": { "3x3": 120, "4x4": 159, "5x5": 213 },
  "sidewallB-straight": { "3x3": 120, "4x4": 159, "5x5": 213 },
  "sidewallC-curve": { "3x3": 63, "4x4": 81, "5x5": 108 },
  "sidewallDC-curve": { "3x3": 183, "4x4": 240, "5x5": 321 },
  "sidewallDC-straight": { "3x3": 183, "4x4": 240, "5x5": 321 },
  // Impression structure
  "print-canopy": { "3x3": 195, "4x4": 261, "5x5": 363 },
  "print-legframe": { "3x3": 333, "4x4": 444, "5x5": 618 },
  "print-zipcover": { "3x3": 72, "4x4": 96, "5x5": 132 },
  // Impression murs
  "print-sidewallA": { "3x3": 111, "4x4": 183, "5x5": 222 },
  "print-sidewallB": { "3x3": 150, "4x4": 252, "5x5": 327 },
  "print-sidewallC": { "3x3": 78, "4x4": 87, "5x5": 120 },
  "print-sidewallD": { "3x3": 132, "4x4": 180, "5x5": 213 },
  "print-Cwallzippercover": { "3x3": 18, "4x4": 21, "5x5": 24 },
  "print-connectpart": { "3x3": 51, "4x4": 60, "5x5": 69 },
  // Accessoires
  "acc-bag": { "3x3": 180, "4x4": 180, "5x5": 180 },
  "acc-sandbag-unit": { "3x3": 30, "4x4": 30, "5x5": 30 },
  "acc-waterbag-unit": { "3x3": 60, "4x4": 60, "5x5": 60 },
  "acc-led": { "3x3": 195, "4x4": 195, "5x5": 195 },
  "acc-pump-elec": { "3x3": 105, "4x4": 105, "5x5": 105 },
  "acc-pump-hand": { "3x3": 45, "4x4": 45, "5x5": 45 },
  "acc-valves": { "3x3": 0, "4x4": 0, "5x5": 0 },
  "connectpart": { "3x3": 99, "4x4": 132, "5x5": 177 },
  // Transport
  "transport": { "3x3": 300, "4x4": 400, "5x5": 500 },
};

const CURRENCY_SYMBOLS: Record<Currency, string> = { USD: "$", EUR: "€", GBP: "£", CHF: "CHF" };

export default function CalculateurTenteN() {
  const [size, setSize] = useState<Size>("4x4");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [rates, setRates] = useState<Record<Currency, number>>({ USD: 1, EUR: 0.9298, GBP: 0.7823, CHF: 0.8767 });
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesDate, setRatesDate] = useState<string | null>(null);

  // Walls
  const [walls, setWalls] = useState<Record<string, WallType>>({ side1: "none", side2: "none", side3: "none", side4: "none" });
  const [wallPrint, setWallPrint] = useState<Record<string, { single: boolean; dPart: boolean; cPart: boolean }>>({
    side1: { single: false, dPart: false, cPart: false },
    side2: { single: false, dPart: false, cPart: false },
    side3: { single: false, dPart: false, cPart: false },
    side4: { single: false, dPart: false, cPart: false },
  });

  // General prints
  const [printCanopy, setPrintCanopy] = useState(false);
  const [printLegframe, setPrintLegframe] = useState(false);
  const [printZipcover, setPrintZipcover] = useState(false);

  // Accessories
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
        setRatesDate(new Date().toLocaleString("fr-FR"));
      }
    } catch { /* fallback */ }
    setRatesLoading(false);
  }, []);

  const getPrice = (key: string): number => {
    const p = PRICES[key];
    return p ? (p[size] || 0) : 0;
  };

  const calculate = useCallback(() => {
    const rate = rates[currency] || 1;
    const breakdown: BreakdownItem[] = [];
    let totalUSD = 0;

    const addCost = (name: string, usd: number) => {
      if (usd > 0) {
        totalUSD += usd;
        breakdown.push({ name, price: usd * rate });
      }
    };

    // Base
    addCost("Toile de toit", getPrice("canopy"));
    addCost("Structure des pieds", getPrice("legframe"));

    // Walls
    SIDES.forEach(side => {
      const wallType = walls[side];
      const sideName = SIDE_LABELS[side];
      if (wallType === "none") return;

      // Fabric cost
      if (wallType.startsWith("D+C")) {
        const suffix = wallType.includes("curve") ? "curve" : "straight";
        addCost(`Mur D+C ${suffix} (${sideName})`, getPrice(`sidewallDC-${suffix}`));
      } else if (wallType === "C-curve") {
        addCost(`Mur C courbe (${sideName})`, getPrice("sidewallC-curve"));
      } else if (wallType.startsWith("A-")) {
        const suffix = wallType.includes("curve") ? "curve" : "straight";
        addCost(`Mur A ${suffix} (${sideName})`, getPrice(`sidewallA-${suffix}`));
      } else if (wallType.startsWith("B-")) {
        addCost(`Mur B droit (${sideName})`, getPrice("sidewallB-straight"));
      }

      // Wall prints
      const wp = wallPrint[side];
      if (wallType.startsWith("D+C")) {
        if (wp.dPart) addCost(`Impression Mur D (${sideName})`, getPrice("print-sidewallD"));
        if (wp.cPart) {
          addCost(`Impression Mur C (${sideName})`, getPrice("print-sidewallC"));
          addCost(`Impression Zip Mur C (${sideName})`, getPrice("print-Cwallzippercover"));
        }
      } else if (wallType === "C-curve") {
        if (wp.single) addCost(`Impression Mur C (${sideName})`, getPrice("print-sidewallC"));
      } else if (wallType.startsWith("A-")) {
        if (wp.single) addCost(`Impression Mur A (${sideName})`, getPrice("print-sidewallA"));
      } else if (wallType.startsWith("B-")) {
        if (wp.single) addCost(`Impression Mur B (${sideName})`, getPrice("print-sidewallB"));
      }
    });

    // General prints
    if (printCanopy) addCost("Impression toile toit", getPrice("print-canopy"));
    if (printLegframe) addCost("Impression structure pieds", getPrice("print-legframe"));
    if (printZipcover) addCost("Impression couvertures ZIP", getPrice("print-zipcover"));

    // Accessories
    if (bag) addCost("Sac de transport", getPrice("acc-bag"));
    if (pumpElec) addCost("Pompe électrique", getPrice("acc-pump-elec"));
    if (pumpHand) addCost("Pompe manuelle", getPrice("acc-pump-hand"));
    if (sandbags > 0) addCost(`Sacs de sable (${sandbags}x)`, getPrice("acc-sandbag-unit") * sandbags);
    if (waterbags > 0) addCost(`Sacs d'eau (${waterbags}x)`, getPrice("acc-waterbag-unit") * waterbags);
    if (led) addCost("Lumière LED", getPrice("acc-led"));
    if (connect) {
      addCost("Connecteur tentes (tissu)", getPrice("connectpart"));
      if (printConnect) addCost("Impression connecteur", getPrice("print-connectpart"));
    }
    if (transport) addCost("Transport", getPrice("transport"));

    setResult({ total: totalUSD * rate, breakdown });
  }, [size, currency, rates, walls, wallPrint, printCanopy, printLegframe, printZipcover, bag, pumpElec, pumpHand, sandbags, waterbags, led, connect, printConnect, transport]);

  const handleWallChange = (side: string, value: WallType) => {
    setWalls(prev => ({ ...prev, [side]: value }));
    setWallPrint(prev => ({ ...prev, [side]: { single: false, dPart: false, cPart: false } }));
  };

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
      </div>

      {/* Taille */}
      <div className="bg-card border border-border rounded-lg p-4">
        <label className="block text-sm font-medium mb-2">Taille de la tente</label>
        <select value={size} onChange={e => setSize(e.target.value as Size)} className="bg-background border border-border rounded px-3 py-2 text-sm w-full max-w-xs">
          <option value="3x3">3m × 3m</option>
          <option value="4x4">4m × 4m</option>
          <option value="5x5">5m × 5m</option>
        </select>
      </div>

      {/* Configuration des murs */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Configuration des 4 côtés</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SIDES.map(side => {
            const wallType = walls[side];
            const isDC = wallType.startsWith("D+C");
            const isSimple = wallType !== "none" && !isDC;
            return (
              <div key={side} className="border border-border rounded-lg p-3">
                <div className="font-medium text-sm mb-2">{SIDE_LABELS[side]}</div>
                <select value={wallType} onChange={e => handleWallChange(side, e.target.value as WallType)} className="bg-background border border-border rounded px-3 py-2 text-sm w-full">
                  <option value="none">Aucun mur</option>
                  <option value="A-curve">Type A - Courbe</option>
                  <option value="A-straight">Type A - Droit</option>
                  <option value="B-straight">Type B - Droit</option>
                  <option value="C-curve">Type C - Courbe (seul)</option>
                  <option value="D+C-curve">Type D+C - Courbe</option>
                  <option value="D+C-straight">Type D+C - Droit</option>
                </select>
                {isSimple && (
                  <label className="flex items-center gap-2 mt-2 text-sm">
                    <input type="checkbox" checked={wallPrint[side].single} onChange={e => setWallPrint(prev => ({ ...prev, [side]: { ...prev[side], single: e.target.checked } }))} className="rounded" />
                    Impression sur ce mur
                  </label>
                )}
                {isDC && (
                  <div className="mt-2 space-y-1">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={wallPrint[side].dPart} onChange={e => setWallPrint(prev => ({ ...prev, [side]: { ...prev[side], dPart: e.target.checked } }))} className="rounded" />
                      Impression partie D
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={wallPrint[side].cPart} onChange={e => setWallPrint(prev => ({ ...prev, [side]: { ...prev[side], cPart: e.target.checked } }))} className="rounded" />
                      Impression partie C (+ zip)
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Impressions générales */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Impressions générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printCanopy} onChange={e => setPrintCanopy(e.target.checked)} className="rounded" /> Impression toile de toit</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printLegframe} onChange={e => setPrintLegframe(e.target.checked)} className="rounded" /> Impression structure pieds</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printZipcover} onChange={e => setPrintZipcover(e.target.checked)} className="rounded" /> Impression couvertures ZIP</label>
        </div>
      </div>

      {/* Accessoires */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Accessoires</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={bag} onChange={e => setBag(e.target.checked)} className="rounded" /> Sac de transport</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={pumpElec} onChange={e => setPumpElec(e.target.checked)} className="rounded" /> Pompe électrique</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={pumpHand} onChange={e => setPumpHand(e.target.checked)} className="rounded" /> Pompe manuelle</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={led} onChange={e => setLed(e.target.checked)} className="rounded" /> Lumière LED</label>
          <div className="flex items-center gap-2 text-sm">
            <label>Sacs de sable :</label>
            <input type="number" min="0" max="99" value={sandbags} onChange={e => setSandbags(parseInt(e.target.value) || 0)} className="bg-background border border-border rounded px-2 py-1 w-16 text-sm" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <label>Sacs d'eau :</label>
            <input type="number" min="0" max="99" value={waterbags} onChange={e => setWaterbags(parseInt(e.target.value) || 0)} className="bg-background border border-border rounded px-2 py-1 w-16 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={connect} onChange={e => setConnect(e.target.checked)} className="rounded" /> Connecteur tentes</label>
          {connect && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printConnect} onChange={e => setPrintConnect(e.target.checked)} className="rounded" /> Impression connecteur</label>}
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
                <span>{item.name}</span>
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
