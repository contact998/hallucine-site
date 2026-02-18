/**
 * SiretLookupField — Deux champs : Ville (auto-complétion) + Nom d'entreprise (filtré par ville)
 * Ville : API geo.api.gouv.fr (communes françaises)
 * Entreprise : API Recherche d'Entreprises (gouv.fr) filtrée par code postal
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Building2, MapPin, Loader2, CheckCircle, X } from "lucide-react";
import {
  searchEntreprise,
  formatSiret,
  formatSiren,
  type SiretResult,
} from "@/lib/siretLookup";

interface CommuneResult {
  nom: string;
  code: string;
  codesPostaux: string[];
  departement: { code: string; nom: string };
  population: number;
}

interface SiretLookupFieldProps {
  onSelect: (result: {
    entreprise: string;
    adresse: string;
    codePostal: string;
    ville: string;
    siret: string;
    siren: string;
  }) => void;
  className?: string;
}

const GEO_API = "https://geo.api.gouv.fr/communes";

async function searchCommunes(query: string): Promise<CommuneResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const params = new URLSearchParams({
      nom: query,
      fields: "nom,code,codesPostaux,departement,population",
      boost: "population",
      limit: "7",
    });
    const res = await fetch(`${GEO_API}?${params.toString()}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default function SiretLookupField({ onSelect, className = "" }: SiretLookupFieldProps) {
  // Ville state
  const [villeQuery, setVilleQuery] = useState("");
  const [communes, setCommunes] = useState<CommuneResult[]>([]);
  const [selectedCommune, setSelectedCommune] = useState<CommuneResult | null>(null);
  const [showVilleDropdown, setShowVilleDropdown] = useState(false);
  const [villeLoading, setVilleLoading] = useState(false);
  const [skipVilleFilter, setSkipVilleFilter] = useState(false);

  // Entreprise state
  const [entQuery, setEntQuery] = useState("");
  const [results, setResults] = useState<SiretResult[]>([]);
  const [entLoading, setEntLoading] = useState(false);
  const [showEntDropdown, setShowEntDropdown] = useState(false);
  const [selected, setSelected] = useState<SiretResult | null>(null);
  const [entError, setEntError] = useState<string | null>(null);

  const villeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const villeContainerRef = useRef<HTMLDivElement>(null);
  const entContainerRef = useRef<HTMLDivElement>(null);

  // Fermer les dropdowns au clic extérieur
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (villeContainerRef.current && !villeContainerRef.current.contains(e.target as Node)) {
        setShowVilleDropdown(false);
      }
      if (entContainerRef.current && !entContainerRef.current.contains(e.target as Node)) {
        setShowEntDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (villeDebounceRef.current) clearTimeout(villeDebounceRef.current);
      if (entDebounceRef.current) clearTimeout(entDebounceRef.current);
    };
  }, []);

  // Recherche ville
  const handleVilleChange = useCallback((value: string) => {
    setVilleQuery(value);
    setSelectedCommune(null);
    setSkipVilleFilter(false);
    if (villeDebounceRef.current) clearTimeout(villeDebounceRef.current);
    villeDebounceRef.current = setTimeout(async () => {
      if (value.trim().length < 2) {
        setCommunes([]);
        setShowVilleDropdown(false);
        return;
      }
      setVilleLoading(true);
      const res = await searchCommunes(value);
      setCommunes(res);
      setShowVilleDropdown(res.length > 0);
      setVilleLoading(false);
    }, 300);
  }, []);

  const handleSelectCommune = useCallback((commune: CommuneResult) => {
    setSelectedCommune(commune);
    setVilleQuery(`${commune.nom} (${commune.departement.code})`);
    setShowVilleDropdown(false);
    // Reset entreprise quand on change de ville
    setEntQuery("");
    setResults([]);
    setSelected(null);
  }, []);

  const handleClearVille = useCallback(() => {
    setVilleQuery("");
    setSelectedCommune(null);
    setCommunes([]);
    setSkipVilleFilter(false);
  }, []);

  // Recherche entreprise
  const doEntSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setShowEntDropdown(false);
      return;
    }
    setEntLoading(true);
    setEntError(null);
    try {
      const codePostal = (!skipVilleFilter && selectedCommune?.codesPostaux?.[0]) || undefined;
      const response = await searchEntreprise(q, { perPage: 5, activeOnly: true, codePostal });
      if (response.error) setEntError(response.error);
      setResults(response.results);
      setShowEntDropdown(response.results.length > 0);
    } catch {
      setEntError("Erreur de recherche");
    } finally {
      setEntLoading(false);
    }
  }, [selectedCommune, skipVilleFilter]);

  const handleEntChange = useCallback((value: string) => {
    setEntQuery(value);
    setSelected(null);
    if (entDebounceRef.current) clearTimeout(entDebounceRef.current);
    entDebounceRef.current = setTimeout(() => {
      doEntSearch(value);
    }, 500);
  }, [doEntSearch]);

  const handleSelectEnt = useCallback((result: SiretResult) => {
    setSelected(result);
    setEntQuery(result.nomComplet);
    setShowEntDropdown(false);
    onSelect({
      entreprise: result.nomComplet,
      adresse: result.adresse,
      codePostal: result.codePostal,
      ville: result.ville,
      siret: result.siret,
      siren: result.siren,
    });
  }, [onSelect]);

  const handleSkipVille = useCallback(() => {
    setSkipVilleFilter(true);
    setSelectedCommune(null);
    setVilleQuery("");
  }, []);

  const inputClass = "w-full p-3 pl-10 bg-white/[0.05] border border-white/10 rounded-sm text-white text-sm placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors";

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Champ Ville */}
      {!skipVilleFilter && (
        <div ref={villeContainerRef} className="relative">
          <label className="text-white/60 text-sm mb-1.5 block">
            <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Ville
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={villeQuery}
              onChange={(e) => handleVilleChange(e.target.value)}
              onFocus={() => { if (communes.length > 0 && !selectedCommune) setShowVilleDropdown(true); }}
              placeholder="Ex: Lyon, Marseille, Bordeaux..."
              className={inputClass}
            />
            {villeLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-gold animate-spin" />
              </div>
            )}
            {selectedCommune && (
              <button
                type="button"
                onClick={handleClearVille}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-white/40 hover:text-white" />
              </button>
            )}
          </div>

          {/* Dropdown communes */}
          <AnimatePresence>
            {showVilleDropdown && communes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-30 w-full mt-1 bg-[oklch(0.16_0.012_260)] border border-white/10 rounded-sm shadow-xl max-h-52 overflow-y-auto"
              >
                {communes.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onMouseDown={() => handleSelectCommune(c)}
                    className="w-full text-left px-3 py-2 hover:bg-gold/10 transition-colors border-b border-white/5 last:border-b-0"
                  >
                    <div className="text-white text-sm font-medium">{c.nom}</div>
                    <div className="text-white/40 text-xs">
                      {c.departement.nom} ({c.departement.code}) · {c.codesPostaux.slice(0, 2).join(", ")}
                      {c.population > 0 && ` · ${c.population.toLocaleString("fr-FR")} hab.`}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Lien "Rechercher sans ville" */}
      {!skipVilleFilter && !selectedCommune && (
        <button
          type="button"
          onClick={handleSkipVille}
          className="text-gold/60 hover:text-gold text-xs underline underline-offset-2 transition-colors"
        >
          Rechercher sans ville
        </button>
      )}

      {/* Retour au filtre ville si on l'a désactivé */}
      {skipVilleFilter && (
        <button
          type="button"
          onClick={() => setSkipVilleFilter(false)}
          className="text-gold/60 hover:text-gold text-xs underline underline-offset-2 transition-colors"
        >
          ← Filtrer par ville
        </button>
      )}

      {/* Champ Nom d'entreprise */}
      <div ref={entContainerRef} className="relative">
        <label className="text-white/60 text-sm mb-1.5 block">
          <Search className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          Nom d'entreprise
          {selectedCommune && (
            <span className="text-gold/60 ml-1">
              a {selectedCommune.nom}
            </span>
          )}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={entQuery}
            onChange={(e) => handleEntChange(e.target.value)}
            onFocus={() => { if (results.length > 0 && !selected) setShowEntDropdown(true); }}
            placeholder={selectedCommune ? `Rechercher a ${selectedCommune.nom}...` : "Ex: La Poste, Hallucine..."}
            className={inputClass}
          />
          {entLoading && (
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

        {entError && (
          <p className="text-red-400 text-[10px] mt-1">{entError}</p>
        )}

        {/* Dropdown entreprises */}
        <AnimatePresence>
          {showEntDropdown && results.length > 0 && (
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
                  onMouseDown={() => handleSelectEnt(r)}
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
    </div>
  );
}
