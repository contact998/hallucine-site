/*
 * Page Tentes Araignées Gonflables
 * Contenu i18n via namespace "tente-araignee"
 */
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useRoutes } from "@/i18n/useRoutes";
import { RelatedProducts } from "@/components/RelatedProducts";

const tailles = [
  { dim: "4m × 4m", poids: "~50 kg", montage: "10-15 min" },
  { dim: "6m × 6m", poids: "~60 kg", montage: "10-15 min" },
  { dim: "8m × 8m", poids: "~70 kg", montage: "10-15 min" },
  { dim: "10m × 10m", poids: "~80 kg", montage: "15 min" },
];

const images = [
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/KGkXbQCcXEGqyaSz.webp", alt: "Tente araignée gonflable bleue installée sur l'herbe pour un événement en plein air" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/zlXEEbFQipJgezJx.webp", alt: "Tente araignée gonflable avec des parois latérales jaunes, créant un espace abrité" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/NNxCkFqPVeqmFjFC.webp", alt: "Tente araignée gonflable de couleur verte, se fondant dans un décor naturel" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/uOKkoMGgvsDEguJm.webp", alt: "Tente araignée gonflable noire personnalisée avec le logo 'Ealing Eagles'" },
];

export default function TentesAraignees() {
  const route = useRoutes();
  const { t } = useTranslation("tente-araignee");
  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/og-tente-araignee-R3y9ti6qL9e3JFNFGvHjoG.png");

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqItems = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="tentes-araignees"
        breadcrumbs={[
          { name: "Accueil", url: "https://hallucinecran.fr" },
          { name: "Tentes gonflables", url: "https://hallucinecran.fr/tentes-gonflables" },
          { name: "Tente Araignée Gonflable", url: "https://hallucinecran.fr/tentes-araignees" },
        ]}
        product={{
          name: "Tente Araignée Gonflable",
          description: "Tente gonflable araignée (spider) pour événements. Design unique, montage ultra-rapide, résistante au vent.",
          image: images.map(img => img.src),
          url: "https://hallucinecran.fr/tentes-araignees",
          category: "Tentes gonflables",
          minPrice: 990,
        }}
        faqs={faqItems.map(item => ({ question: item.q, answer: item.a }))}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <div className="container relative z-10">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("section_label")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")}<br />
            <span className="text-warm">{t("hero_colored")}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed mb-4">{t("hero_p1")}</p>
          <p className="text-white/50 text-base max-w-3xl leading-relaxed">{t("hero_p2")}</p>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("gallery_title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi choisir */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("why_title")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("why1_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("why1_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("why2_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("why2_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("why3_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("why3_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tailles et specs */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("specs_title")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-2xl">
              <thead>
                <tr className="border-b border-warm/30">
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("specs_col_dim")}</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("specs_col_weight")}</th>
                  <th className="text-left py-4 px-3 text-warm font-semibold">{t("specs_col_setup")}</th>
                </tr>
              </thead>
              <tbody>
                {tailles.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="py-4 px-3 text-ivory font-medium">{row.dim}</td>
                    <td className="py-4 px-3 text-white/70">{row.poids}</td>
                    <td className="py-4 px-3 text-white/70">{row.montage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Caractéristiques techniques */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("tech_title")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">{t("tech1_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("tech1_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">{t("tech2_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("tech2_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">{t("tech3_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("tech3_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-2">{t("tech4_title")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("tech4_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">{t("apps_title")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("app1_title")}</h3>
              <p className="text-white/60 text-sm">{t("app1_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("app2_title")}</h3>
              <p className="text-white/60 text-sm">{t("app2_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("app3_title")}</h3>
              <p className="text-white/60 text-sm">{t("app3_desc")}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold mb-3">{t("app4_title")}</h3>
              <p className="text-white/60 text-sm">{t("app4_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
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
      <section className="py-20 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/60 mb-8">{t("cta_desc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={route('contact')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_devis")}
            </Link>
            <Link href={route('contact')} className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              {t("cta_tarifs")}
            </Link>
          </div>
        </div>
      </section>

      <RelatedProducts items={["tentes", "mobilier", "accessoires"]} />
      <Footer />
    </div>
  );
}
