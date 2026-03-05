import { useState } from "react";
import { Upload, Play, AlertTriangle, CheckCircle, Info, Shield } from "lucide-react";
import DashHeader from "@/components/layout/DashHeader";

const policies = [
  { name: "Social Gambling Policy", status: "pass", icon: CheckCircle },
  { name: "Social Gambling Policy", status: "pass", icon: CheckCircle },
  { name: "Misleading Policy", status: "pass", icon: CheckCircle },
  { name: "Misleading Claims", status: "fail", icon: AlertTriangle },
  { name: "Deceptive Button Style", status: "fail", icon: AlertTriangle },
  { name: "Deceptive Button Style", status: "fail", icon: AlertTriangle },
  { name: "Deceptive/Mise Policy", status: "pass", icon: CheckCircle },
  { name: "Misleading Claims", status: "fail", icon: AlertTriangle },
  { name: "Deceptive Button Style", status: "fail", icon: AlertTriangle },
  { name: "Misleading Claims", status: "pass", icon: CheckCircle },
  { name: "Deceptive Sharing Policy", status: "pass", icon: CheckCircle },
];

const sideNavItems = [
  { label: "Manual Scan", icon: "📄", active: true },
  { label: "Automated Scan History", icon: "🕒", active: false },
  { label: "Cloaking Config", icon: "⚙️", active: false },
];

const radarPoints = ["MAU", "COR", "DBP", "D30", "EDP", "MDIA"];

