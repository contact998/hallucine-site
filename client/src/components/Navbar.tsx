/**
 * Navigation complète Hallucine
 * Top bar (email, tel, réseaux sociaux) + Menu principal avec dropdowns
 * Reproduit fidèlement la structure du site de référence
 * i18n : textes traduits via react-i18next
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, ChevronDown, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { AvailabilityBadge } from "@/components/AvailabilityIndicator";
import { useTranslation } from "react-i18next";
import { i18n } from "@/i18n/instance"; // instance partagée — initialisée par config.ts (client) ou config.node.ts (SSR)
import { LANGUAGE_DOMAINS, detectLanguage } from "@/i18n/domains";
import { ROUTES } from "@/i18n/routes";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/tWSEvNLkFkmjxAXj.png";

const languages = [
  { code: "fr", label: "FR", flag: "🇫🇷", url: LANGUAGE_DOMAINS.fr },
  { code: "en", label: "EN", flag: "🇬🇧", url: LANGUAGE_DOMAINS.en },
  { code: "de", label: "DE", flag: "🇩🇪", url: LANGUAGE_DOMAINS.de },
  { code: "es", label: "ES", flag: "🇪🇸", url: LANGUAGE_DOMAINS.es },
  { code: "it", label: "IT", flag: "🇮🇹", url: LANGUAGE_DOMAINS.it },
];

const currentLang = detectLanguage();

function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Utiliser i18n.language (réactif) plutôt que la constante statique detectLanguage()
  const activeLang = i18n.language || currentLang;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = languages.find((l) => l.code === activeLang) ?? languages.find((l) => l.code === currentLang) ?? languages[0];
  const others = languages.filter((l) => l.code !== activeLang);

  if (mobile) {
    return (
      <div className="flex items-center gap-2 px-2 py-2">
        {languages.map((lang) => (
          <a
            key={lang.code}
            href={lang.url}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-colors ${
              lang.code === activeLang
                ? "bg-warm/20 text-warm border border-warm/30"
                : "text-white/70 hover:text-warm hover:bg-white/5 border border-white/10"
            }`}
          >
            <span className="text-base leading-none">{lang.flag}</span>
            {lang.label}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-white/15 hover:border-warm/40 transition-colors text-sm text-white/80 hover:text-warm"
        aria-label="Changer de langue"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="font-medium">{current.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-1.5 bg-[oklch(0.16_0.012_260)] border border-white/10 rounded shadow-xl shadow-black/30 overflow-hidden z-50 min-w-[120px]"
          >
            {others.map((lang) => (
              <a
                key={lang.code}
                href={lang.url}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/80 hover:text-warm hover:bg-white/5 transition-colors"
              >
                <span className="text-base leading-none">{lang.flag}</span>
                {lang.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

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
              key={item.label}
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
  const { t } = useTranslation("nav");

  // Routes localisées selon la langue active
  const r = ROUTES[currentLang] ?? ROUTES["fr"];
  // Menu de navigation traduit dynamiquement
  const navItems: NavItem[] = [
    { label: t("accueil"), href: r["home"] },
    {
      label: t("ecran_gonflable"),
      dropdown: [
        { label: t("ecran_geant"), href: r["ecran-geant"] },
        { label: t("comparaison"), href: r["comparaison"] },
        { label: t("ecran_etanche"), href: r["ecran-etanche"] },
        { label: t("ecran_economique"), href: r["ecran-economique"] },
        { label: t("mode_emploi"), href: r["mode-emploi"] },
        { label: t("ecrans_led"), href: r["ecrans-led"] },
      ],
    },
    {
      label: t("tente_arche_meuble"),
      dropdown: [
        { label: t("tentes_x"), href: r["tente-x"] },
        { label: t("tentes_n"), href: r["tente-n"] },
        { label: t("tentes_v"), href: r["tente-v"] },
        { label: t("tentes_araignees"), href: r["tente-araignee"] },
        { label: t("arches"), href: r["arches"] },
        { label: t("mobilier"), href: r["mobilier"] },
      ],
    },
    { label: t("accessoires"), href: r["accessoires"] },
    { label: t("galerie"), href: r["galerie"] },
    { label: t("contactez_nous"), href: r["contact"] },
    {
      label: t("plus"),
      dropdown: [
        { label: t("a_propos"), href: r["a-propos"] },
        { label: t("devis_gratuit"), href: r["contact"] },
        { label: t("mode_emploi"), href: r["mode-emploi"] },
        { label: t("galerie_video"), href: r["galerie-video"] },
        { label: t("blog"), href: r["blog"] },
      ],
    },
  ];

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
      <div className="fixed top-0 left-0 right-0 z-50 bg-[oklch(0.10_0.015_260)] border-b border-white/5 text-xs text-white/70 overflow-visible">
        <div className="container flex items-center justify-between py-1.5">
          <div className="flex items-center gap-4">
            <a href="mailto:contact@hallucine.fr" className="flex items-center gap-1.5 hover:text-warm transition-colors py-1.5">
              <Mail className="w-3 h-3" />
              contact@hallucine.fr
            </a>
            <a href="tel:+33680147694" className="flex items-center gap-1.5 hover:text-warm transition-colors py-1.5">
              <Phone className="w-3 h-3" />
              +33 6 80 14 76 94
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <AvailabilityBadge />
            <div className="w-px h-3 bg-white/20" />
            <a href="https://www.linkedin.com/company/hallucinecran" target="_blank" rel="noopener noreferrer" className="hover:text-warm transition-colors p-2 -m-1.5 inline-flex items-center justify-center" aria-label="LinkedIn">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.facebook.com/Hallucinecran" target="_blank" rel="noopener noreferrer" className="hover:text-warm transition-colors p-2 -m-1.5 inline-flex items-center justify-center" aria-label="Facebook">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.youtube.com/@Hallucinecran" target="_blank" rel="noopener noreferrer" className="hover:text-warm transition-colors p-2 -m-1.5 inline-flex items-center justify-center" aria-label="YouTube">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><polygon fill="oklch(0.12 0.01 260)" points="9.545,15.568 15.818,12 9.545,8.432"/></svg>
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
            <img src={LOGO_URL} alt="Hallucine" className="h-12 md:h-14 w-auto" width={56} height={56} decoding="async" />
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
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <LanguageSwitcher />
            <div className="w-px h-5 bg-white/20" />
            <Link
              href="/devis"
              className="flex items-center gap-2 px-5 py-2 bg-warm text-charcoal font-semibold text-sm rounded hover:bg-warm-light transition-all duration-300"
            >
              {t("devis_gratuit")}
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
                {t("profil")}
              </Link>
            ) : (
              <a
                href={getLoginUrl()}
                className="flex items-center gap-1.5 px-3 py-2 border border-white/20 text-white/80 text-sm rounded hover:border-warm/50 hover:text-warm transition-colors"
              >
                <User className="w-4 h-4" />
                {t("connexion")}
              </a>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden text-white p-2"
            aria-label={mobileOpen ? t("fermer_menu") : t("ouvrir_menu")}
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
                                  key={sub.label}
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
                  href="/devis"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 flex items-center justify-center gap-2 px-6 py-3 bg-warm text-charcoal font-semibold rounded"
                >
                  {t("devis_gratuit")}
                </Link>
                {isAuthenticated && user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 px-6 py-3 bg-warm/10 border border-warm/30 text-warm font-semibold rounded hover:bg-warm/20"
                  >
                    {t("panneau_admin")}
                  </Link>
                )}
                {isAuthenticated ? (
                  <Link
                    href="/profil"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white/80 font-semibold rounded hover:border-warm/50 hover:text-warm"
                  >
                    <User className="w-4 h-4" />
                    {t("mon_profil")}
                  </Link>
                ) : (
                  <a
                    href={getLoginUrl()}
                    className="mt-2 flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white/80 font-semibold rounded hover:border-warm/50 hover:text-warm"
                  >
                    <User className="w-4 h-4" />
                    {t("connexion")}
                  </a>
                )}
                <div className="mt-3 border-t border-white/10 pt-3">
                  <p className="text-xs text-white/50 px-2 mb-2">{t("langue")}</p>
                  <LanguageSwitcher mobile />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
