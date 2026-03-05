import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Globe, Star, Smartphone, Bot, Calendar, AlertTriangle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, Legend } from "recharts";
import { getCompetitor, INDUSTRY_BENCHMARKS, type TimelineEvent } from "@/data/competitors";
import { DeepDiveSkeleton } from "@/components/ui/skeleton-loader";

function EventIcon({ type }: { type: TimelineEvent["type"] }) {
  const icons = {
    payment: "💳",
    campaign: "📢",
    compliance: "🛡️",
    product: "🚀",
    market: "🌍",
  };
  return <span className="text-sm">{icons[type] || "📌"}</span>;
}

function ImpactBadge({ impact }: { impact: TimelineEvent["impact"] }) {
  const styles = {
    positive: "bg-dash-green/15 text-dash-green",
    negative: "bg-dash-red/15 text-dash-red",
    neutral: "bg-dash-text-muted/15 text-dash-text-muted",
  };
  return <span className={`text-[9px] px-1.5 py-0.5 rounded ${styles[impact]}`}>{impact}</span>;
}

export default function CompetitorDeepDive() {
  const { id } = useParams();
  const comp = getCompetitor(id || "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) return <DeepDiveSkeleton />;

  if (!comp) {
    return (
      <div className="flex-1 dash-page p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg text-dash-text mb-2">未找到该竞品</h2>
          <Link to="/intelligence-radar" className="text-dash-cyan text-sm hover:underline">← 返回情报雷达</Link>
        </div>
      </div>
    );
  }

  const bench = INDUSTRY_BENCHMARKS.shortVideo;
  const ts = comp.timeSeries;

  // Prepare chart data (last 30 days, show every 3rd label)
  const chartData = ts.map((d, i) => ({
    date: d.date.slice(5),
    MAU: Math.round(d.mau / 1000000 * 10) / 10,
    DAU: Math.round(d.dau / 1000000 * 10) / 10,
    广告消耗: Math.round(d.adSpend / 1000),
    下载: Math.round(d.downloads / 1000000 * 10) / 10,
    收入: Math.round(d.revenue / 1000),
  }));

  const retentionData = [
    { stage: "D1", value: comp.metrics.retention.d1, benchmark: bench.d1 },
    { stage: "D7", value: comp.metrics.retention.d7, benchmark: bench.d7 },
    { stage: "D30", value: comp.metrics.retention.d30, benchmark: bench.d30 },
  ];

  return (
    <div className="flex-1 dash-page p-6 overflow-auto">
      {/* Back nav */}
      <Link to="/intelligence-radar" className="inline-flex items-center gap-2 text-xs text-dash-text-muted hover:text-dash-cyan transition-colors mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> 返回情报雷达
      </Link>

      {/* App Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="dash-card p-5 mb-5">
        <div className="flex flex-col md:flex-row items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-dash-card-hover flex items-center justify-center text-3xl shrink-0">{comp.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-dash-text">{comp.name}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                comp.status === "rising" ? "bg-dash-green/15 text-dash-green border-dash-green/30" :
                comp.status === "declining" ? "bg-dash-red/15 text-dash-red border-dash-red/30" :
                "bg-dash-cyan/15 text-dash-cyan border-dash-cyan/30"
              }`}>{comp.status.toUpperCase()}</span>
              {comp.anomalies.length > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-dash-orange">
                  <AlertTriangle className="w-3 h-3" /> {comp.anomalies.length} 异动
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-dash-text-muted">
              <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" />{comp.platform}</span>
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{comp.region.join(" · ")}</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-dash-orange" />{comp.rating}</span>
              <span>{comp.category}</span>
            </div>
          </div>
          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 w-full md:w-auto mt-3 md:mt-0">
            {[
              { label: "MAU", value: `${comp.metrics.mau.toFixed(1)}M`, change: comp.metrics.mauChange },
              { label: "广告消耗", value: `$${(comp.metrics.adSpend/1000).toFixed(1)}M`, change: comp.metrics.adSpendChange },
              { label: "ARPU", value: `$${comp.metrics.arpu.toFixed(2)}`, change: comp.metrics.revenueChange },
              { label: "新素材", value: `${comp.metrics.newAds}`, change: null },
            ].map(m => (
              <div key={m.label} className="text-center">
                <div className="text-[10px] text-dash-text-muted mb-1">{m.label}</div>
                <div className="text-lg font-bold text-dash-text">{m.value}</div>
                {m.change !== null && (
                  <div className={`text-[10px] flex items-center justify-center gap-0.5 ${m.change > 0 ? "text-dash-green" : "text-dash-red"}`}>
                    {m.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {m.change > 0 ? "+" : ""}{m.change.toFixed(1)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Charts */}
        <div className="lg:col-span-8 space-y-5">
          {/* MAU + Ad Spend dual axis chart */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="dash-card p-5">
            <h3 className="text-xs font-semibold text-dash-text mb-4 uppercase tracking-wider">用户增长 vs 广告消耗（30 天）</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="mauGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00CED1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00CED1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="adGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,15%,20%)" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis yAxisId="left" tick={{ fill: "#00CED1", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "#F59E0B", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(220,25%,12%)", border: "1px solid hsl(210,15%,25%)", borderRadius: 8, fontSize: 11 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area yAxisId="left" type="monotone" dataKey="MAU" stroke="#00CED1" fillOpacity={1} fill="url(#mauGrad)" strokeWidth={2} name="MAU (M)" />
                  <Area yAxisId="right" type="monotone" dataKey="广告消耗" stroke="#F59E0B" fillOpacity={1} fill="url(#adGrad)" strokeWidth={2} name="广告消耗 ($K)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Retention vs Benchmark */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="dash-card p-5">
            <h3 className="text-xs font-semibold text-dash-text mb-4 uppercase tracking-wider">留存率 vs 行业基准</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {retentionData.map(r => {
                const diff = r.value - r.benchmark;
                const isGood = diff >= 0;
                return (
                  <div key={r.stage} className="bg-dash-card-hover rounded-lg p-4 text-center">
                    <div className="text-[10px] text-dash-text-muted mb-2">{r.stage} 留存</div>
                    <div className={`text-3xl font-bold ${isGood ? "text-dash-green" : "text-dash-red"}`}>{r.value}%</div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="text-[10px] text-dash-text-muted">基准 {r.benchmark}%</span>
                      <span className={`text-[10px] font-medium ${isGood ? "text-dash-green" : "text-dash-red"}`}>
                        {isGood ? "+" : ""}{diff}pp
                      </span>
                    </div>
                    {/* Simple bar comparison */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-dash-text-muted w-8">{comp.name.slice(0, 4)}</span>
                        <div className="flex-1 h-2 bg-dash-bg rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isGood ? "bg-dash-green" : "bg-dash-red"}`} style={{ width: `${r.value}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-dash-text-muted w-8">行业</span>
                        <div className="flex-1 h-2 bg-dash-bg rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-dash-text-muted/30" style={{ width: `${r.benchmark}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* AI Insight */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="dash-card p-5 border-dash-cyan/20">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-dash-cyan" />
              <h3 className="text-xs font-semibold text-dash-text uppercase tracking-wider">AI 专家分析</h3>
              <span className="text-[9px] text-dash-text-muted bg-dash-card-hover px-2 py-0.5 rounded">Moboost Intelligence</span>
            </div>
            <p className="text-sm text-dash-text leading-relaxed">{comp.aiInsight}</p>
          </motion.div>
        </div>

        {/* Right: Timeline + Anomalies */}
        <div className="lg:col-span-4 space-y-5">
          {/* Anomalies */}
          {comp.anomalies.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="dash-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-3.5 h-3.5 text-dash-red" />
                <h3 className="text-xs font-semibold text-dash-text uppercase tracking-wider">异动提醒</h3>
              </div>
              <div className="space-y-3">
                {comp.anomalies.map((a, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${
                    a.severity === "high" ? "bg-dash-red/5 border-dash-red/20" :
                    a.severity === "medium" ? "bg-dash-orange/5 border-dash-orange/20" :
                    "bg-dash-card-hover border-dash-border"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        a.severity === "high" ? "bg-dash-red animate-pulse" :
                        a.severity === "medium" ? "bg-dash-orange" : "bg-dash-green"
                      }`} />
                      <span className="text-[10px] text-dash-text-muted">{a.date}</span>
                      <span className="text-[9px] text-dash-text-muted bg-dash-card px-1.5 py-0.5 rounded">{a.type}</span>
                    </div>
                    <h4 className="text-xs text-dash-text font-medium mb-1">{a.title}</h4>
                    <p className="text-[10px] text-dash-text-muted leading-relaxed">{a.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Behavior Timeline */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="dash-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-3.5 h-3.5 text-dash-purple" />
              <h3 className="text-xs font-semibold text-dash-text uppercase tracking-wider">行为时间轴</h3>
              <span className="text-[9px] text-dash-text-muted">近 30 天</span>
            </div>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-3 top-0 bottom-0 w-px bg-dash-border" />
              <div className="space-y-4">
                {comp.events.map((e, i) => (
                  <motion.div
                    key={`${e.date}-${i}`}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex gap-3 pl-1"
                  >
                    <div className="w-5 h-5 rounded-full bg-dash-card-hover border border-dash-border flex items-center justify-center z-10">
                      <EventIcon type={e.type} />
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] text-dash-text-muted">{e.date.slice(5)}</span>
                        <ImpactBadge impact={e.impact} />
                      </div>
                      <h4 className="text-xs text-dash-text font-medium">{e.title}</h4>
                      <p className="text-[10px] text-dash-text-muted">{e.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="dash-card p-4">
            <h3 className="text-xs font-semibold text-dash-text mb-3 uppercase tracking-wider">详细指标</h3>
            <div className="space-y-2">
              {[
                { label: "水分率", value: `${comp.metrics.avgSessionMin} min`, sub: `基准 ${bench.avgSessionMin} min` },
                { label: "月下载量", value: `${comp.metrics.downloads.toFixed(1)}M`, sub: `环比 ${comp.metrics.downloadsChange > 0 ? "+" : ""}${comp.metrics.downloadsChange.toFixed(1)}%` },
                { label: "IAP 收入", value: `$${(comp.metrics.iapRevenue/1000).toFixed(1)}M`, sub: `环比 ${comp.metrics.revenueChange > 0 ? "+" : ""}${comp.metrics.revenueChange.toFixed(1)}%` },
                { label: "评分", value: `${comp.rating} / 5.0`, sub: comp.platform },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-dash-border last:border-0">
                  <span className="text-[10px] text-dash-text-muted">{s.label}</span>
                  <div className="text-right">
                    <div className="text-xs text-dash-text font-medium">{s.value}</div>
                    <div className="text-[9px] text-dash-text-muted">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
