/*
 * Page Politique de Cookies — Contenu du site d'origine
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";

export default function PolitiqueCookies() {
  const { t } = useTranslation("politique-cookies");

  useDocumentMeta(t("meta_title"), t("meta_desc"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
        }}
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("meta_title"), routeKey: "cookies" },
        ]}
      />
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> {t("back")}
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-12">{t("page_title")}</h1>

          <div className="space-y-10 text-white/60 text-sm leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("intro_title")}</h2>
              <p>{t("intro_text")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s1_title")}</h2>
              <p>{t("s1_text")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s2_title")}</h2>
              <div className="space-y-4">
                <p>
                  <strong className="text-white/80">{t("s2_necessary_label")}</strong> {t("s2_necessary_text")}
                </p>
                <p>
                  <strong className="text-white/80">{t("s2_performance_label")}</strong> {t("s2_performance_text")}
                </p>
                <p>
                  <strong className="text-white/80">{t("s2_functional_label")}</strong> {t("s2_functional_text")}
                </p>
                <p>
                  <strong className="text-white/80">{t("s2_advertising_label")}</strong> {t("s2_advertising_text")}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s3_title")}</h2>
              <p>{t("s3_text")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s4_title")}</h2>
              <p>{t("s4_text")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s5_title")}</h2>
              <p>{t("s5_text")}</p>
              <p className="mt-4 text-white/40 italic">
                {t("last_updated")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
