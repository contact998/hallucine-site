/*
 * Footer — Enrichi avec description, liens complets, SEO Schema.org
 */
import { Monitor, Tent, Armchair, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/NRDnSpRiukeKCoUC.jpg";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[oklch(0.10_0.03_260)]">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/">
              <img src={LOGO_URL} alt="Hallucine — Écrans de cinéma gonflables" className="h-12 w-auto rounded mb-4" />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              Fabricant français d'écrans de cinéma gonflables depuis 1995. Nos écrans utilisent des tissus techniques issus du kitesurf et de l'industrie automobile pour être 3 fois plus légers que la concurrence. De 2 à 24 mètres de large, garantis 10 ans.
            </p>
            <p className="text-white/40 text-sm leading-relaxed">
              Nous fabriquons également des tentes et du mobilier gonflable avec la même technologie étanche à chambre à air scellée.
            </p>
          </div>

          {/* Produits */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Nos produits</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/ecrans" className="flex items-center gap-2 text-white/50 text-sm hover:text-gold transition-colors">
                  <Monitor className="w-4 h-4" /> Écrans de cinéma
                </Link>
              </li>
              <li>
                <Link href="/tentes" className="flex items-center gap-2 text-white/50 text-sm hover:text-gold transition-colors">
                  <Tent className="w-4 h-4" /> Tentes gonflables
                </Link>
              </li>
              <li>
                <Link href="/mobilier" className="flex items-center gap-2 text-white/50 text-sm hover:text-gold transition-colors">
                  <Armchair className="w-4 h-4" /> Mobilier & Accessoires
                </Link>
              </li>
            </ul>

            <h4 className="text-white font-semibold text-sm mt-8 mb-4 tracking-wide uppercase">L'entreprise</h4>
            <ul className="space-y-3">
              {[
                { label: "Accueil", href: "/" },
                { label: "Notre Histoire", href: "/notre-histoire" },
                { label: "Contact & Devis", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/50 text-sm hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <div className="text-white/60">contact@hallucine.fr</div>
                  <div className="text-white/30 text-xs mt-0.5">Réponse sous 24h</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <div className="text-white/60">+33 (0)6 XX XX XX XX</div>
                  <div className="text-white/30 text-xs mt-0.5">Lun–Ven, 2h–11h (heure de Paris)</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <div className="text-white/60">Bureau : Shenzhen, Chine</div>
                  <div className="text-white/30 text-xs mt-0.5">Fabrication : Dongguan, Chine</div>
                </div>
              </li>
            </ul>

            <div className="mt-6 p-3 border border-gold/20 rounded-sm bg-gold/5">
              <p className="text-gold/80 text-xs leading-relaxed">
                Livraison mondiale — Europe, Asie, Amérique, Afrique, Océanie. Nous gérons les formalités douanières.
              </p>
            </div>
          </div>

          {/* Garanties */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Nos garanties</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gold">—</span>
                <span>Garantie 10 ans sur la structure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold">—</span>
                <span>Devis gratuit et sans engagement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold">—</span>
                <span>Fabrication contrôlée sur place</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold">—</span>
                <span>SAV et pièces détachées</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold">—</span>
                <span>Conseil technique personnalisé</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Hallucine. Tous droits réservés. Fabricant français d'écrans de cinéma gonflables depuis 1995.
          </p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="text-white/30 text-xs hover:text-gold transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="text-white/30 text-xs hover:text-gold transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>

      {/* Schema.org JSON-LD — SEO structuré */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Hallucine",
            "url": "https://hallucine.fr",
            "logo": LOGO_URL,
            "description": "Fabricant français d'écrans de cinéma gonflables depuis 1995. Écrans de 2 à 24 mètres, tentes et mobilier gonflable. Technologie étanche et soufflerie. Garantie 10 ans.",
            "foundingDate": "1995",
            "email": "contact@hallucine.fr",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Shenzhen",
              "addressCountry": "CN"
            },
            "areaServed": "Worldwide",
            "sameAs": [],
            "makesOffer": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "Écran de cinéma gonflable étanche",
                  "description": "Écran de cinéma gonflable à chambre à air scellée, de 2 à 8 mètres. Tissu polyamide de kitesurf, sans soufflerie, garantie 10 ans."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "Écran de cinéma gonflable soufflerie",
                  "description": "Écran de cinéma gonflable à soufflerie permanente, de 5 à 24 mètres. Tissu polyamide d'airbag automobile, garantie 10 ans."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "Tente gonflable étanche",
                  "description": "Tente gonflable à chambre à air scellée. Montage rapide, sans soufflerie, personnalisable."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "Mobilier gonflable",
                  "description": "Canapés, fauteuils, bars et comptoirs gonflables pour événements. Technologie étanche."
                }
              }
            ]
          })
        }}
      />
    </footer>
  );
}
