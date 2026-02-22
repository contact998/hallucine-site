/*
 * Page Accessoires
 * Casques, Transats, Transmetteur FM, Canapé, Cabine de projection, Forfaits AV
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Headphones, Armchair, Radio, Sofa, Monitor, Package } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const accessoires = [
  {
    icon: Headphones,
    title: "Casques",
    img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/UlnOxjTGncpBOJwv.webp",
    desc: "Casque pour tous les événements Hallucine, cinéma en plein air. Obtenez une expérience sonore étonnante pour votre corps et votre âme. Idéal pour les projections silencieuses et les événements en zone résidentielle.",
  },
  {
    icon: Armchair,
    title: "Transats",
    img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/nZmqdOLFPHAaEGsn.webp",
    desc: "Détendez-vous, soyez à l'aise tout en regardant des films, des jeux de sport avec vos amis et votre famille. Nos transats sont conçus pour le confort lors de longues projections en extérieur.",
  },
  {
    icon: Radio,
    title: "Transmetteur FM",
    img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/wmQDsCcnIydTkdEj.webp",
    desc: "Atteignez les gens dans les véhicules à proximité. Délivrez des sons exceptionnels en temps réel pour une expérience de cinéma drive-in. Parfait pour les ciné-parcs et les événements en voiture.",
  },
  {
    icon: Sofa,
    title: "Canapé gonflable",
    img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/zsJNdIWSKKGVEgQI.webp",
    desc: "Facile à gonfler, avec une excellente conception anti-dégonflement. Ces canapés extrêmement durables conviennent à vous, votre famille et vos amis pour tout événement Hallucine.",
  },
  {
    icon: Monitor,
    title: "Cabine de projection",
    img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/shzKbinYJnHLyUdb.webp",
    desc: "La cabine de projection fonctionne parfaitement avec les écrans gonflables d'Hallucine. Placez votre projecteur directement et assurez-vous qu'il est en sécurité pour des effets vidéo étonnants.",
  },
  {
    icon: Package,
    title: "Forfaits AV",
    img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/RNSJXzqcGNnEJwlz.webp",
    desc: "De 50 à plus de 400 personnes, quelle que soit la taille de l'événement, vous pouvez offrir une expérience audio et vidéo étonnante à votre public. Forfaits complets incluant projecteur, son et accessoires.",
    bgWhite: true,
  },
];

export default function Accessoires() {
  useDocumentMeta("Accessoires Cinéma en Plein Air", "Accessoires pour cinéma en plein air : projecteurs, systèmes audio, toiles de rechange, kits de réparation. Tout pour réussir votre événement.", "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/HWQTHYrijbwFXBld.jpg");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-charcoal-light">
        <div className="container">
          <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">Équipement</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
            Accessoires pour<br />
            <span className="text-warm">vos événements</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Complétez votre installation avec nos accessoires professionnels. Casques audio, transats, 
            transmetteurs FM, mobilier gonflable, cabines de projection et forfaits audiovisuels complets.
          </p>
        </div>
      </section>

      {/* Grille accessoires */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accessoires.map((a) => (
              <div key={a.title} className="bg-card border border-border rounded-lg overflow-hidden card-hover">
                <div className={`aspect-[4/3] ${a.bgWhite ? 'bg-white' : 'bg-charcoal-light'}`}>
                  <img src={a.img} alt={`Accessoire Hallucine — ${a.title} pour événements cinéma en plein air`} className="w-full h-full object-contain p-4" loading="lazy" decoding="async" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <a.icon className="w-6 h-6 text-warm" />
                    <h2 className="text-xl font-bold text-ivory">{a.title}</h2>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forfaits détaillés */}
      <section className="py-20 bg-charcoal-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-ivory mb-8">Forfaits audiovisuels</h2>
          <p className="text-white/70 text-lg mb-8 max-w-3xl">
            Nos forfaits AV sont conçus pour s'adapter à toutes les tailles d'événements. 
            Chaque forfait inclut le matériel de projection, le système sonore et les accessoires nécessaires.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Petit événement</h3>
              <p className="text-white/60 text-sm mb-2">Jusqu'à 50 personnes</p>
              <p className="text-white/60 text-sm leading-relaxed">Projecteur HD, système son compact, écran adapté. Idéal pour les soirées privées et petits rassemblements.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Événement moyen</h3>
              <p className="text-white/60 text-sm mb-2">50 à 200 personnes</p>
              <p className="text-white/60 text-sm leading-relaxed">Projecteur haute luminosité, son amplifié, écran moyen à grand format. Pour les événements communautaires et corporate.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-warm font-semibold text-lg mb-3">Grand événement</h3>
              <p className="text-white/60 text-sm mb-2">200 à 400+ personnes</p>
              <p className="text-white/60 text-sm leading-relaxed">Projecteur professionnel, son concert, écran géant. Pour les festivals, drive-in et grands rassemblements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">Besoin d'accessoires pour votre événement ?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Contactez-nous pour composer le forfait idéal pour votre événement.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contactez-nous" className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
              Nous Contacter
            </Link>
            <Link href="/devis" className="px-8 py-3 border border-warm text-warm font-semibold rounded hover:bg-warm/10 transition-colors">
              Demander un devis gratuit
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
