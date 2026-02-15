/**
 * Historique des Audits IA — Interface admin
 * Tableau triable des audits passés, détail de chaque audit,
 * comparaison semaine N vs N-1 avec indicateurs de variation
 */
import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowUpDown, ArrowUp, ArrowDown, Loader2, AlertTriangle,
  TrendingUp, TrendingDown, Minus, BarChart3, Eye, Users,
  MousePointerClick, Clock, FileText, Mail, Calendar,
  ChevronLeft, ChevronDown, ChevronUp, Play, RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { Link } from "wouter";

type SortField = "createdAt" | "totalPageViews" | "uniqueVisitors" | "totalEvents" | "avgDuration" | "weeklySubmissions";
type SortDir = "asc" | "desc";

function VariationBadge({ value, suffix = "%" }: { value: number | null; suffix?: string }) {
  if (value === null) return <span className="text-white/30 text-xs">—</span>;
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const color = isPositive ? "text-green-400" : isNeutral ? "text-white/50" : "text-red-400";
  const Icon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {isPositive ? "+" : ""}{value}{suffix}
    </span>
  );
}

function KpiCard({
  icon: Icon, label, current, previous, variation,
}: {
  icon: React.ElementType;
  label: string;
  current: number;
  previous: number | null;
  variation: number | null;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-warm" />
        <span className="text-xs text-white/50 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{current.toLocaleString("fr-FR")}</div>
      <div className="flex items-center gap-2 mt-1">
        {previous !== null && (
          <span className="text-xs text-white/30">vs {previous.toLocaleString("fr-FR")}</span>
        )}
        <VariationBadge value={variation} />
      </div>
    </div>
  );
}

