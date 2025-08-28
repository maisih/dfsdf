import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Wrench } from "lucide-react";

const EquipmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'active',
    location: '',
    operator: '',
    fuel_level: '',
    hours_used: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { selectedProject } = useProject();
  const { toast } = useToast();

  const equipmentTypes = [
    'Heavy Machinery', 'Crane', 'Transport', 'Light Machinery', 'Access Equipment', 'Tools', 'Other'
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'idle', label: 'Idle' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'out_of_service', label: 'Out of Service' }
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
      // Create equipment as a task for now
      const { error } = await supabase
        .from('tasks')
        .insert([{
          title: `Equipment Added: ${formData.name}`,
          description: `Equipment Type: ${formData.type}\nStatus: ${formData.status}\nLocation: ${formData.location}\nOperator: ${formData.operator || 'Unassigned'}${formData.fuel_level ? `\nFuel Level: ${formData.fuel_level}%` : ''}${formData.hours_used ? `\nHours Used: ${formData.hours_used}h` : ''}`,
          project_id: selectedProject.id,
          priority: 1,
          status: 'pending',
          created_by: null
        }]);
        
      if (error) throw error;
      
      toast({
        title: "Equipment Added",
        description: "Equipment has been successfully added to the project.",
      });
      
      setFormData({
        name: '',
        type: '',
        status: 'active',
        location: '',
        operator: '',
        fuel_level: '',
        hours_used: ''
      });
    } catch (error) {
      console.error('Equipment creation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add equipment.",
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
            <Wrench className="h-5 w-5" />
            Add Equipment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Select a project to add equipment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Add New Equipment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Equipment Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Caterpillar Excavator 320D"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Equipment Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Current location on site"
              required
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operator">Operator - Optional</Label>
              <Input
                id="operator"
                value={formData.operator}
                onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                placeholder="Operator name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fuel_level">Fuel Level (%) - Optional</Label>
              <Input
                id="fuel_level"
                type="number"
                value={formData.fuel_level}
                onChange={(e) => setFormData({ ...formData, fuel_level: e.target.value })}
                placeholder="0-100"
                min="0"
                max="100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hours_used">Hours Used - Optional</Label>
              <Input
                id="hours_used"
                type="number"
                value={formData.hours_used}
                onChange={(e) => setFormData({ ...formData, hours_used: e.target.value })}
                placeholder="Total hours"
                min="0"
              />
            </div>
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Adding..." : "Add Equipment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EquipmentForm;