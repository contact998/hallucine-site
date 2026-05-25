/*
 * Page Hub Tentes, Arches & Mobilier
 * Redirige vers les sous-pages spécifiques
 */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import PagePhoto from "@/components/PagePhoto";
import ProductPageShell from "@/components/product/ProductPageShell";
import ProductHero from "@/components/product/ProductHero";
import ProductButton from "@/components/product/ProductButton";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";

export default function Tentes() {
  const route = useRoutes();
  const { t } = useTranslation("tentes");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/TVmrusoKmXcTvkKP.webp");

  const categories = [
    { title: t("c1_title"), desc: t("c1_desc"), href: route("tente-x") },
    { title: t("c2_title"), desc: t("c2_desc"), href: route("tente-n") },
    { title: t("c3_title"), desc: t("c3_desc"), href: route("tente-v") },
    { title: t("c4_title"), desc: t("c4_desc"), href: route("tente-araignee") },
    { title: t("c5_title"), desc: t("c5_desc"), href: route("arches") },
    { title: t("c6_title"), desc: t("c6_desc"), href: route("mobilier") },
  ];

  const avantages = [
    { title: t("av1_title"), desc: t("av1_desc") },
    { title: t("av2_title"), desc: t("av2_desc") },
    { title: t("av3_title"), desc: t("av3_desc") },
    { title: t("av4_title"), desc: t("av4_desc") },
  ];

  return (
    <ProductPageShell relatedProductsKey="tentes">
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("meta_title"), routeKey: "tentes" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
        }}
      />

      <ProductHero
        eyebrow={t("section_label")}
        title={t("hero_title")}
        coloredPart={t("hero_colored")}
      >
        <p>{t("hero_desc")}</p>
      </ProductHero>

      <PagePhoto src="/img/tente-salon.jpg" alt={t("photo_alt")} />

      {/* Grille des catégories */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group p-8 bg-card border border-border rounded-lg card-hover block"
              >
                <h2 className="text-xl font-bold text-ivory mb-3 group-hover:text-warm transition-colors">
                  {cat.title}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{cat.desc}</p>
                <span className="inline-flex items-center gap-2 text-warm text-sm font-medium">
                  {t("voir_details")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages communs */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("avantages_title")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {avantages.map((item) => (
              <div key={item.title} className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-warm font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
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
            <ProductButton href={route('contact')} variant="primary">{t("cta_contact")}</ProductButton>
            <ProductButton href={route('contact')} variant="secondary">{t("cta_prix")}</ProductButton>
          </div>
        </div>
      </section>
    </ProductPageShell>
  );
}
