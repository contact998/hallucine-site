/**
 * Panneau d'administration — Gestion des demandes
 * Tableau triable, filtres par statut/type, changement de statut, notes admin, export CSV
 * Accessible uniquement aux administrateurs
 */
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowUpDown, ArrowUp, ArrowDown, Download, Trash2, MessageSquare,
  Search, Filter, RefreshCw, Clock, CheckCircle, XCircle, Loader2,
  AlertTriangle, ChevronDown, X, FileText, Mail, Phone, Building2, User,
  Send, ExternalLink, Wifi, WifiOff, Newspaper
} from "lucide-react";
import { useTimezone } from "@/hooks/useTimezone";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useNoIndex } from "@/hooks/useNoIndex";

type SortField = "id" | "createdAt" | "type" | "nom" | "email" | "status" | "produit";
type SortDir = "asc" | "desc";

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  en_attente: { label: "En attente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: <Clock className="w-3.5 h-3.5" /> },
  en_cours: { label: "En cours", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: <Loader2 className="w-3.5 h-3.5" /> },
  traite: { label: "Traité", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  annule: { label: "Annulé", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: <XCircle className="w-3.5 h-3.5" /> },
};

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  contact: { label: "Contact", color: "bg-purple-500/20 text-purple-400" },
  devis: { label: "Devis", color: "bg-amber-500/20 text-amber-400" },
  distributeur: { label: "Distributeur", color: "bg-cyan-500/20 text-cyan-400" },
};

function IndexNowButton() {
  const submitAll = trpc.indexnow.submitAll.useMutation();
  return (
    <button
      onClick={() => submitAll.mutate()}
      disabled={submitAll.isPending}
      className={`flex items-center gap-2 px-4 py-2 border rounded text-sm transition-colors ${
        submitAll.isSuccess
          ? "border-green-500/30 text-green-400 bg-green-500/10"
          : submitAll.isError
          ? "border-red-500/30 text-red-400 bg-red-500/10"
          : "border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
      } disabled:opacity-50`}
    >
      {submitAll.isPending ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> Soumission...</>
      ) : submitAll.isSuccess ? (
        <><CheckCircle className="w-4 h-4" /> {submitAll.data?.submitted} URLs soumises</>
      ) : submitAll.isError ? (
        <><AlertTriangle className="w-4 h-4" /> Erreur IndexNow</>
      ) : (
        <><Send className="w-4 h-4" /> IndexNow</>
      )}
    </button>
  );
}

export default function Admin() {
  useDocumentMeta("Administration", "Panneau d'administration Hallucine.");
  useNoIndex();

  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const { formatDate, formatDateOnly, timezoneAbbr } = useTimezone();

  const utils = trpc.useUtils();
  const { data: submissions, isLoading } = trpc.admin.allSubmissions.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const { data: stats } = trpc.admin.stats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const updateStatus = trpc.admin.updateStatus.useMutation({
    onSuccess: () => {
      utils.admin.allSubmissions.invalidate();
      utils.admin.stats.invalidate();
    },
  });

  const updateNote = trpc.admin.updateNote.useMutation({
    onSuccess: () => {
      utils.admin.allSubmissions.invalidate();
      setEditingNote(null);
    },
  });

  const deleteMutation = trpc.admin.deleteSubmission.useMutation({
    onSuccess: () => {
      utils.admin.allSubmissions.invalidate();
      utils.admin.stats.invalidate();
      setConfirmDelete(null);
    },
  });



  const { data: crmStatus } = trpc.admin.crmStatus.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const syncToCrm = trpc.admin.syncToCrm.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        alert("Prospect envoyé au CRM avec succès !");
      } else {
        alert(`Erreur CRM : ${data.error || "Erreur inconnue"}`);
      }
    },
    onError: (err) => {
      alert(`Erreur : ${err.message}`);
    },
  });

  // Filtrage et tri
  const filteredAndSorted = useMemo(() => {
    if (!submissions) return [];
    let result = [...submissions];

    // Filtre par statut
    if (filterStatus !== "all") {
      result = result.filter(s => s.status === filterStatus);
    }
    // Filtre par type
    if (filterType !== "all") {
      result = result.filter(s => s.type === filterType);
    }
    // Recherche
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.nom.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.entreprise && s.entreprise.toLowerCase().includes(q)) ||
        (s.produit && s.produit.toLowerCase().includes(q)) ||
        (s.telephone && s.telephone.includes(q))
      );
    }
    // Tri
    result.sort((a, b) => {
      let cmp = 0;
      const av = a[sortField];
      const bv = b[sortField];
      if (av == null && bv == null) cmp = 0;
      else if (av == null) cmp = -1;
      else if (bv == null) cmp = 1;
      else if (av instanceof Date && bv instanceof Date) cmp = av.getTime() - bv.getTime();
      else if (typeof av === "string" && typeof bv === "string") cmp = av.localeCompare(bv, "fr");
      else if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [submissions, filterStatus, filterType, searchQuery, sortField, sortDir]);

  // Export CSV
  const exportCSV = () => {
    if (!filteredAndSorted.length) return;
    const headers = ["ID", "Date", "Type", "Statut", "Nom", "Email", "Téléphone", "Entreprise", "Produit", "Objectif", "Sujet", "Message", "Note Admin"];
    const rows = filteredAndSorted.map(s => [
      s.id,
      s.createdAt ? formatDateOnly(s.createdAt, "short") : "",
      s.type,
      s.status,
      s.nom,
      s.email,
      s.telephone ?? "",
      s.entreprise ?? "",
      s.produit ?? "",
      s.objectif ?? "",
      s.sujet ?? "",
      (s.message ?? "").replace(/[\n\r]+/g, " "),
      (s.adminNote ?? "").replace(/[\n\r]+/g, " "),
    ]);
    const csvContent = [
      headers.join(";"),
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(";")),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demandes-hallucine-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  // Auth check
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
          <p className="text-white/60 mb-6">Vous devez être connecté en tant qu'administrateur pour accéder à cette page.</p>
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
          <p className="text-white/60 mb-6">Seuls les administrateurs peuvent accéder au panneau de gestion.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container max-w-[1400px]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Panneau d'administration</h1>
              <p className="text-white/50 mt-1">Gestion des demandes de devis et contacts</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { utils.admin.allSubmissions.invalidate(); utils.admin.stats.invalidate(); }}
                className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded hover:border-white/20 text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Actualiser
              </button>
              <button
                onClick={exportCSV}
                disabled={!filteredAndSorted.length}
                className="flex items-center gap-2 px-4 py-2 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light text-sm transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" /> Exporter CSV
              </button>
              <a
                href="/admin/audits"
                className="flex items-center gap-2 px-4 py-2 border border-purple-500/30 text-purple-400 rounded hover:bg-purple-500/10 text-sm transition-colors"
              >
                <FileText className="w-4 h-4" /> Audits IA
              </a>
              <a
                href="/admin/analytics"
                className="flex items-center gap-2 px-4 py-2 border border-green-500/30 text-green-400 rounded hover:bg-green-500/10 text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Analytics
              </a>
              <a
                href="/admin/calculateurs"
                className="flex items-center gap-2 px-4 py-2 border border-amber-500/30 text-amber-400 rounded hover:bg-amber-500/10 text-sm transition-colors"
              >
                <FileText className="w-4 h-4" /> Calculateurs
              </a>
              <a
                href="https://hallucine-crm-production.up.railway.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-cyan-500/30 text-cyan-400 rounded hover:bg-cyan-500/10 text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Ouvrir CRM
              </a>
              <a
                href="/admin/blog"
                className="flex items-center gap-2 px-4 py-2 border border-rose-500/30 text-rose-400 rounded hover:bg-rose-500/10 text-sm transition-colors"
              >
                <Newspaper className="w-4 h-4" /> Blog
              </a>
              <a
                href="/admin/media"
                className="flex items-center gap-2 px-4 py-2 border border-purple-500/30 text-purple-400 rounded hover:bg-purple-500/10 text-sm transition-colors"
              >
                <FileText className="w-4 h-4" /> Médiathèque
              </a>
              <IndexNowButton />
            </div>
          </div>

          {/* CRM Status Banner */}
          {crmStatus && (
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border mb-4 ${
              crmStatus.configured
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
            }`}>
              {crmStatus.configured ? (
                <Wifi className="w-5 h-5" />
              ) : (
                <WifiOff className="w-5 h-5" />
              )}
              <div className="flex-1">
                <span className="font-medium text-sm">
                  {crmStatus.configured
                    ? "Synchronisation CRM active — Les demandes de devis sont automatiquement envoyées au CRM Hallucine"
                    : "Synchronisation CRM non configurée — Configurez CRM_WEBHOOK_URL et CRM_WEBHOOK_TOKEN dans les secrets"}
                </span>
              </div>
              <a
                href="https://hallucine-crm-production.up.railway.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium hover:underline"
              >
                Ouvrir le CRM <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}



          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
              <StatCard label="Total" value={stats.total} color="text-white" />
              <StatCard label="En attente" value={stats.en_attente} color="text-yellow-400" />
              <StatCard label="En cours" value={stats.en_cours} color="text-blue-400" />
              <StatCard label="Traités" value={stats.traite} color="text-green-400" />
              <StatCard label="Annulés" value={stats.annule} color="text-red-400" />
              <StatCard label="Contacts" value={stats.contact} color="text-purple-400" />
              <StatCard label="Devis" value={stats.devis} color="text-amber-400" />
              <StatCard label="Distributeurs" value={stats.distributeur} color="text-cyan-400" />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, entreprise, produit..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/30 focus:border-warm/50 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-white/40 hover:text-white" />
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded text-sm text-white focus:border-warm/50 focus:outline-none transition-colors"
              >
                <option value="all">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="en_cours">En cours</option>
                <option value="traite">Traité</option>
                <option value="annule">Annulé</option>
              </select>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded text-sm text-white focus:border-warm/50 focus:outline-none transition-colors"
              >
                <option value="all">Tous les types</option>
                <option value="contact">Contact</option>
                <option value="devis">Devis</option>
                <option value="distributeur">Distributeur</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-white/40 mb-3">
            {filteredAndSorted.length} résultat{filteredAndSorted.length !== 1 ? "s" : ""}
            {(filterStatus !== "all" || filterType !== "all" || searchQuery) && " (filtré)"}
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-warm" />
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="text-center py-20 text-white/40">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>Aucune demande trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <Th field="id" label="#" sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIcon={SortIcon} />
                    <Th field="createdAt" label="Date" sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIcon={SortIcon} />
                    <Th field="type" label="Type" sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIcon={SortIcon} />
                    <Th field="nom" label="Nom" sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIcon={SortIcon} />
                    <Th field="email" label="Email" sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIcon={SortIcon} />
                    <Th field="produit" label="Produit" sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIcon={SortIcon} />
                    <Th field="status" label="Statut" sortField={sortField} sortDir={sortDir} onSort={toggleSort} SortIcon={SortIcon} />
                    <th className="px-4 py-3 text-left text-white/60 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSorted.map(sub => (
                    <SubmissionRow
                      key={sub.id}
                      sub={sub}
                      isExpanded={expandedRow === sub.id}
                      onToggleExpand={() => setExpandedRow(expandedRow === sub.id ? null : sub.id)}
                      onUpdateStatus={(status) => updateStatus.mutate({ submissionId: sub.id, status })}
                      isEditingNote={editingNote === sub.id}
                      noteText={noteText}
                      onStartEditNote={() => { setEditingNote(sub.id); setNoteText(sub.adminNote ?? ""); }}
                      onCancelEditNote={() => setEditingNote(null)}
                      onSaveNote={() => updateNote.mutate({ submissionId: sub.id, note: noteText })}
                      onNoteChange={setNoteText}
                      isConfirmingDelete={confirmDelete === sub.id}
                      onStartDelete={() => setConfirmDelete(sub.id)}
                      onCancelDelete={() => setConfirmDelete(null)}
                      onConfirmDelete={() => deleteMutation.mutate({ submissionId: sub.id })}
                      isSavingNote={updateNote.isPending}
                      onSyncToCrm={() => syncToCrm.mutate({ submissionId: sub.id })}
                      isSyncingCrm={syncToCrm.isPending}
                      crmConfigured={crmStatus?.configured}
                      formatDate={formatDate}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-white/50 mt-1">{label}</div>
    </div>
  );
}

function Th({ field, label, sortField, sortDir, onSort, SortIcon }: {
  field: SortField; label: string; sortField: SortField; sortDir: SortDir;
  onSort: (f: SortField) => void; SortIcon: React.FC<{ field: SortField }>;
}) {
  return (
    <th className="px-4 py-3 text-left text-white/60 font-medium cursor-pointer hover:text-white/80 transition-colors select-none" onClick={() => onSort(field)}>
      <div className="flex items-center gap-1.5">
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );
}

interface SubmissionRowProps {
  sub: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateStatus: (status: "en_attente" | "en_cours" | "traite" | "annule") => void;
  isEditingNote: boolean;
  noteText: string;
  onStartEditNote: () => void;
  onCancelEditNote: () => void;
  onSaveNote: () => void;
  onNoteChange: (v: string) => void;
  isConfirmingDelete: boolean;
  onStartDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  isSavingNote: boolean;
  onSyncToCrm?: () => void;
  isSyncingCrm?: boolean;
  crmConfigured?: boolean;
  formatDate: (date: Date | string | number, options?: any) => string;
}

function SubmissionRow({
  sub, isExpanded, onToggleExpand, onUpdateStatus,
  isEditingNote, noteText, onStartEditNote, onCancelEditNote, onSaveNote, onNoteChange,
  isConfirmingDelete, onStartDelete, onCancelDelete, onConfirmDelete, isSavingNote,
  onSyncToCrm, isSyncingCrm, crmConfigured, formatDate,
}: SubmissionRowProps) {
  const statusInfo = STATUS_LABELS[sub.status] ?? STATUS_LABELS.en_attente;
  const typeInfo = TYPE_LABELS[sub.type] ?? TYPE_LABELS.contact;

  return (
    <>
      <tr
        className={`border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors ${isExpanded ? "bg-white/[0.03]" : ""}`}
        onClick={onToggleExpand}
      >
        <td className="px-4 py-3 text-white/40 font-mono text-xs">{sub.id}</td>
        <td className="px-4 py-3 text-white/70 whitespace-nowrap">
          {sub.createdAt ? formatDate(sub.createdAt) : "—"}
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
        </td>
        <td className="px-4 py-3 text-white font-medium">{sub.nom}</td>
        <td className="px-4 py-3 text-white/70">{sub.email}</td>
        <td className="px-4 py-3 text-white/60 max-w-[200px] truncate">{sub.produit ?? "—"}</td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </td>
        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-1">
            <button onClick={onToggleExpand} className="p-1.5 hover:bg-white/10 rounded transition-colors" title="Détails">
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </button>
                      <button onClick={onStartEditNote} className="p-1.5 hover:bg-white/10 rounded transition-colors" title="Note">
                              <MessageSquare className="w-4 h-4 text-white/50 hover:text-white" />
                            </button>
                            {crmConfigured && sub.type !== "contact" && (
                              <button
                                onClick={() => onSyncToCrm?.()}
                                disabled={isSyncingCrm}
                                className="p-1.5 hover:bg-cyan-500/10 rounded transition-colors" title="Envoyer au CRM"
                              >
                                {isSyncingCrm ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : <Send className="w-4 h-4 text-cyan-400/50 hover:text-cyan-400" />}
                              </button>
                            )}
            {isConfirmingDelete ? (
              <div className="flex items-center gap-1">
                <button onClick={onConfirmDelete} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30">Oui</button>
                <button onClick={onCancelDelete} className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded hover:bg-white/20">Non</button>
              </div>
            ) : (
              <button onClick={onStartDelete} className="p-1.5 hover:bg-red-500/10 rounded transition-colors" title="Supprimer">
                <Trash2 className="w-4 h-4 text-white/30 hover:text-red-400" />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded row */}
      {isExpanded && (
        <tr className="bg-white/[0.02]">
          <td colSpan={8} className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Infos contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Informations de contact</h4>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-white/30" />
                  <span className="text-white">{sub.nom}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-white/30" />
                  <a href={`mailto:${sub.email}`} className="text-warm hover:underline">{sub.email}</a>
                </div>
                {sub.telephone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-white/30" />
                    <a href={`tel:${sub.telephone}`} className="text-white/70 hover:text-white">{sub.telephone}</a>
                  </div>
                )}
                {sub.entreprise && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-white/30" />
                    <span className="text-white/70">{sub.entreprise}</span>
                  </div>
                )}
              </div>

              {/* Détails demande */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Détails de la demande</h4>
                {sub.produit && <DetailItem label="Produit" value={sub.produit} />}
                {sub.objectif && <DetailItem label="Objectif" value={sub.objectif === "achat" ? "Achat" : sub.objectif === "location" ? "Location" : sub.objectif} />}
                {sub.sujet && <DetailItem label="Sujet" value={sub.sujet} />}
                {sub.message && (
                  <div>
                    <span className="text-xs text-white/40">Message :</span>
                    <p className="text-sm text-white/70 mt-1 whitespace-pre-wrap bg-white/5 rounded p-3 max-h-32 overflow-y-auto">{sub.message}</p>
                  </div>
                )}
              </div>

              {/* Actions admin */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Actions admin</h4>
                {/* Changement de statut */}
                <div>
                  <span className="text-xs text-white/40 block mb-2">Changer le statut :</span>
                  <div className="flex flex-wrap gap-2">
                    {(["en_attente", "en_cours", "traite", "annule"] as const).map(status => {
                      const info = STATUS_LABELS[status];
                      const isActive = sub.status === status;
                      return (
                        <button
                          key={status}
                          onClick={() => onUpdateStatus(status)}
                          disabled={isActive}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all ${
                            isActive
                              ? `${info.color} opacity-100`
                              : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                          } disabled:cursor-default`}
                        >
                          {info.icon}
                          {info.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Note admin */}
                <div>
                  <span className="text-xs text-white/40 block mb-2">Note admin :</span>
                  {isEditingNote ? (
                    <div className="space-y-2">
                      <textarea
                        value={noteText}
                        onChange={e => onNoteChange(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/30 focus:border-warm/50 focus:outline-none resize-none"
                        placeholder="Ajouter une note interne..."
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={onSaveNote}
                          disabled={isSavingNote}
                          className="px-3 py-1.5 bg-warm text-charcoal text-xs font-semibold rounded hover:bg-warm-light transition-colors disabled:opacity-50"
                        >
                          {isSavingNote ? "Sauvegarde..." : "Sauvegarder"}
                        </button>
                        <button
                          onClick={onCancelEditNote}
                          className="px-3 py-1.5 border border-white/10 text-white/60 text-xs rounded hover:border-white/20 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={onStartEditNote}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white/60 cursor-pointer hover:border-white/20 transition-colors min-h-[60px]"
                    >
                      {sub.adminNote || <span className="text-white/30 italic">Cliquer pour ajouter une note...</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-white/40">{label} :</span>
      <p className="text-sm text-white/70">{value}</p>
    </div>
  );
}


