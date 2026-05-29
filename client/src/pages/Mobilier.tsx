/*
 * Page Mobilier Gonflable
 * Images chargées depuis media_library (category: "produits", subcategory: "mobilier")
 * Fallback automatique sur les URLs hardcodées si la DB ne répond pas
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check, ChevronRight, ChevronDown, Feather, Clock, Shield, Palette, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import PageShell from "@/components/PageShell";
import { useRoutes } from "@/i18n/useRoutes";
import { useMediaByPage } from "@/hooks/useMediaByCategory";
import ZoomImage from "@/components/ZoomImage";

// ─── Fallback hardcodé — ne jamais supprimer ──────────────────────────────────

const FALLBACK_BANDEAU = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/jCghaPHMczbtTjIn.webp", alt: "Mobilier gonflable Hallucine en plein air" },
];

const FALLBACK_PRODUITS = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/CYlbsneVJDOkGOhF.webp", alt: "Canapé gonflable" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/VUhsCVHmnpGqweWv.webp", alt: "Fauteuil gonflable" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ufvprHQgVPbbyBlI.webp", alt: "Bar gonflable" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/yUqGwSVTzsTRviNh.webp", alt: "Table mange-debout gonflable" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/efvnhrOKvRVMyuHr.webp", alt: "Structure étanche mobilier" },
];

const FALLBACK_TRANSPORT = [
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/media/1779605638497-5fdb1a6325dc-chariot-transport-ecrans-soufflerie-roue.webp", alt: "Chariot de transport gonflable pliable à roues pour écrans Hallucine" },
  { src: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/media/1779607200855-44c3611663e3-flycase-professionnel-roulettes-ecrans-m.webp", alt: "Flycase professionnel rigide à roulettes pour transport et stockage écrans Hallucine" },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export default function Mobilier() {
  const route = useRoutes();
  const { t } = useTranslation("mobilier");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/CYlbsneVJDOkGOhF.webp");

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Charger les images depuis la médiathèque (par page/section)
  const bandeauImages = useMediaByPage("mobilier", "bandeau", FALLBACK_BANDEAU);
  const produitsImages = useMediaByPage("mobilier", "produits", FALLBACK_PRODUITS);
  const transportImages = useMediaByPage("mobilier", "transport", FALLBACK_TRANSPORT);

  const mobilierProducts = [
    {
      title: t("prod1_title"),
      img: produitsImages[0]?.src ?? FALLBACK_PRODUITS[0].src,
      imgAlt: produitsImages[0]?.alt ?? FALLBACK_PRODUITS[0].alt,
      desc: t("prod1_desc"),
      specs: [
        { label: t("prod1_spec1_label"), value: t("prod1_spec1_value") },
        { label: t("prod1_spec2_label"), value: t("prod1_spec2_value") },
        { label: t("prod1_spec3_label"), value: t("prod1_spec3_value") },
        { label: t("prod1_spec4_label"), value: t("prod1_spec4_value") },
        { label: t("prod1_spec5_label"), value: t("prod1_spec5_value") },
      ],
    },
    {
      title: t("prod2_title"),
      img: produitsImages[1]?.src ?? FALLBACK_PRODUITS[1].src,
      imgAlt: produitsImages[1]?.alt ?? FALLBACK_PRODUITS[1].alt,
      desc: t("prod2_desc"),
      specs: [
        { label: t("prod2_spec1_label"), value: t("prod2_spec1_value") },
        { label: t("prod2_spec2_label"), value: t("prod2_spec2_value") },
        { label: t("prod2_spec3_label"), value: t("prod2_spec3_value") },
        { label: t("prod2_spec4_label"), value: t("prod2_spec4_value") },
        { label: t("prod2_spec5_label"), value: t("prod2_spec5_value") },
      ],
    },
    {
      title: t("prod3_title"),
      img: produitsImages[2]?.src ?? FALLBACK_PRODUITS[2].src,
      imgAlt: produitsImages[2]?.alt ?? FALLBACK_PRODUITS[2].alt,
      desc: t("prod3_desc"),
      specs: [
        { label: t("prod3_spec1_label"), value: t("prod3_spec1_value") },
        { label: t("prod3_spec2_label"), value: t("prod3_spec2_value") },
        { label: t("prod3_spec3_label"), value: t("prod3_spec3_value") },
        { label: t("prod3_spec4_label"), value: t("prod3_spec4_value") },
        { label: t("prod3_spec5_label"), value: t("prod3_spec5_value") },
      ],
    },
    {
      title: t("prod4_title"),
      img: produitsImages[3]?.src ?? FALLBACK_PRODUITS[3].src,
      imgAlt: produitsImages[3]?.alt ?? FALLBACK_PRODUITS[3].alt,
      desc: t("prod4_desc"),
      specs: [
        { label: t("prod4_spec1_label"), value: t("prod4_spec1_value") },
        { label: t("prod4_spec2_label"), value: t("prod4_spec2_value") },
        { label: t("prod4_spec3_label"), value: t("prod4_spec3_value") },
        { label: t("prod4_spec4_label"), value: t("prod4_spec4_value") },
        { label: t("prod4_spec5_label"), value: t("prod4_spec5_value") },
      ],
    },
  ];

  const transportProducts = [
    {
      title: t("trans1_title"),
      img: transportImages[0]?.src ?? FALLBACK_TRANSPORT[0].src,
      imgAlt: transportImages[0]?.alt ?? FALLBACK_TRANSPORT[0].alt,
      desc: t("trans1_desc"),
      specs: [
        { label: t("trans1_spec1_label"), value: t("trans1_spec1_value") },
        { label: t("trans1_spec2_label"), value: t("trans1_spec2_value") },
        { label: t("trans1_spec3_label"), value: t("trans1_spec3_value") },
        { label: t("trans1_spec4_label"), value: t("trans1_spec4_value") },
      ],
    },
    {
      title: t("trans2_title"),
      img: transportImages[1]?.src ?? FALLBACK_TRANSPORT[1].src,
      imgAlt: transportImages[1]?.alt ?? FALLBACK_TRANSPORT[1].alt,
      desc: t("trans2_desc"),
      specs: [
        { label: t("trans2_spec1_label"), value: t("trans2_spec1_value") },
        { label: t("trans2_spec2_label"), value: t("trans2_spec2_value") },
        { label: t("trans2_spec3_label"), value: t("trans2_spec3_value") },
        { label: t("trans2_spec4_label"), value: t("trans2_spec4_value") },
      ],
    },
  ];

  const faqItems = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
  ];

  return (
    <PageShell relatedProductsKey="mobilier">
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: "Mobilier", routeKey: "mobilier" },
        ]}
        product={{
          name: "Mobilier Gonflable Événementiel",
          description: "Notre gamme complète de mobilier gonflable pour tous vos événements.",
          image: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/jCghaPHMczbtTjIn.webp",
          category: "Mobilier Gonflable",
          minPrice: 490,
        }}
        faqs={faqItems.map(item => ({ question: item.q, answer: item.a }))}
      />

      {/* Hero */}
      {bandeauImages.length > 0 && (
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img loading="lazy" src={bandeauImages[0]?.src ?? FALLBACK_BANDEAU[0].src} alt={bandeauImages[0]?.alt ?? FALLBACK_BANDEAU[0].alt} className="w-full h-full object-cover" style={{ objectPosition: 'center 20%' }} decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.03_260_/_0.5)] via-[oklch(0.12_0.03_260_/_0.3)] to-[oklch(0.10_0.03_260_/_0.05)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.03_260_/_0.6)] via-transparent to-transparent" />
        </div>
        <div className="relative container pt-32 pb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> {t("back")}
          </Link>
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">{t("section_label")}</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 leading-tight max-w-3xl">
              {t("hero_title")}{" "}<br />
              <span className="text-gradient-gold">{t("hero_colored")}</span>
            </h1>
            <p className="text-white/70 mt-6 text-lg max-w-2xl leading-relaxed">{t("hero_desc")}</p>
          </motion.div>
        </div>
      </section>
      )}

      {/* Intro technologie */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0} className="order-2 lg:order-1">
              <img loading="lazy" src={produitsImages[4]?.src ?? FALLBACK_PRODUITS[4].src} alt={produitsImages[4]?.alt ?? FALLBACK_PRODUITS[4].alt} className="w-full rounded-lg border border-white/10" decoding="async" />
              <p className="text-white/40 text-xs mt-3 text-center italic">{t("tech_img_caption")}</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1} className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {t("tech_title")}<br />
                <span className="text-white/60 text-2xl">{t("tech_subtitle")}</span>
              </h2>
              <p className="text-white/60 mt-6 leading-relaxed">{t("tech_p1")}</p>
              <p className="text-white/60 mt-4 leading-relaxed">{t("tech_p2")}</p>
              <p className="text-white/60 mt-4 leading-relaxed">{t("tech_p3")}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 text-white/80"><Feather className="w-5 h-5 text-gold" /><span>{t("badge_light")}</span></div>
                <div className="flex items-center gap-3 text-white/80"><Clock className="w-5 h-5 text-gold" /><span>{t("badge_fast")}</span></div>
                <div className="flex items-center gap-3 text-white/80"><Shield className="w-5 h-5 text-gold" /><span>{t("badge_robust")}</span></div>
                <div className="flex items-center gap-3 text-white/80"><Palette className="w-5 h-5 text-gold" /><span>{t("badge_custom")}</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Mobilier */}
      <section className="py-24 md:py-32 bg-background-darker">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white">{t("furniture_title")}</h2>
            <p className="text-white/60 mt-4 text-lg leading-relaxed">{t("furniture_desc")}</p>
          </div>
          <div className="mt-16 grid md:grid-cols-2 gap-8 lg:gap-12">
            {mobilierProducts.map((product, i) => (
              <motion.div key={product.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={i} className="bg-background rounded-lg overflow-hidden border border-white/10 flex flex-col">
                <ZoomImage src={product.img} alt={product.imgAlt} className="w-full aspect-[4/3] object-cover bg-black" />
                <div className="p-6 lg:p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-white">{product.title}</h3>
                  <p className="text-white/60 mt-3 leading-relaxed flex-grow">{product.desc}</p>
                  <div className="mt-6 pt-6 border-t border-white/10 text-sm space-y-3 text-white/60">
                    {product.specs.map(spec => (
                      <div key={spec.label} className="flex justify-between">
                        <span className="font-semibold text-white/80">{spec.label}</span>
                        <span>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Transport */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {t("transport_title")}<br />
                <span className="text-white/60 text-2xl">{t("transport_subtitle")}</span>
              </h2>
              <p className="text-white/60 mt-6 leading-relaxed">{t("transport_desc")}</p>
              <div className="mt-8 space-y-6">
                {transportProducts.map(product => (
                  <div key={product.title} className="bg-background-darker p-6 rounded-lg border border-white/10 flex gap-6 items-start">
                    <ZoomImage src={product.img} alt={product.imgAlt} className="w-24 h-24 object-cover rounded-md" wrapperClassName="flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-white">{product.title}</h4>
                      <p className="text-white/60 text-sm mt-1">{product.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1} className="relative h-[500px] hidden lg:block">
              <img loading="lazy" src={transportImages[0]?.src ?? FALLBACK_TRANSPORT[0].src} alt={transportImages[0]?.alt ?? FALLBACK_TRANSPORT[0].alt} className="absolute top-0 left-0 w-3/4 rounded-lg border border-white/10 transform -rotate-6" decoding="async" />
              <img loading="lazy" src={transportImages[1]?.src ?? FALLBACK_TRANSPORT[1].src} alt={transportImages[1]?.alt ?? FALLBACK_TRANSPORT[1].alt} className="absolute bottom-0 right-0 w-3/4 rounded-lg border border-white/10 transform rotate-3" decoding="async" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 bg-background-darker">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">{t("faq_title")}</h2>
            <p className="text-white/60 mt-4 text-lg">{t("faq_desc")}</p>
          </div>
          <div className="mt-12 space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-white/10 rounded-lg overflow-hidden">
                <button
                  className="w-full text-left p-5 flex justify-between items-center hover:bg-white/5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-white">{item.q}</span>
                  {openFaq === index ? <ChevronDown className="w-5 h-5 text-gold" /> : <ChevronRight className="w-5 h-5 text-white/50" />}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="px-5 pb-5 border-t border-white/10"
                  >
                    <p className="text-white/70 pt-4">{item.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-white">{t("cta_title")}</h2>
            <p className="text-white/60 mt-4 text-lg max-w-2xl mx-auto">{t("cta_desc")}</p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href={route('contact')} className="px-6 py-3 bg-gold text-background font-semibold rounded-md hover:bg-gold/90 transition-colors">{t("cta_devis")}</Link>
              <Link href={route('galerie')} className="px-6 py-3 bg-white/10 text-white font-semibold rounded-md hover:bg-white/20 transition-colors">{t("cta_realisations")}</Link>
            </div>
          </motion.div>
        </div>
      </section>

    </PageShell>
  );
}
