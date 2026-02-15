/*
 * SmartForm — "Le Devis en Douceur"
 * Formulaire unifié intelligent en 6 étapes progressives
 * Chaque étape se dévoile après la précédente, comme une conversation
 * IA : auto-complétion entreprise depuis domaine email, API gouv.fr pour code postal
 *
 * Props :
 *  - preselectedProduct : pré-sélectionne le produit (sur les pages produits)
 *  - preselectedSize : pré-sélectionne la taille d'écran
 *  - mode : "full" (page d'accueil) | "gate" (page tarifs) | "compact" (sidebar/modal)
 *  - onSubmitSuccess : callback après soumission réussie
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor, Tent, Armchair, Trophy, ArrowRight, ArrowLeft, Send, CheckCircle,
  Mail, Phone, MapPin, Building2, User, Globe, MessageSquare, Loader2, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

// ─── Types ─────────────────────────────────────────────────────────────────────
type ProductType = "ecran" | "tente" | "mobilier" | "arche" | null;

interface SmartFormProps {
  preselectedProduct?: ProductType;
  preselectedSize?: string;
  mode?: "full" | "gate" | "compact";
  onSubmitSuccess?: () => void;
}

// ─── Données statiques ─────────────────────────────────────────────────────────
const products = [
  { type: "ecran" as const, icon: Monitor, label: "Écran de cinéma", desc: "De 5m à 24m, étanche ou soufflerie", color: "text-gold" },
  { type: "tente" as const, icon: Tent, label: "Tente gonflable", desc: "Événementielle, publicitaire, médicale", color: "text-blue-400" },
  { type: "mobilier" as const, icon: Armchair, label: "Mobilier gonflable", desc: "Canapés, fauteuils, tables design", color: "text-emerald-400" },
  { type: "arche" as const, icon: Trophy, label: "Arche gonflable", desc: "Course, sport, événement, publicité", color: "text-purple-400" },
];

const screenCategories = [
  { value: "5-8m", label: "5 à 8m", audience: "100 à 400 spectateurs", tech: "Étanche", icon: "🎬" },
  { value: "9-10m", label: "9 à 10m", audience: "~800 spectateurs", tech: "Soufflerie", icon: "🎥" },
  { value: "11-12m", label: "11 à 12m", audience: "~1 500 spectateurs", tech: "Soufflerie", icon: "🎪" },
  { value: "13-14m", label: "13 à 14m", audience: "~2 000 spectateurs", tech: "Soufflerie", icon: "🏟️" },
  { value: "15-24m", label: "15 à 24m", audience: "3 000 à 5 000+ spectateurs", tech: "Soufflerie", icon: "🌍" },
];

const tentTypes = [
  { value: "evenementielle", label: "Événementielle" },
  { value: "publicitaire", label: "Publicitaire" },
  { value: "medicale", label: "Médicale / Urgence" },
  { value: "autre_tente", label: "Autre" },
];

const mobilierTypes = [
  { value: "canape", label: "Canapé" },
  { value: "fauteuil", label: "Fauteuil" },
  { value: "table", label: "Table" },
  { value: "autre_mobilier", label: "Autre" },
];

const archeUsages = [
  { value: "course_sport", label: "Course / Sport" },
  { value: "evenement", label: "Événement" },
  { value: "publicitaire", label: "Publicitaire" },
  { value: "autre_arche", label: "Autre" },
];

const popularCountries = [
  "France", "Belgique", "Suisse", "Canada", "Maroc", "Tunisie", "Algérie",
  "Sénégal", "Côte d'Ivoire", "Cameroun", "Madagascar", "Allemagne",
  "Espagne", "Italie", "Royaume-Uni", "États-Unis", "Chine", "Japon",
  "Émirats arabes unis", "Arabie saoudite", "Brésil", "Mexique", "Australie",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Détecte le pays du visiteur via la timezone du navigateur */
function detectCountryFromTimezone(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzCountryMap: Record<string, string> = {
    "Europe/Paris": "France", "Europe/Brussels": "Belgique", "Europe/Zurich": "Suisse",
    "America/Toronto": "Canada", "America/Montreal": "Canada", "Africa/Casablanca": "Maroc",
    "Africa/Tunis": "Tunisie", "Africa/Algiers": "Algérie", "Africa/Dakar": "Sénégal",
    "Africa/Abidjan": "Côte d'Ivoire", "Africa/Douala": "Cameroun",
    "Europe/Berlin": "Allemagne", "Europe/Madrid": "Espagne", "Europe/Rome": "Italie",
    "Europe/London": "Royaume-Uni", "America/New_York": "États-Unis",
    "America/Chicago": "États-Unis", "America/Los_Angeles": "États-Unis",
    "Asia/Shanghai": "Chine", "Asia/Tokyo": "Japon", "Asia/Dubai": "Émirats arabes unis",
    "America/Sao_Paulo": "Brésil", "America/Mexico_City": "Mexique",
    "Australia/Sydney": "Australie", "Indian/Antananarivo": "Madagascar",
  };
  return tzCountryMap[tz] || "";
}

/** Détecte l'indicatif téléphonique depuis le pays */
function getPhonePrefix(country: string): string {
  const prefixes: Record<string, string> = {
    "France": "+33", "Belgique": "+32", "Suisse": "+41", "Canada": "+1",
    "Maroc": "+212", "Tunisie": "+216", "Algérie": "+213", "Sénégal": "+221",
    "Côte d'Ivoire": "+225", "Cameroun": "+237", "Madagascar": "+261",
    "Allemagne": "+49", "Espagne": "+34", "Italie": "+39", "Royaume-Uni": "+44",
    "États-Unis": "+1", "Chine": "+86", "Japon": "+81",
    "Émirats arabes unis": "+971", "Arabie saoudite": "+966",
    "Brésil": "+55", "Mexique": "+52", "Australie": "+61",
  };
  return prefixes[country] || "";
}

/** Extrait le domaine d'un email */
function getDomainFromEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return "";
  const domain = parts[1].toLowerCase();
  // Ignorer les domaines génériques
  const genericDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com", "icloud.com", "aol.com", "protonmail.com", "mail.com", "orange.fr", "free.fr", "sfr.fr", "laposte.net", "wanadoo.fr"];
  if (genericDomains.includes(domain)) return "";
  return domain;
}

// ─── Composant SmartForm ───────────────────────────────────────────────────────
export default function SmartForm({ preselectedProduct, preselectedSize, mode = "full", onSubmitSuccess }: SmartFormProps) {
  // Lire les query params (pré-remplissage depuis le chatbot IA)
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const qProduct = (urlParams?.get("product") as ProductType) || preselectedProduct || null;
  const qSize = urlParams?.get("size") || preselectedSize || "";
  const qName = urlParams?.get("name") || "";
  const qEmail = urlParams?.get("email") || "";
  const qPhone = urlParams?.get("phone") || "";
  const qCompany = urlParams?.get("company") || "";
  const qCity = urlParams?.get("city") || "";
  const qCountry = urlParams?.get("country") || "";

  // Calculer l'étape initiale en fonction des données pré-remplies
  const getInitialStep = () => {
    if (qEmail) return 4; // Si on a l'email, aller directement à nom/entreprise
    if (qProduct) return 2; // Si on a le produit, aller au besoin
    return 1;
  };

  // Étapes : 1=produit, 2=besoin, 3=email+tel, 4=nom+entreprise, 5=localisation, 6=message
  const [currentStep, setCurrentStep] = useState(getInitialStep);
  const totalSteps = 6;

  // Séparer prénom/nom depuis qName
  const nameParts = qName.split(" ");
  const initialPrenom = nameParts[0] || "";
  const initialNom = nameParts.slice(1).join(" ") || "";

  // Données formulaire
  const [product, setProduct] = useState<ProductType>(qProduct);
  const [productDetail, setProductDetail] = useState(qSize);
  const [email, setEmail] = useState(qEmail);
  const [phone, setPhone] = useState(qPhone);
  const [prenom, setPrenom] = useState(initialPrenom);
  const [nom, setNom] = useState(initialNom);
  const [entreprise, setEntreprise] = useState(qCompany);
  const [country, setCountry] = useState(qCountry);
  const [city, setCity] = useState(qCity);
  const [postalCode, setPostalCode] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // IA states
  const [aiSuggestingCompany, setAiSuggestingCompany] = useState(false);
  const [aiCompanySuggestion, setAiCompanySuggestion] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [countryFiltered, setCountryFiltered] = useState<string[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const postalCodeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-detect country on mount
  useEffect(() => {
    const detected = detectCountryFromTimezone();
    if (detected) {
      setCountry(detected);
      setPhone(getPhonePrefix(detected) + " ");
    }
  }, []);

  // Auto-suggest company from email domain
  useEffect(() => {
    if (email.length < 5 || !email.includes("@")) return;
    const domain = getDomainFromEmail(email);
    if (!domain) return;

    setAiSuggestingCompany(true);
    // Simple heuristic: capitalize domain name without TLD
    const companyGuess = domain.split(".")[0]
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
    
    setTimeout(() => {
      setAiCompanySuggestion(companyGuess);
      setAiSuggestingCompany(false);
    }, 500);
  }, [email]);

  // API gouv.fr : auto-complétion ville depuis code postal (France uniquement)
  useEffect(() => {
    if (country !== "France" || postalCode.length < 5) {
      setCitySuggestions([]);
      return;
    }

    if (postalCodeTimeoutRef.current) clearTimeout(postalCodeTimeoutRef.current);

    postalCodeTimeoutRef.current = setTimeout(async () => {
      setLoadingCities(true);
      try {
        // Nouvelle API Géoplateforme (remplace api-adresse.data.gouv.fr)
        const res = await fetch(`https://data.geopf.fr/geocodage/search/?q=${postalCode}&type=municipality&postcode=${postalCode}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          const cities = data.features?.map((f: { properties: { city?: string; name?: string } }) => f.properties.city || f.properties.name).filter(Boolean) || [];
          setCitySuggestions(cities);
          if (cities.length === 1) {
            setCity(cities[0]);
          }
        }
      } catch {
        // Fallback silencieux
      } finally {
        setLoadingCities(false);
      }
    }, 400);

    return () => {
      if (postalCodeTimeoutRef.current) clearTimeout(postalCodeTimeoutRef.current);
    };
  }, [postalCode, country]);

  // Country filter
  const handleCountryInput = useCallback((val: string) => {
    setCountry(val);
    if (val.length > 0) {
      const filtered = popularCountries.filter(c => c.toLowerCase().includes(val.toLowerCase()));
      setCountryFiltered(filtered);
      setShowCountryDropdown(filtered.length > 0);
    } else {
      setShowCountryDropdown(false);
    }
  }, []);

  const selectCountry = useCallback((c: string) => {
    setCountry(c);
    setShowCountryDropdown(false);
    // Update phone prefix
    const prefix = getPhonePrefix(c);
    if (prefix && !phone.startsWith(prefix)) {
      setPhone(prefix + " ");
    }
  }, [phone]);

  // Mutation tRPC
  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Votre demande a bien été envoyée !");
      onSubmitSuccess?.();
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors de l'envoi. Veuillez réessayer.");
    },
  });

  const handleSubmit = () => {
    if (!email) {
      toast.error("Veuillez renseigner votre email.");
      return;
    }

    const productLabels: Record<string, string> = {
      ecran: "Écran de cinéma",
      tente: "Tente gonflable",
      mobilier: "Mobilier gonflable",
      arche: "Arche gonflable",
    };
    const productLabel = product ? `${productLabels[product]} — ${productDetail}` : "Non précisé";
    const fullName = [prenom, nom].filter(Boolean).join(" ") || "Non renseigné";
    const location = [city, postalCode, country].filter(Boolean).join(", ");

    submitMutation.mutate({
      type: "devis",
      nom: fullName,
      email,
      telephone: phone?.trim() || undefined,
      entreprise: entreprise || undefined,
      sujet: `${productLabel} — ${location}`,
      message: message || undefined,
      produit: productLabel,
      objectif: productDetail || undefined,
    });
  };

  // Navigation
  const goNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      // Scroll to form top on mobile
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
    }
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return product !== null;
      case 2: return productDetail !== "";
      case 3: return email.includes("@") && email.includes(".");
      case 4: return true; // Optionnel
      case 5: return true; // Optionnel
      case 6: return true;
      default: return false;
    }
  };

  // ─── Animations ──────────────────────────────────────────────────────────────
  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  const inputClass = "w-full p-3 bg-white/[0.05] border border-white/10 rounded-sm text-white text-sm placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors";
  const labelClass = "text-white/60 text-sm mb-1.5 block";

  // ─── Rendu ───────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div ref={formRef} className="text-center py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5 }}>
          <CheckCircle className="w-16 h-16 text-gold mx-auto mb-6" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Merci{prenom ? ` ${prenom}` : ""} !
        </h3>
        <p className="text-white/60">
          Nous avons bien reçu votre demande. Notre équipe vous répondra dans les 24 heures.
        </p>
        <p className="text-white/40 text-sm mt-4">
          Un email de confirmation a été envoyé à {email}
        </p>
      </div>
    );
  }

  return (
    <div ref={formRef} className={mode === "compact" ? "" : ""}>
      {/* Progress bar */}
      <div className="flex items-center gap-1.5 mb-6">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
          <div key={s} className="flex-1">
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                s < currentStep ? "bg-gold" : s === currentStep ? "bg-gold/70" : "bg-white/10"
              }`}
            />
          </div>
        ))}
        <span className="text-white/40 text-xs ml-2 whitespace-nowrap">{currentStep}/{totalSteps}</span>
      </div>

      <AnimatePresence mode="wait">
        {/* ─── ÉTAPE 1 : Choix du produit ─────────────────────────────────── */}
        {currentStep === 1 && (
          <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-1">Quel produit vous intéresse ?</h3>
            <p className="text-white/50 text-sm mb-5">Sélectionnez pour commencer votre demande de devis.</p>
            <div className="grid grid-cols-2 gap-3">
              {products.map((p) => (
                <button
                  key={p.type}
                  onClick={() => { setProduct(p.type); goNext(); }}
                  className={`flex flex-col items-center gap-2 p-4 border rounded-sm transition-all duration-300 text-center hover:scale-[1.02] ${
                    product === p.type ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/30 bg-white/[0.02]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center ${p.color}`}>
                    <p.icon className="w-5 h-5" />
                  </div>
                  <div className="text-white font-semibold text-sm">{p.label}</div>
                  <div className="text-white/40 text-xs leading-tight">{p.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── ÉTAPE 2 : Besoin spécifique ────────────────────────────────── */}
        {currentStep === 2 && (
          <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            {product === "ecran" && (
              <>
                <h3 className="text-xl font-bold text-white mb-1">Pour combien de spectateurs ?</h3>
                <p className="text-white/50 text-sm mb-5">La taille d'écran s'adapte à votre audience.</p>
                <div className="space-y-2">
                  {screenCategories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => { setProductDetail(cat.value); }}
                      className={`w-full flex items-center gap-4 p-3.5 border rounded-sm transition-all duration-300 text-left ${
                        productDetail === cat.value ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/30 bg-white/[0.02]"
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div className="flex-1">
                        <div className="text-white font-semibold text-sm">{cat.label}</div>
                        <div className="text-white/40 text-xs">{cat.audience}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        cat.tech === "Étanche" ? "bg-gold/10 text-gold" : "bg-blue-400/10 text-blue-400"
                      }`}>
                        {cat.tech}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {product === "tente" && (
              <>
                <h3 className="text-xl font-bold text-white mb-1">Quel type de tente ?</h3>
                <p className="text-white/50 text-sm mb-5">Sélectionnez l'usage principal.</p>
                <div className="grid grid-cols-2 gap-2">
                  {tentTypes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setProductDetail(t.value)}
                      className={`p-3.5 border rounded-sm text-center transition-all duration-300 ${
                        productDetail === t.value ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/30 bg-white/[0.02]"
                      }`}
                    >
                      <div className="text-white font-semibold text-sm">{t.label}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {product === "mobilier" && (
              <>
                <h3 className="text-xl font-bold text-white mb-1">Quel type de mobilier ?</h3>
                <p className="text-white/50 text-sm mb-5">Sélectionnez le type de mobilier souhaité.</p>
                <div className="grid grid-cols-2 gap-2">
                  {mobilierTypes.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setProductDetail(m.value)}
                      className={`p-3.5 border rounded-sm text-center transition-all duration-300 ${
                        productDetail === m.value ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/30 bg-white/[0.02]"
                      }`}
                    >
                      <div className="text-white font-semibold text-sm">{m.label}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {product === "arche" && (
              <>
                <h3 className="text-xl font-bold text-white mb-1">Quel usage pour l'arche ?</h3>
                <p className="text-white/50 text-sm mb-5">Sélectionnez l'usage principal.</p>
                <div className="grid grid-cols-2 gap-2">
                  {archeUsages.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => setProductDetail(a.value)}
                      className={`p-3.5 border rounded-sm text-center transition-all duration-300 ${
                        productDetail === a.value ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/30 bg-white/[0.02]"
                      }`}
                    >
                      <div className="text-white font-semibold text-sm">{a.label}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-sm hover:border-white/30 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gold text-navy-deep font-semibold text-sm rounded-sm hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── ÉTAPE 3 : Email + Téléphone ────────────────────────────────── */}
        {currentStep === 3 && (
          <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-1">Comment vous joindre ?</h3>
            <p className="text-white/50 text-sm mb-5">Nous vous répondrons sous 24h.</p>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  <Mail className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className={inputClass}
                  autoFocus
                />
              </div>
              <div>
                <label className={labelClass}>
                  <Phone className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />Téléphone
                  <span className="text-white/30 ml-1">(recommandé)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-sm hover:border-white/30 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gold text-navy-deep font-semibold text-sm rounded-sm hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── ÉTAPE 4 : Nom + Entreprise ─────────────────────────────────── */}
        {currentStep === 4 && (
          <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-1">Et vous êtes ?</h3>
            <p className="text-white/50 text-sm mb-5">Ces informations nous aident à personnaliser votre devis.</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>
                    <User className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />Prénom
                  </label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Jean"
                    className={inputClass}
                    autoFocus
                  />
                </div>
                <div>
                  <label className={labelClass}>Nom</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Dupont"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  <Building2 className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />Entreprise / Organisation
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={entreprise}
                    onChange={(e) => setEntreprise(e.target.value)}
                    placeholder="Nom de votre structure"
                    className={inputClass}
                  />
                  {aiSuggestingCompany && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                    </div>
                  )}
                  {aiCompanySuggestion && !entreprise && (
                    <button
                      onClick={() => { setEntreprise(aiCompanySuggestion); setAiCompanySuggestion(""); }}
                      className="mt-1.5 flex items-center gap-1.5 text-xs text-gold/70 hover:text-gold transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      Suggestion IA : {aiCompanySuggestion} — cliquez pour accepter
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-sm hover:border-white/30 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <button
                onClick={goNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gold text-navy-deep font-semibold text-sm rounded-sm hover:bg-gold-light transition-colors"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── ÉTAPE 5 : Localisation ─────────────────────────────────────── */}
        {currentStep === 5 && (
          <motion.div key="step5" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-1">Où êtes-vous basé ?</h3>
            <p className="text-white/50 text-sm mb-5">Pour adapter notre offre à votre région.</p>

            <div className="space-y-4">
              <div className="relative">
                <label className={labelClass}>
                  <Globe className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />Pays
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => handleCountryInput(e.target.value)}
                  onFocus={() => { if (country) handleCountryInput(country); }}
                  onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                  placeholder="Commencez à taper..."
                  className={inputClass}
                  autoFocus
                />
                {showCountryDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-[oklch(0.16_0.012_260)] border border-white/10 rounded-sm shadow-lg max-h-40 overflow-y-auto">
                    {countryFiltered.map((c) => (
                      <button
                        key={c}
                        onMouseDown={() => selectCountry(c)}
                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gold/10 transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {country === "France" && (
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>
                      <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />Code postal
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        placeholder="75001"
                        maxLength={5}
                        className={inputClass}
                      />
                      {loadingCities && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="w-4 h-4 text-gold animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <label className={labelClass}>Ville</label>
                    {citySuggestions.length > 1 ? (
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Sélectionnez</option>
                        {citySuggestions.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={citySuggestions.length === 1 ? citySuggestions[0] : "Ville"}
                        className={inputClass}
                      />
                    )}
                  </div>
                </div>
              )}

              {country !== "France" && (
                <div>
                  <label className={labelClass}>
                    <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />Ville
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Votre ville"
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-sm hover:border-white/30 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <button
                onClick={goNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gold text-navy-deep font-semibold text-sm rounded-sm hover:bg-gold-light transition-colors"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── ÉTAPE 6 : Message libre + Envoi ────────────────────────────── */}
        {currentStep === 6 && (
          <motion.div key="step6" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-1">Un détail à ajouter ?</h3>
            <p className="text-white/50 text-sm mb-5">Optionnel — date d'événement, budget, contraintes...</p>

            <div>
              <label className={labelClass}>
                <MessageSquare className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />Message
                <span className="text-white/30 ml-1">(optionnel)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder={
                  product === "ecran" ? "Date de l'événement, lieu, nombre de spectateurs, budget estimé..."
                  : product === "tente" ? "Dimensions souhaitées, personnalisation, date d'utilisation..."
                  : product === "mobilier" ? "Quantité, couleurs, événement prévu..."
                  : product === "arche" ? "Dimensions, personnalisation, type d'événement..."
                  : "Décrivez votre projet..."
                }
                className={`${inputClass} resize-none`}
                autoFocus
              />
            </div>

            {/* Récapitulatif compact */}
            <div className="mt-4 p-3 bg-white/[0.03] border border-white/5 rounded-sm">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Récapitulatif</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {product && <div className="text-white/60">Produit : <span className="text-white">{products.find(p => p.type === product)?.label}</span></div>}
                {productDetail && <div className="text-white/60">Détail : <span className="text-white">{productDetail}</span></div>}
                {email && <div className="text-white/60">Email : <span className="text-white">{email}</span></div>}
                {phone?.trim() && <div className="text-white/60">Tél : <span className="text-white">{phone}</span></div>}
                {(prenom || nom) && <div className="text-white/60">Nom : <span className="text-white">{[prenom, nom].filter(Boolean).join(" ")}</span></div>}
                {entreprise && <div className="text-white/60">Entreprise : <span className="text-white">{entreprise}</span></div>}
                {country && <div className="text-white/60">Lieu : <span className="text-white">{[city, country].filter(Boolean).join(", ")}</span></div>}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-sm hover:border-white/30 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-navy-deep font-bold text-sm rounded-sm hover:bg-gold-light transition-colors glow-gold disabled:opacity-70"
              >
                {submitMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</>
                ) : (
                  <><Send className="w-4 h-4" /> Recevoir mon devis gratuit</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
