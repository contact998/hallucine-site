/**
 * Calculateur de prix HT des Tentes Araignée
 * Style Excel : fond blanc, tableaux avec bordures
 */
import { useState, useCallback } from "react";

type Size = "4x4" | "6x6" | "8x8" | "10x10";
type Currency = "USD" | "EUR" | "GBP" | "CHF";
type SideOption = "none" | "wall" | "awning";

interface BreakdownItem { name: string; price: number; }

const SIDE_LABELS: Record<string, string> = { side1: "Côté 1", side2: "Côté 2", side3: "Côté 3", side4: "Côté 4" };
const SIDES = ["side1", "side2", "side3", "side4"] as const;

const PRICES: Record<string, Record<Size, number>> = {
  "canopy": { "4x4": 222, "6x6": 369, "8x8": 555, "10x10": 750 },
  "legframe": { "4x4": 1083, "6x6": 1653, "8x8": 2397, "10x10": 3270 },
  "wall": { "4x4": 90, "6x6": 174, "8x8": 225, "10x10": 279 },
  "awning-banner": { "4x4": 90, "6x6": 174, "8x8": 225, "10x10": 279 },
  "awning-leg": { "4x4": 60, "6x6": 111, "8x8": 126, "10x10": 162 },
  "awning-pvc": { "4x4": 45, "6x6": 54, "8x8": 72, "10x10": 126 },
  "awning-fabric": { "4x4": 126, "6x6": 165, "8x8": 252, "10x10": 339 },
  "print-canopy": { "4x4": 213, "6x6": 342, "8x8": 522, "10x10": 699 },
  "print-legframe": { "4x4": 255, "6x6": 510, "8x8": 735, "10x10": 1002 },
  "print-zip": { "4x4": 39, "6x6": 45, "8x8": 54, "10x10": 72 },
  "print-wall": { "4x4": 123, "6x6": 273, "8x8": 357, "10x10": 417 },
  "print-awningbanner": { "4x4": 111, "6x6": 147, "8x8": 237, "10x10": 285 },
  "print-awningleg": { "4x4": 72, "6x6": 132, "8x8": 150, "10x10": 192 },
  "print-awningpvc": { "4x4": 54, "6x6": 66, "8x8": 87, "10x10": 153 },
  "print-awningfabric": { "4x4": 150, "6x6": 198, "8x8": 300, "10x10": 402 },
  "acc-bag": { "4x4": 180, "6x6": 180, "8x8": 180, "10x10": 180 },
  "acc-pump-elec": { "4x4": 105, "6x6": 105, "8x8": 105, "10x10": 105 },
  "acc-pump-hand": { "4x4": 45, "6x6": 45, "8x8": 45, "10x10": 45 },
  "acc-sandbag": { "4x4": 33, "6x6": 33, "8x8": 33, "10x10": 33 },
  "acc-waterbag": { "4x4": 66, "6x6": 66, "8x8": 66, "10x10": 66 },
  "acc-led": { "4x4": 195, "6x6": 195, "8x8": 195, "10x10": 195 },
  "transport": { "4x4": 400, "6x6": 500, "8x8": 700, "10x10": 1000 },
};

const CURRENCY_SYMBOLS: Record<Currency, string> = { USD: "$", EUR: "€", GBP: "£", CHF: "CHF" };
const cell = "border border-gray-300 px-3 py-2 text-sm";
const hdr = "border border-gray-300 px-3 py-2 text-sm font-semibold bg-gray-100 text-gray-800";
const sel = "border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900";
const chk = "flex items-center gap-2 text-sm text-gray-700";
const section = "text-base font-bold text-gray-800 mb-2 bg-blue-50 border border-blue-200 px-3 py-2";

export default function CalculateurTenteAraignee() {
  const [activeSubTab, setActiveSubTab] = useState<"calc" | "prices">("calc");
  const [size, setSize] = useState<Size>("6x6");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [rates, setRates] = useState<Record<Currency, number>>({ USD: 1, EUR: 0.9298, GBP: 0.7823, CHF: 0.8767 });
  const [ratesLoading, setRatesLoading] = useState(false);

  const [sides, setSides] = useState<Record<string, SideOption>>({ side1: "none", side2: "none", side3: "none", side4: "none" });
  const [sidePrint, setSidePrint] = useState<Record<string, boolean>>({ side1: false, side2: false, side3: false, side4: false });
  const [awningPrint, setAwningPrint] = useState<Record<string, { banner: boolean; leg: boolean; pvc: boolean; fabric: boolean }>>({
    side1: { banner: false, leg: false, pvc: false, fabric: false },
    side2: { banner: false, leg: false, pvc: false, fabric: false },
    side3: { banner: false, leg: false, pvc: false, fabric: false },
    side4: { banner: false, leg: false, pvc: false, fabric: false },
  });

  const [printCanopy, setPrintCanopy] = useState(false);
  const [printLegframe, setPrintLegframe] = useState(false);
  const [printZip, setPrintZip] = useState(false);

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
      }
    } catch { /* fallback */ }
    setRatesLoading(false);
  }, []);

  const getPrice = (key: string): number => PRICES[key]?.[size] || 0;

  const calculate = useCallback(() => {
    const rate = rates[currency] || 1;
    const breakdown: BreakdownItem[] = [];
    let totalUSD = 0;
    const addCost = (name: string, usd: number) => { if (usd > 0) { totalUSD += usd; breakdown.push({ name, price: usd * rate }); } };

    addCost("Toile de toit", getPrice("canopy"));
    addCost("Structure des pieds", getPrice("legframe"));

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

    if (printCanopy) addCost("Impression toile de toit", getPrice("print-canopy"));
    if (printLegframe) addCost("Impression structure pieds", getPrice("print-legframe"));
    if (printZip) addCost("Impression couvertures ZIP", getPrice("print-zip"));

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

  // Prix de base pour l'onglet prix
  const priceCategories = [
    { title: "Structure", items: [{ key: "canopy", label: "Toile de toit" }, { key: "legframe", label: "Structure pieds" }] },
    { title: "Murs & Auvents", items: [{ key: "wall", label: "Mur" }, { key: "awning-banner", label: "Auvent bannière" }, { key: "awning-leg", label: "Auvent pieds" }, { key: "awning-pvc", label: "Auvent PVC" }, { key: "awning-fabric", label: "Auvent tissu" }] },
    { title: "Impressions", items: [{ key: "print-canopy", label: "Imp. toile toit" }, { key: "print-legframe", label: "Imp. structure pieds" }, { key: "print-zip", label: "Imp. couvertures ZIP" }, { key: "print-wall", label: "Imp. mur" }, { key: "print-awningbanner", label: "Imp. bannière auvent" }, { key: "print-awningleg", label: "Imp. pieds auvent" }, { key: "print-awningpvc", label: "Imp. PVC auvent" }, { key: "print-awningfabric", label: "Imp. tissu auvent" }] },
    { title: "Accessoires", items: [{ key: "acc-bag", label: "Sac de transport" }, { key: "acc-pump-elec", label: "Pompe électrique" }, { key: "acc-pump-hand", label: "Pompe manuelle" }, { key: "acc-sandbag", label: "Sac de sable" }, { key: "acc-waterbag", label: "Sac d'eau" }, { key: "acc-led", label: "Lumière LED" }] },
    { title: "Transport", items: [{ key: "transport", label: "Transport" }] },
  ];

  const sizes: Size[] = ["4x4", "6x6", "8x8", "10x10"];

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
        <div className="overflow-x-auto space-y-4">
          {priceCategories.map(cat => (
            <div key={cat.title}>
              <div className={section}>{cat.title}</div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className={hdr}>Élément</th>
                    {sizes.map(s => <th key={s} className={hdr + " text-center"}>{s.replace("x", "m × ")}m</th>)}
                  </tr>
                </thead>
                <tbody>
                  {cat.items.map(item => (
                    <tr key={item.key} className="hover:bg-blue-50">
                      <td className={cell + " font-medium bg-gray-50"}>{item.label}</td>
                      {sizes.map(s => <td key={s} className={cell + " text-right font-mono"}>{PRICES[item.key]?.[s] || 0} $</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
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
                    <option value="6x6">6m × 6m</option>
                    <option value="8x8">8m × 8m</option>
                    <option value="10x10">10m × 10m</option>
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

          {/* Configuration des 4 côtés */}
          <div className={section}>Configuration des 4 côtés</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SIDES.map(side => (
              <table key={side} className="w-full border-collapse">
                <thead>
                  <tr><th colSpan={2} className={hdr}>{SIDE_LABELS[side]}</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={cell + " w-32"}>Type</td>
                    <td className={cell}>
                      <select value={sides[side]} onChange={e => handleSideChange(side, e.target.value as SideOption)} className={sel + " w-full"}>
                        <option value="none">Aucun</option>
                        <option value="wall">Mur</option>
                        <option value="awning">Auvent</option>
                      </select>
                    </td>
                  </tr>
                  {sides[side] === "wall" && (
                    <tr>
                      <td className={cell}>Impression</td>
                      <td className={cell}>
                        <label className={chk}>
                          <input type="checkbox" checked={sidePrint[side]} onChange={e => setSidePrint(prev => ({ ...prev, [side]: e.target.checked }))} />
                          Impression sur ce mur
                        </label>
                      </td>
                    </tr>
                  )}
                  {sides[side] === "awning" && (
                    <>
                      <tr>
                        <td className={cell}>Impressions</td>
                        <td className={cell}>
                          <div className="space-y-1">
                            <label className={chk}><input type="checkbox" checked={awningPrint[side].banner} onChange={e => setAwningPrint(prev => ({ ...prev, [side]: { ...prev[side], banner: e.target.checked } }))} /> Bannière</label>
                            <label className={chk}><input type="checkbox" checked={awningPrint[side].leg} onChange={e => setAwningPrint(prev => ({ ...prev, [side]: { ...prev[side], leg: e.target.checked } }))} /> Pieds</label>
                            <label className={chk}><input type="checkbox" checked={awningPrint[side].pvc} onChange={e => setAwningPrint(prev => ({ ...prev, [side]: { ...prev[side], pvc: e.target.checked } }))} /> PVC pieds</label>
                            <label className={chk}><input type="checkbox" checked={awningPrint[side].fabric} onChange={e => setAwningPrint(prev => ({ ...prev, [side]: { ...prev[side], fabric: e.target.checked } }))} /> Tissu auvent</label>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            ))}
          </div>

          {/* Impressions générales */}
          <div className={section}>Impressions générales</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className={cell}><label className={chk}><input type="checkbox" checked={printCanopy} onChange={e => setPrintCanopy(e.target.checked)} /> Impression toile de toit</label></td>
                <td className={cell + " text-right font-mono"}>{getPrice("print-canopy")} $</td>
              </tr>
              <tr>
                <td className={cell}><label className={chk}><input type="checkbox" checked={printLegframe} onChange={e => setPrintLegframe(e.target.checked)} /> Impression structure pieds</label></td>
                <td className={cell + " text-right font-mono"}>{getPrice("print-legframe")} $</td>
              </tr>
              <tr>
                <td className={cell}><label className={chk}><input type="checkbox" checked={printZip} onChange={e => setPrintZip(e.target.checked)} /> Impression couvertures ZIP</label></td>
                <td className={cell + " text-right font-mono"}>{getPrice("print-zip")} $</td>
              </tr>
            </tbody>
          </table>

          {/* Accessoires */}
          <div className={section}>Accessoires</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className={cell}><label className={chk}><input type="checkbox" checked={bag} onChange={e => setBag(e.target.checked)} /> Sac de transport</label></td>
                <td className={cell + " text-right font-mono w-24"}>{getPrice("acc-bag")} $</td>
              </tr>
              <tr>
                <td className={cell}><label className={chk}><input type="checkbox" checked={pumpElec} onChange={e => setPumpElec(e.target.checked)} /> Pompe électrique</label></td>
                <td className={cell + " text-right font-mono"}>{getPrice("acc-pump-elec")} $</td>
              </tr>
              <tr>
                <td className={cell}><label className={chk}><input type="checkbox" checked={pumpHand} onChange={e => setPumpHand(e.target.checked)} /> Pompe manuelle</label></td>
                <td className={cell + " text-right font-mono"}>{getPrice("acc-pump-hand")} $</td>
              </tr>
              <tr>
                <td className={cell}><label className={chk}><input type="checkbox" checked={led} onChange={e => setLed(e.target.checked)} /> Lumière LED</label></td>
                <td className={cell + " text-right font-mono"}>{getPrice("acc-led")} $</td>
              </tr>
              <tr>
                <td className={cell}>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    Sacs de sable :
                    <input type="number" min="0" max="99" value={sandbags} onChange={e => setSandbags(parseInt(e.target.value) || 0)} className={sel + " w-16"} />
                  </div>
                </td>
                <td className={cell + " text-right font-mono"}>{getPrice("acc-sandbag")} $ / unité</td>
              </tr>
              <tr>
                <td className={cell}>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    Sacs d'eau :
                    <input type="number" min="0" max="99" value={waterbags} onChange={e => setWaterbags(parseInt(e.target.value) || 0)} className={sel + " w-16"} />
                  </div>
                </td>
                <td className={cell + " text-right font-mono"}>{getPrice("acc-waterbag")} $ / unité</td>
              </tr>
              <tr>
                <td className={cell}><label className={chk}><input type="checkbox" checked={transport} onChange={e => setTransport(e.target.checked)} /> Transport</label></td>
                <td className={cell + " text-right font-mono"}>{getPrice("transport")} $</td>
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
              <p className="text-xs text-gray-500 px-3 py-1">Taux : 1 USD = {rates[currency].toFixed(4)} {currency} | Calculé le {new Date().toLocaleString("fr-FR")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
