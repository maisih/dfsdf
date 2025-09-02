import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface InvitationCode {
  id: string;
  code: string;
  role: string;
  expires_at: string;
  max_uses: number;
  current_uses: number;
}

interface EditInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitation: InvitationCode;
  onSuccess: () => void;
}

export function EditInvitationDialog({
  open,
  onOpenChange,
  invitation,
  onSuccess,
}: EditInvitationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    role: "worker" as "engineer" | "worker" | "visitor",
    maxUses: 1,
    expiresAt: new Date()
  });
  const { toast } = useToast();

  // Populate form when invitation changes
  useEffect(() => {
    if (invitation) {
      setFormData({
        code: invitation.code,
        role: invitation.role as "engineer" | "worker" | "visitor",
        maxUses: invitation.max_uses || 0,
        expiresAt: new Date(invitation.expires_at)
      });
    }
  }, [invitation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      toast({
        title: "Error",
        description: "Please enter an invitation code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('invitation_codes')
        .update({
          code: formData.code.trim(),
          role: formData.role,
          max_uses: formData.maxUses,
          expires_at: formData.expiresAt.toISOString(),
        })
        .eq('id', invitation.id);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('This invitation code already exists');
        }
        throw error;
      }

      toast({
        title: "Success", 
        description: "Invitation code updated successfully",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating invitation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update invitation code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Invitation Code</DialogTitle>
          <DialogDescription>
            Update the invitation code settings.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Invitation Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder="Enter invitation code"
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "engineer" | "worker" | "visitor") => 
                setFormData(prev => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineer">Engineer</SelectItem>
                <SelectItem value="worker">Worker</SelectItem>
                <SelectItem value="visitor">Visitor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxUses">Maximum Uses</Label>
            <Select
              value={formData.maxUses.toString()}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, maxUses: parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Single use</SelectItem>
                <SelectItem value="5">5 uses</SelectItem>
                <SelectItem value="10">10 uses</SelectItem>
                <SelectItem value="50">50 uses</SelectItem>
                <SelectItem value="0">Unlimited</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Current uses: {invitation.current_uses}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Expires At</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expiresAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expiresAt ? (
                    format(formData.expiresAt, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.expiresAt}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, expiresAt: date }))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Update Code
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}