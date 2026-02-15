/*
 * Navigation complète Hallucine
 * Top bar (email, tel, réseaux sociaux) + Menu principal avec dropdowns
 * Reproduit fidèlement la structure du site de référence
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, ChevronDown, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/fCazlcDpANMEbcFp.png";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Ecran gonflable",
    dropdown: [
      { label: "Écran gonflable géant (soufflerie)", href: "/ecran-gonflable-geant-soufflerie" },
      { label: "Comparaison", href: "/comparaison-ecran-gonflable" },
      { label: "Écran gonflable étanche à l'air", href: "/ecran-gonflable-etanche-air" },
      { label: "Écran économique", href: "/ecran-gonflable-economique" },
      { label: "Mode d'emploi", href: "/mode-emploi" },
      { label: "Écrans LED", href: "/ecrans-led" },
    ],
  },
  {
    label: "Tente Arche & Meuble",
    dropdown: [
      { label: "Tentes X", href: "/tente-gonflable-x" },
      { label: "Tentes N", href: "/tente-gonflable-n" },
      { label: "Tentes V", href: "/tente-gonflable-v" },
      { label: "Tentes araignées", href: "/tente-gonflable-araignee" },
      { label: "Arches gonflables", href: "/arche-gonflable" },
      { label: "Mobilier gonflable", href: "/mobilier-gonflable" },
    ],
  },
  { label: "Accessoires", href: "/accessoire-cinema-plein-air" },
  { label: "Galerie", href: "/galerie-evenements" },
  { label: "Contactez-nous", href: "/contactez-nous" },
  {
    label: "Plus",
    dropdown: [
      { label: "À propos", href: "/a-propos-hallucine" },
      { label: "Demande de prix", href: "/tarifs-ecran-gonflable" },
      { label: "Mode d'emploi", href: "/mode-emploi" },
      { label: "Galerie vidéo", href: "/galerie-video" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

function DesktopDropdown({ items, isOpen }: { items: DropdownItem[]; isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 mt-2 w-64 bg-[oklch(0.16_0.012_260)] border border-white/10 rounded shadow-xl shadow-black/30 overflow-hidden z-50"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-sm text-white/80 hover:text-warm hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [location] = useLocation();
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[oklch(0.10_0.015_260)] border-b border-white/5 text-xs text-white/60">
        <div className="container flex items-center justify-between py-1.5">
          <div className="flex items-center gap-4">
            <a href="mailto:contact@hallucine.fr" className="flex items-center gap-1.5 hover:text-warm transition-colors">
              <Mail className="w-3 h-3" />
              contact@hallucine.fr
            </a>
            <a href="tel:+33680147694" className="flex items-center gap-1.5 hover:text-warm transition-colors">
              <Phone className="w-3 h-3" />
              +33 6 80 14 76 94
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <a href="https://www.linkedin.com/company/hallucine" target="_blank" rel="noopener noreferrer" className="hover:text-warm transition-colors" aria-label="LinkedIn">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.facebook.com/hallucine" target="_blank" rel="noopener noreferrer" className="hover:text-warm transition-colors" aria-label="Facebook">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.youtube.com/@hallucine" target="_blank" rel="noopener noreferrer" className="hover:text-warm transition-colors" aria-label="YouTube">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><polygon fill="oklch(0.12 0.01 260)" points="9.545,15.568 15.818,12 9.545,8.432"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav
        className={`fixed top-[30px] left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[oklch(0.14_0.03_260_/_0.95)] backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-[oklch(0.12_0.015_260_/_0.85)] backdrop-blur-sm"
        }`}
      >
        <div className="container flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img src={LOGO_URL} alt="Hallucine" className="h-10 w-auto rounded" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                onMouseLeave={() => item.dropdown && handleMouseLeave()}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-300 rounded ${
                      location === item.href ? "text-warm" : "text-white/80 hover:text-warm"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-300 rounded ${
                      openDropdown === item.label ? "text-warm" : "text-white/80 hover:text-warm"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`} />
                  </button>
                )}
                {item.dropdown && (
                  <DesktopDropdown items={item.dropdown} isOpen={openDropdown === item.label} />
                )}
              </div>
            ))}
          </div>

          {/* CTA Desktop + Profil */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <Link
              href="/tarifs-ecran-gonflable"
              className="flex items-center gap-2 px-5 py-2 bg-warm text-charcoal font-semibold text-sm rounded hover:bg-warm-light transition-all duration-300"
            >
              Demande de prix
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-2 bg-warm/10 border border-warm/30 text-warm text-sm rounded hover:bg-warm/20 transition-colors"
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <Link
                href="/profil"
                className="flex items-center gap-1.5 px-3 py-2 border border-white/20 text-white/80 text-sm rounded hover:border-warm/50 hover:text-warm transition-colors"
              >
                <User className="w-4 h-4" />
                Profil
              </Link>
            ) : (
              <a
                href={getLoginUrl()}
                className="flex items-center gap-1.5 px-3 py-2 border border-white/20 text-white/80 text-sm rounded hover:border-warm/50 hover:text-warm transition-colors"
              >
                <User className="w-4 h-4" />
                Connexion
              </a>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden text-white p-2"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-[oklch(0.14_0.03_260_/_0.98)] backdrop-blur-md border-t border-white/10 max-h-[80vh] overflow-y-auto"
            >
              <div className="container py-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block py-3 px-2 text-base font-medium transition-colors ${
                          location === item.href ? "text-warm" : "text-white/90 hover:text-warm"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                          className="flex items-center justify-between w-full py-3 px-2 text-base font-medium text-white/90 hover:text-warm transition-colors"
                        >
                          {item.label}
                          <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === item.label && item.dropdown && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 border-l border-white/10 ml-2"
                            >
                              {item.dropdown.map((sub) => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="block py-2.5 px-2 text-sm text-white/70 hover:text-warm transition-colors"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                ))}
                <Link
                  href="/tarifs-ecran-gonflable"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 flex items-center justify-center gap-2 px-6 py-3 bg-warm text-charcoal font-semibold rounded"
                >
                  Demande de prix
                </Link>
                {isAuthenticated && user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 px-6 py-3 bg-warm/10 border border-warm/30 text-warm font-semibold rounded hover:bg-warm/20"
                  >
                    Panneau Admin
                  </Link>
                )}
                {isAuthenticated ? (
                  <Link
                    href="/profil"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white/80 font-semibold rounded hover:border-warm/50 hover:text-warm"
                  >
                    <User className="w-4 h-4" />
                    Mon Profil
                  </Link>
                ) : (
                  <a
                    href={getLoginUrl()}
                    className="mt-2 flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white/80 font-semibold rounded hover:border-warm/50 hover:text-warm"
                  >
                    <User className="w-4 h-4" />
                    Connexion
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
