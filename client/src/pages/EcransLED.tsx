/*
 * Page Écrans LED — En construction
 * Design: cinéma vintage — fond sombre, accents dorés
 */
import { Construction } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import PageShell from "@/components/PageShell";
import ProductHero from "@/components/product/ProductHero";
import ProductButton from "@/components/product/ProductButton";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";
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
    <PageShell relatedProductsKey="ecrans-led">
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

      <ProductHero
        eyebrow={t("badge")}
        title={t("hero_title")}
        coloredPart={t("hero_subtitle")}
      >
        <p>{t("hero_desc")}</p>
      </ProductHero>

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
            <ProductButton href={route('contact')} variant="primary">{t("btn_contact")}</ProductButton>
            <ProductButton href={route('contact')} variant="secondary">{t("btn_devis")}</ProductButton>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
