import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Filter, ChevronDown, AlertTriangle, TrendingUp, TrendingDown, Minus, Radar, Eye, Zap, ArrowUpRight, Bell } from "lucide-react";
import DashHeader from "@/components/layout/DashHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { competitors, getAllAnomalies, type Competitor } from "@/data/competitors";
import { RadarSkeleton } from "@/components/ui/skeleton-loader";

type SortKey = "mau" | "downloads" | "adSpend" | "arpu" | "mauChange" | "newAds";

const COLORS = ["#00CED1", "#7C3AED", "#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#EC4899"];

function formatNum(n: number, suffix = ""): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "B" + suffix;
  if (n >= 1) return n.toFixed(1) + "M" + suffix;
  return (n * 1000).toFixed(0) + "K" + suffix;
}

function ChangeIndicator({ value }: { value: number }) {
  if (value > 5) return <span className="text-dash-green text-[10px] flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+{value.toFixed(1)}%</span>;
  if (value < -5) return <span className="text-dash-red text-[10px] flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />{value.toFixed(1)}%</span>;
  return <span className="text-dash-text-muted text-[10px] flex items-center gap-0.5"><Minus className="w-3 h-3" />{value > 0 ? "+" : ""}{value.toFixed(1)}%</span>;
}

function StatusBadge({ status }: { status: Competitor["status"] }) {
  const styles = {
    rising: "bg-dash-green/15 text-dash-green border-dash-green/30",
    active: "bg-dash-cyan/15 text-dash-cyan border-dash-cyan/30",
    declining: "bg-dash-red/15 text-dash-red border-dash-red/30",
    new: "bg-dash-purple/15 text-dash-purple border-dash-purple/30",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium border ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}

function SeverityDot({ severity }: { severity: string }) {
  const color = severity === "high" ? "bg-dash-red" : severity === "medium" ? "bg-dash-orange" : "bg-dash-green";
  return <span className={`w-2 h-2 rounded-full inline-block ${color} ${severity === "high" ? "animate-pulse" : ""}`} />;
}

export default function IntelligenceRadar() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"monitoring" | "recommended" | "anomalies">("monitoring");
  const [sortKey, setSortKey] = useState<SortKey>("mau");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <RadarSkeleton />;

  const sorted = useMemo(() => {
    return [...competitors].sort((a, b) => {
      const av = a.metrics[sortKey] as number;
      const bv = b.metrics[sortKey] as number;
      return sortDesc ? bv - av : av - bv;
    });
  }, [sortKey, sortDesc]);

  const anomalies = useMemo(() => getAllAnomalies(), []);
  const totalMAU = competitors.reduce((s, c) => s + c.metrics.mau, 0);
  const totalAdSpend = competitors.reduce((s, c) => s + c.metrics.adSpend, 0);
  const highAnomalies = anomalies.filter(a => a.severity === "high").length;

  const pieData = competitors.slice(0, 6).map(c => ({ name: c.name, value: c.metrics.mau }));

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc(!sortDesc);
    else { setSortKey(key); setSortDesc(true); }
  };

  const SortHeader = ({ label, field, className = "" }: { label: string; field: SortKey; className?: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={`text-[9px] text-dash-text-muted hover:text-dash-cyan transition-colors text-center ${className} ${sortKey === field ? "text-dash-cyan" : ""}`}
    >
      {label} {sortKey === field ? (sortDesc ? "↓" : "↑") : ""}
    </button>
  );

  return (
    <div className="flex-1 dash-page p-6 overflow-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Radar className="w-4 h-4 text-dash-cyan" />
          <span className="text-xs text-dash-text-muted uppercase tracking-wider">Competitive Intelligence</span>
        </div>
        <div className="px-4 py-1 border border-dash-cyan/30 rounded text-xs neon-text tracking-widest">
          INTELLIGENCE RADAR
        </div>
      </div>

      <DashHeader title="出海短视频 / 社交赛道" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="dash-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-dash-text-muted uppercase tracking-wider">监控 App</span>
            <Eye className="w-3.5 h-3.5 text-dash-cyan" />
          </div>
          <div className="text-2xl font-bold text-dash-text">{competitors.length}</div>
          <div className="text-[10px] text-dash-text-muted mt-1">覆盖 SEA / LATAM / MENA / South Asia</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="dash-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-dash-text-muted uppercase tracking-wider">总 MAU</span>
            <TrendingUp className="w-3.5 h-3.5 text-dash-green" />
          </div>
          <div className="text-2xl font-bold text-dash-text">{totalMAU.toFixed(1)}M</div>
          <div className="text-[10px] text-dash-green mt-1">↑ 市场整体扩张中</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="dash-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-dash-text-muted uppercase tracking-wider">总广告消耗</span>
            <Zap className="w-3.5 h-3.5 text-dash-orange" />
          </div>
          <div className="text-2xl font-bold text-dash-text">${(totalAdSpend / 1000).toFixed(1)}M</div>
          <div className="text-[10px] text-dash-text-muted mt-1">本月预估</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="dash-card p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-dash-text-muted uppercase tracking-wider">异动提醒</span>
            <Bell className="w-3.5 h-3.5 text-dash-red" />
          </div>
          <div className="text-2xl font-bold text-dash-red">{highAnomalies}</div>
          <div className="text-[10px] text-dash-orange mt-1">{anomalies.length} 个事件待关注</div>
          {highAnomalies > 0 && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-dash-red animate-ping" />}
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-4">
        {([
          { key: "monitoring", label: "正在监控", count: competitors.length },
          { key: "anomalies", label: "异动提醒", count: anomalies.length },
          { key: "recommended", label: "推荐监控", count: 3 },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? tab.key === "anomalies" ? "bg-dash-red/20 text-dash-red border border-dash-red/30" : "bg-dash-cyan/20 text-dash-cyan border border-dash-cyan/30"
                : "bg-dash-card text-dash-text-muted border border-dash-border hover:border-dash-cyan/20"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-dash-border bg-dash-card text-xs text-dash-text-muted">
          <Filter className="w-3 h-3" />
          Short Video / Social | SEA+LATAM+MENA | 30 Days
          <ChevronDown className="w-3 h-3" />
        </div>
      </div>

      <div className="glow-line w-full mb-4" />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === "monitoring" && (
          <motion.div key="monitoring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Left: Charts */}
            <div className="hidden xl:block xl:col-span-2 space-y-4">
              <div className="dash-card p-3">
                <h3 className="text-[10px] font-semibold text-dash-text mb-3 uppercase tracking-wider">MAU 分布</h3>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={25} outerRadius={50} paddingAngle={2} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "hsl(220,25%,12%)", border: "1px solid hsl(210,15%,25%)", borderRadius: 8, fontSize: 11 }}
                        formatter={(v: number) => [`${v.toFixed(1)}M`, "MAU"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 mt-2">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                        <span className="text-[10px] text-dash-text">{d.name}</span>
                      </div>
                      <span className="text-[10px] text-dash-text-muted">{d.value.toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dash-card p-3">
                <h3 className="text-[10px] font-semibold text-dash-text mb-3 uppercase tracking-wider">广告消耗 Top 5</h3>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sorted.slice(0, 5).map(c => ({ name: c.name.slice(0, 8), spend: c.metrics.adSpend }))} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={55} tick={{ fill: "hsl(210,15%,55%)", fontSize: 9 }} axisLine={false} tickLine={false} />
                      <Bar dataKey="spend" fill="#F59E0B" radius={[0, 3, 3, 0]} barSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Center: Data Table */}
            <div className="xl:col-span-10 overflow-x-auto">
              <div className="dash-card overflow-hidden">
                <div className="px-4 py-2.5 border-b border-dash-border flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-dash-text">核心数据监控表</h3>
                  <span className="text-[10px] text-dash-text-muted">点击行进入深度分析 →</span>
                </div>

                {/* Category headers */}
                <div className="grid grid-cols-12 text-[10px] font-bold text-center border-b border-dash-border">
                  <div className="col-span-3 py-1.5" />
                  <div className="col-span-2 py-1.5 text-dash-cyan border-x border-dash-border">流量规模</div>
                  <div className="col-span-2 py-1.5 text-dash-green border-r border-dash-border">用户质量</div>
                  <div className="col-span-2 py-1.5 text-dash-orange border-r border-dash-border">投放强度</div>
                  <div className="col-span-3 py-1.5 text-dash-purple">商业化</div>
                </div>

                {/* Sub-headers */}
                <div className="grid grid-cols-12 py-1.5 border-b border-dash-border bg-dash-card-hover items-center">
                  <div className="text-[9px] text-dash-text-muted text-center">#</div>
                  <div className="col-span-2 text-[9px] text-dash-text-muted pl-2">竞品</div>
                  <SortHeader label="MAU" field="mau" />
                  <SortHeader label="下载量" field="downloads" />
                  <div className="text-[9px] text-dash-text-muted text-center">D1/D7/D30</div>
                  <div className="text-[9px] text-dash-text-muted text-center">时长</div>
                  <SortHeader label="新素材" field="newAds" />
                  <SortHeader label="广告消耗" field="adSpend" />
                  <SortHeader label="ARPU" field="arpu" />
                  <div className="text-[9px] text-dash-text-muted text-center">IAP收入</div>
                  <div className="text-[9px] text-dash-text-muted text-center">异动</div>
                </div>

                {/* Rows */}
                {sorted.map((c, i) => (
                  <Link
                    key={c.id}
                    to={`/competitor/${c.id}`}
                    className={`grid grid-cols-12 text-[10px] text-center py-2.5 border-b border-dash-border items-center hover:bg-dash-card-hover transition-colors group ${
                      c.id === "thrillzz" ? "bg-dash-cyan/5" : ""
                    }`}
                  >
                    <div className="text-dash-text-muted">{i + 1}</div>
                    <div className="col-span-2 text-left pl-2 flex items-center gap-2">
                      <span className="text-sm">{c.icon}</span>
                      <div>
                        <div className="text-dash-text font-medium group-hover:text-dash-cyan transition-colors flex items-center gap-1">
                          {c.name}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[9px] text-dash-text-muted">{c.region.join(" · ")}</div>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                    <div>
                      <div className="text-dash-text font-medium">{formatNum(c.metrics.mau)}</div>
                      <ChangeIndicator value={c.metrics.mauChange} />
                    </div>
                    <div>
                      <div className="text-dash-text">{formatNum(c.metrics.downloads)}</div>
                      <ChangeIndicator value={c.metrics.downloadsChange} />
                    </div>
                    <div className="text-dash-text">
                      <span className="text-dash-green">{c.metrics.retention.d1}%</span>
                      <span className="text-dash-text-muted">/</span>
                      <span>{c.metrics.retention.d7}%</span>
                      <span className="text-dash-text-muted">/</span>
                      <span className={c.metrics.retention.d30 < 8 ? "text-dash-red" : ""}>{c.metrics.retention.d30}%</span>
                    </div>
                    <div className="text-dash-text">{c.metrics.avgSessionMin}min</div>
                    <div className="text-dash-text font-medium">{c.metrics.newAds}</div>
                    <div>
                      <div className="text-dash-text">${(c.metrics.adSpend / 1000).toFixed(1)}M</div>
                      <ChangeIndicator value={c.metrics.adSpendChange} />
                    </div>
                    <div className="text-dash-text font-medium">${c.metrics.arpu.toFixed(2)}</div>
                    <div>
                      <div className="text-dash-text">${(c.metrics.iapRevenue / 1000).toFixed(1)}M</div>
                      <ChangeIndicator value={c.metrics.revenueChange} />
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      {c.anomalies.length > 0 ? (
                        <>
                          {c.anomalies.filter(a => a.severity === "high").length > 0 && <SeverityDot severity="high" />}
                          {c.anomalies.filter(a => a.severity === "medium").length > 0 && <SeverityDot severity="medium" />}
                          <span className="text-[9px] text-dash-text-muted">{c.anomalies.length}</span>
                        </>
                      ) : (
                        <span className="text-[9px] text-dash-text-muted">—</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "anomalies" && (
          <motion.div key="anomalies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {anomalies.map((a, i) => (
              <motion.div
                key={`${a.competitorId}-${a.date}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="dash-card p-4 flex items-start gap-4"
              >
                <div className="mt-1"><SeverityDot severity={a.severity} /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/competitor/${a.competitorId}`} className="text-sm font-medium text-dash-cyan hover:underline">{a.competitorName}</Link>
                    <span className="text-[10px] text-dash-text-muted px-2 py-0.5 rounded bg-dash-card-hover">{a.type}</span>
                    <span className="text-[10px] text-dash-text-muted">{a.date}</span>
                  </div>
                  <h4 className="text-sm text-dash-text font-medium mb-1">{a.title}</h4>
                  <p className="text-xs text-dash-text-muted leading-relaxed">{a.detail}</p>
                </div>
                <Link to={`/competitor/${a.competitorId}`} className="text-[10px] text-dash-cyan hover:underline whitespace-nowrap flex items-center gap-1">
                  深入分析 <ArrowUpRight className="w-3 h-3" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "recommended" && (
          <motion.div key="recommended" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="dash-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-dash-purple" />
              <h3 className="text-sm font-medium text-dash-text">AI 推荐监控</h3>
              <span className="text-[10px] text-dash-text-muted">基于市场动态和竞争格局自动推荐</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Clash of Clans", reason: "近期在 SEA 市场加大社交功能投入，可能与短视频赛道产生用户争夺", category: "Gaming → Social", confidence: 72 },
                { name: "Kwai", reason: "母公司快手在海外市场战略收缩后可能调整品牌策略，需关注", category: "Short Video", confidence: 85 },
                { name: "Resso", reason: "字节跳动旗下音乐 App，在 SEA 积累的用户可能为短视频产品导流", category: "Music → Short Video", confidence: 68 },
              ].map((rec, i) => (
                <motion.div key={rec.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-dash-card-hover rounded-lg p-4 border border-dash-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-dash-text">{rec.name}</span>
                    <span className="text-[10px] text-dash-purple bg-dash-purple/10 px-2 py-0.5 rounded">{rec.confidence}% 相关</span>
                  </div>
                  <span className="text-[10px] text-dash-text-muted bg-dash-card px-2 py-0.5 rounded mb-2 inline-block">{rec.category}</span>
                  <p className="text-xs text-dash-text-muted leading-relaxed mt-2">{rec.reason}</p>
                  <button className="mt-3 text-[10px] text-dash-cyan border border-dash-cyan/30 px-3 py-1 rounded hover:bg-dash-cyan/10 transition-colors">
                    + 加入监控
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
