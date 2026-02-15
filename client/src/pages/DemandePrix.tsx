/*
 * Page Demande de Prix
 * Formulaire gate pour accéder aux tarifs (lead generation)
 * AUCUN tarif n'est visible sans avoir rempli le formulaire
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Link } from "wouter";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const produits = [
  { id: "ecrans", label: "Écran gonflable" },
  { id: "tentes", label: "Tentes gonflables" },
  { id: "arches", label: "Arches gonflables" },
  { id: "mobilier", label: "Mobilier gonflable" },
];

/* ── Tarifs Écrans Soufflerie ── */
const tarifsSoufflerie = [
  { taille: "8m × 6m", toile: "7m × 5m", poids: "35 kg", hauteur: "—", montage: "30 min", personnes: "1", prix: "12 554 €" },
  { taille: "10m × 7m", toile: "9m × 6m", poids: "50 kg", hauteur: "160 cm", montage: "30 min", personnes: "1", prix: "15 024 €" },
  { taille: "10,32m × 7,90m", toile: "9m × 5m", poids: "60 kg", hauteur: "220 cm", montage: "30 min", personnes: "1", prix: "16 024 €" },
  { taille: "13m × 8m", toile: "12m × 6,5m", poids: "80 kg", hauteur: "—", montage: "30 min", personnes: "2", prix: "18 705 €" },
  { taille: "14m × 9m", toile: "13m × 7m", poids: "90 kg", hauteur: "—", montage: "45 min", personnes: "2", prix: "23 767 €" },
  { taille: "15m × 10m", toile: "14m × 8m", poids: "110 kg", hauteur: "—", montage: "45 min", personnes: "2", prix: "31 105 €" },
  { taille: "17m × 12m", toile: "15m × 10m", poids: "180 kg", hauteur: "—", montage: "1h", personnes: "3", prix: "34 105 €" },
  { taille: "20m × 14m", toile: "18m × 12m", poids: "220 kg", hauteur: "—", montage: "1h15", personnes: "3", prix: "41 233 €" },
  { taille: "24m × 14m", toile: "22m × 12m", poids: "280 kg", hauteur: "—", montage: "1h30", personnes: "4", prix: "48 258 €" },
];

/* ── Tarifs Écrans Étanches ── */
const tarifsEtanches = [
  { taille: "314 × 234 cm", toile: "300 × 170 cm", poids: "8 kg", hauteur: "50 cm", personnes: "1", prix: "3 900 €" },
  { taille: "426 × 352 cm", toile: "400 × 225 cm", poids: "15 kg", hauteur: "100 cm", personnes: "1", prix: "5 900 €" },
  { taille: "530 × 430 cm", toile: "500 × 280 cm", poids: "20 kg", hauteur: "120 cm", personnes: "1", prix: "6 700 €" },
  { taille: "620 × 505 cm", toile: "600 × 338 cm", poids: "32 kg", hauteur: "150 cm", personnes: "1", prix: "7 700 €" },
  { taille: "724 × 580 cm", toile: "700 × 395 cm", poids: "45 kg", hauteur: "160 cm", personnes: "2", prix: "9 500 €" },
  { taille: "820 × 630 cm", toile: "800 × 450 cm", poids: "50 kg", hauteur: "160 cm", personnes: "2", prix: "12 200 €" },
  { taille: "920 × 685 cm", toile: "900 × 506 cm", poids: "62 kg", hauteur: "160 cm", personnes: "2 ou 3", prix: "13 500 €" },
  { taille: "1024 × 753 cm", toile: "1000 × 570 cm", poids: "73 kg", hauteur: "160 cm", personnes: "2 ou 3", prix: "15 200 €" },
];

