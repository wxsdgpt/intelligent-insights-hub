import { useState } from "react";
import { Play, Maximize2, MoreHorizontal, ChevronRight, ChevronDown } from "lucide-react";
import DashHeader from "@/components/layout/DashHeader";

const materialSteps = [
  { label: "AI Parsing", status: "active", color: "bg-dash-red" },
  { label: "AI Parsing", status: "pending", color: "" },
  { label: "Human Reviewing", status: "active", color: "bg-dash-purple" },
  { label: "OriginalBits", status: "pending", color: "" },
  { label: "Ready", status: "pending", color: "" },
  { label: "Ready", status: "pending", color: "" },
];

const culturalSuggestions = [
  { icon: "🎮", title: "Youal Slang Bang", subtitle: "Trends", featured: true },
  { icon: "🎯", title: "Oryat Mafie", subtitle: "Beyond bridge", featured: true },
];

const culturalCards = [
  { icon: "📱", title: "Local Somo Slong", subtitle: "Scope markee", color: "bg-dash-red" },
  { icon: "🌊", title: "Notal Slaid Trends", subtitle: "Salts", color: "bg-dash-green" },
  { icon: "🎭", title: "Relevanel Trends", subtitle: "EI for Framagria", color: "bg-dash-orange" },
  { icon: "⭕", title: "Busvenet Trends", subtitle: "Cargel manleet", color: "bg-dash-purple" },
  { icon: "✅", title: "Tragilea Norled", subtitle: "Ad Dranitiorsm", color: "bg-dash-blue" },
];

export default function LocalizationEngine() {
  return (
    <div className="flex-1 dash-page p-6 overflow-auto">
      <DashHeader title="Localization Engine" />
      <div className="glow-line w-full mb-6" />

      <div className="grid grid-cols-12 gap-6">
        {/* Material Factory */}
        <div className="col-span-2">
          <h3 className="text-sm font-semibold text-dash-text mb-4">Material Factory</h3>
          <div className="space-y-2">
            {materialSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full border-2 ${
                  step.color ? `${step.color} border-transparent` : "border-dash-border"
                }`} />
                <span className={`text-xs ${step.color ? "text-dash-text font-medium" : "text-dash-text-muted"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Source Video */}
        <div className="col-span-3">
          <h3 className="text-sm font-semibold text-dash-text mb-4">Source Video</h3>
          <div className="dash-card-glow overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-dash-purple/30 to-dash-cyan/20 flex items-center justify-center relative">
              <div className="text-center">
                <p className="font-display font-bold text-lg text-dash-text">DYNAMIC</p>
                <p className="font-display font-bold text-2xl neon-text">GAMING</p>
              </div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <span className="text-[10px] text-dash-text-muted bg-dash-bg/60 px-1.5 py-0.5 rounded">Japanese</span>
              </div>
              <button className="absolute bottom-1/2 right-0 translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-full bg-dash-bg/80 flex items-center justify-center border border-dash-border">
                <Play className="w-4 h-4 text-dash-text ml-0.5" />
              </button>
            </div>
            <div className="p-3">
              <p className="text-xs text-dash-text font-medium">English Gaming</p>
              <p className="text-[10px] text-dash-text-muted">Dynamic Slotein and Exblot</p>
              <div className="flex items-center justify-end gap-2 mt-2">
                <MoreHorizontal className="w-3.5 h-3.5 text-dash-text-muted" />
                <Maximize2 className="w-3.5 h-3.5 text-dash-text-muted" />
              </div>
            </div>
          </div>
        </div>

        {/* Localized Version */}
        <div className="col-span-3">
          <h3 className="text-sm font-semibold text-dash-text mb-4">Localized Version</h3>
          <div className="dash-card-glow overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-dash-red/30 to-dash-purple/20 flex items-center justify-center relative">
              <div className="text-center">
                <p className="font-display font-bold text-lg text-dash-text">UTRANT</p>
                <p className="font-display font-bold text-2xl text-dash-orange">GEETURL</p>
              </div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <span className="text-[10px] text-dash-text-muted bg-dash-bg/60 px-1.5 py-0.5 rounded">Japanese</span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs text-dash-text font-medium">Moto Verfhen</p>
              <p className="text-[10px] text-dash-text-muted">Described logmine dit ferent</p>
              <div className="flex items-center justify-end gap-2 mt-2">
                <MoreHorizontal className="w-3.5 h-3.5 text-dash-text-muted" />
                <Maximize2 className="w-3.5 h-3.5 text-dash-text-muted" />
              </div>
            </div>
          </div>
        </div>

        {/* Cultural Adaptation */}
        <div className="col-span-4">
          <h3 className="text-sm font-semibold text-dash-text mb-4">Cultural Adaptation</h3>
          <div className="dash-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-dash-text">AI-s Suggested</h4>
              <ChevronRight className="w-3.5 h-3.5 text-dash-text-muted" />
            </div>
            <div className="space-y-2 mb-4 p-2 bg-dash-card-hover rounded">
              {culturalSuggestions.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm">{s.icon}</span>
                  <div>
                    <p className="text-xs text-dash-text font-medium">{s.title}</p>
                    <p className="text-[10px] text-dash-text-muted">{s.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {culturalCards.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-dash-card-hover transition-colors cursor-pointer">
                  <span className={`w-8 h-8 rounded-lg ${c.color}/20 flex items-center justify-center text-sm`}>{c.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs text-dash-text font-medium">{c.title}</p>
                    <p className="text-[10px] text-dash-text-muted">{c.subtitle}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-dash-text-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audio Section */}
      <div className="mt-6">
        <div className="dash-card-glow p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-dash-text">Localized Voiceover</h3>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg bg-dash-blue flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-dash-text ml-0.5" />
              </button>
              <ChevronDown className="w-4 h-4 text-dash-text-muted" />
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-dash-border rounded-full mb-4 relative">
            <div className="absolute h-full bg-dash-cyan rounded-full" style={{ width: "45%" }} />
            <div className="absolute w-3 h-3 rounded-full bg-dash-text border-2 border-dash-cyan -top-[3px]" style={{ left: "45%" }} />
          </div>

          {/* Waveforms */}
          <div className="space-y-4">
            {["Source", "Localized"].map((label) => (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-dash-text-muted">{label} 0:26</span>
                  <span className="text-[10px] text-dash-text-muted">● Sthwine ✕</span>
                </div>
                <div className="h-16 bg-dash-card-hover rounded flex items-center justify-center overflow-hidden">
                  {/* Fake waveform */}
                  <div className="flex items-center gap-[1px] h-full px-2">
                    {Array.from({ length: 120 }).map((_, i) => {
                      const h = Math.abs(Math.sin(i * 0.15) * Math.cos(i * 0.08)) * 100;
                      return (
                        <div
                          key={i}
                          className={`w-[2px] rounded-full ${label === "Source" ? "bg-dash-cyan" : "bg-dash-purple"}`}
                          style={{ height: `${Math.max(4, h)}%`, opacity: h > 30 ? 0.9 : 0.4 }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
