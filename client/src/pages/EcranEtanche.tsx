/*
 * Page Écran Gonflable Étanche à l'Air
 * Design: cinéma vintage — fond sombre, accents dorés, typographie serif
 * Contenu i18n via namespace "ecran-etanche"
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { VolumeX, Droplets, Clock, Feather, ChevronDown, Shield, Wind, Zap } from "lucide-react";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import PageShell from "@/components/PageShell";
import ProductHero from "@/components/product/ProductHero";
import ProductButton from "@/components/product/ProductButton";
import { useRoutes } from "@/i18n/useRoutes";
import { useMediaByPage } from "@/hooks/useMediaByCategory";
import EmailLink from "@/components/EmailLink";
import ZoomImage from "@/components/ZoomImage";

const specsData = [
  { taille: "245 × 200 cm", toile: "218 × 122 cm", poids: "7 kg", hauteur: "50 cm", personnes: "1" },
  { taille: "314 × 234 cm", toile: "300 × 170 cm", poids: "8 kg", hauteur: "50 cm", personnes: "1" },
  { taille: "426 × 352 cm", toile: "400 × 225 cm", poids: "15 kg", hauteur: "100 cm", personnes: "1" },
  { taille: "530 × 430 cm", toile: "500 × 280 cm", poids: "20 kg", hauteur: "120 cm", personnes: "1" },
  { taille: "620 × 505 cm", toile: "600 × 338 cm", poids: "32 kg", hauteur: "150 cm", personnes: "1" },
  { taille: "724 × 580 cm", toile: "700 × 395 cm", poids: "45 kg", hauteur: "160 cm", personnes: "2" },
  { taille: "820 × 630 cm", toile: "800 × 450 cm", poids: "50 kg", hauteur: "160 cm", personnes: "2" },
  { taille: "920 × 685 cm", toile: "900 × 506 cm", poids: "62 kg", hauteur: "160 cm", personnes: "2 ou 3" },
  { taille: "1024 × 753 cm", toile: "1000 × 570 cm", poids: "73 kg", hauteur: "160 cm", personnes: "2 ou 3" },
];

const FALLBACK_IMAGES_ECRAN_ETANCHE = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/media/1779249008260-5b585a5c0495-ecran6mpartenvacances-264eeb1d.webp", alt: "Écran gonflable étanche de 6m en sac de transport" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/media/1779249010339-980bff54569e-ecran5mritz-e1a4b8d3.webp", alt: "Écran gonflable étanche de 5m au Ritz avec chaises longues" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/media/1779249012257-50cc2f3c121b-5mprofils-3db17625.webp", alt: "Profil latéral d'un écran gonflable étanche de 5m" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/media/1779249014579-6c6945e23be0-2ecransifauteuil-7d030a1f.webp", alt: "Deux écrans gonflables étanches avec fauteuils gonflables rouges" },
];

export default function EcranEtanche() {
  const route = useRoutes();
  const { t } = useTranslation("ecran-etanche");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/og-ecran-etanche-k4ys7FMgpDwS9DpudndmpB.png");
  const galleryImages = useMediaByPage("ecran-etanche", "galerie", FALLBACK_IMAGES_ECRAN_ETANCHE);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const avantages = [
    { icon: VolumeX, title: t("adv_silent_title"), desc: t("adv_silent_desc") },
    { icon: Droplets, title: t("adv_sealed_title"), desc: t("adv_sealed_desc") },
    { icon: Clock, title: t("adv_fast_title"), desc: t("adv_fast_desc") },
    { icon: Feather, title: t("adv_light_title"), desc: t("adv_light_desc") },
    { icon: Shield, title: t("adv_warranty_title"), desc: t("adv_warranty_desc") },
    { icon: Wind, title: t("adv_wind_title"), desc: t("adv_wind_desc") },
    { icon: Zap, title: t("adv_auto_title"), desc: t("adv_auto_desc") },
  ];

  const faqItems = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
  ];

  const apps = [
    { title: t("app_cinema_title"), desc: t("app_cinema_desc") },
    { title: t("app_pool_title"), desc: t("app_pool_desc") },
    { title: t("app_hotel_title"), desc: t("app_hotel_desc") },
    { title: t("app_private_title"), desc: t("app_private_desc") },
    { title: t("app_camping_title"), desc: t("app_camping_desc") },
    { title: t("app_urban_title"), desc: t("app_urban_desc") },
    { title: t("app_sport_title"), desc: t("app_sport_desc") },
    { title: t("app_corp_title"), desc: t("app_corp_desc") },
  ];

  return (
    <PageShell withCountdown relatedProductsKey="ecran-etanche">
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: "Écrans gonflables", routeKey: "ecrans" },
          { name: "Écran gonflable étanche à l'air", routeKey: "ecran-etanche" },
        ]}
        product={{
          name: "Écran gonflable étanche à l'air",
          description: "Les écrans gonflables étanches à l'air offrent une solution pratique et esthétique pour vos événements en intérieur et en extérieur. Disponibles en tailles allant de 2 à 10 mètres, ils s'adaptent parfaitement aux projections de films, soirées sportives ou tout autre événement nécessitant une toile grand format.",
          image: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/IhxDeQNxHxMYBwlG.webp",
          category: "Écrans gonflables",
          minPrice: 990,
        }}
        faqs={faqItems.map(item => ({ question: item.q, answer: item.a }))}
      />

      <ProductHero
        eyebrow={t("section_label")}
        title={t("hero_title")}
        coloredPart={t("hero_title_colored")}
        actions={
          <>
            <ProductButton href={route('contact')} variant="primary">{t("hero_cta_devis")}</ProductButton>
            <ProductButton href={route('contact')} variant="secondary">{t("hero_cta_contact")}</ProductButton>
            <BrochureDownloadButton productSlug="ecran-etanche" productName="Écran Étanche" variant="compact" />
          </>
        }
      >
        <p>{t("hero_p1")} <strong className="text-ivory">{t("hero_p1_bold")}</strong>, {t("hero_p1_end")}</p>
        <p>{t("hero_p2_before")} <strong className="text-ivory">{t("hero_p2_bold1")}</strong> {t("hero_p2_mid")} <strong className="text-ivory">{t("hero_p2_bold2")}</strong> {t("hero_p2_end")} <strong className="text-warm">{t("hero_p2_guarantee")}</strong> {t("hero_p2_end2")}</p>
      </ProductHero>

      {/* Technologie */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("tech_title")}</h2>
          <p className="text-white/60 mb-8 max-w-3xl text-lg leading-relaxed">
            {t("tech_desc")} <strong className="text-ivory">{t("tech_desc_bold")}</strong> {t("tech_desc_end")}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("tech_tpu_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("tech_tpu_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("tech_kite_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("tech_kite_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("tech_screen_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("tech_screen_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie photos */}
      {galleryImages.length > 0 && (
      <section className="py-16 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("gallery_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative aspect-[4/3]">
                <ZoomImage src={img.src} alt={img.alt} gallery={galleryImages} index={i} wrapperClassName="relative w-full h-full rounded-lg" className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} width={800} height={500} />
                <div className="absolute -left-2 -top-2 w-10 h-10 rounded-full bg-warm text-charcoal flex items-center justify-center text-lg font-bold shadow-lg z-20">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Avantages */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("adv_title")}</h2>
          <p className="text-white/60 mb-12 max-w-3xl">{t("adv_subtitle")}</p>
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

      {/* Applications idéales */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("apps_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {apps.map((app) => (
              <div key={app.title} className="p-5 bg-card border border-border rounded-lg">
                <h3 className="text-warm font-semibold mb-2">{app.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{app.desc}</p>
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
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("specs_col_height")}</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("specs_col_persons")}</th>
                </tr>
              </thead>
              <tbody>
                {specsData.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-4 px-3 text-ivory font-medium">{row.taille}</td>
                    <td className="py-4 px-3 text-white/70">{row.toile}</td>
                    <td className="py-4 px-3 text-white/70">{row.poids}</td>
                    <td className="py-4 px-3 text-white/70">{row.hauteur}</td>
                    <td className="py-4 px-3 text-white/70">{row.personnes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/40 text-xs mt-4">
            Contact : <EmailLink asText /> · Tél : <a href="tel:+33458212010" className="hover:text-warm">+33 4 58 21 20 10</a> · <a href="https://wa.me/33680147694" target="_blank" rel="noopener noreferrer" className="hover:text-warm">WhatsApp</a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("faq_title")}</h2>
          <div className="max-w-3xl space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-ivory font-medium pr-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-warm shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-white/60 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">{t("cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <ProductButton href={route('contact')} variant="primary">{t("cta_contact")}</ProductButton>
            <ProductButton href={route('contact')} variant="secondary">{t("cta_devis")}</ProductButton>
            <ProductButton href={route('contact')} variant="tertiary">{t("cta_tarifs")}</ProductButton>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
