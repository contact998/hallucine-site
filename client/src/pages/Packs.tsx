/*
 * Page Packs — solutions cinéma plein air clé en main.
 * Trois packs par taille d'événement ; prix de l'écran réel (tarif 2026),
 * pack complet sur devis. Contenu i18n via le namespace « packs ».
 */
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageStructuredData from "@/components/PageStructuredData";
import PagePhoto from "@/components/PagePhoto";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useRoutes } from "@/i18n/useRoutes";
import { formatNombre } from "@/lib/ecranFormat";

/* Prix de pack = AIRSCREEN Outdoor Movie System (Economy) + 7 %.
 * Point d'entrée unique de la grille — à ajuster librement. */
const PACKS = [
  { id: "petit", prix: 7900, inc: ["inc1", "inc2", "inc3", "inc4"] },
  { id: "moyen", prix: 13500, inc: ["inc1", "inc2", "inc3", "inc4"] },
  { id: "grand", prix: 35200, inc: ["inc1", "inc2", "inc3", "inc4", "inc5"] },
];

export default function Packs() {
  const { t } = useTranslation("packs");
  const route = useRoutes();
  useDocumentMeta(t("meta_title"), t("meta_desc"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="packs-page"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: t("breadcrumb"), url: "https://hallucinecran.fr/pack-cinema-plein-air" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
          url: "https://hallucinecran.fr/pack-cinema-plein-air",
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

      <PagePhoto src="/img/pack-cinema-plein-air.jpg" alt={t("photo_alt")} />

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("intro_title")}</h2>
          <p className="text-white/70 leading-relaxed">{t("intro_desc")}</p>
        </div>
      </section>

      {/* Les 3 packs */}
      <section className="py-12 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-10">{t("packs_title")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PACKS.map((pack) => {
              return (
                <div
                  key={pack.id}
                  className="flex flex-col bg-card border border-border rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold text-ivory mb-1">{t(`${pack.id}_title`)}</h3>
                  <p className="text-warm text-sm font-medium mb-3">{t(`${pack.id}_size`)}</p>
                  <p className="text-white/60 text-sm leading-relaxed mb-5">
                    {t(`${pack.id}_desc`)}
                  </p>

                  <p className="text-white/45 text-xs uppercase tracking-wider mb-3">
                    {t("inclus_label")}
                  </p>
                  <ul className="flex flex-col gap-2 mb-6">
                    {pack.inc.map((key) => (
                      <li key={key} className="flex items-start gap-2 text-sm text-white/80">
                        <Check className="w-4 h-4 text-warm shrink-0 mt-0.5" />
                        {t(`${pack.id}_${key}`)}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5 border-t border-white/10">
                    <p className="text-white/45 text-xs">{t("prix_prefix")}</p>
                    <p className="text-2xl font-bold text-warm">
                      {formatNombre(pack.prix)} € {t("ht")}
                    </p>
                    <p className="text-white/45 text-xs mb-4">{t("prix_caption")}</p>
                    <Link
                      href={route("contact")}
                      className="inline-flex items-center gap-2 w-full justify-center px-5 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
                    >
                      {t("cta_devis")} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-white/40 text-xs mt-6 max-w-3xl">{t("note")}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/65 mb-8 max-w-xl mx-auto">{t("cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={route("contact")}
              className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
            >
              {t("cta_devis")}
            </Link>
            <Link
              href={route("configurateur")}
              className="px-8 py-3 border border-warm/40 text-warm font-semibold rounded hover:bg-warm/10 transition-colors"
            >
              {t("cta_config")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
