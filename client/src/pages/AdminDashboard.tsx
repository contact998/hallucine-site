/**
 * Dashboard Analytics Admin — Visualisation des statistiques et recommandations IA
 * Graphiques de trafic, sources, appareils, pages populaires
 * Recommandations IA pour améliorer le taux de conversion (capture de coordonnées)
 */
import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useNoIndex } from "@/hooks/useNoIndex";
import {
  BarChart3, TrendingUp, Users, Clock, Eye, MousePointerClick,
  Smartphone, Monitor, Tablet, Globe, ArrowLeft, Loader2,
  Sparkles, AlertTriangle, ArrowUp, ArrowDown, Lightbulb,
  Target, Zap, Settings, MapPin
} from "lucide-react";

export default function AdminDashboard() {
  useDocumentMeta("Dashboard Analytics", "Tableau de bord analytics Hallucine.");
  useNoIndex();

  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [daysBack, setDaysBack] = useState(30);

  const { data: analytics, isLoading } = trpc.admin.analyticsOverview.useQuery(
    { daysBack },
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: aiInsights, isLoading: aiLoading } = trpc.admin.aiInsights.useQuery(
    { daysBack },
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: businessConfig } = trpc.businessHours.getConfig.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const updateTimezone = trpc.businessHours.updateTimezone.useMutation({
    onSuccess: () => window.location.reload(),
  });
  const updateHours = trpc.businessHours.updateHours.useMutation({
    onSuccess: () => window.location.reload(),
  });
  const updateWorkDays = trpc.businessHours.updateWorkDays.useMutation({
    onSuccess: () => window.location.reload(),
  });

  // Auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }
  if (!isAuthenticated || !user) {
    window.location.href = getLoginUrl();
    return null;
  }
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-20 text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
          <p className="text-muted-foreground">Cette page est réservée aux administrateurs.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const overview = analytics?.overview;
  const conversionRate = overview?.uniqueVisitors
    ? ((analytics?.topEvents?.filter(e => e.eventType === "form_submit").reduce((a, b) => a + b.count, 0) ?? 0) / overview.uniqueVisitors * 100).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container pt-28 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="w-7 h-7 text-amber-500" />
                Dashboard Analytics
              </h1>
              <p className="text-sm text-muted-foreground">Statistiques et recommandations IA pour la conversion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[7, 14, 30, 90].map(d => (
              <button
                key={d}
                onClick={() => setDaysBack(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  daysBack === d ? "bg-amber-500 text-black" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {d}j
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <KpiCard icon={<Eye className="w-5 h-5" />} label="Pages vues" value={overview?.totalPageViews ?? 0} color="text-blue-400" />
              <KpiCard icon={<Users className="w-5 h-5" />} label="Visiteurs uniques" value={overview?.uniqueVisitors ?? 0} color="text-green-400" />
              <KpiCard icon={<Clock className="w-5 h-5" />} label="Durée moy." value={`${overview?.avgDuration ?? 0}s`} color="text-purple-400" />
              <KpiCard icon={<Target className="w-5 h-5" />} label="Taux conversion" value={`${conversionRate}%`} color="text-amber-400" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Daily Page Views */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Visites par jour
                </h3>
                <DailyChart data={analytics?.dailyViews ?? []} />
              </div>

              {/* Top Pages */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Pages les plus visitées
                </h3>
                <div className="space-y-2">
                  {(analytics?.topPages ?? []).slice(0, 8).map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1 mr-2">{p.path === "/" ? "Accueil" : p.path}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${Math.min(100, (p.views / (analytics?.topPages?.[0]?.views ?? 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground w-10 text-right">{p.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Sources de trafic
                </h3>
                <div className="space-y-3">
                  {(analytics?.trafficSources ?? []).map((s, i) => {
                    const colors = ["bg-blue-500", "bg-green-500", "bg-amber-500", "bg-purple-500", "bg-cyan-500", "bg-red-500"];
                    const total = analytics?.trafficSources?.reduce((a, b) => a + b.views, 0) ?? 1;
                    const pct = ((s.views / total) * 100).toFixed(0);
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`} />
                        <span className="text-sm flex-1 capitalize">{s.source ?? "Direct"}</span>
                        <span className="text-sm text-muted-foreground">{pct}%</span>
                        <span className="text-sm font-medium w-10 text-right">{s.views}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Devices */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Appareils
                </h3>
                <div className="flex items-center justify-center gap-8 py-4">
                  {(analytics?.devices ?? []).map((d, i) => {
                    const icons: Record<string, React.ReactNode> = {
                      desktop: <Monitor className="w-8 h-8" />,
                      mobile: <Smartphone className="w-8 h-8" />,
                      tablet: <Tablet className="w-8 h-8" />,
                    };
                    const total = analytics?.devices?.reduce((a, b) => a + b.views, 0) ?? 1;
                    const pct = ((d.views / total) * 100).toFixed(0);
                    return (
                      <div key={i} className="text-center">
                        <div className="text-muted-foreground mb-2">{icons[d.device ?? "desktop"] ?? <Monitor className="w-8 h-8" />}</div>
                        <div className="text-lg font-bold">{pct}%</div>
                        <div className="text-xs text-muted-foreground capitalize">{d.device ?? "Autre"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Events */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4" /> Événements fréquents
                </h3>
                <div className="space-y-2">
                  {(analytics?.topEvents ?? []).slice(0, 8).map((e, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1 mr-2">{e.eventType}</span>
                      <span className="text-muted-foreground">{e.count}</span>
                    </div>
                  ))}
                  {(!analytics?.topEvents || analytics.topEvents.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">Aucun événement enregistré</p>
                  )}
                </div>
              </div>

              {/* Top Referrers */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Principaux référents
                </h3>
                <div className="space-y-2">
                  {(analytics?.topReferrers ?? []).slice(0, 8).map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1 mr-2">{r.referrer ?? "Direct"}</span>
                      <span className="text-muted-foreground">{r.views}</span>
                    </div>
                  ))}
                  {(!analytics?.topReferrers || analytics.topReferrers.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">Aucun référent</p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Hours Config */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" />
                Configuration des heures de présence
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configurez votre fuseau horaire et vos heures de disponibilité. Les visiteurs verront automatiquement vos horaires convertis dans leur fuseau local.
              </p>
              {businessConfig ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Timezone */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      Fuseau horaire actuel
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      value={businessConfig.config.timezone}
                      onChange={(e) => updateTimezone.mutate({ timezone: e.target.value })}
                    >
                      {businessConfig.timezones.map(tz => (
                        <option key={tz.value} value={tz.value}>
                          {tz.city} — {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Hours */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Heures de présence
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm flex-1"
                        defaultValue={businessConfig.config.startTime}
                        onBlur={(e) => {
                          if (e.target.value !== businessConfig.config.startTime) {
                            updateHours.mutate({ startTime: e.target.value, endTime: businessConfig.config.endTime });
                          }
                        }}
                      />
                      <span className="text-muted-foreground">à</span>
                      <input
                        type="time"
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm flex-1"
                        defaultValue={businessConfig.config.endTime}
                        onBlur={(e) => {
                          if (e.target.value !== businessConfig.config.endTime) {
                            updateHours.mutate({ startTime: businessConfig.config.startTime, endTime: e.target.value });
                          }
                        }}
                      />
                    </div>
                  </div>
                  {/* Work Days */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Jours de travail</label>
                    <div className="flex gap-1">
                      {["L", "M", "Me", "J", "V", "S", "D"].map((day, i) => {
                        const dayNum = i + 1;
                        const active = businessConfig.config.workDays.includes(dayNum);
                        return (
                          <button
                            key={dayNum}
                            className={`w-9 h-9 rounded-lg text-xs font-medium transition-colors ${
                              active ? "bg-amber-500 text-black" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                            }`}
                            onClick={() => {
                              const newDays = active
                                ? businessConfig.config.workDays.filter(d => d !== dayNum)
                                : [...businessConfig.config.workDays, dayNum].sort();
                              updateWorkDays.mutate({ workDays: newDays });
                            }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Chargement...
                </div>
              )}
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Recommandations IA — Optimisation de la conversion
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                L'IA analyse vos données analytics et génère des recommandations pour maximiser la capture de coordonnées.
              </p>

              {aiLoading ? (
                <div className="flex items-center gap-3 py-8 justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                  <span className="text-sm text-muted-foreground">L'IA analyse vos données...</span>
                </div>
              ) : aiInsights ? (
                <div>
                  {/* Summary */}
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium">Résumé</span>
                      {aiInsights.conversionRate && (
                        <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                          Taux: {aiInsights.conversionRate}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{aiInsights.summary}</p>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    {(aiInsights.recommendations ?? []).map((rec: { title: string; description: string; priority: string }, i: number) => {
                      const priorityColors: Record<string, string> = {
                        haute: "border-red-500/30 bg-red-500/5",
                        moyenne: "border-amber-500/30 bg-amber-500/5",
                        basse: "border-green-500/30 bg-green-500/5",
                      };
                      const priorityBadge: Record<string, string> = {
                        haute: "bg-red-500/20 text-red-400",
                        moyenne: "bg-amber-500/20 text-amber-400",
                        basse: "bg-green-500/20 text-green-400",
                      };
                      return (
                        <div key={i} className={`border rounded-lg p-4 ${priorityColors[rec.priority] ?? "border-white/10"}`}>
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{rec.title}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold ${priorityBadge[rec.priority] ?? ""}`}>
                                  {rec.priority}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{rec.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune donnée disponible pour l'analyse</p>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

/** KPI Card Component */
function KpiCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

/** Daily Chart — Simple bar chart */
function DailyChart({ data }: { data: Array<{ date: string; views: number }> }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">Aucune donnée</p>;
  }

  const maxViews = Math.max(...data.map(d => d.views), 1);

  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div
            className="w-full bg-amber-500/80 rounded-t-sm hover:bg-amber-400 transition-colors min-h-[2px]"
            style={{ height: `${Math.max(2, (d.views / maxViews) * 100)}%` }}
          />
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
            {d.date}: {d.views} vues
          </div>
          {i % Math.ceil(data.length / 7) === 0 && (
            <span className="text-[9px] text-muted-foreground">{d.date.slice(5)}</span>
          )}
        </div>
      ))}
    </div>
  );
}
