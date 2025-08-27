import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Download, Eye, Share, Calendar, User } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const documents = [
  {
    id: 1,
    title: "Architectural Plans - Level 1-5",
    project: "Downtown Office Complex",
    type: "Drawings",
    category: "Architectural",
    version: "Rev 3.2",
    size: "15.2 MB",
    uploadedBy: "Sarah Johnson",
    uploadDate: "Nov 25, 2024",
    status: "Current",
    format: "PDF",
    description: "Latest architectural drawings including all revisions from client feedback"
  },
  {
    id: 2,
    title: "Structural Steel Shop Drawings",
    project: "Residential Tower Phase 2",
    type: "Shop Drawings", 
    category: "Structural",
    version: "Rev 1.0",
    size: "8.7 MB",
    uploadedBy: "Mike Chen",
    uploadDate: "Nov 22, 2024",
    status: "Under Review",
    format: "DWG",
    description: "Steel fabrication shop drawings for approval"
  },
  {
    id: 3,
    title: "MEP Installation Specifications",
    project: "Industrial Warehouse",
    type: "Specifications",
    category: "MEP",
    version: "Final",
    size: "3.4 MB",
    uploadedBy: "Alex Rodriguez",
    uploadDate: "Nov 20, 2024",
    status: "Approved",
    format: "PDF",
    description: "Complete MEP installation specifications and standards"
  },
  {
    id: 4,
    title: "Material Safety Data Sheets",
    project: "Shopping Center Renovation",
    type: "Safety Documents",
    category: "Safety",
    version: "Current",
    size: "12.1 MB",
    uploadedBy: "Emily Davis",
    uploadDate: "Nov 18, 2024",
    status: "Current",
    format: "PDF",
    description: "MSDS for all materials used on project"
  },
  {
    id: 5,
    title: "Quality Control Procedures",
    project: "All Projects",
    type: "Procedures",
    category: "Quality",
    version: "v2.1",
    size: "2.8 MB",
    uploadedBy: "Tom Wilson",
    uploadDate: "Nov 15, 2024",
    status: "Current",
    format: "DOCX",
    description: "Standard quality control and inspection procedures"
  },
  {
    id: 6,
    title: "Project Contract Agreement",
    project: "Downtown Office Complex",
    type: "Contract",
    category: "Legal",
    version: "Executed",
    size: "1.9 MB",
    uploadedBy: "Legal Department",
    uploadDate: "Oct 30, 2024",
    status: "Executed",
    format: "PDF",
    description: "Fully executed construction contract with all amendments"
  }
];

const Documents = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Current":
      case "Approved":
      case "Executed":
        return "bg-success/10 text-success border-success/20";
      case "Under Review":
        return "bg-warning/10 text-warning border-warning/20";
      case "Outdated":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Draft":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Architectural":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Structural":
        return "bg-green-100 text-green-800 border-green-200";
      case "MEP":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Safety":
        return "bg-red-100 text-red-800 border-red-200";
      case "Quality":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Legal":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "PDF":
        return "📄";
      case "DWG":
        return "📐";
      case "DOCX":
        return "📝";
      default:
        return "📁";
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
              <h1 className="text-3xl font-bold text-foreground">Documents</h1>
              <p className="text-muted-foreground">Manage project documents and drawings</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Document Library</Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Upload Document
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <span className="text-2xl">{getFormatIcon(doc.format)}</span>
                        {doc.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(doc.category)}>
                        {doc.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Project</span>
                      <p className="font-medium">{doc.project}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Type</span>
                      <p className="font-medium">{doc.type}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Version</span>
                      <p className="font-medium">{doc.version}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Size</span>
                      <p className="font-medium">{doc.size}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Uploaded by:</span>
                      <span className="font-medium text-foreground">{doc.uploadedBy}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Upload Date:</span>
                      <span className="font-medium text-foreground">{doc.uploadDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {doc.format} • {doc.category} • {doc.type}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-3 w-3" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Share className="h-3 w-3" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  {doc.status === "Under Review" && (
                    <div className="mt-4 p-3 bg-warning/5 border border-warning/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-warning">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Review Status:</span>
                        <span>This document is currently under review by the project team</span>
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

export default Documents;