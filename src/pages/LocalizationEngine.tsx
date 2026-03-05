import { useState, useEffect } from "react";
import { Play, Pause, Maximize2, MoreHorizontal, ChevronRight, ChevronDown, CheckCircle2, Clock, AlertCircle, Languages, FileVideo, Mic, Globe, ArrowRight, Eye } from "lucide-react";
import { motion } from "framer-motion";
import DashHeader from "@/components/layout/DashHeader";

// --- Realistic mock data ---

interface PipelineTask {
  id: string;
  title: string;
  source: string;
  target: string;
  status: "parsing" | "translating" | "voiceover" | "review" | "ready" | "rejected";
  progress: number;
  market: string;
}

const pipelineTasks: PipelineTask[] = [
  { id: "LOC-001", title: "Thrillzz Slots Hero Ad", source: "English", target: "Japanese", status: "ready", progress: 100, market: "JP" },
  { id: "LOC-002", title: "Thrillzz Casino Promo 15s", source: "English", target: "Portuguese", status: "review", progress: 85, market: "BR" },
  { id: "LOC-003", title: "Thrillzz Welcome Bonus", source: "English", target: "Hindi", status: "voiceover", progress: 60, market: "IN" },
  { id: "LOC-004", title: "LuckySpin Brand Video", source: "English", target: "Spanish", status: "translating", progress: 40, market: "MX" },
  { id: "LOC-005", title: "BetRush Live Casino", source: "English", target: "Thai", status: "parsing", progress: 15, market: "TH" },
  { id: "LOC-006", title: "Thrillzz VIP Rewards", source: "English", target: "Arabic", status: "ready", progress: 100, market: "SA" },
  { id: "LOC-007", title: "GoldRush Tutorial", source: "English", target: "Vietnamese", status: "rejected", progress: 70, market: "VN" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  parsing: { label: "AI Parsing", color: "text-dash-orange", bg: "bg-dash-orange/15", icon: Clock },
  translating: { label: "Translating", color: "text-dash-blue", bg: "bg-dash-blue/15", icon: Languages },
  voiceover: { label: "Voiceover", color: "text-dash-purple", bg: "bg-dash-purple/15", icon: Mic },
  review: { label: "Awaiting Review", color: "text-dash-cyan", bg: "bg-dash-cyan/15", icon: Eye },
  ready: { label: "Ready", color: "text-dash-green", bg: "bg-dash-green/15", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-dash-red", bg: "bg-dash-red/15", icon: AlertCircle },
};

const culturalInsights = [
  { icon: "🎰", title: "「一攫千金」は日本市場で好まれます", subtitle: "JP — Gambling ad slang trending on TikTok", color: "bg-dash-cyan" },
  { icon: "🙏", title: "Avoid showing alcohol in Indian ads", subtitle: "IN — Cultural & legal restriction", color: "bg-dash-red" },
  { icon: "🎮", title: "\"Jogo do bicho\" references resonate in BR", subtitle: "BR — Familiar gambling culture reference", color: "bg-dash-green" },
  { icon: "☪️", title: "Use right-to-left layout for Arabic creatives", subtitle: "SA — RTL text + mirrored UI elements", color: "bg-dash-purple" },
  { icon: "🌙", title: "Ramadan timing: schedule ads after Iftar", subtitle: "SA/MY — Peak engagement 9PM–1AM", color: "bg-dash-orange" },
];

const languageStats = [
  { lang: "Japanese", code: "JP", completed: 12, total: 15, flag: "🇯🇵" },
  { lang: "Portuguese", code: "BR", completed: 8, total: 12, flag: "🇧🇷" },
  { lang: "Hindi", code: "IN", completed: 5, total: 10, flag: "🇮🇳" },
  { lang: "Spanish", code: "MX", completed: 9, total: 11, flag: "🇲🇽" },
  { lang: "Thai", code: "TH", completed: 3, total: 8, flag: "🇹🇭" },
  { lang: "Arabic", code: "SA", completed: 6, total: 9, flag: "🇸🇦" },
  { lang: "Vietnamese", code: "VN", completed: 4, total: 7, flag: "🇻🇳" },
  { lang: "Korean", code: "KR", completed: 7, total: 8, flag: "🇰🇷" },
];

export default function LocalizationEngine() {
  const [selectedTask, setSelectedTask] = useState<PipelineTask>(pipelineTasks[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 dash-page p-6 overflow-auto">
        <DashHeader title="Localization Engine" subtitle="AI-Powered Creative Adaptation" />
        <div className="glow-line w-full mb-6" />
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-dash-card rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3 h-96 bg-dash-card rounded-xl" />
            <div className="col-span-5 h-96 bg-dash-card rounded-xl" />
            <div className="col-span-4 h-96 bg-dash-card rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const totalTasks = pipelineTasks.length;
  const readyTasks = pipelineTasks.filter(t => t.status === "ready").length;
  const reviewTasks = pipelineTasks.filter(t => t.status === "review").length;
  const activeTasks = pipelineTasks.filter(t => !["ready", "rejected"].includes(t.status)).length;

  return (
    <div className="flex-1 dash-page p-6 overflow-auto">
      <DashHeader title="Localization Engine" subtitle="AI-Powered Creative Adaptation" />
      <div className="glow-line w-full mb-6" />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Tasks", value: totalTasks.toString(), sub: "this week", icon: FileVideo, color: "text-dash-cyan" },
          { label: "In Progress", value: activeTasks.toString(), sub: "processing now", icon: Clock, color: "text-dash-orange" },
          { label: "Awaiting Review", value: reviewTasks.toString(), sub: "needs approval", icon: Eye, color: "text-dash-purple" },
          { label: "Completed", value: readyTasks.toString(), sub: `${Math.round((readyTasks/totalTasks)*100)}% success rate`, icon: CheckCircle2, color: "text-dash-green" },
        ].map((kpi, i) => {
          const KIcon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="dash-card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-dash-text-muted">{kpi.label}</span>
                <KIcon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className="text-2xl font-bold text-dash-text">{kpi.value}</p>
              <p className="text-[10px] text-dash-text-muted mt-1">{kpi.sub}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Pipeline Queue */}
        <div className="col-span-12 lg:col-span-3">
          <div className="dash-card p-4">
            <h3 className="text-sm font-semibold text-dash-text mb-4 flex items-center gap-2">
              <FileVideo className="w-4 h-4 text-dash-cyan" />
              Pipeline Queue
            </h3>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {pipelineTasks.map((task) => {
                const sc = statusConfig[task.status];
                const SIcon = sc.icon;
                const isActive = selectedTask.id === task.id;
                return (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isActive ? "bg-dash-cyan/10 border border-dash-cyan/30" : "hover:bg-dash-card-hover border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-dash-text truncate max-w-[70%]">{task.title}</span>
                      <span className="text-[9px] text-dash-text-muted">{task.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] text-dash-text-muted">{task.source}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-dash-text-muted" />
                      <span className="text-[10px] text-dash-text font-medium">{task.target}</span>
                      <span className="text-[10px] ml-auto">{task.market}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-dash-border rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            task.status === "ready" ? "bg-dash-green" :
                            task.status === "rejected" ? "bg-dash-red" :
                            "bg-dash-cyan"
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className={`flex items-center gap-1 text-[9px] ${sc.color}`}>
                        <SIcon className="w-2.5 h-2.5" />
                        {sc.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Video Comparison */}
        <div className="col-span-12 lg:col-span-5">
          <div className="dash-card-glow p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-dash-text flex items-center gap-2">
                <Globe className="w-4 h-4 text-dash-purple" />
                Side-by-Side Preview
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusConfig[selectedTask.status].bg} ${statusConfig[selectedTask.status].color}`}>
                {statusConfig[selectedTask.status].label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Source */}
              <div>
                <p className="text-[10px] text-dash-text-muted mb-1.5 uppercase tracking-wider">Source ({selectedTask.source})</p>
                <div className="aspect-video bg-gradient-to-br from-dash-cyan/20 to-dash-purple/10 rounded-lg flex items-center justify-center relative overflow-hidden border border-dash-border">
                  <div className="text-center">
                    <p className="font-display font-bold text-sm text-dash-text-muted">THRILLZZ</p>
                    <p className="font-display font-bold text-xl neon-text">SLOTS</p>
                    <p className="text-[9px] text-dash-text-muted mt-1">Win Big Today!</p>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-dash-bg/80 flex items-center justify-center border border-dash-border hover:border-dash-cyan/50 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3 h-3 text-dash-text" /> : <Play className="w-3 h-3 text-dash-text ml-0.5" />}
                  </button>
                  <span className="absolute bottom-2 right-2 text-[9px] bg-dash-bg/80 px-1.5 py-0.5 rounded text-dash-text-muted">0:15</span>
                </div>
              </div>

              {/* Localized */}
              <div>
                <p className="text-[10px] text-dash-text-muted mb-1.5 uppercase tracking-wider">Localized ({selectedTask.target})</p>
                <div className="aspect-video bg-gradient-to-br from-dash-purple/20 to-dash-red/10 rounded-lg flex items-center justify-center relative overflow-hidden border border-dash-border">
                  <div className="text-center">
                    <p className="font-display font-bold text-sm text-dash-text-muted">スリルズ</p>
                    <p className="font-display font-bold text-xl text-dash-orange">スロット</p>
                    <p className="text-[9px] text-dash-text-muted mt-1">今日大勝利！</p>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-dash-bg/80 flex items-center justify-center border border-dash-border hover:border-dash-cyan/50 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3 h-3 text-dash-text" /> : <Play className="w-3 h-3 text-dash-text ml-0.5" />}
                  </button>
                  <span className="absolute bottom-2 right-2 text-[9px] bg-dash-bg/80 px-1.5 py-0.5 rounded text-dash-text-muted">0:15</span>
                </div>
              </div>
            </div>

            {/* Voiceover Comparison */}
            <div className="dash-card p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-dash-text flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-dash-purple" />
                  Voiceover Comparison
                </h4>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-7 h-7 rounded-lg bg-dash-purple/20 flex items-center justify-center hover:bg-dash-purple/30 transition-colors"
                >
                  {isPlaying ? <Pause className="w-3 h-3 text-dash-purple" /> : <Play className="w-3 h-3 text-dash-purple ml-0.5" />}
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-dash-border rounded-full mb-3 relative">
                <div className="absolute h-full bg-dash-purple rounded-full transition-all" style={{ width: isPlaying ? "45%" : "0%" }} />
              </div>

              {/* Waveforms */}
              <div className="space-y-3">
                {[
                  { label: "Source (English)", color: "bg-dash-cyan", duration: "0:15" },
                  { label: `Localized (${selectedTask.target})`, color: "bg-dash-purple", duration: "0:16" },
                ].map((track) => (
                  <div key={track.label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-dash-text-muted">{track.label}</span>
                      <span className="text-[10px] text-dash-text-muted">{track.duration}</span>
                    </div>
                    <div className="h-12 bg-dash-card-hover rounded flex items-center overflow-hidden">
                      <div className="flex items-center gap-[1px] h-full px-2 w-full">
                        {Array.from({ length: 120 }).map((_, i) => {
                          const h = Math.abs(Math.sin(i * 0.15) * Math.cos(i * 0.08)) * 100;
                          return (
                            <div
                              key={i}
                              className={`w-[2px] rounded-full ${track.color}`}
                              style={{ height: `${Math.max(4, h)}%`, opacity: h > 30 ? 0.9 : 0.3 }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Actions */}
            {selectedTask.status === "review" && (
              <div className="flex items-center gap-3 mt-4">
                <button className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-dash-green to-dash-cyan text-xs font-bold text-dash-bg uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve & Publish
                </button>
                <button className="px-4 py-2.5 rounded-lg border border-dash-red/30 text-xs text-dash-red hover:bg-dash-red/10 transition-colors">
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Cultural + Language Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Cultural Adaptation Engine */}
          <div className="dash-card p-4">
            <h3 className="text-sm font-semibold text-dash-text mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-dash-orange" />
              Cultural Adaptation Engine
            </h3>
            <p className="text-[10px] text-dash-text-muted mb-3">AI-powered insights for target market: <span className="text-dash-text font-medium">{selectedTask.target} ({selectedTask.market})</span></p>
            <div className="space-y-2">
              {culturalInsights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-dash-card-hover transition-colors cursor-pointer group"
                >
                  <span className={`w-8 h-8 rounded-lg ${insight.color}/15 flex items-center justify-center text-sm shrink-0`}>
                    {insight.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-dash-text font-medium leading-snug">{insight.title}</p>
                    <p className="text-[10px] text-dash-text-muted mt-0.5">{insight.subtitle}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-dash-text-muted shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Language Coverage */}
          <div className="dash-card p-4">
            <h3 className="text-sm font-semibold text-dash-text mb-4 flex items-center gap-2">
              <Languages className="w-4 h-4 text-dash-cyan" />
              Language Coverage
            </h3>
            <div className="space-y-2.5">
              {languageStats.map((ls) => (
                <div key={ls.code} className="flex items-center gap-3">
                  <span className="text-sm w-6 text-center">{ls.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-dash-text font-medium">{ls.lang}</span>
                      <span className="text-[10px] text-dash-text-muted">{ls.completed}/{ls.total}</span>
                    </div>
                    <div className="h-1.5 bg-dash-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-dash-cyan rounded-full transition-all"
                        style={{ width: `${(ls.completed / ls.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
