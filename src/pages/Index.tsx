import { Search, Sparkles, Play, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

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

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-background via-muted to-background">
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
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative"
        >
          <div className="flex items-center bg-card rounded-2xl shadow-lg border border-border px-5 py-4">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Moboost AI anything..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button className="ml-3 p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Sparkles className="w-5 h-5 text-secondary" />
            </button>
          </div>
        </motion.div>
      </div>

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
