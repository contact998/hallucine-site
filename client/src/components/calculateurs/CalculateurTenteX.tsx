/**
 * Calculateur de prix HT des Tentes en X
 * Converti depuis le fichier HTML original
 * Logique : prix de base USD × 3, conversion devise, configuration des 4 côtés
 */
import { useState, useCallback, useMemo } from "react";

// Types
type Size = "3x3" | "4x4" | "5x5" | "6x6" | "7x7" | "8x8";
type SideType = "none" | "wall" | "door" | "window" | "curved" | "awning" | "connection";
type Currency = "USD" | "EUR" | "GBP" | "AUD" | "CAD";

interface BreakdownItem {
  name: string;
  price: number;
}

// Prix de base USD (avant multiplication ×3)
const ORIGINAL_BASE_PRICES: Record<string, Record<string, number>> = {
  "3m*3m": { "Canopy only": 111, "leg with TPU": 358, "Side wall": 37, "Door wall": 45, "Window wall": 43, "curve wall": 32, "Awning": 144, "Connector": 47, "canopy printing": 94, "zipper Trim cover printing": 10, "all wall each printing": 47, "curve wall printing": 13, "Leg printing": 64, "Leg PVC bottom printing": 23, "awning banner printing": 24, "awning cloth printing": 39, "awning leg printing": 11, "awning leg PVC bottom printing": 11, "connector printing": 17, "transport bag": 60, "sand bag": 0, "LED light": 65, "Electric pump": 35, "Hand pump": 10, "valves": 0, "shipping cost": 300 },
  "4m*4m": { "Canopy only": 147, "leg with TPU": 466, "Side wall": 46, "Door wall": 57, "Window wall": 53, "curve wall": 39, "Awning": 171, "Connector": 51, "canopy printing": 160, "zipper Trim cover printing": 13, "all wall each printing": 58, "curve wall printing": 14, "Leg printing": 133, "Leg PVC bottom printing": 28, "awning banner printing": 33, "awning cloth printing": 44, "awning leg printing": 13, "awning leg PVC bottom printing": 11, "connector printing": 20, "transport bag": 60, "sand bag": 0, "LED light": 65, "Electric pump": 35, "Hand pump": 10, "valves": 0, "shipping cost": 400 },
  "5m*5m": { "Canopy only": 177, "leg with TPU": 633, "Side wall": 59, "Door wall": 69, "Window wall": 66, "curve wall": 50, "Awning": 196, "Connector": 58, "canopy printing": 188, "zipper Trim cover printing": 14, "all wall each printing": 78, "curve wall printing": 16, "Leg printing": 156, "Leg PVC bottom printing": 29, "awning banner printing": 36, "awning cloth printing": 55, "awning leg printing": 29, "awning leg PVC bottom printing": 20, "connector printing": 25, "transport bag": 60, "sand bag": 0, "LED light": 65, "Electric pump": 35, "Hand pump": 10, "valves": 0, "shipping cost": 500 },
  "6m*6m": { "Canopy only": 218, "leg with TPU": 751, "Side wall": 81, "Door wall": 90, "Window wall": 89, "curve wall": 63, "Awning": 240, "Connector": 76, "canopy printing": 226, "zipper Trim cover printing": 16, "all wall each printing": 91, "curve wall printing": 23, "Leg printing": 213, "Leg PVC bottom printing": 33, "awning banner printing": 46, "awning cloth printing": 65, "awning leg printing": 40, "awning leg PVC bottom printing": 20, "connector printing": 39, "transport bag": 60, "sand bag": 0, "LED light": 65, "Electric pump": 35, "Hand pump": 10, "valves": 0, "shipping cost": 600 },
  "7m*7m": { "Canopy only": 293, "leg with TPU": 932, "Side wall": 100, "Door wall": 105, "Window wall": 108, "curve wall": 69, "Awning": 278, "Connector": 83, "canopy printing": 300, "zipper Trim cover printing": 19, "all wall each printing": 99, "curve wall printing": 26, "Leg printing": 240, "Leg PVC bottom printing": 37, "awning banner printing": 52, "awning cloth printing": 79, "awning leg printing": 43, "awning leg PVC bottom printing": 22, "connector printing": 64, "transport bag": 60, "sand bag": 0, "LED light": 65, "Electric pump": 35, "Hand pump": 10, "valves": 0, "shipping cost": 700 },
  "8m*8m": { "Canopy only": 360, "leg with TPU": 1020, "Side wall": 113, "Door wall": 123, "Window wall": 122, "curve wall": 78, "Awning": 310, "Connector": 96, "canopy printing": 420, "zipper Trim cover printing": 23, "all wall each printing": 119, "curve wall printing": 29, "Leg printing": 332, "Leg PVC bottom printing": 39, "awning banner printing": 69, "awning cloth printing": 95, "awning leg printing": 46, "awning leg PVC bottom printing": 22, "connector printing": 84, "transport bag": 60, "sand bag": 0, "LED light": 65, "Electric pump": 35, "Hand pump": 10, "valves": 0, "shipping cost": 800 },
};

