import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReportAdded: (report: any) => void;
}

const AddReportDialog = ({ open, onOpenChange, onReportAdded }: AddReportDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [frequency, setFrequency] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title.trim() || !type || !frequency) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newReport = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      type,
      frequency,
      status: "Scheduled",
      lastGenerated: "Not generated yet",
      nextScheduled: "To be scheduled",
      projects: ["Current Project"],
      size: "0 MB"
    };

    onReportAdded(newReport);
    
    toast({
      title: "Success",
      description: "Report scheduled successfully",
    });

    // Reset form
    setTitle("");
    setDescription("");
    setType("");
    setFrequency("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Report Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter report title"
            />
          </div>

          <div>
            <Label htmlFor="type">Report Type *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Progress">Progress</SelectItem>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Inventory">Inventory</SelectItem>
                <SelectItem value="Labor">Labor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="frequency">Frequency *</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !type || !frequency}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddReportDialog;