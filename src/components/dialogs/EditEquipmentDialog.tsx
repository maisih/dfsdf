import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";

interface EditEquipmentDialogProps {
  equipment: any;
  onEquipmentUpdated?: () => void;
}

const EditEquipmentDialog = ({ equipment, onEquipmentUpdated }: EditEquipmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const equipmentName = equipment?.title?.replace('Equipment Added: ', '') || "";
  const info = parseEquipmentInfo(equipment?.description || '');
  
  const [formData, setFormData] = useState({
    name: equipmentName,
    type: info.type || "",
    status: info.status || "active",
    location: info.location || "",
    operator: info.operator || ""
  });

  const statuses = ["active", "idle", "maintenance", "out_of_service"];
  const equipmentTypes = ["Excavator", "Bulldozer", "Crane", "Dump Truck", "Concrete Mixer", "Compactor", "Generator", "Other"];

  function parseEquipmentInfo(description: string) {
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update the task that represents this equipment
      const newDescription = `Equipment Type: ${formData.type}
Status: ${formData.status}
Location: ${formData.location}
Operator: ${formData.operator || 'Unassigned'}`;

      const { error } = await supabase
        .from('tasks')
        .update({
          title: `Equipment Added: ${formData.name}`,
          description: newDescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', equipment.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Equipment updated successfully!",
      });

      setOpen(false);
      onEquipmentUpdated?.();
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast({
        title: "Error",
        description: "Failed to update equipment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>
            Update equipment information and save changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Equipment Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="type">Equipment Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Current location"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="operator">Operator</Label>
            <Input
              id="operator"
              type="text"
              value={formData.operator}
              onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
              placeholder="Assigned operator"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEquipmentDialog;