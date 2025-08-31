import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useProject } from "@/contexts/ProjectContext";
import { ShoppingCart } from "lucide-react";

interface OrderMoreMaterialDialogProps {
  material: any;
  onMaterialOrdered?: () => void;
}

const OrderMoreMaterialDialog = ({ material, onMaterialOrdered }: OrderMoreMaterialDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { selectedProject } = useProject();
  
  const [formData, setFormData] = useState({
    quantity: "",
    unit_cost: material?.unit_cost?.toString() || "",
    supplier: material?.supplier || "",
    delivery_date: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    setIsLoading(true);

    try {
      // Create a new material entry for the additional order
      const { error } = await supabase
        .from('materials')
        .insert({
          name: `${material.name} (Additional Order)`,
          quantity: parseFloat(formData.quantity),
          unit: material.unit,
          unit_cost: formData.unit_cost ? parseFloat(formData.unit_cost) : null,
          supplier: formData.supplier || null,
          delivered_at: formData.delivery_date || null,
          project_id: selectedProject.id,
          ordered_by: null // Set to null until authentication is implemented
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Additional order for ${material.name} has been placed!`,
      });

      setOpen(false);
      setFormData({
        quantity: "",
        unit_cost: material?.unit_cost?.toString() || "",
        supplier: material?.supplier || "",
        delivery_date: "",
        notes: ""
      });
      onMaterialOrdered?.();
    } catch (error) {
      console.error('Error ordering material:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
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
          <ShoppingCart className="h-4 w-4 mr-1" />
          Order More
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order More: {material?.name}</DialogTitle>
          <DialogDescription>
            Place an additional order for this material.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Stock</Label>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm">
                <span className="font-medium">{material.quantity} {material.unit}</span>
                {material.unit_cost && (
                  <span className="text-muted-foreground"> @ {material.unit_cost} MAD per {material.unit}</span>
                )}
              </p>
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="quantity">Additional Quantity ({material.unit})</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              placeholder="Enter quantity to order"
            />
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
            <Label htmlFor="delivery_date">Expected Delivery Date</Label>
            <Input
              id="delivery_date"
              type="date"
              value={formData.delivery_date}
              onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional order notes..."
              rows={2}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderMoreMaterialDialog;