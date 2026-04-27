/*
 * Page Hub Tentes, Arches & Mobilier
 * Redirige vers les sous-pages spécifiques
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";
import { RelatedProducts } from "@/components/RelatedProducts";

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
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="tentes-hub-page"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: t("meta_title"), url: "https://hallucinecran.fr/tentes-gonflables" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
          url: "https://hallucinecran.fr/tentes-gonflables",
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("section_label")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")}<br />
            <span className="text-warm">{t("hero_colored")}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            {t("hero_desc")}
          </p>
        </div>
      </section>

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
            <Link href={route('contact')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_contact")}
            </Link>
            <Link href={route('contact')} className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              {t("cta_prix")}
            </Link>
          </div>
        </div>
      </section>

      <RelatedProducts currentPage="tentes" />
      <Footer />
    </div>
  );
}
