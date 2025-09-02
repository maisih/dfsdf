import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderOpen, CheckSquare, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderOpen },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];

const MobileTabBar = () => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="grid grid-cols-4">
        {tabs.map((t) => {
          const isActive = location.pathname === t.href || (t.href !== "/" && location.pathname.startsWith(t.href));
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              to={t.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 gap-1 text-xs",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/10")}/>
              <span className="leading-none">{t.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default memo(MobileTabBar);
