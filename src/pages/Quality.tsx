import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield, CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const qualityInspections = [
  {
    id: "QI-2024-087",
    title: "Concrete Foundation Inspection",
    project: "Downtown Office Complex",
    inspector: "Sarah Johnson",
    date: "Nov 27, 2024",
    type: "Structural",
    status: "Passed",
    score: 95,
    items: [
      { item: "Concrete mix quality", result: "Pass", notes: "Within specifications" },
      { item: "Reinforcement placement", result: "Pass", notes: "Proper spacing and coverage" },
      { item: "Surface finish", result: "Pass", notes: "Smooth finish achieved" },
      { item: "Dimensional accuracy", result: "Minor Issue", notes: "1/4\" deviation on north wall" }
    ]
  },
  {
    id: "QI-2024-086",
    title: "Steel Frame Installation Check",
    project: "Residential Tower Phase 2",
    inspector: "Mike Chen",
    date: "Nov 26, 2024",
    type: "Structural",
    status: "Failed",
    score: 72,
    items: [
      { item: "Bolt torque specifications", result: "Fail", notes: "Under-torqued bolts found on grid B-3" },
      { item: "Weld quality", result: "Pass", notes: "All welds meet AWS standards" },
      { item: "Alignment tolerance", result: "Pass", notes: "Within acceptable limits" },
      { item: "Material certificates", result: "Pass", notes: "All documentation complete" }
    ]
  },
  {
    id: "QI-2024-085",
    title: "Electrical Installation Inspection",
    project: "Industrial Warehouse",
    inspector: "Alex Rodriguez",
    date: "Nov 25, 2024",
    type: "MEP",
    status: "Conditional Pass",
    score: 88,
    items: [
      { item: "Conduit installation", result: "Pass", notes: "Proper routing and support" },
      { item: "Wire pulling", result: "Pass", notes: "No damage observed" },
      { item: "Panel connections", result: "Minor Issue", notes: "Tighten connections on panel B" },
      { item: "Grounding system", result: "Pass", notes: "Continuity verified" }
    ]
  },
  {
    id: "QI-2024-084",
    title: "HVAC Ductwork Quality Check",
    project: "Shopping Center Renovation",
    inspector: "Emily Davis",
    date: "Nov 24, 2024",
    type: "MEP",
    status: "Passed",
    score: 92,
    items: [
      { item: "Duct fabrication", result: "Pass", notes: "All joints properly sealed" },
      { item: "Support systems", result: "Pass", notes: "Adequate support installed" },
      { item: "Insulation", result: "Pass", notes: "No gaps or compression" },
      { item: "Access panels", result: "Pass", notes: "Properly located and sealed" }
    ]
  }
];

const Quality = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Passed":
        return "bg-success/10 text-success border-success/20";
      case "Failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Conditional Pass":
        return "bg-warning/10 text-warning border-warning/20";
      case "Pending":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Passed":
        return <CheckCircle className="h-4 w-4" />;
      case "Failed":
        return <XCircle className="h-4 w-4" />;
      case "Conditional Pass":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "Pass":
        return "text-success";
      case "Fail":
        return "text-destructive";
      case "Minor Issue":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "Pass":
        return <CheckCircle className="h-3 w-3 text-success" />;
      case "Fail":
        return <XCircle className="h-3 w-3 text-destructive" />;
      case "Minor Issue":
        return <AlertTriangle className="h-3 w-3 text-warning" />;
      default:
        return <Shield className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quality</h1>
              <p className="text-muted-foreground">Quality control and inspection management</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Quality Metrics</Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Inspection
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {qualityInspections.map((inspection) => (
              <Card key={inspection.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5 text-primary" />
                        {inspection.id}
                      </CardTitle>
                      <h3 className="text-xl font-semibold text-foreground mt-1">{inspection.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{inspection.project}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className={getStatusColor(inspection.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(inspection.status)}
                          {inspection.status}
                        </div>
                      </Badge>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">Score</span>
                        <p className={`text-lg font-bold ${getScoreColor(inspection.score)}`}>
                          {inspection.score}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <span className="text-sm text-muted-foreground">Inspector</span>
                      <p className="font-medium">{inspection.inspector}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Date</span>
                      <p className="font-medium">{inspection.date}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Type</span>
                      <p className="font-medium">{inspection.type}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Inspection Items</h4>
                    {inspection.items.map((item, index) => (
                      <div key={index} className="p-3 border border-border/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getResultIcon(item.result)}
                            <span className="font-medium">{item.item}</span>
                          </div>
                          <Badge variant="outline" className={`${getResultColor(item.result)} border-current/20`}>
                            {item.result}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground ml-5">{item.notes}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t mt-6">
                    <div className="text-sm text-muted-foreground">
                      {inspection.status === "Failed" && "Requires corrective action before proceeding"}
                      {inspection.status === "Conditional Pass" && "Minor issues need to be addressed"}
                      {inspection.status === "Passed" && "All quality requirements met"}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        Full Report
                      </Button>
                      {inspection.status === "Failed" && (
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          Schedule Re-inspection
                        </Button>
                      )}
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  {inspection.status === "Failed" && (
                    <div className="mt-4 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">Quality Issue:</span>
                        <span>Work must be corrected before proceeding to next phase</span>
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

export default Quality;