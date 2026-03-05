import { Search, Sparkles, Play, ArrowRight, Send, X, Bot, User, Radar, Shield, Languages, TrendingUp, TrendingDown, AlertTriangle, Activity } from "lucide-react";
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

export default function Index() {
  const [query, setQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const { messages, loading, sendQuery, clearMessages } = useMoboostAI();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stats = useRadarStats();

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
        ? "text-destructive bg-destructive/10"
        : "text-dash-green bg-dash-green/10",
      link: "/intelligence-radar",
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
      statusColor: "text-primary bg-primary/10",
      link: "/localization-engine",
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
      statusColor: "text-destructive bg-destructive/10",
      link: "/risk-scanner",
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
    <div className="flex-1 min-h-screen bg-gradient-to-br from-background via-muted to-background relative">
      {/* Agent Status */}
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Moboost Agent Status:</span>
          <span className="w-2 h-2 rounded-full bg-dash-green animate-pulse" />
          <span className="text-dash-green font-medium">Active</span>
          <span className="text-muted-foreground/50 mx-2">|</span>
          <span className="text-muted-foreground">
            {stats.risingApps} rising · {stats.decliningApps} declining
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mt-8 px-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-card rounded-2xl shadow-lg border border-border px-5 py-4">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleSearchFocus}
                placeholder="Ask Moboost AI anything..."
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
              {query.trim() ? (
                <button type="submit" className="ml-3 p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <Send className="w-5 h-5 text-primary" />
                </button>
              ) : (
                <button type="button" className="ml-3 p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <Sparkles className="w-5 h-5 text-secondary" />
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="max-w-2xl mx-auto px-6 mt-3"
          >
            <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Moboost AI</span>
                  {loading && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      thinking...
                    </span>
                  )}
                </div>
                <button onClick={handleCloseChat} className="p-1 rounded-md hover:bg-muted transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="max-h-80 overflow-y-auto px-5 py-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">输入问题，Moboost AI 将为你分析</p>
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
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-foreground/60" />
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
              className="bg-card rounded-2xl border border-border p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground">{card.title}</h3>
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
                    <div key={m.label} className="bg-muted/50 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MIcon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground">{m.label}</span>
                      </div>
                      <p className="text-lg font-bold text-foreground leading-tight">{m.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Highlight / Insight */}
              {card.highlight && (
                <div className={`text-xs px-3 py-2 rounded-lg mb-4 ${
                  card.highlightPositive
                    ? "bg-dash-green/10 text-dash-green"
                    : "bg-destructive/10 text-destructive"
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
                className="mt-auto pt-4 border-t border-border flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
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
          className="max-w-5xl mx-auto mt-6 px-6"
        >
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-semibold text-destructive">Recent High-Priority Alerts</span>
            </div>
            <div className="space-y-2">
              {getAllAnomalies()
                .filter(a => a.severity === "high")
                .slice(0, 3)
                .map((a, i) => (
                  <Link
                    key={i}
                    to={`/intelligence-radar/${a.competitorId}`}
                    className="flex items-center justify-between text-sm hover:bg-destructive/5 rounded-lg px-2 py-1.5 -mx-2 transition-colors"
                  >
                    <span className="text-foreground">
                      <span className="font-medium">{a.competitorName}</span>
                      <span className="text-muted-foreground mx-2">·</span>
                      {a.title}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">{a.date}</span>
                  </Link>
                ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
