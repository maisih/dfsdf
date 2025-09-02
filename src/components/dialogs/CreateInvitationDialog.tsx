import { useState } from "react";
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

interface CreateInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateInvitationDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateInvitationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    role: "worker" as "engineer" | "worker" | "visitor",
    maxUses: 1,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  });
  const { toast } = useToast();

  const generateRandomCode = () => {
    const prefixes = {
      engineer: "ENG",
      worker: "WORK", 
      visitor: "VIS"
    };
    
    const prefix = prefixes[formData.role];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const randomCode = `${prefix}${randomNum}`;
    
    setFormData(prev => ({ ...prev, code: randomCode }));
  };

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
        .insert({
          code: formData.code.trim(),
          role: formData.role,
          max_uses: formData.maxUses,
          expires_at: formData.expiresAt.toISOString(),
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('This invitation code already exists');
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "Invitation code created successfully",
      });

      // Reset form
      setFormData({
        code: "",
        role: "worker",
        maxUses: 1,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create invitation code",
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
          <DialogTitle>Create Invitation Code</DialogTitle>
          <DialogDescription>
            Generate a new invitation code for system access.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Invitation Code</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Enter custom code or generate one"
                className="font-mono"
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateRandomCode}
                className="shrink-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
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
              Create Code
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}