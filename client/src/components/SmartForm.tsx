/**
 * SmartForm — "Le Devis en Douceur"
 * Formulaire unifié intelligent en 7 étapes progressives
 * ÉTAPE 1 = EMAIL (capture immédiate du contact)
 * Champs obligatoires : Email, Produit, Objectif, Code postal, Prénom
 *
 * Ordre : Email → Produit → Besoin → Objectif → Tél/Rappel → Localisation → Contact/Entreprise/Message
 *
 * Détection d'abandon : si le visiteur quitte après avoir saisi son email,
 * les données partielles sont envoyées au backend (CRM + notification admin)
 *
 * i18n : tous les textes affichés passent par useTranslation("smartform").
 * Le namespace utilise des clés plates (translate-locales.mjs ne traduit que
 * les clés string de premier niveau). Les données transmises au CRM (libellés
 * produit, message, jour de rappel) restent en français.
 *
 * Props :
 *  - preselectedProduct : pré-sélectionne le produit (sur les pages produits)
 *  - preselectedSize : pré-sélectionne la taille d'écran
 *  - mode : "full" (page d'accueil) | "compact" (sidebar/modal)
 *  - onSubmitSuccess : callback après soumission réussie
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { generateChallenge, solveProofOfWork } from "@/lib/proofOfWork";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor, Tent, Armchair, Trophy, ArrowRight, ArrowLeft, Send,
  Mail, Phone, MapPin, User, Globe, MessageSquare, Loader2, Sparkles,
  Clock, ShieldCheck, Check, Building2
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import VoiceMicButton from "@/components/VoiceMicButton";
import CinemaSuccessAnimation from "@/components/CinemaSuccessAnimation";
import SiretLookupField from "@/components/SiretLookupField";

// ─── Types ─────────────────────────────────────────────────────────────────────
type ProductType = "ecran" | "tente" | "mobilier" | "arche" | null;

interface SmartFormProps {
  preselectedProduct?: ProductType;
  preselectedSize?: string;
  mode?: "full" | "compact";
  onSubmitSuccess?: () => void;
}

// ─── Données statiques (clés stables — libellés affichés via i18n) ──────────────
const products = [
  { type: "ecran" as const, icon: Monitor, color: "text-gold" },
  { type: "tente" as const, icon: Tent, color: "text-blue-400" },
  { type: "mobilier" as const, icon: Armchair, color: "text-emerald-400" },
  { type: "arche" as const, icon: Trophy, color: "text-purple-400" },
];

const screenCategories = [
  { value: "5-8m", tech: "etanche" },
  { value: "9-10m", tech: "soufflerie" },
  { value: "11-12m", tech: "soufflerie" },
  { value: "13-14m", tech: "soufflerie" },
  { value: "15-24m", tech: "soufflerie" },
];

const tentTypes = ["tente_x", "tente_n", "tente_v", "tente_araignee"];
const mobilierTypes = ["canape", "fauteuil", "table", "autre_mobilier"];
const archeUsages = ["course_sport", "evenement", "publicitaire", "autre_arche"];
const objectiveKeys = ["achat", "location", "information"];

// Clés des 7 étapes pour la barre de progression
const stepKeys = ["email", "product", "options", "objective", "phone", "location", "send"];

// Jours de rappel : clé i18n + valeur française stockée (transmise au CRM)
const callbackDays = [
  { key: "lundi", value: "Lundi" },
  { key: "mardi", value: "Mardi" },
  { key: "mercredi", value: "Mercredi" },
  { key: "jeudi", value: "Jeudi" },
  { key: "vendredi", value: "Vendredi" },
];

// Créneaux de rappel : clé i18n + valeur stockée (transmise au CRM)
const callbackSlots = [
  { key: "morning", value: "matin" },
  { key: "afternoon", value: "apres-midi" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Validation email stricte — regex standard RFC-like */
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email.trim());
}

/** Téléphone trop court — au moins 8 chiffres (hors préfixe +) */
function phoneTooShort(phone: string): boolean {
  const digits = phone.replace(/[^0-9]/g, "");
  return phone.trim().length > 0 && digits.length < 8;
}

function detectCountryFromTimezone(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzCountryMap: Record<string, string> = {
    "Europe/Paris": "France", "Europe/Brussels": "Belgique", "Europe/Zurich": "Suisse",
    "America/Toronto": "Canada", "America/Montreal": "Canada", "Africa/Casablanca": "Maroc",
    "Africa/Tunis": "Tunisie", "Africa/Algiers": "Algerie", "Africa/Dakar": "Senegal",
    "Africa/Abidjan": "Cote d'Ivoire", "Africa/Douala": "Cameroun",
    "Europe/Berlin": "Allemagne", "Europe/Madrid": "Espagne", "Europe/Rome": "Italie",
    "Europe/London": "Royaume-Uni", "America/New_York": "Etats-Unis",
    "America/Chicago": "Etats-Unis", "America/Los_Angeles": "Etats-Unis",
    "Asia/Shanghai": "Chine", "Asia/Tokyo": "Japon", "Asia/Dubai": "Emirats arabes unis",
    "America/Sao_Paulo": "Bresil", "America/Mexico_City": "Mexique",
    "Australia/Sydney": "Australie", "Indian/Antananarivo": "Madagascar",
  };
  return tzCountryMap[tz] || "";
}

