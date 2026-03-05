import { Home, LayoutDashboard, Radar, Globe, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Intelligence Radar", icon: Radar, path: "/intelligence-radar" },
  { label: "Localization Engine", icon: Globe, path: "/localization-engine" },
  { label: "Risk Scanner", icon: Shield, path: "/risk-scanner" },
];

export default function AppSidebar() {
  const location = useLocation();
  // All pages now use the dark dash theme
  const isDashPage = true;

  return (
    <aside className={`w-56 min-h-screen flex flex-col py-6 px-4 border-r shrink-0 ${
      isDashPage 
        ? "bg-dash-bg border-dash-border" 
        : "bg-card border-border"
    }`}>
      <div className="mb-8 px-2">
        <h1 className="font-display text-xl font-bold">
          <span className={isDashPage ? "text-dash-text" : "text-foreground"}>Mo</span>
          <span className="text-primary font-extrabold">boost</span>
        </h1>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? isDashPage
                    ? "bg-dash-cyan/10 text-dash-cyan"
                    : "bg-primary/10 text-primary"
                  : isDashPage
                    ? "text-dash-text-muted hover:text-dash-text hover:bg-dash-card-hover"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
