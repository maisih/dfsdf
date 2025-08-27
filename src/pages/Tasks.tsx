import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Clock, User, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const tasks = [
  {
    id: 1,
    title: "Complete concrete pour for foundation",
    description: "Pour concrete for the east wing foundation according to specifications",
    project: "Downtown Office Complex",
    assignee: "John Smith",
    priority: "High",
    status: "In Progress",
    dueDate: "Nov 30, 2024",
    completed: false
  },
  {
    id: 2,
    title: "Install electrical conduits",
    description: "Run electrical conduits through structural framework",
    project: "Residential Tower Phase 2",
    assignee: "Mike Johnson",
    priority: "Medium",
    status: "Pending",
    dueDate: "Dec 5, 2024",
    completed: false
  },
  {
    id: 3,
    title: "Quality inspection checkpoint",
    description: "Conduct safety and quality inspection of completed work",
    project: "Industrial Warehouse",
    assignee: "Sarah Wilson",
    priority: "High",
    status: "Overdue",
    dueDate: "Nov 25, 2024",
    completed: false
  },
  {
    id: 4,
    title: "Material delivery coordination",
    description: "Coordinate delivery of steel beams and check specifications",
    project: "Shopping Center Renovation",
    assignee: "Alex Brown",
    priority: "Low",
    status: "Completed",
    dueDate: "Nov 20, 2024",
    completed: true
  }
];

const Tasks = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success border-success/20";
      case "In Progress":
        return "bg-primary/10 text-primary border-primary/20";
      case "Overdue":
        return "bg-destructive/10 text-destructive border-destructive/20";
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
              <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
              <p className="text-muted-foreground">Manage project tasks and assignments</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>

          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className={`shadow-soft hover:shadow-medium transition-all duration-300 ${task.completed ? 'opacity-75' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox 
                      checked={task.completed}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title}
                        </h3>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <span className="font-medium text-foreground">{task.project}</span>
                        
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {task.assignee}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Due: {task.dueDate}
                        </div>
                      </div>
                      
                      {task.status === "Overdue" && (
                        <div className="flex items-center gap-2 text-sm text-destructive mb-3">
                          <AlertCircle className="h-4 w-4" />
                          <span>This task is overdue and requires immediate attention</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Comments</Button>
                        <Button variant="outline" size="sm">Attach Files</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;