// Prix de vente = base × 3
const SALE_PRICES: Record<string, Record<string, number>> = {};
for (const size in ORIGINAL_BASE_PRICES) {
  SALE_PRICES[size] = {};
  for (const item in ORIGINAL_BASE_PRICES[size]) {
    SALE_PRICES[size][item] = ORIGINAL_BASE_PRICES[size][item] * 3;
  }
}

const SIZE_MAP: Record<Size, string> = {
  "3x3": "3m*3m", "4x4": "4m*4m", "5x5": "5m*5m", "6x6": "6m*6m", "7x7": "7m*7m", "8x8": "8m*8m",
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$", EUR: "€", GBP: "£", AUD: "A$", CAD: "C$",
};

const SIDES = ["front", "right", "back", "left"] as const;
const SIDE_LABELS = { front: "Avant", right: "Droit", back: "Arrière", left: "Gauche" };

const MAX_ELEMENTS = 4;

export default function CalculateurTenteX() {
  // State
  const [size, setSize] = useState<Size>("4x4");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [rates, setRates] = useState<Record<Currency, number>>({ USD: 1.00, EUR: 0.92, GBP: 0.79, AUD: 1.52, CAD: 1.35 });
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesDate, setRatesDate] = useState<string | null>(null);

  // Sides configuration
  const [sides, setSides] = useState<Record<string, SideType>>({
    front: "none", right: "none", back: "none", left: "none",
  });
  const [sidePrint, setSidePrint] = useState<Record<string, boolean>>({
    front: false, right: false, back: false, left: false,
  });

  // Print options
  const [printStructure, setPrintStructure] = useState(false);
  const [printZipperCover, setPrintZipperCover] = useState(false);
  const [printLegs, setPrintLegs] = useState(false);
  const [printPVCBase, setPrintPVCBase] = useState(false);
  const [printAwningBanner, setPrintAwningBanner] = useState(false);
  const [printAwningFabric, setPrintAwningFabric] = useState(false);
  const [printAwningLegs, setPrintAwningLegs] = useState(false);
  const [printAwningPVCBase, setPrintAwningPVCBase] = useState(false);
  const [printConnector, setPrintConnector] = useState(false);

  // Accessories
  const [transportBag, setTransportBag] = useState(false);
  const [sandBags, setSandBags] = useState(0);
  const [ledLight, setLedLight] = useState(false);
  const [electricPump, setElectricPump] = useState(false);
  const [manualPump, setManualPump] = useState(false);
  const [valves, setValves] = useState(0);

  // Result
  const [result, setResult] = useState<{ total: number; breakdown: BreakdownItem[]; shipping: number } | null>(null);

  // Derived values
  const hasAwning = Object.values(sides).some(s => s === "awning");
  const hasConnection = Object.values(sides).some(s => s === "connection");
  const hasDoorOrAwning = Object.values(sides).some(s => s === "door" || s === "awning");
  const maxDoors = (size === "3x3" || size === "4x4") ? 1 : 2;
  const doorCount = Object.values(sides).filter(s => s === "door").length;

  const elementCount = useMemo(() => {
    return Object.values(sides).filter(s => s !== "none" && s !== "connection").length;
  }, [sides]);

  // Update exchange rates
  const updateRates = useCallback(async () => {
    setRatesLoading(true);
    const urls = [
      "https://open.er-api.com/v6/latest/USD",
      "https://api.exchangerate-api.com/v4/latest/USD",
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        if (data?.rates) {
          setRates({
            USD: 1,
            EUR: data.rates.EUR || 0.92,
            GBP: data.rates.GBP || 0.79,
            AUD: data.rates.AUD || 1.52,
            CAD: data.rates.CAD || 1.35,
          });
          setRatesDate(new Date().toLocaleString("fr-FR"));
          setRatesLoading(false);
          return;
        }
      } catch { /* try next */ }
    }
    setRatesLoading(false);
  }, []);

  // Handle side change
  const handleSideChange = (side: string, value: SideType) => {
    setSides(prev => ({ ...prev, [side]: value }));
    if (value === "none" || value === "awning" || value === "connection") {
      setSidePrint(prev => ({ ...prev, [side]: false }));
    }
  };

  // Calculate
  const calculate = useCallback(() => {
    const sizeKey = SIZE_MAP[size];
    const sizeData = SALE_PRICES[sizeKey];
    if (!sizeData) return;

    const rate = rates[currency] || 1;
    const breakdown: BreakdownItem[] = [];
    let totalUSD = 0;

    // Base: structure + pieds (obligatoire)
    totalUSD += sizeData["Canopy only"] || 0;
    breakdown.push({ name: "Structure principale", price: (sizeData["Canopy only"] || 0) / rate });
    totalUSD += sizeData["leg with TPU"] || 0;
    breakdown.push({ name: "Pied avec TPU", price: (sizeData["leg with TPU"] || 0) / rate });

    // Sides
    SIDES.forEach((side) => {
      const type = sides[side];
      if (type === "none") return;
      const sideName = SIDE_LABELS[side];
      let priceKey = "";
      let elementName = "";
      let printKey = "";

      switch (type) {
        case "wall": priceKey = "Side wall"; elementName = "Mur latéral"; printKey = "all wall each printing"; break;
        case "door": priceKey = "Door wall"; elementName = "Mur de porte"; printKey = "all wall each printing"; break;
        case "window": priceKey = "Window wall"; elementName = "Mur de fenêtre"; printKey = "all wall each printing"; break;
        case "curved": priceKey = "curve wall"; elementName = "Mur courbe"; printKey = "curve wall printing"; break;
        case "awning": priceKey = "Awning"; elementName = "Auvent"; break;
        case "connection": priceKey = "Connector"; elementName = "Tissu de connexion"; break;
      }

      const price = sizeData[priceKey] || 0;
      totalUSD += price;
      breakdown.push({ name: `${elementName} (${sideName})`, price: price / rate });

      // Side print
      if (sidePrint[side] && printKey && sizeData[printKey]) {
        totalUSD += sizeData[printKey];
        breakdown.push({ name: `Impression ${elementName} (${sideName})`, price: sizeData[printKey] / rate });
      }
    });

    // General prints
    const printChecks = [
      { checked: printStructure, key: "canopy printing", name: "Impression structure" },
      { checked: printZipperCover, key: "zipper Trim cover printing", name: "Impression cache fermeture éclair" },
      { checked: printLegs, key: "Leg printing", name: "Impression pieds" },
      { checked: printPVCBase, key: "Leg PVC bottom printing", name: "Impression bas PVC pieds" },
      { checked: printAwningBanner && hasAwning, key: "awning banner printing", name: "Impression bannière auvent" },
      { checked: printAwningFabric && hasAwning, key: "awning cloth printing", name: "Impression tissu auvent" },
      { checked: printAwningLegs && hasAwning, key: "awning leg printing", name: "Impression pieds auvent" },
      { checked: printAwningPVCBase && hasAwning, key: "awning leg PVC bottom printing", name: "Impression bas PVC pieds auvent" },
      { checked: printConnector && hasConnection, key: "connector printing", name: "Impression connecteur" },
    ];

    printChecks.forEach(pc => {
      if (pc.checked && sizeData[pc.key]) {
        totalUSD += sizeData[pc.key];
        breakdown.push({ name: pc.name, price: sizeData[pc.key] / rate });
      }
    });

    // Accessories
    if (transportBag && sizeData["transport bag"]) {
      totalUSD += sizeData["transport bag"];
      breakdown.push({ name: "Sac de transport", price: sizeData["transport bag"] / rate });
    }
    if (sandBags > 0 && sizeData["sand bag"]) {
      const p = sizeData["sand bag"] * sandBags;
      totalUSD += p;
      breakdown.push({ name: `${sandBags} sac(s) de sable`, price: p / rate });
    }
    if (ledLight && sizeData["LED light"]) {
      totalUSD += sizeData["LED light"];
      breakdown.push({ name: "Lumière LED", price: sizeData["LED light"] / rate });
    }
    if (electricPump && sizeData["Electric pump"]) {
      totalUSD += sizeData["Electric pump"];
      breakdown.push({ name: "Pompe électrique", price: sizeData["Electric pump"] / rate });
    }
    if (manualPump && sizeData["Hand pump"]) {
      totalUSD += sizeData["Hand pump"];
      breakdown.push({ name: "Pompe manuelle", price: sizeData["Hand pump"] / rate });
    }
    if (valves > 0 && sizeData["valves"]) {
      const p = sizeData["valves"] * valves;
      totalUSD += p;
      breakdown.push({ name: `${valves} valve(s)`, price: p / rate });
    }

    const shipping = (sizeData["shipping cost"] || 0) / rate;
    const total = totalUSD / rate + shipping;

    setResult({ total, breakdown, shipping });
  }, [size, currency, rates, sides, sidePrint, printStructure, printZipperCover, printLegs, printPVCBase, printAwningBanner, printAwningFabric, printAwningLegs, printAwningPVCBase, printConnector, transportBag, sandBags, ledLight, electricPump, manualPump, valves, hasAwning, hasConnection]);

  const isOptionDisabled = (side: string, option: SideType): boolean => {
    const current = sides[side];
    const opt = option as string;
    if (opt === "none") return false;
    if (opt === "connection") {
      return hasDoorOrAwning;
    }
    if (opt === "door" || opt === "awning") {
      if (hasConnection) return true;
    }
    if (opt === "door" && doorCount >= maxDoors && current !== "door") return true;
    if (opt !== "connection" && elementCount >= MAX_ELEMENTS && current === "none") return true;
    return false;
  };

  const canPrint = (side: string): boolean => {
    const type = sides[side];
    return type !== "none" && type !== "awning" && type !== "connection";
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
              <option value="AUD">A$ - AUD</option>
              <option value="CAD">C$ - CAD</option>
            </select>
          </div>
          <button onClick={updateRates} disabled={ratesLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50">
            {ratesLoading ? "Chargement..." : "Actualiser les taux"}
          </button>
          {ratesDate && <span className="text-xs text-muted-foreground">Dernière MAJ : {ratesDate}</span>}
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2 text-xs">
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
          {(["3x3", "4x4", "5x5", "6x6", "7x7", "8x8"] as Size[]).map(s => (
            <option key={s} value={s}>{s.replace("x", "m × ")}m</option>
          ))}
        </select>
      </div>

      {/* Configuration des côtés */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Configuration des côtés</h3>
        <div className="text-sm text-muted-foreground mb-3">
          Éléments utilisés : <span className={elementCount >= MAX_ELEMENTS ? "text-red-400 font-bold" : ""}>{elementCount}/{MAX_ELEMENTS}</span> (hors tissus de connexion)
          {doorCount > maxDoors && <span className="text-red-400 ml-2">Max {maxDoors} porte(s) pour cette taille</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SIDES.map(side => (
            <div key={side} className="border border-border rounded-lg p-3">
              <div className="font-medium text-sm mb-2">Côté {SIDE_LABELS[side]}</div>
              <select
                value={sides[side]}
                onChange={e => handleSideChange(side, e.target.value as SideType)}
                className="bg-background border border-border rounded px-3 py-2 text-sm w-full"
              >
                <option value="none">Aucun</option>
                {side !== "front" && <option value="wall" disabled={isOptionDisabled(side, "wall")}>Mur latéral</option>}
                <option value="door" disabled={isOptionDisabled(side, "door")}>Mur de porte</option>
                {side !== "front" && <option value="window" disabled={isOptionDisabled(side, "window")}>Mur de fenêtre</option>}
                <option value="curved" disabled={isOptionDisabled(side, "curved")}>Mur courbe</option>
                <option value="awning" disabled={isOptionDisabled(side, "awning")}>Auvent</option>
                {side !== "front" && <option value="connection" disabled={isOptionDisabled(side, "connection")}>Tissu de connexion</option>}
              </select>
              {canPrint(side) && (
                <label className="flex items-center gap-2 mt-2 text-sm">
                  <input type="checkbox" checked={sidePrint[side]} onChange={e => setSidePrint(prev => ({ ...prev, [side]: e.target.checked }))} className="rounded" />
                  Impression sur cet élément
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Options d'impression */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Options d'impression générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printStructure} onChange={e => setPrintStructure(e.target.checked)} className="rounded" /> Impression sur la structure</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printZipperCover} onChange={e => setPrintZipperCover(e.target.checked)} className="rounded" /> Impression cache fermeture éclair</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printLegs} onChange={e => setPrintLegs(e.target.checked)} className="rounded" /> Impression sur les pieds</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printPVCBase} onChange={e => setPrintPVCBase(e.target.checked)} className="rounded" /> Impression bas PVC pieds</label>
        </div>
        {hasAwning && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">Options auvent</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printAwningBanner} onChange={e => setPrintAwningBanner(e.target.checked)} className="rounded" /> Bannière auvent</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printAwningFabric} onChange={e => setPrintAwningFabric(e.target.checked)} className="rounded" /> Tissu auvent</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printAwningLegs} onChange={e => setPrintAwningLegs(e.target.checked)} className="rounded" /> Pieds auvent</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={printAwningPVCBase} onChange={e => setPrintAwningPVCBase(e.target.checked)} className="rounded" /> Bas PVC pieds auvent</label>
            </div>
          </div>
        )}
        {hasConnection && (
          <label className="flex items-center gap-2 text-sm mt-3"><input type="checkbox" checked={printConnector} onChange={e => setPrintConnector(e.target.checked)} className="rounded" /> Impression sur le connecteur</label>
        )}
      </div>

      {/* Accessoires */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Accessoires</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={transportBag} onChange={e => setTransportBag(e.target.checked)} className="rounded" /> Sac de transport</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={ledLight} onChange={e => setLedLight(e.target.checked)} className="rounded" /> Lumière LED</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={electricPump} onChange={e => setElectricPump(e.target.checked)} className="rounded" /> Pompe électrique</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={manualPump} onChange={e => setManualPump(e.target.checked)} className="rounded" /> Pompe manuelle</label>
          <div className="flex items-center gap-2 text-sm">
            <label>Sacs de sable :</label>
            <input type="number" min="0" max="99" value={sandBags} onChange={e => setSandBags(parseInt(e.target.value) || 0)} className="bg-background border border-border rounded px-2 py-1 w-16 text-sm" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <label>Valves supp. :</label>
            <input type="number" min="0" max="99" value={valves} onChange={e => setValves(parseInt(e.target.value) || 0)} className="bg-background border border-border rounded px-2 py-1 w-16 text-sm" />
          </div>
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
            Prix de vente HT : {result.total.toFixed(2)} {CURRENCY_SYMBOLS[currency]}
          </div>
          <h4 className="font-medium mb-2">Détail :</h4>
          <div className="space-y-1">
            {result.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span className="font-mono">{item.price.toFixed(2)} {CURRENCY_SYMBOLS[currency]}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm border-t border-border pt-1 mt-2">
              <span>Transport</span>
              <span className="font-mono">{result.shipping.toFixed(2)} {CURRENCY_SYMBOLS[currency]}</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Taux utilisé : 1 USD = {rates[currency].toFixed(4)} {currency} | Calculé le {new Date().toLocaleString("fr-FR")}
          </div>
        </div>
      )}
    </div>
  );
}
