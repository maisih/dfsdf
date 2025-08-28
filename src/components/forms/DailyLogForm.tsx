import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users } from "lucide-react";

const DailyLogForm = () => {
  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split('T')[0],
    weather: '',
    work_performed: '',
    laborers: '',
    operators: '',
    supervisors: '',
    equipment_used: '',
    deliveries: '',
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
          ...formData,
          laborers: parseInt(formData.laborers) || 0,
          operators: parseInt(formData.operators) || 0,
          supervisors: parseInt(formData.supervisors) || 0,
          project_id: selectedProject.id,
          logged_by: null // Set to null until authentication is implemented
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Daily Log Created",
        description: "Daily log has been successfully recorded.",
      });
      
      setFormData({
        log_date: new Date().toISOString().split('T')[0],
        weather: '',
        work_performed: '',
        laborers: '',
        operators: '',
        supervisors: '',
        equipment_used: '',
        deliveries: '',
        issues: ''
      });
    } catch (error) {
      console.error('Daily log creation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create daily log.",
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
            <Calendar className="h-5 w-5" />
            Create Daily Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Select a project to create daily logs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          New Daily Log Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="weather">Weather</Label>
              <Input
                id="weather"
                value={formData.weather}
                onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                placeholder="e.g., Sunny, 68°F"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="work_performed">Work Performed</Label>
            <Textarea
              id="work_performed"
              value={formData.work_performed}
              onChange={(e) => setFormData({ ...formData, work_performed: e.target.value })}
              placeholder="Describe the work performed today..."
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manpower
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="laborers" className="text-sm">Laborers</Label>
                <Input
                  id="laborers"
                  type="number"
                  value={formData.laborers}
                  onChange={(e) => setFormData({ ...formData, laborers: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="operators" className="text-sm">Operators</Label>
                <Input
                  id="operators"
                  type="number"
                  value={formData.operators}
                  onChange={(e) => setFormData({ ...formData, operators: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="supervisors" className="text-sm">Supervisors</Label>
                <Input
                  id="supervisors"
                  type="number"
                  value={formData.supervisors}
                  onChange={(e) => setFormData({ ...formData, supervisors: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="equipment_used">Equipment Used</Label>
            <Textarea
              id="equipment_used"
              value={formData.equipment_used}
              onChange={(e) => setFormData({ ...formData, equipment_used: e.target.value })}
              placeholder="List equipment used today..."
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deliveries">Deliveries</Label>
            <Textarea
              id="deliveries"
              value={formData.deliveries}
              onChange={(e) => setFormData({ ...formData, deliveries: e.target.value })}
              placeholder="List materials/deliveries received..."
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="issues">Issues & Notes</Label>
            <Textarea
              id="issues"
              value={formData.issues}
              onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
              placeholder="Any issues, delays, or important notes..."
              rows={2}
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Create Daily Log"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DailyLogForm;