/* ── Tarifs Arches ── */
const tarifsArches = [
  { ref: "CA-4/2.6/0.45", taille: "400×260(H)×45cm", prixBlanc: "756 €", prixImprime: "978 €" },
  { ref: "CA-5/3.2/0.6", taille: "500×320(H)×60cm", prixBlanc: "1 044 €", prixImprime: "1 395 €" },
  { ref: "CA-6/3.8/0.6", taille: "600×380(H)×60cm", prixBlanc: "1 203 €", prixImprime: "1 608 €" },
  { ref: "CA-6/3.8/0.8", taille: "600×380(H)×80cm", prixBlanc: "1 614 €", prixImprime: "2 058 €" },
  { ref: "CA-8/4.6/0.8", taille: "800×460(H)×80cm", prixBlanc: "2 007 €", prixImprime: "2 571 €" },
  { ref: "CA-8/4.8/0.9", taille: "800×480(H)×90cm", prixBlanc: "2 199 €", prixImprime: "2 793 €" },
  { ref: "CA-10/4.8/0.8", taille: "1000×480(H)×80cm", prixBlanc: "2 313 €", prixImprime: "2 952 €" },
  { ref: "CA-10/4.8/0.9", taille: "1000×480(H)×90cm", prixBlanc: "2 457 €", prixImprime: "3 126 €" },
  { ref: "CA-10/5.8/0.9", taille: "1000×580(H)×90cm", prixBlanc: "2 610 €", prixImprime: "3 327 €" },
  { ref: "CA-12/4.8/0.9", taille: "1200×480(H)×90cm", prixBlanc: "2 691 €", prixImprime: "3 408 €" },
  { ref: "CA-12/5.8/0.9", taille: "1200×580(H)×90cm", prixBlanc: "2 919 €", prixImprime: "3 717 €" },
];

const tarifsArchesAccessoires = [
  { ref: "CA-EP", nom: "Pompe électrique", prix: "35 €" },
  { ref: "CA-HP", nom: "Pompe manuelle", prix: "10 €" },
  { ref: "CA-ACC-1", nom: "Cordes/Piquets", prix: "10 €" },
  { ref: "CA-ACC-2", nom: "Valve de rechange", prix: "5 €" },
];

/* ── Tarifs Tente X (EUR HT) ── */
const tarifsTenteX = [
  { taille: "3m × 3m", structure: "334 €", pied: "1 074 €", total: "1 408 €" },
  { taille: "4m × 4m", structure: "441 €", pied: "1 398 €", total: "1 839 €" },
  { taille: "5m × 5m", structure: "531 €", pied: "1 899 €", total: "2 430 €" },
  { taille: "6m × 6m", structure: "654 €", pied: "2 253 €", total: "2 907 €" },
  { taille: "7m × 7m", structure: "879 €", pied: "2 796 €", total: "3 675 €" },
  { taille: "8m × 8m", structure: "1 080 €", pied: "3 060 €", total: "4 140 €" },
];

const mursTenteX = [
  { type: "Mur latéral", "3x3": "111 €", "4x4": "138 €", "5x5": "177 €", "6x6": "243 €", "7x7": "300 €", "8x8": "339 €" },
  { type: "Mur de porte", "3x3": "135 €", "4x4": "171 €", "5x5": "207 €", "6x6": "270 €", "7x7": "315 €", "8x8": "369 €" },
  { type: "Mur de fenêtre", "3x3": "129 €", "4x4": "159 €", "5x5": "198 €", "6x6": "267 €", "7x7": "324 €", "8x8": "366 €" },
  { type: "Mur courbe", "3x3": "96 €", "4x4": "117 €", "5x5": "150 €", "6x6": "189 €", "7x7": "207 €", "8x8": "234 €" },
  { type: "Auvent", "3x3": "432 €", "4x4": "513 €", "5x5": "588 €", "6x6": "720 €", "7x7": "834 €", "8x8": "930 €" },
  { type: "Tissu de connexion", "3x3": "141 €", "4x4": "153 €", "5x5": "174 €", "6x6": "228 €", "7x7": "249 €", "8x8": "288 €" },
];

