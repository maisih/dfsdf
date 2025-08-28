import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Download, Eye, Share, Calendar, User } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Documents = () => {
  const { selectedProject } = useProject();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      loadDocuments();
    } else {
      setDocuments([]);
    }
  }, [selectedProject]);

  const loadDocuments = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', selectedProject.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };
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

          {!selectedProject ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please select a project to view documents</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No documents found for this project</p>
            </div>
          ) : (
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
                      <span className="text-sm text-muted-foreground">Name</span>
                      <p className="font-medium">{doc.name}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Type</span>
                      <p className="font-medium">{doc.mime_type}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Version</span>
                      <p className="font-medium">{doc.version}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Size</span>
                      <p className="font-medium">{doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(1)} MB` : 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Uploaded by:</span>
                      <span className="font-medium text-foreground">{doc.uploaded_by || 'Unknown'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Upload Date:</span>
                      <span className="font-medium text-foreground">{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {doc.mime_type} • Version {doc.version}
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

export default Documents;