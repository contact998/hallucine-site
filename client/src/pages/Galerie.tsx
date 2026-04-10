/*
 * Page Galerie
 * Grille de photos d'événements avec filtrage par catégorie
 */
import { useState } from "react";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Video } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import PageStructuredData from "@/components/PageStructuredData";
import { useTranslation } from "react-i18next";

const photos = [
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/pasted_file_lj0vsC_onepongeapreslapluiePlaceaujeune_0787bac5.jpg", alt: "Une ponge apres la pluie Place au jeune", cat: "events" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/pasted_file_sCzDrf_Ecrande20malatelier_b865e38c.jpg", alt: "Ecran de 20m a l'atelier", cat: "screens" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/pasted_file_GfjC2j_ProjecteurBuisseUnpeudenostalgie_286e537c.jpg", alt: "Projecteur Buisse un peu de nostalgie", cat: "equipment" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/pasted_file_bLFuXL_Onetaitjeuneetbeau_7e18fb73.jpg", alt: "On etait jeune et beau", cat: "events" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/pasted_file_MdkZcC_Ecran20mdansun12m3_4c110e35.jpg", alt: "Ecran 20m dans un 12m3", cat: "screens" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/pasted_file_gtSn5p_Onenabesoin_54c9b7e9.jpg", alt: "On a besoin", cat: "equipment" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/pasted_file_lTfzbp_Africa.._b7bbd255.jpg", alt: "Africa", cat: "events" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/pasted_file_Q9sJqv_Ecran5mParistoutestpret_f47e9677.jpg", alt: "Ecran 5m Paris tout est pret", cat: "screens" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/IDghLbPxebJUfXVC.webp", alt: "Écran gonflable 2.5m sur pieds pour projection en extérieur", cat: "screens" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/eMBtaurEbmzQnzOE.webp", alt: "Écran de cinéma gonflable de nuit sur toit d'immeuble", cat: "screens" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/IYMOAKIQfiKLkGNA.webp", alt: "Projection nocturne sur écran gonflable installé sur un toit", cat: "screens" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ZshizyjDOejMjIKn.webp", alt: "Écran 5m léger en gymnase pour la FIFA", cat: "screens" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/jZPlgGHnKqpYQwqo.webp", alt: "Le plus fin écran gonflable 8m de large", cat: "screens" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/pyvWFmXAUZRkzqHX.webp", alt: "Écran gonflable 8m de base à Saint-Germain", cat: "screens" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ZRTtjuFGnMbHIPCI.webp", alt: "Écran géant gonflable 24m à Marseille", cat: "screens" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/IhxDeQNxHxMYBwlG.webp", alt: "Écran de cinéma gonflable étanche à l'air, idéal pour les piscines", cat: "screens" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/QClDxPadLVEYKlxM.webp", alt: "Comparaison de la taille d'un écran gonflable étanche avec une personne", cat: "screens" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/bQsAjlQHIThVuBhI.webp", alt: "Projection à Bruxelles à la tombée de la nuit", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/xLoHlJSobIMyvuVl.webp", alt: "Événement cinéma en plein air avec écran gonflable", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/yUosquMyorrMTehR.webp", alt: "Projection en plein air à Toulouse", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/KyASvJooCSwRBpRc.webp", alt: "Projecteur 2x7kW laser au Vélodrome de Marseille", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/WNNTcwtAzSbhcfWo.webp", alt: "Cinéma drive-in en Suisse avec écran gonflable", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CSDzmpWKXaxraSOj.webp", alt: "Projection événementielle en extérieur", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CbIVjrStlnrHkTaD.webp", alt: "Passeur d'images — projection itinérante", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/hRrSUUUDZLGnodhi.webp", alt: "Projection événementielle grand format en extérieur", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/QXuBhbAyfuElBhJi.webp", alt: "Installation haubanée à Saint-Denis avec bouches d'égout", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/fqDJEDLXjMlvgRxV.webp", alt: "Projection en ville sur écran gonflable", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/abKrKxvdyZZTJtHo.webp", alt: "Événement cinéma plein air nocturne", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/awDroXWpEBclfegR.webp", alt: "Projection en extérieur avec public assis", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/OnxcjQhFOtxzhIcR.webp", alt: "Séance de cinéma en plein air ambiance festive", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/VvQWHBvtXBXHrCWK.webp", alt: "Ambiance d'une séance de cinéma en plein air de nuit", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/qoINhxiIteIjBXYG.webp", alt: "Projection d'un film en extérieur pour un petit groupe sur l'herbe", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/GrHCmqNBbWZgeozA.webp", alt: "Séance de cinéma drive-in avec voitures devant un grand écran gonflable", cat: "events" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/cVwzLRsopuDpSaeO.webp", alt: "Projecteur Barco en hauteur pour projection grand format", cat: "equipment" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/xYqnbzovqxtBbTTL.webp", alt: "Cabine de projection mobile pour cinéma en plein air", cat: "equipment" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/DbFYGUoDnOzyuIqc.webp", alt: "Setup technique pour événement cinéma plein air", cat: "equipment" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/myQOmuwLkZOAzRRs.webp", alt: "Installation technique complète pour projection en extérieur", cat: "equipment" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/SUFOlyWxjMBsVhPG.webp", alt: "Tente gonflable événementielle en forme de X", cat: "tents" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/YDVeZvrXTWvHTZKL.webp", alt: "Tentes gonflables en forme de X personnalisées avec logos", cat: "tents" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/aGPwYnsYBzrWtrwV.webp", alt: "Tente gonflable modèle N Hallucine", cat: "tents" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/aSmtFstezqZGmsFX.webp", alt: "Tente gonflable modèle N personnalisée Volvo", cat: "tents" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/kfAbnBLwOXPYLGqi.webp", alt: "Tente gonflable modèle N Croix-Rouge", cat: "tents" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HiOAOTLZaOhqpcQk.webp", alt: "Tente gonflable blanche en forme de V", cat: "tents" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/xIcftkrBZrhnUDtQ.webp", alt: "Tente gonflable blanche en forme de V — autre vue", cat: "tents" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/kiWJObYQcRsDjmVd.webp", alt: "Tentes gonflables bleues en forme d'araignée", cat: "tents" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/LalbLaLjfhTWtCQX.webp", alt: "Tentes gonflables en forme d'araignée noire et jaune", cat: "tents" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/vbfbnQBVCUGrWUOw.webp", alt: "Arche gonflable pour festival de cinéma en plein air", cat: "arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/eqdRLmacrGAlLxMw.webp", alt: "Arche gonflable ligne d'arrivée course sportive", cat: "arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/yuLqkYzSuwxDVzhu.webp", alt: "Arche gonflable personnalisée pour projection en plein air", cat: "arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/RwlUZIhnbBNsLqCd.webp", alt: "Arche gonflable de bienvenue pour événement", cat: "arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/tZPYCxQHEVFUCaJD.webp", alt: "Arche gonflable blanche personnalisable", cat: "arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/nAUCiZOIoXxUsOWB.webp", alt: "Arche gonflable publicitaire SKYGO", cat: "arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/QXbIEeUzJKlGwZuE.webp", alt: "Arche gonflable modèle standard Hallucine", cat: "arches" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/CYlbsneVJDOkGOhF.webp", alt: "Canapé et fauteuil gonflables noirs et rouges", cat: "furniture" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/VUhsCVHmnpGqweWv.webp", alt: "Fauteuil gonflable individuel pour événement", cat: "furniture" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/ufvprHQgVPbbyBlI.webp", alt: "Bar comptoir gonflable pour événement en plein air", cat: "furniture" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/yUqGwSVTzsTRviNh.webp", alt: "Table mange-debout gonflable pour cocktail", cat: "furniture" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/efvnhrOKvRVMyuHr.webp", alt: "Fauteuils et tabourets gonflables espace lounge", cat: "furniture" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/AHGATdyMDWenpusd.webp", alt: "Canapé gonflable bleu deux places", cat: "furniture" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/avantpremiere_9bf14570.jpg", alt: "Avant-première cinéma en plein air", cat: "events" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/Crevezpasmescanapes_0d77456c.jpg", alt: "Installation canapés gonflables", cat: "furniture" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/Entrechienetloup_cfd5e5ec.jpg", alt: "Projection Entre chien et loup", cat: "events" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/Cacestduserieux_d5c77eb8.jpg", alt: "Installation écran de cinéma", cat: "screens" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/20160726_225223_7c70f846.jpg", alt: "Projection nocturne événement", cat: "events" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/17NOIR_c6cca538.JPG", alt: "Écran gonflable 17m noir", cat: "screens" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/plein-airParistoilesdeminuit_74b10659.jpg", alt: "Cinéma plein air Paris étoiles de minuit", cat: "events" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/Ecrande1omjemefaittoutpetit_70cb6359.jpg", alt: "Écran de 10m projection", cat: "screens" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/new_5faf5bb0.jpg", alt: "Foule devant écran de cinéma", cat: "events" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/Cestlecirque_1ece50ba.jpg", alt: "C'est le cirque projection", cat: "events" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/Apresletravailunpeudedetente_1b9695c4.jpg", alt: "Détente après le travail", cat: "events" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/ecrande24mencoreuneffort_fec872ad.jpg", alt: "Écran de 24m encore un effort", cat: "screens" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/Vincennesfaisceaulumineux_1458c920.jpg", alt: "Vincennes faisceau lumineux", cat: "events" },
];

