/**
 * SiretLookupField — Champ entreprise unique avec auto-complétion API
 * L'utilisateur tape le nom de son entreprise, l'API recherche-entreprises.gouv.fr
 * propose des résultats. S'il sélectionne une entreprise, le SIRET/adresse/ville
 * sont récupérés. S'il ne trouve rien, son texte libre est conservé.
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Building2, MapPin, Loader2, CheckCircle } from "lucide-react";
import {
  searchEntreprise,
  formatSiret,
  formatSiren,
  type SiretResult,
} from "@/lib/siretLookup";

interface SiretLookupFieldProps {
  onSelect: (result: {
    entreprise: string;
    adresse: string;
    codePostal: string;
    ville: string;
    siret: string;
    siren: string;
  }) => void;
  /** Valeur initiale du champ (pré-rempli ou autre) */
  initialValue?: string;
  /** Code postal pour filtrer la recherche par zone */
  codePostal?: string;
  /** Callback quand le texte change (saisie libre) */
  onTextChange?: (value: string) => void;
  className?: string;
}

export default function SiretLookupField({ onSelect, initialValue = "", codePostal: filterCodePostal, onTextChange, className = "" }: SiretLookupFieldProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<SiretResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<SiretResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mettre à jour si initialValue change (pré-remplissage IA)
  useEffect(() => {
    if (initialValue && !query && !selected) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Recherche entreprise via API
  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await searchEntreprise(q, { perPage: 5, activeOnly: true, codePostal: filterCodePostal || undefined });
      if (response.error) setError(response.error);
      setResults(response.results);
      setShowDropdown(response.results.length > 0);
    } catch {
      setError("Erreur de recherche");
    } finally {
      setLoading(false);
    }
  }, [filterCodePostal]);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
    setSelected(null);
    onTextChange?.(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(value);
    }, 500);
  }, [doSearch, onTextChange]);

  const handleSelect = useCallback((result: SiretResult) => {
    setSelected(result);
    setQuery(result.nomComplet);
    setShowDropdown(false);
    onTextChange?.(result.nomComplet);
    onSelect({
      entreprise: result.nomComplet,
      adresse: result.adresse,
      codePostal: result.codePostal,
      ville: result.ville,
      siret: result.siret,
      siren: result.siren,
    });
  }, [onSelect, onTextChange]);

  const inputClass = "w-full p-3 pl-10 bg-white/[0.05] border border-white/10 rounded-sm text-white text-sm placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <label className="text-white/60 text-sm mb-1.5 block">
        <Building2 className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
        Entreprise / Organisation
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => { if (results.length > 0 && !selected) setShowDropdown(true); }}
          placeholder="Nom de votre structure"
          className={inputClass}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-gold animate-spin" />
          </div>
        )}
        {selected && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-[10px] mt-1">{error}</p>
      )}

      {/* Dropdown résultats */}
      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-30 w-full mt-1 bg-[oklch(0.16_0.012_260)] border border-white/10 rounded-sm shadow-xl max-h-64 overflow-y-auto"
          >
            {results.map((r, i) => (
              <button
                key={`${r.siren}-${i}`}
                type="button"
                onMouseDown={() => handleSelect(r)}
                className="w-full text-left px-3 py-2.5 hover:bg-gold/10 transition-colors border-b border-white/5 last:border-b-0"
              >
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{r.nomComplet}</div>
                    <div className="flex items-center gap-1 text-white/40 text-xs mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{r.ville ? `${r.codePostal} ${r.ville}` : r.adresse}</span>
                    </div>
                    <div className="text-white/30 text-[10px] mt-0.5">
                      SIRET {formatSiret(r.siret)} | SIREN {formatSiren(r.siren)}
                      {r.categorieEntreprise && ` | ${r.categorieEntreprise}`}
                    </div>
                  </div>
                  {r.estActive && (
                    <span className="px-1.5 py-0.5 bg-emerald-400/10 text-emerald-400 text-[10px] rounded shrink-0">
                      Active
                    </span>
                  )}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Résultat sélectionné */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 p-2.5 bg-emerald-400/5 border border-emerald-400/20 rounded-sm"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">Entreprise verifiee</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
              <div className="text-white/50">Nom : <span className="text-white">{selected.nomComplet}</span></div>
              <div className="text-white/50">SIRET : <span className="text-white">{formatSiret(selected.siret)}</span></div>
              {selected.ville && <div className="text-white/50">Ville : <span className="text-white">{selected.codePostal} {selected.ville}</span></div>}
              {selected.categorieEntreprise && <div className="text-white/50">Categorie : <span className="text-white">{selected.categorieEntreprise}</span></div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
