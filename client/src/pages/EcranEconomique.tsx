/*
 * Page Écran Gonflable Économique
 * Contenu i18n via namespace "ecran-economique"
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import ProductPageShell from "@/components/product/ProductPageShell";
import { useRoutes } from "@/i18n/useRoutes";
import { useProductImages } from "@/hooks/useProductImages";
import EmailLink from "@/components/EmailLink";
import ZoomImage from "@/components/ZoomImage";

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

const FALLBACK_AVEC_SOUFFLEUR = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/WXsnQMOOUttRbUlr.webp", alt: "Écran économique avec souffleur installé dans la cour d'un bâtiment" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/qoINhxiIteIjBXYG.webp", alt: "Écran économique avec souffleur pour un petit public" },
];

const FALLBACK_SANS_SOUFFLEUR = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/BBvWfAFjPlbvBnAE.webp", alt: "Écran économique sans souffleur installé dans un parc" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/IhxDeQNxHxMYBwlG.webp", alt: "Écran économique sans souffleur sur la plage" },
];

const FALLBACK_FINALES = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/QClDxPadLVEYKlxM.webp", alt: "Écran économique comparaison de taille humaine" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/hzkcpmfnpyIExDbf.webp", alt: "Écran économique vue de derrière" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/WXsnQMOOUttRbUlr.webp", alt: "Écran économique installé en extérieur" },
];

// ─── Mini carousel ─────────────────────────────────────────────────────────────
function ImageCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-black/20 mb-6">
      <img src={images[idx].src} alt={images[idx].alt} className="w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" width={1200} height={700} />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors" aria-label="Image précédente">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors" aria-label="Image suivante">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === idx ? "bg-warm" : "bg-white/40"}`} aria-label={`Image ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export default function EcranEconomique() {
  const route = useRoutes();
  const { t } = useTranslation("ecran-economique");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/WXsnQMOOUttRbUlr.webp");
  const allDbImages = useProductImages("ecran-economique", [
    ...FALLBACK_AVEC_SOUFFLEUR,
    ...FALLBACK_SANS_SOUFFLEUR,
    ...FALLBACK_FINALES,
  ]);
  const imagesAvecSouffleur = allDbImages.length > 0 ? allDbImages.slice(0, 2) : FALLBACK_AVEC_SOUFFLEUR;
  const imagesSansSouffleur = allDbImages.length > 0 ? allDbImages.slice(2, 4) : FALLBACK_SANS_SOUFFLEUR;
  const imagesFinales = allDbImages.length > 0 ? allDbImages.slice(4) : FALLBACK_FINALES;

  return (
    <ProductPageShell withCountdown relatedProductsKey="ecran-economique">
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: "Ecrans Gonflables", routeKey: "ecrans" },
          { name: "Écran Économique", routeKey: "ecran-economique" },
        ]}
        product={{
          name: "Écrans Gonflables Économiques",
          description: "Nos écrans gonflables économiques sont la solution idéale pour des événements à petit budget sans compromis sur la qualité.",
          image: [
            "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/WXsnQMOOUttRbUlr.webp",
            "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/qoINhxiIteIjBXYG.webp",
            "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/BBvWfAFjPlbvBnAE.webp",
            "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/IhxDeQNxHxMYBwlG.webp",
            "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/QClDxPadLVEYKlxM.webp",
            "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/hzkcpmfnpyIExDbf.webp",
          ],
          category: "Ecrans Gonflables",
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")} <span className="text-warm">{t("hero_title_colored")}</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-ivory/90 mb-6">
            {t("hero_h2")}
          </h2>
          <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
            {t("hero_p")}
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
                {t("with_blower_title")}<br />
                <span className="text-warm">{t("with_blower_colored")}</span>
              </h2>
              <ImageCarousel images={imagesAvecSouffleur} />
              <p className="text-white/70 leading-relaxed mb-6">{t("with_blower_desc")}</p>
              <h3 className="text-xl font-bold text-ivory mb-4">
                {t("with_blower_adv_title")}<br />
                gonflables <span className="text-warm">{t("with_blower_adv_colored")} :</span>
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-ivory">{t("with_blower_adv1_bold")}</strong> : {t("with_blower_adv1")}
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-ivory">{t("with_blower_adv2_bold")}</strong> : {t("with_blower_adv2")}
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-ivory">{t("with_blower_adv3_bold")}</strong> : {t("with_blower_adv3")}
                </li>
              </ul>
              <h4 className="text-lg font-semibold text-ivory mb-1">
                {t("with_blower_specs_title")}<br />
                <span className="text-warm">{t("with_blower_specs_colored")}</span>
              </h4>
              <p className="text-ivory font-bold text-xl mb-6">{t("with_blower_range")}</p>
              <h3 className="text-xl font-bold text-warm mb-4">{t("with_blower_table_title")}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-warm/30">
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">{t("specs_col_size")}</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">{t("specs_col_screen")}</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">{t("specs_col_weight")}</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">{t("specs_col_height")}</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">{t("specs_col_persons")}</th>
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
                {t("without_blower_title")}<br />
                <span className="text-warm">{t("without_blower_colored")}</span>
              </h2>
              <ImageCarousel images={imagesSansSouffleur} />
              <p className="text-white/70 leading-relaxed mb-6">{t("without_blower_desc")}</p>
              <h3 className="text-xl font-bold text-ivory mb-4">
                {t("without_blower_adv_title")}<br />
                gonflables <span className="text-warm">{t("without_blower_adv_colored")} :</span>
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-ivory">{t("without_blower_adv1_bold")}</strong> : {t("without_blower_adv1")}
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-ivory">{t("without_blower_adv2_bold")}</strong> : {t("without_blower_adv2")}
                </li>
                <li className="text-white/70 leading-relaxed">
                  <strong className="text-ivory">{t("without_blower_adv3_bold")}</strong> : {t("without_blower_adv3")}
                </li>
              </ul>
              <h4 className="text-lg font-semibold text-ivory mb-1">
                {t("without_blower_specs_title")}<br />
                <span className="text-warm">{t("without_blower_specs_colored")}</span>
              </h4>
              <p className="text-ivory font-bold text-xl mb-6">{t("without_blower_range")}</p>
              <h3 className="text-xl font-bold text-warm mb-4">{t("without_blower_table_title")}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-warm/30">
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">{t("specs_col_size")}</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">{t("specs_col_screen")}</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">{t("specs_col_weight")}</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">{t("specs_col_height")}</th>
                      <th className="text-left py-3 px-2 text-warm font-semibold text-xs">{t("specs_col_persons")}</th>
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
            Mail : <EmailLink className="text-warm hover:underline" />
            {" / "}Tel : <a href="tel:+33458212010" className="text-warm hover:underline">+33 4 58 21 20 10</a>
            {" / "}<a href="https://wa.me/33680147694" target="_blank" rel="noopener noreferrer" className="text-warm hover:underline">WhatsApp</a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">{t("cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={route('contact')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_contact")}
            </Link>
            <Link href={route('contact')} className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              {t("cta_devis")}
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
              <img src="https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/wXQjDSVfzojKfGxl.webp" alt="Ancre marine" className="w-16 h-16 object-contain" loading="lazy" decoding="async" />
              <p className="text-white/60 text-xs text-center">{t("icon1_label")}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src="https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/YplQWxdVdPyLKIiY.webp" alt="Garantie 1 an" className="w-16 h-16 object-contain" loading="lazy" decoding="async" />
              <p className="text-white/60 text-xs text-center">{t("icon2_label")}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src="https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ZUADZwnRzRLzkrrt.webp" alt="Souffleur" className="w-16 h-16 object-contain" loading="lazy" decoding="async" />
              <p className="text-white/60 text-xs text-center">{t("icon3_label")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section finale */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {imagesFinales.map((img, i) => (
              <ZoomImage key={i} src={img.src} alt={img.alt} gallery={imagesFinales} index={i} wrapperClassName="relative aspect-[4/3] rounded-lg" className="w-full h-full object-cover" width={800} height={500} />
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ivory mb-4">{t("final_title")}</h2>
            <p className="text-white/70 max-w-3xl mx-auto leading-relaxed">{t("final_desc")}</p>
          </div>
        </div>
      </section>

    </ProductPageShell>
  );
}
