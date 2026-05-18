/*
 * Générateur de brochures HTML pour les produits Hallucine
 * Génère un document HTML imprimable avec les specs du produit
 */

const LOGO_URL = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/tWSEvNLkFkmjxAXj.png";

interface ProductData {
  name: string;
  subtitle: string;
  description: string;
  specs: { label: string; value: string }[];
  features: string[];
  sizes?: { size: string; weight: string; capacity: string; price: string }[];
  images: string[];
}

const PRODUCTS: Record<string, ProductData> = {
  "ecran-soufflerie": {
    name: "Écran Gonflable Géant (Soufflerie)",
    subtitle: "L'écran de cinéma le plus léger au monde",
    description:
      "L'écran gonflable géant Hallucine à soufflerie est la référence mondiale pour les projections en plein air. Gonflé en continu par un ventilateur silencieux, il offre une surface de projection parfaitement tendue et stable, même par vent modéré. Fabriqué en France depuis 1992, c'est l'écran le plus léger de sa catégorie.",
    specs: [
      { label: "Technologie", value: "Soufflerie continue (ventilateur)" },
      { label: "Matériau", value: "Tissu airbag haute résistance" },
      { label: "Toile", value: "PVC blanc mat 16:9" },
      { label: "Tailles disponibles", value: "8m à 24m" },
      { label: "Montage", value: "10-30 min selon taille" },
      { label: "Garantie", value: "10 ans structure" },
      { label: "Fabrication", value: "France (Montpellier)" },
    ],
    features: [
      "Le plus léger au monde (jusqu'à 3× plus léger que la concurrence)",
      "Montage rapide par 1 à 4 personnes selon la taille",
      "Résistant au vent jusqu'à 50 km/h",
      "Toile de projection amovible et remplaçable",
      "Transport facile dans un sac de rangement inclus",
      "Personnalisation possible (couleur, branding)",
    ],
    sizes: [
      { size: "8m × 6m", weight: "35 kg", capacity: "300 pers.", price: "À partir de 4 990€" },
      { size: "10m × 7m", weight: "50 kg", capacity: "500 pers.", price: "À partir de 6 990€" },
      { size: "13m × 8m", weight: "80 kg", capacity: "800 pers.", price: "À partir de 9 990€" },
      { size: "15m × 10m", weight: "110 kg", capacity: "1 200 pers.", price: "À partir de 12 900€" },
      { size: "17m × 12m", weight: "180 kg", capacity: "2 000 pers.", price: "À partir de 16 900€" },
      { size: "20m × 14m", weight: "220 kg", capacity: "3 000 pers.", price: "À partir de 19 900€" },
      { size: "24m × 14m", weight: "280 kg", capacity: "5 000 pers.", price: "À partir de 24 900€" },
    ],
    images: [
      "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/eEXwXGCYYCdjehRy.webp",
    ],
  },
  "ecran-etanche": {
    name: "Écran Gonflable Étanche à l'Air",
    subtitle: "Technologie TPU — Silencieux et autonome",
    description:
      "L'écran étanche Hallucine utilise la technologie TPU (Thermoplastic Polyurethane) pour maintenir sa forme sans ventilateur. Une fois gonflé, il reste parfaitement stable et silencieux. Idéal pour les hôtels, piscines, et tous les lieux où le silence est essentiel.",
    specs: [
      { label: "Technologie", value: "Étanche à l'air (airtight TPU)" },
      { label: "Matériau", value: "TPU thermosoudé haute résistance" },
      { label: "Toile", value: "PVC blanc mat 16:9" },
      { label: "Tailles disponibles", value: "2m à 8m" },
      { label: "Ventilateur", value: "Non requis (silencieux)" },
      { label: "Garantie", value: "5 ans structure" },
      { label: "Fabrication", value: "France (Montpellier)" },
    ],
    features: [
      "100% silencieux — aucun ventilateur nécessaire",
      "Technologie TPU étanche : gonflez une fois, profitez toute la soirée",
      "Ultra-léger et compact pour le transport",
      "Résistant à l'eau et aux UV",
      "Idéal pour hôtels, piscines, jardins privés",
      "Montage en 5 minutes par une seule personne",
    ],
    sizes: [
      { size: "2m", weight: "8 kg", capacity: "30 pers.", price: "À partir de 2 490€" },
      { size: "3m", weight: "12 kg", capacity: "50 pers.", price: "À partir de 3 490€" },
      { size: "4m", weight: "18 kg", capacity: "80 pers.", price: "À partir de 4 490€" },
      { size: "5m", weight: "25 kg", capacity: "120 pers.", price: "À partir de 5 490€" },
      { size: "6m", weight: "32 kg", capacity: "200 pers.", price: "À partir de 6 900€" },
      { size: "8m", weight: "45 kg", capacity: "350 pers.", price: "À partir de 8 900€" },
    ],
    images: [
      "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/oWJlmXMcJLDivNJi.webp",
    ],
  },
  "ecran-economique": {
    name: "Écran Gonflable Économique",
    subtitle: "La qualité Hallucine à petit prix",
    description:
      "L'écran économique Hallucine offre un excellent rapport qualité-prix pour les budgets plus serrés. Avec sa toile 4:3, il est parfait pour les petits événements, les associations et les collectivités qui souhaitent proposer du cinéma en plein air sans investissement majeur.",
    specs: [
      { label: "Technologie", value: "Soufflerie continue" },
      { label: "Format toile", value: "4:3" },
      { label: "Tailles disponibles", value: "3m à 6m" },
      { label: "Montage", value: "10 min par 1 personne" },
      { label: "Garantie", value: "3 ans structure" },
      { label: "Fabrication", value: "France" },
    ],
    features: [
      "Prix accessible pour les petits budgets",
      "Qualité de fabrication Hallucine",
      "Montage ultra-rapide par une seule personne",
      "Léger et compact",
      "Idéal pour associations, campings, particuliers",
    ],
    sizes: [
      { size: "3m", weight: "10 kg", capacity: "40 pers.", price: "À partir de 990€" },
      { size: "4m", weight: "15 kg", capacity: "70 pers.", price: "À partir de 1 490€" },
      { size: "5m", weight: "22 kg", capacity: "100 pers.", price: "À partir de 2 490€" },
      { size: "6m", weight: "28 kg", capacity: "150 pers.", price: "À partir de 3 490€" },
    ],
    images: [],
  },
};

function generateBrochureHTML(product: ProductData): string {
  const sizesTable = product.sizes
    ? `
    <table>
      <thead>
        <tr>
          <th>Taille</th>
          <th>Poids</th>
          <th>Capacité</th>
          <th>Prix</th>
        </tr>
      </thead>
      <tbody>
        ${product.sizes
          .map(
            (s) => `
          <tr>
            <td>${s.size}</td>
            <td>${s.weight}</td>
            <td>${s.capacity}</td>
            <td>${s.price}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hallucine — ${product.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', sans-serif;
      color: #1a1a2e;
      background: #fff;
      line-height: 1.6;
    }
    
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .header img { height: 60px; border-radius: 8px; }
    
    .header-text h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .header-text p {
      font-size: 14px;
      opacity: 0.7;
    }
    
    .gold { color: #d4a853; }
    
    .content { padding: 40px; max-width: 900px; margin: 0 auto; }
    
    .section { margin-bottom: 36px; }
    
    .section h2 {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #d4a853;
    }
    
    .description {
      font-size: 15px;
      color: #444;
      line-height: 1.8;
      margin-bottom: 24px;
    }
    
    .specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    .spec-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 16px;
      background: #f8f9fa;
      border-radius: 8px;
      font-size: 14px;
    }
    
    .spec-item .label { font-weight: 600; color: #1a1a2e; }
    .spec-item .value { color: #666; }
    
    .features-list {
      list-style: none;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    .features-list li {
      padding: 10px 16px;
      background: #f0f7f0;
      border-radius: 8px;
      font-size: 14px;
      color: #2d5a2d;
      position: relative;
      padding-left: 32px;
    }
    
    .features-list li::before {
      content: "✓";
      position: absolute;
      left: 12px;
      color: #2d8a2d;
      font-weight: bold;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    
    table th {
      background: #1a1a2e;
      color: white;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
    }
    
    table td {
      padding: 10px 16px;
      border-bottom: 1px solid #eee;
    }
    
    table tr:nth-child(even) td { background: #f8f9fa; }
    
    .footer {
      background: #1a1a2e;
      color: white;
      padding: 30px 40px;
      text-align: center;
      font-size: 13px;
    }
    
    .footer .contact {
      margin-top: 12px;
      opacity: 0.7;
    }
    
    .footer a { color: #d4a853; text-decoration: none; }
    
    @media print {
      body { font-size: 12px; }
      .header { padding: 24px; }
      .content { padding: 24px; }
      .section { margin-bottom: 24px; }
      table { font-size: 11px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-text">
      <h1>${product.name}</h1>
      <p class="gold">${product.subtitle}</p>
    </div>
    <img src="${LOGO_URL}" alt="Hallucine" />
  </div>
  
  <div class="content">
    <div class="section">
      <p class="description">${product.description}</p>
    </div>
    
    <div class="section">
      <h2>Caractéristiques techniques</h2>
      <div class="specs-grid">
        ${product.specs
          .map(
            (s) =>
              `<div class="spec-item"><span class="label">${s.label}</span><span class="value">${s.value}</span></div>`
          )
          .join("")}
      </div>
    </div>
    
    <div class="section">
      <h2>Points forts</h2>
      <ul class="features-list">
        ${product.features.map((f) => `<li>${f}</li>`).join("")}
      </ul>
    </div>
    
    ${
      product.sizes
        ? `<div class="section">
      <h2>Tailles et tarifs indicatifs</h2>
      ${sizesTable}
    </div>`
        : ""
    }
  </div>
  
  <div class="footer">
    <p><strong>Hallucine EURL</strong> — Fabricant français d'écrans de cinéma gonflables depuis 1992</p>
    <div class="contact">
      <p>📧 <a href="mailto:contact@hallucine.fr">contact@hallucine.fr</a> | 📞 +33 6 80 14 76 94 | 💬 WhatsApp</p>
      <p style="margin-top: 8px;">🌐 <a href="https://hallucinecran.fr">hallucinecran.fr</a> — Demandez votre devis personnalisé</p>
    </div>
  </div>
</body>
</html>`;
}

export function generateBrochure(productSlug: string): { html: string; productName: string } {
  const product = PRODUCTS[productSlug];
  if (!product) {
    throw new Error(`Produit inconnu: ${productSlug}`);
  }
  return {
    html: generateBrochureHTML(product),
    productName: product.name,
  };
}

export function getAvailableProducts(): string[] {
  return Object.keys(PRODUCTS);
}
