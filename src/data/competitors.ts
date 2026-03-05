// Moboost Intelligence Radar — Mock Data Layer
// All data is realistic-looking demo data for presentation purposes

export interface Competitor {
  id: string;
  name: string;
  icon: string;  // emoji placeholder
  category: string;
  platform: "iOS" | "Android" | "Both";
  region: string[];
  rating: number;
  status: "active" | "rising" | "declining" | "new";
  // Level 2 metrics
  metrics: {
    mau: number;           // Monthly Active Users (millions)
    mauChange: number;     // % change MoM
    downloads: number;     // Monthly downloads (millions)
    downloadsChange: number;
    retention: {
      d1: number;
      d7: number;
      d30: number;
    };
    avgSessionMin: number; // Average session duration (minutes)
    newAds: number;        // New ad creatives this month
    adSpend: number;       // Estimated monthly ad spend (USD thousands)
    adSpendChange: number;
    arpu: number;          // Average Revenue Per User (USD)
    iapRevenue: number;    // In-app purchase revenue (USD thousands)
    revenueChange: number;
  };
  // Anomalies
  anomalies: Anomaly[];
  // Time series (30 days)
  timeSeries: DailyData[];
  // Behavior timeline
  events: TimelineEvent[];
  // AI analysis
  aiInsight: string;
}

export interface Anomaly {
  type: "payment" | "creative" | "growth" | "compliance" | "new_market";
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
  date: string;
}

export interface DailyData {
  date: string;
  mau: number;
  dau: number;
  adSpend: number;
  downloads: number;
  revenue: number;
}

export interface TimelineEvent {
  date: string;
  type: "payment" | "campaign" | "compliance" | "product" | "market";
  title: string;
  detail: string;
  impact: "positive" | "negative" | "neutral";
}

// Industry benchmarks
export const INDUSTRY_BENCHMARKS = {
  shortVideo: {
    d1: 42,
    d7: 22,
    d30: 12,
    avgSessionMin: 28,
    arpu: 0.85,
  },
  social: {
    d1: 38,
    d7: 18,
    d30: 9,
    avgSessionMin: 22,
    arpu: 0.62,
  },
  gaming: {
    d1: 35,
    d7: 15,
    d30: 7,
    avgSessionMin: 18,
    arpu: 1.20,
  },
};

// Generate 30-day time series
function generateTimeSeries(baseMAU: number, baseAdSpend: number, trend: "up" | "down" | "stable" | "spike"): DailyData[] {
  const data: DailyData[] = [];
  const now = new Date("2026-03-05");

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    let mauMultiplier = 1;
    let adMultiplier = 1;

    if (trend === "up") {
      mauMultiplier = 0.85 + (0.15 * (30 - i) / 30);
      adMultiplier = 0.7 + (0.3 * (30 - i) / 30);
    } else if (trend === "down") {
      mauMultiplier = 1.1 - (0.15 * (30 - i) / 30);
      adMultiplier = 1.2 - (0.25 * (30 - i) / 30);
    } else if (trend === "spike") {
      mauMultiplier = i > 15 ? 0.8 : (i > 8 ? 1.3 : 1.1);
      adMultiplier = i > 18 ? 0.6 : (i > 10 ? 1.5 : 1.2);
    } else {
      mauMultiplier = 0.95 + Math.random() * 0.1;
      adMultiplier = 0.9 + Math.random() * 0.2;
    }

    const noise = 0.95 + Math.random() * 0.1;
    const mau = Math.round(baseMAU * mauMultiplier * noise);
    const dau = Math.round(mau * (0.28 + Math.random() * 0.08));

    data.push({
      date: date.toISOString().split("T")[0],
      mau,
      dau,
      adSpend: Math.round(baseAdSpend * adMultiplier * noise),
      downloads: Math.round(mau * (0.12 + Math.random() * 0.05)),
      revenue: Math.round(mau * (0.03 + Math.random() * 0.02)),
    });
  }

  return data;
}

