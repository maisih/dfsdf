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
import { DollarSign } from "lucide-react";

interface UpdateTaskCostDialogProps {
  task: any;
  onTaskUpdated?: () => void;
}

const UpdateTaskCostDialog = ({ task, onTaskUpdated }: UpdateTaskCostDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    cost: task?.cost?.toString() || "",
    note: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          cost: formData.cost ? parseFloat(formData.cost) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task cost updated successfully!",
      });

      setOpen(false);
      setFormData({ cost: "", note: "" });
      onTaskUpdated?.();
    } catch (error) {
      console.error('Error updating task cost:', error);
      toast({
        title: "Error",
        description: "Failed to update task cost. Please try again.",
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
          <DollarSign className="h-4 w-4 mr-1" />
          Update Cost
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Task Cost</DialogTitle>
          <DialogDescription>
            Update the cost for "{task?.title}"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="cost">New Cost (MAD)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="0.00"
              required
            />
            <p className="text-sm text-muted-foreground">
              Current cost: {task?.cost ? `${task.cost} MAD` : 'No cost set'}
            </p>
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Add a note about this cost update..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Cost"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTaskCostDialog;