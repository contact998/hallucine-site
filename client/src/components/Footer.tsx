/*
 * Design: "Nuit Étoilée" – Footer élégant
 * Logo, liens rapides, réseaux sociaux, mentions légales
 */
import { Monitor, Tent, Armchair } from "lucide-react";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/NRDnSpRiukeKCoUC.jpg";

export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-[oklch(0.10_0.03_260)]">
      <div className="container py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <img src={LOGO_URL} alt="Hallucine" className="h-12 w-auto rounded mb-4" />
            <p className="text-white/40 text-sm leading-relaxed">
              Fabricant français d'écrans de cinéma gonflables depuis 1995. Technologie Airtight et soufflerie permanente, de 2m à 24m.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Nos produits</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollTo("#produits")} className="flex items-center gap-2 text-white/50 text-sm hover:text-gold transition-colors">
                  <Monitor className="w-4 h-4" /> Écrans de cinéma
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("#produits")} className="flex items-center gap-2 text-white/50 text-sm hover:text-gold transition-colors">
                  <Tent className="w-4 h-4" /> Tentes gonflables
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("#produits")} className="flex items-center gap-2 text-white/50 text-sm hover:text-gold transition-colors">
                  <Armchair className="w-4 h-4" /> Mobilier gonflable
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: "Accueil", href: "#hero" },
                { label: "Technologie", href: "#technologie" },
                { label: "Notre Histoire", href: "#histoire" },
                { label: "Réalisations", href: "#realisations" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-white/50 text-sm hover:text-gold transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Contact</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              <li>contact@hallucine.fr</li>
              <li>+33 (0)6 XX XX XX XX</li>
              <li>France — Fabrication Dongguan, Chine</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Hallucine. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/30 text-xs hover:text-gold transition-colors">Mentions légales</a>
            <a href="#" className="text-white/30 text-xs hover:text-gold transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
