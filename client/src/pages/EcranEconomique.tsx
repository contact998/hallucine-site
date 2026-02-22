/*
 * Page Écran Gonflable Économique
 * Reproduit fidèlement la page hallucinecran.com/fr/ecran-economique
 * Layout 2 colonnes : avec souffleur / sans souffleur
 * Design cinéma vintage — fond sombre, accents dorés
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmCountdown from "@/components/FilmCountdown";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

// ─── Données tableaux ──────────────────────────────────────────────────────────
const avecSouffleur = [
  { taille: "4.50 × 4.00 × 2.00 m", toile: "400 × 250 cm", poids: "15 kg", hauteur: "50 cm", personnes: "1" },
  { taille: "5.40 × 4.20 × 2.80 m", toile: "480 × 270 cm", poids: "17 kg", hauteur: "70 cm", personnes: "1" },
  { taille: "7.00 × 5.20 × 3.50 m", toile: "600 × 350 cm", poids: "20 kg", hauteur: "100 cm", personnes: "1" },
];

const sansSouffleur = [
  { taille: "2.5 × 1.8 m", toile: "218 × 122 cm", poids: "7 kg", hauteur: "50 cm", personnes: "1" },
  { taille: "4 × 3.5 m", toile: "300 × 170 cm", poids: "17 kg", hauteur: "50 cm", personnes: "1" },
  { taille: "5 × 4 m", toile: "400 × 222 cm", poids: "35 kg", hauteur: "70 cm", personnes: "1" },
  { taille: "6 × 4 m", toile: "500 × 280 cm", poids: "55 kg", hauteur: "100 cm", personnes: "2" },
  { taille: "7.5 × 5.5 m", toile: "600 × 340 cm", poids: "85 kg", hauteur: "100 cm", personnes: "2" },
];

// ─── Images carousels (identiques à l'ancien site) ────────────────────────────
const imagesAvecSouffleur = [
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/FbgHJgCUoERCuJos.jpg", alt: "Écran économique avec souffleur installé dans la cour d'un bâtiment" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/BFaZoFomGXqerqBf.webp", alt: "Écran économique avec souffleur pour un petit public" },
];

const imagesSansSouffleur = [
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/JRJHgNwIipwxbWac.PNG", alt: "Écran économique sans souffleur installé dans un parc" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/EPgkfmHRzXvUcdzd.jpg", alt: "Écran économique sans souffleur sur la plage" },
];

const imagesFinales = [
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/QbCjkqnaayQbCPAI.jpg", alt: "Écran économique comparaison de taille humaine" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/eKOtDMUHutnqjXdh.jpg", alt: "Écran économique vue de derrière" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/FbgHJgCUoERCuJos.jpg", alt: "Écran économique installé en extérieur" },
];

// ─── Mini carousel ─────────────────────────────────────────────────────────────
function ImageCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-black/20 mb-6">
      <img
        src={images[idx].src}
        alt={images[idx].alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === idx ? "bg-warm" : "bg-white/40"}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export default function EcranEconomique() {
  useDocumentMeta("Écran Gonflable Économique | Prix Accessibles", "Écran de cinéma gonflable économique pour petits budgets. Qualité professionnelle à prix réduit. Idéal pour débuter le cinéma en plein air.");

  const [showCountdown, setShowCountdown] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showCountdown && <FilmCountdown onComplete={() => setShowCountdown(false)} />}
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Écrans Gonflables <span className="text-warm">Économiques</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-ivory/90 mb-6">
            Des écrans gonflables abordables<br />
            pour vos événements extérieurs et intérieurs.
          </h2>
          <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
            Nos écrans gonflables économiques sont la solution idéale pour des événements à petit budget 
            sans compromis sur la qualité. Conçus pour une utilisation facile et rapide, ces écrans sont 
            parfaits pour des projections de films, des événements sportifs, des soirées en plein air, 
            et bien plus encore.
          </p>
        </div>
      </section>

      {/* 2 colonnes : Avec souffleur / Sans souffleur */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10">

            {/* ─── Colonne gauche : Avec souffleur ─── */}
            <div className="border border-border rounded-xl p-6 bg-card">
              <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-6">
                Écrans Gonflables Économiques<br />
                <span className="text-warm">avec souffleur</span>
              </h2>

              <ImageCarousel images={imagesAvecSouffleur} />

              <p className="text-white/70 leading-relaxed mb-6">
                Les écrans gonflables avec souffleur sont dotés d'un système de gonflage permanent 
                pour une installation rapide et un maintien stable de l'écran tout au long de l'événement. 
                Ces modèles sont adaptés à des événements extérieurs et intérieurs, grâce à leur souffleur 
                faible consommation (seulement 250 Watts). Vous pouvez ainsi profiter de votre écran en toute tranquillité.
              </p>

              <h3 className="text-xl font-bold text-ivory mb-4">
                Les avantages de nos écrans<br />
                gonflables <span className="text-warm">avec souffleur</span> :
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-ivory">Installation rapide et facile</strong> : grâce au souffleur, 
                  l'écran est prêt en quelques minutes.
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-ivory">Stabilité assurée</strong> : même dans des conditions extérieures 
                  variables, nos écrans restent solides grâce au souffleur permanent.
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-ivory">Utilisation intérieure et extérieure</strong> : idéal pour tous 
                  types d'événements, qu'ils soient en plein air ou en intérieur.
                </li>
              </ul>

              <h4 className="text-lg font-semibold text-ivory mb-1">
                Caractéristiques des écrans<br />
                <span className="text-warm">avec souffleur :</span>
              </h4>
              <p className="text-ivory font-bold text-xl mb-6">Autoportant de 4m à 6m</p>

              {/* Tableau avec souffleur */}
              <h3 className="text-xl font-bold text-warm mb-4">Écrans Économiques avec Souffleur</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-warm/30">
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Taille globale</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Toile 4:3</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Poids</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Hauteur</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Pers.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avecSouffleur.map((row, i) => (
                      <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                        <td className="py-3 px-2 text-ivory font-medium text-xs">{row.taille}</td>
                        <td className="py-3 px-2 text-white/70 text-xs">{row.toile}</td>
                        <td className="py-3 px-2 text-white/70 text-xs">{row.poids}</td>
                        <td className="py-3 px-2 text-white/70 text-xs">{row.hauteur}</td>
                        <td className="py-3 px-2 text-white/70 text-xs">{row.personnes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ─── Colonne droite : Sans souffleur ─── */}
            <div className="border border-border rounded-xl p-6 bg-card">
              <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-6">
                Écrans Gonflables Économiques<br />
                <span className="text-warm">sans souffleur</span>
              </h2>

              <ImageCarousel images={imagesSansSouffleur} />

              <p className="text-white/70 leading-relaxed mb-6">
                Les écrans gonflables sans souffleur sont parfaits pour ceux qui recherchent une option 
                économique tout en gardant une bonne qualité de projection. Ces écrans sont facilement 
                transportables et peuvent être installés rapidement sans nécessiter un souffleur permanent.
              </p>

              <h3 className="text-xl font-bold text-ivory mb-4">
                Les avantages de nos écrans<br />
                gonflables <span className="text-warm">sans souffleur</span> :
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-ivory">Solution économique</strong> : idéal pour ceux qui recherchent 
                  une option abordable sans équipement supplémentaire.
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-ivory">Mobilité</strong> : ces écrans sont faciles à transporter et à 
                  stocker, ce qui les rend parfaits pour des événements temporaires ou des locations.
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-ivory">Utilisation flexible</strong> : avec des tailles de toiles allant 
                  de 2m à 6m, il y a un écran adapté à chaque événement, qu'il soit petit ou grand.
                </li>
              </ul>

              <h4 className="text-lg font-semibold text-ivory mb-1">
                Caractéristiques des écrans<br />
                <span className="text-warm">sans souffleur :</span>
              </h4>
              <p className="text-ivory font-bold text-xl mb-6">Autoportant de 2m à 6m</p>

              {/* Tableau sans souffleur */}
              <h3 className="text-xl font-bold text-warm mb-4">Écrans Économiques sans Souffleur</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-warm/30">
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Taille globale</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Toile 4:3</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Poids</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Hauteur</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">Pers.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sansSouffleur.map((row, i) => (
                      <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                        <td className="py-3 px-2 text-ivory font-medium text-xs">{row.taille}</td>
                        <td className="py-3 px-2 text-white/70 text-xs">{row.toile}</td>
                        <td className="py-3 px-2 text-white/70 text-xs">{row.poids}</td>
                        <td className="py-3 px-2 text-white/70 text-xs">{row.hauteur}</td>
                        <td className="py-3 px-2 text-white/70 text-xs">{row.personnes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infos contact */}
      <section className="py-8 bg-charcoal-light">
        <div className="container text-center">
          <p className="text-white/60 text-sm">
            Mail : <a href="mailto:contact@hallucine.fr" className="text-warm hover:underline">contact@hallucine.fr</a>
            {" / "}Mobile : <a href="tel:+33680147694" className="text-warm hover:underline">+33 6 80 14 76 94</a>
            {" / "}Tel : <a href="tel:+33458212010" className="text-warm hover:underline">+33 4 58 21 20 10</a>
            {" / "}WhatsApp : <a href="https://wa.me/33680147694" className="text-warm hover:underline">+33 6 80 14 76 94</a>
          </p>
        </div>
      </section>

      {/* CTA — Vous organisez un événement ? */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Vous organisez un événement ?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Obtenez des solutions gonflables sur mesure pour votre événement en plein air. 
            Contactez-nous, demandez un devis rapide ou découvrez nos tarifs compétitifs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/contactez-nous" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demander un Devis
            </Link>
            <BrochureDownloadButton productSlug="ecran-economique" productName="Écran Économique" variant="compact" />
          </div>
        </div>
      </section>

      {/* Icônes garantie / ancre / souffleur */}
      <section className="py-10 bg-charcoal-light">
        <div className="container">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ZBLnaDLOhibqZTwD.png" alt="Ancre marine" className="w-16 h-16 object-contain" loading="lazy" />
              <p className="text-white/60 text-xs text-center">L'un des moins chers<br />au monde alliant robustesse</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/OQtINjKpErmTXqRM.png" alt="Garantie 1 an" className="w-16 h-16 object-contain" loading="lazy" />
              <p className="text-white/60 text-xs text-center">Garantie 1 an.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/yRObkNiXlvsgzhLl.png" alt="Souffleur" className="w-16 h-16 object-contain" loading="lazy" />
              <p className="text-white/60 text-xs text-center">Avec souffleur<br />&amp; Sans souffleur</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section finale — Images + texte */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-3 gap-4 mb-10">
            {imagesFinales.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ivory mb-4">Idéal pour tous vos événements</h2>
            <p className="text-white/70 max-w-3xl mx-auto leading-relaxed">
              Que ce soit pour un événement en plein air, une projection de film, ou un événement sportif, 
              nos écrans gonflables économiques sont conçus pour être simples à utiliser, solides, et abordables. 
              Profitez de vos événements en toute simplicité avec un écran de qualité professionnelle.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
