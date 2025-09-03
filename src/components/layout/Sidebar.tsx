import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  CheckSquare,
  ClipboardList,
  Users,
  Package,
  Wrench,
  DollarSign,
  BarChart3,
  FileText,
  Brain,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import SmoothLink from "@/components/ui/smooth-link";
import { memo } from "react";
import { useInvitationAuth } from "@/contexts/InvitationAuthContext";

interface SidebarProps {
  className?: string;
}

export const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    name: "Projects",
    icon: FolderOpen,
    href: "/projects",
  },
  {
    name: "Schedule",
    icon: Calendar,
    href: "/schedule",
  },
  {
    name: "Tasks",
    icon: CheckSquare,
    href: "/tasks",
  },
  {
    name: "Team",
    icon: Users,
    href: "/team",
  },
  {
    name: "Materials",
    icon: Package,
    href: "/materials",
  },
  {
    name: "Equipment",
    icon: Wrench,
    href: "/equipment",
  },
  {
    name: "Budget",
    icon: DollarSign,
    href: "/budget",
  },
  {
    name: "Reports",
    icon: BarChart3,
    href: "/reports",
  },
  {
    name: "Documents",
    icon: FileText,
    href: "/documents",
  },
  {
    name: "Admin",
    icon: Shield,
    href: "/admin",
  }
];

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { user } = useInvitationAuth();
  const role = (user?.role || '').toLowerCase();

  const visibleNav = navigation.filter((item) => {
    if (role === 'worker') {
      return item.href === '/reports';
    }
    if (item.href === '/admin') {
      return role === 'admin' || role === 'engineer';
    }
    return true;
  });

  return (
    <div className={cn("pb-12 w-64 hidden md:block", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {visibleNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2 h-10",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                  )}
                  asChild
                >
                  <SmoothLink to={item.href}>
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </SmoothLink>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Sidebar);
