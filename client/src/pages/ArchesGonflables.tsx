/*
 * Page Arches Gonflables
 * Contenu i18n via namespace "arches-gonflables"
 */
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useRoutes } from "@/i18n/useRoutes";
import { RelatedProducts } from "@/components/RelatedProducts";
import { useProductImages } from "@/hooks/useProductImages";
import ZoomImage from "@/components/ZoomImage";

const archesData = [
  { ref: "CA-4/2.6/0.45", taille: "400×260(H)×45cm" },
  { ref: "CA-5/3.2/0.6", taille: "500×320(H)×60cm" },
  { ref: "CA-6/3.8/0.6", taille: "600×380(H)×60cm" },
  { ref: "CA-6/3.8/0.8", taille: "600×380(H)×80cm" },
  { ref: "CA-8/4.6/0.8", taille: "800×460(H)×80cm" },
  { ref: "CA-8/4.8/0.9", taille: "800×480(H)×90cm" },
  { ref: "CA-10/4.8/0.8", taille: "1000×480(H)×80cm" },
  { ref: "CA-10/4.8/0.9", taille: "1000×480(H)×90cm" },
  { ref: "CA-10/5.8/0.9", taille: "1000×580(H)×90cm" },
  { ref: "CA-12/4.8/0.9", taille: "1200×480(H)×90cm" },
  { ref: "CA-12/5.8/0.9", taille: "1200×580(H)×90cm" },
];

const FALLBACK_IMAGES_ARCHES = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/media/1779598775656-fc81abf1ffda-arche-arrivee-course-coureurs-medailles.png", alt: "Arche gonflable colorée arrivée de course avec coureurs et médailles" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/media/1779598801205-e8f080a6d539-arche-hallucine-grise-personnalisee-even.jpg", alt: "Arche gonflable Hallucine grise personnalisable pour événement professionnel" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/media/1779598798314-49b23fc891cb-arche-entree-projection-cinema-plein-air.webp", alt: "Arche gonflable Entrée Projection pour cinéma en plein air" },
];

export default function ArchesGonflables() {
  const route = useRoutes();
  const { t } = useTranslation("arches-gonflables");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/og-accueil-KjTW2K29SHyinVRpsNcnQC.png");
  const galleryImages = useProductImages("arches-gonflables", FALLBACK_IMAGES_ARCHES);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqItems = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
  ];

  const accessoires = [
    { ref: "CA-EP", nom: t("acc1_name"), desc: t("acc1_desc") },
    { ref: "CA-HP", nom: t("acc2_name"), desc: t("acc2_desc") },
    { ref: "CA-ACC-1", nom: t("acc3_name"), desc: t("acc3_desc") },
    { ref: "CA-ACC-2", nom: t("acc4_name"), desc: t("acc4_desc") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: "Structures gonflables", routeKey: "home" },
          { name: "Arches Gonflables", routeKey: "arches" },
        ]}
        product={{
          name: "Arches Gonflables Personnalisées pour Événements",
          description: "Les arches gonflables sont des éléments incontournables pour vos événements sportifs, expositions, et campagnes promotionnelles.",
          image: galleryImages.map(img => img.src),
          category: "Structures gonflables",
          minPrice: 790,
        }}
        faqs={faqItems.map(item => ({ question: item.q, answer: item.a }))}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("section_label")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")}{" "}<br />
            <span className="text-warm">{t("hero_colored")}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">{t("hero_desc")}</p>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("gallery_title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <ZoomImage
                key={i}
                src={img.src}
                alt={img.alt}
                wrapperClassName="relative aspect-[4/3] rounded-lg"
                className="w-full h-full object-cover"
                width={800}
                height={500}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modèles */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("models_title")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">{t("model1_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("model1_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">{t("model2_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("model2_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">{t("model3_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("model3_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gamme + FAQ */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-10 items-center">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-ivory mb-4">
                {t("range_title")} <span className="text-warm">{t("range_colored")}</span>
              </h2>
              <p className="text-white/60 mb-2 text-sm">{t("range_note1")}</p>
              <p className="text-white/60 mb-6 text-sm">{t("range_note2")}</p>
              <div className="grid grid-cols-2 gap-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-warm/30">
                      <th className="text-left py-3 px-3 text-warm font-semibold">{t("col_ref")}</th>
                      <th className="text-left py-3 px-3 text-warm font-semibold">{t("col_size")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archesData.slice(0, 6).map((row, i) => (
                      <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 text-ivory font-medium text-xs">{row.ref}</td>
                        <td className="py-2 px-3 text-white/70 text-xs">{row.taille}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-warm/30">
                      <th className="text-left py-3 px-3 text-warm font-semibold">{t("col_ref")}</th>
                      <th className="text-left py-3 px-3 text-warm font-semibold">{t("col_size")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archesData.slice(6).map((row, i) => (
                      <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 text-ivory font-medium text-xs">{row.ref}</td>
                        <td className="py-2 px-3 text-white/70 text-xs">{row.taille}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-6">
                {t("faq_title")} <span className="text-warm">{t("faq_colored")}</span>
              </h2>
              <div className="space-y-3">
                {faqItems.map((item, i) => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-ivory font-medium text-sm pr-3">{item.q}</span>
                      <ChevronDown className={`w-4 h-4 text-warm shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4">
                        <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessoires */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("accessories_title")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-3xl">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("acc_col_ref")}</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("acc_col_name")}</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("acc_col_desc")}</th>
                </tr>
              </thead>
              <tbody>
                {accessoires.map((a, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-ivory font-medium">{a.ref}</td>
                    <td className="py-3 px-3 text-white/70">{a.nom}</td>
                    <td className="py-3 px-3 text-white/60 text-xs">{a.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Caractéristiques techniques */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-6">
                {t("tech_title")} <span className="text-warm">{t("tech_colored")}</span>
              </h2>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-warm/10 text-warm flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M8 9l-1 1m8 8l1-1M9 16l-1-1M15 9l1 1" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ivory">{t("tech1_title")}</h4>
                    <p className="text-sm">{t("tech1_desc")}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-warm/10 text-warm flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ivory">{t("tech2_title")}</h4>
                    <p className="text-sm">{t("tech2_desc")}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-warm/10 text-warm flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ivory">{t("tech3_title")}</h4>
                    <p className="text-sm">{t("tech3_desc")}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img src="https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/media/1779598801205-e8f080a6d539-arche-hallucine-grise-personnalisee-even.jpg" alt="Arche gonflable Hallucine grise personnalisable pour événement professionnel" className="w-full h-full object-cover" loading="lazy" decoding="async" width={800} height={500} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">{t("cta_desc")}</p>
          <Link href={route('contact')} className="inline-block bg-warm text-charcoal-dark font-semibold py-3 px-8 rounded-lg hover:bg-warm/90 transition-colors">
            {t("cta_devis")}
          </Link>
        </div>
      </section>

      <RelatedProducts currentPage="arches" />
      <Footer />
    </div>
  );
}
