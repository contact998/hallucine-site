/*
 * Page Location — louer un écran gonflable pour un événement ponctuel.
 * Tarifs indicatifs (benchmark marché + positionnement premium) ; conditions
 * finales par devis. Contenu i18n via le namespace « location ».
 */
import { Link } from "wouter";
import PageShell from "@/components/PageShell";
import { useTranslation } from "react-i18next";
import { ArrowRight, CalendarClock, Package, Feather } from "lucide-react";
import PageStructuredData from "@/components/PageStructuredData";
import PagePhoto from "@/components/PagePhoto";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useRoutes } from "@/i18n/useRoutes";
import { useGallery } from "@/hooks/useSlot";
import { formatNombre } from "@/lib/ecranFormat";

const RAISONS = [
  { id: "w1", icon: CalendarClock },
  { id: "w2", icon: Package },
  { id: "w3", icon: Feather },
];

const ETAPES = ["s1", "s2", "s3", "s4"];

/* Tarifs indicatifs de location, en € HT par événement.
 * À ajuster librement — point d'entrée unique pour la grille. */
const TARIFS_LOCATION = [
  { id: "t1", prix: 450 },
  { id: "t2", prix: 790 },
  { id: "t3", prix: 1290 },
  { id: "t4", prix: 2290 },
];

export default function Location() {
  const { t } = useTranslation("location");
  const route = useRoutes();
  useDocumentMeta(t("meta_title"), t("meta_desc"));

  const bandeau = useGallery("location:bandeau", [
    { src: "/img/location-evenement.jpg", alt: t("photo_alt") },
  ]);

  return (
    <PageShell>
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("breadcrumb"), routeKey: "location" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">
            {t("section_label")}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")}
          </h1>
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

      {/* Louer ou acheter */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-3">{t("why_title")}</h2>
          <p className="text-white/60 mb-10 max-w-2xl">{t("why_desc")}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {RAISONS.map(({ id, icon: Icon }) => (
              <div key={id} className="bg-card border border-border rounded-lg p-6">
                <div className="w-11 h-11 rounded-lg bg-warm/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-warm" />
                </div>
                <h3 className="text-ivory font-semibold mb-2">{t(`${id}_title`)}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{t(`${id}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs de location */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-3">{t("tarifs_title")}</h2>
          <p className="text-white/60 mb-10 max-w-2xl">{t("tarifs_desc")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TARIFS_LOCATION.map(({ id, prix }) => (
              <div
                key={id}
                className="flex flex-col bg-background border border-border rounded-xl p-6"
              >
                <h3 className="text-ivory font-semibold mb-1">{t(`${id}_title`)}</h3>
                <p className="text-warm text-sm font-medium mb-1">{t(`${id}_size`)}</p>
                <p className="text-white/50 text-sm mb-5">{t(`${id}_ecran`)}</p>
                <div className="mt-auto pt-4 border-t border-white/10">
                  <p className="text-white/45 text-xs">{t("prix_prefix")}</p>
                  <p className="text-2xl font-bold text-warm">
                    {formatNombre(prix)} € {t("ht")}
                  </p>
                  <p className="text-white/45 text-xs">{t("prix_suffix")}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs mt-6 max-w-3xl">{t("tarifs_note")}</p>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-10">{t("how_title")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ETAPES.map((id, i) => (
              <div key={id} className="bg-card border border-border rounded-lg p-6">
                <div className="w-9 h-9 rounded-full bg-warm/15 flex items-center justify-center mb-4">
                  <span className="text-warm font-bold">{i + 1}</span>
                </div>
                <h3 className="text-ivory font-semibold mb-2">{t(`${id}_title`)}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{t(`${id}_desc`)}</p>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs mt-6 max-w-3xl">{t("note")}</p>
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
              {t("cta_buy")}
            </Link>
          </div>
        </div>
      </section>

      </PageShell>
  );
}
