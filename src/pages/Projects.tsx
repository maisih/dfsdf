import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, MapPin, Calendar, DollarSign } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AddProjectDialog from "@/components/dialogs/AddProjectDialog";
import EditProjectDialog from "@/components/dialogs/EditProjectDialog";
import { useProject } from "@/contexts/ProjectContext";

const projects = [
  {
    id: 1,
    name: "Downtown Office Complex",
    location: "New York, NY",
    progress: 75,
    status: "On Track",
    budget: "$2.4M",
    spent: "$1.8M",
    startDate: "Jan 2024",
    endDate: "Dec 2024",
    manager: "Sarah Johnson"
  },
  {
    id: 2,
    name: "Residential Tower Phase 2",
    location: "Los Angeles, CA",
    progress: 45,
    status: "Behind",
    budget: "$1.8M",
    spent: "$950K",
    startDate: "Feb 2024",
    endDate: "Mar 2025",
    manager: "Mike Chen"
  },
  {
    id: 3,
    name: "Industrial Warehouse",
    location: "Chicago, IL",
    progress: 90,
    status: "Ahead",
    budget: "$850K",
    spent: "$720K",
    startDate: "Nov 2023",
    endDate: "Nov 2024",
    manager: "Alex Rodriguez"
  },
  {
    id: 4,
    name: "Shopping Center Renovation",
    location: "Miami, FL",
    progress: 60,
    status: "On Track",
    budget: "$1.2M",
    spent: "$650K",
    startDate: "Dec 2023",
    endDate: "Feb 2025",
    manager: "Emily Davis"
  }
];

const Projects = () => {
  const { projects } = useProject();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ahead":
        return "bg-success/10 text-success border-success/20";
      case "Behind":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
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
              <h1 className="text-3xl font-bold text-foreground">Projects</h1>
              <p className="text-muted-foreground">Manage all construction projects</p>
            </div>
            <AddProjectDialog />
          </div>

          <div className="grid gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {project.location || 'No location'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {project.start_date} - {project.end_date}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(project.status || 'planning')}>
                      {project.status || 'Planning'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        Budget Overview
                      </div>
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Budget:</span>
                          <span className="font-medium">{project.budget ? `${project.budget.toLocaleString()} MAD` : 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spent:</span>
                          <span className="font-medium">{project.spent ? `${project.spent.toLocaleString()} MAD` : '0 MAD'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Project Manager</div>
                      <div className="font-medium">{project.created_by || 'Unassigned'}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <EditProjectDialog project={project} />
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

export default Projects;