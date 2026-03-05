import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, ChevronDown, ExternalLink } from "lucide-react";
import DashHeader from "@/components/layout/DashHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const mauData = [
  { month: "Jun", value: 2 }, { month: "Jul", value: 4 }, { month: "Aug", value: 3 },
  { month: "Sep", value: 8 }, { month: "Oct", value: 12 }, { month: "Nov", value: 15 },
  { month: "Dec", value: 10 },
];

const topCompetitors = [
  { name: "MAU", value: "37.9M", color: "bg-dash-cyan" },
  { name: "SMI", value: "15.5M", color: "bg-dash-purple" },
  { name: "Dow", value: "24.5M", color: "bg-dash-blue" },
  { name: "App", value: "17.8M", color: "bg-dash-orange" },
];

const competitors = [
  { name: "Thrillzz", market: "USA", mau: "25M", downloads: "25.5M", appTraffic: "15.5K", avgSession: "03.20", d7: "42%", d30: "32.2%", activeUsers: 22, newAds: 85.77, mainAd: "Nom Ad Networks", arpu: "$5.77", iap: "0.33", alert: "warning" },
  { name: "Stake.us", market: "USA", mau: "25M", downloads: "1.5M", appTraffic: "15.5K", avgSession: "03.24", d7: "35%", d30: "32.2%", activeUsers: 22, newAds: 40, mainAd: "Main Ad Networks", arpu: "1.9%", iap: "", alert: "ok" },
  { name: "High 5", market: "Bar", mau: "13M", downloads: "2.3M", appTraffic: "39.1K", avgSession: "03.29", d7: "43%", d30: "33.9%", activeUsers: 14, newAds: 3, mainAd: "Borke Hess Networks", arpu: "3.2%", iap: "", alert: "ok" },
  { name: "DraftKings", market: "USA", mau: "57M", downloads: "33M", appTraffic: "32.7K", avgSession: "03.21", d7: "35%", d30: "33.3%", activeUsers: 9, newAds: 37, mainAd: "Main Ad Networks", arpu: "1.9%", iap: "", alert: "ok" },
  { name: "BetMGM", market: "Bar", mau: "57M", downloads: "33M", appTraffic: "22.9K", avgSession: "03.29", d7: "49%", d30: "56.3%", activeUsers: 3, newAds: 30, mainAd: "Main Ad Networks", arpu: "1.9%", iap: "", alert: "ok" },
  { name: "Bwin", market: "Bar", mau: "45M", downloads: "15M", appTraffic: "22.9K", avgSession: "03.83", d7: "76%", d30: "33.9%", activeUsers: 0, newAds: 27, mainAd: "Main Ad Networks", arpu: "1.9%", iap: "", alert: "ok" },
  { name: "SMI", market: "USA", mau: "12M", downloads: "23M", appTraffic: "15.5K", avgSession: "03.29", d7: "35%", d30: "33.3%", activeUsers: 9, newAds: 27, mainAd: "Main Ad Networks", arpu: "1.9%", iap: "", alert: "ok" },
];

const iapTransactions = [
  { name: "Thrillzz", value: 15.5, color: "bg-dash-green" },
  { name: "Stake.us", value: 12.5, color: "bg-dash-blue" },
  { name: "High 5", value: 6.5, color: "bg-dash-purple" },
  { name: "DraftKings", value: 3.5, color: "bg-dash-orange" },
  { name: "BetMGM", value: 2.5, color: "bg-dash-cyan" },
  { name: "Bwin", value: 1.8, color: "bg-dash-red" },
];

