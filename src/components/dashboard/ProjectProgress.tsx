import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const projects = [
  {
    name: "Downtown Office Complex",
    progress: 75,
    status: "On Track",
    dueDate: "Dec 2024",
    budget: "$2.4M"
  },
  {
    name: "Residential Tower Phase 2",
    progress: 45,
    status: "Behind",
    dueDate: "Mar 2025",
    budget: "$1.8M"
  },
  {
    name: "Industrial Warehouse",
    progress: 90,
    status: "Ahead",
    dueDate: "Nov 2024",
    budget: "$850K"
  },
  {
    name: "Shopping Center Renovation",
    progress: 60,
    status: "On Track",
    dueDate: "Feb 2025",
    budget: "$1.2M"
  }
];

const ProjectProgress = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ahead":
        return "text-success";
      case "Behind":
        return "text-destructive";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Active Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-foreground">{project.name}</h4>
                <p className="text-sm text-muted-foreground">Due: {project.dueDate}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </p>
                <p className="text-sm text-muted-foreground">{project.budget}</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectProgress;