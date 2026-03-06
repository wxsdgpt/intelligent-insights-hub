import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Radar, Shield, Languages, TrendingUp, TrendingDown, AlertTriangle,
  Activity, Users, DollarSign, Eye, ArrowUpRight, Zap, BarChart3,
  Globe, CheckCircle2, Clock, XCircle
} from "lucide-react";
import DashHeader from "@/components/layout/DashHeader";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend
} from "recharts";
import { motion } from "framer-motion";
import { competitors, getAllAnomalies, INDUSTRY_BENCHMARKS } from "@/data/competitors";
import { DashboardSkeleton } from "@/components/ui/skeleton-loader";

const COLORS = ["#00CED1", "#7C3AED", "#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#EC4899"];

function formatNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "B";
  if (n >= 1) return n.toFixed(1) + "M";
  return (n * 1000).toFixed(0) + "K";
}

function formatUSD(n: number): string {
  if (n >= 1000) return "$" + (n / 1000).toFixed(1) + "M";
  return "$" + n.toFixed(0) + "K";
}

// Aggregate stats
function useAggregateStats() {
  return useMemo(() => {
    const totalMAU = competitors.reduce((s, c) => s + c.metrics.mau, 0);
    const totalAdSpend = competitors.reduce((s, c) => s + c.metrics.adSpend, 0);
    const totalRevenue = competitors.reduce((s, c) => s + c.metrics.iapRevenue, 0);
    const totalDownloads = competitors.reduce((s, c) => s + c.metrics.downloads, 0);
    const avgRetentionD1 = competitors.reduce((s, c) => s + c.metrics.retention.d1, 0) / competitors.length;
    const avgRetentionD7 = competitors.reduce((s, c) => s + c.metrics.retention.d7, 0) / competitors.length;
    const avgRetentionD30 = competitors.reduce((s, c) => s + c.metrics.retention.d30, 0) / competitors.length;
    const avgARPU = competitors.reduce((s, c) => s + c.metrics.arpu, 0) / competitors.length;

    const anomalies = getAllAnomalies();
    const highAnomalies = anomalies.filter(a => a.severity === "high");
    const mediumAnomalies = anomalies.filter(a => a.severity === "medium");

    const risingApps = competitors.filter(c => c.status === "rising");
    const decliningApps = competitors.filter(c => c.status === "declining");

    // Market share by MAU
    const marketShare = competitors
      .map(c => ({ name: c.name, icon: c.icon, mau: c.metrics.mau, share: (c.metrics.mau / totalMAU) * 100 }))
      .sort((a, b) => b.mau - a.mau);

    // Ad spend distribution
    const adSpendDist = competitors
      .map(c => ({ name: c.name, icon: c.icon, adSpend: c.metrics.adSpend }))
      .sort((a, b) => b.adSpend - a.adSpend);

    // Aggregate 30-day trend from time series (sum all competitors per day)
    const dayMap: Record<string, { date: string; mau: number; adSpend: number; downloads: number; revenue: number }> = {};
    competitors.forEach(c => {
      c.timeSeries.forEach(d => {
        if (!dayMap[d.date]) {
          dayMap[d.date] = { date: d.date, mau: 0, adSpend: 0, downloads: 0, revenue: 0 };
        }
        dayMap[d.date].mau += d.mau;
        dayMap[d.date].adSpend += d.adSpend;
        dayMap[d.date].downloads += d.downloads;
        dayMap[d.date].revenue += d.revenue;
      });
    });
    const trend30d = Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));

    // Region coverage
    const regionSet = new Set<string>();
    competitors.forEach(c => c.region.forEach(r => regionSet.add(r)));

    // Top performers
    const topByGrowth = [...competitors].sort((a, b) => b.metrics.mauChange - a.metrics.mauChange)[0];
    const topByARPU = [...competitors].sort((a, b) => b.metrics.arpu - a.metrics.arpu)[0];
    const topByAdSpend = [...competitors].sort((a, b) => b.metrics.adSpend - a.metrics.adSpend)[0];

    return {
      totalMAU, totalAdSpend, totalRevenue, totalDownloads,
      avgRetentionD1, avgRetentionD7, avgRetentionD30, avgARPU,
      anomalies, highAnomalies, mediumAnomalies,
      risingApps, decliningApps,
      marketShare, adSpendDist, trend30d,
      regions: Array.from(regionSet),
      topByGrowth, topByARPU, topByAdSpend,
    };
  }, []);
}