export default function IntelligenceRadar() {
  const [activeTab, setActiveTab] = useState("正在监控");
  const tabs = ["正在监控", "推荐监控", "展展示"];

  return (
    <div className="flex-1 dash-page p-6 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-dash-text-muted uppercase tracking-wider">Competitive Intelligence</span>
          <span className="text-dash-text-muted">|</span>
          <span className="text-xs text-dash-text-muted">AdTech Platform</span>
        </div>
        <div className="px-4 py-1 border border-dash-cyan/30 rounded text-xs neon-text tracking-widest">
          COMPETITIVE INTELLIGENCE
        </div>
      </div>

      <DashHeader title="iGaming" />

      {/* Tabs and filters */}
      <div className="flex items-center gap-3 mb-4">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
              activeTab === tab
                ? i === 2 ? "bg-dash-red text-dash-text" : "bg-dash-cyan/20 text-dash-cyan border border-dash-cyan/30"
                : "bg-dash-card text-dash-text-muted border border-dash-border hover:border-dash-cyan/20"
            }`}
          >
            {tab}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-dash-border bg-dash-card text-xs text-dash-text-muted">
          <Filter className="w-3 h-3" />
          Filtering
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-dash-border bg-dash-card text-xs text-dash-text-muted">
          iGaming | USA/Brazil/Indonesia | Last 30 Days
          <ChevronDown className="w-3 h-3" />
        </div>
      </div>

      <div className="glow-line w-full mb-4" />

      <div className="grid grid-cols-12 gap-4">
        {/* Left sidebar charts */}
        <div className="col-span-2 space-y-4">
          <div className="dash-card p-3">
            <h3 className="text-xs font-semibold text-dash-text mb-3">TOP COMPETITORS (by MAU)</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mauData}>
                  <XAxis dataKey="month" tick={{ fill: "hsl(210,15%,55%)", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Bar dataKey="value" fill="hsl(180,100%,50%)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dash-card p-3">
            <h3 className="text-xs font-semibold text-dash-text mb-2">TOP COMPETITORS (by MAU)</h3>
            {topCompetitors.map((c) => (
              <div key={c.name} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${c.color}`} />
                  <span className="text-xs text-dash-text">{c.name}</span>
                </div>
                <span className="text-xs text-dash-text-muted">{c.value}</span>
              </div>
            ))}
          </div>

          <div className="dash-card p-3">
            <h3 className="text-xs font-semibold text-dash-text mb-2">MONTHLY ONE-PAPER SUMMARY</h3>
            <p className="text-[10px] text-dash-text-muted leading-relaxed">
              iGaming: The monthly one-paper summary. iGaming Experts' leveragede domining ad site acting Experts.
            </p>
          </div>
        </div>

        {/* Main data table */}
        <div className="col-span-7">
          <div className="dash-card overflow-hidden">
            <div className="px-4 py-2 border-b border-dash-border">
              <h3 className="text-xs font-semibold text-dash-text">CORE DATA MONITORING TABLE <span className="text-dash-text-muted">(TABLE VIEW)</span></h3>
            </div>
            {/* Category headers */}
            <div className="grid grid-cols-7 text-[10px] font-bold text-center border-b border-dash-border">
              <div className="col-span-2 py-1.5" />
              <div className="py-1.5 text-dash-cyan border-x border-dash-border">[TRAFFIC SCALE]</div>
              <div className="py-1.5 text-dash-green border-r border-dash-border">[USER QUALITY]</div>
              <div className="py-1.5 text-dash-orange border-r border-dash-border">[AD INTENSITY]</div>
              <div className="py-1.5 text-dash-purple col-span-2">[COMMERCIALIZATION]</div>
            </div>
            {/* Sub-headers */}
            <div className="grid grid-cols-14 text-[9px] text-dash-text-muted text-center py-1 border-b border-dash-border bg-dash-card-hover">
              <div className="col-span-1">RANK</div>
              <div className="col-span-1">COMPETITOR</div>
              <div>MARKET</div>
              <div>MAU</div>
              <div>DOWNLOADS</div>
              <div>TRAFFIC</div>
              <div>SESSION</div>
              <div>D7 RET</div>
              <div>D30 RET</div>
              <div>USERS</div>
              <div>NEW ADS</div>
              <div>AD NET</div>
              <div>ARPU</div>
              <div>ALERT</div>
            </div>
            {/* Rows */}
            {competitors.map((c, i) => (
              <Link
                key={c.name + i}
                to={`/competitor/${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`grid grid-cols-14 text-[10px] text-center py-2 border-b border-dash-border items-center hover:bg-dash-card-hover transition-colors ${
                  i === 0 ? "bg-dash-cyan/5" : ""
                }`}
              >
                <div className="text-dash-text-muted">{i + 1}</div>
                <div className="text-dash-text font-medium text-left pl-2 flex items-center gap-1">
                  <span className="w-4 h-4 rounded bg-dash-border inline-block" />
                  {c.name}
                </div>
                <div className="text-dash-text-muted">{c.market}</div>
                <div className="text-dash-text">{c.mau}</div>
                <div className="text-dash-text">{c.downloads}</div>
                <div className="text-dash-text">{c.appTraffic}</div>
                <div className="text-dash-text">{c.avgSession}</div>
                <div className="text-dash-text">{c.d7}</div>
                <div className="text-dash-text">{c.d30}</div>
                <div className="text-dash-text">{c.activeUsers}</div>
                <div className="text-dash-text">{c.newAds}</div>
                <div className="text-[9px] text-dash-text-muted">{c.mainAd}</div>
                <div className="text-dash-text">{c.arpu}</div>
                <div>
                  <span className={`w-2 h-2 rounded-full inline-block ${c.alert === "warning" ? "bg-dash-orange" : "bg-dash-green"}`} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="col-span-3 space-y-4">
          <div className="dash-card p-3">
            <h3 className="text-xs font-semibold text-dash-text mb-2">GLOBAL AD MAP (by Ad Volume)</h3>
            <div className="h-24 bg-dash-card-hover rounded flex items-center justify-center">
              <span className="text-[10px] text-dash-text-muted">World Map Visualization</span>
            </div>
          </div>

          <div className="dash-card p-3">
            <h3 className="text-xs font-semibold text-dash-text mb-3">TOP 5 IAP TRANSACTIONS</h3>
            {iapTransactions.map((t) => (
              <div key={t.name} className="flex items-center gap-2 py-1">
                <span className={`w-3 h-3 rounded ${t.color}`} />
                <span className="text-xs text-dash-text flex-1">{t.name}</span>
                <span className="text-xs text-dash-text-muted">{t.value}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
