/*
 * IntentLandingPage — composant générique des pages d'intention SEO (prix,
 * segments : mairies, hôtels, événementiel…). Toute la structure est pilotée
 * par le namespace i18n passé en prop ; seuls les liens internes (cards `to`)
 * et la config varient par page. Évite la duplication entre pages similaires.
 *
 * Structure : hero → cartes (liens internes ou bénéfices) → étapes → FAQ → CTA.
 */
import { Link } from "wouter";
import PageShell from "@/components/PageShell";
import { useTranslation } from "react-i18next";
import { ArrowRight, type LucideIcon } from "lucide-react";
import PageStructuredData from "@/components/PageStructuredData";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useRoutes } from "@/i18n/useRoutes";
import type { RouteKey } from "@/i18n/routes";

export interface IntentCard {
  id: string;
  icon: LucideIcon;
  /** Clé de route → la carte devient un lien interne ; sinon carte d'info. */
  to?: RouteKey;
}

interface Props {
  namespace: string;
  routeKey: RouteKey;
  cards: IntentCard[];
  /** Clés des étapes (par défaut s1..s4). */
  steps?: string[];
  /** Nombre de questions FAQ (par défaut 4). */
  faqCount?: number;
}

export default function IntentLandingPage({
  namespace,
  routeKey,
  cards,
  steps = ["s1", "s2", "s3", "s4"],
  faqCount = 4,
}: Props) {
  const { t } = useTranslation(namespace);
  const route = useRoutes();
  useDocumentMeta(t("meta_title"), t("meta_desc"));

  const faqNums = Array.from({ length: faqCount }, (_, i) => String(i + 1));
  const faqs = faqNums.map((n) => ({ question: t(`q${n}`), answer: t(`a${n}`) }));

  return (
    <PageShell>
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("breadcrumb"), routeKey },
        ]}
        page={{ name: t("meta_title"), description: t("meta_desc") }}
        faqs={faqs}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
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

      {/* Cartes (liens internes ou bénéfices) */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-3">{t("tout_title")}</h2>
          <p className="text-white/60 mb-10 max-w-2xl">{t("tout_desc")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map(({ id, icon: Icon, to }) => {
              const inner = (
                <>
                  <div className="w-11 h-11 rounded-lg bg-warm/15 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-warm" />
                  </div>
                  <h3 className="text-ivory font-semibold mb-2">{t(`${id}_title`)}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{t(`${id}_desc`)}</p>
                </>
              );
              return to ? (
                <Link key={id} href={route(to)} className="bg-card border border-border rounded-lg p-6 hover:border-warm/40 transition-colors">
                  {inner}
                </Link>
              ) : (
                <div key={id} className="bg-card border border-border rounded-lg p-6">{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Étapes */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-10">{t("how_title")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((id, i) => (
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

      {/* FAQ */}
      <section className="py-20 bg-background">
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
      <section className="py-20 bg-charcoal-light">
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