// Localization & Risk mock stats
const localizationStats = {
  inQueue: 12, completed: 48, languages: 8, approvalRate: 94,
  pipeline: [
    { status: "Analyzing", count: 3, color: "bg-dash-cyan" },
    { status: "Reviewing", count: 5, color: "bg-dash-orange" },
    { status: "Ready", count: 4, color: "bg-dash-green" },
  ],
};

const riskStats = {
  scanned: 24, highRisk: 2, medRisk: 5, avgScore: 76,
  recentScans: [
    { name: "Thrillzz BR Creative", score: 82, risk: "low" as const },
    { name: "MENA Video Pack", score: 45, risk: "high" as const },
    { name: "SEA Landing Page", score: 71, risk: "medium" as const },
    { name: "KOL Contract Terms", score: 91, risk: "low" as const },
  ],
};

function KPICard({ icon: Icon, label, value, change, changeLabel, color, delay }: {
  icon: any; label: string; value: string; change?: number; changeLabel?: string; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="bg-dash-card rounded-xl border border-dash-border p-4 hover:border-dash-cyan/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {change !== undefined && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${change >= 0 ? "text-dash-green" : "text-dash-red"}`}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change >= 0 ? "+" : ""}{change.toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-dash-text">{value}</p>
      <p className="text-[11px] text-dash-text-muted mt-0.5">{changeLabel || label}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const stats = useAggregateStats();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-dash-card border border-dash-border rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="text-dash-text-muted mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-screen bg-dash-bg text-dash-text p-6 overflow-auto">
      <DashHeader title="Dashboard" subtitle="Market Overview" breadcrumb="Moboost Command Center" />

      {/* Top KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={Users} label="Total MAU" value={formatNum(stats.totalMAU)}
          change={((stats.risingApps.length - stats.decliningApps.length) / competitors.length) * 10}
          changeLabel="Total MAU across tracked apps" color="bg-dash-cyan" delay={0.05}
        />
        <KPICard
          icon={DollarSign} label="Total Ad Spend" value={formatUSD(stats.totalAdSpend)}
          changeLabel="Monthly aggregate ad spend" color="bg-dash-purple" delay={0.1}
        />
        <KPICard
          icon={BarChart3} label="Total Revenue" value={formatUSD(stats.totalRevenue)}
          changeLabel="Monthly IAP revenue" color="bg-dash-green" delay={0.15}
        />
        <KPICard
          icon={AlertTriangle} label="Active Alerts"
          value={`${stats.highAnomalies.length} High / ${stats.mediumAnomalies.length} Med`}
          changeLabel={`${stats.anomalies.length} total anomalies detected`} color="bg-dash-red" delay={0.2}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* 30-Day Market Trend */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 bg-dash-card rounded-xl border border-dash-border p-5"
        >
          <h3 className="text-sm font-semibold text-dash-text mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-dash-cyan" />
            30-Day Market Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.trend30d}>
              <defs>
                <linearGradient id="mauGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00CED1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00CED1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="adGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--dash-border))" />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--dash-text-muted))", fontSize: 10 }}
                tickFormatter={(v: string) => v.slice(5)}
                interval={4}
              />
              <YAxis
                yAxisId="mau"
                tick={{ fill: "hsl(var(--dash-text-muted))", fontSize: 10 }}
                tickFormatter={(v: number) => (v / 1e6).toFixed(0) + "M"}
              />
              <YAxis
                yAxisId="ad"
                orientation="right"
                tick={{ fill: "hsl(var(--dash-text-muted))", fontSize: 10 }}
                tickFormatter={(v: number) => "$" + (v / 1e3).toFixed(0) + "K"}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="mau"
                type="monotone"
                dataKey="mau"
                name="Total MAU"
                stroke="#00CED1"
                strokeWidth={2}
                fill="url(#mauGrad)"
              />
              <Area
                yAxisId="ad"
                type="monotone"
                dataKey="adSpend"
                name="Ad Spend"
                stroke="#7C3AED"
                strokeWidth={2}
                fill="url(#adGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Market Share Pie */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-dash-card rounded-xl border border-dash-border p-5"
        >
          <h3 className="text-sm font-semibold text-dash-text mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-dash-cyan" />
            MAU Market Share
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={stats.marketShare}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="mau"
                nameKey="name"
                paddingAngle={2}
              >
                {stats.marketShare.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => formatNum(v)}
                contentStyle={{
                  background: "hsl(var(--dash-card))",
                  border: "1px solid hsl(var(--dash-border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {stats.marketShare.slice(0, 4).map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-dash-text-muted">{c.icon} {c.name}</span>
                </div>
                <span className="text-dash-text font-medium">{c.share.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ad Spend Distribution Bar Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.32 }}
        className="bg-dash-card rounded-xl border border-dash-border p-5 mb-6"
      >
        <h3 className="text-sm font-semibold text-dash-text mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-dash-purple" />
          Ad Spend Distribution by App
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={stats.adSpendDist}
            layout="vertical"
            margin={{ left: 10, right: 20, top: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--dash-border))" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "hsl(var(--dash-text-muted))", fontSize: 10 }}
              tickFormatter={(v: number) => "$" + (v / 1e3).toFixed(0) + "K"}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fill: "hsl(var(--dash-text-muted))", fontSize: 11 }}
              tickFormatter={(v: string) => {
                const c = stats.adSpendDist.find(d => d.name === v);
                return c ? `${c.icon} ${v}` : v;
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                const pct = ((d.adSpend / stats.totalAdSpend) * 100).toFixed(1);
                return (
                  <div className="bg-dash-card border border-dash-border rounded-lg px-3 py-2 shadow-lg text-xs">
                    <p className="text-dash-text font-medium mb-0.5">{d.icon} {d.name}</p>
                    <p className="text-dash-purple">Spend: {formatUSD(d.adSpend)}</p>
                    <p className="text-dash-text-muted">Share: {pct}%</p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="adSpend"
              radius={[0, 4, 4, 0]}
              maxBarSize={24}
            >
              {stats.adSpendDist.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Three-Column Module Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Intelligence Radar Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="bg-dash-card rounded-xl border border-dash-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-dash-text flex items-center gap-2">
              <Radar className="w-4 h-4 text-dash-cyan" />
              Intelligence Radar
            </h3>
            <Link to="/intelligence-radar" className="text-[11px] text-dash-cyan hover:underline flex items-center gap-1">
              View <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Top Movers */}
          <p className="text-[11px] text-dash-text-muted uppercase tracking-wider mb-2">Top Movers</p>
          <div className="space-y-2 mb-4">
            {[stats.topByGrowth, stats.topByARPU, stats.topByAdSpend].map((c, i) => {
              const labels = ["Fastest Growth", "Highest ARPU", "Top Ad Spend"];
              const values = [
                `MAU ${c.metrics.mauChange > 0 ? "+" : ""}${c.metrics.mauChange}%`,
                `$${c.metrics.arpu.toFixed(2)}`,
                formatUSD(c.metrics.adSpend),
              ];
              return (
                <Link
                  key={c.id + i}
                  to={`/competitor/${c.id}`}
                  className="flex items-center justify-between bg-dash-bg rounded-lg px-3 py-2 hover:bg-dash-card-hover transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{c.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-dash-text">{c.name}</p>
                      <p className="text-[10px] text-dash-text-muted">{labels[i]}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-dash-cyan">{values[i]}</span>
                </Link>
              );
            })}
          </div>

          {/* Retention benchmark */}
          <p className="text-[11px] text-dash-text-muted uppercase tracking-wider mb-2">Avg Retention vs Benchmark</p>
          <div className="space-y-2">
            {[
              { label: "D1", value: stats.avgRetentionD1, bench: INDUSTRY_BENCHMARKS.shortVideo.d1 },
              { label: "D7", value: stats.avgRetentionD7, bench: INDUSTRY_BENCHMARKS.shortVideo.d7 },
              { label: "D30", value: stats.avgRetentionD30, bench: INDUSTRY_BENCHMARKS.shortVideo.d30 },
            ].map(r => (
              <div key={r.label} className="flex items-center gap-3">
                <span className="text-[11px] text-dash-text-muted w-6">{r.label}</span>
                <div className="flex-1 h-2 bg-dash-bg rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-dash-cyan rounded-full"
                    style={{ width: `${Math.min(r.value, 100)}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-0.5 bg-dash-orange"
                    style={{ left: `${r.bench}%` }}
                    title={`Benchmark: ${r.bench}%`}
                  />
                </div>
                <span className="text-[11px] text-dash-text font-mono w-10 text-right">{r.value.toFixed(0)}%</span>
              </div>
            ))}
            <p className="text-[10px] text-dash-text-muted mt-1">
              <span className="inline-block w-2 h-2 bg-dash-cyan rounded-full mr-1 align-middle" /> Avg Market
              <span className="inline-block w-2 h-0.5 bg-dash-orange ml-3 mr-1 align-middle" /> Benchmark
            </p>
          </div>
        </motion.div>

        {/* Localization Engine Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-dash-card rounded-xl border border-dash-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-dash-text flex items-center gap-2">
              <Languages className="w-4 h-4 text-dash-purple" />
              Localization Engine
            </h3>
            <Link to="/localization-engine" className="text-[11px] text-dash-purple hover:underline flex items-center gap-1">
              View <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-dash-bg rounded-lg px-3 py-2.5">
              <p className="text-lg font-bold text-dash-text">{localizationStats.completed}</p>
              <p className="text-[10px] text-dash-text-muted">Completed</p>
            </div>
            <div className="bg-dash-bg rounded-lg px-3 py-2.5">
              <p className="text-lg font-bold text-dash-text">{localizationStats.inQueue}</p>
              <p className="text-[10px] text-dash-text-muted">In Queue</p>
            </div>
            <div className="bg-dash-bg rounded-lg px-3 py-2.5">
              <p className="text-lg font-bold text-dash-text">{localizationStats.languages}</p>
              <p className="text-[10px] text-dash-text-muted">Languages</p>
            </div>
            <div className="bg-dash-bg rounded-lg px-3 py-2.5">
              <p className="text-lg font-bold text-dash-green">{localizationStats.approvalRate}%</p>
              <p className="text-[10px] text-dash-text-muted">Approval Rate</p>
            </div>
          </div>

          {/* Pipeline */}
          <p className="text-[11px] text-dash-text-muted uppercase tracking-wider mb-2">Pipeline Status</p>
          <div className="space-y-2 mb-4">
            {localizationStats.pipeline.map(p => (
              <div key={p.status} className="flex items-center gap-3">
                <span className="text-xs text-dash-text-muted w-20">{p.status}</span>
                <div className="flex-1 h-2 bg-dash-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full ${p.color} rounded-full transition-all`}
                    style={{ width: `${(p.count / localizationStats.inQueue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-dash-text font-mono w-4 text-right">{p.count}</span>
              </div>
            ))}
          </div>

          {/* Region coverage */}
          <p className="text-[11px] text-dash-text-muted uppercase tracking-wider mb-2">Region Coverage</p>
          <div className="flex flex-wrap gap-1.5">
            {stats.regions.map(r => (
              <span key={r} className="text-[10px] bg-dash-purple/10 text-dash-purple px-2 py-0.5 rounded-full border border-dash-purple/20">
                {r}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Risk Scanner Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="bg-dash-card rounded-xl border border-dash-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-dash-text flex items-center gap-2">
              <Shield className="w-4 h-4 text-dash-green" />
              Risk Scanner
            </h3>
            <Link to="/risk-scanner" className="text-[11px] text-dash-green hover:underline flex items-center gap-1">
              View <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Risk Score Gauge */}
          <div className="text-center mb-4">
            <div className="relative inline-flex items-center justify-center w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--dash-border))" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={riskStats.avgScore >= 70 ? "hsl(var(--dash-green))" : riskStats.avgScore >= 50 ? "hsl(var(--dash-orange))" : "hsl(var(--dash-red))"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${riskStats.avgScore * 2.51} 251`}
                />
              </svg>
              <span className="absolute text-xl font-bold text-dash-text">{riskStats.avgScore}</span>
            </div>
            <p className="text-[11px] text-dash-text-muted mt-1">Average Compliance Score</p>
          </div>

          {/* Risk breakdown */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center bg-dash-bg rounded-lg py-2">
              <p className="text-sm font-bold text-dash-red">{riskStats.highRisk}</p>
              <p className="text-[9px] text-dash-text-muted">High</p>
            </div>
            <div className="text-center bg-dash-bg rounded-lg py-2">
              <p className="text-sm font-bold text-dash-orange">{riskStats.medRisk}</p>
              <p className="text-[9px] text-dash-text-muted">Medium</p>
            </div>
            <div className="text-center bg-dash-bg rounded-lg py-2">
              <p className="text-sm font-bold text-dash-green">{riskStats.scanned - riskStats.highRisk - riskStats.medRisk}</p>
              <p className="text-[9px] text-dash-text-muted">Low</p>
            </div>
          </div>

          {/* Recent scans */}
          <p className="text-[11px] text-dash-text-muted uppercase tracking-wider mb-2">Recent Scans</p>
          <div className="space-y-1.5">
            {riskStats.recentScans.map((s, i) => (
              <div key={i} className="flex items-center justify-between bg-dash-bg rounded-lg px-3 py-1.5">
                <div className="flex items-center gap-2">
                  {s.risk === "low" && <CheckCircle2 className="w-3 h-3 text-dash-green" />}
                  {s.risk === "medium" && <Clock className="w-3 h-3 text-dash-orange" />}
                  {s.risk === "high" && <XCircle className="w-3 h-3 text-dash-red" />}
                  <span className="text-[11px] text-dash-text truncate max-w-[120px]">{s.name}</span>
                </div>
                <span className={`text-[11px] font-mono font-medium ${
                  s.risk === "low" ? "text-dash-green" : s.risk === "medium" ? "text-dash-orange" : "text-dash-red"
                }`}>
                  {s.score}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom: Recent Anomalies Timeline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-dash-card rounded-xl border border-dash-border p-5"
      >
        <h3 className="text-sm font-semibold text-dash-text mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-dash-orange" />
          Recent Market Anomalies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stats.anomalies.slice(0, 6).map((a, i) => (
            <Link
              key={i}
              to={`/competitor/${a.competitorId}`}
              className="bg-dash-bg rounded-lg p-3 hover:bg-dash-card-hover transition-colors border border-transparent hover:border-dash-cyan/20"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  a.severity === "high"
                    ? "bg-dash-red/15 text-dash-red"
                    : a.severity === "medium"
                      ? "bg-dash-orange/15 text-dash-orange"
                      : "bg-dash-text-muted/15 text-dash-text-muted"
                }`}>
                  {a.severity.toUpperCase()}
                </span>
                <span className="text-[10px] text-dash-text-muted">{a.date}</span>
              </div>
              <p className="text-xs font-medium text-dash-text mb-0.5">{a.competitorName} · {a.title}</p>
              <p className="text-[11px] text-dash-text-muted line-clamp-2">{a.detail}</p>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
