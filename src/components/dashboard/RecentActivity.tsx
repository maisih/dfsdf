import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "/avatars/02.png",
    initials: "SJ",
    action: "completed task",
    item: "Foundation inspection",
    project: "Downtown Office Complex",
    time: "2 hours ago",
    type: "completion"
  },
  {
    id: 2,
    user: "Mike Chen",
    avatar: "/avatars/03.png", 
    initials: "MC",
    action: "submitted RFI",
    item: "#RFI-2024-045",
    project: "Residential Tower Phase 2",
    time: "4 hours ago",
    type: "rfi"
  },
  {
    id: 3,
    user: "Alex Rodriguez",
    avatar: "/avatars/04.png",
    initials: "AR",
    action: "updated daily log",
    item: "Weather delay reported",
    project: "Industrial Warehouse",
    time: "6 hours ago",
    type: "log"
  },
  {
    id: 4,
    user: "Emily Davis",
    avatar: "/avatars/05.png",
    initials: "ED",
    action: "approved material request",
    item: "Concrete delivery MR-2024-012",
    project: "Shopping Center Renovation",
    time: "1 day ago",
    type: "approval"
  },
  {
    id: 5,
    user: "Tom Wilson",
    avatar: "/avatars/06.png",
    initials: "TW",
    action: "uploaded photos",
    item: "Progress documentation",
    project: "Downtown Office Complex",
    time: "1 day ago",
    type: "photo"
  }
];

const RecentActivity = () => {
  const getActivityBadge = (type: string) => {
    switch (type) {
      case "completion":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Complete</Badge>;
      case "rfi":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">RFI</Badge>;
      case "log":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Log</Badge>;
      case "approval":
        return <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">Approved</Badge>;
      case "photo":
        return <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/20">Photo</Badge>;
      default:
        return <Badge variant="outline">Activity</Badge>;
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.avatar} alt={activity.user} />
              <AvatarFallback className="text-xs">{activity.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {activity.user} {activity.action}
                </p>
                {getActivityBadge(activity.type)}
              </div>
              <p className="text-sm text-muted-foreground">{activity.item}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{activity.project}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;