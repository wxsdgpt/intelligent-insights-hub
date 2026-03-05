import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import DashHeader from "@/components/layout/DashHeader";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const trafficData = [
  { year: "2014", mau: 50 }, { year: "2016", mau: 80 }, { year: "2018", mau: 120 },
  { year: "2019", mau: 200, event: "Version 4.5 Release" }, { year: "2020", mau: 150 },
  { year: "2021", mau: 180 }, { year: "2022", mau: 220, event: "Summer Slots Tournament" }, { year: "2023", mau: 250 },
];

const retentionData = [
  { day: "D1", value: 100 }, { day: "D3", value: 80 }, { day: "D7", value: 55 }, { day: "D14", value: 40 }, { day: "D30", value: 30 },
];

const arpu = [
  { year: "2019", value: 5 }, { year: "2020", value: 8 }, { year: "2021", value: 12 },
  { year: "2022", value: 9 }, { year: "2023", value: 15 },
];

const creatives = [
  { title: "Meta Video: Crypto Bonus", duration: "8:33", tags: ["High Conversion", "Hook: Bonus Incentive"], source: "Cennos" },
  { title: "TikTok Ad: Ramadan Special", duration: "0:35", tags: ["High Conversion", "Hook: Bonus Incentive"], source: "Gennos" },
  { title: "TikTok Ad: Ramadan Special", duration: "0:18", tags: ["High Conversion", "Hook: Bonus Incentive"], source: "Cennos" },
];

const timeline = [
  { title: "Payment Gateway Update", subtitle: "Added local wallet", time: "2 days ago", color: "bg-dash-cyan" },
  { title: "New Feature Launch", subtitle: "Parmetion Campaign", time: "1 week ago", color: "bg-dash-green" },
  { title: "Version 4.5 Release", subtitle: "", time: "3 months ago", color: "bg-dash-purple" },
  { title: "Policy Compliance Check", subtitle: "Risk alert: misleading button", time: "1 month ago", color: "bg-dash-orange" },
  { title: "New Ramadan Campaign", subtitle: "", time: "2 weeks ago", color: "bg-dash-blue" },
];

export default function CompetitorDeepDive() {
  const { id } = useParams();
  const name = id?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Competitor";

  return (
    <div className="flex-1 dash-page p-6 overflow-auto">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/intelligence-radar" className="text-dash-text-muted hover:text-dash-cyan transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-xs text-dash-text-muted uppercase tracking-wider">Competitive Intelligence | AdTech Platform</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl font-bold text-dash-text flex items-center gap-3">
          <span className="text-dash-cyan">←</span> {name}
          <span className="text-dash-text-muted text-sm font-normal">/ Moboost</span>
        </h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-dash-cyan/30 bg-dash-cyan/5">
          <span className="w-2 h-2 rounded-full bg-dash-green animate-pulse-glow" />
          <span className="text-xs font-medium text-dash-cyan">OpenClaw Agent Status: Active</span>
        </div>
      </div>

      <div className="glow-line w-full mb-6" />

      {/* Charts Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="dash-card-glow p-4">
          <h3 className="text-xs font-semibold text-dash-text mb-3">[TRAFFIC TRENDS] (MAU/DAU LINE)</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="mauGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(180,100%,50%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(180,100%,50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fill: "hsl(210,15%,55%)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(210,15%,55%)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(210,30%,12%)", border: "1px solid hsl(210,25%,18%)", fontSize: 11, color: "#fff" }} />
                <Area type="monotone" dataKey="mau" stroke="hsl(180,100%,50%)" fill="url(#mauGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-card-glow p-4">
          <h3 className="text-xs font-semibold text-dash-text mb-3">[USER RETENTION LEAKAGE]</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retentionData}>
                <XAxis dataKey="day" tick={{ fill: "hsl(210,15%,55%)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(210,15%,55%)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(210,30%,12%)", border: "1px solid hsl(210,25%,18%)", fontSize: 11, color: "#fff" }} />
                <Bar dataKey="value" fill="hsl(180,100%,50%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-card-glow p-4">
          <h3 className="text-xs font-semibold text-dash-text mb-3">[AD INTENSITY MAP] (By Ad Volume)</h3>
          <div className="h-40 bg-dash-card-hover rounded flex items-center justify-center">
            <span className="text-[10px] text-dash-text-muted">World Map Heatmap</span>
          </div>
        </div>

        <div className="dash-card-glow p-4">
          <h3 className="text-xs font-semibold text-dash-text mb-3">COMMERCIALIZATION BREAKDOWN</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={arpu}>
                <XAxis dataKey="year" tick={{ fill: "hsl(210,15%,55%)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(210,15%,55%)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(210,30%,12%)", border: "1px solid hsl(210,25%,18%)", fontSize: 11, color: "#fff" }} />
                <Line type="monotone" dataKey="value" stroke="hsl(270,65%,55%)" strokeWidth={2} dot={{ fill: "hsl(270,65%,55%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Creative Intelligence - Videos */}
        <div className="dash-card-glow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-dash-text">CREATIVE INTELLIGENCE <span className="text-dash-text-muted">(TABLE VIEW)</span></h3>
            <span className="text-[10px] text-dash-cyan cursor-pointer">Show all</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {creatives.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="aspect-video bg-dash-card-hover rounded relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-dash-bg/50 flex items-center justify-center">
                    <Play className="w-3 h-3 text-dash-text ml-0.5" />
                  </div>
                  <span className="absolute bottom-1 right-1 text-[8px] bg-dash-bg/80 px-1 rounded text-dash-text">{c.duration}</span>
                </div>
                <p className="text-[9px] text-dash-text leading-tight">{c.title}</p>
                <div className="flex flex-wrap gap-0.5">
                  {c.tags.map((tag) => (
                    <span key={tag} className="text-[7px] px-1 py-0.5 rounded bg-dash-green/20 text-dash-green">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Behavior Timeline */}
        <div className="dash-card-glow p-4">
          <h3 className="text-xs font-semibold text-dash-text mb-3">STRATEGIC BEHAVIOR TIMELINE</h3>
          <div className="space-y-3">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                  {i < timeline.length - 1 && <span className="w-px h-6 bg-dash-border" />}
                </div>
                <div>
                  <p className="text-xs text-dash-text font-medium">{t.title}</p>
                  {t.subtitle && <p className="text-[10px] text-dash-text-muted">{t.subtitle}</p>}
                  <p className="text-[9px] text-dash-text-muted">{t.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Expert Conclusion */}
        <div className="dash-card-glow p-4">
          <h3 className="text-xs font-semibold text-dash-text mb-3">AI EXPERT ONE-PAPER CONCLUSION</h3>
          <p className="text-[10px] text-dash-text-muted leading-relaxed">
            OpenClaw Agent Paper conclusion: collectively commentary states conclusions of the competing 
            trade the were casual or extended understanding, harmoniesofcommerce etc conclusion 
            commercial and assisted the masses anymore.
          </p>
          <p className="text-[10px] text-dash-text-muted leading-relaxed mt-2">
            The important status to launch is the competitive platform bases—canine assume criterion form 
            lateral root amateurish architecture universal and verification aid e-operationalism this 
            comparison, Meta to coconvert everyone measurement.
          </p>
        </div>
      </div>
    </div>
  );
}
