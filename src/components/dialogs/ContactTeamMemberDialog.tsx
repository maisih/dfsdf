import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Phone, Mail, MessageCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactTeamMemberDialogProps {
  member: any;
}

const ContactTeamMemberDialog = ({ member }: ContactTeamMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handlePhoneCall = () => {
    if (member.phone) {
      window.location.href = `tel:${member.phone}`;
      toast({
        title: "Opening phone app",
        description: `Calling ${member.name}...`,
      });
    }
  };

  const handleEmail = () => {
    if (member.email) {
      window.location.href = `mailto:${member.email}`;
      toast({
        title: "Opening email app",
        description: `Composing email to ${member.name}...`,
      });
    }
  };

  const handleWhatsApp = () => {
    if (member.phone) {
      // Remove any non-numeric characters and format for WhatsApp
      const phoneNumber = member.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
      toast({
        title: "Opening WhatsApp",
        description: `Starting chat with ${member.name}...`,
      });
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `${type} copied successfully!`,
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <Phone className="h-4 w-4 mr-1" />
          Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Contact {member.name}</DialogTitle>
          <DialogDescription>
            Choose how you'd like to contact this team member.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {member.phone && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-foreground">Phone: {member.phone}</h4>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePhoneCall}
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleWhatsApp}
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(member.phone, 'Phone number')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {member.email && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-foreground">Email: {member.email}</h4>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEmail}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Send Email
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(member.email, 'Email address')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {!member.phone && !member.email && (
            <div className="text-center py-6">
              <p className="text-muted-foreground text-sm">
                No contact information available for {member.name}.
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Edit this team member to add contact details.
              </p>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactTeamMemberDialog;