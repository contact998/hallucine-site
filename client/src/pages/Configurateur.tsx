/*
 * Configurateur — sélecteur compact d'écran gonflable.
 * L'utilisateur choisit une audience et un usage ; la fiche du modèle
 * recommandé (specs + prix HT 2026) se met à jour en direct.
 * Contenu i18n via le namespace « configurateur ».
 */
import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Home, Sun, Car, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageStructuredData from "@/components/PageStructuredData";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useRoutes } from "@/i18n/useRoutes";
import {
  PALIERS_AUDIENCE,
  recommander,
  type UsageConfig,
} from "@/data/ecransConfigurateur";
import { formatNombre, formatMontage, formatPersonnes } from "@/lib/ecranFormat";

const USAGES: { id: UsageConfig; icon: typeof Home }[] = [
  { id: "interieur", icon: Home },
  { id: "exterieur", icon: Sun },
  { id: "drive-in", icon: Car },
];

export default function Configurateur() {
  const { t } = useTranslation("configurateur");
  const route = useRoutes();
  useDocumentMeta(t("meta_title"), t("meta_desc"));

  const [palierId, setPalierId] = useState("p3");
  const [usage, setUsage] = useState<UsageConfig>("exterieur");

  const palier = PALIERS_AUDIENCE.find((p) => p.id === palierId) ?? PALIERS_AUDIENCE[2];
  const reco = recommander(palier, usage);
  const principal = reco.principal;
  const gammeRoute = principal.gamme === "etanche" ? "ecran-etanche" : "ecran-geant";

  const formatPrix = (n: number) => `${formatNombre(n)} € ${t("ht")}`;

  const specs = [
    { label: t("spec_toile"), value: principal.toile },
    { label: t("spec_poids"), value: `${principal.poidsKg} kg` },
    { label: t("spec_hauteur"), value: `${String(principal.hauteurBaseImageM).replace(".", ",")} m` },
    { label: t("spec_montage"), value: formatMontage(principal.montageMinutes) },
    { label: t("spec_personnes"), value: formatPersonnes(principal) },
    { label: t("spec_garantie"), value: t("garantie_value", { n: principal.garantieAns }) },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="configurateur-page"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: t("breadcrumb"), url: "https://hallucinecran.fr/configurateur-ecran-gonflable" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
          url: "https://hallucinecran.fr/configurateur-ecran-gonflable",
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">
            {t("section_label")}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-ivory leading-tight mb-5">
            {t("hero_title")}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">{t("hero_desc")}</p>
        </div>
      </section>

      {/* Configurateur */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_1.25fr] gap-6 lg:gap-8 items-start">
            {/* Panneau de choix */}
            <div className="bg-card border border-border rounded-xl p-6">
              {/* Audience */}
              <fieldset className="mb-8">
                <legend className="text-warm text-sm font-semibold uppercase tracking-wider mb-4">
                  {t("q_audience")}
                </legend>
                <div className="flex flex-col gap-2">
                  {PALIERS_AUDIENCE.map((p) => {
                    const selected = p.id === palierId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPalierId(p.id)}
                        aria-pressed={selected}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                          selected
                            ? "bg-warm/15 border-warm text-ivory"
                            : "border-white/10 text-white/70 hover:border-warm/40 hover:text-white"
                        }`}
                      >
                        {t(`audience_${p.id}`)}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Usage */}
              <fieldset>
                <legend className="text-warm text-sm font-semibold uppercase tracking-wider mb-4">
                  {t("q_usage")}
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {USAGES.map(({ id, icon: Icon }) => {
                    const selected = id === usage;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setUsage(id)}
                        aria-pressed={selected}
                        className={`flex flex-col items-center gap-2 px-2 py-4 rounded-lg border text-sm font-medium transition-colors ${
                          selected
                            ? "bg-warm/15 border-warm text-ivory"
                            : "border-white/10 text-white/70 hover:border-warm/40 hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {t(`usage_${id}`)}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            {/* Résultat */}
            <div className="bg-charcoal-light border border-warm/20 rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-warm/15 text-warm text-xs font-semibold uppercase tracking-wider">
                  {t(`gamme_${principal.gamme}`)}
                </span>
                {principal.driveIn && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider">
                    {t("usage_drive-in")}
                  </span>
                )}
              </div>

              <p className="text-white/50 text-sm mb-1">{t("result_label")}</p>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-5">
                <h2 className="text-3xl md:text-4xl font-bold text-ivory">
                  {principal.tailleHorsTout}
                </h2>
                <p className="text-3xl md:text-4xl font-bold text-warm">
                  {formatPrix(principal.prixHT)}
                </p>
              </div>
              <p className="text-white/45 text-xs mb-6">{t("prix_caption")}</p>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/5 rounded-lg overflow-hidden mb-6">
                {specs.map((s) => (
                  <div key={s.label} className="bg-charcoal-light p-3">
                    <p className="text-white/45 text-xs mb-1">{s.label}</p>
                    <p className="text-ivory text-sm font-semibold">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Note contextuelle */}
              {reco.noteKey && (
                <p className="text-sm text-white/65 bg-white/5 border border-white/5 rounded-lg p-3 mb-6">
                  {t(reco.noteKey)}
                </p>
              )}

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Link
                  href={route("contact")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
                >
                  {t("cta_devis")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={route(gammeRoute)}
                  className="inline-flex items-center px-6 py-3 border border-warm/40 text-warm font-semibold rounded hover:bg-warm/10 transition-colors"
                >
                  {t("cta_gamme")}
                </Link>
              </div>

              {/* Alternatives */}
              {reco.alternatives.length > 0 && (
                <div className="border-t border-white/10 pt-5">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
                    {t("alt_label")}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {reco.alternatives.map((alt) => (
                      <div
                        key={alt.id}
                        className="flex items-baseline justify-between gap-3 bg-white/5 rounded-lg p-3"
                      >
                        <span className="text-ivory text-sm font-semibold">
                          {alt.tailleHorsTout}
                        </span>
                        <span className="text-warm text-sm font-semibold whitespace-nowrap">
                          {formatPrix(alt.prixHT)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-white/40 text-xs mt-6 max-w-3xl">{t("disclaimer")}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
