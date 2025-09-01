import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Loader2, TrendingUp, Clock, DollarSign, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/contexts/ProjectContext";

const AIRiskAnalyzer = () => {
  const [analysis, setAnalysis] = useState<string>("");
  const [riskMetrics, setRiskMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedProject } = useProject();
  const { toast } = useToast();

  const analyzeRisks = async () => {
    if (!selectedProject) return;

    setIsLoading(true);
    try {
      // Build risk analysis prompt
      const riskPrompt = `Analyze the risks for this construction project and provide a comprehensive risk assessment:

Project: ${selectedProject.name}
Status: ${selectedProject.status}
Budget: $${selectedProject.budget || 0}
Spent: $${selectedProject.spent || 0}
Progress: ${selectedProject.progress || 0}%
Start Date: ${selectedProject.start_date}
End Date: ${selectedProject.end_date}
Location: ${selectedProject.location}

Please analyze:
1. Budget and financial risks
2. Timeline and scheduling risks  
3. Weather and environmental risks
4. Safety and compliance risks
5. Resource and material risks
6. Quality control risks
7. Stakeholder and communication risks

Provide specific risk levels, mitigation strategies, and actionable recommendations.`;

      const { data, error } = await supabase.functions.invoke('openrouter-assistant', {
        body: { 
          message: riskPrompt 
        }
      });

      if (error) throw error;

      setAnalysis(data.response);
      
      // Set basic risk metrics from project data
      const budgetUtilization = selectedProject.budget ? 
        ((selectedProject.spent || 0) / selectedProject.budget) * 100 : 0;
      
      const isOverBudget = budgetUtilization > 90;
      const isDelayed = selectedProject.progress < 50; // Simple heuristic
      
      setRiskMetrics({
        overdueTasks: 0, // Would need to fetch from tasks table
        budgetUtilization: Math.round(budgetUtilization),
        openSignals: 0,
        riskLevel: isOverBudget ? 'critical' : isDelayed ? 'high' : 'medium'
      });

      toast({
        title: "Risk Analysis Complete",
        description: "AI has analyzed your project risks and provided recommendations."
      });

    } catch (error) {
      console.error('Risk analysis error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze project risks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevel = (metrics: any) => {
    if (!metrics) return 'unknown';
    
    let riskScore = 0;
    if (metrics.overdueTasks > 3) riskScore += 2;
    if (metrics.budgetUtilization > 90) riskScore += 2;
    if (metrics.highPrioritySignals > 2) riskScore += 3;
    if (metrics.daysToDeadline < 30 && metrics.daysToDeadline > 0) riskScore += 1;
    if (metrics.daysToDeadline < 0) riskScore += 3;

    if (riskScore >= 6) return 'critical';
    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  if (!selectedProject) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Select a project to analyze risks
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          AI Risk Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={analyzeRisks} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Risks...
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Analyze Project Risks
            </>
          )}
        </Button>

        {riskMetrics && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Overdue Tasks:</span>
              <Badge variant="outline">{riskMetrics.overdueTasks}</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Budget Used:</span>
              <Badge variant="outline">{riskMetrics.budgetUtilization}%</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Open Issues:</span>
              <Badge variant="outline">{riskMetrics.openSignals}</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Risk Level:</span>
              <Badge variant={getRiskColor(getRiskLevel(riskMetrics))}>
                {getRiskLevel(riskMetrics).toUpperCase()}
              </Badge>
            </div>
          </div>
        )}

        {analysis && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risk Analysis Report
            </h4>
            <div className="text-sm whitespace-pre-wrap text-muted-foreground">
              {analysis}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRiskAnalyzer;