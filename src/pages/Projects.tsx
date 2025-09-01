import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Rating } from "@/components/ui/rating";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useProject } from "@/contexts/ProjectContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddProjectDialog from "@/components/dialogs/AddProjectDialog";
import EditProjectDialog from "@/components/dialogs/EditProjectDialog";
import constructionHero from "@/assets/construction-hero.jpg";

const Projects = () => {
  const navigate = useNavigate();
  const { projects, loadProjects } = useProject();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [sortBy, setSortBy] = useState("Featured");

  const handleViewDetails = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast.success('Project deleted successfully');
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'completed':
        return 'default';
      case 'on-hold':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const filterTabs = ["All Projects", "Active", "Completed", "On Hold", "Planning"];
  
  const filteredProjects = projects.filter(project => {
    if (activeFilter === "All Projects") return true;
    return project.status.toLowerCase() === activeFilter.toLowerCase().replace(" ", "-");
  });

  const getProjectRating = (progress: number) => {
    if (progress >= 90) return 5;
    if (progress >= 75) return 4;
    if (progress >= 50) return 3;
    if (progress >= 25) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-surface border-r border-border shadow-soft overflow-y-auto">
          <Sidebar />
        </div>
        
        <main className="flex-1 ml-64 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Construction Projects</h1>
                <p className="text-muted-foreground mt-1">{filteredProjects.length} projects</p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Featured">Featured</SelectItem>
                    <SelectItem value="Newest">Newest</SelectItem>
                    <SelectItem value="Progress">Progress</SelectItem>
                    <SelectItem value="Budget">Budget</SelectItem>
                  </SelectContent>
                </Select>
                <AddProjectDialog />
              </div>
            </div>
            
            <FilterTabs 
              items={filterTabs}
              activeItem={activeFilter}
              onItemChange={setActiveFilter}
            />
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-medium transition-all duration-300 border-0 shadow-soft">
                {/* Project Image */}
                <div className="relative overflow-hidden rounded-t-lg bg-muted aspect-[4/3]">
                  <img 
                    src={constructionHero}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {project.status === 'active' && (
                      <Badge variant="new">New!</Badge>
                    )}
                    <Badge variant={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(project.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedProject(project)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Project
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Project</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{project.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProject(project.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Project Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          {project.created_by || 'No Manager'}
                        </p>
                        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {project.location || 'Location not specified'}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">
                          {project.budget?.toLocaleString() || '0'} MAD
                        </p>
                        <div className="flex items-center gap-2">
                          <Rating rating={getProjectRating(project.progress || 0)} size="sm" />
                          <span className="text-xs text-muted-foreground">
                            ({project.progress || 0}%)
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Progress</div>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Color variants (representing different phases/aspects) */}
                    <div className="flex items-center gap-1 pt-2">
                      <div className="w-3 h-3 rounded-full bg-primary border border-white shadow-sm" title="Planning"></div>
                      <div className="w-3 h-3 rounded-full bg-success border border-white shadow-sm" title="Construction"></div>
                      <div className="w-3 h-3 rounded-full bg-warning border border-white shadow-sm" title="Finishing"></div>
                      <div className="w-3 h-3 rounded-full bg-muted border border-white shadow-sm" title="Inspection"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                No projects found for "{activeFilter}"
              </div>
            </div>
          )}

          {selectedProject && (
            <EditProjectDialog 
              project={selectedProject} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Projects;