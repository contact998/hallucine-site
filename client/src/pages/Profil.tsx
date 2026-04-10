/**
 * Page Profil Utilisateur
 * Affiche les informations du compte et la liste des devis/demandes
 * Permet d'annuler les demandes en attente
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  LogOut,
  Mail,
  Calendar,
  Globe,
} from "lucide-react";
import { useTimezone } from "@/hooks/useTimezone";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useNoIndex } from "@/hooks/useNoIndex";
import { detectLanguage } from "@/i18n/config";
import { getRoute } from "@/i18n/routes";

type SortField = "createdAt" | "type" | "status" | "sujet";
type SortDir = "asc" | "desc";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  en_attente: { label: "En attente", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", icon: Clock },
  en_cours: { label: "En cours", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", icon: AlertCircle },
  traite: { label: "Traité", color: "text-green-400 bg-green-400/10 border-green-400/30", icon: CheckCircle },
  annule: { label: "Annulé", color: "text-red-400 bg-red-400/10 border-red-400/30", icon: XCircle },
};

const typeLabels: Record<string, string> = {
  contact: "Contact",
  devis: "Demande de devis",
  distributeur: "Distributeur",
};

function SortHeader({
  label,
  field,
  currentSort,
  currentDir,
  onSort,
}: {
  label: string;
  field: SortField;
  currentSort: SortField;
  currentDir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const isActive = currentSort === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1.5 text-xs font-semibold text-warm uppercase tracking-wider hover:text-warm-light transition-colors group"
    >
      {label}
      {isActive ? (
        currentDir === "asc" ? (
          <ArrowUp className="w-3.5 h-3.5" />
        ) : (
          <ArrowDown className="w-3.5 h-3.5" />
        )
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-70" />
      )}
    </button>
  );
}

export default function Profil() {
  const lang = detectLanguage();
  useDocumentMeta("Mon Profil | Mes Demandes", "Consultez votre profil et suivez l'état de vos demandes de devis Hallucine.");
  useNoIndex();

  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const { timezoneAbbr, formatDate, formatDateOnly } = useTimezone();

  const { data: submissions, isLoading, refetch } = trpc.profile.mySubmissions.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const cancelMutation = trpc.profile.cancelSubmission.useMutation({
    onSuccess: () => {
      refetch();
      setCancellingId(null);
    },
    onError: () => {
      setCancellingId(null);
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const handleCancel = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir annuler cette demande ?")) {
      setCancellingId(id);
      cancelMutation.mutate({ submissionId: id });
    }
  };

  const sortedSubmissions = useMemo(() => {
    if (!submissions) return [];
    return [...submissions].sort((a, b) => {
      let cmp = 0;
      if (sortField === "createdAt") {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === "type") {
        cmp = (a.type || "").localeCompare(b.type || "");
      } else if (sortField === "status") {
        cmp = (a.status || "").localeCompare(b.status || "");
      } else if (sortField === "sujet") {
        cmp = (a.sujet || "").localeCompare(b.sujet || "");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [submissions, sortField, sortDir]);

  // Compteurs par statut
  const counts = useMemo(() => {
    if (!submissions) return { total: 0, en_attente: 0, en_cours: 0, traite: 0, annule: 0 };
    return {
      total: submissions.length,
      en_attente: submissions.filter((s) => s.status === "en_attente").length,
      en_cours: submissions.filter((s) => s.status === "en_cours").length,
      traite: submissions.filter((s) => s.status === "traite").length,
      annule: submissions.filter((s) => s.status === "annule").length,
    };
  }, [submissions]);

  /* ── Non connecté ── */
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container max-w-lg text-center">
            <User className="w-16 h-16 text-warm mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-ivory mb-4">Connectez-vous</h1>
            <p className="text-white/60 mb-8">
              Connectez-vous pour accéder à votre profil et suivre vos demandes de devis.
            </p>
            <a
              href={getLoginUrl()}
              className="inline-flex items-center gap-2 px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
            >
              Se connecter
            </a>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  /* ── Chargement ── */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container flex justify-center">
            <Loader2 className="w-8 h-8 text-warm animate-spin" />
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-8 bg-charcoal-light">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-ivory mb-2">Mon Profil</h1>
              <p className="text-white/60">Gérez vos informations et suivez vos demandes.</p>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white/70 rounded hover:border-red-400/50 hover:text-red-400 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </section>

      {/* Infos utilisateur */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-ivory mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-warm" />
              Informations du compte
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-white/40" />
                <div>
                  <p className="text-xs text-white/40">Nom</p>
                  <p className="text-ivory">{user?.name || "Non renseigné"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/40" />
                <div>
                  <p className="text-xs text-white/40">Email</p>
                  <p className="text-ivory">{user?.email || "Non renseigné"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-white/40" />
                <div>
                  <p className="text-xs text-white/40">Membre depuis</p>
                  <p className="text-ivory">
                    {user?.createdAt
                      ? formatDateOnly(user.createdAt, "long")
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-white/40" />
                <div>
                  <p className="text-xs text-white/40">Fuseau horaire</p>
                  <p className="text-ivory text-sm">{timezoneAbbr}</p>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Compteurs */}
      <section className="py-8 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Total", count: counts.total, color: "text-ivory" },
              { label: "En attente", count: counts.en_attente, color: "text-yellow-400" },
              { label: "En cours", count: counts.en_cours, color: "text-blue-400" },
              { label: "Traités", count: counts.traite, color: "text-green-400" },
              { label: "Annulés", count: counts.annule, color: "text-red-400" },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border rounded-lg p-4 text-center">
                <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                <p className="text-xs text-white/50 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tableau des demandes */}
      <section className="py-8 bg-background">
        <div className="container">
          <h2 className="text-xl font-semibold text-ivory mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-warm" />
            Mes demandes ({counts.total})
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-warm animate-spin" />
            </div>
          ) : sortedSubmissions.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-ivory mb-2">Aucune demande</h3>
              <p className="text-white/50 mb-6">
                Vous n'avez pas encore fait de demande de devis ou de contact.
              </p>
              <Link
                href={getRoute("contact", lang)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
              >
                Demander un devis
              </Link>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-warm/20 bg-white/[0.02]">
                      <th className="text-left py-4 px-4">
                        <SortHeader label="Date" field="createdAt" currentSort={sortField} currentDir={sortDir} onSort={handleSort} />
                      </th>
                      <th className="text-left py-4 px-4">
                        <SortHeader label="Type" field="type" currentSort={sortField} currentDir={sortDir} onSort={handleSort} />
                      </th>
                      <th className="text-left py-4 px-4">
                        <SortHeader label="Sujet" field="sujet" currentSort={sortField} currentDir={sortDir} onSort={handleSort} />
                      </th>
                      <th className="text-left py-4 px-4">
                        <SortHeader label="Statut" field="status" currentSort={sortField} currentDir={sortDir} onSort={handleSort} />
                      </th>
                      <th className="text-left py-4 px-4">
                        <span className="text-xs font-semibold text-warm uppercase tracking-wider">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSubmissions.map((sub) => {
                      const sc = statusConfig[sub.status] || statusConfig.en_attente;
                      const StatusIcon = sc.icon;
                      return (
                        <tr key={sub.id} className="border-b border-border hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-4 text-white/70 whitespace-nowrap">
                            {formatDate(sub.createdAt)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-ivory font-medium">{typeLabels[sub.type] || sub.type}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="max-w-xs">
                              <p className="text-ivory truncate">{sub.sujet || "—"}</p>
                              {sub.produit && (
                                <p className="text-white/40 text-xs mt-0.5 truncate">{sub.produit}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${sc.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {sc.label}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {(sub.status === "en_attente" || sub.status === "en_cours") && (
                              <button
                                onClick={() => handleCancel(sub.id)}
                                disabled={cancellingId === sub.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-400/30 text-red-400 rounded hover:bg-red-400/10 transition-colors disabled:opacity-50"
                              >
                                {cancellingId === sub.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <XCircle className="w-3 h-3" />
                                )}
                                Annuler
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-charcoal-light">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-ivory mb-4">Besoin d'un nouveau devis ?</h2>
          <p className="text-white/60 mb-6">
            Consultez nos tarifs ou contactez-nous directement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={getRoute("contact", lang)}
              className="px-8 py-3 bg-warm text-charcoal font-semibold rounded hover:bg-warm-light transition-colors"
            >
              Demander un devis
            </Link>
            <Link
              href={getRoute("contact", lang)}
              className="px-8 py-3 border border-warm/30 text-warm font-semibold rounded hover:bg-warm/10 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
