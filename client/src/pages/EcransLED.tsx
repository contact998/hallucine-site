/*
 * Page Écrans LED — En construction
 * Design: cinéma vintage — fond sombre, accents dorés
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Construction } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";
import { RelatedProducts } from "@/components/RelatedProducts";

const ledImages = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/cNgCebtnqSvVUvmF.webp", alt: "Écran LED gonflable Hallucine de 5m pour projection de jour comme de nuit" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/dAPzbTqdeJCYzZGT.webp", alt: "Écran LED gonflable Hallucine de 4m avec haute luminosité pour événements" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/eqozEqSIUbdLwesq.webp", alt: "Démonstration du montage rapide d'un écran LED gonflable Hallucine en extérieur" },
];

export default function EcransLED() {
  const route = useRoutes();
  const { t } = useTranslation("ecrans-led");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/cNgCebtnqSvVUvmF.webp");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="ecrans-led"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: t("breadcrumb"), url: "https://hallucinecran.fr/ecrans-led" }
        ]}
        product={{
          name: t("meta_title"),
          description: t("hero_desc"),
          image: ledImages.map(img => img.src),
          url: "https://hallucinecran.fr/ecrans-led",
          category: "Écrans LED",
          minPrice: 4990,
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("badge")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")}{" "}<br />
            <span className="text-warm">{t("hero_subtitle")}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            {t("hero_desc")}
          </p>
        </div>
      </section>

      {/* Images */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            {ledImages.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : undefined} decoding="async" width={800} height={500} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="text-white text-xs p-3 opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* En construction */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <Construction className="w-16 h-16 text-warm mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("wip_title")}</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto leading-relaxed">
            {t("wip_desc")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={route('contact')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("btn_contact")}
            </Link>
            <Link href={route('contact')} className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              {t("btn_devis")}
            </Link>
          </div>
        </div>
      </section>

      <RelatedProducts currentPage="ecrans-led" />
      <Footer />
    </div>
  );
}
