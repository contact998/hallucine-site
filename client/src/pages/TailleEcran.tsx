/*
 * TailleEcran — guide « quelle taille d'écran » (intention SEO type
 * « taille écran cinéma plein air »). L'abaque spectateurs → toile est
 * DÉRIVÉ de data/ecransConfigurateur (mêmes paliers et recommandations que
 * le configurateur) : aucune valeur dupliquée, la page suit les tarifs.
 */
import { Link } from "wouter";
import PageShell from "@/components/PageShell";
import { useTranslation } from "react-i18next";
import { ArrowRight, SlidersHorizontal, Euro, CalendarClock, Layers, type LucideIcon } from "lucide-react";
import PageStructuredData from "@/components/PageStructuredData";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useRoutes } from "@/i18n/useRoutes";
import type { RouteKey } from "@/i18n/routes";
import { PALIERS_AUDIENCE, recommander } from "@/data/ecransConfigurateur";

/** Règle indicative du recul max : 6 × largeur d'image (cf. section règles). */
const RECUL_LARGEURS = 6;

const LINKS: { id: string; icon: LucideIcon; to: RouteKey }[] = [
  { id: "l1", icon: SlidersHorizontal, to: "configurateur" },
  { id: "l2", icon: Euro, to: "prix" },
  { id: "l3", icon: CalendarClock, to: "location" },
  { id: "l4", icon: Layers, to: "ecrans" },
];

export default function TailleEcran() {
  const { t } = useTranslation("taille");
  const { t: tcfg } = useTranslation("configurateur");
  const { t: tc } = useTranslation("common");
  const route = useRoutes();
  useDocumentMeta(t("meta_title"), t("meta_desc"));

  // Une ligne d'abaque par palier d'audience, recommandation « extérieur ».
  const rows = PALIERS_AUDIENCE.map((palier) => {
    const { principal } = recommander(palier, "exterieur");
    return { palier, modele: principal, reculM: principal.toileLargeurM * RECUL_LARGEURS };
  });

  const faqNums = ["1", "2", "3", "4"];
  const faqs = faqNums.map((n) => ({ question: t(`q${n}`), answer: t(`a${n}`) }));

  return (
    <PageShell>
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("breadcrumb"), routeKey: "taille-ecran" },
        ]}
        page={{ name: t("meta_title"), description: t("meta_desc") }}
        faqs={faqs}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <Link href={route("cinema-plein-air")} className="inline-flex items-center gap-1 text-white/50 text-sm hover:text-warm transition-colors mb-4">
            ← {tc("footer.menu.cinema_plein_air")}
          </Link>
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("section_label")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">{t("hero_title")}</h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed mb-8">{t("hero_desc")}</p>
          <Link
            href={route("contact")}
            className="inline-flex items-center gap-2 px-7 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
          >
            {t("cta_devis")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Abaque spectateurs → taille */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-3">{t("table_title")}</h2>
          <p className="text-white/60 mb-10 max-w-2xl">{t("table_desc")}</p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-charcoal-light text-left">
                  <th className="px-4 py-3 text-warm text-xs font-semibold uppercase tracking-wider">{t("th_audience")}</th>
                  <th className="px-4 py-3 text-warm text-xs font-semibold uppercase tracking-wider">{t("th_toile")}</th>
                  <th className="px-4 py-3 text-warm text-xs font-semibold uppercase tracking-wider">{t("th_encombrement")}</th>
                  <th className="px-4 py-3 text-warm text-xs font-semibold uppercase tracking-wider">{t("th_gamme")}</th>
                  <th className="px-4 py-3 text-warm text-xs font-semibold uppercase tracking-wider">{t("th_recul")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ palier, modele, reculM }) => (
                  <tr key={palier.id} className="border-t border-white/10">
                    <td className="px-4 py-3 text-ivory font-semibold whitespace-nowrap">{tcfg(`audience_${palier.id}`)}</td>
                    <td className="px-4 py-3 text-white/70 whitespace-nowrap">{modele.toile}</td>
                    <td className="px-4 py-3 text-white/70 whitespace-nowrap">{modele.tailleHorsTout}</td>
                    <td className="px-4 py-3 text-white/70 whitespace-nowrap">{tcfg(`gamme_${modele.gamme}`)}</td>
                    <td className="px-4 py-3 text-white/70 whitespace-nowrap">{t("recul_approx", { m: reculM })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/40 text-xs mt-4 max-w-3xl">{t("table_note")}</p>
        </div>
      </section>

      {/* Règles de dimensionnement */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-10">{t("rules_title")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["r1", "r2", "r3"].map((id, i) => (
              <div key={id} className="bg-background border border-border rounded-lg p-6">
                <div className="w-9 h-9 rounded-full bg-warm/15 flex items-center justify-center mb-4">
                  <span className="text-warm font-bold">{i + 1}</span>
                </div>
                <h3 className="text-ivory font-semibold mb-2">{t(`${id}_title`)}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{t(`${id}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maillage interne */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-10">{t("links_title")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LINKS.map(({ id, icon: Icon, to }) => (
              <Link key={id} href={route(to)} className="bg-card border border-border rounded-lg p-6 hover:border-warm/40 transition-colors">
                <div className="w-11 h-11 rounded-lg bg-warm/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-warm" />
                </div>
                <h3 className="text-ivory font-semibold mb-2">{t(`${id}_title`)}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{t(`${id}_desc`)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-charcoal-light">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold text-ivory mb-10">{t("faq_title")}</h2>
          <div className="space-y-6">
            {faqNums.map((n) => (
              <div key={n} className="border-b border-white/10 pb-6">
                <h3 className="text-ivory font-semibold mb-2">{t(`q${n}`)}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{t(`a${n}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/65 mb-8 max-w-xl mx-auto">{t("cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={route("contact")} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_devis")}
            </Link>
            <Link href={route("ecrans")} className="px-8 py-3 border border-warm/40 text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              {t("cta_explore")}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