const impressionTenteX = [
  { type: "Structure", "3x3": "282 €", "4x4": "480 €", "5x5": "564 €", "6x6": "678 €", "7x7": "900 €", "8x8": "1 260 €" },
  { type: "Cache fermeture", "3x3": "30 €", "4x4": "39 €", "5x5": "42 €", "6x6": "48 €", "7x7": "57 €", "8x8": "69 €" },
  { type: "Chaque mur", "3x3": "141 €", "4x4": "174 €", "5x5": "234 €", "6x6": "273 €", "7x7": "297 €", "8x8": "357 €" },
  { type: "Mur courbe", "3x3": "39 €", "4x4": "42 €", "5x5": "48 €", "6x6": "69 €", "7x7": "78 €", "8x8": "87 €" },
  { type: "Pieds", "3x3": "192 €", "4x4": "399 €", "5x5": "468 €", "6x6": "639 €", "7x7": "720 €", "8x8": "996 €" },
  { type: "Bas PVC pieds", "3x3": "69 €", "4x4": "84 €", "5x5": "87 €", "6x6": "99 €", "7x7": "111 €", "8x8": "117 €" },
  { type: "Bannière auvent", "3x3": "72 €", "4x4": "99 €", "5x5": "108 €", "6x6": "138 €", "7x7": "156 €", "8x8": "207 €" },
  { type: "Tissu auvent", "3x3": "117 €", "4x4": "132 €", "5x5": "165 €", "6x6": "195 €", "7x7": "237 €", "8x8": "285 €" },
  { type: "Pieds auvent", "3x3": "33 €", "4x4": "39 €", "5x5": "87 €", "6x6": "120 €", "7x7": "129 €", "8x8": "138 €" },
  { type: "Bas PVC pieds auvent", "3x3": "33 €", "4x4": "33 €", "5x5": "60 €", "6x6": "60 €", "7x7": "66 €", "8x8": "66 €" },
  { type: "Connecteur", "3x3": "51 €", "4x4": "60 €", "5x5": "75 €", "6x6": "117 €", "7x7": "192 €", "8x8": "252 €" },
];

/* ── Tarifs Tente V (EUR HT) ── */
const tarifsTenteV = [
  { taille: "4m × 4m", auvent: "516 €", pied: "1 830 €", total: "2 346 €" },
  { taille: "5m × 5m", auvent: "651 €", pied: "2 139 €", total: "2 790 €" },
  { taille: "6m × 6m", auvent: "825 €", pied: "2 823 €", total: "3 648 €" },
];

const impressionTenteV = [
  { type: "Impression auvent", "4x4": "399 €", "5x5": "564 €", "6x6": "783 €" },
  { type: "Impression cadre pied", "4x4": "375 €", "5x5": "504 €", "6x6": "684 €" },
];

const accessoiresTenteV = [
  { nom: "Sac de transport", "4x4": "180 €", "5x5": "180 €", "6x6": "180 €" },
  { nom: "Sac de sable (×1)", "4x4": "39 €", "5x5": "39 €", "6x6": "39 €" },
  { nom: "Lumière LED", "4x4": "195 €", "5x5": "195 €", "6x6": "195 €" },
  { nom: "Pompe électrique", "4x4": "105 €", "5x5": "105 €", "6x6": "105 €" },
  { nom: "Pompe manuelle", "4x4": "45 €", "5x5": "45 €", "6x6": "45 €" },
];

/* ── Tarifs Tente N (USD) ── */
const tarifsTenteN = [
  { taille: "3m × 3m", canopee: "300 $", cadre: "1 647 $", total: "1 947 $" },
  { taille: "4m × 4m", canopee: "426 $", cadre: "2 220 $", total: "2 646 $" },
  { taille: "5m × 5m", canopee: "543 $", cadre: "3 267 $", total: "3 810 $" },
];

