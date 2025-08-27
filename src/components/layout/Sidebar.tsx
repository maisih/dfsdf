import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  CheckSquare,
  ClipboardList,
  Clock,
  Package,
  Wrench,
  MessageCircle,
  Camera,
  DollarSign,
  BarChart3,
  Shield,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    current: true
  },
  {
    name: "Projects",
    icon: FolderOpen,
    href: "/projects",
    current: false
  },
  {
    name: "Schedule",
    icon: Calendar,
    href: "/schedule",
    current: false
  },
  {
    name: "Tasks",
    icon: CheckSquare,
    href: "/tasks",
    current: false
  },
  {
    name: "Daily Logs",
    icon: ClipboardList,
    href: "/logs",
    current: false
  },
  {
    name: "Timesheets",
    icon: Clock,
    href: "/timesheets",
    current: false
  },
  {
    name: "Materials",
    icon: Package,
    href: "/materials",
    current: false
  },
  {
    name: "Equipment",
    icon: Wrench,
    href: "/equipment",
    current: false
  },
  {
    name: "RFIs",
    icon: MessageCircle,
    href: "/rfis",
    current: false
  },
  {
    name: "Photos",
    icon: Camera,
    href: "/photos",
    current: false
  },
  {
    name: "Budget",
    icon: DollarSign,
    href: "/budget",
    current: false
  },
  {
    name: "Reports",
    icon: BarChart3,
    href: "/reports",
    current: false
  },
  {
    name: "Quality",
    icon: Shield,
    href: "/quality",
    current: false
  },
  {
    name: "Documents",
    icon: FileText,
    href: "/documents",
    current: false
  }
];

const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={item.current ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 h-10",
                  item.current && "bg-primary/10 text-primary hover:bg-primary/15"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;