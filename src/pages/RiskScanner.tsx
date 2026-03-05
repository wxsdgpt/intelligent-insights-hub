import { useState, useEffect } from "react";
import { Upload, Play, AlertTriangle, CheckCircle, Info, Shield, Search, Clock, Settings, FileText, ChevronRight, ExternalLink, Zap } from "lucide-react";
import { motion } from "framer-motion";
import DashHeader from "@/components/layout/DashHeader";

const policies = [
  { name: "Gambling Content Disclosure", status: "pass", detail: "Proper age-gating and disclaimer present" },
  { name: "No Guaranteed Win Claims", status: "fail", detail: "\"Guaranteed Win\" text detected at 0:08" },
  { name: "Real Money Imagery", status: "pass", detail: "No misleading cash visuals found" },
  { name: "CTA Button Compliance", status: "fail", detail: "Deceptive urgency pattern: \"Limited Time!\"" },
  { name: "Responsible Gaming Notice", status: "pass", detail: "T&C link visible in end frame" },
  { name: "User Testimonial Policy", status: "pass", detail: "No fake testimonials detected" },
  { name: "Misleading Reward Claims", status: "fail", detail: "\"Free $100 Bonus\" may violate Meta policy" },
  { name: "Age Restriction Compliance", status: "pass", detail: "18+ badge present in creative" },
  { name: "Sound/Music Licensing", status: "pass", detail: "Royalty-free audio confirmed" },
  { name: "Landing Page Consistency", status: "fail", detail: "Ad claims differ from landing page offer" },
  { name: "Privacy Policy Link", status: "pass", detail: "Privacy policy accessible from ad" },
];

const scanHistory = [
  { id: "SCN-042", title: "Thrillzz Holiday Campaign", date: "2026-03-05", score: 82, status: "pass" },
  { id: "SCN-041", title: "LuckySpin Brazil Launch", date: "2026-03-04", score: 45, status: "fail" },
  { id: "SCN-040", title: "BetRush Live Promo", date: "2026-03-03", score: 91, status: "pass" },
  { id: "SCN-039", title: "Thrillzz VIP Retarget", date: "2026-03-02", score: 73, status: "warn" },
  { id: "SCN-038", title: "GoldRush TikTok Ad", date: "2026-03-01", score: 58, status: "fail" },
];

const sideNavItems = [
  { label: "Manual Scan", icon: Search, active: true },
  { label: "Scan History", icon: Clock, active: false },
  { label: "Cloaking Config", icon: Settings, active: false },
];

const radarPoints = ["Content", "CTA", "Claims", "Legal", "Visual", "Audio"];

export default function RiskScanner() {
  const [activeService, setActiveService] = useState("A");
  const [activeNav, setActiveNav] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 dash-page p-6 overflow-auto">
        <DashHeader title="Risk Scanner" subtitle="Compliance & Cloaking" />
        <div className="glow-line w-full mb-6" />
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-1 space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-dash-card rounded-lg" />)}
            </div>
            <div className="col-span-3 h-96 bg-dash-card rounded-xl" />
            <div className="col-span-4 h-96 bg-dash-card rounded-xl" />
            <div className="col-span-4 h-96 bg-dash-card rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const passCount = policies.filter(p => p.status === "pass").length;
  const failCount = policies.filter(p => p.status === "fail").length;
  const riskScore = 68;

  return (
    <div className="flex-1 dash-page p-6 overflow-auto">
      <DashHeader title="Risk Scanner" subtitle="Compliance & Cloaking" />
      <div className="glow-line w-full mb-6" />

      <div className="grid grid-cols-12 gap-6">
        {/* Left nav */}
        <div className="col-span-12 lg:col-span-1">
          <div className="flex lg:flex-col gap-2 lg:gap-4">
            {sideNavItems.map((item, i) => {
              const NavIcon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(i)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg w-full transition-colors ${
                    activeNav === i ? "bg-dash-card text-dash-cyan" : "text-dash-text-muted hover:text-dash-text"
                  }`}
                >
                  <NavIcon className="w-5 h-5" />
                  <span className="text-[9px] text-center leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Source Material */}
        <div className="col-span-12 lg:col-span-3">
          <div className="dash-card-glow p-4">
            <h3 className="text-xs font-bold text-dash-text mb-4 uppercase flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-dash-cyan" />
              Source Material
            </h3>
            <p className="text-[10px] text-dash-text-muted mb-3">Upload or select an ad creative to scan</p>
            
            <button className="w-full py-2.5 rounded-lg bg-dash-cyan/20 border border-dash-cyan/30 text-xs text-dash-cyan font-medium flex items-center justify-center gap-2 hover:bg-dash-cyan/30 transition-colors mb-3">
              <Upload className="w-3.5 h-3.5" /> Upload Creative
            </button>
            
            <div className="text-center text-[10px] text-dash-text-muted mb-3">or select from library</div>
            
            <div className="text-xs text-dash-text mb-2 font-medium">Thrillzz Slots Special</div>
            <div className="aspect-video bg-dash-card-hover rounded-lg relative flex items-center justify-center mb-3 border border-dash-border overflow-hidden">
              <div className="text-center">
                <p className="font-display font-bold text-sm text-dash-text-muted">THRILLZZ</p>
                <p className="font-display font-bold text-lg neon-text">SLOTS</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-dash-bg/80 flex items-center justify-center absolute">
                <Play className="w-4 h-4 text-dash-text ml-0.5" />
              </div>
              <span className="absolute bottom-2 right-2 text-[10px] bg-dash-bg/80 px-1.5 py-0.5 rounded text-dash-text-muted">0:33</span>
            </div>
            
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-dash-text-muted">Title</span>
                <span className="text-dash-text font-medium">Thrillzz Slots Special</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dash-text-muted">Market</span>
                <span className="text-dash-text font-medium">USA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dash-text-muted">Platform</span>
                <span className="text-dash-text font-medium">Meta</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dash-text-muted">Format</span>
                <span className="text-dash-text font-medium">Video (MP4)</span>
              </div>
            </div>

            {/* Scan History Summary */}
            <div className="mt-4 pt-4 border-t border-dash-border">
              <h4 className="text-[10px] text-dash-text-muted uppercase tracking-wider mb-2">Recent Scans</h4>
              <div className="space-y-1.5">
                {scanHistory.slice(0, 3).map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between text-[10px] py-1 hover:bg-dash-card-hover rounded px-1 cursor-pointer transition-colors">
                    <span className="text-dash-text truncate max-w-[55%]">{scan.title}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        scan.score >= 80 ? "text-dash-green" :
                        scan.score >= 60 ? "text-dash-orange" :
                        "text-dash-red"
                      }`}>{scan.score}</span>
                      <span className="text-dash-text-muted">{scan.date.slice(5)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Pre-Scan Analysis */}
        <div className="col-span-12 lg:col-span-4">
          <div className="dash-card-glow p-4">
            <h3 className="text-xs font-bold text-dash-text mb-4 uppercase flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-dash-cyan" />
              AI Compliance Analysis
            </h3>
            
            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-dash-cyan to-dash-green text-xs font-bold text-dash-bg uppercase tracking-wider mb-6 hover:opacity-90 transition-opacity">
              Start Compliance Scan
            </button>

            {/* Risk Score */}
            <div className="flex items-center gap-6 mb-6">
              {/* Radar chart */}
              <div className="w-32 h-32 relative shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
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
                  <polygon
                    points={[35, 18, 25, 38, 32, 36].map((v, i) => {
                      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                      return `${50 + v * Math.cos(angle)},${50 + v * Math.sin(angle)}`;
                    }).join(" ")}
                    fill="hsl(180,100%,50%,0.15)"
                    stroke="hsl(180,100%,50%)"
                    strokeWidth="1"
                  />
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
                        fontSize="4.5"
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
                      strokeDasharray={`${riskScore * 2.64} 264`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-dash-orange">{riskScore}</span>
                    <span className="text-[8px] text-dash-text-muted">/100</span>
                  </div>
                </div>
                <p className="text-xs text-dash-orange font-medium mt-1">Medium Risk</p>
                <p className="text-[9px] text-dash-text-muted mt-0.5">{passCount} pass · {failCount} fail</p>
              </div>
            </div>

            {/* Policy checks */}
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {policies.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-dash-card-hover transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {p.status === "pass" ? (
                      <CheckCircle className="w-3.5 h-3.5 text-dash-green shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-dash-orange shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className="text-xs text-dash-text block">{p.name}</span>
                      <span className="text-[9px] text-dash-text-muted block truncate opacity-0 group-hover:opacity-100 transition-opacity">{p.detail}</span>
                    </div>
                  </div>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    p.status === "pass" ? "bg-dash-green/20" : "bg-dash-red/20"
                  }`}>
                    {p.status === "pass" ? (
                      <CheckCircle className="w-2.5 h-2.5 text-dash-green" />
                    ) : (
                      <Info className="w-2.5 h-2.5 text-dash-red" />
                    )}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Advice + Cloaking */}
        <div className="col-span-12 lg:col-span-4">
          <div className="space-y-4">
            {/* AI Rewrite Suggestions */}
            <div className="dash-card-glow p-4">
              <h3 className="text-xs font-bold text-dash-text mb-3 uppercase flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-dash-orange" />
                AI Rewrite Suggestions
              </h3>
              <p className="text-[10px] text-dash-text-muted leading-relaxed mb-3">
                Based on Meta Advertising Standards and platform-specific gambling ad policies, the following changes are recommended to improve compliance:
              </p>
              <ol className="text-[10px] text-dash-text leading-relaxed list-decimal list-inside space-y-2">
                <li>
                  <span className="text-dash-red line-through">"Guaranteed Win"</span>
                  <span className="text-dash-text mx-1">→</span>
                  <span className="text-dash-green">"Play for a chance to win"</span>
                </li>
                <li>
                  <span className="text-dash-red line-through">"Limited Time!"</span>
                  <span className="text-dash-text mx-1">→</span>
                  <span className="text-dash-green">"Special welcome offer"</span>
                </li>
                <li>
                  <span className="text-dash-red line-through">"Free $100 Bonus"</span>
                  <span className="text-dash-text mx-1">→</span>
                  <span className="text-dash-green">"Up to $100 in bonus credits (T&C apply)"</span>
                </li>
                <li>
                  Add explicit "Must be 18+" overlay before CTA button
                </li>
              </ol>
              <div className="mt-3 pt-3 border-t border-dash-border">
                <p className="text-[10px] text-dash-text-muted">Estimated score after fixes: <span className="text-dash-green font-bold">89/100</span></p>
              </div>
            </div>

            {/* Cloaking Deployment */}
            <div className="dash-card-glow p-4">
              <h3 className="text-xs font-bold text-dash-text mb-3 uppercase flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-dash-purple" />
                Cloaking Deployment
              </h3>
              <p className="text-[10px] text-dash-text-muted mb-3">
                Configure cloaking jump logic for ad compliance. Routes reviewers to a safe page while delivering the target experience to real users.
              </p>
              
              <div className="flex gap-2 mb-4">
                {[
                  { key: "A", label: "Service A", desc: "TrafficArmor" },
                  { key: "B", label: "Service B", desc: "CloakShield" },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveService(s.key)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      activeService === s.key
                        ? "border-dash-cyan bg-dash-cyan/10 text-dash-cyan"
                        : "border-dash-border text-dash-text-muted hover:border-dash-cyan/30"
                    }`}
                  >
                    <span className="block">{s.label}</span>
                    <span className="block text-[9px] opacity-60 mt-0.5">{s.desc}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-dash-text-muted mb-1 block">Safe Page URL</label>
                  <input
                    type="text"
                    placeholder="https://thrillzz.com/safe-landing"
                    className="w-full px-3 py-2 rounded-lg bg-dash-card-hover border border-dash-border text-xs text-dash-text placeholder:text-dash-text-muted/40 outline-none focus:border-dash-cyan/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-dash-text-muted mb-1 block">Target Page URL</label>
                  <input
                    type="text"
                    placeholder="https://thrillzz.com/slots-promo"
                    className="w-full px-3 py-2 rounded-lg bg-dash-card-hover border border-dash-border text-xs text-dash-text placeholder:text-dash-text-muted/40 outline-none focus:border-dash-cyan/50 transition-colors"
                  />
                </div>
                <button className="w-full py-2.5 rounded-lg bg-dash-purple/20 border border-dash-purple/30 text-xs text-dash-purple font-medium hover:bg-dash-purple/30 transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Deploy Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
