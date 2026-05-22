/*
 * Page Politique de Confidentialité — RGPD
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import EmailLink from "@/components/EmailLink";

export default function Confidentialite() {
  const { t } = useTranslation("confidentialite");

  useDocumentMeta(t("meta_title"), t("meta_desc"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="politique-de-confidentialite"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: t("meta_title"), url: "/politique-confidentialite" },
        ]}
        page={{
          name: t("page_title"),
          description: t("meta_desc"),
          url: "https://hallucinecran.fr/politique-confidentialite",
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
              <p>{t("s1_p1")}</p>
              <p className="mt-3">{t("s1_p2")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s2_title")}</h2>
              <p>{t("s2_intro")}</p>
              <ul className="mt-3 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span>{t("s2_li1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span>{t("s2_li2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span>{t("s2_li3")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span>{t("s2_li4")}</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s3_title")}</h2>
              <p>{t("s3_text")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s4_title")}</h2>
              <p>{t("s4_intro")}</p>
              <ul className="mt-3 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span><strong className="text-white/80">{t("s4_acces")}</strong> {t("s4_acces_text")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span><strong className="text-white/80">{t("s4_rectif")}</strong> {t("s4_rectif_text")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span><strong className="text-white/80">{t("s4_effacement")}</strong> {t("s4_effacement_text")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span><strong className="text-white/80">{t("s4_portabilite")}</strong> {t("s4_portabilite_text")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">—</span>
                  <span><strong className="text-white/80">{t("s4_opposition")}</strong> {t("s4_opposition_text")}</span>
                </li>
              </ul>
              <p className="mt-3">{t("s4_contact_intro")}</p>
              <p className="mt-3">
                <strong className="text-white/80">Hallucine EURL</strong><br />
                {t("s4_contact_adresse")}<br />
                {t("s4_contact_ville")}<br />
                Email : <EmailLink className="text-gold hover:underline" />
              </p>
              <p className="mt-3">{t("s4_delai")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s5_title")}</h2>
              <p>{t("s5_text")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s6_title")}</h2>
              <p>{t("s6_text")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t("s7_title")}</h2>
              <p>{t("s7_intro")}</p>
              <p className="mt-3">
                <strong className="text-white/80">{t("s7_email_label")}</strong> <EmailLink className="text-gold hover:underline" /><br />
                <strong className="text-white/80">{t("s7_objet_label")}</strong> {t("s7_objet_value")}
              </p>
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-white/30 text-xs">
                {t("last_update")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
