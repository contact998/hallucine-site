/*
 * Page Cinéma plein air — pilier d'intention SEO (« organiser un cinéma en plein
 * air »). Hub interne vers écrans / packs / location / accessoires. Contenu i18n
 * via le namespace « cinema-plein-air ». Cible l'intention (usage), pas le produit.
 */
import { Link } from "wouter";
import PageShell from "@/components/PageShell";
import { useTranslation } from "react-i18next";
import { ArrowRight, Monitor, Package, CalendarClock, Volume2, ChevronRight } from "lucide-react";
import PageStructuredData from "@/components/PageStructuredData";
import PagePhoto from "@/components/PagePhoto";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useRoutes } from "@/i18n/useRoutes";
import { useGallery } from "@/hooks/useSlot";
import type { RouteKey } from "@/i18n/routes";

const HUB: { id: string; icon: typeof Monitor; to: RouteKey }[] = [
  { id: "c1", icon: Monitor, to: "ecrans" },
  { id: "c2", icon: Package, to: "packs" },
  { id: "c3", icon: CalendarClock, to: "location" },
  { id: "c4", icon: Volume2, to: "accessoires" },
];
// Segments d'intention du cluster (maillage interne : pilier → segments).
const SEGMENTS: { id: string; to: RouteKey }[] = [
  { id: "seg_mairie", to: "mairie" },
  { id: "seg_hotel", to: "hotel" },
  { id: "seg_evenement", to: "evenement" },
  { id: "seg_prix", to: "prix" },
  { id: "seg_taille", to: "taille-ecran" },
  { id: "seg_securite", to: "securite-vent" },
];
const STEPS = ["s1", "s2", "s3", "s4"];
const FAQ = ["1", "2", "3", "4"];

export default function CinemaPleinAir() {
  const { t } = useTranslation("cinema-plein-air");
  const route = useRoutes();
  useDocumentMeta(t("meta_title"), t("meta_desc"));

  const bandeau = useGallery("cinema-plein-air:bandeau", [
    { src: "/img/location-evenement.jpg", alt: t("photo_alt") },
  ]);

  const faqs = FAQ.map((n) => ({ question: t(`q${n}`), answer: t(`a${n}`) }));

  return (
    <PageShell>
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("breadcrumb"), routeKey: "cinema-plein-air" },
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

      <PagePhoto src={bandeau[0]?.src ?? "/img/location-evenement.jpg"} alt={bandeau[0]?.alt ?? t("photo_alt")} />

      {/* Hub : tout le matériel (liens internes vers les pages produit) */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-3">{t("tout_title")}</h2>
          <p className="text-white/60 mb-10 max-w-2xl">{t("tout_desc")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HUB.map(({ id, icon: Icon, to }) => (
              <Link
                key={id}
                href={route(to)}
                className="group bg-card border border-border rounded-lg p-6 hover:border-warm/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-warm/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-warm" />
                </div>
                <h3 className="text-ivory font-semibold mb-2 flex items-center gap-1">
                  {t(`${id}_title`)}
                  <ChevronRight className="w-4 h-4 text-warm opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">{t(`${id}_desc`)}</p>
              </Link>
            ))}
          </div>

          {/* Par profil — maillage interne vers les pages segment */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold text-ivory mb-4">{t("seg_title")}</h3>
            <div className="flex flex-wrap gap-3">
              {SEGMENTS.map(({ id, to }) => (
                <Link
                  key={id}
                  href={route(to)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-card border border-border rounded-lg text-ivory text-sm hover:border-warm/40 transition-colors"
                >
                  {t(id)} <ChevronRight className="w-4 h-4 text-warm" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comment organiser */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-10">{t("how_title")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((id, i) => (
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
            {FAQ.map((n) => (
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
            <Link
              href={route("contact")}
              className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
            >
              {t("cta_devis")}
            </Link>
            <Link
              href={route("ecrans")}
              className="px-8 py-3 border border-warm/40 text-warm font-semibold rounded hover:bg-warm/10 transition-colors"
            >
              {t("cta_explore")}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
