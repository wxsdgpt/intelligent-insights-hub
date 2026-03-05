interface DashHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

export default function DashHeader({ title, subtitle, breadcrumb }: DashHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        {breadcrumb && (
          <p className="text-xs text-dash-text-muted mb-1 uppercase tracking-wider">{breadcrumb}</p>
        )}
        <h1 className="font-display text-xl font-bold text-dash-text flex items-center gap-2">
          {title}
          {subtitle && <span className="text-dash-text-muted font-normal text-sm">| {subtitle}</span>}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-dash-cyan/30 bg-dash-cyan/5">
          <span className="w-2 h-2 rounded-full bg-dash-green animate-pulse-glow" />
          <span className="text-xs font-medium text-dash-cyan">OpenClaw Agent Status: Active</span>
        </div>
      </div>
    </div>
  );
}
