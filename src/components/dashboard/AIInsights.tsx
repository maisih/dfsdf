import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";

const AIInsights = () => {
  const [insights, setInsights] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { selectedProject } = useProject();
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateInsights = async () => {
    if (!selectedProject) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-project-assistant', {
        body: { 
          message: "Provide a brief project status summary with key insights, risks, and recommendations for the dashboard.",
          projectId: selectedProject.id 
        }
      });

      if (error) throw error;

      setInsights(data.response);

    } catch (error) {
      console.error('AI Insights error:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedProject) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Select a project to view AI insights
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Project Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={generateInsights} 
            disabled={isLoading}
            size="sm"
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Get Insights
              </>
            )}
          </Button>
          
          <Button 
            onClick={() => navigate('/ai')} 
            variant="outline"
            size="sm"
          >
            Full AI Suite
          </Button>
        </div>

        {insights && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {insights}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/ai')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-xs">Risk Analysis</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/ai')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-xs">Cost Optimizer</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/ai')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-xs">Progress AI</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;