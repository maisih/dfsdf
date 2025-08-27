import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, AlertTriangle } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const scheduleItems = [
  {
    id: 1,
    task: "Foundation Excavation",
    project: "Downtown Office Complex",
    startDate: "Nov 25, 2024",
    endDate: "Nov 30, 2024",
    duration: "5 days",
    assigned: "Alpha Construction Crew",
    status: "In Progress",
    priority: "High"
  },
  {
    id: 2,
    task: "Structural Steel Installation",
    project: "Residential Tower Phase 2",
    startDate: "Dec 1, 2024",
    endDate: "Dec 15, 2024",
    duration: "14 days",
    assigned: "Steel Works Team",
    status: "Scheduled",
    priority: "Medium"
  },
  {
    id: 3,
    task: "Electrical Rough-in",
    project: "Industrial Warehouse",
    startDate: "Nov 28, 2024",
    endDate: "Dec 5, 2024",
    duration: "7 days",
    assigned: "Power Systems Inc",
    status: "At Risk",
    priority: "High"
  },
  {
    id: 4,
    task: "Interior Finishing",
    project: "Shopping Center Renovation",
    startDate: "Dec 10, 2024",
    endDate: "Dec 20, 2024",
    duration: "10 days",
    assigned: "Finish Masters",
    status: "Scheduled",
    priority: "Low"
  }
];

const Schedule = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-primary/10 text-primary border-primary/20";
      case "At Risk":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Completed":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Schedule</h1>
              <p className="text-muted-foreground">Project timeline and task scheduling</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Today</Button>
              <Button variant="outline">This Week</Button>
              <Button>This Month</Button>
            </div>
          </div>

          <div className="grid gap-4">
            {scheduleItems.map((item) => (
              <Card key={item.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{item.task}</h3>
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{item.project}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">Start:</span>
                          <span className="font-medium">{item.startDate}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">End:</span>
                          <span className="font-medium">{item.endDate}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{item.duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm mt-3">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span className="font-medium">{item.assigned}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Details</Button>
                    </div>
                  </div>
                  
                  {item.status === "At Risk" && (
                    <div className="mt-4 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Risk Alert:</span>
                        <span>Task may be delayed due to material delivery issues</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Schedule;