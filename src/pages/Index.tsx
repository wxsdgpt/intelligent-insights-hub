import { Search, Sparkles, Play, ArrowRight, Send, X, Bot, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMoboostAI } from "@/hooks/use-moboost-ai";

const cards = [
  {
    id: 1,
    title: "Intelligence Radar",
    status: "Active",
    statusColor: "text-dash-green bg-dash-green/10",
    description: "2 tasks in progress",
    link: "/intelligence-radar",
    type: "chart" as const,
    progress: 65,
  },
  {
    id: 2,
    title: "Localization Engine",
    status: "Processing",
    statusColor: "text-primary bg-primary/10",
    description: "3 tasks in progress",
    link: "/localization-engine",
    type: "video" as const,
    progress: 78,
  },
  {
    id: 3,
    title: "Risk Scanner",
    status: "High",
    statusColor: "text-destructive bg-destructive/10",
    description: "1 task in progress",
    link: "/risk-scanner",
    type: "gauge" as const,
    progress: 25,
  },
];

export default function Index() {
  const [query, setQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const { messages, loading, sendQuery, clearMessages } = useMoboostAI();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-background via-muted to-background relative">
      {/* Agent Status */}
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Moboost Agent Status:</span>
          <span className="w-2 h-2 rounded-full bg-dash-green" />
          <span className="text-dash-green font-medium">Active</span>
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

      {/* Cards */}
      <div className="max-w-5xl mx-auto mt-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="bg-card rounded-2xl border border-border p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">Card {card.id}</span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${card.statusColor}`}>
                {card.status}
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-4">{card.title}</h3>

            {card.type === "chart" && (
              <div className="flex-1 flex items-center justify-center py-4">
                <div className="relative w-28 h-28">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="url(#grad1)" strokeWidth="8"
                      strokeDasharray={`${card.progress * 2.51} 251`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            )}

            {card.type === "video" && (
              <div className="flex-1 flex items-center justify-center py-4">
                <div className="w-full aspect-video bg-foreground/5 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center">
                    <Play className="w-5 h-5 text-foreground/60 ml-0.5" />
                  </div>
                </div>
              </div>
            )}

            {card.type === "gauge" && (
              <div className="flex-1 flex flex-col items-center justify-center py-4 gap-2">
                <p className="text-sm font-medium text-foreground">Risk Level</p>
                <div className="w-full h-3 rounded-full bg-gradient-to-r from-dash-green via-dash-orange to-dash-red relative">
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-foreground"
                    style={{ left: "68%" }}
                  />
                </div>
                <div className="flex justify-between w-full text-xs text-muted-foreground">
                  <span>low</span><span>medium</span><span>high</span>
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground mb-2">Progress</p>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{card.description}</p>

            <Link
              to={card.link}
              className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              View Details <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
