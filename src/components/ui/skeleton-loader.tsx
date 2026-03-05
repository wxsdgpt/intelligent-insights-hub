import { motion } from "framer-motion";

// Shimmer animation keyframes via Tailwind
// We use a gradient background + animation for a natural loading feel

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-muted/60 dark:bg-dash-card-hover rounded ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

// Card skeleton: mimics a KPI card
export function KPICardSkeleton() {
  return (
    <div className="bg-dash-card rounded-xl border border-dash-border p-4">
      <div className="flex items-center justify-between mb-3">
        <Shimmer className="w-8 h-8 rounded-lg" />
        <Shimmer className="w-12 h-4 rounded" />
      </div>
      <Shimmer className="w-20 h-6 rounded mb-2" />
      <Shimmer className="w-32 h-3 rounded" />
    </div>
  );
}

// Chart skeleton: mimics area chart
export function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div className="bg-dash-card rounded-xl border border-dash-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shimmer className="w-4 h-4 rounded" />
        <Shimmer className="w-32 h-4 rounded" />
      </div>
      <div style={{ height }} className="flex items-end gap-1 px-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <Shimmer
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${30 + Math.sin(i * 0.5) * 40 + Math.random() * 20}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// Table skeleton: mimics a data table
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-dash-card rounded-xl border border-dash-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-dash-border flex items-center gap-3">
        <Shimmer className="w-24 h-4 rounded" />
        <div className="flex-1" />
        <Shimmer className="w-32 h-4 rounded" />
      </div>
      {/* Category row */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-dash-border">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="col-span-2 h-3 rounded" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-dash-border">
          <Shimmer className="col-span-1 h-3 rounded" />
          <div className="col-span-2 flex items-center gap-2">
            <Shimmer className="w-6 h-6 rounded-lg" />
            <Shimmer className="flex-1 h-3 rounded" />
          </div>
          {Array.from({ length: 9 }).map((_, col) => (
            <Shimmer key={col} className="h-3 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Module card skeleton for Home page
export function ModuleCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Shimmer className="w-9 h-9 rounded-xl" />
          <Shimmer className="w-28 h-4 rounded" />
        </div>
        <Shimmer className="w-16 h-5 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-muted/30 rounded-xl px-3 py-2.5">
            <Shimmer className="w-16 h-2.5 rounded mb-2" />
            <Shimmer className="w-10 h-5 rounded" />
          </div>
        ))}
      </div>
      <Shimmer className="w-full h-7 rounded-lg mb-4" />
      <div className="border-t border-border pt-4">
        <Shimmer className="w-20 h-4 rounded mx-auto" />
      </div>
    </div>
  );
}

// Pie chart skeleton
export function PieSkeleton() {
  return (
    <div className="bg-dash-card rounded-xl border border-dash-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shimmer className="w-4 h-4 rounded" />
        <Shimmer className="w-28 h-4 rounded" />
      </div>
      <div className="flex items-center justify-center" style={{ height: 180 }}>
        <Shimmer className="w-36 h-36 rounded-full" />
      </div>
      <div className="space-y-2 mt-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shimmer className="w-2 h-2 rounded-full" />
              <Shimmer className="w-16 h-3 rounded" />
            </div>
            <Shimmer className="w-8 h-3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Full Dashboard skeleton layout
export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 min-h-screen bg-dash-bg p-6 overflow-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Shimmer className="w-40 h-3 rounded mb-2" />
          <Shimmer className="w-52 h-6 rounded" />
        </div>
        <Shimmer className="w-48 h-8 rounded-full" />
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <ChartSkeleton height={220} />
        </div>
        <PieSkeleton />
      </div>
      {/* Three columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-dash-card rounded-xl border border-dash-border p-5">
            <Shimmer className="w-32 h-4 rounded mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <Shimmer key={j} className="w-full h-10 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Intelligence Radar skeleton layout
export function RadarSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 dash-page p-6 overflow-auto"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <Shimmer className="w-40 h-4 rounded" />
        <Shimmer className="w-32 h-6 rounded" />
      </div>
      <Shimmer className="w-48 h-6 rounded mb-5" />
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)}
      </div>
      {/* Tabs */}
      <div className="flex items-center gap-3 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Shimmer key={i} className="w-24 h-7 rounded" />
        ))}
      </div>
      <Shimmer className="w-full h-px rounded mb-4" />
      {/* Table */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2 space-y-4">
          <ChartSkeleton height={150} />
          <ChartSkeleton height={120} />
        </div>
        <div className="col-span-10">
          <TableSkeleton rows={7} />
        </div>
      </div>
    </motion.div>
  );
}

export { Shimmer };
