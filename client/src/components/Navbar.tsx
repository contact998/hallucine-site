/*
 * Design: "Nuit Étoilée" – Navigation multi-pages
 * Logo Hallucine + liens vers pages dédiées + CTA doré
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "wouter";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291384825/NRDnSpRiukeKCoUC.jpg";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Nos Écrans", href: "/ecrans" },
  { label: "Tentes", href: "/tentes" },
  { label: "Mobilier", href: "/mobilier" },
  { label: "Notre Histoire", href: "/notre-histoire" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[oklch(0.14_0.03_260_/_0.95)] backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Hallucine"
            className="h-12 w-auto rounded"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 relative group ${
                location === link.href ? "text-gold" : "text-white/80 hover:text-gold"
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-gold transition-all duration-300 ${
                location === link.href ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
          ))}
        </div>

        {/* CTA Desktop */}
        <Link
          href="/contact"
          className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-gold text-navy-deep font-semibold text-sm rounded-sm hover:bg-gold-light transition-all duration-300 glow-gold"
        >
          <Phone className="w-4 h-4" />
          Demander un devis
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2"
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
            className="lg:hidden bg-[oklch(0.14_0.03_260_/_0.98)] backdrop-blur-md border-t border-white/10"
          >
            <div className="container py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-left text-lg font-medium transition-colors py-2 ${
                    location === link.href ? "text-gold" : "text-white/90 hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-navy-deep font-semibold rounded-sm"
              >
                <Phone className="w-4 h-4" />
                Demander un devis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
