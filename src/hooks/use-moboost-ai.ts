import { useState, useCallback, useRef } from "react";
import { competitors, getAllAnomalies, INDUSTRY_BENCHMARKS } from "@/data/competitors";

// Moboost AI Bridge - connects search queries to OpenClaw
// Falls back to intelligent local responses when API is unavailable
const API_BASE = import.meta.env.VITE_MOBOOST_API || "";

interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

// --- Local Intelligence Engine ---
// Generates contextual responses from competitor data when API is unavailable

function matchCompetitor(query: string): typeof competitors[number] | null {
  const q = query.toLowerCase();
  return competitors.find(c => q.includes(c.name.toLowerCase())) || null;
}

function formatMAU(n: number): string {
  return n >= 1 ? n.toFixed(1) + "M" : (n * 1000).toFixed(0) + "K";
}

function formatUSD(n: number): string {
  if (n >= 1000) return "$" + (n / 1000).toFixed(1) + "M";
  return "$" + n.toFixed(0) + "K";
}

type ResponseGenerator = {
  match: (q: string) => boolean;
  generate: (q: string) => string;
};

const responseGenerators: ResponseGenerator[] = [
  // Competitor-specific analysis
  {
    match: (q) => {
      const lq = q.toLowerCase();
      return competitors.some(c => lq.includes(c.name.toLowerCase())) &&
        (lq.includes("分析") || lq.includes("analyz") || lq.includes("情况") || lq.includes("数据") || lq.includes("趋势") || lq.includes("增长") || lq.includes("growth"));
    },
    generate: (q) => {
      const comp = matchCompetitor(q)!;
      const m = comp.metrics;
      const trend = m.mauChange > 0 ? "📈 上升" : "📉 下降";
      const retention = m.retention;
      const benchD1 = INDUSTRY_BENCHMARKS.shortVideo.d1;
      const retentionVsBench = retention.d1 > benchD1 ? "高于" : "低于";
      const anomalies = comp.anomalies.filter(a => a.severity === "high");

      return `## ${comp.icon} ${comp.name} 深度分析

**核心指标概览**
• MAU: ${formatMAU(m.mau)} (${trend} ${m.mauChange > 0 ? "+" : ""}${m.mauChange}%)
• 月下载量: ${formatMAU(m.downloads)}
• 广告消耗: ${formatUSD(m.adSpend)} (${m.adSpendChange > 0 ? "+" : ""}${m.adSpendChange}%)
• ARPU: $${m.arpu.toFixed(2)}
• IAP 收入: ${formatUSD(m.iapRevenue)}

**用户质量**
• D1 留存 ${retention.d1}% / D7 留存 ${retention.d7}% / D30 留存 ${retention.d30}%
• ${retentionVsBench}行业基准 (D1: ${benchD1}%)
• 平均使用时长: ${m.avgSessionMin} 分钟/次

**投放强度**
• 本月新素材: ${m.newAds} 条
• 投放力度评级: ${m.adSpend > 200 ? "🔴 高强度" : m.adSpend > 100 ? "🟡 中等" : "🟢 保守"}

${anomalies.length > 0 ? `**⚠️ 高优异动 (${anomalies.length}条)**\n${anomalies.map(a => `• ${a.title}: ${a.detail}`).join("\n")}` : "**✅ 近期无高优异动**"}

**AI 洞察**
${comp.aiInsight}`;
    },
  },
  // App comparison (two apps head-to-head)
  {
    match: (q) => {
      const lq = q.toLowerCase();
      const hasCompareIntent = lq.includes("对比") || lq.includes("比较") || lq.includes("compare") || lq.includes("vs") || lq.includes("versus") || lq.includes("和") || lq.includes("与");
      if (!hasCompareIntent) return false;
      // Need at least 2 competitor names
      const matched = competitors.filter(c => lq.includes(c.name.toLowerCase()));
      return matched.length >= 2;
    },
    generate: (q) => {
      const lq = q.toLowerCase();
      const matched = competitors.filter(c => lq.includes(c.name.toLowerCase())).slice(0, 2);
      const [a, b] = matched;
      const ma = a.metrics;
      const mb = b.metrics;

      const winner = (va: number, vb: number, higher = true) => {
        if (higher) return va > vb ? "🏆" : va < vb ? "" : "🤝";
        return va < vb ? "🏆" : va > vb ? "" : "🤝";
      };

      return `## ⚔️ ${a.icon} ${a.name} vs ${b.icon} ${b.name}

**流量规模**
| 指标 | ${a.name} | ${b.name} | 优势方 |
|------|-----------|-----------|--------|
| MAU | ${formatMAU(ma.mau)} | ${formatMAU(mb.mau)} | ${ma.mau > mb.mau ? a.icon : b.icon} |
| 增长率 | ${ma.mauChange > 0 ? "+" : ""}${ma.mauChange}% | ${mb.mauChange > 0 ? "+" : ""}${mb.mauChange}% | ${ma.mauChange > mb.mauChange ? a.icon : b.icon} |
| 月下载 | ${formatMAU(ma.downloads)} | ${formatMAU(mb.downloads)} | ${ma.downloads > mb.downloads ? a.icon : b.icon} |

**用户质量**
| 指标 | ${a.name} | ${b.name} | 优势方 |
|------|-----------|-----------|--------|
| D1 留存 | ${ma.retention.d1}% | ${mb.retention.d1}% | ${ma.retention.d1 > mb.retention.d1 ? a.icon : b.icon} |
| D7 留存 | ${ma.retention.d7}% | ${mb.retention.d7}% | ${ma.retention.d7 > mb.retention.d7 ? a.icon : b.icon} |
| D30 留存 | ${ma.retention.d30}% | ${mb.retention.d30}% | ${ma.retention.d30 > mb.retention.d30 ? a.icon : b.icon} |
| 时长 | ${ma.avgSessionMin}min | ${mb.avgSessionMin}min | ${ma.avgSessionMin > mb.avgSessionMin ? a.icon : b.icon} |

**商业化**
| 指标 | ${a.name} | ${b.name} | 优势方 |
|------|-----------|-----------|--------|
| ARPU | $${ma.arpu.toFixed(2)} | $${mb.arpu.toFixed(2)} | ${ma.arpu > mb.arpu ? a.icon : b.icon} |
| IAP 收入 | ${formatUSD(ma.iapRevenue)} | ${formatUSD(mb.iapRevenue)} | ${ma.iapRevenue > mb.iapRevenue ? a.icon : b.icon} |
| 广告消耗 | ${formatUSD(ma.adSpend)} | ${formatUSD(mb.adSpend)} | ${ma.adSpend > mb.adSpend ? a.icon : b.icon} |

**综合评估**
${ma.mau > mb.mau && ma.retention.d7 > mb.retention.d7
  ? `${a.icon} ${a.name} 在规模和用户质量上双重领先，竞争优势明显。`
  : mb.mau > ma.mau && mb.retention.d7 > ma.retention.d7
    ? `${b.icon} ${b.name} 在规模和用户质量上双重领先，竞争优势明显。`
    : `两者各有优势 — ${ma.mau > mb.mau ? a.name + " 规模更大" : b.name + " 规模更大"}，${ma.retention.d7 > mb.retention.d7 ? a.name + " 留存更好" : b.name + " 留存更好"}。`}
${ma.arpu > mb.arpu ? `💰 ${a.name} 的变现效率更高 (ARPU ${(ma.arpu / mb.arpu).toFixed(1)}x)` : `💰 ${b.name} 的变现效率更高 (ARPU ${(mb.arpu / ma.arpu).toFixed(1)}x)`}

💡 **建议：** 深入研究${ma.retention.d7 > mb.retention.d7 ? a.name : b.name}的留存策略和${ma.arpu > mb.arpu ? a.name : b.name}的付费设计。`;
    },
  },
  // Market anomalies
  {
    match: (q) => {
      const lq = q.toLowerCase();
      return lq.includes("异动") || lq.includes("alert") || lq.includes("anomal") || lq.includes("变化") || lq.includes("发生了什么");
    },
    generate: () => {
      const anomalies = getAllAnomalies();
      const highAnomalies = anomalies.filter(a => a.severity === "high");
      const medAnomalies = anomalies.filter(a => a.severity === "medium");

      let response = `## 🚨 市场异动报告\n\n`;
      response += `当前共检测到 **${anomalies.length}** 条异动，其中高优 ${highAnomalies.length} 条、中优 ${medAnomalies.length} 条。\n\n`;

      if (highAnomalies.length > 0) {
        response += `**🔴 高优异动**\n`;
        highAnomalies.slice(0, 5).forEach(a => {
          response += `• **${a.competitorName}** — ${a.title}\n  ${a.detail} (${a.date})\n`;
        });
        response += "\n";
      }

      if (medAnomalies.length > 0) {
        response += `**🟡 中优异动**\n`;
        medAnomalies.slice(0, 3).forEach(a => {
          response += `• **${a.competitorName}** — ${a.title}\n  ${a.detail} (${a.date})\n`;
        });
      }

      response += `\n💡 **建议：** 重点关注支付变更和新市场进入动作，这些通常预示竞品战略调整。`;
      return response;
    },
  },
  // ARPU comparison
  {
    match: (q) => {
      const lq = q.toLowerCase();
      return lq.includes("arpu") || lq.includes("商业化") || lq.includes("revenue") || lq.includes("收入") || lq.includes("变现");
    },
    generate: () => {
      const sorted = [...competitors].sort((a, b) => b.metrics.arpu - a.metrics.arpu);
      let response = `## 💰 ARPU & 商业化能力对比\n\n`;
      response += `| 排名 | App | ARPU | IAP 收入 | 变化 |\n`;
      response += `|------|-----|------|----------|------|\n`;
      sorted.forEach((c, i) => {
        const change = c.metrics.revenueChange > 0 ? `+${c.metrics.revenueChange}%` : `${c.metrics.revenueChange}%`;
        response += `| ${i + 1} | ${c.icon} ${c.name} | $${c.metrics.arpu.toFixed(2)} | ${formatUSD(c.metrics.iapRevenue)} | ${change} |\n`;
      });

      const avgARPU = competitors.reduce((s, c) => s + c.metrics.arpu, 0) / competitors.length;
      const topPerformer = sorted[0];
      response += `\n**市场均值 ARPU:** $${avgARPU.toFixed(2)}`;
      response += `\n**头部选手:** ${topPerformer.icon} ${topPerformer.name} 的 ARPU 是市场均值的 ${(topPerformer.metrics.arpu / avgARPU).toFixed(1)}x`;
      response += `\n\n💡 **洞察：** ARPU 高的产品通常具备更成熟的付费模型。关注 ${topPerformer.name} 的付费设计可为投放 ROI 提供参考。`;
      return response;
    },
  },
  // Ad spend / investment advice
  {
    match: (q) => {
      const lq = q.toLowerCase();
      return lq.includes("投放") || lq.includes("建议") || lq.includes("ad spend") || lq.includes("策略") || lq.includes("怎么投") || lq.includes("优化");
    },
    generate: () => {
      const rising = competitors.filter(c => c.status === "rising");
      const declining = competitors.filter(c => c.status === "declining");
      const topSpender = [...competitors].sort((a, b) => b.metrics.adSpend - a.metrics.adSpend)[0];
      const bestRetention = [...competitors].sort((a, b) => b.metrics.retention.d7 - a.metrics.retention.d7)[0];
      const totalAdSpend = competitors.reduce((s, c) => s + c.metrics.adSpend, 0);

      return `## 💡 投放策略建议

**市场总投放规模:** ${formatUSD(totalAdSpend)}/月

**趋势判断**
• ${rising.length} 个 App 处于上升期: ${rising.map(c => c.icon + " " + c.name).join(", ")}
• ${declining.length} 个 App 处于下降期: ${declining.map(c => c.icon + " " + c.name).join(", ")}

**竞争格局**
• 头部投手: ${topSpender.icon} ${topSpender.name} (${formatUSD(topSpender.metrics.adSpend)}/月，占市场 ${((topSpender.metrics.adSpend / totalAdSpend) * 100).toFixed(0)}%)
• 质量标杆: ${bestRetention.icon} ${bestRetention.name} (D7 留存 ${bestRetention.metrics.retention.d7}%)

**可执行建议**
1. 🎯 **差异化投放** — 避开 ${topSpender.name} 的主力市场，寻找其未覆盖的 ${competitors.find(c => c.region.length > 3)?.region.slice(-2).join("、") || "新兴"} 市场
2. 📊 **素材策略** — 参考 ${bestRetention.name} 的高留存模式，重点优化前 3 秒吸引力
3. ⏰ **时机窗口** — 下降期产品 (${declining.map(c => c.name).join("、")}) 正在收缩投放，是抢占其流量的好时机
4. 💰 **预算建议** — 初始测试期建议月投放 ${formatUSD(totalAdSpend / competitors.length * 0.3)}，观察 D1 留存再加码`;
    },
  },
  // Retention / user quality
  {
    match: (q) => {
      const lq = q.toLowerCase();
      return lq.includes("留存") || lq.includes("retention") || lq.includes("用户质量") || lq.includes("流失");
    },
    generate: () => {
      const sorted = [...competitors].sort((a, b) => b.metrics.retention.d7 - a.metrics.retention.d7);
      const bench = INDUSTRY_BENCHMARKS.shortVideo;

      let response = `## 📊 留存率与用户质量分析\n\n`;
      response += `**行业基准 (短视频赛道):** D1 ${bench.d1}% / D7 ${bench.d7}% / D30 ${bench.d30}%\n\n`;
      response += `| App | D1 | D7 | D30 | vs 基准 |\n`;
      response += `|-----|-----|-----|------|--------|\n`;
      sorted.forEach(c => {
        const r = c.metrics.retention;
        const vs = r.d7 > bench.d7 ? "✅ 优于" : "⚠️ 低于";
        response += `| ${c.icon} ${c.name} | ${r.d1}% | ${r.d7}% | ${r.d30}% | ${vs} |\n`;
      });

      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      response += `\n**最佳留存:** ${best.icon} ${best.name} (D7: ${best.metrics.retention.d7}%)`;
      response += `\n**最低留存:** ${worst.icon} ${worst.name} (D7: ${worst.metrics.retention.d7}%)`;
      response += `\n\n💡 高留存通常与新手引导质量、推送策略和内容推荐算法强相关。`;
      return response;
    },
  },
  // Market overview
  {
    match: (q) => {
      const lq = q.toLowerCase();
      return lq.includes("市场") || lq.includes("概况") || lq.includes("overview") || lq.includes("总览") || lq.includes("大盘");
    },
    generate: () => {
      const totalMAU = competitors.reduce((s, c) => s + c.metrics.mau, 0);
      const totalSpend = competitors.reduce((s, c) => s + c.metrics.adSpend, 0);
      const totalRevenue = competitors.reduce((s, c) => s + c.metrics.iapRevenue, 0);
      const regions = new Set<string>();
      competitors.forEach(c => c.region.forEach(r => regions.add(r)));

      return `## 🌐 竞品市场概况

**监控范围**
• 跟踪 App 数: ${competitors.length}
• 覆盖市场: ${Array.from(regions).join(", ")}
• 总 MAU: ${formatMAU(totalMAU)}

**资金流向**
• 月度广告总消耗: ${formatUSD(totalSpend)}
• 月度 IAP 总收入: ${formatUSD(totalRevenue)}
• 平均 ROI 估算: ${(totalRevenue / totalSpend * 100).toFixed(0)}%

**竞争态势**
• 上升期: ${competitors.filter(c => c.status === "rising").length} 个 App
• 活跃期: ${competitors.filter(c => c.status === "active").length} 个 App
• 下降期: ${competitors.filter(c => c.status === "declining").length} 个 App
• 新入局: ${competitors.filter(c => c.status === "new").length} 个 App

前往 Intelligence Radar 查看详细监控大盘 →`;
    },
  },
];