export default function Galerie() {
  const { t } = useTranslation("galerie");

  useDocumentMeta(t("meta_title"), t("meta_desc"), "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/IDghLbPxebJUfXVC.webp");

  const categories = [
    { key: "all", label: t("cat_tous") },
    { key: "screens", label: t("cat_ecrans") },
    { key: "events", label: t("cat_evenements") },
    { key: "equipment", label: t("cat_equipement") },
    { key: "tents", label: t("cat_tentes") },
    { key: "arches", label: t("cat_arches") },
    { key: "furniture", label: t("cat_mobilier") },
  ];

  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setParallaxOffset(window.scrollY * 0.3);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filtered = filter === "all" ? photos : photos.filter((p) => p.cat === filter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageStructuredData
        id="galerie-evenements"
        breadcrumbs={[{ name: "Accueil", url: "/" }, { name: t("page_title"), url: "/galerie-evenements" }]}
        page={{
          name: t("meta_title"),
          description: t("meta_desc"),
          url: "https://hallucine.fr/galerie-evenements"
        }}
      />
      <Navbar />

      {/* Hero image section */}
      <section className="relative overflow-hidden bg-black">
        <div className="relative w-full" style={{ aspectRatio: '16/7' }}>
          <img loading="lazy"
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663291384825/e2MtNjHsQcTUTnWGsGBMg7/new_0e670248.jpg"
            alt={t("img_hero_alt")}
            className="w-full h-full object-cover"
            style={{ transform: `translateY(${parallaxOffset}px)` }}
          decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
      </section>

      {/* Unified container: menu, text, and gallery overlapping hero */}
      <div className="relative -mt-64 md:-mt-96 z-30">
        {/* Barre filtres */}
        <div className="bg-black/60 backdrop-blur-sm py-3 mb-8 md:mb-12">
          <div className="container relative flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-ivory shrink-0">
              {t("page_title")}
            </h1>
            <Link
              href="/galerie-video"
              className="shrink-0 ml-3 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full bg-warm/20 text-warm border border-warm/30 hover:bg-warm/30 transition-colors z-30 pointer-events-auto"
            >
              <Video className="w-4 h-4" />
              {t("btn_videos")}
            </Link>
            <div className="absolute inset-0 flex flex-wrap gap-2 sm:gap-4 items-center justify-center pointer-events-none">
              <div className="hidden xl:flex flex-wrap gap-2 sm:gap-4 items-center justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setFilter(cat.key)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 pointer-events-auto ${
                      filter === cat.key ? "bg-accent text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/70"
                    }`}>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Dropdown pour mobile/tablette */}
              <div className="relative xl:hidden">
                <select
                  onChange={(e) => setFilter(e.target.value)}
                  value={filter}
                  className="px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 pointer-events-auto appearance-none bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 focus:outline-none focus:ring-2 focus:ring-accent/80 pr-8"
                >
                  {categories.map((cat) => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Texte descriptif */}
        <div className="px-6 mb-8 md:mb-12">
          <p className="text-white/80 text-sm md:text-base text-center max-w-3xl mx-auto leading-relaxed">
            {t("meta_desc")}
          </p>
        </div>

        {/* Grille photos */}
        <main className="container py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((photo, index) => (
              <div key={index} className="group relative isolate aspect-square overflow-hidden rounded-lg cursor-pointer" onClick={() => setLightbox(index)}>
                <img loading="lazy" src={photo.src} alt={photo.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" decoding="async" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <p className="text-white text-center text-sm font-medium">{photo.alt}</p>
                </div>
                <div className="pointer-events-none absolute left-2 top-2 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white text-xs font-bold shadow-md">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img src={filtered[lightbox].src} alt={filtered[lightbox].alt} className="max-w-full max-h-full object-contain rounded-lg" loading="lazy" decoding="async" />
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white text-3xl font-bold">&times;</button>
            {lightbox > 0 && (
              <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold">‹</button>
            )}
            {lightbox < filtered.length - 1 && (
              <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold">›</button>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
