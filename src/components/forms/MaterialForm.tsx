import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package } from "lucide-react";

const MaterialForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: '',
    unit_cost: '',
    supplier: '',
    delivered_at: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { selectedProject } = useProject();
  const { toast } = useToast();

  const units = [
    'bags', 'tons', 'units', 'meters', 'liters', 'kg', 'pieces', 'rolls', 'sheets', 'cubic meters'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) {
      toast({
        title: "No Project Selected",
        description: "Please select a project first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('materials')
        .insert([{
          ...formData,
          quantity: parseFloat(formData.quantity),
          unit_cost: formData.unit_cost ? parseFloat(formData.unit_cost) : null,
          delivered_at: formData.delivered_at || null,
          project_id: selectedProject.id,
          ordered_by: null // Set to null until authentication is implemented
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Material Added",
        description: "Material has been successfully added to inventory.",
      });
      
      setFormData({
        name: '',
        quantity: '',
        unit: '',
        unit_cost: '',
        supplier: '',
        delivered_at: ''
      });
    } catch (error) {
      console.error('Material creation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add material.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedProject) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add Material
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Select a project to add materials</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Add New Material
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Material Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Portland Cement"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_cost">Unit Cost (MAD) - Optional</Label>
              <Input
                id="unit_cost"
                type="number"
                value={formData.unit_cost}
                onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delivered_at">Delivery Date - Optional</Label>
              <Input
                id="delivered_at"
                type="datetime-local"
                value={formData.delivered_at}
                onChange={(e) => setFormData({ ...formData, delivered_at: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier - Optional</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              placeholder="Supplier name"
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Adding..." : "Add Material"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MaterialForm;