import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Clock, 
  Shield, 
  LogOut,
  RefreshCw,
  Activity
} from "lucide-react";
import { format } from "date-fns";

// This would normally come from your session store/backend
interface ActiveSession {
  sessionId: string;
  invitationCode: string;
  role: string;
  loginTime: string;
  lastActivity: string;
  fingerprint: string;
  ipAddress?: string;
}

export function ActiveSessionManager() {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadRevokedIds = (): string[] => {
    try { return JSON.parse(sessionStorage.getItem('revoked_sessions') || '[]'); } catch { return []; }
  };
  const saveRevokedIds = (ids: string[]) => {
    try { sessionStorage.setItem('revoked_sessions', JSON.stringify(ids)); } catch {}
  };

  // Mock data for demonstration - in real implementation, this would fetch from your session store
  const fetchActiveSessions = async () => {
    try {
      setLoading(true);

      // Simulated API call - replace with actual session management
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock active sessions
      const mockSessions: ActiveSession[] = [
        {
          sessionId: "sess_1",
          invitationCode: "ENG2024",
          role: "engineer", 
          loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
          fingerprint: "fp_12345",
          ipAddress: "192.168.1.100"
        },
        {
          sessionId: "sess_2", 
          invitationCode: "WORK2024",
          role: "worker",
          loginTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          lastActivity: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
          fingerprint: "fp_67890",
          ipAddress: "192.168.1.101"
        }
      ];
      
      const revoked = new Set(loadRevokedIds());
      const filtered = mockSessions.filter(s => !revoked.has(s.sessionId));
      setSessions(filtered);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load active sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
    
    // Refresh sessions every 30 seconds
    const interval = setInterval(fetchActiveSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleForceLogout = async (sessionId: string) => {
    try {
      // In real implementation, this would call your session invalidation API
      console.log('Force logout session:', sessionId);

      // Persist revoked session locally so periodic refresh won't re-add it
      const current = loadRevokedIds();
      if (!current.includes(sessionId)) {
        const next = [...current, sessionId];
        saveRevokedIds(next);
      }

      toast({
        title: "Success",
        description: "Session terminated successfully",
      });

      // Remove from local state
      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
    } catch (error) {
      console.error('Error terminating session:', error);
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive",
      });
    }
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

  const getActivityStatus = (lastActivity: string) => {
    const now = new Date();
    const activity = new Date(lastActivity);
    const minutesAgo = Math.floor((now.getTime() - activity.getTime()) / (1000 * 60));
    
    if (minutesAgo < 5) {
      return <Badge variant="default" className="bg-green-500 text-white">Active</Badge>;
    } else if (minutesAgo < 30) {
      return <Badge variant="secondary">Idle</Badge>;
    } else {
      return <Badge variant="outline">Inactive</Badge>;
    }
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Active Sessions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monitor and manage active user sessions
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchActiveSessions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invitation Code</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Login Time</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No active sessions</p>
                      <p className="text-sm text-muted-foreground">
                        Sessions will appear here when users log in
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <TableRow key={session.sessionId}>
                    <TableCell className="font-mono font-medium">
                      {session.invitationCode}
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(session.role)}
                    </TableCell>
                    <TableCell>
                      {getActivityStatus(session.lastActivity)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(session.loginTime), 'MMM d, HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(session.lastActivity), 'HH:mm:ss')}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {session.ipAddress || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleForceLogout(session.sessionId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {sessions.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Sessions refresh automatically every 30 seconds</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
