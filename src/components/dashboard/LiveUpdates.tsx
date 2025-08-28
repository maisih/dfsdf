import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, AlertCircle, CheckCircle, Camera, FileText } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";

interface LiveUpdate {
  id: string;
  type: 'task' | 'issue' | 'photo' | 'document' | 'milestone';
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

const LiveUpdates = () => {
  const { selectedProject } = useProject();
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);

  // Mock live updates - in a real app, this would be real-time data
  useEffect(() => {
    if (!selectedProject) return;

    const mockUpdates: LiveUpdate[] = [
      {
        id: '1',
        type: 'task',
        title: 'Foundation inspection completed',
        description: 'Quality inspection passed with minor notes',
        user: 'Sarah Johnson',
        timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
        priority: 'high'
      },
      {
        id: '2',
        type: 'photo',
        title: 'Progress photos uploaded',
        description: '15 new photos from east wing construction',
        user: 'Mike Chen',
        timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      },
      {
        id: '3',
        type: 'issue',
        title: 'Weather delay reported',
        description: 'Heavy rain affecting outdoor work',
        user: 'Alex Rodriguez',
        timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        priority: 'medium'
      },
      {
        id: '4',
        type: 'document',
        title: 'Updated blueprints received',
        description: 'Structural changes approved by architect',
        user: 'Emily Davis',
        timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
        priority: 'high'
      },
      {
        id: '5',
        type: 'milestone',
        title: 'Phase 1 milestone achieved',
        description: 'Foundation work completed ahead of schedule',
        user: 'Project Team',
        timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
        priority: 'critical'
      }
    ];

    setUpdates(mockUpdates);
  }, [selectedProject]);

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'issue':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'photo':
        return <Camera className="h-4 w-4 text-primary" />;
      case 'document':
        return <FileText className="h-4 w-4 text-accent" />;
      case 'milestone':
        return <CheckCircle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical':
        return "bg-destructive/10 text-destructive border-destructive/20";
      case 'high':
        return "bg-warning/10 text-warning border-warning/20";
      case 'medium':
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!selectedProject) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Live Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Select a project to view live updates</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Live Updates
          <Badge variant="outline" className="ml-auto">
            {updates.length} new
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {updates.map((update) => (
            <div key={update.id} className="flex gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="flex-shrink-0 mt-0.5">
                {getUpdateIcon(update.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm leading-tight">{update.title}</h4>
                  {update.priority && (
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(update.priority)}`}>
                      {update.priority}
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {update.description}
                </p>
                
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{update.user}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(update.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveUpdates;