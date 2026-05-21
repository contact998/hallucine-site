/*
 * Page Études de cas — mises en situation des écrans gonflables Hallucine.
 * Format défi / solution / résultat. Contenu i18n via le namespace « etudes-cas ».
 */
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageStructuredData from "@/components/PageStructuredData";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useRoutes } from "@/i18n/useRoutes";

const CAS = ["c1", "c2", "c3"];

export default function EtudesCas() {
  const { t } = useTranslation("etudes-cas");
  const route = useRoutes();
  useDocumentMeta(t("meta_title"), t("meta_desc"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="etudes-cas-page"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: t("breadcrumb"), url: "https://hallucinecran.fr/etudes-de-cas" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
          url: "https://hallucinecran.fr/etudes-de-cas",
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">
            {t("section_label")}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">{t("hero_desc")}</p>
        </div>
      </section>

      {/* Études de cas */}
      <section className="py-16 bg-background">
        <div className="container">
          <p className="text-white/60 mb-12 max-w-2xl">{t("intro_desc")}</p>
          <div className="flex flex-col gap-8">
            {CAS.map((c) => (
              <article
                key={c}
                className="bg-card border border-border rounded-xl p-6 md:p-8"
              >
                <span className="inline-block px-3 py-1 rounded-full bg-warm/15 text-warm text-xs font-semibold uppercase tracking-wider mb-3">
                  {t(`${c}_tag`)}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-6">
                  {t(`${c}_title`)}
                </h2>

                {/* Chiffres clés */}
                <div className="grid grid-cols-3 gap-px bg-white/5 rounded-lg overflow-hidden mb-6">
                  {["1", "2", "3"].map((n) => (
                    <div key={n} className="bg-card p-4 text-center">
                      <p className="text-warm text-xl md:text-2xl font-bold">
                        {t(`${c}_s${n}v`)}
                      </p>
                      <p className="text-white/50 text-xs mt-1">{t(`${c}_s${n}l`)}</p>
                    </div>
                  ))}
                </div>

                {/* Défi / Solution / Résultat */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { label: t("defi_label"), text: t(`${c}_defi`) },
                    { label: t("solution_label"), text: t(`${c}_solution`) },
                    { label: t("resultat_label"), text: t(`${c}_resultat`) },
                  ].map((part) => (
                    <div key={part.label}>
                      <p className="text-warm text-sm font-semibold uppercase tracking-wider mb-2">
                        {part.label}
                      </p>
                      <p className="text-white/70 text-sm leading-relaxed">{part.text}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/65 mb-8 max-w-xl mx-auto">{t("cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={route("contact")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
            >
              {t("cta_devis")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={route("galerie")}
              className="px-8 py-3 border border-warm/40 text-warm font-semibold rounded hover:bg-warm/10 transition-colors"
            >
              {t("cta_gallery")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
