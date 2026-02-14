/*
 * Page Demande de Prix
 * Formulaire gate pour accéder aux tarifs (lead generation)
 * Reproduit le mécanisme du site de référence
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Link } from "wouter";
import { Check } from "lucide-react";

const produits = [
  { id: "ecrans", label: "Écran gonflable" },
  { id: "tentes", label: "Tentes gonflables" },
  { id: "arches", label: "Arches gonflables" },
  { id: "mobilier", label: "Mobilier gonflable" },
];

/* Tarifs écrans soufflerie */
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

/* Tarifs écrans étanches */
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

/* Tarifs arches */
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

export default function DemandePrix() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedProduits, setSelectedProduits] = useState<string[]>([]);
  const [formData, setFormData] = useState({ nom: "", prenom: "", email: "", telephone: "", organisation: "" });

  const toggleProduit = (id: string) => {
    setSelectedProduits((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded text-ivory focus:border-warm focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded text-ivory focus:border-warm focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border rounded text-ivory focus:border-warm focus:outline-none transition-colors"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded text-ivory focus:border-warm focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Organisation</label>
                  <input
                    type="text"
                    value={formData.organisation}
                    onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded text-ivory focus:border-warm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-3">Produits qui vous intéressent</label>
                <div className="grid grid-cols-2 gap-3">
                  {produits.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleProduit(p.id)}
                      className={`flex items-center gap-3 p-4 rounded border transition-colors text-left ${
                        selectedProduits.includes(p.id)
                          ? "border-warm bg-warm/10 text-warm"
                          : "border-border bg-card text-white/70 hover:border-warm/30"
                      }`}
                    >
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

              <button
                type="submit"
                className="w-full py-4 bg-warm text-charcoal font-bold text-lg rounded hover:bg-warm-light transition-colors"
              >
                Accéder aux tarifs
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

  // Après soumission : afficher les tarifs
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-8 bg-charcoal-light">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-ivory mb-4">Nos tarifs</h1>
          <p className="text-white/70 text-lg">
            Merci pour votre intérêt. Voici notre grille tarifaire complète.
          </p>
        </div>
      </section>

      {/* Écrans soufflerie */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-2xl font-bold text-ivory mb-2">Écrans Gonflables avec Soufflerie</h2>
          <p className="text-white/60 text-sm mb-6">Léger et facile à transporter. Installation rapide. Nécessite une connexion électrique continue.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Taille hors tout</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Toile</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Poids</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Hauteur base</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Montage</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Pers.</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Prix H.T.</th>
                </tr>
              </thead>
              <tbody>
                {tarifsSoufflerie.map((r, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 text-xs">
                    <td className="py-3 px-2 text-ivory font-medium">{r.taille}</td>
                    <td className="py-3 px-2 text-white/70">{r.toile}</td>
                    <td className="py-3 px-2 text-white/70">{r.poids}</td>
                    <td className="py-3 px-2 text-white/70">{r.hauteur}</td>
                    <td className="py-3 px-2 text-white/70">{r.montage}</td>
                    <td className="py-3 px-2 text-white/70">{r.personnes}</td>
                    <td className="py-3 px-2 text-warm font-semibold">{r.prix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Écrans étanches */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <h2 className="text-2xl font-bold text-ivory mb-2">Écrans Gonflables Étanches (sans soufflerie)</h2>
          <p className="text-white/60 text-sm mb-6">Résistant aux conditions extérieures. Silencieux. Convient pour des installations de longue durée.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Taille globale</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Toile 16/9</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Poids</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Hauteur base</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Pers.</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Prix H.T.</th>
                </tr>
              </thead>
              <tbody>
                {tarifsEtanches.map((r, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 text-xs">
                    <td className="py-3 px-2 text-ivory font-medium">{r.taille}</td>
                    <td className="py-3 px-2 text-white/70">{r.toile}</td>
                    <td className="py-3 px-2 text-white/70">{r.poids}</td>
                    <td className="py-3 px-2 text-white/70">{r.hauteur}</td>
                    <td className="py-3 px-2 text-white/70">{r.personnes}</td>
                    <td className="py-3 px-2 text-warm font-semibold">{r.prix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tentes */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-2xl font-bold text-ivory mb-2">Tentes Gonflables</h2>
          <p className="text-white/60 text-sm mb-6">
            Les tarifs des tentes sont disponibles sur demande. Contactez-nous pour recevoir nos catalogues 
            détaillés avec les prix pour chaque modèle et taille.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            {["Tentes X", "Tentes N", "Tentes V", "Tentes Araignées"].map((t) => (
              <div key={t} className="p-6 bg-card border border-border rounded-lg text-center">
                <p className="text-warm font-semibold mb-2">{t}</p>
                <p className="text-white/50 text-xs">Catalogue sur demande</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arches */}
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <h2 className="text-2xl font-bold text-ivory mb-2">Arches Gonflables</h2>
          <p className="text-white/60 text-sm mb-6">Tissu blanc + vessie TPU. Étanches — un seul gonflage suffit. Diamètre maximal : 90 cm.</p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Réf.</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Taille</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Prix blanc</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Prix avec impression</th>
                </tr>
              </thead>
              <tbody>
                {tarifsArches.map((r, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 text-xs">
                    <td className="py-3 px-2 text-ivory font-medium">{r.ref}</td>
                    <td className="py-3 px-2 text-white/70">{r.taille}</td>
                    <td className="py-3 px-2 text-white/70">{r.prixBlanc}</td>
                    <td className="py-3 px-2 text-warm font-semibold">{r.prixImprime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-bold text-ivory mb-4">Accessoires arches</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-xl">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Réf.</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Nom</th>
                  <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Prix</th>
                </tr>
              </thead>
              <tbody>
                {tarifsArchesAccessoires.map((r, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 text-xs">
                    <td className="py-3 px-2 text-ivory font-medium">{r.ref}</td>
                    <td className="py-3 px-2 text-white/70">{r.nom}</td>
                    <td className="py-3 px-2 text-warm font-semibold">{r.prix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Besoin d'un devis personnalisé ?</h2>
          <p className="text-white/60 mb-4">
            contact@hallucine.fr — +33 6 80 14 76 94 — WhatsApp : +33 6 80 14 76 94
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