export default function AdminAuditHistory() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedAuditId, setSelectedAuditId] = useState<number | null>(null);

  const utils = trpc.useUtils();

  const { data: auditList, isLoading: listLoading } = trpc.audit.history.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: comparison, isLoading: compLoading } = trpc.audit.comparison.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: selectedAudit, isLoading: detailLoading } = trpc.audit.getById.useQuery(
    { id: selectedAuditId! },
    { enabled: !!selectedAuditId && isAuthenticated && user?.role === "admin" }
  );

  const runAudit = trpc.audit.runNow.useMutation({
    onSuccess: () => {
      utils.audit.history.invalidate();
      utils.audit.comparison.invalidate();
    },
  });

  // Tri
  const sortedAudits = useMemo(() => {
    if (!auditList) return [];
    const result = [...auditList];
    result.sort((a, b) => {
      let cmp = 0;
      const av = a[sortField];
      const bv = b[sortField];
      if (av == null && bv == null) cmp = 0;
      else if (av == null) cmp = -1;
      else if (bv == null) cmp = 1;
      else if (av instanceof Date && bv instanceof Date) cmp = av.getTime() - bv.getTime();
      else if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [auditList, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-warm" /> : <ArrowDown className="w-3.5 h-3.5 text-warm" />;
  };

  // Auth checks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-warm" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="pt-32 pb-20 container text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Accès restreint</h1>
          <p className="text-white/60 mb-6">Vous devez être connecté en tant qu'administrateur.</p>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 px-6 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors">
            Se connecter
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="pt-32 pb-20 container text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p className="text-white/60">Seuls les administrateurs peuvent accéder à cette page.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Vue détail d'un audit
  if (selectedAuditId) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="pt-28 pb-20">
          <div className="container max-w-[1200px]">
            <button
              onClick={() => setSelectedAuditId(null)}
              className="flex items-center gap-2 text-warm hover:text-warm-light transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Retour à l'historique
            </button>

            {detailLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-warm" />
              </div>
            ) : selectedAudit ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Audit IA — {selectedAudit.period}</h1>
                    <p className="text-white/50 mt-1">
                      Généré le {new Date(selectedAudit.createdAt).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      {" "}• Fuseau : {selectedAudit.timezone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium ${
                      selectedAudit.emailSent === "sent"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : selectedAudit.emailSent === "failed"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}>
                      <Mail className="w-3 h-3" />
                      {selectedAudit.emailSent === "sent" ? "Email envoyé" : selectedAudit.emailSent === "failed" ? "Échec envoi" : "En attente"}
                    </span>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <Eye className="w-4 h-4 text-warm mx-auto mb-1" />
                    <div className="text-xl font-bold">{selectedAudit.totalPageViews.toLocaleString("fr-FR")}</div>
                    <div className="text-xs text-white/50">Pages vues</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <div className="text-xl font-bold">{selectedAudit.uniqueVisitors.toLocaleString("fr-FR")}</div>
                    <div className="text-xs text-white/50">Visiteurs uniques</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <MousePointerClick className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <div className="text-xl font-bold">{selectedAudit.totalEvents.toLocaleString("fr-FR")}</div>
                    <div className="text-xs text-white/50">Événements</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <Clock className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <div className="text-xl font-bold">{selectedAudit.avgDuration}s</div>
                    <div className="text-xs text-white/50">Durée moy.</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <FileText className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                    <div className="text-xl font-bold">{selectedAudit.totalSubmissions}</div>
                    <div className="text-xs text-white/50">Soumissions totales</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <FileText className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <div className="text-xl font-bold">{selectedAudit.weeklySubmissions}</div>
                    <div className="text-xs text-white/50">Cette semaine</div>
                  </div>
                </div>

                {/* Sections du rapport */}
                {[
                  { title: "1. Résumé des performances", content: selectedAudit.performanceSummary, icon: BarChart3, color: "text-warm" },
                  { title: "2. Analyse du workflow", content: selectedAudit.workflowAnalysis, icon: MousePointerClick, color: "text-blue-400" },
                  { title: "3. Analyse de conversion", content: selectedAudit.conversionAnalysis, icon: TrendingUp, color: "text-green-400" },
                  { title: "4. Recommandations techniques", content: selectedAudit.codeRecommendations, icon: FileText, color: "text-purple-400" },
                  { title: "5. Actions prioritaires", content: selectedAudit.prioritizedActions, icon: Play, color: "text-amber-400" },
                ].map((section, i) => (
                  <AuditSection key={i} {...section} />
                ))}
              </div>
            ) : (
              <p className="text-white/50 text-center py-20">Audit introuvable.</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Vue liste
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container max-w-[1400px]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Link href="/admin" className="text-warm hover:text-warm-light transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-bold">Historique des Audits IA</h1>
              </div>
              <p className="text-white/50 mt-1 ml-8">Suivi de l'évolution du site semaine après semaine</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { utils.audit.history.invalidate(); utils.audit.comparison.invalidate(); }}
                className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded hover:border-white/20 text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Actualiser
              </button>
              <button
                onClick={() => runAudit.mutate()}
                disabled={runAudit.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light text-sm transition-colors disabled:opacity-50"
              >
                {runAudit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Lancer un audit maintenant
              </button>
            </div>
          </div>

          {/* Comparaison semaine N vs N-1 */}
          {!compLoading && comparison && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-warm" />
                Comparaison semaine N vs N-1
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <KpiCard
                  icon={Eye}
                  label="Pages vues"
                  current={comparison.current.totalPageViews}
                  previous={comparison.previous?.totalPageViews ?? null}
                  variation={comparison.variations.pageViews}
                />
                <KpiCard
                  icon={Users}
                  label="Visiteurs"
                  current={comparison.current.uniqueVisitors}
                  previous={comparison.previous?.uniqueVisitors ?? null}
                  variation={comparison.variations.visitors}
                />
                <KpiCard
                  icon={MousePointerClick}
                  label="Événements"
                  current={comparison.current.totalEvents}
                  previous={comparison.previous?.totalEvents ?? null}
                  variation={comparison.variations.events}
                />
                <KpiCard
                  icon={Clock}
                  label="Durée moy."
                  current={comparison.current.avgDuration}
                  previous={comparison.previous?.avgDuration ?? null}
                  variation={comparison.variations.duration}
                />
                <KpiCard
                  icon={FileText}
                  label="Soumissions"
                  current={comparison.current.weeklySubmissions}
                  previous={comparison.previous?.weeklySubmissions ?? null}
                  variation={comparison.variations.submissions}
                />
              </div>
              {comparison.previous && (
                <p className="text-xs text-white/30 mt-2">
                  Semaine actuelle : {comparison.current.period} • Semaine précédente : {comparison.previous.period}
                </p>
              )}
              {!comparison.previous && (
                <p className="text-xs text-white/30 mt-2">
                  Premier audit — les variations seront disponibles après le prochain audit hebdomadaire.
                </p>
              )}
            </div>
          )}

          {/* Tableau des audits */}
          {listLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-warm" />
            </div>
          ) : sortedAudits.length === 0 ? (
            <div className="text-center py-20">
              <BarChart3 className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aucun audit enregistré</h2>
              <p className="text-white/50 mb-6">Lancez votre premier audit pour commencer le suivi.</p>
              <button
                onClick={() => runAudit.mutate()}
                disabled={runAudit.isPending}
                className="inline-flex items-center gap-2 px-6 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors disabled:opacity-50"
              >
                {runAudit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Lancer le premier audit
              </button>
            </div>
          ) : (
            <>
              <div className="text-sm text-white/40 mb-3">
                {sortedAudits.length} audit{sortedAudits.length !== 1 ? "s" : ""} enregistré{sortedAudits.length !== 1 ? "s" : ""}
              </div>
              <div className="overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <ThSort field="createdAt" label="Date" sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIconComp={SortIcon} />
                      <th className="px-4 py-3 text-left text-white/60 font-medium">Période</th>
                      <ThSort field="totalPageViews" label="Pages vues" sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIconComp={SortIcon} />
                      <ThSort field="uniqueVisitors" label="Visiteurs" sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIconComp={SortIcon} />
                      <ThSort field="totalEvents" label="Événements" sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIconComp={SortIcon} />
                      <ThSort field="avgDuration" label="Durée moy." sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIconComp={SortIcon} />
                      <ThSort field="weeklySubmissions" label="Soumissions" sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIconComp={SortIcon} />
                      <th className="px-4 py-3 text-left text-white/60 font-medium">Email</th>
                      <th className="px-4 py-3 text-left text-white/60 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAudits.map((audit, idx) => {
                      const prev = sortedAudits[idx + 1]; // previous week (next row since sorted desc)
                      return (
                        <tr
                          key={audit.id}
                          className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-white/30" />
                              {new Date(audit.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-white/50 text-xs">{audit.period}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{audit.totalPageViews.toLocaleString("fr-FR")}</span>
                              {prev && <VariationBadge value={calcVar(audit.totalPageViews, prev.totalPageViews)} />}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{audit.uniqueVisitors.toLocaleString("fr-FR")}</span>
                              {prev && <VariationBadge value={calcVar(audit.uniqueVisitors, prev.uniqueVisitors)} />}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{audit.totalEvents.toLocaleString("fr-FR")}</span>
                              {prev && <VariationBadge value={calcVar(audit.totalEvents, prev.totalEvents)} />}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-white/70">{audit.avgDuration}s</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{audit.weeklySubmissions}</span>
                              {prev && <VariationBadge value={calcVar(audit.weeklySubmissions, prev.weeklySubmissions)} />}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                              audit.emailSent === "sent"
                                ? "bg-green-500/20 text-green-400"
                                : audit.emailSent === "failed"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              <Mail className="w-3 h-3" />
                              {audit.emailSent === "sent" ? "Envoyé" : audit.emailSent === "failed" ? "Échec" : "En attente"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedAuditId(audit.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-warm/10 text-warm rounded text-xs font-medium hover:bg-warm/20 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> Détail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Helper pour calculer la variation inline
function calcVar(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

// Composant section d'audit
function AuditSection({
  title, content, icon: Icon, color,
}: {
  title: string; content: string; icon: React.ElementType; color: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${color}`} />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-white/40" /> : <ChevronDown className="w-5 h-5 text-white/40" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

// Composant th triable
function ThSort({
  field, label, sortField, sortDir, onSort, SortIconComp,
}: {
  field: SortField; label: string; sortField: SortField; sortDir: SortDir;
  onSort: (f: SortField) => void; SortIconComp: React.FC<{ field: SortField }>;
}) {
  return (
    <th
      className="px-4 py-3 text-left text-white/60 font-medium cursor-pointer hover:text-white/80 transition-colors select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1.5">
        {label}
        <SortIconComp field={field} />
      </div>
    </th>
  );
}