// Default fallback
function generateFallbackResponse(query: string): string {
  const suggestions = [
    "分析 Thrillzz 最近的增长趋势",
    "最近有什么市场异动？",
    "各竞品 ARPU 对比",
    "投放策略建议",
    "用户留存率分析",
    "市场大盘概况",
  ];
  return `我理解你在问关于 "${query}" 的问题。\n\n目前我可以帮你分析以下方向：\n${suggestions.map(s => `• ${s}`).join("\n")}\n\n试试输入上面的问题，我会基于实时监控数据给你详细分析。`;
}

function generateLocalResponse(query: string): string {
  for (const gen of responseGenerators) {
    if (gen.match(query)) {
      return gen.generate(query);
    }
  }
  return generateFallbackResponse(query);
}

// --- Typing effect ---
function simulateTyping(
  fullText: string,
  onUpdate: (text: string) => void,
  onDone: () => void,
  signal: AbortSignal,
) {
  let index = 0;
  const charsPerTick = 3; // chars per frame
  const intervalMs = 16; // ~60fps

  const tick = () => {
    if (signal.aborted) return;
    index = Math.min(index + charsPerTick, fullText.length);
    onUpdate(fullText.slice(0, index));
    if (index < fullText.length) {
      setTimeout(tick, intervalMs);
    } else {
      onDone();
    }
  };
  setTimeout(tick, 300); // small initial delay to feel natural
}

