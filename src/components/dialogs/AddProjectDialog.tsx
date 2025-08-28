import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

const moroccanCities = [
  "Casablanca", "Rabat", "Fes", "Marrakech", "Agadir", "Tangier", 
  "Meknes", "Oujda", "Kenitra", "Tetouan", "Safi", "Mohammedia",
  "El Jadida", "Beni Mellal", "Errachidia", "Taza", "Essaouira",
  "Khouribga", "Guelmim", "Jorf El Melha", "Laayoune", "Khenifra",
  "Berrechid", "Khemisset", "Nador"
];

const AddProjectDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    budget: '',
    start_date: '',
    end_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addProject } = useProject();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('🎯 Attempting to create project with data:', formData);
      await addProject({
        ...formData,
        budget: parseFloat(formData.budget) || null,
        spent: 0,
        progress: 0,
        status: 'planning' as const,
        created_by: '00000000-0000-0000-0000-000000000000' // Temporary until auth is implemented
      });
      
      console.log('🎉 Project creation initiated successfully');
      toast({
        title: "Success!",
        description: `Project "${formData.name}" has been created successfully.`,
      });
      
      setOpen(false);
      setFormData({
        name: '',
        location: '',
        description: '',
        budget: '',
        start_date: '',
        end_date: ''
      });
    } catch (error) {
      console.error('❌ Project creation error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create project. Please try again.";
      toast({
        title: "Error Creating Project",
        description: errorMessage,
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
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new construction project to your portfolio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select
              value={formData.location}
              onValueChange={(value) => setFormData({ ...formData, location: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city in Morocco" />
              </SelectTrigger>
              <SelectContent>
                {moroccanCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Project description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (MAD)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="0.00"
              step="0.01"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating..." : "Create Project"}
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

export default AddProjectDialog;