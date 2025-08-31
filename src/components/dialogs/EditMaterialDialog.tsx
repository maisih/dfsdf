import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface EditMaterialDialogProps {
  material: any;
  onMaterialUpdated?: () => void;
}

const EditMaterialDialog = ({ material, onMaterialUpdated }: EditMaterialDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const units = ["kg", "tons", "pieces", "m³", "m²", "m", "liters", "bags", "boxes"];
  
  const [formData, setFormData] = useState({
    name: material?.name || "",
    quantity: material?.quantity?.toString() || "",
    unit: material?.unit || "",
    unit_cost: material?.unit_cost?.toString() || "",
    supplier: material?.supplier || "",
    delivered_at: material?.delivered_at ? material.delivered_at.split('T')[0] : ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('materials')
        .update({
          name: formData.name,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          unit_cost: formData.unit_cost ? parseFloat(formData.unit_cost) : null,
          supplier: formData.supplier || null,
          delivered_at: formData.delivered_at || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', material.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Material updated successfully!",
      });

      setOpen(false);
      onMaterialUpdated?.();
    } catch (error) {
      console.error('Error updating material:', error);
      toast({
        title: "Error",
        description: "Failed to update material. Please try again.",
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
          <DialogTitle>Edit Material</DialogTitle>
          <DialogDescription>
            Update material information and save changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Material Name</Label>
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
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="unit_cost">Unit Cost (MAD)</Label>
            <Input
              id="unit_cost"
              type="number"
              step="0.01"
              value={formData.unit_cost}
              onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              placeholder="Supplier name"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="delivered_at">Delivery Date</Label>
            <Input
              id="delivered_at"
              type="date"
              value={formData.delivered_at}
              onChange={(e) => setFormData({ ...formData, delivered_at: e.target.value })}
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

export default EditMaterialDialog;