const mursTenteN = [
  { type: "Mur A — fenêtre", "3x3": "144 $", "4x4": "174 $", "5x5": "216 $" },
  { type: "Mur A — porte", "3x3": "147 $", "4x4": "180 $", "5x5": "219 $" },
  { type: "Mur A — normal", "3x3": "135 $", "4x4": "156 $", "5x5": "195 $" },
  { type: "Mur B — fenêtre", "3x3": "165 $", "4x4": "231 $", "5x5": "276 $" },
  { type: "Mur B — porte", "3x3": "159 $", "4x4": "225 $", "5x5": "279 $" },
  { type: "Mur B — normal", "3x3": "141 $", "4x4": "198 $", "5x5": "252 $" },
  { type: "Mur C — courbe", "3x3": "111 $", "4x4": "141 $", "5x5": "165 $" },
  { type: "Mur D — fenêtre", "3x3": "141 $", "4x4": "174 $", "5x5": "216 $" },
  { type: "Mur D — porte", "3x3": "147 $", "4x4": "186 $", "5x5": "219 $" },
  { type: "Mur D — normal", "3x3": "123 $", "4x4": "159 $", "5x5": "186 $" },
  { type: "Partie de connexion", "3x3": "111 $", "4x4": "138 $", "5x5": "168 $" },
];

const impressionTenteN = [
  { type: "Canopée", "3x3": "225 $", "4x4": "378 $", "5x5": "582 $" },
  { type: "Jambe", "3x3": "372 $", "4x4": "522 $", "5x5": "813 $" },
  { type: "Couvercle fermeture", "3x3": "21 $", "4x4": "27 $", "5x5": "33 $" },
  { type: "Mur A", "3x3": "135 $", "4x4": "183 $", "5x5": "222 $" },
  { type: "Mur B", "3x3": "150 $", "4x4": "252 $", "5x5": "327 $" },
  { type: "Mur C", "3x3": "78 $", "4x4": "87 $", "5x5": "120 $" },
  { type: "Couvercle mur C", "3x3": "18 $", "4x4": "21 $", "5x5": "24 $" },
  { type: "Mur D", "3x3": "132 $", "4x4": "180 $", "5x5": "213 $" },
  { type: "Connexion", "3x3": "51 $", "4x4": "60 $", "5x5": "69 $" },
];

/* ── Tarifs Tente Araignée (EUR HT) ── */
const tarifsAraignee = [
  { taille: "4m × 4m", toit: "1 113 €", pied: "2 628 €", total: "3 741 €" },
  { taille: "6m × 6m", toit: "1 473 €", pied: "3 591 €", total: "5 064 €" },
  { taille: "8m × 8m", toit: "2 592 €", pied: "5 850 €", total: "8 442 €" },
  { taille: "10m × 10m", toit: "3 537 €", pied: "8 979 €", total: "12 516 €" },
];

const mursAraignee = [
  { type: "Mur latéral", "4x4": "228 €", "6x6": "312 €", "8x8": "534 €", "10x10": "753 €" },
  { type: "Mur de porte", "4x4": "240 €", "6x6": "327 €", "8x8": "555 €", "10x10": "777 €" },
  { type: "Mur de fenêtre", "4x4": "237 €", "6x6": "324 €", "8x8": "552 €", "10x10": "774 €" },
  { type: "Auvent", "4x4": "699 €", "6x6": "1 059 €", "8x8": "1 224 €", "10x10": "1 545 €" },
];

const impressionAraignee = [
  { type: "Toit", "4x4": "642 €", "6x6": "960 €", "8x8": "1 239 €", "10x10": "2 148 €" },
  { type: "Couverture fermeture", "4x4": "39 €", "6x6": "45 €", "8x8": "54 €", "10x10": "72 €" },
  { type: "Mur (latéral/porte/fenêtre)", "4x4": "123 €", "6x6": "273 €", "8x8": "357 €", "10x10": "417 €" },
  { type: "Pieds", "4x4": "417 €", "6x6": "720 €", "8x8": "1 080 €", "10x10": "1 731 €" },
  { type: "Bas PVC pieds", "4x4": "120 €", "6x6": "162 €", "8x8": "264 €", "10x10": "309 €" },
  { type: "Bannière auvent", "4x4": "111 €", "6x6": "147 €", "8x8": "237 €", "10x10": "285 €" },
  { type: "Tissu auvent", "4x4": "150 €", "6x6": "198 €", "8x8": "300 €", "10x10": "402 €" },
  { type: "Pieds auvent", "4x4": "72 €", "6x6": "132 €", "8x8": "150 €", "10x10": "192 €" },
  { type: "Bas PVC pieds auvent", "4x4": "54 €", "6x6": "66 €", "8x8": "87 €", "10x10": "153 €" },
];

