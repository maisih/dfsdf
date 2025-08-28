import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, TrendingUp, Target, Users, Clock, MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Schedule = () => {
  const { selectedProject, loadProjects } = useProject();
  const [budgetUsed, setBudgetUsed] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [newProgress, setNewProgress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [teamMembers] = useState([
    { id: 1, name: "Ahmed El Mansouri", profession: "Site Manager", phone: "+212 661 234 567" },
    { id: 2, name: "Fatima Benali", profession: "Civil Engineer", phone: "+212 662 345 678" },
    { id: 3, name: "Youssef Alami", profession: "Safety Officer", phone: "+212 663 456 789" },
    { id: 4, name: "Zineb Hakim", profession: "Quality Control", phone: "+212 664 567 890" },
    { id: 5, name: "Omar Benjelloun", profession: "Equipment Operator", phone: "+212 665 678 901" }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedProject) {
      calculateProgress();
      loadUpcomingTasks();
    }
  }, [selectedProject]);

  const loadUpcomingTasks = async () => {
    if (!selectedProject) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', selectedProject.id)
        .neq('status', 'completed')
        .order('due_date', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      setUpcomingTasks(data || []);
    } catch (error) {
      console.error('Error loading upcoming tasks:', error);
    }
  };

  const calculateProgress = async () => {
    if (!selectedProject || !selectedProject.budget) return;

    try {
      // Get total expenses for this project
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('amount')
        .eq('project_id', selectedProject.id);

      if (error) throw error;

      const totalSpent = expenses?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
      setBudgetUsed(totalSpent);
      
      // Calculate progress percentage based on budget usage
      const percentage = selectedProject.budget > 0 ? Math.min((totalSpent / selectedProject.budget) * 100, 100) : 0;
      setProgressPercentage(Math.round(percentage));
    } catch (error) {
      console.error('Error calculating progress:', error);
    }
  };

  const updateProjectProgress = async () => {
    if (!selectedProject || !newProgress) return;

    setIsLoading(true);
    try {
      const progressValue = parseInt(newProgress);
      
      const { error } = await supabase
        .from('projects')
        .update({ 
          progress: progressValue,
          spent: budgetUsed
        })
        .eq('id', selectedProject.id);

      if (error) throw error;

      await loadProjects();
      
      toast({
        title: "Progress Updated",
        description: `Project progress updated to ${progressValue}%`,
      });
      
      setNewProgress('');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update project progress.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return "bg-success";
    if (percentage < 70) return "bg-warning";
    return "bg-destructive";
  };

  const getStatusText = (percentage: number) => {
    if (percentage < 25) return "On Track";
    if (percentage < 50) return "Progressing";
    if (percentage < 75) return "Advanced";
    return "Near Completion";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Schedule & Progress</h1>
              <p className="text-muted-foreground">Track project progress, upcoming activities, and team</p>
            </div>
          </div>

          {!selectedProject ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please select a project to view progress</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {/* Project Overview Card */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {selectedProject.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{progressPercentage}%</div>
                      <p className="text-sm text-muted-foreground">Budget Used</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {selectedProject.progress || 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">Project Progress</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium text-muted-foreground">
                        {getStatusText(selectedProject.progress || 0)}
                      </div>
                      <p className="text-sm text-muted-foreground">Status</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Project Progress</span>
                      <span>{selectedProject.progress || 0}%</span>
                    </div>
                    <Progress 
                      value={selectedProject.progress || 0} 
                      className="h-3" 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Budget Analysis Card */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Budget Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Budget:</span>
                        <span className="font-semibold">
                          {selectedProject.budget?.toLocaleString() || '0'} MAD
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Spent:</span>
                        <span className="font-semibold">
                          {budgetUsed.toLocaleString()} MAD
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remaining:</span>
                        <span className="font-semibold">
                          {selectedProject.budget 
                            ? (selectedProject.budget - budgetUsed).toLocaleString()
                            : '0'
                          } MAD
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Budget Utilization</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        className={`h-3 ${getProgressColor(progressPercentage)}`}
                      />
                      <p className="text-xs text-muted-foreground">
                        Based on recorded expenses
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Update Progress Card */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Update Project Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label htmlFor="progress">Progress Percentage (0-100)</Label>
                      <Input
                        id="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={newProgress}
                        onChange={(e) => setNewProgress(e.target.value)}
                        placeholder="Enter progress percentage"
                      />
                    </div>
                    <Button 
                      onClick={updateProjectProgress}
                      disabled={!newProgress || isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Progress"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Manually set the project completion percentage
                  </p>
                </CardContent>
              </Card>

              {/* Upcoming Activities */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Upcoming Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingTasks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No upcoming activities scheduled</p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-foreground">
                              {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {task.assigned_to || 'Unassigned'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Team Section */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Project Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.profession}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              {member.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Schedule;