import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wrench, MapPin, Calendar, AlertTriangle, History, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import EditEquipmentDialog from "@/components/dialogs/EditEquipmentDialog";
import DeleteEquipmentDialog from "@/components/dialogs/DeleteEquipmentDialog";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import EquipmentForm from "@/components/forms/EquipmentForm";

const Equipment = () => {
  const { selectedProject } = useProject();
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      loadEquipment();
    } else {
      setEquipment([]);
    }
  }, [selectedProject]);

  const loadEquipment = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      // Try to load from equipment table, fall back to tasks if not available
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', selectedProject.id)
        .ilike('title', '%Equipment Added:%')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error loading equipment:', error);
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "Idle":
      case "idle":
        return "bg-warning/10 text-warning border-warning/20";
      case "Maintenance":
      case "maintenance":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Out of Service":
      case "out_of_service":
        return "bg-muted/10 text-muted-foreground border-muted/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  // Parse equipment info from task description
  const parseEquipmentInfo = (description: string) => {
    const lines = description.split('\n');
    const info: any = {};
    
    lines.forEach(line => {
      const [key, value] = line.split(': ');
      if (key && value) {
        switch (key.trim()) {
          case 'Equipment Type':
            info.type = value.trim();
            break;
          case 'Status':
            info.status = value.trim();
            break;
          case 'Location':
            info.location = value.trim();
            break;
          case 'Operator':
            info.operator = value.trim() !== 'Unassigned' ? value.trim() : null;
            break;
        }
      }
    });
    
    return info;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Equipment</h1>
              <p className="text-muted-foreground">Manage construction equipment and machinery</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Maintenance Schedule</Button>
              <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
                <Plus className="h-4 w-4" />
                Add Equipment
              </Button>
            </div>
          </div>

          {showForm && (
            <div className="mb-6">
              <EquipmentForm />
            </div>
          )}

          {!selectedProject ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please select a project to view equipment</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading equipment...</p>
            </div>
          ) : equipment.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No equipment found for this project</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {equipment.map((item) => {
                const equipmentName = item.title.replace('Equipment Added: ', '');
                const info = parseEquipmentInfo(item.description || '');
                
                return (
                  <Card key={item.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Wrench className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">{equipmentName}</h3>
                            <Badge variant="outline" className={getStatusColor(info.status)}>
                              {info.status || 'Unknown'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{info.type || 'Unknown Type'}</span>
                            <span>•</span>
                            <span>{selectedProject.name}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {info.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <div>
                                  <span className="text-sm text-muted-foreground">Location</span>
                                  <p className="font-medium">{info.location}</p>
                                </div>
                              </div>
                            )}
                            
                            {info.operator && (
                              <div>
                                <span className="text-sm text-muted-foreground">Operator</span>
                                <p className="font-medium">{info.operator}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <div>
                                <span className="text-sm text-muted-foreground">Added</span>
                                <p className="font-medium">{new Date(item.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 flex-wrap">
                          <EditEquipmentDialog equipment={item} onEquipmentUpdated={loadEquipment} />
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Log Entry
                          </Button>
                          <Button variant="outline" size="sm">
                            <History className="h-4 w-4 mr-1" />
                            History
                          </Button>
                          <DeleteEquipmentDialog 
                            equipmentId={item.id}
                            equipmentName={equipmentName}
                            onEquipmentDeleted={loadEquipment}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Equipment;