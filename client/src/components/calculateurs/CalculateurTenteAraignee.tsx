/**
 * Calculateur de prix HT des Tentes Araignée
 * Converti depuis le fichier HTML original
 * Logique : 4 côtés (mur/auvent), impressions, accessoires, tailles 4-10m
 */
import { useState, useCallback } from "react";

type Size = "4x4" | "6x6" | "8x8" | "10x10";
type Currency = "USD" | "EUR" | "GBP" | "CHF";
type SideOption = "none" | "wall" | "awning";

interface BreakdownItem { name: string; price: number; }

const SIDE_LABELS: Record<string, string> = { side1: "Côté 1", side2: "Côté 2", side3: "Côté 3", side4: "Côté 4" };
const SIDES = ["side1", "side2", "side3", "side4"] as const;

// Prix USD par taille
const PRICES: Record<string, Record<Size, number>> = {
  // Structure
  "canopy": { "4x4": 222, "6x6": 369, "8x8": 555, "10x10": 750 },
  "legframe": { "4x4": 1083, "6x6": 1653, "8x8": 2397, "10x10": 3270 },
  // Murs & Auvents
  "wall": { "4x4": 90, "6x6": 174, "8x8": 225, "10x10": 279 },
  "awning-banner": { "4x4": 90, "6x6": 174, "8x8": 225, "10x10": 279 },
  "awning-leg": { "4x4": 60, "6x6": 111, "8x8": 126, "10x10": 162 },
  "awning-pvc": { "4x4": 45, "6x6": 54, "8x8": 72, "10x10": 126 },
  "awning-fabric": { "4x4": 126, "6x6": 165, "8x8": 252, "10x10": 339 },
  // Impressions structure
  "print-canopy": { "4x4": 213, "6x6": 342, "8x8": 522, "10x10": 699 },
  "print-legframe": { "4x4": 255, "6x6": 510, "8x8": 735, "10x10": 1002 },
  "print-zip": { "4x4": 39, "6x6": 45, "8x8": 54, "10x10": 72 },
  // Impressions murs/auvents
  "print-wall": { "4x4": 123, "6x6": 273, "8x8": 357, "10x10": 417 },
  "print-awningbanner": { "4x4": 111, "6x6": 147, "8x8": 237, "10x10": 285 },
  "print-awningleg": { "4x4": 72, "6x6": 132, "8x8": 150, "10x10": 192 },
  "print-awningpvc": { "4x4": 54, "6x6": 66, "8x8": 87, "10x10": 153 },
  "print-awningfabric": { "4x4": 150, "6x6": 198, "8x8": 300, "10x10": 402 },
  // Accessoires
  "acc-bag": { "4x4": 180, "6x6": 180, "8x8": 180, "10x10": 180 },
  "acc-pump-elec": { "4x4": 105, "6x6": 105, "8x8": 105, "10x10": 105 },
  "acc-pump-hand": { "4x4": 45, "6x6": 45, "8x8": 45, "10x10": 45 },
  "acc-sandbag": { "4x4": 33, "6x6": 33, "8x8": 33, "10x10": 33 },
  "acc-waterbag": { "4x4": 66, "6x6": 66, "8x8": 66, "10x10": 66 },
  "acc-led": { "4x4": 195, "6x6": 195, "8x8": 195, "10x10": 195 },
  // Transport
  "transport": { "4x4": 400, "6x6": 500, "8x8": 700, "10x10": 1000 },
};

const CURRENCY_SYMBOLS: Record<Currency, string> = { USD: "$", EUR: "€", GBP: "£", CHF: "CHF" };

