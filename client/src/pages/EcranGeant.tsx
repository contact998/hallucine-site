/*
 * Page Écran Gonflable Géant (soufflerie)
 * i18n : textes traduits via react-i18next (namespace "ecran-geant")
 */
import { useState } from "react";
import { Link } from "wouter";
import { Play } from "lucide-react";
import { Wind, Clock, Shield, Feather, Users, ArrowRight, Film, Trophy, Music, Presentation, CheckCircle, Phone } from "lucide-react";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import PageShell from "@/components/PageShell";
import ProductHero from "@/components/product/ProductHero";
import ProductButton from "@/components/product/ProductButton";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";
import { useProductImages } from "@/hooks/useProductImages";
import EmailLink from "@/components/EmailLink";
import ZoomImage from "@/components/ZoomImage";

const specsData = [
  { taille: "8m × 6m", toile: "7m × 5m", poids: "35 kg", montage: "30 min", personnes: "1" },
  { taille: "10m × 7m", toile: "9m × 6m", poids: "50 kg", montage: "30 min", personnes: "1" },
  { taille: "13m × 8m", toile: "12m × 6,5m", poids: "80 kg", montage: "30 min", personnes: "1" },
  { taille: "15m × 10m", toile: "14m × 8m", poids: "110 kg", montage: "1h", personnes: "2" },
  { taille: "17m × 12m", toile: "15m × 10m", poids: "180 kg", montage: "1h", personnes: "3" },
  { taille: "20m × 14m", toile: "18m × 12m", poids: "220 kg", montage: "1h", personnes: "4" },
  { taille: "24m × 14m", toile: "22m × 12m", poids: "280 kg", montage: "1h", personnes: "4" },
];

const FALLBACK_IMAGES_ECRAN_GEANT = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ibUxsSdoHUCVTWXC.webp", alt: "Écran de cinéma géant gonflable installé en plein centre-ville de Paris" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ceZNJOsztxIyhJFR.webp", alt: "Écran de cinéma géant gonflable de 17m sur 12m installé au Château de Vincennes" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/nRCfDZHKAKZaVovJ.webp", alt: "Écran de cinéma géant gonflable de 24m sur 15m au Stade Vélodrome de Marseille" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/mgzHsmFHRhiLXkxe.webp", alt: "Écran géant gonflable publicitaire pour la compagnie aérienne Air Tahiti Nui" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/yOODHxsfnoySvIeF.webp", alt: "Écran de cinéma géant gonflable sur la pelouse du stade Orange Vélodrome à Marseille" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/noESUDgrqVMksAfK.webp", alt: "Écran géant gonflable utilisé lors d'un concert de musique classique en plein air" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/tCqNKBPDItjYphtU.webp", alt: "Projection de film sur un écran géant gonflable installé sur le pont d'un bateau de croisière" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/KyGcSMszotGbnaDR.webp", alt: "Spectacle nocturne avec trois écrans géants gonflables et feu d'artifice en arrière-plan" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/bvlWRXzIugTjAUFz.webp", alt: "Trois écrans de cinéma géants gonflables installés en plein air au coucher du soleil" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/oXeHaZJFwXJhRXdM.webp", alt: "Démonstration du montage facile d'un écran géant gonflable par une équipe de trois personnes" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/OWMdZNnUOoKKIQbm.webp", alt: "Vue depuis les gradins de l'écran géant gonflable au stade Vélodrome Orange de Marseille" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/lEBTacTZinecXqKx.webp", alt: "Écran géant gonflable lors d'un événement en plein air organisé par Canal+" },
];

export default function EcranGeant() {
  const route = useRoutes();
  const { t } = useTranslation("ecran-geant");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/og-ecran-geant-7MA2E4Zp6zEeYzcaWGEV5o.png");
  const galleryImages = useProductImages("ecran-geant", FALLBACK_IMAGES_ECRAN_GEANT);
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  const avantages = [
    { icon: Feather, title: t("adv_light_title"), desc: t("adv_light_desc") },
    { icon: Clock, title: t("adv_fast_title"), desc: t("adv_fast_desc") },
    { icon: Shield, title: t("adv_solid_title"), desc: t("adv_solid_desc") },
    { icon: Wind, title: t("adv_silent_title"), desc: t("adv_silent_desc") },
    { icon: Users, title: t("adv_quality_title"), desc: t("adv_quality_desc") },
  ];

  const applications = [
    { icon: Film, title: t("app_cinema_title"), desc: t("app_cinema_desc") },
    { icon: Trophy, title: t("app_sport_title"), desc: t("app_sport_desc") },
    { icon: Music, title: t("app_festival_title"), desc: t("app_festival_desc") },
    { icon: Presentation, title: t("app_conf_title"), desc: t("app_conf_desc") },
  ];

  return (
    <PageShell
      withCountdown
      relatedProductsKey="ecran-geant"
      activeVideo={activeVideo}
      onCloseVideo={() => setActiveVideo(null)}
    >
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("section_label"), routeKey: "ecrans" },
          { name: t("hero_title"), routeKey: "ecran-geant" },
        ]}
        product={{
          name: t("hero_title"),
          description: t("meta_desc"),
          image: galleryImages.map(img => img.src),
          category: t("section_label"),
          minPrice: 2490,
        }}
      />

      <ProductHero
        eyebrow={t("section_label")}
        title={t("hero_title")}
        coloredPart={t("hero_subtitle_colored")}
        subtitle={t("hero_h2")}
        actions={
          <>
            <ProductButton href={route('contact')} variant="primary">
              {t("hero_cta_devis")} <ArrowRight className="w-4 h-4" />
            </ProductButton>
            <BrochureDownloadButton productSlug="ecran-soufflerie" productName="Écran Soufflerie" />
          </>
        }
      >
        <p>{t("hero_p1")} <strong className="text-ivory">{t("hero_p1_bold")}</strong>.</p>
        <p>{t("hero_p2_before")}<strong className="text-warm"> {t("hero_p2_w1")}</strong>, <strong className="text-warm">{t("hero_p2_w2")}</strong> {t("hero_p2_w3") ? <span>et <strong className="text-warm">{t("hero_p2_w3")}</strong></span> : null}.</p>
      </ProductHero>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("gallery_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <ZoomImage key={i} src={img.src} alt={img.alt} gallery={galleryImages} index={i} wrapperClassName="relative aspect-[4/3] rounded-lg" className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} width={800} height={500} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Montage simplifié */}
      <section className="py-20 bg-charcoal-light relative overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-6">
                <span className="text-warm">Découvrez le montage simplifié</span><br />
                de l'écran à soufflerie 10m
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Grâce à son système tout-en-un, cet écran innovant révolutionne l'installation 
                pour vos événements extérieurs. Livré avec un sac intégré, il se déploie 
                automatiquement une fois branché à la soufflerie, permettant à <strong className="text-ivory">une seule 
                personne</strong> de l'installer en seulement <strong className="text-warm">30 minutes</strong>.
              </p>

              <h3 className="text-warm font-semibold text-lg mb-4">Points forts :</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-warm mt-0.5 shrink-0" />
                  <div>
                    <span className="text-ivory font-medium">Praticité :</span>
                    <span className="text-white/60 ml-1">Sac et écran reliés pour un montage ultra-rapide.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-warm mt-0.5 shrink-0" />
                  <div>
                    <span className="text-ivory font-medium">Polyvalence :</span>
                    <span className="text-white/60 ml-1">Conçu pour des projections, festivals, ou événements itinérants.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-warm mt-0.5 shrink-0" />
                  <div>
                    <span className="text-ivory font-medium">Efficacité :</span>
                    <span className="text-white/60 ml-1">Parfait pour le cinéma en plein air et les grands rassemblements.</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-card border border-warm/20 rounded-lg">
                <h4 className="text-warm font-semibold mb-2">Applications idéales :</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Projections publiques, festivals, ou tout événement nécessitant un écran 
                  grand format rapide à installer.
                </p>
              </div>
            </div>

            {/* Vidéo montage 10m — miniature cliquable */}
            <div className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer group" onClick={() => setActiveVideo({ id: 'bAxDUrxFUXw', title: 'Montage écran soufflerie 10m' })}>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <img width={480} height={360} loading="lazy" src="https://img.youtube.com/vi/bAxDUrxFUXw/hqdefault.jpg" alt="Tutoriel montage écran soufflerie 10m Hallucine" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" decoding="async" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-ivory font-semibold">Tutoriel vidéo : Montage écran soufflerie 10m</h3>
                <p className="text-white/60 text-sm mt-1">Tutoriel complet pour le montage d'un écran gonflable à soufflerie de 10 mètres.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 icônes — Les plus légers / Garantie / Souffleur */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <img loading="lazy" src="https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/wXQjDSVfzojKfGxl.webp" alt="Icône écran gonflable le plus léger du monde par Hallucine" className="w-20 h-20 object-contain mx-auto mb-3" decoding="async" />
              <p className="text-ivory font-semibold">Les plus légers du monde</p>
            </div>
            <div>
              <img loading="lazy" src="https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/YplQWxdVdPyLKIiY.webp" alt="Icône garantie 10 ans sur les écrans gonflables Hallucine" className="w-20 h-20 object-contain mx-auto mb-3" decoding="async" />
              <p className="text-ivory font-semibold">Avec 10 ans de garantie</p>
            </div>
            <div>
              <img loading="lazy" src="https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ZUADZwnRzRLzkrrt.webp" alt="Icône souffleur permanent pour écrans gonflables Hallucine" className="w-20 h-20 object-contain mx-auto mb-3" decoding="async" />
              <p className="text-ivory font-semibold">(avec souffleur permanent)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("advantages_title")}</h2>
          <p className="text-white/60 mb-12">{t("advantages_subtitle")}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {avantages.map((a) => (
              <div key={a.title} className="p-6 bg-card border border-border rounded-lg card-hover">
                <a.icon className="w-8 h-8 text-warm mb-4" />
                <h3 className="text-lg font-semibold text-ivory mb-2">{a.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tableau specs */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("specs_title")}</h2>
          <p className="text-white/60 mb-8">{t("specs_subtitle")}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("specs_col_size")}</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("specs_col_screen")}</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("specs_col_weight")}</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("specs_col_setup")}</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("specs_col_persons")}</th>
                </tr>
              </thead>
              <tbody>
                {specsData.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-4 px-3 text-ivory font-medium">{row.taille}</td>
                    <td className="py-4 px-3 text-white/70">{row.toile}</td>
                    <td className="py-4 px-3 text-white/70">{row.poids}</td>
                    <td className="py-4 px-3 text-white/70">{row.montage}</td>
                    <td className="py-4 px-3 text-white/70">{row.personnes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-6 bg-card border border-warm/20 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <p className="text-ivory font-medium">{t("specs_note")}</p>
            <EmailLink className="flex items-center gap-2 text-warm hover:text-warm-light transition-colors" />
            <a href="tel:+33458212010" className="flex items-center gap-2 text-warm hover:text-warm-light transition-colors">
              <Phone className="w-4 h-4" />
              +33 4 58 21 20 10
            </a>
          </div>
        </div>
      </section>

      {/* Section vidéo installation */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Vidéo démontage — miniature cliquable */}
            <div className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer group" onClick={() => setActiveVideo({ id: 'sHeVec7oZfQ', title: 'Démontage écran soufflerie' })}>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <img width={480} height={360} loading="lazy" src="https://img.youtube.com/vi/sHeVec7oZfQ/hqdefault.jpg" alt="Tutoriel démontage écran soufflerie Hallucine" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" decoding="async" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-ivory font-semibold">{t("video_title")}</h3>
                <p className="text-white/60 text-sm mt-1">{t("video_subtitle")}</p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-6">
                <span className="text-warm">{t("install_title")}</span><br />
                {t("install_subtitle")}
              </h2>
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-warm text-charcoal font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h3 className="text-ivory font-semibold mb-1">{t("install_step1_title")}</h3>
                    <p className="text-white/60 text-sm">{t("install_step1_desc")}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-warm text-charcoal font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h3 className="text-ivory font-semibold mb-1">{t("install_step2_title")}</h3>
                    <p className="text-white/60 text-sm">{t("install_step2_desc")}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-warm text-charcoal font-bold flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h3 className="text-ivory font-semibold mb-1">{t("install_step3_title")}</h3>
                    <p className="text-white/60 text-sm">{t("install_step3_desc")}</p>
                  </div>
                </div>
              </div>
              <Link href={route('mode-emploi')} className="text-warm hover:underline font-medium inline-flex items-center gap-2">
                {t("install_link")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">{t("cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <ProductButton href={route('contact')} variant="primary">{t("cta_contact")}</ProductButton>
            <ProductButton href={route('contact')} variant="secondary">{t("cta_devis")}</ProductButton>
            <ProductButton href={route('contact')} variant="tertiary">{t("cta_tarifs")}</ProductButton>
          </div>
        </div>
      </section>

      {/* Applications et Usages */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("apps_title")}</h2>
          <p className="text-white/60 mb-10 max-w-2xl">{t("apps_subtitle")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((app) => (
              <div key={app.title} className="p-6 bg-card border border-border rounded-lg card-hover">
                <app.icon className="w-8 h-8 text-warm mb-4" />
                <h3 className="text-ivory font-semibold mb-2">{app.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi Choisir Hallucine */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("why_title")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">{t("why_exp_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("why_exp_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">{t("why_service_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("why_service_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">{t("why_custom_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("why_custom_desc")}</p>
            </div>
          </div>
        </div>
      </section>

    </PageShell>
  );
}
