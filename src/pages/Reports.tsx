import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, Calendar, TrendingUp, FileText, PieChart, Plus, Eye, Settings, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AddReportDialog from "@/components/dialogs/AddReportDialog";
import { useProject } from "@/contexts/ProjectContext";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { selectedProject } = useProject();
  const [reports, setReports] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const handleReportAdded = (newReport: any) => {
    setReports([...reports, newReport]);
  };

  const handleDownload = (report: any) => {
    // Simulate file download
    toast({
      title: "Download Started",
      description: `Downloading ${report.title}...`,
    });
    
    // In a real app, this would trigger an actual file download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${report.title} has been downloaded successfully.`,
      });
    }, 2000);
  };

  const handleGenerateNow = (report: any) => {
    toast({
      title: "Report Generation Started",
      description: `Generating ${report.title}. This may take a few minutes.`,
    });
    
    // In a real app, this would trigger report generation
    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: `${report.title} has been generated and is ready for download.`,
      });
    }, 3000);
  };

  const handleViewPreview = (report: any) => {
    toast({
      title: "Opening Preview",
      description: `Loading preview for ${report.title}...`,
    });
  };

  const handleSettings = (report: any) => {
    toast({
      title: "Report Settings",
      description: `Opening settings for ${report.title}...`,
    });
  };

  const handleScheduleReport = () => {
    toast({
      title: "Schedule Report",
      description: "Opening report scheduling interface...",
    });
  };

  const aiOptimization = useMemo(() => {
    if (!selectedProject) return null;
    try {
      const raw = localStorage.getItem(`ai_cost_optimization:${selectedProject.id}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [selectedProject]);

  const exportAICostOptimization = () => {
    if (!aiOptimization) return;
    const { projectName, generatedAt, optimization, costMetrics } = aiOptimization;
    const md = `# AI Cost Optimization Report\n\nProject: ${projectName}\nGenerated: ${new Date(generatedAt).toLocaleString()}\n\n## Summary Metrics\n- Total Budget: ${costMetrics.totalBudget}\n- Spent: ${costMetrics.spent}\n- Remaining: ${costMetrics.remaining}\n- Projected Overrun: ${costMetrics.projectedOverrun}\n\n## Recommendations\n\n${optimization}`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const nameSafe = (projectName || 'project').replace(/[^a-z0-9-_]/gi, '_');
    a.download = `AI_Cost_Optimization_${nameSafe}_${new Date(generatedAt).toISOString().slice(0,10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-success/10 text-success border-success/20";
      case "Generating":
        return "bg-primary/10 text-primary border-primary/20";
      case "Scheduled":
        return "bg-warning/10 text-warning border-warning/20";
      case "Overdue":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Financial":
        return "bg-green-100 text-green-800 border-green-200";
      case "Safety":
        return "bg-red-100 text-red-800 border-red-200";
      case "Inventory":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Labor":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Progress":
        return <TrendingUp className="h-4 w-4" />;
      case "Financial":
        return <BarChart3 className="h-4 w-4" />;
      case "Safety":
        return <FileText className="h-4 w-4" />;
      case "Inventory":
        return <PieChart className="h-4 w-4" />;
      case "Labor":
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <div className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-surface border-r border-border shadow-soft overflow-y-auto">
          <Sidebar />
        </div>
        <main className="flex-1 md:ml-64 ml-0 p-4 md:p-6 pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reports</h1>
              <p className="text-muted-foreground">Generate and manage project reports</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" onClick={handleScheduleReport}>
                <Clock className="h-4 w-4 mr-1" />
                Schedule Report
              </Button>
              <Button variant="outline" className="gap-2" onClick={exportAICostOptimization} disabled={!aiOptimization}>
                <Download className="h-4 w-4" />
                Export AI Cost Optimization
              </Button>
              <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4" />
                Create Report
              </Button>
            </div>
          </div>

          {!selectedProject ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Project Selected</h2>
              <p className="text-muted-foreground">Please select a project to manage reports</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Reports Created</h2>
              <p className="text-muted-foreground mb-4">Create your first report to get started</p>
              <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4" />
                Create Report
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {reports.map((report) => (
              <Card key={report.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getTypeIcon(report.type)}
                        {report.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline" className={getTypeColor(report.type)}>
                        {report.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Frequency</span>
                      <p className="font-medium">{report.frequency}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <span className="text-sm text-muted-foreground">Last Generated</span>
                        <p className="font-medium">{report.lastGenerated}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <span className="text-sm text-muted-foreground">Next Scheduled</span>
                        <p className={`font-medium ${report.status === 'Overdue' ? 'text-destructive' : ''}`}>
                          {report.nextScheduled}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">File Size</span>
                      <p className="font-medium">{report.size}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground">Projects: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {report.projects.map((project, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {project}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {report.status === "Available" && "Ready for download"}
                      {report.status === "Generating" && "Report generation in progress..."}
                      {report.status === "Scheduled" && "Scheduled for automatic generation"}
                      {report.status === "Overdue" && "Report generation is overdue"}
                    </div>
                    
                    <div className="flex gap-2">
                      {report.status === "Available" && (
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => handleDownload(report)}>
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleViewPreview(report)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Preview
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleGenerateNow(report)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Now
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleSettings(report)}>
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </div>
                  </div>
                  
                  {report.status === "Overdue" && (
                    <div className="mt-4 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Overdue:</span>
                        <span>This report should have been generated on {report.nextScheduled}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              ))}
            </div>
          )}
          <AddReportDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            onReportAdded={handleReportAdded}
          />
        </main>
      </div>
    </div>
  );
};

export default Reports;
