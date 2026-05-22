/*
 * Page Accessoires
 * Images chargées depuis media_library (category: "produits", subcategory: "accessoires")
 * Fallback automatique sur les URLs hardcodées si la DB ne répond pas
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Headphones, Armchair, Radio, Sofa, Monitor, Package } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";
import { RelatedProducts } from "@/components/RelatedProducts";
import { useProductImages } from "@/hooks/useProductImages";

// ─── Fallback hardcodé — ne jamais supprimer ──────────────────────────────────

const FALLBACK_ACCESSOIRES = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/wNIxhZRwHKCxifIM.webp", alt: "Casques audio sans fil pour cinéma en plein air" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/EuKdMCwdXBJSlNeL.webp", alt: "Transats gonflables pour événement cinéma" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/iVwKLqZcDAZHqcQS.webp", alt: "Transmetteur FM pour cinéma drive-in" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/gvHeJxbdjQzzfoZe.webp", alt: "Canapé gonflable pour événement" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/wpkWdAtohcYNVAzC.webp", alt: "Cabine de projection mobile" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/DWwZRSyIwFxpRLoR.webp", alt: "Forfait AV complet pour événement" },
];

export default function Accessoires() {
  const route = useRoutes();
  const { t } = useTranslation("accessoires");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/wNIxhZRwHKCxifIM.webp");

  // Charger les images depuis la DB
  const images = useProductImages("accessoires", FALLBACK_ACCESSOIRES);

  const accessoires = [
    {
      icon: Headphones,
      title: t("a1_title"),
      img: images[0]?.src ?? FALLBACK_ACCESSOIRES[0].src,
      alt: images[0]?.alt ?? FALLBACK_ACCESSOIRES[0].alt,
      desc: t("a1_desc"),
    },
    {
      icon: Armchair,
      title: t("a2_title"),
      img: images[1]?.src ?? FALLBACK_ACCESSOIRES[1].src,
      alt: images[1]?.alt ?? FALLBACK_ACCESSOIRES[1].alt,
      desc: t("a2_desc"),
    },
    {
      icon: Radio,
      title: t("a3_title"),
      img: images[2]?.src ?? FALLBACK_ACCESSOIRES[2].src,
      alt: images[2]?.alt ?? FALLBACK_ACCESSOIRES[2].alt,
      desc: t("a3_desc"),
    },
    {
      icon: Sofa,
      title: t("a4_title"),
      img: images[3]?.src ?? FALLBACK_ACCESSOIRES[3].src,
      alt: images[3]?.alt ?? FALLBACK_ACCESSOIRES[3].alt,
      desc: t("a4_desc"),
    },
    {
      icon: Monitor,
      title: t("a5_title"),
      img: images[4]?.src ?? FALLBACK_ACCESSOIRES[4].src,
      alt: images[4]?.alt ?? FALLBACK_ACCESSOIRES[4].alt,
      desc: t("a5_desc"),
    },
    {
      icon: Package,
      title: t("a6_title"),
      img: images[5]?.src ?? FALLBACK_ACCESSOIRES[5].src,
      alt: images[5]?.alt ?? FALLBACK_ACCESSOIRES[5].alt,
      desc: t("a6_desc"),
      bgWhite: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="accessoires-page"
        breadcrumbs={[{ name: "Accueil", url: "https://hallucinecran.fr/" }, { name: t("meta_title"), url: "https://hallucinecran.fr/accessoire-cinema-plein-air" }]}
        product={{
          name: t("meta_title"),
          description: t("hero_desc"),
          image: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/wNIxhZRwHKCxifIM.webp",
          url: "https://hallucinecran.fr/accessoire-cinema-plein-air",
          category: t("section_label"),
          minPrice: 99,
        }}
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
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            {t("hero_desc")}
          </p>
        </div>
      </section>

      {/* Grille accessoires */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accessoires.map((a) => (
              <div key={a.title} className="bg-card border border-border rounded-lg overflow-hidden card-hover">
                <div className={`aspect-[4/3] ${a.bgWhite ? 'bg-white' : 'bg-charcoal-light'}`}>
                  <img src={a.img} alt={a.alt} className="w-full h-full object-contain p-4" loading="lazy" decoding="async" width={300} height={300} />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <a.icon className="w-6 h-6 text-warm" />
                    <h2 className="text-xl font-bold text-ivory">{a.title}</h2>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forfaits détaillés */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("forfaits_title")}</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl">
            {t("forfaits_desc")}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">{t("f1_title")}</h3>
              <p className="text-white/60 text-sm mb-2">{t("f1_size")}</p>
              <p className="text-white/60 text-sm leading-relaxed">{t("f1_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">{t("f2_title")}</h3>
              <p className="text-white/60 text-sm mb-2">{t("f2_size")}</p>
              <p className="text-white/60 text-sm leading-relaxed">{t("f2_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">{t("f3_title")}</h3>
              <p className="text-white/60 text-sm mb-2">{t("f3_size")}</p>
              <p className="text-white/60 text-sm leading-relaxed">{t("f3_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            {t("cta_desc")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={route('contact')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_contact")}
            </Link>
            <Link href={route('contact')} className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              {t("cta_devis")}
            </Link>
          </div>
        </div>
      </section>

      <RelatedProducts currentPage="accessoires" />
      <Footer />
    </div>
  );
}
