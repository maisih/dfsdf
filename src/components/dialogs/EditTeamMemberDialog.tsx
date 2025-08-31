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

interface EditTeamMemberDialogProps {
  member: any;
  onMemberUpdated?: () => void;
}

const EditTeamMemberDialog = ({ member, onMemberUpdated }: EditTeamMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: member?.name || "",
    profession: member?.profession || "",
    phone: member?.phone || "",
    email: member?.email || "",
    role: member?.role || "worker",
    joined_date: member?.joined_date || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          name: formData.name,
          profession: formData.profession,
          phone: formData.phone || null,
          email: formData.email || null,
          role: formData.role,
          joined_date: formData.joined_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', member.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team member updated successfully!",
      });

      setOpen(false);
      onMemberUpdated?.();
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: "Error",
        description: "Failed to update team member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogDescription>
            Update team member information and save changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              type="text"
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker">Worker</SelectItem>
                  <SelectItem value="foreman">Foreman</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="joined_date">Join Date</Label>
              <Input
                id="joined_date"
                type="date"
                value={formData.joined_date}
                onChange={(e) => setFormData({ ...formData, joined_date: e.target.value })}
              />
            </div>
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

export default EditTeamMemberDialog;