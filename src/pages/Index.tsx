import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, Calendar, DollarSign, Target, AlertTriangle } from "lucide-react";
import constructionHero from "@/assets/construction-hero.jpg";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import WeatherWidget from "@/components/weather/WeatherWidget";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ProjectOverview from "@/components/dashboard/ProjectOverview";
import AIInsights from "@/components/dashboard/AIInsights";

const Index = () => {
  const { selectedProject } = useProject();
  const [stats, setStats] = useState({
    teamMembers: 0,
    openTasks: 0,
    budgetUtilization: 0,
    totalExpenses: 0
  });
  const [activeTasks, setActiveTasks] = useState<any[]>([]);

  useEffect(() => {
    if (selectedProject) {
      loadProjectStats();
      loadActiveTasks();
    } else {
      setStats({
        teamMembers: 0,
        openTasks: 0,
        budgetUtilization: 0,
        totalExpenses: 0
      });
      setActiveTasks([]);
    }
  }, [selectedProject]);

  const loadActiveTasks = async () => {
    if (!selectedProject) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', selectedProject.id)
        .in('status', ['in-progress', 'pending'])
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      setActiveTasks(data || []);
    } catch (error) {
      console.error('Error loading active tasks:', error);
    }
  };

  const loadProjectStats = async () => {
    if (!selectedProject) return;

    try {
      // Load team members count
      const [teamRes, tasksRes, expensesRes, materialsRes, taskCostsRes] = await Promise.all([
        supabase.from('team_members').select('id').eq('project_id', selectedProject.id),
        supabase.from('tasks').select('id').eq('project_id', selectedProject.id).neq('status', 'completed'),
        supabase.from('expenses').select('amount').eq('project_id', selectedProject.id),
        supabase.from('materials').select('quantity, unit_cost').eq('project_id', selectedProject.id),
        supabase.from('tasks').select('cost').eq('project_id', selectedProject.id).not('cost', 'is', null)
      ]);

      const teamData = teamRes.data;
      const tasksData = tasksRes.data;
      const expensesData = expensesRes.data;
      const materialsData = materialsRes.data;
      const taskCostsData = taskCostsRes.data;

      const totalExpenses = expensesData?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
      const totalMaterialsCost = materialsData?.reduce((sum, material) => {
        const materialCost = (material.quantity || 0) * (material.unit_cost || 0);
        return sum + materialCost;
      }, 0) || 0;
      const totalTaskCosts = taskCostsData?.reduce((sum, task) => sum + (task.cost || 0), 0) || 0;

      const totalSpent = totalExpenses + totalMaterialsCost + totalTaskCosts;
      const budgetUtilization = selectedProject.budget > 0 ? Math.round((totalSpent / selectedProject.budget) * 100) : 0;

      setStats({
        teamMembers: teamData?.length || 0,
        openTasks: tasksData?.length || 0,
        budgetUtilization,
        totalExpenses: totalSpent
      });
    } catch (error) {
      console.error('Error loading project stats:', error);
    }
  };

  const getDaysUntilDeadline = () => {
    if (!selectedProject?.end_date) return null;
    const endDate = new Date(selectedProject.end_date);
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const getDeadlineStatus = (days: number | null) => {
    if (days === null) return 'No deadline set';
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days === 0) return 'Due today';
    if (days <= 7) return `${days} days remaining`;
    return `${days} days remaining`;
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-surface border-r border-border shadow-soft overflow-y-auto">
          <Sidebar />
        </div>
        
        <main className="flex-1 ml-64 p-6 space-y-6">
          {!selectedProject ? (
            <div className="text-center py-20">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">No Project Selected</h2>
              <p className="text-muted-foreground">Please select a project to view the dashboard</p>
            </div>
          ) : (
            <>
              {/* Project Header */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-primary shadow-medium">
                <div className="absolute inset-0 bg-black/20"></div>
                <img
                  src={constructionHero}
                  alt="Construction site overview"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                  decoding="async"
                  fetchpriority="high"
                />
                <div className="relative p-8 text-white">
                  <h1 className="text-3xl font-bold mb-2">{selectedProject.name}</h1>
                  <p className="text-xl opacity-90 mb-4">
                    {selectedProject.location || 'Project location'} - {selectedProject.description || 'Construction project'}
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>Status: {selectedProject.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{stats.teamMembers} Team Members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span>{selectedProject.progress || 0}% Complete</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-soft">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Project Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-2">{selectedProject.progress || 0}%</div>
                    <Progress value={selectedProject.progress || 0} className="h-2" />
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Budget Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-2">{stats.budgetUtilization}%</div>
                    <div className="text-sm text-muted-foreground">
                      {stats.totalExpenses.toLocaleString()} MAD spent
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-2">{stats.openTasks}</div>
                    <div className="text-sm text-muted-foreground">In progress</div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Project Deadline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-2">
                      {getDaysUntilDeadline() !== null ? getDaysUntilDeadline() : 'N/A'}
                    </div>
                    <div className={`text-sm ${
                      getDaysUntilDeadline() !== null && getDaysUntilDeadline()! < 0 
                        ? 'text-destructive' 
                        : getDaysUntilDeadline() !== null && getDaysUntilDeadline()! <= 7 
                        ? 'text-warning' 
                        : 'text-muted-foreground'
                    }`}>
                      {getDeadlineStatus(getDaysUntilDeadline())}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weather and Budget Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeatherWidget />
                
                {/* Budget Breakdown */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Budget Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Budget</div>
                        <div className="text-2xl font-bold text-foreground">
                          {selectedProject.budget?.toLocaleString() || '0'} MAD
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Spent</div>
                        <div className="text-2xl font-bold text-foreground">
                          {stats.totalExpenses.toLocaleString()} MAD
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Remaining</div>
                        <div className="text-2xl font-bold text-foreground">
                          {selectedProject.budget 
                            ? (selectedProject.budget - stats.totalExpenses).toLocaleString()
                            : '0'
                          } MAD
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={stats.budgetUtilization} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Tasks */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Current Working Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeTasks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No active tasks found</p>
                  ) : (
                    <div className="space-y-4">
                      {activeTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                          <div>
                            <h4 className="font-medium text-foreground">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-foreground capitalize">
                              {task.status.replace('_', ' ')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No deadline'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Timeline */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Project Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground">Start Date</div>
                      <div className="text-lg font-semibold text-foreground">
                        {selectedProject.start_date 
                          ? new Date(selectedProject.start_date).toLocaleDateString()
                          : 'Not set'
                        }
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Expected End Date</div>
                      <div className={`text-lg font-semibold ${
                        getDaysUntilDeadline() !== null && getDaysUntilDeadline()! < 0 
                          ? 'text-destructive' 
                          : 'text-foreground'
                      }`}>
                        {selectedProject.end_date 
                          ? new Date(selectedProject.end_date).toLocaleDateString()
                          : 'Not set'
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
