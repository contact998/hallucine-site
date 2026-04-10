/*
 * Page Trouver un Distributeur
 * Contenu du site d'origine — réseau en construction
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { MapPin, Phone, Mail } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/useRoutes";

export default function TrouverDistributeur() {
  const route = useRoutes();
  const { t } = useTranslation("trouver-distributeur");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vajzfoYsbBMsDfIq.webp");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="trouver-distributeur"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: t("breadcrumb_page"), url: "/trouver-distributeur" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
          url: "https://hallucine.fr/trouver-distributeur",
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("section_label")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")}<br />
            <span className="text-warm">{t("hero_colored")}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            {t("hero_desc")}
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <div className="p-8 bg-card border border-border rounded-lg mb-12">
            <MapPin className="w-10 h-10 text-warm mb-4" />
            <h2 className="text-2xl font-bold text-ivory mb-4">{t("reseau_title")}</h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>{t("reseau_p1")}</p>
              <p>{t("reseau_p2")}</p>
              <p>{t("reseau_p3")}</p>
            </div>
          </div>

          {/* Contact direct */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-card border border-border rounded-lg">
              <Phone className="w-8 h-8 text-warm mb-4" />
              <h3 className="text-ivory font-bold text-lg mb-3">{t("contact_direct_title")}</h3>
              <div className="space-y-2 text-white/60 text-sm">
                <p><strong className="text-white/80">{t("tel_label")}</strong> +33 4 58 21 20 10</p>
                <p><strong className="text-white/80">{t("mobile_label")}</strong> +33 6 80 14 76 94</p>
                <p><strong className="text-white/80">{t("whatsapp_label")}</strong> +33 6 80 14 76 94</p>
                <p><strong className="text-white/80">{t("wechat_label")}</strong> (+86) 13172020714</p>
              </div>
            </div>
            <div className="p-8 bg-card border border-border rounded-lg">
              <Mail className="w-8 h-8 text-warm mb-4" />
              <h3 className="text-ivory font-bold text-lg mb-3">{t("email_title")}</h3>
              <p className="text-white/60 text-sm mb-4">
                {t("email_desc")}
              </p>
              <a href="mailto:contact@hallucine.fr" className="text-gold hover:underline text-sm">
                contact@hallucine.fr
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-white/60 mb-6">{t("cta_text")}</p>
            <Link href={route('devenir-distributeur')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_btn")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
