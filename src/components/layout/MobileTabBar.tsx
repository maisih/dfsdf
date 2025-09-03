import { memo } from "react";
import { useLocation } from "react-router-dom";
import SmoothLink from "@/components/ui/smooth-link";
import { LayoutDashboard, FolderOpen, CheckSquare, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInvitationAuth } from "@/contexts/InvitationAuthContext";

const defaultTabs = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderOpen },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];

const workerTabs = [
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "AI", href: "/ai", icon: Brain },
];

const MobileTabBar = () => {
  const location = useLocation();
  const { user } = useInvitationAuth();
  const role = (user?.role || '').toLowerCase();
  const tabs = role === 'worker' ? workerTabs : defaultTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className={`grid ${tabs.length === 2 ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {tabs.map((t) => {
          const isActive = location.pathname === t.href || (t.href !== "/" && location.pathname.startsWith(t.href));
          const Icon = t.icon;
          return (
            <SmoothLink
              key={t.href}
              to={t.href}
              className={cn(
                "flex flex-col items-center justify-center py-3 gap-1 text-xs",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/10")}/>
              <span className="leading-none">{t.label}</span>
            </SmoothLink>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default memo(MobileTabBar);
