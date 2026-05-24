/*
 * Page Drive-in — l'écran gonflable Hallucine dédié au cinéma drive-in.
 * Contenu i18n via le namespace « drive-in ».
 */
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, Eye, Wind, Anchor, Clock, Radio } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageStructuredData from "@/components/PageStructuredData";
import PagePhoto from "@/components/PagePhoto";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useRoutes } from "@/i18n/useRoutes";
import { ECRAN_DRIVE_IN } from "@/data/ecransConfigurateur";
import { formatNombre, formatMontage, formatPersonnes } from "@/lib/ecranFormat";

export default function DriveIn() {
  const { t } = useTranslation("drive-in");
  const route = useRoutes();
  useDocumentMeta(t("meta_title"), t("meta_desc"));

  const ecran = ECRAN_DRIVE_IN;
  const prix = `${formatNombre(ecran.prixHT)} € ${t("ht")}`;

  const specs = [
    { label: t("spec_toile"), value: ecran.toile },
    { label: t("spec_hauteur"), value: `${String(ecran.hauteurBaseImageM).replace(".", ",")} m` },
    { label: t("spec_poids"), value: `${ecran.poidsKg} kg` },
    { label: t("spec_montage"), value: formatMontage(ecran.montageMinutes) },
    { label: t("spec_personnes"), value: formatPersonnes(ecran) },
    { label: t("spec_garantie"), value: t("garantie_value", { n: ecran.garantieAns }) },
  ];

  const atouts = [
    { icon: Eye, title: t("a1_title"), desc: t("a1_desc") },
    { icon: Wind, title: t("a2_title"), desc: t("a2_desc") },
    { icon: Anchor, title: t("a3_title"), desc: t("a3_desc") },
    { icon: Clock, title: t("a4_title"), desc: t("a4_desc") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("breadcrumb"), routeKey: "drive-in" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
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
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed mb-8">{t("hero_desc")}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={route("contact")}
              className="inline-flex items-center gap-2 px-7 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
            >
              {t("cta_devis")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={route("configurateur")}
              className="inline-flex items-center px-7 py-3 border border-warm/40 text-warm font-semibold rounded hover:bg-warm/10 transition-colors"
            >
              {t("cta_config")}
            </Link>
          </div>
        </div>
      </section>

      {/* Photo */}
      <PagePhoto src="/img/ecran-drive-in.jpg" alt={t("photo_alt")} />

      {/* Pourquoi un écran spécifique */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-ivory mb-5">{t("why_title")}</h2>
              <p className="text-white/70 leading-relaxed mb-4">{t("why_p1")}</p>
              <p className="text-white/70 leading-relaxed">{t("why_p2")}</p>
            </div>
            <div className="bg-charcoal-light border border-warm/20 rounded-xl p-8 text-center">
              <p className="text-warm text-6xl font-bold mb-2">3 m</p>
              <p className="text-ivory font-semibold mb-1">{t("stat_title")}</p>
              <p className="text-white/55 text-sm">{t("stat_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fiche écran Drive-In */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-2">{t("card_title")}</h2>
          <p className="text-white/60 mb-8 max-w-2xl">{t("card_desc")}</p>
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            <div className="bg-background border border-warm/20 rounded-xl p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-6">
                <h3 className="text-3xl font-bold text-ivory">{ecran.tailleHorsTout}</h3>
                <p className="text-3xl font-bold text-warm">{prix}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/5 rounded-lg overflow-hidden mb-4">
                {specs.map((s) => (
                  <div key={s.label} className="bg-background p-3">
                    <p className="text-white/45 text-xs mb-1">{s.label}</p>
                    <p className="text-ivory text-sm font-semibold">{s.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/45 text-xs mb-4">{t("prix_caption")}</p>
              <p className="text-white/60 text-sm flex items-start gap-2 mb-6">
                <Radio className="w-4 h-4 text-warm shrink-0 mt-0.5" />
                {t("audio_note")}
              </p>
              <Link
                href={route("contact")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
              >
                {t("cta_devis")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-xl min-h-[300px] lg:min-h-0">
              <img
                src="https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/1779595463304-e2eb8155e2c1-ecran-cinema-drive-in-gonflable-17m-hallucine.webp"
                alt={t("card_photo_alt")}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                width={1200}
                height={800}
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Atouts */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-10">{t("atouts_title")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {atouts.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className="bg-card border border-border rounded-lg p-6">
                  <div className="w-11 h-11 rounded-lg bg-warm/15 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-warm" />
                  </div>
                  <h3 className="text-ivory font-semibold mb-2">{a.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{a.desc}</p>
                </div>
              );
            })}
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
              href={route("ecran-geant")}
              className="px-8 py-3 border border-warm/40 text-warm font-semibold rounded hover:bg-warm/10 transition-colors"
            >
              {t("cta_gamme")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
