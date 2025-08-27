import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageCircle, Clock, User, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const rfis = [
  {
    id: "RFI-2024-045",
    title: "Structural Steel Connection Detail Clarification",
    project: "Residential Tower Phase 2",
    submittedBy: "Mike Chen",
    assignedTo: "Johnson Engineering",
    priority: "Medium",
    status: "Open",
    submittedDate: "Nov 25, 2024",
    dueDate: "Dec 2, 2024",
    description: "Need clarification on the connection detail between steel beam and column at grid line B-3. Drawing shows conflicting information.",
    category: "Structural",
    responses: 0
  },
  {
    id: "RFI-2024-044",
    title: "HVAC Duct Routing Conflict Resolution",
    project: "Downtown Office Complex",
    submittedBy: "Sarah Johnson",
    assignedTo: "MEP Consultants Inc",
    priority: "High",
    status: "Pending Response",
    submittedDate: "Nov 22, 2024",
    dueDate: "Nov 29, 2024",
    description: "HVAC ductwork conflicts with structural beam at level 3. Requesting alternative routing solution or beam modification.",
    category: "MEP",
    responses: 1
  },
  {
    id: "RFI-2024-043",
    title: "Concrete Mix Design Specification",
    project: "Industrial Warehouse",
    submittedBy: "Alex Rodriguez",
    assignedTo: "Structural Engineer",
    priority: "Low",
    status: "Answered",
    submittedDate: "Nov 20, 2024",
    dueDate: "Nov 27, 2024",
    description: "Requesting concrete mix design specifications for foundation elements in zone C. Standard mix adequate?",
    category: "Structural",
    responses: 2
  },
  {
    id: "RFI-2024-042",
    title: "Electrical Panel Location Modification",
    project: "Shopping Center Renovation",
    submittedBy: "Emily Davis",
    assignedTo: "Electrical Consultant",
    priority: "Medium",
    status: "Overdue",
    submittedDate: "Nov 15, 2024",
    dueDate: "Nov 22, 2024",
    description: "Proposed electrical panel location conflicts with architectural elements. Need approval for alternative location.",
    category: "Electrical",
    responses: 0
  }
];

const RFIs = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Answered":
        return "bg-success/10 text-success border-success/20";
      case "Open":
        return "bg-primary/10 text-primary border-primary/20";
      case "Pending Response":
        return "bg-warning/10 text-warning border-warning/20";
      case "Overdue":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "Low":
        return "bg-muted/10 text-muted-foreground border-muted/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Structural":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "MEP":
        return "bg-green-100 text-green-800 border-green-200";
      case "Electrical":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Architectural":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
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
              <h1 className="text-3xl font-bold text-foreground">RFIs</h1>
              <p className="text-muted-foreground">Requests for Information and Clarifications</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Export Report</Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New RFI
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {rfis.map((rfi) => (
              <Card key={rfi.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        {rfi.id}
                      </CardTitle>
                      <h3 className="text-xl font-semibold text-foreground mt-1">{rfi.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{rfi.project}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getStatusColor(rfi.status)}>
                        {rfi.status}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(rfi.priority)}>
                        {rfi.priority}
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(rfi.category)}>
                        {rfi.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{rfi.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <div>
                        <span className="text-sm text-muted-foreground">Submitted by</span>
                        <p className="font-medium">{rfi.submittedBy}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <div>
                        <span className="text-sm text-muted-foreground">Assigned to</span>
                        <p className="font-medium">{rfi.assignedTo}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <span className="text-sm text-muted-foreground">Submitted</span>
                        <p className="font-medium">{rfi.submittedDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <span className="text-sm text-muted-foreground">Due Date</span>
                        <p className={`font-medium ${rfi.status === 'Overdue' ? 'text-destructive' : ''}`}>
                          {rfi.dueDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span>{rfi.responses} Response{rfi.responses !== 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Add Response
                      </Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  {rfi.status === "Overdue" && (
                    <div className="mt-4 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Overdue:</span>
                        <span>This RFI requires immediate attention</span>
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

export default RFIs;