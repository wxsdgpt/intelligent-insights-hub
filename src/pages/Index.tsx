import { Search, Sparkles, Play, ArrowRight, Send, X, Bot, User, Radar, Shield, Languages, TrendingUp, TrendingDown, AlertTriangle, Activity, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMoboostAI } from "@/hooks/use-moboost-ai";
import { competitors, getAllAnomalies } from "@/data/competitors";

// Derive live stats from competitor data
function useRadarStats() {
  return useMemo(() => {
    const totalApps = competitors.length;
    const anomalies = getAllAnomalies();
    const highAnomalies = anomalies.filter(a => a.severity === "high").length;
    const totalMAU = competitors.reduce((s, c) => s + c.metrics.mau, 0);
    const totalAdSpend = competitors.reduce((s, c) => s + c.metrics.adSpend, 0);
    const risingApps = competitors.filter(c => c.status === "rising").length;
    const decliningApps = competitors.filter(c => c.status === "declining").length;

    // Top mover: highest absolute mauChange
    const topMover = [...competitors].sort((a, b) =>
      Math.abs(b.metrics.mauChange) - Math.abs(a.metrics.mauChange)
    )[0];

    return {
      totalApps,
      anomalyCount: anomalies.length,
      highAnomalies,
      totalMAU,
      totalAdSpend,
      risingApps,
      decliningApps,
      topMover,
    };
  }, []);
}

function useGreeting() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const hour = now.getHours();
  let greeting: string;
  let emoji: string;
  if (hour >= 5 && hour < 12) { greeting = "Good Morning"; emoji = "☀️"; }
  else if (hour >= 12 && hour < 17) { greeting = "Good Afternoon"; emoji = "🌤"; }
  else if (hour >= 17 && hour < 21) { greeting = "Good Evening"; emoji = "🌅"; }
  else { greeting = "Working Late"; emoji = "🌙"; }
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return { greeting, emoji, timeStr, dateStr };
}

