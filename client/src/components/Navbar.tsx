/**
 * Navigation Hallucine — refonte
 *
 * Barre unique épurée (plus de bandeau utilitaire), 5 entrées, mega-menus.
 * Architecture : Accueil · Produits · Réalisations · L'entreprise · Contact.
 * i18n via react-i18next (namespace "nav"), routes localisées via ROUTES[lang].
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, Linkedin, Facebook, Youtube } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { LANGUAGE_DOMAINS, detectLanguage } from "@/i18n/domains";
import { ROUTES, getRouteKey, getHreflangUrls } from "@/i18n/routes";

const LOGO_URL = "https://pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev/assets/ySiqVkOsMSzWfHfu.webp";

const languages = [
  { code: "fr", label: "FR", flag: "🇫🇷", url: LANGUAGE_DOMAINS.fr },
  { code: "en", label: "EN", flag: "🇬🇧", url: LANGUAGE_DOMAINS.en },
  { code: "de", label: "DE", flag: "🇩🇪", url: LANGUAGE_DOMAINS.de },
  { code: "es", label: "ES", flag: "🇪🇸", url: LANGUAGE_DOMAINS.es },
  { code: "it", label: "IT", flag: "🇮🇹", url: LANGUAGE_DOMAINS.it },
];

function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { i18n: langI18n } = useTranslation("nav");
  const activeLang = (langI18n.language || detectLanguage()).split("-")[0];
  const [currentPath] = useLocation();

  const currentRouteKey = getRouteKey(currentPath, activeLang);
  const hreflangUrls = currentRouteKey ? getHreflangUrls(currentRouteKey) : null;

  const getLangUrl = (langCode: string, domainUrl: string): string => {
    const base = hreflangUrls?.[langCode] ?? domainUrl;
    return base.endsWith("/") ? base : base + "/";
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = languages.find((l) => l.code === activeLang) ?? languages[0];
  const others = languages.filter((l) => l.code !== activeLang);

  if (mobile) {
    return (
      <div className="flex items-center gap-2 px-2 py-2">
        {languages.map((lang) => (
          <a
            key={lang.code}
            href={getLangUrl(lang.code, lang.url)}
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
        className="flex items-center gap-1.5 text-sm text-white/65 hover:text-white transition-colors"
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
            className="absolute top-full right-0 mt-2 bg-[oklch(0.16_0.012_260)] border border-white/10 rounded-lg shadow-xl shadow-black/40 overflow-hidden z-50 min-w-[120px]"
          >
            {others.map((lang) => (
              <a
                key={lang.code}
                href={getLangUrl(lang.code, lang.url)}
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

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/hallucinecran", Icon: Linkedin },
  { label: "Facebook", href: "https://www.facebook.com/Hallucinecran", Icon: Facebook },
  { label: "YouTube", href: "https://www.youtube.com/@Hallucinecran", Icon: Youtube },
];

function SocialLinks() {
  return (
    <div className="flex items-center gap-0.5">
      {socials.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="p-1.5 text-white/55 hover:text-warm transition-colors"
        >
          <Icon className="w-[17px] h-[17px]" />
        </a>
      ))}
    </div>
  );
}

interface MenuLink {
  label: string;
  href: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { t, i18n } = useTranslation("nav");

  const currentLang = (i18n.language as keyof typeof ROUTES) || detectLanguage();
  const r = ROUTES[currentLang] ?? ROUTES["fr"];

  // ─── Données des mega-menus ────────────────────────────────────────────────
  const produitsCols: { title: string; items: MenuLink[] }[] = [
    {
      title: t("col_ecrans"),
      items: [
        { label: t("ecran_geant"), href: r["ecran-geant"] },
        { label: t("ecran_etanche"), href: r["ecran-etanche"] },
        { label: t("ecran_economique"), href: r["ecran-economique"] },
        { label: t("drive_in"), href: r["drive-in"] },
        { label: t("ecrans_led"), href: r["ecrans-led"] },
      ],
    },
    {
      title: t("col_tentes"),
      items: [
        { label: t("tentes_x"), href: r["tente-x"] },
        { label: t("tentes_n"), href: r["tente-n"] },
        { label: t("tentes_v"), href: r["tente-v"] },
        { label: t("tentes_araignees"), href: r["tente-araignee"] },
        { label: t("arches"), href: r["arches"] },
        { label: t("mobilier"), href: r["mobilier"] },
      ],
    },
    {
      title: t("col_outils"),
      items: [
        { label: t("accessoires"), href: r["accessoires"] },
        { label: t("packs"), href: r["packs"] },
        { label: t("location"), href: r["location"] },
        { label: t("comparaison"), href: r["comparaison"] },
        { label: t("mode_emploi"), href: r["mode-emploi"] },
      ],
    },
  ];

  const realisations: MenuLink[] = [
    { label: t("galerie"), href: r["galerie"] },
    { label: t("galerie_video"), href: r["galerie-video"] },
    { label: t("etudes_cas"), href: r["etudes-cas"] },
  ];

  const entreprise: MenuLink[] = [
    { label: t("a_propos"), href: r["a-propos"] },
    { label: t("histoire"), href: r["histoire"] },
    { label: t("blog"), href: r["blog"] },
    { label: t("devenir_distributeur"), href: r["devenir-distributeur"] },
    { label: t("trouver_distributeur"), href: r["trouver-distributeur"] },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // ─── Styles partagés ───────────────────────────────────────────────────────
  const topLink =
    "px-4 py-2.5 text-base font-medium text-white/80 hover:text-warm transition-colors";
  const triggerLink =
    "flex items-center gap-1.5 px-4 py-2.5 text-base font-medium text-white/80 group-hover:text-warm transition-colors";
  // Couleur « verre bleu ardoise » partagée — barre + fenêtres de menu
  const glassBg = "bg-[oklch(0.40_0.10_250_/_0.5)] backdrop-blur-xl";
  const panelBox = `${glassBg} border border-white/15 rounded-xl shadow-2xl shadow-black/50`;
  const megaWrap =
    "absolute left-0 top-full pt-3 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[height,background-color,border-color] duration-300 ${
        scrolled
          ? `h-16 ${glassBg} border-b border-white/10`
          : "h-20 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container h-full flex items-center gap-8">
        {/* Logo */}
        <Link href={r["home"]} className="flex items-center shrink-0">
          <img
            src={LOGO_URL}
            alt="Hallucine"
            className="h-11 w-auto"
            width={48}
            height={48}
            decoding="async"
          />
        </Link>

        {/* ─── Navigation desktop ─────────────────────────────────────────── */}
        <nav className="hidden xl:flex items-center gap-0.5 mr-auto">
          <Link
            href={r["home"]}
            className={`${topLink} ${location === r["home"] ? "text-warm" : ""}`}
          >
            {t("accueil")}
          </Link>

          {/* Produits — mega-menu */}
          <div className="group relative">
            <button className={triggerLink}>
              {t("produits")}
              <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <div className={megaWrap}>
              <div className="flex items-start">
                {/* 3 fenêtres — en chevauchement, les 2 dernières décalées */}
                {produitsCols.map((col, i) => (
                  <div
                    key={col.title}
                    className={`${panelBox} w-[220px] p-3 relative z-10 transition-transform duration-200 hover:z-30 hover:-translate-y-2 hover:scale-[1.02] ${
                      i === 0 ? "" : i === 1 ? "-ml-6" : "-ml-6 mt-10"
                    }`}
                  >
                    <p className="px-3 pb-1.5 mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-warm">
                      {col.title}
                    </p>
                    {col.items.map((it) => (
                      <Link
                        key={it.label}
                        href={it.href}
                        className="block px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-white/10 hover:text-warm transition-colors"
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                ))}
                {/* 4e fenêtre — Configurateur, décalée de 2 lignes */}
                <div className={`${panelBox} w-[220px] p-3 relative z-10 -ml-6 mt-20 transition-transform duration-200 hover:z-30 hover:-translate-y-2 hover:scale-[1.02]`}>
                  <p className="px-3 pb-1.5 mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-warm">
                    {t("configurateur")}
                  </p>
                  <p className="px-3 mb-2.5 text-xs text-white/60 leading-relaxed">
                    {t("configurateur_card_desc")}
                  </p>
                  <Link
                    href={r["configurateur"]}
                    className="block mt-1 px-3 py-2 rounded-lg text-[13px] font-semibold text-white bg-white/5 border border-white/10 hover:bg-warm/15 hover:text-warm transition-colors"
                  >
                    {t("configurateur_ecran")} →
                  </Link>
                  <Link
                    href={r["configurateur"]}
                    className="block mt-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-white bg-white/5 border border-white/10 hover:bg-warm/15 hover:text-warm transition-colors"
                  >
                    {t("configurateur_tente")} →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Réalisations */}
          <div className="group relative">
            <button className={triggerLink}>
              {t("realisations")}
              <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <div className={megaWrap}>
              <div className={`${panelBox} w-64 p-3`}>
                <p className="px-3 pb-1.5 mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-warm">
                  {t("col_decouvrir")}
                </p>
                {realisations.map((it) => (
                  <Link
                    key={it.label}
                    href={it.href}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-white/10 hover:text-warm transition-colors"
                  >
                    {it.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* L'entreprise */}
          <div className="group relative">
            <button className={triggerLink}>
              {t("entreprise")}
              <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <div className={megaWrap}>
              <div className={`${panelBox} w-64 p-3`}>
                <p className="px-3 pb-1.5 mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-warm">
                  {t("col_hallucine")}
                </p>
                {entreprise.map((it) => (
                  <Link
                    key={it.label}
                    href={it.href}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-white/10 hover:text-warm transition-colors"
                  >
                    {it.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href={r["contact"]}
            className={`${topLink} ${location === r["contact"] ? "text-warm" : ""}`}
          >
            {t("contact")}
          </Link>
        </nav>

        {/* ─── Actions desktop ────────────────────────────────────────────── */}
        <div className="hidden xl:flex items-center gap-4 shrink-0">
          <SocialLinks />
          <div className="w-px h-5 bg-white/10" />
          <LanguageSwitcher />
          {isAuthenticated && user?.role === "admin" && (
            <Link
              href="/admin"
              className="px-3 py-2 text-sm rounded-lg bg-warm/10 border border-warm/30 text-warm hover:bg-warm/20 transition-colors"
            >
              {t("panneau_admin")}
            </Link>
          )}
          {isAuthenticated && (
            <Link
              href="/profil"
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-white/15 text-white/80 hover:border-warm/50 hover:text-warm transition-colors"
            >
              <User className="w-4 h-4" />
              {t("mon_profil")}
            </Link>
          )}
          <Link
            href={r["contact"]}
            className="px-5 py-2.5 rounded-lg bg-warm text-charcoal font-semibold text-sm hover:bg-warm-light transition-colors"
          >
            {t("devis_gratuit")}
          </Link>
        </div>

        {/* Toggle mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="xl:hidden ml-auto text-white p-2"
          aria-label={mobileOpen ? t("fermer_menu") : t("ouvrir_menu")}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ─── Menu mobile ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden overflow-hidden bg-[oklch(0.11_0.02_260_/_0.98)] backdrop-blur-xl border-t border-white/10"
          >
            <div className="container py-4 max-h-[80vh] overflow-y-auto flex flex-col">
              <Link
                href={r["home"]}
                onClick={() => setMobileOpen(false)}
                className="py-3 px-2 text-base font-medium text-white/90 hover:text-warm border-b border-white/5"
              >
                {t("accueil")}
              </Link>

              <details className="border-b border-white/5">
                <summary className="py-3 px-2 text-base font-medium text-white/90 cursor-pointer">
                  {t("produits")}
                </summary>
                <div className="pb-2">
                  {produitsCols.map((col) => (
                    <div key={col.title}>
                      <p className="px-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-warm">
                        {col.title}
                      </p>
                      {col.items.map((it) => (
                        <Link
                          key={it.label}
                          href={it.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2.5 px-4 text-sm text-white/70 hover:text-warm"
                        >
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <p className="px-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-warm">
                    {t("outils")}
                  </p>
                  <Link
                    href={r["configurateur"]}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 px-4 text-sm text-white/70 hover:text-warm"
                  >
                    {t("configurateur_ecran")}
                  </Link>
                  <Link
                    href={r["configurateur"]}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 px-4 text-sm text-white/70 hover:text-warm"
                  >
                    {t("configurateur_tente")}
                  </Link>
                </div>
              </details>

              <details className="border-b border-white/5">
                <summary className="py-3 px-2 text-base font-medium text-white/90 cursor-pointer">
                  {t("realisations")}
                </summary>
                <div className="pb-2">
                  {realisations.map((it) => (
                    <Link
                      key={it.label}
                      href={it.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2.5 px-4 text-sm text-white/70 hover:text-warm"
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              </details>

              <details className="border-b border-white/5">
                <summary className="py-3 px-2 text-base font-medium text-white/90 cursor-pointer">
                  {t("entreprise")}
                </summary>
                <div className="pb-2">
                  {entreprise.map((it) => (
                    <Link
                      key={it.label}
                      href={it.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2.5 px-4 text-sm text-white/70 hover:text-warm"
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              </details>

              <Link
                href={r["contact"]}
                onClick={() => setMobileOpen(false)}
                className="py-3 px-2 text-base font-medium text-white/90 hover:text-warm border-b border-white/5"
              >
                {t("contact")}
              </Link>

              <Link
                href={r["contact"]}
                onClick={() => setMobileOpen(false)}
                className="mt-4 px-6 py-3 rounded-lg bg-warm text-charcoal font-semibold text-center"
              >
                {t("devis_gratuit")}
              </Link>

              {isAuthenticated && user?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 px-6 py-3 rounded-lg bg-warm/10 border border-warm/30 text-warm font-semibold text-center"
                >
                  {t("panneau_admin")}
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  href="/profil"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 px-6 py-3 rounded-lg border border-white/15 text-white/80 font-semibold text-center flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {t("mon_profil")}
                </Link>
              )}

              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="text-xs text-white/50 px-2 mb-1">{t("langue")}</p>
                <LanguageSwitcher mobile />
                <div className="mt-3 px-2"><SocialLinks /></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
