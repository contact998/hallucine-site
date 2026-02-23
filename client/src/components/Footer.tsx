/*
 * Footer complet — Reproduit la structure du site de référence
 * Menu, Restez en contact, Restez connectés (newsletter), SEO Schema.org
 */
import { Mail, Phone, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/RRuPcEubZpMSilcb.webp";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-white/10 bg-[oklch(0.10_0.03_260)]">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand + description */}
          <div>
            <Link href="/">
              <img loading="lazy" src={LOGO_URL} alt="Hallucine" className="h-20 md:h-24 w-auto mb-4" width={96} height={96} decoding="async" />
            </Link>
            <p className="text-white/65 text-sm leading-relaxed">
              Fabricant d'écrans de cinéma gonflables depuis 1995. Les écrans les plus légers au monde, 
              de 2 à 24 mètres. Tentes, arches et mobilier gonflable.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Menu</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Contactez-nous", href: "/contactez-nous" },
                { label: "Devis gratuit", href: "/devis" },
                { label: "À propos", href: "/a-propos-hallucine" },
                { label: "Galerie", href: "/galerie-evenements" },
                { label: "Accessoires", href: "/accessoire-cinema-plein-air" },
                { label: "Mode d'emploi", href: "/mode-emploi" },
                { label: "Galerie vidéo", href: "/galerie-video" },
                { label: "Blog", href: "/blog" },
                { label: "Trouvez un distributeur", href: "/trouver-distributeur" },
                { label: "Devenez distributeur", href: "/devenir-distributeur" },
                { label: "Politique de confidentialité", href: "/politique-confidentialite" },
                { label: "Mentions Légales", href: "/mentions-legales" },
                { label: "Politique de Cookies", href: "/politique-cookies" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 hover:text-warm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Restez en contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Restez en contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-warm mt-0.5 shrink-0" />
                <div>
                  <div className="text-white/75">Tel : +33 4 58 21 20 10</div>
                  <div className="text-white/75 mt-1">Mobile : +33 6 80 14 76 94</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-warm mt-0.5 shrink-0" />
                <div>
                  <div className="text-white/75">WhatsApp : +33 6 80 14 76 94</div>
                  <div className="text-white/75 mt-1">Wechat : Hallucine</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-warm mt-0.5 shrink-0" />
                <div>
                  <a href="mailto:contact@hallucine.fr" className="text-white/75 hover:text-warm transition-colors">
                    contact@hallucine.fr
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Restez connectés (newsletter) */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Restez connectés</h4>
            <p className="text-white/65 text-sm mb-4">
              Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités et offres.
            </p>
            {subscribed ? (
              <p className="text-warm text-sm">Merci pour votre inscription !</p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-ivory placeholder:text-white/40 focus:border-warm focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-warm text-charcoal text-sm font-semibold rounded hover:bg-warm-light transition-colors shrink-0"
                >
                  Transmettre
                </button>
              </form>
            )}

            {/* Réseaux sociaux */}
            <div className="mt-6 flex gap-3">
              <a href="https://www.linkedin.com/company/hallucine" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center rounded bg-white/5 hover:bg-warm/20 text-white/70 hover:text-warm transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://www.facebook.com/hallucine" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center rounded bg-white/5 hover:bg-warm/20 text-white/70 hover:text-warm transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.youtube.com/@hallucine" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center rounded bg-white/5 hover:bg-warm/20 text-white/70 hover:text-warm transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><polygon fill="oklch(0.12 0.01 260)" points="9.545,15.568 15.818,12 9.545,8.432"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-xs">
            &copy; {new Date().getFullYear()} Hallucine. Tous droits réservés. Fabricant d'écrans de cinéma gonflables depuis 1995.
          </p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="text-white/50 text-xs hover:text-warm transition-colors">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="text-white/50 text-xs hover:text-warm transition-colors">Politique de confidentialité</Link>
            <Link href="/politique-cookies" className="text-white/50 text-xs hover:text-warm transition-colors">Cookies</Link>
          </div>
        </div>
      </div>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Hallucine",
            "url": "https://hallucine.fr",
            "logo": LOGO_URL,
            "description": "Fabricant d'écrans de cinéma gonflables depuis 1995. Écrans de 2 à 24 mètres, tentes, arches et mobilier gonflable.",
            "foundingDate": "1995",
            "email": "contact@hallucine.fr",
            "telephone": "+33458212010",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "FR"
            },
            "areaServed": "Worldwide",
            "sameAs": [
              "https://www.linkedin.com/company/hallucine",
              "https://www.facebook.com/hallucine",
              "https://www.youtube.com/@hallucine"
            ]
          })
        }}
      />
    </footer>
  );
}
