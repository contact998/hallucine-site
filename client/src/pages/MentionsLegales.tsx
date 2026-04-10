/*
 * Page Mentions Légales — Contenu texte structuré
 * Informations officielles du site d'origine hallucinecran.com
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";

export default function MentionsLegales() {
  const { t } = useTranslation("mentions-legales");

  useDocumentMeta(t("meta_title"), t("meta_desc"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="mentions-legales"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: t("meta_title"), url: "/mentions-legales" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
          url: "https://hallucine.ai/mentions-legales",
        }}
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
              <h2 className="text-xl font-bold text-white mb-4">{t("s1_title")}</h2>
              <p>
                <strong className="text-white/80">{t("s1_raison")}</strong> {t("s1_raison_value")}
              </p>
              <p className="mt-2">
                <strong className="text-white/80">{t("s1_adresse")}</strong> {t("s1_adresse_value")}
              </p>
              <p className="mt-2">
                <strong className="text-white/80">{t("s1_siren")}</strong> {t("s1_siren_value")}
              </p>
              <p className="mt-2">
                <strong className="text-white/80">{t("s1_capital")}</strong> {t("s1_capital_value")}
              </p>
              <p className="mt-2">
                <strong className="text-white/80">{t("s1_tva")}</strong> {t("s1_tva_value")}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s2_title")}</h2>
              <p>
                {t("s2_text")}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s3_title")}</h2>
              <p>
                <strong className="text-white/80">{t("s3_hebergeur")}</strong> {t("s3_hebergeur_value")}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s4_title")}</h2>
              <p>{t("s4_text")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s5_title")}</h2>
              <p>
                {t("s5_text")}{" "}
                <Link href="/politique-confidentialite" className="text-gold hover:underline">
                  {t("s5_link")}
                </Link>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s6_title")}</h2>
              <p>{t("s6_text")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s7_title")}</h2>
              <p>{t("s7_text")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s8_title")}</h2>
              <p>
                {t("s8_text")}{" "}
                <Link href="/politique-cookies" className="text-gold hover:underline">
                  {t("s8_link")}
                </Link>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s9_title")}</h2>
              <p>{t("s9_text")}</p>
              <p className="mt-2">
                <strong className="text-white/80">{t("s9_email")}</strong>{" "}
                <a href="mailto:contact@hallucine.fr" className="text-gold hover:underline">contact@hallucine.fr</a>
              </p>
              <p className="mt-2">
                <strong className="text-white/80">{t("s9_tel")}</strong> +33 4 58 21 20 10
              </p>
              <p className="mt-2">
                <strong className="text-white/80">{t("s9_mobile")}</strong> +33 6 80 14 76 94
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