export default function RiskScanner() {
  const [activeService, setActiveService] = useState("A");

  return (
    <div className="flex-1 dash-page p-6 overflow-auto">
      <DashHeader title="RISK SCANNER" subtitle="Compliance & Cloaking" />
      <div className="glow-line w-full mb-6" />

      <div className="grid grid-cols-12 gap-6">
        {/* Left nav */}
        <div className="col-span-1">
          <div className="space-y-4">
            {sideNavItems.map((item) => (
              <button
                key={item.label}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg w-full transition-colors ${
                  item.active ? "bg-dash-card text-dash-cyan" : "text-dash-text-muted hover:text-dash-text"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[9px] text-center leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Source Material */}
        <div className="col-span-3">
          <div className="dash-card-glow p-4">
            <h3 className="text-xs font-bold text-dash-text mb-4 uppercase">Source Material</h3>
            <p className="text-[10px] text-dash-text-muted mb-3">UPLOAD or SELECT ADS (e.g.)</p>
            
            <button className="w-full py-2.5 rounded-lg bg-dash-cyan/20 border border-dash-cyan/30 text-xs text-dash-cyan font-medium flex items-center justify-center gap-2 hover:bg-dash-cyan/30 transition-colors mb-3">
              <Upload className="w-3.5 h-3.5" /> Upload Ads
            </button>
            
            <div className="text-center text-[10px] text-dash-text-muted mb-3">or</div>
            
            <div className="text-xs text-dash-text mb-2">iGaming video</div>
            <div className="aspect-video bg-dash-card-hover rounded-lg relative flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-dash-bg/80 flex items-center justify-center">
                <Play className="w-5 h-5 text-dash-text ml-0.5" />
              </div>
              <span className="absolute bottom-2 right-2 text-[10px] bg-dash-bg/80 px-1.5 py-0.5 rounded text-dash-text">3:33</span>
            </div>
            
            <div className="space-y-1 text-xs text-dash-text-muted">
              <p>Title: <span className="text-dash-text">Thrillzz Slots Special</span></p>
              <p>Market: <span className="text-dash-text">USA</span></p>
              <p>Platform: <span className="text-dash-text">Meta</span></p>
            </div>
          </div>
        </div>

        {/* AI Pre-Scan Analysis */}
        <div className="col-span-4">
          <div className="dash-card-glow p-4">
            <h3 className="text-xs font-bold text-dash-text mb-4 uppercase">AI Pre-Scan Analysis</h3>
            
            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-dash-cyan to-dash-green text-xs font-bold text-dash-bg uppercase tracking-wider mb-6 hover:opacity-90 transition-opacity">
              START SCAN
            </button>

            {/* Risk Score */}
            <div className="flex items-center gap-6 mb-6">
              {/* Radar chart placeholder */}
              <div className="w-32 h-32 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Hexagon rings */}
                  {[40, 30, 20].map((r) => (
                    <polygon
                      key={r}
                      points={radarPoints.map((_, i) => {
                        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                        return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`;
                      }).join(" ")}
                      fill="none"
                      stroke="hsl(210,25%,18%)"
                      strokeWidth="0.5"
                    />
                  ))}
                  {/* Data polygon */}
                  <polygon
                    points={[35, 25, 30, 20, 28, 32].map((v, i) => {
                      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                      return `${50 + v * Math.cos(angle)},${50 + v * Math.sin(angle)}`;
                    }).join(" ")}
                    fill="hsl(180,100%,50%,0.15)"
                    stroke="hsl(180,100%,50%)"
                    strokeWidth="1"
                  />
                  {/* Labels */}
                  {radarPoints.map((label, i) => {
                    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                    return (
                      <text
                        key={label}
                        x={50 + 47 * Math.cos(angle)}
                        y={50 + 47 * Math.sin(angle)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="hsl(210,15%,55%)"
                        fontSize="5"
                      >
                        {label}
                      </text>
                    );
                  })}
                </svg>
              </div>

              <div className="text-center">
                <p className="text-xs text-dash-text-muted font-semibold mb-1">RISK SCORE</p>
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(210,25%,18%)" strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="hsl(30,90%,55%)" strokeWidth="6"
                      strokeDasharray={`${68 * 2.64} 264`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-dash-orange">68</span>
                    <span className="text-[8px] text-dash-text-muted">/100</span>
                  </div>
                </div>
                <p className="text-xs text-dash-orange font-medium mt-1">Orange/Medium</p>
              </div>
            </div>

            {/* Policy checks */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {policies.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    {p.status === "pass" ? (
                      <CheckCircle className="w-3.5 h-3.5 text-dash-green" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-dash-orange" />
                    )}
                    <span className="text-xs text-dash-text">{p.name}</span>
                  </div>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    p.status === "pass" ? "bg-dash-green/20" : "bg-dash-red/20"
                  }`}>
                    {p.status === "pass" ? (
                      <CheckCircle className="w-2.5 h-2.5 text-dash-green" />
                    ) : (
                      <Info className="w-2.5 h-2.5 text-dash-red" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actionable Advice */}
        <div className="col-span-4">
          <div className="space-y-4">
            <div className="dash-card-glow p-4">
              <h3 className="text-xs font-bold text-dash-text mb-3 uppercase">AI Expert Cloaking Conclusion</h3>
              <p className="text-[10px] text-dash-text-muted leading-relaxed mb-3">
                AI Expert Cloaking Conclusion are suggest to change comments in experimentanion, with the following changes above:
              </p>
              <ol className="text-[10px] text-dash-text-muted leading-relaxed list-decimal list-inside space-y-1">
                <li>Remove "Guaranteed Win" phrase</li>
                <li>Change "Play Now" button to standard format</li>
                <li>Change "Play Now" button to standard format</li>
              </ol>
            </div>

            <div className="dash-card-glow p-4">
              <h3 className="text-xs font-bold text-dash-text mb-3 uppercase">Cloaking Deployment</h3>
              <p className="text-[10px] text-dash-text-muted mb-3">
                Configure your temporary Cloaking Jump Logic, score contor sections using trusted third-party APIs.
              </p>
              
              <div className="flex gap-2 mb-4">
                {["A", "B"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveService(s)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      activeService === s
                        ? "border-dash-cyan bg-dash-cyan/10 text-dash-cyan"
                        : "border-dash-border text-dash-text-muted hover:border-dash-cyan/30"
                    }`}
                  >
                    Service {s}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-dash-text-muted mb-1 block">Safe Page</label>
                  <input
                    type="text"
                    placeholder="https:// your safe page"
                    className="w-full px-3 py-2 rounded-lg bg-dash-card-hover border border-dash-border text-xs text-dash-text placeholder:text-dash-text-muted outline-none focus:border-dash-cyan/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-dash-text-muted mb-1 block">Target Page</label>
                  <input
                    type="text"
                    placeholder="https:// your target page"
                    className="w-full px-3 py-2 rounded-lg bg-dash-card-hover border border-dash-border text-xs text-dash-text placeholder:text-dash-text-muted outline-none focus:border-dash-cyan/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
