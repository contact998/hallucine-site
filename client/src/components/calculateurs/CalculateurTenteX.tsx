/**
 * Calculateur de prix HT des Tentes en X
 * Style Excel : fond blanc, tableaux avec bordures, simple et lisible
 */
import { useState, useCallback, useMemo } from "react";

type Size = "3x3" | "4x4" | "5x5" | "6x6" | "7x7" | "8x8";
type SideType = "none" | "wall" | "door" | "window" | "curved" | "awning" | "connection";
type Currency = "USD" | "EUR" | "GBP" | "AUD" | "CAD";

interface BreakdownItem { name: string; price: number; }

// Prix de base USD (avant ×3)
const BASE_PRICES: Record<string, Record<string, number>> = {
  "3m*3m": { "Canopy only": 111, "leg with TPU": 358, "Side wall": 37, "Door wall": 45, "Window wall": 43, "curve wall": 32, "Awning": 144, "Connector": 47, "canopy printing": 94, "zipper Trim cover printing": 10, "all wall each printing": 47, "curve wall printing": 13, "Leg printing": 64, "Leg PVC bottom printing": 23, "awning banner printing": 24, "awning cloth printing": 39, "awning leg printing": 11, "awning leg PVC bottom printing": 11, "connector printing": 17, "transport bag": 60, "sand bag": 0, "LED light": 65, "Electric pump": 35, "Hand pump": 10, "valves": 0, "shipping cost": 300 },
  "4m*4m": { "Canopy only": 147, "leg with TPU": 466, "Side wall": 46, "Door wall": 57, "Window wall": 53, "curve wall": 39, "Awning": 171, "Connector": 51, "canopy printing": 160, "zipper Trim cover printing": 13, "all wall each printing": 58, "curve wall printing": 14, "Leg printing": 133, "Leg PVC bottom printing": 28, "awning banner printing": 33, "awning cloth printing": 44, "awning leg printing": 13, "awning leg PVC bottom printing": 11, "connector printing": 20, "transport bag": 60, "sand bag": 0, "LED light": 65, "Electric pump": 35, "Hand pump": 10, "valves": 0, "shipping cost": 400 },
  "5m*5m": { "Canopy only": 177, "leg with TPU": 633, "Side wall": 59, "Door wall": 69, "Window wall": 66, "curve wall": 50, "Awning": 196, "Connector": 58, "canopy printing": 188, "zipper Trim cover printing": 14, "all wall each printing": 78, "curve wall printing": 16, "Leg printing": 156, "Leg PVC bottom printing": 29, "awning banner printing": 36, "awning cloth printing": 55, "awning leg printing": 29, "awning leg PVC bottom printing": 20, "connector printing": 25, "transport bag": 60, "sand bag": 0, "LED light": 65, "Electric pump": 35, "Hand pump": 10, "valves": 0, "shipping cost": 500 },
  "6m*6m": { "Canopy only": 218, "leg with TPU": 751, "Side wall": 81, "Door wall": 90, "Window wall": 89, "curve wall": 63, "Awning": 240, "Connector": 76, "canopy printing": 226, "zipper Trim cover printing": 16, "all wall each printing": 91, "curve wall printing": 23, "Leg printing": 213, "Leg PVC bottom printing": 33, "awning banner printing": 46, "awning cloth printing": 65, "awning leg printing": 40, "awning leg PVC bottom printing": 20, "connector printing": 39, "transport bag": 60, "sand bag": 0, "LED light": 65, "Electric pump": 35, "Hand pump": 10, "valves": 0, "shipping cost": 600 },
  "7m*7m": { "Canopy only": 293, "leg with TPU": 932, "Side wall": 100, "Door wall": 105, "Window wall": 108, "curve wall": 69, "Awning": 278, "Connector": 83, "canopy printing": 300, "zipper Trim cover printing": 19, "all wall each printing": 99, "curve wall printing": 26, "Leg printing": 240, "Leg PVC bottom printing": 37, "awning banner printing": 52, "awning cloth printing": 79, "awning leg printing": 43, "awning leg PVC bottom printing": 22, "connector printing": 64, "transport bag": 60, "sand bag": 0, "LED light": 65, "Electric pump": 35, "Hand pump": 10, "valves": 0, "shipping cost": 700 },
  "8m*8m": { "Canopy only": 360, "leg with TPU": 1020, "Side wall": 113, "Door wall": 123, "Window wall": 122, "curve wall": 78, "Awning": 310, "Connector": 96, "canopy printing": 420, "zipper Trim cover printing": 23, "all wall each printing": 119, "curve wall printing": 29, "Leg printing": 332, "Leg PVC bottom printing": 39, "awning banner printing": 69, "awning cloth printing": 95, "awning leg printing": 46, "awning leg PVC bottom printing": 22, "connector printing": 84, "transport bag": 60, "sand bag": 0, "LED light": 65, "Electric pump": 35, "Hand pump": 10, "valves": 0, "shipping cost": 800 },
};