export default function CalculateurTenteAraignee() {
  const [size, setSize] = useState<Size>("6x6");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [rates, setRates] = useState<Record<Currency, number>>({ USD: 1, EUR: 0.9298, GBP: 0.7823, CHF: 0.8767 });
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesDate, setRatesDate] = useState<string | null>(null);

  // Sides
  const [sides, setSides] = useState<Record<string, SideOption>>({ side1: "none", side2: "none", side3: "none", side4: "none" });
  const [sidePrint, setSidePrint] = useState<Record<string, boolean>>({ side1: false, side2: false, side3: false, side4: false });
  const [awningPrint, setAwningPrint] = useState<Record<string, { banner: boolean; leg: boolean; pvc: boolean; fabric: boolean }>>({
    side1: { banner: false, leg: false, pvc: false, fabric: false },
    side2: { banner: false, leg: false, pvc: false, fabric: false },
    side3: { banner: false, leg: false, pvc: false, fabric: false },
    side4: { banner: false, leg: false, pvc: false, fabric: false },
  });

  // General prints
  const [printCanopy, setPrintCanopy] = useState(false);
  const [printLegframe, setPrintLegframe] = useState(false);
  const [printZip, setPrintZip] = useState(false);

  // Accessories
  const [bag, setBag] = useState(false);
  const [pumpElec, setPumpElec] = useState(false);
  const [pumpHand, setPumpHand] = useState(false);
  const [sandbags, setSandbags] = useState(0);
  const [waterbags, setWaterbags] = useState(0);
  const [led, setLed] = useState(false);
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

    // Sides
    SIDES.forEach(side => {
      const sideType = sides[side];
      const sideName = SIDE_LABELS[side];
      if (sideType === "none") return;

      if (sideType === "wall") {
        addCost(`Mur (${sideName})`, getPrice("wall"));
        if (sidePrint[side]) addCost(`Impression mur (${sideName})`, getPrice("print-wall"));
      } else if (sideType === "awning") {
        addCost(`Auvent bannière (${sideName})`, getPrice("awning-banner"));
        addCost(`Auvent pieds (${sideName})`, getPrice("awning-leg"));
        addCost(`Auvent PVC (${sideName})`, getPrice("awning-pvc"));
        addCost(`Auvent tissu (${sideName})`, getPrice("awning-fabric"));
        const ap = awningPrint[side];
        if (ap.banner) addCost(`Imp. bannière auvent (${sideName})`, getPrice("print-awningbanner"));
        if (ap.leg) addCost(`Imp. pieds auvent (${sideName})`, getPrice("print-awningleg"));
        if (ap.pvc) addCost(`Imp. PVC auvent (${sideName})`, getPrice("print-awningpvc"));
        if (ap.fabric) addCost(`Imp. tissu auvent (${sideName})`, getPrice("print-awningfabric"));
      }
    });

    // General prints
    if (printCanopy) addCost("Impression toile de toit", getPrice("print-canopy"));
    if (printLegframe) addCost("Impression structure pieds", getPrice("print-legframe"));
    if (printZip) addCost("Impression couvertures ZIP", getPrice("print-zip"));

    // Accessories
    if (bag) addCost("Sac de transport", getPrice("acc-bag"));
    if (pumpElec) addCost("Pompe électrique", getPrice("acc-pump-elec"));
    if (pumpHand) addCost("Pompe manuelle", getPrice("acc-pump-hand"));
    if (sandbags > 0) addCost(`Sacs de sable (${sandbags}x)`, getPrice("acc-sandbag") * sandbags);
    if (waterbags > 0) addCost(`Sacs d'eau (${waterbags}x)`, getPrice("acc-waterbag") * waterbags);
    if (led) addCost("Lumière LED", getPrice("acc-led"));
    if (transport) addCost("Transport", getPrice("transport"));

    setResult({ total: totalUSD * rate, breakdown });
  }, [size, currency, rates, sides, sidePrint, awningPrint, printCanopy, printLegframe, printZip, bag, pumpElec, pumpHand, sandbags, waterbags, led, transport]);

  const handleSideChange = (side: string, value: SideOption) => {
    setSides(prev => ({ ...prev, [side]: value }));
    setSidePrint(prev => ({ ...prev, [side]: false }));
    setAwningPrint(prev => ({ ...prev, [side]: { banner: false, leg: false, pvc: false, fabric: false } }));
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
          <option value="4x4">4m × 4m</option>
          <option value="6x6">6m × 6m</option>
          <option value="8x8">8m × 8m</option>
          <option value="10x10">10m × 10m</option>
        </select>
      </div>

      {/* Configuration des côtés */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Configuration des 4 côtés</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SIDES.map(side => (
            <div key={side} className="border border-border rounded-lg p-3">
              <div className="font-medium text-sm mb-2">{SIDE_LABELS[side]}</div>
              <select value={sides[side]} onChange={e => handleSideChange(side, e.target.value as SideOption)} className="bg-background border border-border rounded px-3 py-2 text-sm w-full">
                <option value="none">Aucun</option>
                <option value="wall">Mur</option>
                <option value="awning">Auvent</option>
              </select>
              {sides[side] === "wall" && (
                <label className="flex items-center gap-2 mt-2 text-sm">
                  <input type="checkbox" checked={sidePrint[side]} onChange={e => setSidePrint(prev => ({ ...prev, [side]: e.target.checked }))} className="rounded" />
                  Impression sur ce mur
                </label>
              )}
              {sides[side] === "awning" && (
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-muted-foreground mb-1">Impressions auvent :</div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={awningPrint[side].banner} onChange={e => setAwningPrint(prev => ({ ...prev, [side]: { ...prev[side], banner: e.target.checked } }))} className="rounded" /> Bannière</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={awningPrint[side].leg} onChange={e => setAwningPrint(prev => ({ ...prev, [side]: { ...prev[side], leg: e.target.checked } }))} className="rounded" /> Pieds</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={awningPrint[side].pvc} onChange={e => setAwningPrint(prev => ({ ...prev, [side]: { ...prev[side], pvc: e.target.checked } }))} className="rounded" /> PVC pieds</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={awningPrint[side].fabric} onChange={e => setAwningPrint(prev => ({ ...prev, [side]: { ...prev[side], fabric: e.target.checked } }))} className="rounded" /> Tissu auvent</label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Impressions générales */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Impressions générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printCanopy} onChange={e => setPrintCanopy(e.target.checked)} className="rounded" /> Impression toile de toit</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printLegframe} onChange={e => setPrintLegframe(e.target.checked)} className="rounded" /> Impression structure pieds</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printZip} onChange={e => setPrintZip(e.target.checked)} className="rounded" /> Impression couvertures ZIP</label>
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
