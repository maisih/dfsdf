import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, Calendar, TrendingUp, FileText, PieChart } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const reports = [
  {
    id: 1,
    title: "Weekly Progress Report",
    description: "Comprehensive weekly progress overview for all active projects",
    type: "Progress",
    frequency: "Weekly",
    lastGenerated: "Nov 25, 2024",
    nextScheduled: "Dec 2, 2024",
    status: "Available",
    projects: ["Downtown Office Complex", "Residential Tower Phase 2"],
    size: "2.4 MB"
  },
  {
    id: 2,
    title: "Budget Analysis Report",
    description: "Financial performance and budget utilization across all projects",
    type: "Financial",
    frequency: "Monthly",
    lastGenerated: "Nov 1, 2024",
    nextScheduled: "Dec 1, 2024",
    status: "Generating",
    projects: ["All Projects"],
    size: "1.8 MB"
  },
  {
    id: 3,
    title: "Safety Inspection Summary",
    description: "Safety compliance and incident reports for the past month",
    type: "Safety",
    frequency: "Monthly",
    lastGenerated: "Nov 20, 2024",
    nextScheduled: "Dec 20, 2024",
    status: "Available",
    projects: ["Industrial Warehouse", "Shopping Center Renovation"],
    size: "950 KB"
  },
  {
    id: 4,
    title: "Material Usage Report",
    description: "Material consumption and inventory levels analysis",
    type: "Inventory",
    frequency: "Bi-weekly",
    lastGenerated: "Nov 15, 2024",
    nextScheduled: "Nov 29, 2024",
    status: "Overdue",
    projects: ["All Projects"],
    size: "1.2 MB"
  },
  {
    id: 5,
    title: "Labor Productivity Analysis",
    description: "Workforce efficiency and productivity metrics",
    type: "Labor",
    frequency: "Monthly",
    lastGenerated: "Oct 30, 2024",
    nextScheduled: "Nov 30, 2024",
    status: "Scheduled",
    projects: ["Downtown Office Complex", "Industrial Warehouse"],
    size: "3.1 MB"
  }
];

const Reports = () => {
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
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reports</h1>
              <p className="text-muted-foreground">Generate and manage project reports</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Schedule Report</Button>
              <Button>Custom Report</Button>
            </div>
          </div>

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
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      )}
                      <Button variant="outline" size="sm">View Preview</Button>
                      <Button variant="outline" size="sm">Generate Now</Button>
                      <Button variant="outline" size="sm">Settings</Button>
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
        </main>
      </div>
    </div>
  );
};

export default Reports;