// --- Hook ---
export function useMoboostAI() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendQuery = useCallback(async (query: string) => {
    if (!query.trim()) return;

    // Cancel any in-progress streaming
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const userMsg: AIMessage = { role: "user", content: query, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    // Try API first, fall back to local intelligence
    let responseText: string;
    let useLocal = false;

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      responseText = data.reply || data.message || "";
      if (!responseText) throw new Error("Empty response");
    } catch (err: any) {
      if (controller.signal.aborted) return;
      // Silently fall back to local — no error shown to user
      useLocal = true;
      responseText = generateLocalResponse(query);
    }

    if (controller.signal.aborted) return;

    // Add placeholder message for streaming effect
    const placeholderIdx = Date.now();
    const assistantMsg: AIMessage = {
      role: "assistant",
      content: "",
      timestamp: placeholderIdx,
      isStreaming: true,
    };
    setMessages(prev => [...prev, assistantMsg]);

    // Simulate typing for local responses; API responses show immediately
    if (useLocal) {
      simulateTyping(
        responseText,
        (partial) => {
          setMessages(prev =>
            prev.map(m =>
              m.timestamp === placeholderIdx ? { ...m, content: partial } : m
            )
          );
        },
        () => {
          setMessages(prev =>
            prev.map(m =>
              m.timestamp === placeholderIdx ? { ...m, isStreaming: false } : m
            )
          );
          setLoading(false);
        },
        controller.signal,
      );
    } else {
      setMessages(prev =>
        prev.map(m =>
          m.timestamp === placeholderIdx
            ? { ...m, content: responseText, isStreaming: false }
            : m
        )
      );
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendQuery, clearMessages };
}