export default function Index() {
  const [query, setQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const { messages, loading, sendQuery, clearMessages } = useMoboostAI();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stats = useRadarStats();
  const { greeting, emoji, timeStr, dateStr } = useGreeting();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (!chatOpen) setChatOpen(true);
    sendQuery(query);
    setQuery("");
  };

  const handleSearchFocus = () => {
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    clearMessages();
  };

  const cards = [
    {
      id: 1,
      title: "Intelligence Radar",
      icon: Radar,
      status: `${stats.highAnomalies} alerts`,
      statusColor: stats.highAnomalies > 0
        ? "text-dash-red bg-dash-red/15 border border-dash-red/30"
        : "text-dash-green bg-dash-green/15 border border-dash-green/30",
      link: "/intelligence-radar",
      accentColor: "dash-cyan",
      metrics: [
        { label: "Tracked Apps", value: stats.totalApps.toString(), icon: Activity },
        { label: "Total MAU", value: `${stats.totalMAU.toFixed(1)}M`, icon: TrendingUp },
        { label: "Anomalies", value: stats.anomalyCount.toString(), icon: AlertTriangle },
        { label: "Ad Spend", value: `$${(stats.totalAdSpend / 1000).toFixed(1)}M`, icon: TrendingUp },
      ],
      highlight: stats.topMover
        ? `${stats.topMover.icon} ${stats.topMover.name}: MAU ${stats.topMover.metrics.mauChange > 0 ? "+" : ""}${stats.topMover.metrics.mauChange}%`
        : null,
      highlightPositive: stats.topMover ? stats.topMover.metrics.mauChange > 0 : true,
    },
    {
      id: 2,
      title: "Localization Engine",
      icon: Languages,
      status: "Processing",
      statusColor: "text-dash-purple bg-dash-purple/15 border border-dash-purple/30",
      link: "/localization-engine",
      accentColor: "dash-purple",
      metrics: [
        { label: "In Queue", value: "12", icon: Activity },
        { label: "Completed", value: "48", icon: TrendingUp },
        { label: "Languages", value: "8", icon: Languages },
        { label: "Approval Rate", value: "94%", icon: TrendingUp },
      ],
      highlight: "3 tasks awaiting review",
      highlightPositive: true,
    },
    {
      id: 3,
      title: "Risk Scanner",
      icon: Shield,
      status: "2 High Risk",
      statusColor: "text-dash-red bg-dash-red/15 border border-dash-red/30",
      link: "/risk-scanner",
      accentColor: "dash-green",
      metrics: [
        { label: "Scanned", value: "24", icon: Shield },
        { label: "High Risk", value: "2", icon: AlertTriangle },
        { label: "Avg Score", value: "76", icon: Activity },
        { label: "Fixed Today", value: "5", icon: TrendingUp },
      ],
      highlight: "Meta policy update detected",
      highlightPositive: false,
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-dash-bg relative overflow-auto">
      {/* Greeting Header */}
      <div className="max-w-2xl mx-auto pt-8 px-6">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-dash-text">
              {emoji} {greeting}
            </h1>
            <p className="text-sm text-dash-text-muted mt-1">
              {dateStr} · {timeStr}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-dash-card rounded-full px-3 py-1.5 border border-dash-border">
              <span className="w-2 h-2 rounded-full bg-dash-green animate-pulse" />
              <span className="text-dash-green font-medium">Agent Active</span>
            </div>
            <div className="flex items-center gap-1.5 bg-dash-card rounded-full px-3 py-1.5 border border-dash-border">
              <TrendingUp className="w-3 h-3 text-dash-cyan" />
              <span className="text-dash-text-muted">{stats.risingApps}↑ {stats.decliningApps}↓</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mt-6 px-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-dash-card rounded-2xl shadow-lg border border-dash-border px-5 py-4 focus-within:border-dash-cyan/40 transition-colors">
              <Search className="w-5 h-5 text-dash-text-muted mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleSearchFocus}
                placeholder="Ask Moboost AI anything..."
                className="flex-1 bg-transparent outline-none text-dash-text placeholder:text-dash-text-muted"
              />
              {query.trim() ? (
                <button type="submit" className="ml-3 p-1.5 rounded-lg hover:bg-dash-card-hover transition-colors">
                  <Send className="w-5 h-5 text-dash-cyan" />
                </button>
              ) : (
                <button type="button" className="ml-3 p-1.5 rounded-lg hover:bg-dash-card-hover transition-colors">
                  <Sparkles className="w-5 h-5 text-dash-purple" />
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      {/* Quick Action Suggestions */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto px-6 mt-3"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { emoji: "📊", label: "Thrillzz 竞品分析", query: "分析 Thrillzz 最近的用户增长趋势和投放策略" },
                { emoji: "⚔️", label: "Thrillzz vs Likee", query: "对比 Thrillzz 和 Likee 的核心数据" },
                { emoji: "🔍", label: "市场异动", query: "最近有什么重要的市场异动？" },
                { emoji: "💡", label: "投放建议", query: "基于当前竞品数据，给出投放优化建议" },
                { emoji: "📈", label: "ARPU 对比", query: "对比各竞品的 ARPU 和商业化能力" },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => {
                    setChatOpen(true);
                    sendQuery(chip.query);
                    setQuery("");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dash-card/80 border border-dash-border text-xs text-dash-text-muted hover:text-dash-cyan hover:border-dash-cyan/30 hover:bg-dash-cyan/5 transition-all"
                >
                  <span>{chip.emoji}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="max-w-2xl mx-auto px-6 mt-3"
          >
            <div className="bg-dash-card rounded-2xl border border-dash-border shadow-lg overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-dash-border">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-dash-cyan" />
                  <span className="text-sm font-medium text-dash-text">Moboost AI</span>
                  {loading && (
                    <span className="flex items-center gap-1 text-xs text-dash-text-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-dash-cyan animate-pulse" />
                      thinking...
                    </span>
                  )}
                </div>
                <button onClick={handleCloseChat} className="p-1 rounded-md hover:bg-dash-card-hover transition-colors">
                  <X className="w-4 h-4 text-dash-text-muted" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="max-h-96 overflow-y-auto px-5 py-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-6">
                    <Sparkles className="w-8 h-8 text-dash-cyan/30 mx-auto mb-3" />
                    <p className="text-sm font-medium text-dash-text mb-1">Moboost AI 就绪</p>
                    <p className="text-xs text-dash-text-muted max-w-xs mx-auto">
                      基于 {competitors.length} 个竞品的实时监控数据，为你提供竞品分析、市场洞察和投放建议
                    </p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-dash-cyan/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-dash-cyan" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-dash-cyan text-dash-bg rounded-br-md"
                          : "bg-dash-card-hover text-dash-text rounded-bl-md"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="whitespace-pre-wrap font-sans [&>*]:my-0">
                          {msg.content.split("\n").map((line, li) => {
                            if (line.startsWith("## ")) {
                              return <p key={li} className="text-sm font-bold text-dash-cyan mt-1 mb-1.5">{line.slice(3)}</p>;
                            }
                            if (line.startsWith("**") && line.endsWith("**")) {
                              return <p key={li} className="font-semibold mt-2 mb-0.5">{line.slice(2, -2)}</p>;
                            }
                            // Inline bold
                            const parts = line.split(/(\*\*[^*]+\*\*)/g);
                            const hasInlineBold = parts.length > 1;
                            if (hasInlineBold) {
                              return (
                                <p key={li}>
                                  {parts.map((part, pi) =>
                                    part.startsWith("**") && part.endsWith("**")
                                      ? <strong key={pi} className="font-semibold">{part.slice(2, -2)}</strong>
                                      : <span key={pi}>{part}</span>
                                  )}
                                </p>
                              );
                            }
                            if (line === "") return <br key={li} />;
                            return <p key={li}>{line}</p>;
                          })}
                          {msg.isStreaming && (
                            <span className="inline-block w-1.5 h-4 bg-dash-cyan/60 ml-0.5 animate-pulse rounded-sm align-text-bottom" />
                          )}
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-dash-text/10 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-dash-text-muted" />
                      </div>
                    )}
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Module Cards */}
      <div className="max-w-5xl mx-auto mt-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="bg-dash-card rounded-2xl border border-dash-border p-6 flex flex-col hover:border-dash-cyan/20 transition-all group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-dash-cyan/10 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-dash-cyan" />
                  </div>
                  <h3 className="font-display font-bold text-base text-dash-text">{card.title}</h3>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${card.statusColor}`}>
                  {card.status}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {card.metrics.map((m) => {
                  const MIcon = m.icon;
                  return (
                    <div key={m.label} className="bg-dash-bg rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MIcon className="w-3 h-3 text-dash-text-muted" />
                        <span className="text-[11px] text-dash-text-muted">{m.label}</span>
                      </div>
                      <p className="text-lg font-bold text-dash-text leading-tight">{m.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Highlight / Insight */}
              {card.highlight && (
                <div className={`text-xs px-3 py-2 rounded-lg mb-4 ${
                  card.highlightPositive
                    ? "bg-dash-green/10 text-dash-green"
                    : "bg-dash-red/10 text-dash-red"
                }`}>
                  {card.highlightPositive
                    ? <TrendingUp className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                    : <TrendingDown className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                  }
                  {card.highlight}
                </div>
              )}

              {/* Link */}
              <Link
                to={card.link}
                className="mt-auto pt-4 border-t border-dash-border flex items-center justify-center gap-2 text-sm font-medium text-dash-text-muted hover:text-dash-cyan transition-colors"
              >
                View Details
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Live Anomaly Ticker */}
      {stats.highAnomalies > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-5xl mx-auto mt-6 px-6 pb-8"
        >
          <div className="bg-dash-red/5 border border-dash-red/20 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-dash-red" />
              <span className="text-sm font-semibold text-dash-red">Recent High-Priority Alerts</span>
            </div>
            <div className="space-y-2">
              {getAllAnomalies()
                .filter(a => a.severity === "high")
                .slice(0, 3)
                .map((a, i) => (
                  <Link
                    key={i}
                    to={`/competitor/${a.competitorId}`}
                    className="flex items-center justify-between text-sm hover:bg-dash-red/5 rounded-lg px-2 py-1.5 -mx-2 transition-colors"
                  >
                    <span className="text-dash-text">
                      <span className="font-medium">{a.competitorName}</span>
                      <span className="text-dash-text-muted mx-2">·</span>
                      {a.title}
                    </span>
                    <span className="text-xs text-dash-text-muted shrink-0 ml-4">{a.date}</span>
                  </Link>
                ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
