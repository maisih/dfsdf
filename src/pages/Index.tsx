import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import ProjectProgress from "@/components/dashboard/ProjectProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ProjectOverview from "@/components/dashboard/ProjectOverview";
import QuickActions from "@/components/dashboard/QuickActions";
import LiveUpdates from "@/components/dashboard/LiveUpdates";
import { Building2, Users, Clock, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import constructionHero from "@/assets/construction-hero.jpg";
import WeatherWidget from "@/components/weather/WeatherWidget";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { selectedProject } = useProject();
  const [stats, setStats] = useState({
    activeProjects: 0,
    teamMembers: 0,
    openTasks: 0,
    safetyDays: 0,
    budgetUtilization: 0,
    schedulePerformance: 0
  });

  useEffect(() => {
    if (selectedProject) {
      loadProjectStats();
    } else {
      // Reset stats when no project is selected
      setStats({
        activeProjects: 0,
        teamMembers: 0,
        openTasks: 0,
        safetyDays: 0,
        budgetUtilization: 0,
        schedulePerformance: 0
      });
    }
  }, [selectedProject]);

  const loadProjectStats = async () => {
    if (!selectedProject) return;

    try {
      // Load team members count
      const { data: teamData } = await supabase
        .from('team_members')
        .select('id')
        .eq('project_id', selectedProject.id);

      // Load open tasks count
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('id')
        .eq('project_id', selectedProject.id)
        .neq('status', 'completed');

      // Load expenses for budget calculation
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('amount')
        .eq('project_id', selectedProject.id);

      const totalSpent = expensesData?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
      const budgetUtilization = selectedProject.budget > 0 ? Math.round((totalSpent / selectedProject.budget) * 100) : 0;

      setStats({
        activeProjects: 1, // Current selected project
        teamMembers: teamData?.length || 0,
        openTasks: tasksData?.length || 0,
        safetyDays: 30, // Static for now
        budgetUtilization,
        schedulePerformance: selectedProject.progress || 0
      });
    } catch (error) {
      console.error('Error loading project stats:', error);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-surface border-r border-border shadow-soft overflow-y-auto">
          <Sidebar />
        </div>
        
        <main className="flex-1 ml-64 p-6 space-y-6">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-primary shadow-medium">
            <div className="absolute inset-0 bg-black/20"></div>
            <img 
              src={constructionHero} 
              alt="Construction site overview" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
            <div className="relative p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">
                {selectedProject ? `${selectedProject.name} Dashboard` : 'Welcome to SiteFlow Master'}
              </h1>
              <p className="text-xl opacity-90 mb-4">
                {selectedProject 
                  ? `${selectedProject.location || 'Project location'} - ${selectedProject.description || 'Construction project'}`
                  : 'Your comprehensive construction project management platform'
                }
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{selectedProject ? 'Selected Project' : 'No Project Selected'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{stats.teamMembers} Team Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>{stats.schedulePerformance}% Progress</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Selected Project"
              value={selectedProject ? "1" : "0"}
              change={selectedProject ? selectedProject.name : "Select a project"}
              changeType="positive"
              icon={Building2}
              description={selectedProject ? selectedProject.status : "No project selected"}
            />
            <StatsCard
              title="Team Members"
              value={stats.teamMembers.toString()}
              change={`${stats.teamMembers > 0 ? 'Active' : 'No'} members`}
              changeType="positive"
              icon={Users}
              description="In this project"
            />
            <StatsCard
              title="Open Tasks"
              value={stats.openTasks.toString()}
              change={`${stats.openTasks} pending`}
              changeType={stats.openTasks > 10 ? "negative" : "positive"}
              icon={CheckCircle}
              description="Active tasks"
            />
            <StatsCard
              title="Safety Days"
              value={stats.safetyDays.toString()}
              change="No incidents"
              changeType="positive"
              icon={AlertTriangle}
              description="Days without incidents"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1">
              <ProjectProgress />
            </div>
            <div className="xl:col-span-1">
              <RecentActivity />
            </div>
            <div className="xl:col-span-1">
              <WeatherWidget />
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <ProjectOverview />
            <QuickActions />
            <LiveUpdates />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Budget Utilization"
              value={`${stats.budgetUtilization}%`}
              change={selectedProject?.budget ? `${(selectedProject.spent || 0).toLocaleString()} MAD of ${selectedProject.budget.toLocaleString()} MAD` : "No budget set"}
              changeType={stats.budgetUtilization > 80 ? "negative" : "positive"}
              icon={TrendingUp}
              description="Project budget usage"
            />
            <StatsCard
              title="Schedule Performance"
              value={`${stats.schedulePerformance}%`}
              change="Project progress"
              changeType={stats.schedulePerformance > 75 ? "positive" : "negative"}
              icon={Clock}
              description="Completion status"
            />
            <StatsCard
              title="Project Status"
              value={selectedProject?.status || "N/A"}
              change={selectedProject ? "Active project" : "No project selected"}
              changeType="positive"
              icon={CheckCircle}
              description={selectedProject ? "Current status" : "Select a project to begin"}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
