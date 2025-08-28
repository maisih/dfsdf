import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AddDailyLogDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split('T')[0],
    work_performed: '',
    laborers: '',
    operators: '',
    supervisors: '',
    equipment_used: '',
    deliveries: '',
    weather: '',
    issues: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { selectedProject } = useProject();
  const { toast } = useToast();

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
        .from('daily_logs')
        .insert([{
          project_id: selectedProject.id,
          log_date: formData.log_date,
          work_performed: formData.work_performed || null,
          laborers: formData.laborers ? parseInt(formData.laborers) : 0,
          operators: formData.operators ? parseInt(formData.operators) : 0,
          supervisors: formData.supervisors ? parseInt(formData.supervisors) : 0,
          equipment_used: formData.equipment_used || null,
          deliveries: formData.deliveries || null,
          weather: formData.weather || null,
          issues: formData.issues || null,
          logged_by: null // Set to null until authentication is implemented
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Log Entry Created",
        description: "Daily log entry has been successfully created.",
      });
      
      setOpen(false);
      setFormData({
        log_date: new Date().toISOString().split('T')[0],
        work_performed: '',
        laborers: '',
        operators: '',
        supervisors: '',
        equipment_used: '',
        deliveries: '',
        weather: '',
        issues: ''
      });
      
      // Refresh the page to show new log
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create log entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Log Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Daily Log Entry</DialogTitle>
          <DialogDescription>
            Record daily activities and progress for your project
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="log_date">Date</Label>
            <Input
              id="log_date"
              type="date"
              value={formData.log_date}
              onChange={(e) => setFormData({ ...formData, log_date: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="work_performed">Work Performed</Label>
            <Textarea
              id="work_performed"
              value={formData.work_performed}
              onChange={(e) => setFormData({ ...formData, work_performed: e.target.value })}
              placeholder="Describe the work performed today"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="laborers">Laborers</Label>
              <Input
                id="laborers"
                type="number"
                min="0"
                value={formData.laborers}
                onChange={(e) => setFormData({ ...formData, laborers: e.target.value })}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="operators">Operators</Label>
              <Input
                id="operators"
                type="number"
                min="0"
                value={formData.operators}
                onChange={(e) => setFormData({ ...formData, operators: e.target.value })}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supervisors">Supervisors</Label>
              <Input
                id="supervisors"
                type="number"
                min="0"
                value={formData.supervisors}
                onChange={(e) => setFormData({ ...formData, supervisors: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="equipment_used">Equipment Used</Label>
            <Textarea
              id="equipment_used"
              value={formData.equipment_used}
              onChange={(e) => setFormData({ ...formData, equipment_used: e.target.value })}
              placeholder="List equipment used today"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deliveries">Deliveries</Label>
            <Textarea
              id="deliveries"
              value={formData.deliveries}
              onChange={(e) => setFormData({ ...formData, deliveries: e.target.value })}
              placeholder="Record any deliveries received"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weather">Weather</Label>
              <Input
                id="weather"
                value={formData.weather}
                onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                placeholder="e.g., Sunny, Rainy, Cloudy"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issues">Issues & Notes</Label>
              <Textarea
                id="issues"
                value={formData.issues}
                onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                placeholder="Any issues or additional notes"
                rows={2}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating..." : "Create Log Entry"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDailyLogDialog;