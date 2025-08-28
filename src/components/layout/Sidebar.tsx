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
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

const navigation = [
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
    name: "Daily Logs",
    icon: ClipboardList,
    href: "/logs",
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
  }
];

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigation.map((item) => {
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
                  <Link to={item.href}>
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;