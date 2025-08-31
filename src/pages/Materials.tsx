import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, AlertCircle, CheckCircle, History } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import EditMaterialDialog from "@/components/dialogs/EditMaterialDialog";
import OrderMoreMaterialDialog from "@/components/dialogs/OrderMoreMaterialDialog";
import DeleteMaterialDialog from "@/components/dialogs/DeleteMaterialDialog";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import MaterialForm from "@/components/forms/MaterialForm";

const Materials = () => {
  const { selectedProject } = useProject();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      loadMaterials();
    } else {
      setMaterials([]);
    }
  }, [selectedProject]);

  const loadMaterials = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('project_id', selectedProject.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
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
              <h1 className="text-3xl font-bold text-foreground">Materials</h1>
              <p className="text-muted-foreground">Manage inventory and material requests</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Material Request</Button>
              <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
                <Plus className="h-4 w-4" />
                Add Material
              </Button>
            </div>
          </div>

          {showForm && (
            <div className="mb-6">
              <MaterialForm />
            </div>
          )}

          {!selectedProject ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please select a project to view materials</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading materials...</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No materials found for this project</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {materials.map((material) => (
                <Card key={material.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold text-foreground">{material.name}</h3>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{selectedProject.name}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Quantity</span>
                            <p className="font-semibold">{material.quantity} {material.unit}</p>
                          </div>
                          
                          {material.unit_cost && (
                            <div>
                              <span className="text-sm text-muted-foreground">Unit Cost</span>
                              <p className="font-semibold">{material.unit_cost} MAD</p>
                            </div>
                          )}
                          
                          {material.unit_cost && (
                            <div>
                              <span className="text-sm text-muted-foreground">Total Cost</span>
                              <p className="font-semibold">{(material.quantity * material.unit_cost).toFixed(2)} MAD</p>
                            </div>
                          )}
                        </div>
                        
                        {material.supplier && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                            <div>
                              <span>Supplier: </span>
                              <span className="font-medium text-foreground">{material.supplier}</span>
                            </div>
                          </div>
                        )}

                        {material.delivered_at && (
                          <div className="text-sm text-muted-foreground">
                            <span>Delivered: </span>
                            <span className="font-medium text-foreground">
                              {new Date(material.delivered_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        <EditMaterialDialog material={material} onMaterialUpdated={loadMaterials} />
                        <OrderMoreMaterialDialog material={material} onMaterialOrdered={loadMaterials} />
                        <Button variant="outline" size="sm">
                          <History className="h-4 w-4 mr-1" />
                          History
                        </Button>
                        <DeleteMaterialDialog 
                          materialId={material.id}
                          materialName={material.name}
                          onMaterialDeleted={loadMaterials}
                        />
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

export default Materials;