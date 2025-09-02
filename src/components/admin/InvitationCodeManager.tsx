import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateInvitationDialog } from "@/components/dialogs/CreateInvitationDialog";
import { EditInvitationDialog } from "@/components/dialogs/EditInvitationDialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  Clock,
  Users,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";

interface InvitationCode {
  id: string;
  code: string;
  role: string;
  expires_at: string;
  max_uses: number;
  current_uses: number;
  created_at: string;
  used_at: string | null;
}

export function InvitationCodeManager() {
  const [invitations, setInvitations] = useState<InvitationCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<InvitationCode | null>(null);
  const { toast } = useToast();

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('invitation_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error",
        description: "Failed to load invitation codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invitation_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invitation code deleted successfully",
      });

      fetchInvitations();
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast({
        title: "Error", 
        description: "Failed to delete invitation code",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (invitation: InvitationCode) => {
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);
    const isExpired = now > expiresAt;
    const isMaxedOut = invitation.max_uses && invitation.current_uses >= invitation.max_uses;

    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (isMaxedOut) {
      return <Badge variant="secondary">Used Up</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      engineer: "bg-primary text-primary-foreground",
      worker: "bg-secondary text-secondary-foreground", 
      visitor: "bg-accent text-accent-foreground"
    };
    
    return (
      <Badge className={colors[role as keyof typeof colors] || colors.visitor}>
        {role}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invitation Codes</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage access codes for the system
              </p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Code
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Shield className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No invitation codes found</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCreateDialogOpen(true)}
                        >
                          Create your first code
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-mono font-medium">
                        {invitation.code}
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(invitation.role)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(invitation)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {invitation.current_uses}
                          {invitation.max_uses && ` / ${invitation.max_uses}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(invitation.expires_at), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(invitation.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedInvitation(invitation);
                                setEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(invitation.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CreateInvitationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchInvitations}
      />

      {selectedInvitation && (
        <EditInvitationDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          invitation={selectedInvitation}
          onSuccess={fetchInvitations}
        />
      )}
    </>
  );
}