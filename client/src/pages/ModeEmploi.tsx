import { useState } from "react";
import PageShell from "@/components/PageShell";
import GearsEffect from "@/components/GearsEffect";
import VideoLightbox from "@/components/VideoLightbox";
import { Play, Package, AlertTriangle, Wrench } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useRoutes } from "@/i18n/useRoutes";

/* ── CDN URLs des images ── */
const IMG = {
  schema1: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/mFJdqwHyuGSCOGql.webp",
  schema2: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/hrqKmxfHNvgXMiOR.webp",
  schema3: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/SfMhjnmMPXmhTnCY.webp",
  schema4: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/DWWkArXVCSsUOgpF.webp",
  schema5: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ACzhHDDdRqtMviLu.webp",
  schema6: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ozHATmEmVSUnLoJf.webp",
  schema7: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/eZAZdCzUqjLNowGy.webp",
  masse: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/padxqxWNBzlFMRNx.webp",
  piquet: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/SJRhdXcYkpvRGhjf.webp",
  bache: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/SMGpaxEIHhmFEQHN.webp",
  metre: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/MniFNdyEykjxHKpc.webp",
  souffleur: "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/othGWDTuMAfyXByS.webp",
};

export default function ModeEmploi() {
  const route = useRoutes();
  const { t } = useTranslation("mode-emploi");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/vajzfoYsbBMsDfIq.webp");

  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);

  const videos = [
    { id: "bAxDUrxFUXw", title: t("v1_title"), description: t("v1_desc") },
    { id: "v1Hb0GYLf8w", title: t("v2_title"), description: t("v2_desc") },
    { id: "sHeVec7oZfQ", title: t("v3_title"), description: t("v3_desc") },
    { id: "lnZ_fbEXH44", title: t("v4_title"), description: t("v4_desc") },
    { id: "UQmA8fZRDYg", title: t("v5_title"), description: t("v5_desc") },
    { id: "hmSlBIWP_jI", title: t("v6_title"), description: t("v6_desc") },
  ];

  const contenuLivraison = [
    { nom: t("l1_nom"), description: t("l1_desc"), img: IMG.metre },
    { nom: t("l2_nom"), description: t("l2_desc"), img: IMG.souffleur },
    { nom: t("l3_nom"), description: t("l3_desc") },
    { nom: t("l4_nom"), description: t("l4_desc") },
  ];

  const materielNonInclus = [
    { nom: t("m1_nom"), img: IMG.piquet },
    { nom: t("m2_nom"), img: IMG.metre },
    { nom: t("m3_nom"), img: IMG.masse },
    { nom: t("m4_nom"), img: IMG.bache },
  ];

  const etapes = [
    {
      numero: 1,
      titre: t("e1_titre"),
      schema: IMG.schema1,
      schemaCaption: t("e1_caption"),
      instructions: [t("e1_i1"), t("e1_i2")],
    },
    {
      numero: 2,
      titre: t("e2_titre"),
      schema: IMG.schema2,
      schemaCaption: t("e2_caption"),
      instructions: [t("e2_i1"), t("e2_i2"), t("e2_i3"), t("e2_i4")],
    },
    {
      numero: 3,
      titre: t("e3_titre"),
      schema: IMG.schema3,
      schemaCaption: t("e3_caption"),
      instructions: [t("e3_i1")],
    },
    {
      numero: 4,
      titre: t("e4_titre"),
      schema: IMG.schema4,
      schemaCaption: t("e4_caption"),
      instructions: [t("e4_i1")],
    },
    {
      numero: 5,
      titre: t("e5_titre"),
      schema: IMG.schema5,
      schemaCaption: t("e5_caption"),
      instructions: [t("e5_i1"), t("e5_i2"), t("e5_i3"), t("e5_i4")],
    },
    {
      numero: 6,
      titre: t("e6_titre"),
      schema: IMG.schema6,
      schemaCaption: t("e6_caption"),
      instructions: [t("e6_i1")],
    },
    {
      numero: 7,
      titre: t("e7_titre"),
      schema: IMG.schema7,
      schemaCaption: t("e7_caption"),
      instructions: [t("e7_i1"), t("e7_i2"), t("e7_i3")],
    },
  ];

  return (
    <PageShell>
      <PageStructuredData
        breadcrumbs={[
          { name: "Accueil", routeKey: "home" },
          { name: t("breadcrumb_page"), routeKey: "mode-emploi" },
        ]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <GearsEffect />
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{t("section_label")}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            {t("hero_title")}{" "}<br />
            <span className="text-warm">{t("hero_colored")}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            {t("hero_desc")}
          </p>
        </div>
      </section>

      {/* Vidéos tutorielles */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("videos_title")}</h2>
          <p className="text-white/60 mb-12 max-w-2xl">
            {t("videos_desc")}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer group" onClick={() => setActiveVideo({ id: video.id, title: video.title })}>
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <img width={480} height={360} src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} alt={`Vidéo tutorielle Hallucine — ${video.title}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-ivory font-semibold text-sm">{video.title}</h3>
                  <p className="text-white/60 text-xs mt-1">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="https://www.youtube.com/@Hallucinecran"
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm hover:underline font-medium inline-flex items-center gap-2"
            >
              {t("youtube_link")} →
            </a>
          </div>
        </div>
      </section>

      {/* Mode d'emploi */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-4 text-center">{t("guide_title")}</h2>
          <p className="text-white/60 mb-12 text-center max-w-3xl mx-auto">
            {t("guide_desc")}
          </p>

          {/* Contenu de la livraison + Matériel */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-ivory mb-6 flex items-center gap-3">
                <Package className="w-6 h-6 text-warm" />
                {t("livraison_title")}
              </h3>
              <div className="space-y-4">
                {contenuLivraison.map((item) => (
                  <div key={item.nom} className="flex items-start gap-4 bg-background rounded-lg p-4">
                    {item.img && (
                      <img
                        src={item.img}
                        alt={`Matériel Hallucine — ${item.nom}`}
                        className="w-16 h-16 object-contain rounded cursor-pointer hover:scale-110 transition-transform"
                        loading="lazy"
                        onClick={() => setLightboxImg({ src: item.img!, alt: item.nom })}
                      />
                    )}
                    <div>
                      <h4 className="text-ivory font-semibold text-sm">{item.nom}</h4>
                      <p className="text-white/60 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-ivory mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-warm" />
                {t("materiel_title")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {materielNonInclus.map((item) => (
                  <div key={item.nom} className="flex flex-col items-center gap-3 bg-background rounded-lg p-4">
                    <img
                      src={item.img}
                      alt={`Matériel nécessaire — ${item.nom}`}
                      className="w-16 h-16 object-contain rounded cursor-pointer hover:scale-110 transition-transform"
                      loading="lazy"
                      onClick={() => setLightboxImg({ src: item.img, alt: item.nom })}
                    />
                    <span className="text-white/70 text-sm font-medium text-center">{item.nom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Étapes d'installation */}
          <h3 className="text-2xl font-bold text-ivory mb-10 flex items-center justify-center gap-3">
            <Wrench className="w-7 h-7 text-warm" />
            {t("etapes_title")}
          </h3>

          <div className="space-y-12">
            {etapes.map((etape) => (
              <div key={etape.numero} className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative pl-14">
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-warm text-charcoal flex items-center justify-center text-lg font-bold shadow-lg">
                    {etape.numero}
                  </div>
                  {etape.numero < etapes.length && (
                    <div className="absolute left-[19px] top-12 w-0.5 h-[calc(100%+2rem)] bg-warm/20" />
                  )}
                  <h4 className="text-lg font-bold text-ivory mb-4 pt-1">{etape.titre}</h4>
                  <ul className="space-y-3">
                    {etape.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-warm mt-2 shrink-0" />
                        <span className="text-sm leading-relaxed">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <img
                    src={etape.schema}
                    alt={`Schéma étape ${etape.numero} — ${etape.schemaCaption}`}
                    className="w-full max-h-64 object-contain p-2 cursor-pointer hover:scale-[1.02] transition-transform"
                    loading="lazy"
                    onClick={() => setLightboxImg({ src: etape.schema, alt: etape.schemaCaption })}
                  />
                  <div className="p-2 text-center border-t border-border">
                    <p className="text-white/50 text-xs">{etape.schemaCaption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-4 bg-warm/10 rounded-lg border border-warm/20">
            <p className="text-warm font-medium text-center text-sm">
              {t("etapes_conclusion")}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">{t("cta_title")}</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            {t("cta_desc")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={route('contact')} className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              {t("cta_contact")}
            </Link>
            <a
              href="https://www.youtube.com/@Hallucinecran"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors"
            >
              {t("cta_youtube")}
            </a>
          </div>
        </div>
      </section>


      {/* Lightbox vidéo */}
      {activeVideo && (
        <VideoLightbox
          videoId={activeVideo.id}
          title={activeVideo.title}
          isOpen={true}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {/* Lightbox image */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-4xl font-light z-10"
            onClick={() => setLightboxImg(null)}
          >
            ×
          </button>
          <img
            src={lightboxImg.src}
            alt={lightboxImg.alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()} decoding="async" loading="lazy"
          />
          <p className="absolute bottom-6 text-white/70 text-sm">{lightboxImg.alt}</p>
        </div>
      )}
    </PageShell>
  );
}
