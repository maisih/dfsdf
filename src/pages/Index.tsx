import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import ProjectProgress from "@/components/dashboard/ProjectProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Building2, Users, Clock, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import constructionHero from "@/assets/construction-hero.jpg";

const Index = () => {
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
              <h1 className="text-3xl font-bold mb-2">Welcome to SiteFlow Master</h1>
              <p className="text-xl opacity-90 mb-4">Your comprehensive construction project management platform</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>4 Active Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>127 Team Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>89% On-Time Completion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Active Projects"
              value="4"
              change="+1 this month"
              changeType="positive"
              icon={Building2}
              description="2 ahead of schedule"
            />
            <StatsCard
              title="Team Members"
              value="127"
              change="+12 this week"
              changeType="positive"
              icon={Users}
              description="Across all projects"
            />
            <StatsCard
              title="Open Tasks"
              value="43"
              change="-8 today"
              changeType="positive"
              icon={CheckCircle}
              description="15 high priority"
            />
            <StatsCard
              title="Safety Incidents"
              value="0"
              change="30 days streak"
              changeType="positive"
              icon={AlertTriangle}
              description="Last incident: None"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectProgress />
            <RecentActivity />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Budget Utilization"
              value="67%"
              change="On target"
              changeType="positive"
              icon={TrendingUp}
              description="$4.2M of $6.25M"
            />
            <StatsCard
              title="Schedule Performance"
              value="89%"
              change="+2% this month"
              changeType="positive"
              icon={Clock}
              description="Ahead of baseline"
            />
            <StatsCard
              title="Quality Inspections"
              value="98%"
              change="Pass rate"
              changeType="positive"
              icon={CheckCircle}
              description="142 completed this month"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