export const competitors: Competitor[] = [
  {
    id: "thrillzz",
    name: "Thrillzz",
    icon: "🎬",
    category: "Short Video / Social",
    platform: "Both",
    region: ["SEA", "LATAM", "MENA"],
    rating: 4.2,
    status: "rising",
    metrics: {
      mau: 18.5,
      mauChange: 23.4,
      downloads: 4.2,
      downloadsChange: 31.2,
      retention: { d1: 48, d7: 26, d30: 14 },
      avgSessionMin: 32,
      newAds: 847,
      adSpend: 2800,
      adSpendChange: 45.0,
      arpu: 1.12,
      iapRevenue: 1650,
      revenueChange: 18.5,
    },
    anomalies: [
      {
        type: "payment",
        severity: "high",
        title: "接入 GCash 和 Dana 支付网关",
        detail: "Thrillzz 在菲律宾和印尼市场接入本地电子钱包，预计将显著降低付费门槛。SDK 签名显示 2 天前完成集成测试。",
        date: "2026-03-03",
      },
      {
        type: "creative",
        severity: "medium",
        title: "广告素材策略大幅调整",
        detail: "新增 340+ 条竖版短视频素材，风格从剧情类转向 UGC 口播类，CPC 预计下降 15-20%。",
        date: "2026-03-01",
      },
      {
        type: "growth",
        severity: "high",
        title: "巴西市场爆发式增长",
        detail: "过去 7 天巴西下载量激增 280%，疑似投入大量 TikTok 本地化素材 + 网红带量。",
        date: "2026-03-04",
      },
    ],
    timeSeries: generateTimeSeries(18500000, 93000, "spike"),
    events: [
      { date: "2026-03-04", type: "market", title: "巴西市场日下载量突破 12 万", detail: "Google Play 娱乐榜升至第 3 位", impact: "positive" },
      { date: "2026-03-03", type: "payment", title: "接入 GCash / Dana 支付", detail: "东南亚本地支付覆盖率从 40% 提升至 85%", impact: "positive" },
      { date: "2026-03-01", type: "campaign", title: "素材策略切换至 UGC 口播", detail: "新增 340+ 条素材，弃用剧情类模板", impact: "neutral" },
      { date: "2026-02-27", type: "compliance", title: "LATAM 隐私政策更新", detail: "符合巴西 LGPD 最新要求，审核通过", impact: "positive" },
      { date: "2026-02-24", type: "product", title: "新增直播打赏功能", detail: "巴西/墨西哥/印尼三国灰度测试", impact: "positive" },
      { date: "2026-02-20", type: "campaign", title: "KOL 合作矩阵扩张", detail: "签约 45 位东南亚中腰部 TikTok 达人", impact: "positive" },
      { date: "2026-02-15", type: "product", title: "AI 推荐算法升级 v3.2", detail: "用户停留时长提升 18%", impact: "positive" },
      { date: "2026-02-10", type: "market", title: "进入墨西哥市场", detail: "App Store 上架 MX 区", impact: "neutral" },
    ],
    aiInsight: "Thrillzz 正处于激进扩张期：巴西市场爆发（下载量 +280%）+ 东南亚支付本地化（GCash/Dana）形成双引擎驱动。建议：①立即跟进巴西市场投放窗口，其 CPI 因竞争加剧预计 2 周内上涨 30%；②关注其 UGC 素材策略转型效果，若 CTR 提升明显则跟进调整素材方向；③其直播打赏功能一旦全量上线，ARPU 可能跳涨，需提前准备应对方案。",
  },
  {
    id: "snackvideo",
    name: "SnackVideo",
    icon: "🍿",
    category: "Short Video",
    platform: "Both",
    region: ["SEA", "South Asia"],
    rating: 4.0,
    status: "active",
    metrics: {
      mau: 45.2,
      mauChange: 5.3,
      downloads: 8.1,
      downloadsChange: -2.4,
      retention: { d1: 44, d7: 23, d30: 11 },
      avgSessionMin: 29,
      newAds: 523,
      adSpend: 4200,
      adSpendChange: 8.0,
      arpu: 0.78,
      iapRevenue: 2800,
      revenueChange: 6.2,
    },
    anomalies: [
      {
        type: "creative",
        severity: "low",
        title: "素材量小幅下降",
        detail: "本月新素材数环比减少 12%，可能在优化存量素材 ROI。",
        date: "2026-03-02",
      },
    ],
    timeSeries: generateTimeSeries(45200000, 140000, "stable"),
    events: [
      { date: "2026-03-02", type: "campaign", title: "缩减低效素材", detail: "停投 CTR < 0.8% 的素材组", impact: "neutral" },
      { date: "2026-02-25", type: "product", title: "电商直播入口上线", detail: "印尼市场试点", impact: "positive" },
    ],
    aiInsight: "SnackVideo 处于稳定运营期，增长放缓但用户基盘稳固。其电商直播布局值得关注——如果跑通，将直接提升 ARPU。目前暂无需特别应对。",
  },
  {
    id: "likee",
    name: "Likee",
    icon: "❤️",
    category: "Short Video / Social",
    platform: "Both",
    region: ["MENA", "CIS", "SEA"],
    rating: 3.8,
    status: "declining",
    metrics: {
      mau: 32.1,
      mauChange: -8.6,
      downloads: 5.4,
      downloadsChange: -15.2,
      retention: { d1: 36, d7: 16, d30: 7 },
      avgSessionMin: 21,
      newAds: 289,
      adSpend: 2100,
      adSpendChange: -22.0,
      arpu: 0.54,
      iapRevenue: 1380,
      revenueChange: -12.3,
    },
    anomalies: [
      {
        type: "growth",
        severity: "high",
        title: "MAU 连续 3 个月下滑",
        detail: "中东和独联体市场流失严重，D30 留存跌破行业基准。",
        date: "2026-03-04",
      },
    ],
    timeSeries: generateTimeSeries(32100000, 70000, "down"),
    events: [
      { date: "2026-03-01", type: "campaign", title: "大幅削减广告预算", detail: "月度预算缩减 22%", impact: "negative" },
      { date: "2026-02-20", type: "compliance", title: "俄罗斯合规审查", detail: "面临 RKN 数据本地化要求", impact: "negative" },
    ],
    aiInsight: "Likee 正在收缩，可能进入战略撤退阶段。其中东用户正在流向竞品——这是一个抢占窗口。建议在 MENA 市场加大投放力度，承接 Likee 的流失用户。",
  },
  {
    id: "bigo-live",
    name: "Bigo Live",
    icon: "🎙️",
    category: "Live Streaming / Social",
    platform: "Both",
    region: ["SEA", "MENA", "South Asia"],
    rating: 4.1,
    status: "active",
    metrics: {
      mau: 28.7,
      mauChange: 3.2,
      downloads: 3.8,
      downloadsChange: 1.5,
      retention: { d1: 41, d7: 21, d30: 10 },
      avgSessionMin: 35,
      newAds: 412,
      adSpend: 3100,
      adSpendChange: 12.0,
      arpu: 1.45,
      iapRevenue: 3320,
      revenueChange: 8.7,
    },
    anomalies: [],
    timeSeries: generateTimeSeries(28700000, 103000, "stable"),
    events: [
      { date: "2026-02-28", type: "product", title: "1v1 视频聊天改版", detail: "匹配算法优化，连接率提升 25%", impact: "positive" },
    ],
    aiInsight: "Bigo Live 依靠直播打赏的高 ARPU 维持稳定现金流。增长不快但盈利能力强。其 1v1 视频聊天功能改版值得借鉴。",
  },
  {
    id: "moj",
    name: "Moj",
    icon: "🎵",
    category: "Short Video",
    platform: "Android",
    region: ["South Asia"],
    rating: 4.3,
    status: "active",
    metrics: {
      mau: 82.5,
      mauChange: 2.1,
      downloads: 12.3,
      downloadsChange: -5.8,
      retention: { d1: 40, d7: 19, d30: 8 },
      avgSessionMin: 26,
      newAds: 156,
      adSpend: 1800,
      adSpendChange: -8.0,
      arpu: 0.22,
      iapRevenue: 1440,
      revenueChange: 2.1,
    },
    anomalies: [],
    timeSeries: generateTimeSeries(82500000, 60000, "stable"),
    events: [
      { date: "2026-02-22", type: "product", title: "短剧频道上线", detail: "主打印度本土短剧内容", impact: "positive" },
    ],
    aiInsight: "Moj 是印度市场霸主，MAU 巨大但 ARPU 极低。其市场相对封闭，与出海竞品的直接竞争有限。关注其短剧内容策略——如果验证成功，该模式可能复制到 SEA。",
  },
  {
    id: "tango",
    name: "Tango Live",
    icon: "💃",
    category: "Live Streaming",
    platform: "Both",
    region: ["MENA", "Turkey"],
    rating: 3.9,
    status: "rising",
    metrics: {
      mau: 8.4,
      mauChange: 15.7,
      downloads: 1.8,
      downloadsChange: 22.3,
      retention: { d1: 45, d7: 25, d30: 13 },
      avgSessionMin: 38,
      newAds: 234,
      adSpend: 1200,
      adSpendChange: 35.0,
      arpu: 2.30,
      iapRevenue: 1540,
      revenueChange: 28.5,
    },
    anomalies: [
      {
        type: "growth",
        severity: "medium",
        title: "MENA 市场强势增长",
        detail: "土耳其和沙特下载量连续 4 周增长，可能在测试新的投放渠道。",
        date: "2026-03-03",
      },
      {
        type: "new_market",
        severity: "medium",
        title: "疑似准备进入北非市场",
        detail: "App Store 上架了阿拉伯语/法语双语版本，覆盖摩洛哥和突尼斯。",
        date: "2026-02-28",
      },
    ],
    timeSeries: generateTimeSeries(8400000, 40000, "up"),
    events: [
      { date: "2026-03-03", type: "market", title: "土耳其社交榜 Top 10", detail: "首次进入头部榜单", impact: "positive" },
      { date: "2026-02-28", type: "market", title: "上架北非市场", detail: "阿拉伯语+法语版本", impact: "neutral" },
      { date: "2026-02-18", type: "payment", title: "接入 Fawry 支付", detail: "埃及本地支付渠道", impact: "positive" },
    ],
    aiInsight: "Tango 是 MENA 市场的隐形强者——用户不多但 ARPU 极高（$2.30）。正在积极扩张北非，与 Thrillzz 在中东市场存在直接竞争。需要重点监控其 MENA 投放策略。",
  },
  {
    id: "hipi",
    name: "Hipi",
    icon: "🎪",
    category: "Short Video",
    platform: "Android",
    region: ["South Asia"],
    rating: 3.5,
    status: "new",
    metrics: {
      mau: 2.3,
      mauChange: 45.0,
      downloads: 0.8,
      downloadsChange: 68.0,
      retention: { d1: 32, d7: 12, d30: 5 },
      avgSessionMin: 15,
      newAds: 89,
      adSpend: 450,
      adSpendChange: 120.0,
      arpu: 0.15,
      iapRevenue: 28,
      revenueChange: 200.0,
    },
    anomalies: [
      {
        type: "growth",
        severity: "low",
        title: "新玩家快速起量",
        detail: "Zee Entertainment 旗下短视频产品，依托媒体矩阵快速获客。",
        date: "2026-03-01",
      },
    ],
    timeSeries: generateTimeSeries(2300000, 15000, "up"),
    events: [
      { date: "2026-03-01", type: "campaign", title: "Zee TV 联合推广", detail: "电视广告 + App 内引流", impact: "positive" },
    ],
    aiInsight: "Hipi 体量小但增速快，是 Zee 集团的战略产品。留存数据差（D30 仅 5%），尚不构成威胁。持续观察即可。",
  },
];

// Helper: get competitor by ID
export function getCompetitor(id: string): Competitor | undefined {
  return competitors.find(c => c.id === id);
}

// Helper: sort competitors by a metric
export function sortByMetric(metric: keyof Competitor["metrics"], desc = true): Competitor[] {
  return [...competitors].sort((a, b) => {
    const av = a.metrics[metric] as number;
    const bv = b.metrics[metric] as number;
    return desc ? bv - av : av - bv;
  });
}

// Helper: get all anomalies sorted by date
export function getAllAnomalies(): (Anomaly & { competitorId: string; competitorName: string })[] {
  return competitors
    .flatMap(c => c.anomalies.map(a => ({ ...a, competitorId: c.id, competitorName: c.name })))
    .sort((a, b) => b.date.localeCompare(a.date));
}