function getPhonePrefix(country: string): string {
  const prefixes: Record<string, string> = {
    "France": "+33", "Belgique": "+32", "Suisse": "+41", "Canada": "+1",
    "Maroc": "+212", "Tunisie": "+216", "Algerie": "+213", "Senegal": "+221",
    "Cote d'Ivoire": "+225", "Cameroun": "+237", "Madagascar": "+261",
    "Allemagne": "+49", "Espagne": "+34", "Italie": "+39", "Royaume-Uni": "+44",
    "Etats-Unis": "+1", "Chine": "+86", "Japon": "+81",
    "Emirats arabes unis": "+971", "Arabie saoudite": "+966",
    "Bresil": "+55", "Mexique": "+52", "Australie": "+61",
  };
  return prefixes[country] || "";
}

// ─── Composant SmartForm ───────────────────────────────────────────────────────
export default function SmartForm({ preselectedProduct, preselectedSize, mode = "full", onSubmitSuccess }: SmartFormProps) {
  const { t } = useTranslation("smartform");

  // Lire les query params (pre-remplissage depuis le chatbot IA)
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const qProduct = (urlParams?.get("product") as ProductType) || preselectedProduct || null;
  const qSize = urlParams?.get("size") || preselectedSize || "";
  const qName = urlParams?.get("name") || "";
  const qEmail = urlParams?.get("email") || "";
  const qPhone = urlParams?.get("phone") || "";
  const qCompany = urlParams?.get("company") || "";
  const qCity = urlParams?.get("city") || "";
  const qCountry = urlParams?.get("country") || "";
  const qMessage = urlParams?.get("message") || "";
  const qEventType = urlParams?.get("eventType") || "";
  const qAudience = urlParams?.get("audience") || "";
  const qDate = urlParams?.get("date") || "";
  const qBudget = urlParams?.get("budget") || "";
  const qNeed = urlParams?.get("need") || "";
  const isFromChatbot = !!(qEmail || qProduct || qMessage || qName);

  // Calculer l'etape initiale en fonction des donnees pre-remplies
  const getInitialStep = () => {
    if (qEmail) return 2; // Si on a deja l'email, aller au produit
    return 1;
  };

  // Etapes : 1=email, 2=produit, 3=besoin, 4=objectif, 5=tel+rappel, 6=localisation, 7=contact+entreprise+message
  const [currentStep, setCurrentStep] = useState(getInitialStep);
  const totalSteps = 7;

  // Separer prenom/nom depuis qName
  const nameParts = qName.split(" ");
  const initialPrenom = nameParts[0] || "";
  const initialNom = nameParts.slice(1).join(" ") || "";

  // Donnees formulaire
  const [email, setEmail] = useState(qEmail);
  const [product, setProduct] = useState<ProductType>(qProduct);
  const [productDetail, setProductDetail] = useState(qSize);
  const [phone, setPhone] = useState(qPhone);
  const [prenom, setPrenom] = useState(initialPrenom);
  const [nom, setNom] = useState(initialNom);
  const [entreprise, setEntreprise] = useState(qCompany);
  const [country, setCountry] = useState(qCountry);
  const [city, setCity] = useState(qCity);
  const [postalCode, setPostalCode] = useState("");
  // Construire le message initial depuis les infos chatbot (texte transmis au CRM → français)
  const buildChatbotMessage = () => {
    if (!isFromChatbot) return "";
    const parts: string[] = [];
    if (qMessage) parts.push(qMessage);
    if (qEventType && !qMessage?.toLowerCase().includes(qEventType.toLowerCase())) parts.push(`Type d'événement : ${qEventType}`);
    if (qAudience && !qMessage?.toLowerCase().includes(qAudience.toLowerCase())) parts.push(`Public : ${qAudience} spectateurs`);
    if (qDate && !qMessage?.toLowerCase().includes(qDate.toLowerCase())) parts.push(`Date souhaitée : ${qDate}`);
    if (qBudget && !qMessage?.toLowerCase().includes(qBudget.toLowerCase())) parts.push(`Budget : ${qBudget}`);
    if (qNeed && !qMessage?.toLowerCase().includes(qNeed.toLowerCase())) {
      const needLabel = qNeed === "achat" ? "Achat" : qNeed === "location" ? "Location" : "Information";
      parts.push(`Besoin : ${needLabel}`);
    }
    return parts.join("\n");
  };
  const [objectif, setObjectif] = useState<string>("");
  const [message, setMessage] = useState(buildChatbotMessage);
  const [callbackDay, setCallbackDay] = useState<string>("");
  const [callbackTime, setCallbackTime] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [showResumeBanner, setShowResumeBanner] = useState(false);

  // Anti-spam : honeypot (champ invisible) + timestamp d'ouverture + PoW
  const [honeypot, setHoneypot] = useState("");
  const [formOpenedAt] = useState(() => Date.now());
  const [powChallenge] = useState(() => generateChallenge());
  const [powSolving, setPowSolving] = useState(false);

  // États d'erreur pour validation visuelle
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  // Code postal non reconnu → mode manuel
  const [postalCodeNotFound, setPostalCodeNotFound] = useState(false);
  const [postalCodeManualMode, setPostalCodeManualMode] = useState(false);

  // Ville suggestions
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Abandon tracking
  const [abandonSent, setAbandonSent] = useState(false);
  const emailCapturedRef = useRef(false);

  const formRef = useRef<HTMLDivElement>(null);
  const postalCodeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSearchedPostalRef = useRef<string>("");

  const STORAGE_KEY = "hallucine_smartform_progress";
  const EXPIRY_DAYS = 7;

  // Libellés produit transmis au CRM — toujours en français
  const crmProductLabels: Record<string, string> = {
    ecran: "Ecran de cinema",
    tente: "Tente gonflable",
    mobilier: "Mobilier gonflable",
    arche: "Arche gonflable",
  };

  // ─── Restaurer la progression sauvegardee au montage ──────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved);
      if (Date.now() - data.timestamp > EXPIRY_DAYS * 86400000) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      if (data.currentStep > 1 || data.email) {
        setShowResumeBanner(true);
      }
    } catch { /* ignore */ }
  }, []);

  const restoreProgress = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const d = JSON.parse(saved);
      if (d.email) setEmail(d.email);
      if (d.product) setProduct(d.product);
      if (d.productDetail) setProductDetail(d.productDetail);
      if (d.objectif) setObjectif(d.objectif);
      if (d.phone) setPhone(d.phone);
      if (d.prenom) setPrenom(d.prenom);
      if (d.nom) setNom(d.nom);
      if (d.entreprise) setEntreprise(d.entreprise);
      if (d.country) setCountry(d.country);
      if (d.city) setCity(d.city);
      if (d.postalCode) setPostalCode(d.postalCode);
      if (d.message) setMessage(d.message);
      if (d.callbackDay) setCallbackDay(d.callbackDay);
      if (d.callbackTime) setCallbackTime(d.callbackTime);
      // Adapter l'étape si l'ancien format avait 8 étapes
      const savedStep = d.currentStep || 1;
      setCurrentStep(savedStep > totalSteps ? totalSteps : savedStep);
      setShowResumeBanner(false);
    } catch { /* ignore */ }
  };

  const dismissProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShowResumeBanner(false);
  };

  // ─── Sauvegarder automatiquement a chaque changement ──────────────────
  useEffect(() => {
    if (currentStep <= 1 && !email || submitted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentStep, email, product, productDetail, objectif, phone, prenom, nom,
        entreprise, country, city, postalCode, message, callbackDay, callbackTime,
        timestamp: Date.now()
      }));
    } catch { /* ignore */ }
  }, [currentStep, email, product, productDetail, objectif, phone, prenom, nom, entreprise, country, city, postalCode, message, callbackDay, callbackTime, submitted]);

  // ─── Auto-detect country on mount ─────────────────────────────────────
  useEffect(() => {
    const detected = detectCountryFromTimezone();
    if (detected) {
      setCountry(detected);
      setPhone(getPhonePrefix(detected) + " ");
    }
  }, []);

  // ─── Capture email pour détection d'abandon ─────────────────────────────
  useEffect(() => {
    if (email && email.includes("@") && email.includes(".")) {
      emailCapturedRef.current = true;
    }
  }, [email]);

  // ─── Detection d'abandon ──────────────────────────────────────────────
  const abandonMutation = trpc.contact.abandonPartial.useMutation();

  const sendAbandonData = useCallback(() => {
    if (abandonSent || submitted || !emailCapturedRef.current || !email) return;
    if (!email.includes("@") || !email.includes(".")) return;

    const productLabels: Record<string, string> = {
      ecran: "Ecran de cinema", tente: "Tente gonflable",
      mobilier: "Mobilier gonflable", arche: "Arche gonflable",
    };

    setAbandonSent(true);
    abandonMutation.mutate({
      email,
      prenom: prenom || undefined,
      nom: nom || undefined,
      entreprise: entreprise || undefined,
      telephone: phone?.trim() || undefined,
      product: product ? productLabels[product] : undefined,
      productDetail: productDetail || undefined,
      country: country || undefined,
      city: city || undefined,
      lastStep: currentStep,
      totalSteps,
    });
  }, [abandonSent, submitted, email, prenom, nom, entreprise, phone, product, productDetail, country, city, currentStep, abandonMutation, totalSteps]);

  // Envoyer les donnees partielles quand le visiteur quitte la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!submitted && emailCapturedRef.current && email && !abandonSent) {
        const productLabels: Record<string, string> = {
          ecran: "Ecran de cinema", tente: "Tente gonflable",
          mobilier: "Mobilier gonflable", arche: "Arche gonflable",
        };
        const data = {
          email,
          prenom: prenom || "",
          nom: nom || "",
          entreprise: entreprise || "",
          telephone: phone?.trim() || "",
          product: product ? productLabels[product] : "",
          productDetail: productDetail || "",
          country: country || "",
          city: city || "",
          lastStep: currentStep,
          totalSteps,
        };
        try {
          navigator.sendBeacon("/api/abandon-partial", JSON.stringify(data));
        } catch {
          // Fallback silencieux
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [submitted, email, prenom, nom, entreprise, phone, product, productDetail, country, city, currentStep, abandonSent, totalSteps]);

  // ─── Zippopotam.us : auto-completion ville depuis code postal (tous pays) ──
  const countryToIso: Record<string, string> = {
    "France": "fr", "Belgique": "be", "Suisse": "ch", "Canada": "ca",
    "Maroc": "ma", "Tunisie": "tn", "Algerie": "dz", "Senegal": "sn",
    "Allemagne": "de", "Espagne": "es", "Italie": "it", "Royaume-Uni": "gb",
    "Etats-Unis": "us", "Chine": "cn", "Japon": "jp", "Bresil": "br",
    "Mexique": "mx", "Australie": "au", "Emirats arabes unis": "ae",
    "Arabie saoudite": "sa", "Madagascar": "mg", "Cameroun": "cm",
    "Cote d'Ivoire": "ci",
  };

  const isoToCountry: Record<string, string> = Object.fromEntries(
    Object.entries(countryToIso).map(([name, iso]) => [iso, name])
  );

  useEffect(() => {
    if (postalCode === lastSearchedPostalRef.current) return;

    setCitySuggestions([]);
    setCity("");
    setCountry("");
    setEntreprise("");
    setPostalCodeNotFound(false);
    setPostalCodeManualMode(false);

    if (postalCode.length < 3) {
      lastSearchedPostalRef.current = "";
      return;
    }

    if (postalCodeTimeoutRef.current) clearTimeout(postalCodeTimeoutRef.current);

    postalCodeTimeoutRef.current = setTimeout(async () => {
      lastSearchedPostalRef.current = postalCode;
      setLoadingCities(true);
      try {
        // 1) Essayer France d'abord
        const resFr = await fetch(`https://api.zippopotam.us/fr/${postalCode}`);
        if (resFr.ok) {
          const data = await resFr.json();
          const cities = data.places?.map((p: { "place name": string }) => p["place name"]).filter(Boolean) || [];
          if (cities.length > 0) {
            setCitySuggestions(cities);
            if (cities.length === 1) setCity(cities[0]);
            else setCity("");
            setCountry("France");
            setLoadingCities(false);
            return;
          }
        }
        // 2) France n'a rien trouvé → essayer les autres pays
        const otherCountries = Object.values(countryToIso).filter(c => c !== "fr");
        for (const iso of otherCountries) {
          const res = await fetch(`https://api.zippopotam.us/${iso}/${postalCode}`);
          if (res.ok) {
            const data = await res.json();
            const cities = data.places?.map((p: { "place name": string }) => p["place name"]).filter(Boolean) || [];
            if (cities.length > 0) {
              setCitySuggestions(cities);
              if (cities.length === 1) setCity(cities[0]);
              else setCity("");
              const detectedCountry = isoToCountry[iso];
              if (detectedCountry) setCountry(detectedCountry);
              setLoadingCities(false);
              return;
            }
          }
        }
        // Aucun résultat trouvé → mode manuel
        setCitySuggestions([]);
        setCity("");
        setCountry("");
        setPostalCodeNotFound(true);
        setPostalCodeManualMode(true);
      } catch {
        // Fallback silencieux
      } finally {
        setLoadingCities(false);
      }
    }, 500);

    return () => {
      if (postalCodeTimeoutRef.current) clearTimeout(postalCodeTimeoutRef.current);
    };
  }, [postalCode]);

  // ─── Mutation tRPC ────────────────────────────────────────────────────
  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setAbandonSent(true);
      toast.success(t("toasts_success"));
      onSubmitSuccess?.();
    },
    onError: (err) => {
      toast.error(err.message || t("toasts_error"));
    },
  });

  const handleSubmit = async () => {
    if (submitted || submitMutation.isPending || powSolving) return;


    const trimmedEmail = email.trim();
    const trimmedPrenom = prenom.trim();
    const trimmedNom = nom.trim();
    const trimmedEntreprise = entreprise.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      toast.error(t("toasts_emailInvalid"));
      return;
    }
    if (trimmedPrenom.length < 2) {
      toast.error(t("toasts_prenomInvalid"));
      return;
    }

    const productLabel = product ? `${crmProductLabels[product]} -- ${productDetail}` : "Non precise";
    const fullName = [trimmedPrenom, trimmedNom].filter(Boolean).join(" ") || "Non renseigne";
    const location = [city, postalCode, country].filter(Boolean).join(", ");

    const callbackInfo = callbackDay || callbackTime
      ? `\nPreference rappel : ${callbackDay || "Pas de preference"} ${callbackTime || ""}`
      : "";

    // Résoudre le Proof of Work avant soumission (invisible, ~100-500ms)
    setPowSolving(true);
    let powNonce: number | undefined;
    try {
      powNonce = await solveProofOfWork(powChallenge);
    } catch {
      // Si PoW échoue, on soumet quand même (score sera plus bas côté serveur)
    }
    setPowSolving(false);

    submitMutation.mutate({
      type: "devis",
      nom: fullName,
      email: trimmedEmail,
      telephone: trimmedPhone || undefined,
      entreprise: trimmedEntreprise || undefined,
      sujet: `${productLabel} -- ${location}`,
      message: (trimmedMessage || "") + callbackInfo,
      produit: productLabel,
      objectif: objectif || undefined,
      _hp: honeypot,
      _ts: formOpenedAt,
      _powChallenge: powChallenge,
      _powNonce: powNonce,
    });

    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  // ─── Navigation ───────────────────────────────────────────────────────
  const goNext = () => {
    if (currentStep < totalSteps) {
      setFieldErrors({});
      setCurrentStep(prev => prev + 1);
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
    }
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return isValidEmail(email);
      case 2: return product !== null;
      case 3: return true; // Besoin specifique optionnel
      case 4: return objectif !== ""; // Objectif obligatoire
      case 5: return true; // Tel optionnel
      case 6: return postalCode.trim().length >= 3; // Code postal obligatoire
      case 7: return prenom.trim().length >= 2; // Prenom obligatoire
      default: return false;
    }
  };

  const validateAndProceed = (): boolean => {
    const errors: Record<string, string> = {};
    switch (currentStep) {
      case 1:
        if (!email.trim()) errors.email = t("validation_emailRequired");
        else if (!isValidEmail(email)) errors.email = t("validation_emailInvalid");
        break;
      case 4:
        if (!objectif) errors.objectif = t("validation_objectifRequired");
        break;
      case 6:
        if (postalCode.trim().length < 3) errors.postalCode = t("validation_postalRequired");
        break;
      case 7:
        if (prenom.trim().length < 2) errors.prenom = t("validation_prenomRequired");
        break;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return false;
    return canProceed();
  };

  const goNextValidated = () => {
    if (validateAndProceed()) {
      goNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed()) {
      e.preventDefault();
      if (currentStep === totalSteps) {
        handleSubmit();
      } else {
        goNextValidated();
      }
    }
  };

  // ─── Animations ───────────────────────────────────────────────────────
  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  const inputRequiredClass = "w-full p-3 bg-white/[0.15] border border-[#D4AF37]/60 rounded-lg text-white text-base placeholder:text-white/50 focus:border-gold focus:outline-none transition-colors";
  const inputOptionalClass = "w-full p-3 bg-white/[0.10] border border-white/15 rounded-lg text-white text-base placeholder:text-white/40 focus:border-gold focus:outline-none transition-colors";
  const labelClass = "text-white text-sm font-medium mb-1.5 block";

  const encouragement = t(`encouragements_${currentStep}`, "");

  // ─── Rendu ────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div ref={formRef}>
        <CinemaSuccessAnimation prenom={prenom || undefined} />
      </div>
    );
  }

  return (
    <div ref={formRef} className={mode === "compact" ? "" : ""}>
      {/* Bandeau de reprise de progression */}
      {showResumeBanner && (
        <div className="mb-4 p-3 bg-gold/10 border border-gold/30 rounded-lg flex items-center justify-between gap-3">
          <p className="text-white/80 text-sm">{t("resumeBanner_text")}</p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={restoreProgress}
              className="px-3 py-1.5 bg-gold text-navy-deep text-xs font-semibold rounded-lg hover:bg-gold-light transition-colors"
            >
              {t("resumeBanner_resume")}
            </button>
            <button
              onClick={dismissProgress}
              className="px-3 py-1.5 border border-white/20 text-white/65 text-xs rounded-lg hover:border-white/50 transition-colors"
            >
              {t("resumeBanner_dismiss")}
            </button>
          </div>
        </div>
      )}

      {/* Bandeau chatbot pré-remplissage */}
      {isFromChatbot && currentStep <= 2 && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-emerald-300 text-sm font-medium">{t("chatbotBanner_title")}</p>
            <p className="text-white/65 text-xs mt-0.5">{t("chatbotBanner_text")}</p>
          </div>
        </div>
      )}

      {/* Anti-spam : Honeypot invisible */}
      <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <label htmlFor="website_url">Ne pas remplir</label>
        <input
          type="text"
          id="website_url"
          name="website_url"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Estimation de temps + indicateur de confiance */}
      {currentStep === 1 && (
        <div className="flex items-center justify-between mb-4 text-white/50 text-xs">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{t("trust_time")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold/60" />
            <span>{t("trust_response")}</span>
          </div>
        </div>
      )}

      {/* Barre de progression améliorée avec labels et checkmarks */}
      <div className="mb-6">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div key={s} className="flex-1 relative">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  s < currentStep ? "bg-gold" : s === currentStep ? "bg-gold/70" : "bg-white/10"
                }`}
              />
              {/* Checkmark animé pour les étapes complétées */}
              {s < currentStep && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-gold rounded-full flex items-center justify-center"
                >
                  <Check className="w-2 h-2 text-navy-deep" strokeWidth={3} />
                </motion.div>
              )}
            </div>
          ))}
        </div>
        {/* Labels sous la barre */}
        <div className="flex items-center gap-1">
          {stepKeys.map((key, i) => (
            <div key={key} className={`flex-1 text-center text-[9px] leading-tight ${
              i + 1 < currentStep ? "text-gold/70" : i + 1 === currentStep ? "text-white/80 font-medium" : "text-white/25"
            }`}>
              {t(`steps_${key}`)}
            </div>
          ))}
        </div>
      </div>

      {/* Message d'encouragement */}
      <AnimatePresence mode="wait">
        {encouragement && (
          <motion.div
            key={`enc-${currentStep}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-3 text-center"
          >
            <span className="text-gold/80 text-xs font-medium">{encouragement}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ─── ETAPE 1 : Email (capture immediate) ─────────────────────── */}
        {currentStep === 1 && (
          <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-1">{t("step1_title")}</h3>
            <p className="text-white/70 text-sm mb-5">{t("step1_subtitle")}</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="sf-email" className={labelClass}>
                  <Mail className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t("step1_emailLabel")} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="sf-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: "" })); }}
                    placeholder={t("step1_emailPlaceholder")}
                    className={`${inputRequiredClass} flex-1 ${fieldErrors.email ? "border-red-500" : ""}`}
                    autoFocus
                    onKeyDown={handleKeyDown}
                  />
                  <VoiceMicButton
                    onResult={(text) => {
                      const cleaned = text
                        .toLowerCase()
                        .replace(/\s*arobase\s*/gi, "@")
                        .replace(/\s*arrobase\s*/gi, "@")
                        .replace(/\s*at\s*/gi, "@")
                        .replace(/\s*point\s*/gi, ".")
                        .replace(/\s+/g, "")
                        .trim();
                      setEmail(cleaned);
                    }}
                    tooltip={t("voice_email")}
                  />
                </div>
              </div>
              {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            <button
              onClick={goNextValidated}
              disabled={!canProceed()}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-navy-deep font-semibold text-sm rounded-lg hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("common_continue")} <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-white/20 text-[10px] text-center mt-3">
              {t("step1_privacy")}
            </p>
          </motion.div>
        )}

        {/* ─── ETAPE 2 : Choix du produit ──────────────────────────────── */}
        {currentStep === 2 && (
          <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-1">{t("step2_title")} <span className="text-red-500">*</span></h3>
            <p className="text-white/70 text-sm mb-5">{t("step2_subtitle")}</p>
            <div className="grid grid-cols-2 gap-3">
              {products.map((p) => (
                <button
                  key={p.type}
                  onClick={() => { setProduct(p.type); goNext(); }}
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all duration-300 text-center hover:scale-[1.02] ${
                    product === p.type ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/30 bg-white/[0.02]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${p.color}`}>
                    <p.icon className="w-5 h-5" />
                  </div>
                  <div className="text-white font-semibold text-sm">{t(`products_${p.type}_label`)}</div>
                  <div className="text-white/65 text-xs leading-tight">{t(`products_${p.type}_desc`)}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-lg hover:border-white/30 transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t("common_back")}
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── ETAPE 3 : Besoin specifique ─────────────────────────────── */}
        {currentStep === 3 && (
          <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            {product === "ecran" && (
              <>
                <h3 className="text-xl font-bold text-white mb-1">{t("step3_ecranTitle")}</h3>
                <p className="text-white/70 text-sm mb-5">{t("step3_ecranSubtitle")}</p>
                <div className="space-y-2">
                  {screenCategories.map((cat) => {
                    const catLabel = t(`screenSizes_${cat.value}_label`);
                    return (
                      <button
                        key={cat.value}
                        onClick={() => { setProductDetail(cat.value); }}
                        className={`w-full flex items-center gap-4 p-3.5 border rounded-lg transition-all duration-300 text-left ${
                          productDetail === cat.value ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/30 bg-white/[0.02]"
                        }`}
                      >
                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gold text-sm font-bold">
                          {catLabel.split(" ")[0]}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold text-sm">{catLabel}</div>
                          <div className="text-white/65 text-xs">{t(`screenSizes_${cat.value}_audience`)}</div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          cat.tech === "etanche" ? "bg-gold/10 text-gold" : "bg-blue-400/10 text-blue-400"
                        }`}>
                          {t(`tech_${cat.tech}`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {product === "tente" && (
              <>
                <h3 className="text-xl font-bold text-white mb-1">{t("step3_tenteTitle")}</h3>
                <p className="text-white/70 text-sm mb-5">{t("step3_tenteSubtitle")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {tentTypes.map((tt) => (
                    <button
                      key={tt}
                      onClick={() => setProductDetail(tt)}
                      className={`p-3.5 border rounded-lg text-center transition-all duration-300 ${
                        productDetail === tt ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/30 bg-white/[0.02]"
                      }`}
                    >
                      <div className="text-white font-semibold text-sm">{t(`tentTypes_${tt}`)}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {product === "mobilier" && (
              <>
                <h3 className="text-xl font-bold text-white mb-1">{t("step3_mobilierTitle")}</h3>
                <p className="text-white/70 text-sm mb-5">{t("step3_mobilierSubtitle")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {mobilierTypes.map((m) => (
                    <button
                      key={m}
                      onClick={() => setProductDetail(m)}
                      className={`p-3.5 border rounded-lg text-center transition-all duration-300 ${
                        productDetail === m ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/30 bg-white/[0.02]"
                      }`}
                    >
                      <div className="text-white font-semibold text-sm">{t(`mobilierTypes_${m}`)}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {product === "arche" && (
              <>
                <h3 className="text-xl font-bold text-white mb-1">{t("step3_archeTitle")}</h3>
                <p className="text-white/70 text-sm mb-5">{t("step3_archeSubtitle")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {archeUsages.map((a) => (
                    <button
                      key={a}
                      onClick={() => setProductDetail(a)}
                      className={`p-3.5 border rounded-lg text-center transition-all duration-300 ${
                        productDetail === a ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/30 bg-white/[0.02]"
                      }`}
                    >
                      <div className="text-white font-semibold text-sm">{t(`archeUsages_${a}`)}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-lg hover:border-white/30 transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t("common_back")}
              </button>
              <button
                onClick={goNextValidated}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gold text-navy-deep font-semibold text-sm rounded-lg hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t("common_continue")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── ETAPE 4 : Objectif (Achat / Location / Information) ────── */}
        {currentStep === 4 && (
          <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-1">{t("step4_title")} <span className="text-red-500">*</span></h3>
            <p className="text-white/70 text-sm mb-5">{t("step4_subtitle")}</p>
            <div className="space-y-2">
              {objectiveKeys.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setObjectif(opt)}
                  className={`w-full flex items-center gap-4 p-3.5 border rounded-lg transition-all duration-300 text-left ${
                    objectif === opt ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/30 bg-white/[0.02]"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    objectif === opt ? "bg-gold text-navy-deep" : "bg-white/5 text-white/50"
                  }`}>
                    {opt === "achat" ? "A" : opt === "location" ? "L" : "I"}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{t(`objectives_${opt}_label`)}</div>
                    <div className="text-white/65 text-xs">{t(`objectives_${opt}_desc`)}</div>
                  </div>
                </button>
              ))}
            </div>
            {fieldErrors.objectif && <p className="text-red-400 text-xs mt-2">{fieldErrors.objectif}</p>}
            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-lg hover:border-white/30 transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t("common_back")}
              </button>
              <button
                onClick={goNextValidated}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gold text-navy-deep font-semibold text-sm rounded-lg hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t("common_continue")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── ETAPE 5 : Telephone + Preference de rappel ─────────────── */}
        {currentStep === 5 && (
          <motion.div key="step5" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-1">{t("step5_title")}</h3>
            <p className="text-white/70 text-sm mb-5">{t("step5_subtitle")}</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="sf-phone" className={labelClass}>
                  <Phone className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t("step5_phoneLabel")}
                  <span className="text-white/50 ml-1">{t("step5_phoneRecommended")}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="sf-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("step5_phonePlaceholder")}
                    className={`${inputOptionalClass} flex-1`}
                    autoFocus
                    onKeyDown={handleKeyDown}
                  />
                  <VoiceMicButton
                    onResult={(text) => {
                      const cleaned = text
                        .replace(/z[eé]ro/gi, "0")
                        .replace(/un\b/gi, "1")
                        .replace(/deux/gi, "2")
                        .replace(/trois/gi, "3")
                        .replace(/quatre/gi, "4")
                        .replace(/cinq/gi, "5")
                        .replace(/six/gi, "6")
                        .replace(/sept/gi, "7")
                        .replace(/huit/gi, "8")
                        .replace(/neuf/gi, "9")
                        .replace(/dix/gi, "10")
                        .replace(/plus/gi, "+")
                        .replace(/[^0-9+\s]/g, "")
                        .replace(/\s+/g, " ")
                        .trim();
                      setPhone(prev => {
                        const prefix = prev.trim();
                        if (prefix && !cleaned.startsWith("+")) return `${prefix}${cleaned}`;
                        return cleaned;
                      });
                    }}
                    tooltip={t("voice_phone")}
                  />
                </div>
              </div>
              {phoneTooShort(phone) && (
                <p className="text-amber-400 text-xs mt-1">{t("validation_phoneShort")}</p>
              )}

              {/* Preference de rappel - visible uniquement si telephone renseigne */}
              {phone.trim().length > 4 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3"
                >
                  <p className="text-white/70 text-sm font-medium">{t("step5_callbackQuestion")}</p>
                  <div className="flex flex-wrap gap-2">
                    {callbackDays.map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => setCallbackDay(callbackDay === d.value ? "" : d.value)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          callbackDay === d.value
                            ? "bg-gold/20 border-gold text-gold"
                            : "border-white/10 text-white/50 hover:border-white/30"
                        }`}
                      >
                        {t(`callback_days_${d.key}`)}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {callbackSlots.map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => setCallbackTime(callbackTime === slot.value ? "" : slot.value)}
                        className={`flex-1 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          callbackTime === slot.value
                            ? "bg-gold/20 border-gold text-gold"
                            : "border-white/10 text-white/50 hover:border-white/30"
                        }`}
                      >
                        {t(`callback_${slot.key}`)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-lg hover:border-white/30 transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t("common_back")}
              </button>
              <button
                onClick={goNextValidated}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gold text-navy-deep font-semibold text-sm rounded-lg hover:bg-gold-light transition-colors"
              >
                {t("common_continue")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── ETAPE 6 : Code postal + Ville/Pays (lecture seule) ─────── */}
        {currentStep === 6 && (
          <motion.div key="step6" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-1">{t("step6_title")}</h3>
            <p className="text-white/70 text-sm mb-5">{t("step6_subtitle")}</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="sf-postal" className={labelClass}>
                  <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t("step6_postalLabel")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="sf-postal"
                    type="text"
                    value={postalCode}
                    onChange={(e) => { setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 10)); setFieldErrors(prev => ({ ...prev, postalCode: "" })); }}
                    placeholder={t("step6_postalPlaceholder")}
                    maxLength={10}
                    className={`${inputRequiredClass} ${fieldErrors.postalCode ? "border-red-500" : ""}`}
                    autoFocus
                    onKeyDown={handleKeyDown}
                  />
                  {loadingCities && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 text-gold animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              {fieldErrors.postalCode && <p className="text-red-400 text-xs mt-1">{fieldErrors.postalCode}</p>}

              {/* Message code postal non reconnu */}
              {postalCodeNotFound && postalCode.length >= 3 && !loadingCities && (
                <p className="text-amber-400 text-xs mt-1">{t("step6_postalNotFound")}</p>
              )}

              {/* Ville et Pays */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t("step6_cityLabel")}</label>
                  {citySuggestions.length > 1 ? (
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`${inputOptionalClass} cursor-pointer`}
                      style={{ backgroundColor: "#1a1a2e", color: "#fff" }}
                    >
                      {citySuggestions.map((c) => (
                        <option key={c} value={c} style={{ backgroundColor: "#1a1a2e", color: "#fff" }}>{c}</option>
                      ))}
                    </select>
                  ) : postalCodeManualMode ? (
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={t("step6_cityPlaceholder")}
                      className={inputOptionalClass}
                    />
                  ) : (
                    <div className={`${inputOptionalClass} bg-white/[0.02] text-white/60`}>
                      {city || "--"}
                    </div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    <Globe className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t("step6_countryLabel")}
                  </label>
                  {postalCodeManualMode ? (
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder={t("step6_countryPlaceholder")}
                      className={inputOptionalClass}
                    />
                  ) : (
                    <div className={`${inputOptionalClass} bg-white/[0.02] text-white/60`}>
                      {country || "--"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-lg hover:border-white/30 transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t("common_back")}
              </button>
              <button
                onClick={goNextValidated}
                disabled={!canProceed()}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 font-semibold text-sm rounded-lg transition-colors ${canProceed() ? 'bg-gold text-navy-deep hover:bg-gold-light' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
              >
                {t("common_continue")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── ETAPE 7 : Contact + Entreprise + Message + Envoi ────────── */}
        {currentStep === 7 && (
          <motion.div key="step7" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-1">{t("step7_title")}</h3>
            <p className="text-white/70 text-sm mb-5">{t("step7_subtitle")}</p>

            <div className="space-y-4">
              {/* Prénom + Nom */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>
                    <User className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t("step7_prenomLabel")} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={prenom}
                      onChange={(e) => { setPrenom(e.target.value); setFieldErrors(prev => ({ ...prev, prenom: "" })); }}
                      placeholder={t("step7_prenomPlaceholder")}
                      className={`${inputRequiredClass} flex-1 ${fieldErrors.prenom ? "border-red-500" : ""}`}
                      autoFocus
                    />
                    <VoiceMicButton
                      onResult={(text) => setPrenom(text.trim())}
                      tooltip={t("voice_prenom")}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t("step7_nomLabel")}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder={t("step7_nomPlaceholder")}
                      className={`${inputOptionalClass} flex-1`}
                    />
                    <VoiceMicButton
                      onResult={(text) => setNom(text.trim())}
                      tooltip={t("voice_nom")}
                    />
                  </div>
                </div>
              </div>
              {fieldErrors.prenom && <p className="text-red-400 text-xs mt-1">{fieldErrors.prenom}</p>}

              {/* Entreprise (optionnel, avec auto-complétion SIRET) */}
              <div>
                <label className={labelClass}>
                  <Building2 className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t("step7_entrepriseLabel")}
                  <span className="text-white/50 ml-1">{t("step7_optional")}</span>
                </label>
                <SiretLookupField
                  initialValue={entreprise}
                  codePostal={postalCode}
                  onTextChange={(value) => setEntreprise(value)}
                  onSelect={(result) => {
                    setEntreprise(result.entreprise);
                    if (result.ville && !city) setCity(result.ville);
                    if (result.codePostal && !postalCode) setPostalCode(result.codePostal);
                    if (result.ville || result.codePostal) {
                      if (!country) setCountry("France");
                    }
                  }}
                />
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-white/60 text-sm">
                    <MessageSquare className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t("step7_messageLabel")}
                    <span className="text-white/50 ml-1">{t("step7_optional")}</span>
                  </label>
                  <VoiceMicButton
                    onResult={(text) => setMessage(prev => prev ? `${prev} ${text}` : text)}
                    tooltip={t("voice_message")}
                    size="md"
                  />
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder={t(`step7_messagePlaceholder_${product || "default"}`)}
                  className={`${inputOptionalClass} resize-none`}
                />
              </div>
            </div>

            {/* Recapitulatif compact */}
            <div className="mt-4 p-3 bg-white/[0.03] border border-white/5 rounded-lg">
              <div className="text-white/65 text-xs uppercase tracking-wider mb-2">{t("recap_title")}</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {email && <div className="text-white/60">{t("recap_email")} : <span className="text-white">{email}</span></div>}
                {product && <div className="text-white/60">{t("recap_product")} : <span className="text-white">{t(`products_${product}_label`)}</span></div>}
                {productDetail && <div className="text-white/60">{t("recap_detail")} : <span className="text-white">{productDetail}</span></div>}
                {objectif && <div className="text-white/60">{t("recap_objective")} : <span className="text-white">{t(`objectives_${objectif}_label`)}</span></div>}
                {phone?.trim() && <div className="text-white/60">{t("recap_phone")} : <span className="text-white">{phone}</span></div>}
                {(prenom || nom) && <div className="text-white/60">{t("recap_name")} : <span className="text-white">{[prenom, nom].filter(Boolean).join(" ")}</span></div>}
                {entreprise && <div className="text-white/60">{t("recap_company")} : <span className="text-white">{entreprise}</span></div>}
                {country && <div className="text-white/60">{t("recap_location")} : <span className="text-white">{[city, country].filter(Boolean).join(", ")}</span></div>}
                {(callbackDay || callbackTime) && <div className="text-white/60">{t("recap_callback")} : <span className="text-white">{[callbackDay ? t(`callback_days_${callbackDay.toLowerCase()}`) : "", callbackTime === "matin" ? t("callback_morning") : callbackTime === "apres-midi" ? t("callback_afternoon") : ""].filter(Boolean).join(" - ")}</span></div>}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-lg hover:border-white/30 transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t("common_back")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitMutation.isPending || prenom.trim().length < 2}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-navy-deep font-bold text-sm rounded-lg hover:bg-gold-light transition-colors glow-gold disabled:opacity-70"
              >
                {submitMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t("step7_submitting")}</>
                ) : (
                  <><Send className="w-4 h-4" /> {t("step7_submit")}</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
