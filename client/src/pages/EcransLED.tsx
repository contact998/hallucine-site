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
import ZoomImage from "@/components/ZoomImage";

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
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("breadcrumb"), routeKey: "ecrans-led" }
        ]}
        product={{
          name: t("meta_title"),
          description: t("hero_desc"),
          image: ledImages.map(img => img.src),
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
              <ZoomImage key={i} src={img.src} alt={img.alt} gallery={ledImages} index={i} wrapperClassName="relative aspect-[4/3] rounded-lg" className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} width={800} height={500} />
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
