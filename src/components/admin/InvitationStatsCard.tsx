import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Key, 
  Users, 
  Clock, 
  Shield,
  TrendingUp,
  AlertCircle
} from "lucide-react";

interface InvitationStats {
  totalCodes: number;
  activeCodes: number;
  expiredCodes: number;
  totalUses: number;
  recentActivity: number;
}

export function InvitationStatsCard() {
  const [stats, setStats] = useState<InvitationStats>({
    totalCodes: 0,
    activeCodes: 0, 
    expiredCodes: 0,
    totalUses: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data: invitations, error } = await supabase
        .from('invitation_codes')
        .select('*');

      if (error) throw error;

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const totalCodes = invitations?.length || 0;
      const activeCodes = invitations?.filter(inv => {
        const expiresAt = new Date(inv.expires_at);
        const isExpired = now > expiresAt;
        const isMaxedOut = inv.max_uses && inv.current_uses >= inv.max_uses;
        return !isExpired && !isMaxedOut;
      }).length || 0;
      
      const expiredCodes = totalCodes - activeCodes;
      const totalUses = invitations?.reduce((sum, inv) => sum + (inv.current_uses || 0), 0) || 0;
      
      // Recent activity would be calculated from actual usage logs
      const recentActivity = invitations?.filter(inv => 
        inv.used_at && new Date(inv.used_at) > oneDayAgo
      ).length || 0;

      setStats({
        totalCodes,
        activeCodes,
        expiredCodes, 
        totalUses,
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Codes",
      value: stats.totalCodes,
      icon: Key,
      description: "All invitation codes",
      color: "text-primary"
    },
    {
      title: "Active Codes", 
      value: stats.activeCodes,
      icon: Shield,
      description: "Currently usable",
      color: "text-green-500"
    },
    {
      title: "Total Uses",
      value: stats.totalUses, 
      icon: Users,
      description: "Successful logins",
      color: "text-blue-500"
    },
    {
      title: "Recent Activity",
      value: stats.recentActivity,
      icon: TrendingUp,
      description: "Last 24 hours", 
      color: "text-orange-500"
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                <div className="h-8 bg-muted rounded w-12 mb-2"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              {stat.title === "Active Codes" && stats.expiredCodes > 0 && (
                <Badge variant="outline" className="mt-2">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {stats.expiredCodes} expired
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}