import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Phone, Mail, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AddTeamMemberDialog from "@/components/dialogs/AddTeamMemberDialog";
import EditTeamMemberDialog from "@/components/dialogs/EditTeamMemberDialog";
import ContactTeamMemberDialog from "@/components/dialogs/ContactTeamMemberDialog";
import DeleteTeamMemberDialog from "@/components/dialogs/DeleteTeamMemberDialog";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Team = () => {
  const { selectedProject } = useProject();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      loadTeamMembers();
    } else {
      setTeamMembers([]);
    }
  }, [selectedProject]);

  const loadTeamMembers = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('project_id', selectedProject.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'manager':
        return "bg-primary/10 text-primary border-primary/20";
      case 'engineer':
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'supervisor':
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case 'foreman':
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
              <p className="text-muted-foreground">Manage project team members and their roles</p>
            </div>
            <AddTeamMemberDialog onTeamMemberAdded={loadTeamMembers} />
          </div>

          {!selectedProject ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please select a project to view team members</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading team members...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No team members found for this project</p>
              <p className="text-sm text-muted-foreground mt-2">Add your first team member to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium text-lg">
                            {member.name.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{member.profession}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getRoleColor(member.role)}>
                        {member.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      
                      {member.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Joined: {new Date(member.joined_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <EditTeamMemberDialog member={member} onMemberUpdated={loadTeamMembers} />
                      <ContactTeamMemberDialog member={member} />
                      <DeleteTeamMemberDialog 
                        memberId={member.id}
                        memberName={member.name}
                        onMemberDeleted={loadTeamMembers}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Team;