const accessoiresAraignee = [
  { nom: "Sac de transport", "4x4": "180 €", "6x6": "180 €", "8x8": "180 €", "10x10": "180 €" },
  { nom: "Sac de sable (×1)", "4x4": "33 €", "6x6": "60 €", "8x8": "60 €", "10x10": "60 €" },
  { nom: "Sac d'eau (×1)", "4x4": "66 €", "6x6": "114 €", "8x8": "114 €", "10x10": "114 €" },
  { nom: "Lumière LED", "4x4": "195 €", "6x6": "195 €", "8x8": "195 €", "10x10": "195 €" },
  { nom: "Pompe électrique", "4x4": "105 €", "6x6": "105 €", "8x8": "105 €", "10x10": "105 €" },
  { nom: "Pompe manuelle", "4x4": "45 €", "6x6": "45 €", "8x8": "45 €", "10x10": "45 €" },
];

/* ── Composant section dépliable ── */
function TarifSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 bg-card hover:bg-white/5 transition-colors text-left"
      >
        <span className="text-ivory font-semibold text-lg">{title}</span>
        <ChevronDown className={`w-5 h-5 text-warm shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-5 pt-0">{children}</div>}
    </div>
  );
}

/* ── Composant tableau générique ── */
function TarifTable({ headers, rows }: { headers: string[]; rows: Record<string, string>[] }) {
  const keys = Object.keys(rows[0] || {});
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-warm/30">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-3 px-2 text-warm font-semibold text-xs whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border hover:bg-white/5 text-xs">
              {keys.map((k, j) => (
                <td key={j} className={`py-3 px-2 whitespace-nowrap ${j === 0 ? "text-ivory font-medium" : k === keys[keys.length - 1] && keys.length > 2 ? "text-warm font-semibold" : "text-white/70"}`}>
                  {row[k]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DemandePrix() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedProduits, setSelectedProduits] = useState<string[]>([]);
  const [formData, setFormData] = useState({ nom: "", prenom: "", email: "", telephone: "", organisation: "" });
  const [submitError, setSubmitError] = useState("");

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setSubmitError("");
    },
    onError: (err) => {
      setSubmitError("Erreur lors de l'envoi. Veuillez réessayer.");
      console.error(err);
    },
  });

  const toggleProduit = (id: string) => {
    setSelectedProduits((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const produitsLabels = selectedProduits.map(id => produits.find(p => p.id === id)?.label).filter(Boolean).join(", ");
    contactMutation.mutate({
      type: "devis",
      nom: `${formData.nom} ${formData.prenom}`.trim(),
      email: formData.email,
      telephone: formData.telephone || undefined,
      entreprise: formData.organisation || undefined,
      sujet: `Demande de prix — Produits: ${produitsLabels || "Non spécifié"}`,
      message: `Demande de prix via le formulaire.\nProduits sélectionnés: ${produitsLabels || "Aucun"}\nOrganisation: ${formData.organisation || "Non renseigné"}`,
      produit: produitsLabels || undefined,
    });
  };

  /* ═══════════ FORMULAIRE (avant soumission) ═══════════ */
  if (!submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section className="pt-32 pb-20 bg-charcoal-light">
          <div className="container max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-ivory mb-4">Demande de prix</h1>
            <p className="text-white/70 text-lg mb-10">
              Remplissez le formulaire ci-dessous pour accéder à notre grille tarifaire complète.
              Nous vous enverrons également un devis personnalisé si vous le souhaitez.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Nom *</label>
                  <input type="text" required value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded text-ivory focus:border-warm focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Prénom *</label>
                  <input type="text" required value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded text-ivory focus:border-warm focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border rounded text-ivory focus:border-warm focus:outline-none transition-colors" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Téléphone</label>
                  <input type="tel" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded text-ivory focus:border-warm focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Organisation</label>
                  <input type="text" value={formData.organisation} onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded text-ivory focus:border-warm focus:outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-3">Produits qui vous intéressent</label>
                <div className="grid grid-cols-2 gap-3">
                  {produits.map((p) => (
                    <button key={p.id} type="button" onClick={() => toggleProduit(p.id)}
                      className={`flex items-center gap-3 p-4 rounded border transition-colors text-left ${
                        selectedProduits.includes(p.id) ? "border-warm bg-warm/10 text-warm" : "border-border bg-card text-white/70 hover:border-warm/30"
                      }`}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                        selectedProduits.includes(p.id) ? "border-warm bg-warm" : "border-white/30"
                      }`}>
                        {selectedProduits.includes(p.id) && <Check className="w-3 h-3 text-charcoal" />}
                      </div>
                      <span className="text-sm font-medium">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {submitError && (
                <p className="text-red-400 text-sm text-center">{submitError}</p>
              )}

              <button type="submit" disabled={contactMutation.isPending} className="w-full py-4 bg-warm text-charcoal font-bold text-lg rounded hover:bg-warm-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {contactMutation.isPending ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...</>
                ) : (
                  "Accéder aux tarifs"
                )}
              </button>
            </form>

            <div className="mt-8 p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">Personnalisation sur mesure</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Tous nos produits sont personnalisables : dimensions, couleurs, impression de logos et visuels.
                N'hésitez pas à nous contacter pour discuter de vos besoins spécifiques.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  /* ═══════════ TARIFS (après soumission) ═══════════ */
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-8 bg-charcoal-light">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-ivory mb-4">Nos tarifs</h1>
          <p className="text-white/70 text-lg">
            Merci pour votre intérêt. Voici notre grille tarifaire complète. Tous les prix sont en HT, hors transport.
          </p>
        </div>
      </section>

      {/* ── ÉCRANS SOUFFLERIE ── */}
      <section className="py-12 bg-background">
        <div className="container">
          <TarifSection title="Écrans Gonflables avec Soufflerie" defaultOpen>
            <p className="text-white/60 text-sm mb-4">Léger et facile à transporter. Installation rapide. Nécessite une connexion électrique continue.</p>
            <TarifTable
              headers={["Taille hors tout", "Toile", "Poids", "Hauteur base", "Montage", "Pers.", "Prix H.T."]}
              rows={tarifsSoufflerie.map(r => ({ taille: r.taille, toile: r.toile, poids: r.poids, hauteur: r.hauteur, montage: r.montage, personnes: r.personnes, prix: r.prix }))}
            />
          </TarifSection>

          {/* ── ÉCRANS ÉTANCHES ── */}
          <TarifSection title="Écrans Gonflables Étanches (sans soufflerie)">
            <p className="text-white/60 text-sm mb-4">Silencieux, sans électricité. Résistant aux conditions extérieures. Convient pour des installations de longue durée.</p>
            <TarifTable
              headers={["Taille globale", "Toile 16/9", "Poids", "Hauteur base", "Pers.", "Prix H.T."]}
              rows={tarifsEtanches.map(r => ({ taille: r.taille, toile: r.toile, poids: r.poids, hauteur: r.hauteur, personnes: r.personnes, prix: r.prix }))}
            />
          </TarifSection>

          {/* ── TENTE X ── */}
          <TarifSection title="Tente Gonflable X (EUR HT)">
            <p className="text-white/60 text-sm mb-4">Disponible de 3×3m à 8×8m. Canopy 400D + fermetures YKK. Pieds TPU + Dacron 250D.</p>

            <h4 className="text-warm font-semibold text-sm mb-2 mt-4">Prix de base (hors transport)</h4>
            <TarifTable
              headers={["Taille", "Structure (Canopy)", "Pied (TPU+Dacron)", "Total HT"]}
              rows={tarifsTenteX.map(r => ({ taille: r.taille, structure: r.structure, pied: r.pied, total: r.total }))}
            />

            <h4 className="text-warm font-semibold text-sm mb-2 mt-6">Murs et accessoires</h4>
            <TarifTable
              headers={["Type", "3×3m", "4×4m", "5×5m", "6×6m", "7×7m", "8×8m"]}
              rows={mursTenteX.map(r => ({ type: r.type, "3x3": r["3x3"], "4x4": r["4x4"], "5x5": r["5x5"], "6x6": r["6x6"], "7x7": r["7x7"], "8x8": r["8x8"] }))}
            />

            <h4 className="text-warm font-semibold text-sm mb-2 mt-6">Coût impression (sublimation thermique)</h4>
            <TarifTable
              headers={["Élément", "3×3m", "4×4m", "5×5m", "6×6m", "7×7m", "8×8m"]}
              rows={impressionTenteX.map(r => ({ type: r.type, "3x3": r["3x3"], "4x4": r["4x4"], "5x5": r["5x5"], "6x6": r["6x6"], "7x7": r["7x7"], "8x8": r["8x8"] }))}
            />
          </TarifSection>

          {/* ── TENTE V ── */}
          <TarifSection title="Tente Gonflable V (EUR HT)">
            <p className="text-white/60 text-sm mb-4">Disponible de 4×4m à 6×6m. Canopy 400D + fermetures YKK. Pieds TPU + Dacron 250D.</p>

            <h4 className="text-warm font-semibold text-sm mb-2 mt-4">Prix de base (hors transport)</h4>
            <TarifTable
              headers={["Taille", "Auvent (Canopy)", "Pied (TPU+Dacron)", "Total HT"]}
              rows={tarifsTenteV.map(r => ({ taille: r.taille, auvent: r.auvent, pied: r.pied, total: r.total }))}
            />

            <h4 className="text-warm font-semibold text-sm mb-2 mt-6">Coût impression</h4>
            <TarifTable
              headers={["Élément", "4×4m", "5×5m", "6×6m"]}
              rows={impressionTenteV.map(r => ({ type: r.type, "4x4": r["4x4"], "5x5": r["5x5"], "6x6": r["6x6"] }))}
            />

            <h4 className="text-warm font-semibold text-sm mb-2 mt-6">Accessoires</h4>
            <TarifTable
              headers={["Accessoire", "4×4m", "5×5m", "6×6m"]}
              rows={accessoiresTenteV.map(r => ({ nom: r.nom, "4x4": r["4x4"], "5x5": r["5x5"], "6x6": r["6x6"] }))}
            />
          </TarifSection>

          {/* ── TENTE N ── */}
          <TarifSection title="Tente Gonflable N (USD)">
            <p className="text-white/50 text-xs mb-1 bg-warm/10 border border-warm/20 rounded px-3 py-2 inline-block">Les prix des Tentes N sont en dollars américains (USD), pas en euros.</p>
            <p className="text-white/60 text-sm mb-4 mt-2">Disponible de 3×3m à 5×5m. Canopy 400D + fermetures YKK. Cadre TPU + Dacron 250D.</p>

            <h4 className="text-warm font-semibold text-sm mb-2 mt-4">Prix de base (hors transport)</h4>
            <TarifTable
              headers={["Taille", "Canopée", "Cadre (TPU+Dacron)", "Total USD"]}
              rows={tarifsTenteN.map(r => ({ taille: r.taille, canopee: r.canopee, cadre: r.cadre, total: r.total }))}
            />

            <h4 className="text-warm font-semibold text-sm mb-2 mt-6">Murs latéraux</h4>
            <TarifTable
              headers={["Type", "3×3m", "4×4m", "5×5m"]}
              rows={mursTenteN.map(r => ({ type: r.type, "3x3": r["3x3"], "4x4": r["4x4"], "5x5": r["5x5"] }))}
            />

            <h4 className="text-warm font-semibold text-sm mb-2 mt-6">Coût impression (sublimation thermique)</h4>
            <TarifTable
              headers={["Élément", "3×3m", "4×4m", "5×5m"]}
              rows={impressionTenteN.map(r => ({ type: r.type, "3x3": r["3x3"], "4x4": r["4x4"], "5x5": r["5x5"] }))}
            />
          </TarifSection>

          {/* ── TENTE ARAIGNÉE ── */}
          <TarifSection title="Tente Araignée Gonflable (EUR HT)">
            <p className="text-white/60 text-sm mb-4">Disponible de 4×4m à 10×10m. Toit 400D + fermetures YKK. Pieds TPU + Dacron 250D.</p>

            <h4 className="text-warm font-semibold text-sm mb-2 mt-4">Prix de base (hors transport)</h4>
            <TarifTable
              headers={["Taille", "Toit", "Pied (TPU+Dacron)", "Total HT"]}
              rows={tarifsAraignee.map(r => ({ taille: r.taille, toit: r.toit, pied: r.pied, total: r.total }))}
            />

            <h4 className="text-warm font-semibold text-sm mb-2 mt-6">Murs et auvents</h4>
            <TarifTable
              headers={["Type", "4×4m", "6×6m", "8×8m", "10×10m"]}
              rows={mursAraignee.map(r => ({ type: r.type, "4x4": r["4x4"], "6x6": r["6x6"], "8x8": r["8x8"], "10x10": r["10x10"] }))}
            />

            <h4 className="text-warm font-semibold text-sm mb-2 mt-6">Coût impression (sublimation thermique)</h4>
            <TarifTable
              headers={["Élément", "4×4m", "6×6m", "8×8m", "10×10m"]}
              rows={impressionAraignee.map(r => ({ type: r.type, "4x4": r["4x4"], "6x6": r["6x6"], "8x8": r["8x8"], "10x10": r["10x10"] }))}
            />

            <h4 className="text-warm font-semibold text-sm mb-2 mt-6">Accessoires</h4>
            <TarifTable
              headers={["Accessoire", "4×4m", "6×6m", "8×8m", "10×10m"]}
              rows={accessoiresAraignee.map(r => ({ nom: r.nom, "4x4": r["4x4"], "6x6": r["6x6"], "8x8": r["8x8"], "10x10": r["10x10"] }))}
            />
          </TarifSection>

          {/* ── ARCHES ── */}
          <TarifSection title="Arches Gonflables (EUR HT)">
            <p className="text-white/60 text-sm mb-4">Tissu blanc + vessie TPU. Étanches — un seul gonflage suffit. Diamètre maximal : 90 cm.</p>
            <TarifTable
              headers={["Réf.", "Taille", "Prix blanc", "Prix avec impression"]}
              rows={tarifsArches.map(r => ({ ref: r.ref, taille: r.taille, prixBlanc: r.prixBlanc, prixImprime: r.prixImprime }))}
            />

            <h4 className="text-warm font-semibold text-sm mb-2 mt-6">Accessoires arches</h4>
            <TarifTable
              headers={["Réf.", "Nom", "Prix"]}
              rows={tarifsArchesAccessoires.map(r => ({ ref: r.ref, nom: r.nom, prix: r.prix }))}
            />
          </TarifSection>

          {/* ── MOBILIER ── */}
          <TarifSection title="Mobilier Gonflable">
            <p className="text-white/60 text-sm">
              Les tarifs du mobilier gonflable sont disponibles sur demande. Contactez-nous pour recevoir un devis personnalisé
              incluant canapés, fauteuils, bars, comptoirs et chariots de transport.
            </p>
            <Link href="/contactez-nous" className="inline-block mt-4 px-6 py-2 bg-warm text-charcoal text-sm font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
          </TarifSection>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Besoin d'un devis personnalisé ?</h2>
          <p className="text-white/60 mb-6">
            contact@hallucine.fr — +33 6 80 14 76 94 — WhatsApp : +33 6 80 14 76 94
          </p>
          <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
            Nous Contacter
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
