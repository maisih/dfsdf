import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Clock, User, DollarSign, Calendar, MessageCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AddTaskDialog from "@/components/dialogs/AddTaskDialog";
import EditTaskDialog from "@/components/dialogs/EditTaskDialog";
import DeleteTaskDialog from "@/components/dialogs/DeleteTaskDialog";
import UpdateTaskCostDialog from "@/components/dialogs/UpdateTaskCostDialog";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Tasks = () => {
  const { selectedProject } = useProject();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const handleStatusChange = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Task marked as ${newStatus.replace('_', ' ')}!`,
      });

      loadTasks(); // Refresh the tasks list
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
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
              <h1 className="text-3xl font-bold text-foreground">Tasks & Costs</h1>
              <p className="text-muted-foreground">Track construction tasks and their associated costs</p>
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
                      onCheckedChange={() => handleStatusChange(task.id, task.status)}
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
                         
                         <div className="flex items-center gap-1">
                           <DollarSign className="h-4 w-4" />
                           <span className="font-medium text-primary">
                             Cost: {task.cost ? `${task.cost} MAD` : 'No cost set'}
                           </span>
                         </div>
                       </div>
                      
                       <div className="flex gap-2 flex-wrap">
                          <EditTaskDialog task={task} onTaskUpdated={loadTasks} />
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Comments
                          </Button>
                          <UpdateTaskCostDialog task={task} onTaskUpdated={loadTasks} />
                          <DeleteTaskDialog 
                            taskId={task.id} 
                            taskTitle={task.title} 
                            onTaskDeleted={loadTasks} 
                          />
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