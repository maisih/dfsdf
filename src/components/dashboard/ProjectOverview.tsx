import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";

const ProjectOverview = () => {
  const { selectedProject } = useProject();
  const navigate = useNavigate();

  if (!selectedProject) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">No project selected</p>
          <Button onClick={() => navigate('/projects')}>
            View All Projects
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "on-hold":
        return "bg-warning/10 text-warning border-warning/20";
      case "completed":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const budgetUtilization = selectedProject.budget 
    ? Math.round(((selectedProject.spent || 0) / selectedProject.budget) * 100)
    : 0;

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{selectedProject.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{selectedProject.location}</span>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(selectedProject.status || 'planning')}>
            {selectedProject.status || 'Planning'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{selectedProject.progress || 0}%</span>
          </div>
          <Progress value={selectedProject.progress || 0} className="h-2" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Timeline</span>
            </div>
            <div className="text-xs">
              <div>Start: {selectedProject.start_date || 'Not set'}</div>
              <div>End: {selectedProject.end_date || 'Not set'}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Budget</span>
            </div>
            <div className="text-xs">
              <div>Total: {selectedProject.budget ? `${selectedProject.budget.toLocaleString()} MAD` : 'Not set'}</div>
              <div>Spent: {selectedProject.spent ? `${selectedProject.spent.toLocaleString()} MAD` : '0 MAD'}</div>
            </div>
          </div>
        </div>

        {/* Budget Utilization */}
        {selectedProject.budget && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Budget Utilization</span>
              <span className="text-sm text-muted-foreground">{budgetUtilization}%</span>
            </div>
            <Progress value={budgetUtilization} className="h-2" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={() => navigate('/tasks')}>
            View Tasks
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/schedule')}>
            Schedule
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/budget')}>
            Budget
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectOverview;