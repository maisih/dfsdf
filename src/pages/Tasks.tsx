import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Clock, User, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AddTaskDialog from "@/components/dialogs/AddTaskDialog";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Tasks = () => {
  const { selectedProject } = useProject();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [selectedProject]);

  const loadTasks = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', selectedProject.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "in_progress":
        return "bg-primary/10 text-primary border-primary/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4:
      case 3:
        return "bg-destructive/10 text-destructive border-destructive/20";
      case 2:
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 4: return "Critical";
      case 3: return "High";
      case 2: return "Medium";
      case 1: return "Low";
      default: return "Unknown";
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
            <AddTaskDialog />
          </div>

          {!selectedProject ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please select a project to view tasks</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks found for this project</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
              <Card key={task.id} className={`shadow-soft hover:shadow-medium transition-all duration-300 ${task.status === 'completed' ? 'opacity-75' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox 
                      checked={task.status === 'completed'}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title}
                        </h3>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <span className="font-medium text-foreground">{selectedProject.name}</span>
                        
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {task.assigned_to || 'Unassigned'}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                        </div>
                      </div>
                      
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
          )}
        </main>
      </div>
    </div>
  );
};

export default Tasks;