// Prix de vente = base × 3
const SALE_PRICES: Record<string, Record<string, number>> = {};
for (const size in BASE_PRICES) {
  SALE_PRICES[size] = {};
  for (const item in BASE_PRICES[size]) {
    SALE_PRICES[size][item] = BASE_PRICES[size][item] * 3;
  }
}

const SIZE_MAP: Record<Size, string> = {
  "3x3": "3m*3m", "4x4": "4m*4m", "5x5": "5m*5m", "6x6": "6m*6m", "7x7": "7m*7m", "8x8": "8m*8m",
};

const CURRENCY_SYMBOLS: Record<Currency, string> = { USD: "$", EUR: "€", GBP: "£", AUD: "A$", CAD: "C$" };
const SIDES = ["front", "right", "back", "left"] as const;
const SIDE_LABELS = { front: "Avant", right: "Droit", back: "Arrière", left: "Gauche" };
const MAX_ELEMENTS = 4;

// Styles réutilisables
const cellStyle = "border border-gray-300 px-3 py-2 text-sm";
const headerStyle = "border border-gray-300 px-3 py-2 text-sm font-semibold bg-gray-100 text-gray-800";
const selectStyle = "border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900 w-full";
const checkboxLabel = "flex items-center gap-2 text-sm text-gray-700";
const sectionTitle = "text-base font-bold text-gray-800 mb-2 bg-blue-50 border border-blue-200 px-3 py-2";

export default function CalculateurTenteX() {
  const [activeSubTab, setActiveSubTab] = useState<"calc" | "prices">("calc");
  const [size, setSize] = useState<Size>("4x4");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [rates, setRates] = useState<Record<Currency, number>>({ USD: 1, EUR: 0.92, GBP: 0.79, AUD: 1.52, CAD: 1.35 });
  const [ratesLoading, setRatesLoading] = useState(false);

  const [sides, setSides] = useState<Record<string, SideType>>({ front: "none", right: "none", back: "none", left: "none" });
  const [sidePrint, setSidePrint] = useState<Record<string, boolean>>({ front: false, right: false, back: false, left: false });

  const [printStructure, setPrintStructure] = useState(false);
  const [printZipperCover, setPrintZipperCover] = useState(false);
  const [printLegs, setPrintLegs] = useState(false);
  const [printPVCBase, setPrintPVCBase] = useState(false);
  const [printAwningBanner, setPrintAwningBanner] = useState(false);
  const [printAwningFabric, setPrintAwningFabric] = useState(false);
  const [printAwningLegs, setPrintAwningLegs] = useState(false);
  const [printAwningPVCBase, setPrintAwningPVCBase] = useState(false);
  const [printConnector, setPrintConnector] = useState(false);

  const [transportBag, setTransportBag] = useState(false);
  const [sandBags, setSandBags] = useState(0);
  const [ledLight, setLedLight] = useState(false);
  const [electricPump, setElectricPump] = useState(false);
  const [manualPump, setManualPump] = useState(false);
  const [valves, setValves] = useState(0);

  const [result, setResult] = useState<{ total: number; breakdown: BreakdownItem[]; shipping: number } | null>(null);

  const hasAwning = Object.values(sides).some(s => s === "awning");
  const hasConnection = Object.values(sides).some(s => s === "connection");
  const hasDoorOrAwning = Object.values(sides).some(s => s === "door" || s === "awning");
  const maxDoors = (size === "3x3" || size === "4x4") ? 1 : 2;
  const doorCount = Object.values(sides).filter(s => s === "door").length;
  const elementCount = useMemo(() => Object.values(sides).filter(s => s !== "none" && s !== "connection").length, [sides]);

  const updateRates = useCallback(async () => {
    setRatesLoading(true);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      if (res.ok) {
        const data = await res.json();
        if (data?.rates) {
          setRates({ USD: 1, EUR: data.rates.EUR || 0.92, GBP: data.rates.GBP || 0.79, AUD: data.rates.AUD || 1.52, CAD: data.rates.CAD || 1.35 });
        }
      }
    } catch { /* fallback */ }
    setRatesLoading(false);
  }, []);

  const handleSideChange = (side: string, value: SideType) => {
    setSides(prev => ({ ...prev, [side]: value }));
    if (value === "none" || value === "awning" || value === "connection") {
      setSidePrint(prev => ({ ...prev, [side]: false }));
    }
  };

  const isOptionDisabled = (side: string, option: SideType): boolean => {
    const current = sides[side];
    const opt = option as string;
    if (opt === "none") return false;
    if (opt === "connection") return hasDoorOrAwning;
    if ((opt === "door" || opt === "awning") && hasConnection) return true;
    if (opt === "door" && doorCount >= maxDoors && current !== "door") return true;
    if (opt !== "connection" && elementCount >= MAX_ELEMENTS && current === "none") return true;
    return false;
  };

  const canPrint = (side: string): boolean => {
    const type = sides[side];
    return type !== "none" && type !== "awning" && type !== "connection";
  };

  const calculate = useCallback(() => {
    const sizeKey = SIZE_MAP[size];
    const sizeData = SALE_PRICES[sizeKey];
    if (!sizeData) return;
    const rate = rates[currency] || 1;
    const breakdown: BreakdownItem[] = [];
    let totalUSD = 0;

    totalUSD += sizeData["Canopy only"] || 0;
    breakdown.push({ name: "Structure principale", price: (sizeData["Canopy only"] || 0) / rate });
    totalUSD += sizeData["leg with TPU"] || 0;
    breakdown.push({ name: "Pied avec TPU", price: (sizeData["leg with TPU"] || 0) / rate });

    SIDES.forEach((side) => {
      const type = sides[side];
      if (type === "none") return;
      const sideName = SIDE_LABELS[side];
      let priceKey = "", elementName = "", printKey = "";
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
      if (sidePrint[side] && printKey && sizeData[printKey]) {
        totalUSD += sizeData[printKey];
        breakdown.push({ name: `Impression ${elementName} (${sideName})`, price: sizeData[printKey] / rate });
      }
    });

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

    if (transportBag && sizeData["transport bag"]) { totalUSD += sizeData["transport bag"]; breakdown.push({ name: "Sac de transport", price: sizeData["transport bag"] / rate }); }
    if (sandBags > 0 && sizeData["sand bag"]) { const p = sizeData["sand bag"] * sandBags; totalUSD += p; breakdown.push({ name: `${sandBags} sac(s) de sable`, price: p / rate }); }
    if (ledLight && sizeData["LED light"]) { totalUSD += sizeData["LED light"]; breakdown.push({ name: "Lumière LED", price: sizeData["LED light"] / rate }); }
    if (electricPump && sizeData["Electric pump"]) { totalUSD += sizeData["Electric pump"]; breakdown.push({ name: "Pompe électrique", price: sizeData["Electric pump"] / rate }); }
    if (manualPump && sizeData["Hand pump"]) { totalUSD += sizeData["Hand pump"]; breakdown.push({ name: "Pompe manuelle", price: sizeData["Hand pump"] / rate }); }
    if (valves > 0 && sizeData["valves"]) { const p = sizeData["valves"] * valves; totalUSD += p; breakdown.push({ name: `${valves} valve(s)`, price: p / rate }); }

    const shipping = (sizeData["shipping cost"] || 0) / rate;
    const total = totalUSD / rate + shipping;
    setResult({ total, breakdown, shipping });
  }, [size, currency, rates, sides, sidePrint, printStructure, printZipperCover, printLegs, printPVCBase, printAwningBanner, printAwningFabric, printAwningLegs, printAwningPVCBase, printConnector, transportBag, sandBags, ledLight, electricPump, manualPump, valves, hasAwning, hasConnection]);

  // Noms lisibles pour le tableau des prix
  const priceLabels: Record<string, string> = {
    "Canopy only": "Structure seule", "leg with TPU": "Pied avec TPU", "Side wall": "Mur latéral",
    "Door wall": "Mur de porte", "Window wall": "Mur de fenêtre", "curve wall": "Mur courbe",
    "Awning": "Auvent", "Connector": "Connecteur", "canopy printing": "Impression structure",
    "zipper Trim cover printing": "Impression cache zip", "all wall each printing": "Impression mur (chaque)",
    "curve wall printing": "Impression mur courbe", "Leg printing": "Impression pieds",
    "Leg PVC bottom printing": "Impression bas PVC", "awning banner printing": "Impression bannière auvent",
    "awning cloth printing": "Impression tissu auvent", "awning leg printing": "Impression pieds auvent",
    "awning leg PVC bottom printing": "Impression bas PVC auvent", "connector printing": "Impression connecteur",
    "transport bag": "Sac de transport", "sand bag": "Sac de sable", "LED light": "Lumière LED",
    "Electric pump": "Pompe électrique", "Hand pump": "Pompe manuelle", "valves": "Valve",
    "shipping cost": "Transport",
  };

  return (
    <div>
      {/* Sous-onglets : Calculateur / Prix de base */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setActiveSubTab("calc")}
          className={`px-4 py-1.5 text-sm font-medium border rounded-t ${activeSubTab === "calc" ? "bg-white border-gray-300 border-b-white text-gray-900" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}
        >
          Calculateur
        </button>
        <button
          onClick={() => setActiveSubTab("prices")}
          className={`px-4 py-1.5 text-sm font-medium border rounded-t ${activeSubTab === "prices" ? "bg-white border-gray-300 border-b-white text-gray-900" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}
        >
          Prix de base (USD)
        </button>
      </div>

      {activeSubTab === "prices" ? (
        /* ===== ONGLET PRIX DE BASE ===== */
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={headerStyle}>Élément</th>
                {Object.keys(BASE_PRICES).map(s => (
                  <th key={s} className={headerStyle + " text-center"}>{s.replace("m*", "×").replace("m", "")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(BASE_PRICES["3m*3m"]).map(key => (
                <tr key={key} className="hover:bg-blue-50">
                  <td className={cellStyle + " font-medium bg-gray-50"}>{priceLabels[key] || key}</td>
                  {Object.keys(BASE_PRICES).map(s => (
                    <td key={s} className={cellStyle + " text-right font-mono"}>
                      {BASE_PRICES[s][key] !== undefined ? `${BASE_PRICES[s][key]} $` : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">Prix de base en USD. Le prix de vente est calculé en multipliant par 3.</p>
        </div>
      ) : (
        /* ===== ONGLET CALCULATEUR ===== */
        <div className="space-y-4">
          {/* Devise et taille */}
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className={headerStyle + " w-40"}>Taille</td>
                <td className={cellStyle}>
                  <select value={size} onChange={e => setSize(e.target.value as Size)} className={selectStyle + " max-w-xs"}>
                    {(["3x3", "4x4", "5x5", "6x6", "7x7", "8x8"] as Size[]).map(s => (
                      <option key={s} value={s}>{s.replace("x", "m × ")}m</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className={headerStyle}>Devise</td>
                <td className={cellStyle}>
                  <div className="flex items-center gap-3">
                    <select value={currency} onChange={e => setCurrency(e.target.value as Currency)} className={selectStyle + " max-w-[150px]"}>
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                      <option value="GBP">£ GBP</option>
                      <option value="AUD">A$ AUD</option>
                      <option value="CAD">C$ CAD</option>
                    </select>
                    <button onClick={updateRates} disabled={ratesLoading} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50">
                      {ratesLoading ? "..." : "Actualiser taux"}
                    </button>
                    <span className="text-xs text-gray-500">
                      1 USD = {rates.EUR.toFixed(4)} EUR | {rates.GBP.toFixed(4)} GBP
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Configuration des côtés */}
          <div className={sectionTitle}>Configuration des côtés — {elementCount}/{MAX_ELEMENTS} éléments</div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={headerStyle}>Côté</th>
                <th className={headerStyle}>Type</th>
                <th className={headerStyle}>Impression</th>
              </tr>
            </thead>
            <tbody>
              {SIDES.map(side => (
                <tr key={side} className="hover:bg-blue-50">
                  <td className={cellStyle + " font-medium bg-gray-50 w-28"}>{SIDE_LABELS[side]}</td>
                  <td className={cellStyle}>
                    <select value={sides[side]} onChange={e => handleSideChange(side, e.target.value as SideType)} className={selectStyle}>
                      <option value="none">— Aucun —</option>
                      {side !== "front" && <option value="wall" disabled={isOptionDisabled(side, "wall")}>Mur latéral</option>}
                      <option value="door" disabled={isOptionDisabled(side, "door")}>Mur de porte</option>
                      {side !== "front" && <option value="window" disabled={isOptionDisabled(side, "window")}>Mur de fenêtre</option>}
                      <option value="curved" disabled={isOptionDisabled(side, "curved")}>Mur courbe</option>
                      <option value="awning" disabled={isOptionDisabled(side, "awning")}>Auvent</option>
                      {side !== "front" && <option value="connection" disabled={isOptionDisabled(side, "connection")}>Tissu de connexion</option>}
                    </select>
                  </td>
                  <td className={cellStyle + " text-center w-28"}>
                    {canPrint(side) ? (
                      <input type="checkbox" checked={sidePrint[side]} onChange={e => setSidePrint(prev => ({ ...prev, [side]: e.target.checked }))} />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {doorCount > maxDoors && <p className="text-red-600 text-xs">Maximum {maxDoors} porte(s) pour la taille {size}</p>}

          {/* Impressions générales */}
          <div className={sectionTitle}>Options d'impression</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="hover:bg-blue-50">
                <td className={cellStyle}><label className={checkboxLabel}><input type="checkbox" checked={printStructure} onChange={e => setPrintStructure(e.target.checked)} /> Impression sur la structure</label></td>
                <td className={cellStyle}><label className={checkboxLabel}><input type="checkbox" checked={printZipperCover} onChange={e => setPrintZipperCover(e.target.checked)} /> Impression cache fermeture éclair</label></td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className={cellStyle}><label className={checkboxLabel}><input type="checkbox" checked={printLegs} onChange={e => setPrintLegs(e.target.checked)} /> Impression sur les pieds</label></td>
                <td className={cellStyle}><label className={checkboxLabel}><input type="checkbox" checked={printPVCBase} onChange={e => setPrintPVCBase(e.target.checked)} /> Impression bas PVC pieds</label></td>
              </tr>
              {hasAwning && (
                <>
                  <tr className="hover:bg-blue-50">
                    <td className={cellStyle}><label className={checkboxLabel}><input type="checkbox" checked={printAwningBanner} onChange={e => setPrintAwningBanner(e.target.checked)} /> Bannière auvent</label></td>
                    <td className={cellStyle}><label className={checkboxLabel}><input type="checkbox" checked={printAwningFabric} onChange={e => setPrintAwningFabric(e.target.checked)} /> Tissu auvent</label></td>
                  </tr>
                  <tr className="hover:bg-blue-50">
                    <td className={cellStyle}><label className={checkboxLabel}><input type="checkbox" checked={printAwningLegs} onChange={e => setPrintAwningLegs(e.target.checked)} /> Pieds auvent</label></td>
                    <td className={cellStyle}><label className={checkboxLabel}><input type="checkbox" checked={printAwningPVCBase} onChange={e => setPrintAwningPVCBase(e.target.checked)} /> Bas PVC pieds auvent</label></td>
                  </tr>
                </>
              )}
              {hasConnection && (
                <tr className="hover:bg-blue-50">
                  <td className={cellStyle} colSpan={2}><label className={checkboxLabel}><input type="checkbox" checked={printConnector} onChange={e => setPrintConnector(e.target.checked)} /> Impression sur le connecteur</label></td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Accessoires */}
          <div className={sectionTitle}>Accessoires</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="hover:bg-blue-50">
                <td className={cellStyle}><label className={checkboxLabel}><input type="checkbox" checked={transportBag} onChange={e => setTransportBag(e.target.checked)} /> Sac de transport</label></td>
                <td className={cellStyle}><label className={checkboxLabel}><input type="checkbox" checked={ledLight} onChange={e => setLedLight(e.target.checked)} /> Lumière LED</label></td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className={cellStyle}><label className={checkboxLabel}><input type="checkbox" checked={electricPump} onChange={e => setElectricPump(e.target.checked)} /> Pompe électrique</label></td>
                <td className={cellStyle}><label className={checkboxLabel}><input type="checkbox" checked={manualPump} onChange={e => setManualPump(e.target.checked)} /> Pompe manuelle</label></td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className={cellStyle}>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    Sacs de sable :
                    <input type="number" min="0" max="99" value={sandBags} onChange={e => setSandBags(parseInt(e.target.value) || 0)} className="border border-gray-300 rounded px-2 py-1 w-16 text-sm bg-white" />
                  </div>
                </td>
                <td className={cellStyle}>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    Valves supp. :
                    <input type="number" min="0" max="99" value={valves} onChange={e => setValves(parseInt(e.target.value) || 0)} className="border border-gray-300 rounded px-2 py-1 w-16 text-sm bg-white" />
                  </div>
                </td>
              </tr>
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
                Prix de vente HT : {result.total.toFixed(2)} {CURRENCY_SYMBOLS[currency]}
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
                      <td className="border border-gray-300 px-3 py-1 text-sm">{item.name}</td>
                      <td className="border border-gray-300 px-3 py-1 text-sm text-right font-mono">{item.price.toFixed(2)} {CURRENCY_SYMBOLS[currency]}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-3 py-1 text-sm font-medium">Transport</td>
                    <td className="border border-gray-300 px-3 py-1 text-sm text-right font-mono">{result.shipping.toFixed(2)} {CURRENCY_SYMBOLS[currency]}</td>
                  </tr>
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
